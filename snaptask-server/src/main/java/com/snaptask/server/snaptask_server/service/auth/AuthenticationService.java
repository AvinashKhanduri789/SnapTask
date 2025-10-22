package com.snaptask.server.snaptask_server.service.auth;

import com.snaptask.server.snaptask_server.dto.auth.*;
import com.snaptask.server.snaptask_server.enums.EmailNotificationType;
import com.snaptask.server.snaptask_server.modals.Role;
import com.snaptask.server.snaptask_server.modals.User;
import com.snaptask.server.snaptask_server.repository.RoleRepository;
import com.snaptask.server.snaptask_server.repository.user.UserRepository;
import com.snaptask.server.snaptask_server.service.email.NotificationEmailService;
import com.snaptask.server.snaptask_server.util.Helper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

@Service
@Slf4j
public class AuthenticationService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final AuthenticationManager authenticationManager;

    private final NotificationEmailService notificationEmailService;

    private final  JwtService jwtService;

    private final Helper helper;

    private final RoleRepository roleRepository;

    public AuthenticationService(
            UserRepository userRepository,
            AuthenticationManager authenticationManager,
            PasswordEncoder passwordEncoder,
            NotificationEmailService notificationEmailService,
            Helper helper,
            JwtService jwtService,
            RoleRepository roleRepository
    ) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.notificationEmailService = notificationEmailService;
        this.helper = helper;
        this.jwtService = jwtService;
        this.roleRepository = roleRepository;
    }

    public ResponseEntity<?> signUp(RegisterUserDto dto) {
        // if email or phone already exists
        if (userRepository.existsByEmail(dto.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body("Email is already registered.");
        }

        if (dto.getPhone() != null && userRepository.existsByPhone(dto.getPhone())) {
            return ResponseEntity
                    .badRequest()
                    .body("Phone number is already registered.");
        }

        // Generate OTP
        String otp = helper.generateVerificationCode();
        Instant otpExpiry = Instant.now().plusSeconds(900);
        Optional<Role> optionalRole = roleRepository.findByName(dto.getRole());

        // Create User entity
        User user = User.builder()
                .name(dto.getUserName())
                .email(dto.getEmail())
                .password(passwordEncoder.encode(dto.getPassword()))
                .role(dto.getRole())
                .roleId(optionalRole.get().getId())
                .phone(dto.getPhone())
                .verificationCode(otp)
                .verificationCodeExpireTime(otpExpiry)
                .enable(false)

                .build();

        userRepository.save(user);

        notificationEmailService.sendNotificationEmail(
                dto.getEmail(),
                EmailNotificationType.ACCOUNT_VERIFICATION,
                otp
        );

        return ResponseEntity.ok("Account created successfully. A verification code has been sent to your email.");
    }

    public ResponseEntity<?> authenticate(LoginUserDto input) {
        try {

            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            input.getEmail(),
                            input.getPassword()
                    )
            );

            User user = userRepository.findByEmail(input.getEmail())
                    .orElseThrow(() -> new BadCredentialsException("Invalid email or password."));


            if (!user.isEnabled()) {
                throw new DisabledException("Account is not verified. Please verify your email first.");
            }


            String token = jwtService.generateToken(user);
            long expiry = jwtService.getExpirationTime();


            LoginResponseDto response = LoginResponseDto.builder()
                    .name(user.getName())
                    .email(user.getEmail())
                    .phone(user.getPhone())
                    .workplace(user.getWorkplace())
                    .role(user.getRole().name())
                    .token(token)
                    .tokenExpiry(expiry)
                    .build();

            return ResponseEntity.ok(response);

        } catch (BadCredentialsException ex) {
            log.warn("Invalid login attempt for email: {}", input.getEmail());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid email or password.");

        } catch (DisabledException ex) {
            log.warn("Attempted login for unverified account: {}", input.getEmail());
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Account is not verified. Please verify your email first.");

        } catch (Exception ex) {
            log.error("Unexpected authentication error for {}: {}", input.getEmail(), ex.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Internal authentication error. Please try again later.");
        }
    }

    public ResponseEntity<?> verifyUser(VerifyUserDto dto) {
        // Find user directly — no need for existsByEmail (reduces DB calls)
        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("No user registered with email: " + dto.getEmail()));


        if (user.isEnabled()) {
            return ResponseEntity.ok("Account already verified. You can log in now.");
        }


        if (user.getVerificationCode() == null || !user.getVerificationCode().equals(dto.getOtp())) {
            return ResponseEntity.badRequest().body("Invalid verification code.");
        }


        if (user.getVerificationCodeExpireTime() == null || Instant.now().isAfter(user.getVerificationCodeExpireTime())) {
            return ResponseEntity.status(HttpStatus.GONE).body("Verification code has expired. Please request a new one.");
        }


        user.setVerificationCode(null);
        user.setVerificationCodeExpireTime(null);
        user.setEnable(true);
        userRepository.save(user);

        log.info("User verified successfully: {}", dto.getEmail());

        return ResponseEntity.ok("Your account has been activated successfully.");
    }

    public ResponseEntity<?> resendVerificationCode(String email) {

        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body("Email must not be blank.");
        }


        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("No user found with email: " + email));


        if (user.isEnabled()) {
            return ResponseEntity.badRequest().body("Account is already verified. Please log in.");
        }


        if (user.getVerificationCodeExpireTime() != null &&
                user.getVerificationCodeExpireTime().isAfter(Instant.now())) {
            return ResponseEntity.badRequest().body("Please wait before requesting a new verification code.");
        }


        String newCode = helper.generateVerificationCode();
        user.setVerificationCode(newCode);
        user.setVerificationCodeExpireTime(Instant.now().plus(10, ChronoUnit.MINUTES));


        userRepository.save(user);


         notificationEmailService.sendNotificationEmail(email,EmailNotificationType.ACCOUNT_VERIFICATION,newCode);


        return ResponseEntity.ok("A new verification code has been sent to your email.");
    }

    public ResponseEntity<?> requestPasswordReset(String email) {
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body("Email must not be blank.");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("No user found with email: " + email));

        if (!user.isEnabled()) {
            return ResponseEntity.badRequest().body("Account is not verified. Please verify your email first.");
        }

        // Throttle resends to prevent abuse
        if (user.getVerificationCodeExpireTime() != null &&
                user.getVerificationCodeExpireTime().isAfter(Instant.now())) {
            return ResponseEntity.badRequest().body("Please wait before requesting a new reset code.");
        }

        String resetCode = helper.generateVerificationCode(); // 6-digit numeric code
        user.setVerificationCode(resetCode);
        user.setVerificationCodeExpireTime(Instant.now().plus(10, ChronoUnit.MINUTES));
        userRepository.save(user);

        notificationEmailService.sendNotificationEmail(email,EmailNotificationType.PASSWORD_RESET,resetCode);
        return ResponseEntity.ok("A password reset code has been sent to your registered email.");
    }

    public ResponseEntity<?> verifyPasswordResetCode(String email, String code) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid email."));

        if (user.getVerificationCode() == null ||
                user.getVerificationCodeExpireTime() == null ||
                user.getVerificationCodeExpireTime().isBefore(Instant.now())) {
            return ResponseEntity.badRequest().body("Reset code has expired or is invalid.");
        }

        if (!user.getVerificationCode().equals(code)) {
            return ResponseEntity.badRequest().body("Incorrect verification code.");
        }

        return ResponseEntity.ok("Code verified successfully. You can now reset your password.");
    }

    public ResponseEntity<?> resetPassword(ResetPasswordDto dto) {
        log.info("Initiating password reset for {}", dto.getEmail());

        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("No user found with email: " + dto.getEmail()));

        // Validate verification code existence
        if (user.getVerificationCode() == null || user.getVerificationCodeExpireTime() == null) {
            log.warn("No active password reset request for {}", dto.getEmail());
            return ResponseEntity.badRequest().body("No active password reset request found. Please request again.");
        }

        // Validate code expiration
        if (user.getVerificationCodeExpireTime().isBefore(Instant.now())) {
            log.warn("Verification code expired for {}", dto.getEmail());
            return ResponseEntity.badRequest().body("Verification code has expired. Please request a new one.");
        }

        // ✅ Proceed to update password
        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        user.setVerificationCode(null);
        user.setVerificationCodeExpireTime(null);

        userRepository.save(user);
        log.info("Password successfully reset for {}", dto.getEmail());
        notificationEmailService.sendNotificationEmail(dto.getEmail(),EmailNotificationType.PASSWORD_RESET_COMPLETED,null);

        return ResponseEntity.ok("Password has been reset successfully.");
    }

}

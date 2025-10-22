package com.snaptask.server.snaptask_server.controller.auth;

import com.snaptask.server.snaptask_server.dto.auth.*;
import com.snaptask.server.snaptask_server.service.auth.AuthenticationService;
import com.snaptask.server.snaptask_server.service.auth.JwtService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    public AuthenticationController(JwtService jwtService, AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterUserDto registerUserDto) {
      return authenticationService.signUp(registerUserDto);
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticate(@Valid @RequestBody LoginUserDto loginUserDto) {
        return  authenticationService.authenticate(loginUserDto);
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyUser(@Valid @RequestBody VerifyUserDto dto) {
        return authenticationService.verifyUser(dto);
    }

    @PostMapping("verify/resend-verification")
    public ResponseEntity<?> resendVerificationCode(@Valid @RequestBody CommonDto dto) {
        return authenticationService.resendVerificationCode(dto.getEmail());
    }

    @PostMapping("/password-reset/request")
    public ResponseEntity<?> requestPasswordReset(@Valid @RequestBody CommonDto dto) {
        return authenticationService.requestPasswordReset(dto.getEmail());
    }

    @PostMapping("/password-reset/verify")
    public ResponseEntity<?> verifyPasswordResetCode(@Valid @RequestBody CommonDto dto) {
        return authenticationService.verifyPasswordResetCode(dto.getEmail(), dto.getCode());
    }

    @PostMapping("/password-reset")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordDto dto) {
        return authenticationService.resetPassword(dto);
    }
}

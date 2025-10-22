package com.snaptask.server.snaptask_server.util;

import com.snaptask.server.snaptask_server.modals.User;
import com.snaptask.server.snaptask_server.repository.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import java.util.Random;

@Component
public class Helper {
    private final UserRepository userRepository;

    public Helper(UserRepository userRepository){
        this.userRepository  = userRepository;
    }
    public String generateVerificationCode() {
        Random random = new Random();
        int code = random.nextInt(900000) + 100000;
        return String.valueOf(code);
    }

    public User getCurrentLoggedInUser() {
        var context = SecurityContextHolder.getContext();
        if (context == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Security context is missing. User may not be authenticated.");
        }

        Authentication authentication = context.getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "No authenticated user found in security context.");
        }

        String email = authentication.getName();
        if (email == null || email.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authenticated user has no email set.");
        }

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "User with email '" + email + "' not found."));
    }
}

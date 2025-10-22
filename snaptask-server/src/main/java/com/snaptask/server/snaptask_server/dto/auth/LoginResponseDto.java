package com.snaptask.server.snaptask_server.dto.auth;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

/**
 * Lightweight, immutable DTO representing user data returned after login.
 *
 * Optimized for:
 * - Fast serialization (no nested heavy objects)
 * - Clean structure for mobile/web clients
 * - Easy mapping from User entity and JWT token
 */
@Getter
@Builder
@ToString
public class LoginResponseDto {


    private final String name;


    private final String email;


    private final String phone;


    private final String workplace;


    private final String role;


    private final String token;


    private final long tokenExpiry;
}

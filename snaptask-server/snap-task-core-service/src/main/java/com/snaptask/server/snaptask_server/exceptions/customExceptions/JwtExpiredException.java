package com.snaptask.server.snaptask_server.exceptions.customExceptions;

public class JwtExpiredException extends RuntimeException {
    public JwtExpiredException(String message) {
        super(message);
    }
}


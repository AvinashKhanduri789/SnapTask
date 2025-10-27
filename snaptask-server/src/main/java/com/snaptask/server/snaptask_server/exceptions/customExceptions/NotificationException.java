package com.snaptask.server.snaptask_server.exceptions.customExceptions;

/**
 * Custom runtime exception for notification failures.
 */
public class NotificationException extends RuntimeException {
    public NotificationException(String message, Throwable cause) {
        super(message, cause);
    }
}
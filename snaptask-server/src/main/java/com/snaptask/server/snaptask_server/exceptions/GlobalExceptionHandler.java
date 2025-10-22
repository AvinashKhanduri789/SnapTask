package com.snaptask.server.snaptask_server.exceptions;

import com.snaptask.server.snaptask_server.exceptions.customExceptions.ResourceNotFoundException;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AccountStatusException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.Set;
import java.util.stream.Collectors;

@ControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    // ---------------- Utility ----------------
    private ProblemDetail baseProblem(HttpStatus status, String title, String detail, HttpServletRequest request) {
        ProblemDetail pd = ProblemDetail.forStatusAndDetail(status, detail);
        pd.setTitle(title);
        pd.setProperty("timestamp", Instant.now().toString());
        pd.setProperty("path", request != null ? request.getRequestURI() : "N/A");
        return pd;
    }

    // ---------------- Security Exceptions ----------------
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ProblemDetail> handleBadCredentials(BadCredentialsException ex, HttpServletRequest request) {
        log.warn("Bad credentials error: {}", ex.getMessage(), ex);
        ProblemDetail pd = baseProblem(HttpStatus.UNAUTHORIZED,
                "Authentication Failed",
                "Invalid username or password. Please try again.",
                request);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(pd);
    }

    @ExceptionHandler(AccountStatusException.class)
    public ResponseEntity<ProblemDetail> handleAccountStatus(AccountStatusException ex, HttpServletRequest request) {
        log.warn("Account status issue: {}", ex.getMessage(), ex);
        ProblemDetail pd = baseProblem(HttpStatus.FORBIDDEN,
                "Account Disabled",
                "Your account is locked or disabled. Please contact support.",
                request);
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(pd);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ProblemDetail> handleAccessDenied(AccessDeniedException ex, HttpServletRequest request) {
        log.warn("Access denied: {}", ex.getMessage(), ex);
        ProblemDetail pd = baseProblem(HttpStatus.FORBIDDEN,
                "Access Denied",
                "You are not authorized to access this resource.",
                request);
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(pd);
    }

    // ---------------- JWT Exceptions ----------------
    @ExceptionHandler({ SignatureException.class, JwtException.class })
    public ResponseEntity<ProblemDetail> handleJwtInvalid(RuntimeException ex, HttpServletRequest request) {
        log.warn("Invalid JWT token detected: {}", ex.getMessage(), ex);
        ProblemDetail pd = baseProblem(HttpStatus.UNAUTHORIZED,
                "Invalid Token",
                "Your authentication token is invalid. Please log in again.",
                request);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(pd);
    }

    @ExceptionHandler(ExpiredJwtException.class)
    public ResponseEntity<ProblemDetail> handleJwtExpired(ExpiredJwtException ex, HttpServletRequest request) {
        log.info("Expired JWT token at {}: {}", request.getRequestURI(), ex.getMessage(), ex);
        ProblemDetail pd = baseProblem(HttpStatus.UNAUTHORIZED,
                "Token Expired",
                "Your session has expired. Please sign in again.",
                request);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(pd);
    }

    // ---------------- HTTP Method Not Supported ----------------
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ProblemDetail> handleMethodNotSupported(HttpRequestMethodNotSupportedException ex, HttpServletRequest request) {
        String attempted = ex.getMethod();
        Set<String> allowed = ex.getSupportedHttpMethods() != null
                ? ex.getSupportedHttpMethods().stream().map(HttpMethod::name).collect(Collectors.toSet())
                : Set.of();

        log.warn("HTTP method not supported: attempted={} allowed={}", attempted, allowed, ex);

        ProblemDetail pd = baseProblem(HttpStatus.METHOD_NOT_ALLOWED,
                "Method Not Allowed",
                "The HTTP method '" + attempted + "' is not supported for this endpoint.",
                request);
        pd.setProperty("allowedMethods", allowed);

        HttpHeaders headers = new HttpHeaders();
        if (!allowed.isEmpty()) headers.set("Allow", String.join(", ", allowed));

        return new ResponseEntity<>(pd, headers, HttpStatus.METHOD_NOT_ALLOWED);
    }

    // ---------------- Validation Exceptions ----------------
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ProblemDetail> handleValidationException(MethodArgumentNotValidException ex, HttpServletRequest request) {
        String errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(this::formatFieldError)
                .collect(Collectors.joining("; "));

        log.debug("Validation failed: {}", errors, ex);

        ProblemDetail pd = baseProblem(HttpStatus.BAD_REQUEST,
                "Validation Failed",
                "Some fields contain invalid or missing values.",
                request);
        pd.setProperty("invalidFields", errors);
        return ResponseEntity.badRequest().body(pd);
    }

    private String formatFieldError(FieldError fe) {
        return fe.getField() + ": " + fe.getDefaultMessage();
    }

    // ---------------- ResponseStatusException ----------------
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ProblemDetail> handleResponseStatusException(ResponseStatusException ex, HttpServletRequest request) {
        log.warn("ResponseStatusException: {}", ex.getReason(), ex);
        ProblemDetail pd = baseProblem(HttpStatus.valueOf(ex.getStatusCode().value()),
                "Request Error",
                "Request could not be completed due to client or server constraints.",
                request);
        return ResponseEntity.status(ex.getStatusCode()).body(pd);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ProblemDetail> handleIllegalArgumentException(IllegalArgumentException ex, HttpServletRequest request) {
        log.warn("Illegal argument: {}", ex.getMessage(), ex);
        ProblemDetail pd = baseProblem(HttpStatus.BAD_REQUEST,
                "Invalid Request",
                "Your request contains invalid parameters.",
                request);
        return ResponseEntity.badRequest().body(pd);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ProblemDetail handleResourceNotFound(ResourceNotFoundException ex) {
        ProblemDetail errorDetail = ProblemDetail.forStatusAndDetail(
                HttpStatus.NOT_FOUND,
                "The requested resource could not be found."
        );
        // For debugging/observability
        ex.printStackTrace();

        // Add a meaningful description
        errorDetail.setProperty("description", ex.getMessage());
        return errorDetail;
    }
    // ---------------- Generic Exceptions (Fallback) ----------------
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ProblemDetail> handleGenericException(Exception ex, HttpServletRequest request) {
        log.error("Unhandled server error for request {}: {}", request.getRequestURI(), ex.getMessage(), ex);
        ProblemDetail pd = baseProblem(HttpStatus.INTERNAL_SERVER_ERROR,
                "Server Error",
                "An unexpected error occurred. Please try again later or contact support.",
                request);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(pd);
    }
}

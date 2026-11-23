package com.example.authservice.exception;

import com.example.authservice.dto.response.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<ErrorResponse> handleUserAlreadyExists(UserAlreadyExistsException ex) {
        ErrorResponse error = ErrorResponse.builder()
                .success(false)
                .message(ex.getMessage())
                .status(HttpStatus.CONFLICT.value())
                .errorCode("USER_ALREADY_EXISTS")
                .timestamp(Instant.now())
                .build();
        return new ResponseEntity<>(error, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFound(ResourceNotFoundException ex) {
        ErrorResponse error = ErrorResponse.builder()
                .success(false)
                .message(ex.getMessage())
                .status(HttpStatus.NOT_FOUND.value())
                .errorCode("RESOURCE_NOT_FOUND")
                .timestamp(Instant.now())
                .build();
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        ErrorResponse error = ErrorResponse.builder()
                .success(false)
                .message("Validation failed")
                .status(HttpStatus.BAD_REQUEST.value())
                .errorCode("VALIDATION_ERROR")
                .errors(errors)
                .timestamp(Instant.now())
                .build();
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGlobalException(Exception ex) {
        // YEH ADD KARO (Console me pura error dikhne ke liye)
        ex.printStackTrace();

        ErrorResponse error = ErrorResponse.builder()
                .success(false)
                // Asli error message dikhane ke liye
                .message(ex.getMessage() != null ? ex.getMessage() : "An unexpected error occurred. Please try again later.")
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .errorCode("INTERNAL_SERVER_ERROR")
                .timestamp(Instant.now())
                .build();
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(AccountLockedException.class)
    public ResponseEntity<ErrorResponse> handleAccountLocked(AccountLockedException ex) {
        ErrorResponse error = ErrorResponse.builder()
                .success(false)
                .message(ex.getMessage())
                .status(HttpStatus.LOCKED.value())
                .errorCode("ACCOUNT_LOCKED")
                .timestamp(Instant.now())
                .build();
        return new ResponseEntity<>(error, HttpStatus.LOCKED);
    }

    @ExceptionHandler(TokenException.class)
    public ResponseEntity<ErrorResponse> handleTokenException(TokenException ex) {
        ErrorResponse error = ErrorResponse.builder()
                .success(false)
                .message(ex.getMessage())
                .status(HttpStatus.UNAUTHORIZED.value())
                .errorCode("INVALID_TOKEN")
                .timestamp(Instant.now())
                .build();
        return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(org.springframework.security.authentication.BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentials(org.springframework.security.authentication.BadCredentialsException ex) {
        ErrorResponse error = ErrorResponse.builder()
                .success(false)
                .message(ex.getMessage())
                .status(HttpStatus.UNAUTHORIZED.value())
                .errorCode("INVALID_CREDENTIALS")
                .timestamp(Instant.now())
                .build();
        return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(org.springframework.security.access.AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDenied(org.springframework.security.access.AccessDeniedException ex) {
        ErrorResponse error = ErrorResponse.builder()
                .success(false)
                .message("Access Denied: You do not have permission to access this resource.")
                .status(HttpStatus.FORBIDDEN.value())
                .errorCode("ACCESS_DENIED")
                .timestamp(Instant.now())
                .build();
        return new ResponseEntity<>(error, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(org.springframework.security.authorization.AuthorizationDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAuthorizationDenied(org.springframework.security.authorization.AuthorizationDeniedException ex) {
        ErrorResponse error = ErrorResponse.builder()
                .success(false)
                .message("Access Denied: You do not have permission to access this resource.")
                .status(HttpStatus.FORBIDDEN.value())
                .errorCode("ACCESS_DENIED")
                .timestamp(Instant.now())
                .build();
        return new ResponseEntity<>(error, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(RateLimitExceededException.class)
    public ResponseEntity<ErrorResponse> handleRateLimitExceeded(RateLimitExceededException ex) {
        ErrorResponse error = ErrorResponse.builder()
                .success(false)
                .message(ex.getMessage())
                .status(HttpStatus.TOO_MANY_REQUESTS.value())
                .errorCode("RATE_LIMIT_EXCEEDED")
                .timestamp(Instant.now())
                .build();
        return new ResponseEntity<>(error, HttpStatus.TOO_MANY_REQUESTS);
    }

    @ExceptionHandler(AuthException.class)
    public ResponseEntity<ErrorResponse> handleAuthException(AuthException ex) {
        ErrorResponse error = ErrorResponse.builder()
                .success(false)
                .message(ex.getMessage())
                .status(ex.getStatus().value())
                .errorCode(ex.getErrorCode())
                .timestamp(Instant.now())
                .build();
        return new ResponseEntity<>(error, ex.getStatus());
    }
}
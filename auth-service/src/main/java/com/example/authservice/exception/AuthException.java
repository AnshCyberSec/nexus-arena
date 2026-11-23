package com.example.authservice.exception;

import org.springframework.http.HttpStatus;

public class AuthException extends RuntimeException {

    private final HttpStatus status;
    private final String errorCode;

    public AuthException(String message, HttpStatus status, String errorCode) {
        super(message);
        this.status = status;
        this.errorCode = errorCode;
    }

    public AuthException(String message, HttpStatus status, String errorCode, Throwable cause) {
        super(message, cause);
        this.status = status;
        this.errorCode = errorCode;
    }

    public HttpStatus getStatus() {
        return status;
    }

    public String getErrorCode() {
        return errorCode;
    }
}
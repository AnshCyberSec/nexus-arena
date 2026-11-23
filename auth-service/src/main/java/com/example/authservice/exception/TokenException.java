package com.example.authservice.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.UNAUTHORIZED) // 401 Unauthorized
public class TokenException extends RuntimeException {

    public TokenException(String message) {
        super(message);
    }
}
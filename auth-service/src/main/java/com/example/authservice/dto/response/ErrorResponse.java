package com.example.authservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponse {
    private boolean success;
    private String message;
    private int status;
    private String errorCode;
    private Instant timestamp;

    private Map<String, String> errors;
}
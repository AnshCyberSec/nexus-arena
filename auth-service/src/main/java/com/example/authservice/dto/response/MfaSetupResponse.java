package com.example.authservice.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MfaSetupResponse {
    private String secret;
    private String qrCodeImageUri; // Base64 Data URI for frontend to render
}
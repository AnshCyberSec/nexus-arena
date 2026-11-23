package com.example.authservice.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MfaVerifyRequest {

    @NotBlank(message = "MFA code is required")
    @Pattern(regexp = "^\\d{6}$", message = "MFA code must be exactly 6 digits")
    private String code;
}
package com.example.authservice.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OtpVerificationRequest {

    @NotBlank(message = "OTP code is required")
    @Pattern(regexp = "^\\d{6}$", message = "OTP must be exactly 6 digits")
    private String code;

    @NotBlank(message = "Purpose is required")
    @Size(max = 50, message = "Purpose must not exceed 50 characters")
    private String purpose;
}
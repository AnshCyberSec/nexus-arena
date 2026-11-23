package com.example.authservice.controller;

import com.example.authservice.dto.request.OtpVerificationRequest;
import com.example.authservice.dto.response.ApiResponse;
import com.example.authservice.security.userdetails.CustomUserDetails;
import com.example.authservice.service.OtpService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/otp")
public class OtpController {

    private final OtpService otpService;

    public OtpController(OtpService otpService) {
        this.otpService = otpService;
    }


    @PostMapping("/send")
    public ResponseEntity<ApiResponse<Void>> sendOtp(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam String purpose) {

        otpService.generateAndSendOtp(userDetails.getUser(), purpose);

        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("OTP sent successfully to your email")
                .build());
    }


    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<Void>> verifyOtp(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody OtpVerificationRequest request) {

        boolean success = otpService.verifyOtp(
                userDetails.getUser(),
                request.getPurpose(),
                request.getCode()
        );

        if (!success) {
            return ResponseEntity.badRequest().body(ApiResponse.<Void>builder()
                    .success(false)
                    .message("Invalid OTP code")
                    .errorCode("INVALID_OTP")
                    .build());
        }

        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("OTP verified successfully")
                .build());
    }
}
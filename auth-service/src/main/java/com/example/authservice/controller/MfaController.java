package com.example.authservice.controller;

import com.example.authservice.dto.request.MfaVerifyRequest;
import com.example.authservice.dto.response.ApiResponse;
import com.example.authservice.dto.response.MfaSetupResponse;
import com.example.authservice.entity.User;
import com.example.authservice.security.userdetails.CustomUserDetails;
import com.example.authservice.service.MfaService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/mfa")
public class MfaController {

    private final MfaService mfaService;

    public MfaController(MfaService mfaService) {
        this.mfaService = mfaService;
    }

    @PostMapping("/setup")
    public ResponseEntity<ApiResponse<MfaSetupResponse>> setupMfa(@AuthenticationPrincipal CustomUserDetails userDetails) {
        MfaSetupResponse response = mfaService.generateMfaSetup(userDetails.getUser());
        return ResponseEntity.ok(ApiResponse.<MfaSetupResponse>builder()
                .success(true)
                .message("Scan the QR code with Google Authenticator, then verify with a 6-digit code")
                .data(response)
                .build());
    }

    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<Void>> verifyMfa(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                       @Valid @RequestBody MfaVerifyRequest request) {
        boolean success = mfaService.verifyAndEnableMfa(userDetails.getUser(), request.getCode());

        if (!success) {
            return ResponseEntity.badRequest().body(ApiResponse.<Void>builder()
                    .success(false)
                    .message("Invalid MFA code")
                    .build());
        }

        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("MFA enabled successfully")
                .build());
    }

    @PostMapping("/disable")
    public ResponseEntity<ApiResponse<Void>> disableMfa(@AuthenticationPrincipal CustomUserDetails userDetails) {
        mfaService.disableMfa(userDetails.getUser());
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("MFA disabled successfully")
                .build());
    }
}
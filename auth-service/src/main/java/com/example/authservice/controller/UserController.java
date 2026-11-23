package com.example.authservice.controller;

import com.example.authservice.dto.request.ChangeEmailRequest;
import com.example.authservice.dto.request.ChangePasswordRequest;
import com.example.authservice.dto.response.ApiResponse;
import com.example.authservice.security.userdetails.CustomUserDetails;
import com.example.authservice.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/change-password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody ChangePasswordRequest request) {

        userService.changePassword(userDetails.getUser(), request);

        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("Password changed successfully. Please login again on all devices.")
                .build());
    }

    @PostMapping("/change-email")
    public ResponseEntity<ApiResponse<Void>> changeEmail(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody ChangeEmailRequest request) {

        userService.changeEmail(userDetails.getUser(), request);

        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("Email updated. Please verify your new email address.")
                .build());
    }
}
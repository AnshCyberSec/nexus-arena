package com.example.authservice.service;

import com.example.authservice.dto.request.*;
import com.example.authservice.dto.response.AuthResponse;

public interface AuthService {
    void register(RegisterRequest request, String ipAddress);

    AuthResponse login(LoginRequest request, String ipAddress, String userAgent);

    void logout(LogoutRequest request);

    AuthResponse verifyMfaLogin(MfaVerifyLoginRequest request);

    // Naye methods jo Controller call kar raha hai
    void verifyEmail(VerifyEmailRequest request);

    void forgotPassword(ForgotPasswordRequest request);

    void resetPassword(ResetPasswordRequest request);
}
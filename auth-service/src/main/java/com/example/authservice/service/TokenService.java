package com.example.authservice.service;

import com.example.authservice.dto.request.RefreshTokenRequest;
import com.example.authservice.dto.response.AuthResponse;
import com.example.authservice.entity.User;

public interface TokenService {
    AuthResponse generateAuthResponse(User user, boolean mfaVerified);

    AuthResponse refreshToken(RefreshTokenRequest request);
}

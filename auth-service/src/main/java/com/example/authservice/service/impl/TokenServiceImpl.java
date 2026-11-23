package com.example.authservice.service.impl;

import com.example.authservice.dto.request.RefreshTokenRequest;
import com.example.authservice.dto.response.AuthResponse;
import com.example.authservice.dto.response.UserResponse;
import com.example.authservice.entity.RefreshToken;
import com.example.authservice.entity.User;
import com.example.authservice.exception.TokenException;
import com.example.authservice.mapper.UserMapper;
import com.example.authservice.repository.RefreshTokenRepository;
import com.example.authservice.repository.UserRepository;
import com.example.authservice.security.jwt.JwtProvider;
import com.example.authservice.service.TokenService;
import com.example.authservice.util.CryptoUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
public class TokenServiceImpl implements TokenService {

    private final JwtProvider jwtProvider;
    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public TokenServiceImpl(JwtProvider jwtProvider,
                            RefreshTokenRepository refreshTokenRepository,
                            UserRepository userRepository,
                            UserMapper userMapper) {
        this.jwtProvider = jwtProvider;
        this.refreshTokenRepository = refreshTokenRepository;
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    @Override
    @Transactional
    public AuthResponse generateAuthResponse(User user, boolean mfaVerified) {
        // 1. Generate JWT Access Token
        String accessToken = jwtProvider.generateAccessToken(user, mfaVerified);

        // 2. Generate Opaque Refresh Token (random string)
        String rawRefreshToken = CryptoUtils.generateSecureToken();
        String refreshTokenHash = CryptoUtils.hashSha256(rawRefreshToken);

        // 3. Save hashed refresh token to DB
        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .tokenHash(refreshTokenHash)
                .familyId(UUID.randomUUID()) // new family on login
                .expiresAt(Instant.now().plus(7, ChronoUnit.DAYS))
                .revoked(false)
                .build();
        refreshTokenRepository.save(refreshToken);

        // 4. Build response
        UserResponse userResponse = userMapper.toResponse(user);
        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(rawRefreshToken)
                .tokenType("Bearer")
                .expiresIn(15 * 60) // 15 minutes in seconds
                .user(userResponse)
                .build();
    }

    @Override
    @Transactional
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        String rawToken = request.getRefreshToken();
        String tokenHash = CryptoUtils.hashSha256(rawToken);

        RefreshToken storedToken = refreshTokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> new TokenException("Invalid refresh token"));

        // 1. Reuse Detection: If this token is revoked, revoke entire family
        if (storedToken.isRevoked()) {
            refreshTokenRepository.revokeAllByFamilyId(storedToken.getFamilyId());
            throw new TokenException("Token reuse detected. All sessions revoked.");
        }

        // 2. Expiry Check
        if (storedToken.isExpired()) {
            throw new TokenException("Refresh token expired. Please login again.");
        }

        User user = storedToken.getUser();

        // 3. Rotate: Mark old token revoked
        storedToken.setRevoked(true);
        refreshTokenRepository.save(storedToken);

        // 4. Generate new refresh token in same family
        String newRawToken = CryptoUtils.generateSecureToken();
        RefreshToken newRefreshToken = RefreshToken.builder()
                .user(user)
                .tokenHash(CryptoUtils.hashSha256(newRawToken))
                .familyId(storedToken.getFamilyId()) // same family
                .expiresAt(Instant.now().plus(7, ChronoUnit.DAYS))
                .build();
        refreshTokenRepository.save(newRefreshToken);

        // 5. Link old to new (for audit)
        storedToken.setReplacedByToken(CryptoUtils.hashSha256(newRawToken));
        refreshTokenRepository.save(storedToken);

        // 6. Generate new access token
        String newAccessToken = jwtProvider.generateAccessToken(user, user.isMfaEnabled()); // assume mfa=true for refresh

        UserResponse userResponse = userMapper.toResponse(user);
        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRawToken)
                .tokenType("Bearer")
                .expiresIn(15 * 60)
                .user(userResponse)
                .build();
    }
}
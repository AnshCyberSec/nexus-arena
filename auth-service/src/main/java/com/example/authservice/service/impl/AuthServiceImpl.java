package com.example.authservice.service.impl;

import com.example.authservice.dto.request.*;
import com.example.authservice.dto.response.AuthResponse;
import com.example.authservice.entity.*;
import com.example.authservice.enums.AccountStatus;
import com.example.authservice.enums.AuditEventType;
import com.example.authservice.enums.RoleName;
import com.example.authservice.exception.AccountLockedException;
import com.example.authservice.exception.ResourceNotFoundException;
import com.example.authservice.exception.TokenException;
import com.example.authservice.exception.UserAlreadyExistsException;
import com.example.authservice.repository.*;
import com.example.authservice.security.jwt.JwtProvider;
import com.example.authservice.service.*;
import com.example.authservice.util.CryptoUtils;
import io.jsonwebtoken.Claims;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Set;
import java.util.UUID;

@Service
public class AuthServiceImpl implements AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthServiceImpl.class);
    private static final int MAX_FAILED_ATTEMPTS = 5;

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final EmailVerificationTokenRepository emailVerificationTokenRepository;
    private final LoginAttemptRepository loginAttemptRepository;
    private final RefreshTokenRepository refreshTokenRepository; // <-- YEH ADD KARO
    private final PasswordEncoder passwordEncoder;
    private final AuditService auditService;
    private final EmailService emailService;
    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;
    private final MfaService mfaService;
    private final JwtProvider jwtProvider;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final LoginAttemptService loginAttemptService;

    public AuthServiceImpl(UserRepository userRepository,
                           RoleRepository roleRepository,
                           EmailVerificationTokenRepository emailVerificationTokenRepository,
                           LoginAttemptRepository loginAttemptRepository,
                           RefreshTokenRepository refreshTokenRepository,
                           PasswordEncoder passwordEncoder,
                           AuditService auditService,
                           EmailService emailService,
                           AuthenticationManager authenticationManager,
                           TokenService tokenService,MfaService mfaService,JwtProvider jwtProvider,PasswordResetTokenRepository passwordResetTokenRepository,LoginAttemptService loginAttemptService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.emailVerificationTokenRepository = emailVerificationTokenRepository;
        this.loginAttemptRepository = loginAttemptRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.auditService = auditService;
        this.emailService = emailService;
        this.authenticationManager = authenticationManager;
        this.tokenService = tokenService;
        this.mfaService = mfaService;
        this.jwtProvider = jwtProvider;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.loginAttemptService = loginAttemptService;
    }

    @Override
    @Transactional
    public void register(RegisterRequest request, String ipAddress) {
        String normalizedEmail = request.getEmail().toLowerCase().trim();

        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new UserAlreadyExistsException("Email is already registered");
        }

        Role userRole = roleRepository.findByName(RoleName.ROLE_USER)
                .orElseThrow(() -> new ResourceNotFoundException("Default role not found"));

        User newUser = User.builder()
                .email(normalizedEmail)
                .fullName(request.getFullName())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .roles(Set.of(userRole))
                .build();

        userRepository.save(newUser);

        String rawToken = CryptoUtils.generateSecureToken();
        EmailVerificationToken verificationToken = EmailVerificationToken.builder()
                .user(newUser)
                .tokenHash(CryptoUtils.hashSha256(rawToken))
                .expiresAt(Instant.now().plus(24, ChronoUnit.HOURS))
                .build();
        emailVerificationTokenRepository.save(verificationToken);

        auditService.logEvent(newUser.getId(), AuditEventType.USER_REGISTERED, ipAddress, "{\"method\": \"EMAIL_PASSWORD\"}");
        emailService.sendVerificationEmail(normalizedEmail, rawToken);
        log.info("User registered successfully: {}", normalizedEmail);
    }

    @Override
    @Transactional
    public AuthResponse login(LoginRequest request, String ipAddress, String userAgent) {
        String normalizedEmail = request.getEmail().toLowerCase().trim();

        User user = userRepository.findByEmailWithRoles(normalizedEmail)
                .orElseThrow(() -> {
                    loginAttemptRepository.save(new LoginAttempt(normalizedEmail, ipAddress, userAgent, false, "USER_NOT_FOUND"));
                    return new BadCredentialsException("Invalid email or password");
                });

        // 1. CHECK LOCK STATUS FIRST (Before authentication)
        if (user.getStatus() == AccountStatus.LOCKED || (user.getLockedUntil() != null && user.getLockedUntil().isAfter(Instant.now()))) {
            throw new AccountLockedException("Account is locked. Please contact support or wait 15 minutes.");
        }

        // 2. Check email verified
        if (!user.isEmailVerified()) {
            throw new BadCredentialsException("Email is not verified. Please check your inbox.");
        }

        try {
            // 3. Authenticate
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(normalizedEmail, request.getPassword())
            );

            // 4. Reset failed attempts on success
            if (user.getFailedAttempts() > 0) {
                user.setFailedAttempts(0);
                user.setLockedUntil(null);
                userRepository.save(user);
            }

            // 5. MFA check (if enabled)
            if (user.isMfaEnabled()) {
                String mfaToken = jwtProvider.generateAccessToken(user, false);
                auditService.logEvent(user.getId(), AuditEventType.LOGIN_SUCCESS, ipAddress, "{\"mfa_required\": true}");
                return AuthResponse.builder()
                        .mfaRequired(true)
                        .mfaToken(mfaToken)
                        .build();
            }

            // 6. Normal login
            loginAttemptRepository.save(new LoginAttempt(normalizedEmail, ipAddress, userAgent, true, "SUCCESS"));
            auditService.logEvent(user.getId(), AuditEventType.LOGIN_SUCCESS, ipAddress, "{\"userAgent\": \"" + userAgent + "\"}");
            return tokenService.generateAuthResponse(user, false);

        } catch (AuthenticationException e) {
            loginAttemptService.handleFailedLogin(user, normalizedEmail, ipAddress, userAgent);
            throw new BadCredentialsException("Invalid email or password");
        }
    }

    @Override
    @Transactional
    public AuthResponse verifyMfaLogin(MfaVerifyLoginRequest request) {

        io.jsonwebtoken.Claims claims = jwtProvider.validateAndParseToken(request.getMfaToken());
        String userId = claims.getSubject();

        User user = userRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new BadCredentialsException("User not found"));

        if (!user.isMfaEnabled()) {
            throw new BadCredentialsException("MFA is not enabled for this account");
        }


        if (!mfaService.verifyMfaCode(user, request.getCode())) {
            throw new BadCredentialsException("Invalid MFA code");
        }


        return tokenService.generateAuthResponse(user, true);
    }
    @Override
    @Transactional
    public void logout(LogoutRequest request) {
        String tokenHash = CryptoUtils.hashSha256(request.getRefreshToken());

        RefreshToken storedToken = refreshTokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> new TokenException("Invalid refresh token"));

        storedToken.setRevoked(true);
        refreshTokenRepository.save(storedToken);

        auditService.logEvent(storedToken.getUser().getId(), AuditEventType.LOGOUT_ALL_DEVICES, "0.0.0.0", "{}");
        log.info("User logged out successfully. Token revoked.");
    }



    @Override
    @Transactional
    public void verifyEmail(VerifyEmailRequest request) {
        String tokenHash = CryptoUtils.hashSha256(request.getToken());

        EmailVerificationToken verificationToken = emailVerificationTokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> new TokenException("Invalid or expired verification token"));

        if (verificationToken.isExpired()) {
            throw new TokenException("Verification token has expired. Please request a new one.");
        }

        if (verificationToken.isVerified()) {
            throw new TokenException("Email is already verified.");
        }

        User user = verificationToken.getUser();
        user.setEmailVerified(true);
        user.setStatus(AccountStatus.ACTIVE);
        userRepository.save(user);

        verificationToken.setVerifiedAt(Instant.now());
        emailVerificationTokenRepository.save(verificationToken);

        auditService.logEvent(user.getId(), AuditEventType.EMAIL_VERIFIED, "0.0.0.0", "{}");
        log.info("Email verified successfully for user: {}", user.getEmail());
    }

    @Override
    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        String normalizedEmail = request.getEmail().toLowerCase().trim();

        User user = userRepository.findByEmail(normalizedEmail).orElse(null);

        if (user != null && user.isEmailVerified()) {
            String rawToken = CryptoUtils.generateSecureToken();

            passwordResetTokenRepository.deleteByUser(user);

            PasswordResetToken resetToken = PasswordResetToken.builder()
                    .user(user)
                    .tokenHash(CryptoUtils.hashSha256(rawToken))
                    .expiresAt(Instant.now().plus(15, ChronoUnit.MINUTES))
                    .build();

            passwordResetTokenRepository.save(resetToken);

            try {
                emailService.sendPasswordResetEmail(normalizedEmail, rawToken);

                auditService.logEvent(user.getId(), AuditEventType.PASSWORD_RESET_REQUESTED, "0.0.0.0", "{}");
                log.info("Forgot password request processed for: {}", normalizedEmail);

            } catch (Exception e) {
                log.error("Failed to send reset email to: {}", normalizedEmail, e);
                throw new RuntimeException("Failed to send reset email. Please check your email configuration.");
            }
        } else {
            log.info("Forgot password request processed for unregistered/unverified email: {}", normalizedEmail);
        }
    }
    @Override
    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        String tokenHash = CryptoUtils.hashSha256(request.getToken());

        PasswordResetToken resetToken = passwordResetTokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> new TokenException("Invalid or expired password reset token"));

        if (resetToken.isExpired()) {
            throw new TokenException("Reset token has expired.");
        }

        if (resetToken.isUsed()) {
            throw new TokenException("Reset token has already been used.");
        }

        User user = resetToken.getUser();

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        resetToken.setUsedAt(Instant.now());
        passwordResetTokenRepository.save(resetToken);

        // Revoke all existing refresh tokens
        refreshTokenRepository.revokeAllByUser(user);

        auditService.logEvent(user.getId(), AuditEventType.PASSWORD_RESET_SUCCESS, "0.0.0.0", "{}");
        log.info("Password reset successfully for user: {}", user.getEmail());
    }
}
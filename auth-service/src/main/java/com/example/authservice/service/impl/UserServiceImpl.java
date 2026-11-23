package com.example.authservice.service.impl;

import com.example.authservice.dto.request.ChangeEmailRequest;
import com.example.authservice.dto.request.ChangePasswordRequest;
import com.example.authservice.dto.response.UserResponse;
import com.example.authservice.entity.EmailVerificationToken;
import com.example.authservice.entity.Role;
import com.example.authservice.entity.User;
import com.example.authservice.enums.AccountStatus;
import com.example.authservice.enums.AuditEventType;
import com.example.authservice.enums.RoleName;
import com.example.authservice.exception.ResourceNotFoundException;
import com.example.authservice.exception.UserAlreadyExistsException;
import com.example.authservice.mapper.UserMapper;
import com.example.authservice.repository.EmailVerificationTokenRepository;
import com.example.authservice.repository.RefreshTokenRepository;
import com.example.authservice.repository.RoleRepository;
import com.example.authservice.repository.UserRepository;
import com.example.authservice.service.AuditService;
import com.example.authservice.service.EmailService;
import com.example.authservice.service.UserService;
import com.example.authservice.util.CryptoUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final RefreshTokenRepository refreshTokenRepository;
    private final EmailVerificationTokenRepository emailVerificationTokenRepository;
    private final EmailService emailService;
    private final AuditService auditService;

    @Override
    @Transactional(readOnly = true)
    public Page<UserResponse> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(userMapper::toResponse);
    }

    @Override
    @Transactional
    public void lockUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setStatus(AccountStatus.LOCKED);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void unlockUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setStatus(AccountStatus.ACTIVE);
        user.setFailedAttempts(0);
        user.setLockedUntil(null);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void changeUserRoles(UUID userId, Set<RoleName> roleNames) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Set<Role> newRole = roleNames.stream()
                .map(roleName -> roleRepository.findByName(roleName)
                        .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + roleName)))
                .collect(Collectors.toSet());

        user.setRoles(newRole);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void changePassword(User user, ChangePasswordRequest request) {
        // 1. Verify current password (Re-authentication)
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new BadCredentialsException("Current password is incorrect");
        }

        // 2. Update password
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        // 3. Revoke all refresh tokens (Force logout on all devices)
        refreshTokenRepository.revokeAllByUser(user);

        // 4. Audit Log
        auditService.logEvent(user.getId(), AuditEventType.PASSWORD_CHANGED, "0.0.0.0", "{}");
    }

    @Override
    @Transactional
    public void changeEmail(User user, ChangeEmailRequest request) {
        // 1. Verify password (Re-authentication)
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new BadCredentialsException("Password is incorrect");
        }

        String newEmail = request.getNewEmail().toLowerCase().trim();

        // 2. Check if new email is already taken
        if (userRepository.existsByEmail(newEmail)) {
            throw new UserAlreadyExistsException("Email is already in use");
        }

        // 3. Update email & set to unverified
        user.setEmail(newEmail);
        user.setEmailVerified(false);
        user.setStatus(AccountStatus.PENDING_VERIFICATION);
        userRepository.save(user);

        // 4. Generate new verification token
        String rawToken = CryptoUtils.generateSecureToken();

        // Delete any existing token for this user
        emailVerificationTokenRepository.deleteByUser(user);

        EmailVerificationToken verificationToken = EmailVerificationToken.builder()
                .user(user)
                .tokenHash(CryptoUtils.hashSha256(rawToken))
                .expiresAt(Instant.now().plus(24, ChronoUnit.HOURS))
                .build();
        emailVerificationTokenRepository.save(verificationToken);

        // 5. Send verification email
        emailService.sendVerificationEmail(newEmail, rawToken);

        // 6. Audit Log
        auditService.logEvent(user.getId(), AuditEventType.EMAIL_CHANGED, "0.0.0.0", "{\"newEmail\": \"" + newEmail + "\"}");
    }
}
package com.example.authservice.service.impl;

import com.example.authservice.entity.LoginAttempt;
import com.example.authservice.entity.User;
import com.example.authservice.enums.AccountStatus;
import com.example.authservice.enums.AuditEventType;
import com.example.authservice.repository.LoginAttemptRepository;
import com.example.authservice.repository.UserRepository;
import com.example.authservice.service.AuditService;
import com.example.authservice.service.LoginAttemptService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
public class LoginAttemptServiceImpl implements LoginAttemptService {

    private static final int MAX_FAILED_ATTEMPTS = 5;

    private final UserRepository userRepository;
    private final LoginAttemptRepository loginAttemptRepository;
    private final AuditService auditService;


    public LoginAttemptServiceImpl(UserRepository userRepository,
                                   LoginAttemptRepository loginAttemptRepository,
                                   AuditService auditService) {
        this.userRepository = userRepository;
        this.loginAttemptRepository = loginAttemptRepository;
        this.auditService = auditService;
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void handleFailedLogin(User user, String email, String ipAddress, String userAgent) {
        int newFailedAttempts = user.getFailedAttempts() + 1;
        user.setFailedAttempts(newFailedAttempts);

        if (newFailedAttempts >= MAX_FAILED_ATTEMPTS) {
            user.setStatus(AccountStatus.LOCKED);
            user.setLockedUntil(Instant.now().plus(15, ChronoUnit.MINUTES));
            auditService.logEvent(user.getId(), AuditEventType.ACCOUNT_LOCKED, ipAddress, "{\"reason\": \"MAX_ATTEMPTS_EXCEEDED\"}");
        }

        userRepository.save(user);
        loginAttemptRepository.save(new LoginAttempt(email, ipAddress, userAgent, false, "INVALID_PASSWORD"));
        auditService.logEvent(user.getId(), AuditEventType.LOGIN_FAILED, ipAddress, "{\"attempts\": " + newFailedAttempts + "}");
    }
}
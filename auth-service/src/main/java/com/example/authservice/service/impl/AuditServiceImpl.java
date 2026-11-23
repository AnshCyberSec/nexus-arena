package com.example.authservice.service.impl;

import com.example.authservice.entity.AuditLog;
import com.example.authservice.enums.AuditEventType;
import com.example.authservice.repository.AuditLogRepository;
import com.example.authservice.service.AuditService;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AuditServiceImpl implements AuditService {

    private final AuditLogRepository auditLogRepository;

    public AuditServiceImpl(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @Override
    public void logEvent(UUID userId, AuditEventType eventType, String ipAddress, String metadata) {
        AuditLog log = new AuditLog(userId, eventType, ipAddress, metadata);
        auditLogRepository.save(log);
    }
}
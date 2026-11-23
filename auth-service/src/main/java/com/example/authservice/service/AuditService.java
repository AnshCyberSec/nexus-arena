package com.example.authservice.service;

import com.example.authservice.enums.AuditEventType;
import java.util.UUID;

public interface AuditService {
    void logEvent(UUID userId, AuditEventType eventType, String ipAddress, String metadata);
}
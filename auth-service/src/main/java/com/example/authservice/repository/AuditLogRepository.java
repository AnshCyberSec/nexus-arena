package com.example.authservice.repository;

import com.example.authservice.entity.AuditLog;
import com.example.authservice.enums.AuditEventType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface AuditLogRepository extends JpaRepository<AuditLog, UUID> {
    Page<AuditLog> findByUserId(UUID userId, Pageable pageable);

    Page<AuditLog> findByEventType(AuditEventType eventType, Pageable pageable);
}

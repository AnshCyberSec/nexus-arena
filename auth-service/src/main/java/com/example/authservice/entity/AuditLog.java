package com.example.authservice.entity;

import com.example.authservice.enums.AuditEventType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "audit_logs")
public class AuditLog extends BaseEntity{
    @Column(name = "user_id")
    private UUID userId;

    @Enumerated(EnumType.STRING)
    @Column(name = "event_type",nullable = false,length = 50)
    private AuditEventType eventType;

    @Column(name = "ip_address",length = 45)
    private String ipAddress;

    @Column(name = "metadata",columnDefinition = "TEXT")
    private String metadata;

    public AuditLog(){

    }
    public AuditLog(UUID userId, AuditEventType eventType, String ipAddress, String metadata){
        this.userId = userId;
        this.eventType = eventType;
        this.ipAddress = ipAddress;
        this.metadata = metadata;
    }
}

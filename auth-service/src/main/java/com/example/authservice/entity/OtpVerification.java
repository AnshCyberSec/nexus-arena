package com.example.authservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "otp_verification")
public class OtpVerification extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "code_hash", nullable = false)
    private String codeHash;

    @Column(name = "purpose", nullable = false, length = 50)
    private String purpose;

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    @Builder.Default
    @Column(name = "consumed", nullable = false)
    private boolean consumed = false;

    @Builder.Default
    @Column(name = "attempt_count", nullable = false)
    private int attemptCount = 0;

    public boolean isExpired() {
        return Instant.now().isAfter(this.expiresAt);
    }

    public boolean isValid() {
        return !this.consumed && !isExpired() && this.attemptCount < 5;
    }
}
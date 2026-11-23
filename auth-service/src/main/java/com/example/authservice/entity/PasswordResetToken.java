package com.example.authservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@Table(name = "password_reset_tokens")
public class PasswordResetToken extends BaseEntity{
    @Column(name = "token_hash",nullable = false,unique = true)
    private String tokenHash;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id",nullable = false)
    private User user;

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    @Column(name = "used_at")
    private Instant usedAt;

    public boolean isExpired(){
        return Instant.now().isAfter(this.expiresAt);
    }

    public boolean isUsed(){
        return this.usedAt != null;
    }
}

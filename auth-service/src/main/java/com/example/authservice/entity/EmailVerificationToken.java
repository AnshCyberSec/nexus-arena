package com.example.authservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "email_verification_tokens")
public class EmailVerificationToken extends BaseEntity{
    @Column(name = "token_hash",nullable = false,unique = true)
    private String tokenHash;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id",nullable = false)
    private User user;

    @Column(name = "expires_at",nullable = false)
    private Instant expiresAt;

    @Column(name = "verified_at")
    private Instant verifiedAt;

    public boolean isExpired(){
        return Instant.now().isAfter(this.expiresAt);
    }

    public boolean isVerified(){
        return this.verifiedAt != null;
    }

}

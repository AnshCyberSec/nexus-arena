package com.example.authservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@Builder
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "refresh_tokens")
public class RefreshToken extends BaseEntity{
    @Column(name = "token_hash", nullable = false, unique = true)
    private String tokenHash;

    @Column(name = "family_id",nullable = false)
    private UUID familyId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "expires_at",nullable = false)
    private Instant expiresAt;

    @Builder.Default
    @Column(name = "is_revoked", nullable = false)
    private boolean revoked = false;

    @Column(name = "replaced_by_token")
    private String replacedByToken;

    public boolean isExpired(){
        return Instant.now().isAfter(this.expiresAt);
    }

}

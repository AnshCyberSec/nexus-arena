package com.example.authservice.repository;

import com.example.authservice.entity.PasswordResetToken;
import com.example.authservice.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, UUID> {
    Optional<PasswordResetToken> findByTokenHash(String tokenHash);

    Optional<PasswordResetToken> findByUser(User user);

    @Modifying
    @Query("DELETE FROM PasswordResetToken t WHERE t.user = :user")
    void deleteByUser(User user);

    @Modifying
    @Query("DELETE FROM PasswordResetToken t WHERE t.expiresAt < CURRENT_TIMESTAMP OR t.usedAt IS NOT NULL")
    void deleteAllExpiredAndUsed();
}

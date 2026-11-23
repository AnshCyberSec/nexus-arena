package com.example.authservice.repository;

import com.example.authservice.entity.EmailVerificationToken;
import com.example.authservice.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface EmailVerificationTokenRepository extends JpaRepository<EmailVerificationToken, UUID> {

    Optional<EmailVerificationToken> findByTokenHash(String tokenHash);


    Optional<EmailVerificationToken> findByUser(User user);


    @Modifying
    @Query("DELETE FROM EmailVerificationToken t WHERE t.user = :user")
    void deleteByUser(User user);


    @Modifying
    @Query("DELETE FROM EmailVerificationToken t WHERE t.expiresAt < CURRENT_TIMESTAMP")
    void deleteAllExpired();
}
package com.example.authservice.repository;

import com.example.authservice.entity.LoginAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.UUID;

public interface LoginAttemptRepository extends JpaRepository<LoginAttempt, UUID> {
    @Query("SELECT COUNT(la) FROM LoginAttempt la WHERE la.email = :email AND la.success = false AND la.createdAt > :since")
    long countRecentFailuresByEmail(@Param("email") String email, @Param("since") Instant since);

    @Query("SELECT COUNT(la) FROM LoginAttempt la WHERE la.ipAddress = :ipAddress AND la.success = false AND la.createdAt > :since")
    long countRecentFailuresByIp(@Param("ipAddress") String ipAddress, @Param("since") Instant since);

    @Modifying
    @Query("DELETE FROM LoginAttempt la WHERE la.createdAt < :threshold")
    void deleteOldAttempts(@Param("threshold") Instant threshold);
}

package com.example.authservice.repository;

import com.example.authservice.entity.OtpVerification;
import com.example.authservice.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface OtpVerificationRepository extends JpaRepository<OtpVerification, UUID> {


    @Query("SELECT o FROM OtpVerification o WHERE o.user = :user AND o.purpose = :purpose AND o.consumed = false AND o.expiresAt > CURRENT_TIMESTAMP ORDER BY o.createdAt DESC LIMIT 1")
    Optional<OtpVerification> findLatestActiveOtp(User user, String purpose);


    @Query("SELECT o FROM OtpVerification o WHERE o.user = :user AND o.purpose = :purpose ORDER BY o.createdAt DESC LIMIT 1")
    Optional<OtpVerification> findLatestOtp(User user, String purpose);

    @Modifying
    @Query("DELETE FROM OtpVerification o WHERE o.user = :user AND o.purpose = :purpose")
    void deleteByUserAndPurpose(User user, String purpose);

    @Modifying
    @Query("DELETE FROM OtpVerification o WHERE o.expiresAt < CURRENT_TIMESTAMP OR o.consumed = true")
    void deleteAllExpiredAndConsumed();
}
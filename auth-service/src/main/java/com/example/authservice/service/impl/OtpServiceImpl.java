package com.example.authservice.service.impl;

import com.example.authservice.entity.OtpVerification;
import com.example.authservice.entity.User;
import com.example.authservice.exception.TokenException;
import com.example.authservice.repository.OtpVerificationRepository;
import com.example.authservice.service.EmailService;
import com.example.authservice.service.OtpService;
import com.example.authservice.service.SmsService;
import com.example.authservice.util.CryptoUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
public class OtpServiceImpl implements OtpService {

    private static final Logger log = LoggerFactory.getLogger(OtpServiceImpl.class);

    private static final int OTP_EXPIRY_MINUTES = 5;
    private static final int MAX_ATTEMPTS = 5;

    private final OtpVerificationRepository otpVerificationRepository;
    private final EmailService emailService;
    private final SmsService smsService;

    public OtpServiceImpl(OtpVerificationRepository otpVerificationRepository,
                          EmailService emailService,
                          SmsService smsService) {
        this.otpVerificationRepository = otpVerificationRepository;
        this.emailService = emailService;
        this.smsService = smsService;
    }

    @Override
    @Transactional
    public void generateAndSendOtp(User user, String purpose) {
        // 1. Purani OTP invalidate karo
        otpVerificationRepository.deleteByUserAndPurpose(user, purpose);

        // 2. Naya OTP generate karo
        String rawOtp = CryptoUtils.generateOtp();

        // 3. DB me hash save karo
        OtpVerification otp = OtpVerification.builder()
                .user(user)
                .codeHash(CryptoUtils.hashSha256(rawOtp))
                .purpose(purpose)
                .expiresAt(Instant.now().plus(OTP_EXPIRY_MINUTES, ChronoUnit.MINUTES))
                .consumed(false)
                .attemptCount(0)
                .build();
        otpVerificationRepository.save(otp);

        // 4. Email par bhejo
        emailService.sendOtpEmail(user.getEmail(), rawOtp, purpose);

        // 5. Agar phone number available hai toh SMS bhi bhejo
        // Note: User entity me phoneNumber field hone chahiye
        // if (user.getPhoneNumber() != null && !user.getPhoneNumber().isBlank()) {
        //     smsService.sendSms(user.getPhoneNumber(), "Your OTP for " + purpose + " is: " + rawOtp);
        // }

        log.info("OTP generated and sent for user: {} (purpose: {})", user.getEmail(), purpose);
    }

    @Override
    @Transactional
    public boolean verifyOtp(User user, String purpose, String code) {
        OtpVerification otp = otpVerificationRepository
                .findLatestActiveOtp(user, purpose)
                .orElseThrow(() -> new TokenException("No active OTP found. Please request a new one."));

        if (otp.isExpired()) {
            throw new TokenException("OTP has expired. Please request a new one.");
        }

        if (otp.getAttemptCount() >= MAX_ATTEMPTS) {
            throw new TokenException("Too many failed attempts. Please request a new OTP.");
        }

        otp.setAttemptCount(otp.getAttemptCount() + 1);

        String providedHash = CryptoUtils.hashSha256(code);
        if (!providedHash.equals(otp.getCodeHash())) {
            otpVerificationRepository.save(otp);
            log.warn("Invalid OTP attempt for user: {} (purpose: {})", user.getEmail(), purpose);
            return false;
        }

        otp.setConsumed(true);
        otpVerificationRepository.save(otp);
        log.info("OTP verified successfully for user: {} (purpose: {})", user.getEmail(), purpose);
        return true;
    }

    @Override
    @Transactional
    public void invalidateOtp(User user, String purpose) {
        otpVerificationRepository.deleteByUserAndPurpose(user, purpose);
        log.info("OTP invalidated for user: {} (purpose: {})", user.getEmail(), purpose);
    }
}
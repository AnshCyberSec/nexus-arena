package com.example.authservice.service.impl;

import com.example.authservice.service.EmailService;
import com.resend.Resend;
import com.resend.services.emails.model.CreateEmailOptions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailServiceImpl.class);

    private final Resend resend;
    private final String fromEmail;
    private final String baseUrl;

    public EmailServiceImpl(
            @Value("${app.resend.api-key}") String apiKey,
            @Value("${app.resend.from-email}") String fromEmail,
            @Value("${app.frontend.base-url}") String baseUrl) {

        this.resend = new Resend(apiKey);
        this.fromEmail = fromEmail;
        this.baseUrl = baseUrl;
    }

    @Override
    public void sendVerificationEmail(String toEmail, String verificationToken) {
        String verifyLink = baseUrl + "/api/v1/auth/verify-email?token=" + verificationToken;
        String message = "Hello,\n\nThank you for registering!\n\nClick the link below to verify your email:\n"
                + verifyLink + "\n\nThis link expires in 24 hours.\n\nBest regards,\nAuth Service Team";

        sendEmail(toEmail, "Verify Your Email Address - Auth Service", message);
        log.info("Verification email sent to: {}. Link: {}", toEmail, verifyLink);
    }

    @Override
    public void sendPasswordResetEmail(String toEmail, String resetToken) {
        String resetLink = baseUrl + "/api/v1/auth/reset-password?token=" + resetToken;
        String message = "Hello,\n\nClick the link below to reset your password:\n"
                + resetLink + "\n\nThis link expires in 15 minutes.\n\nBest regards,\nAuth Service Team";

        sendEmail(toEmail, "Reset Your Password - Auth Service", message);
        log.info("Password reset email sent to: {}. Link: {}", toEmail, resetLink);
    }

    @Override
    public void sendOtpEmail(String toEmail, String otp, String purpose) {
        String message = "Hello,\n\nYour OTP code for " + purpose + " is:\n\n        " + otp
                + "\n\nThis code expires in 5 minutes.\nDo not share this code with anyone.\n\nBest regards,\nAuth Service Team";

        sendEmail(toEmail, "Your OTP Code - Auth Service", message);
        log.info("OTP email sent to: {}", toEmail);
    }

    // Common method to send email using Resend
    private void sendEmail(String toEmail, String subject, String textContent) {
        try {
            CreateEmailOptions params = CreateEmailOptions.builder()
                    .from(fromEmail)
                    .to(toEmail)
                    .subject(subject)
                    .text(textContent)
                    .build();

            resend.emails().send(params);
        } catch (Exception e) {
            log.error("Failed to send email to: {}", toEmail, e);
            throw new RuntimeException("Failed to send email", e);
        }
    }
}
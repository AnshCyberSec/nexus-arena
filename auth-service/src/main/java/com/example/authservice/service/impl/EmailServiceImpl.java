package com.example.authservice.service.impl;

import com.example.authservice.service.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailServiceImpl.class);
    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.frontend.base-url}")
    private String baseUrl;

    public EmailServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public void sendVerificationEmail(String toEmail, String verificationToken) {
        try {
            // ngrok URL ka use karo
            String verifyLink = baseUrl + "/api/v1/auth/verify-email?token=" + verificationToken;

            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Verify Your Email Address - Auth Service");
            message.setText("Hello,\n\n" +
                    "Thank you for registering!\n\n" +
                    "Click the link below to verify your email:\n" +
                    verifyLink + "\n\n" +
                    "This link expires in 24 hours.\n\n" +
                    "Best regards,\nAuth Service Team");

            mailSender.send(message);
            log.info("Verification email sent to: {}. Link: {}", toEmail, verifyLink);
        } catch (Exception e) {
            log.error("Failed to send email to: {}", toEmail, e);
        }
    }

    @Override
    public void sendPasswordResetEmail(String toEmail, String resetToken) {
        try {
            String resetLink = baseUrl + "/api/v1/auth/reset-password?token=" + resetToken;

            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Reset Your Password - Auth Service");
            message.setText("Hello,\n\n" +
                    "Click the link below to reset your password:\n" +
                    resetLink + "\n\n" +
                    "This link expires in 15 minutes.\n\n" +
                    "Best regards,\nAuth Service Team");

            mailSender.send(message);
            log.info("Password reset email sent to: {}. Link: {}", toEmail, resetLink);
        } catch (Exception e) {
            log.error("Failed to send password reset email to: {}", toEmail, e);
        }
    }

    @Override
    public void sendOtpEmail(String toEmail, String otp, String purpose) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Your OTP Code - Auth Service");
            message.setText("Hello,\n\n" +
                    "Your OTP code for " + purpose + " is:\n\n" +
                    "        " + otp + "\n\n" +
                    "This code expires in 5 minutes.\n" +
                    "Do not share this code with anyone.\n\n" +
                    "Best regards,\nAuth Service Team");

            mailSender.send(message);
            log.info("OTP email sent to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send OTP email to: {}", toEmail, e);
        }
    }
}
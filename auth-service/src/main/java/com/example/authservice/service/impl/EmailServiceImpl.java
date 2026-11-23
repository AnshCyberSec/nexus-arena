package com.example.authservice.service.impl;

import com.example.authservice.service.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailServiceImpl.class);
    private static final String BREVO_URL = "https://api.brevo.com/v3/smtp/email";

    private final RestTemplate restTemplate = new RestTemplate();
    private final String apiKey;
    private final String fromEmail;
    private final String baseUrl;

    public EmailServiceImpl(
            @Value("${app.brevo.api-key}") String apiKey,
            @Value("${app.brevo.from-email}") String fromEmail,
            @Value("${app.frontend.base-url}") String baseUrl) {
        this.apiKey = apiKey;
        this.fromEmail = fromEmail;
        this.baseUrl = baseUrl;
    }

    @Override
    public void sendVerificationEmail(String toEmail, String verificationToken) {
        String verifyLink = baseUrl + "/api/v1/auth/verify-email?token=" + verificationToken;
        String text = "Hello,\n\nThank you for registering!\n\nClick the link to verify:\n"
                + verifyLink + "\n\nThis link expires in 24 hours.";
        sendEmail(toEmail, "Verify Your Email - Auth Service", text);
    }

    @Override
    public void sendPasswordResetEmail(String toEmail, String resetToken) {
        String resetLink = baseUrl + "/api/v1/auth/reset-password?token=" + resetToken;
        String text = "Hello,\n\nClick the link to reset your password:\n"
                + resetLink + "\n\nThis link expires in 15 minutes.";
        sendEmail(toEmail, "Reset Your Password - Auth Service", text);
    }

    @Override
    public void sendOtpEmail(String toEmail, String otp, String purpose) {
        String text = "Hello,\n\nYour OTP for " + purpose + " is: " + otp
                + "\n\nThis code expires in 5 minutes.";
        sendEmail(toEmail, "Your OTP Code - Auth Service", text);
    }

    private void sendEmail(String toEmail, String subject, String textContent) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("api-key", apiKey);

            Map<String, Object> body = Map.of(
                    "sender", Map.of("email", fromEmail, "name", "Nexus Arena"),
                    "to", List.of(Map.of("email", toEmail)),
                    "subject", subject,
                    "textContent", textContent
            );

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            restTemplate.postForEntity(BREVO_URL, request, String.class);
            log.info("Email sent via Brevo to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send email to: {}", toEmail, e);
            throw new RuntimeException("Email sending failed", e);
        }
    }
}
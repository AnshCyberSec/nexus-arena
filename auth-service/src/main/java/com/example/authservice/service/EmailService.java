package com.example.authservice.service;

public interface EmailService {

    void sendVerificationEmail(String toEmail, String verificationToken);

    void sendPasswordResetEmail(String toEmail, String resetToken);


    void sendOtpEmail(String toEmail, String otp, String purpose);
}
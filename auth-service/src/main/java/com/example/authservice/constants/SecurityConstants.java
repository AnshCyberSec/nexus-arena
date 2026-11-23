package com.example.authservice.constants;

public final class SecurityConstants {

    private SecurityConstants() {

    }

    public static final String TOKEN_PREFIX = "Bearer ";
    public static final String HEADER_STRING = "Authorization";
    public static final String ISSUER = "auth-service";


    public static final int OTP_EXPIRY_MINUTES = 5;
    public static final int EMAIL_VERIFICATION_EXPIRY_HOURS = 24;
    public static final int PASSWORD_RESET_EXPIRY_MINUTES = 15;
    public static final int MAX_LOGIN_ATTEMPTS = 5;
    public static final int LOCKOUT_DURATION_MINUTES = 15;
}
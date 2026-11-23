package com.example.authservice.service;

import com.example.authservice.entity.User;

public interface LoginAttemptService {
    void handleFailedLogin(User user, String email, String ipAddress, String userAgent);
}
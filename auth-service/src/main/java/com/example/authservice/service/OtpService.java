package com.example.authservice.service;

import com.example.authservice.entity.User;

public interface OtpService {


    void generateAndSendOtp(User user, String purpose);


    boolean verifyOtp(User user, String purpose, String code);

    void invalidateOtp(User user, String purpose);
}
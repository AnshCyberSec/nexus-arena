package com.example.authservice.service;

public interface SmsService {


    void sendSms(String phoneNumber, String message);
}
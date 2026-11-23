package com.example.authservice.service.impl;

import com.example.authservice.service.SmsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class SmsServiceImpl implements SmsService {

    private static final Logger log = LoggerFactory.getLogger(SmsServiceImpl.class);

    @Override
    public void sendSms(String phoneNumber, String message) {
        // TODO: Integrate with Twilio, AWS SNS, or TextLocal for production
        log.info("=================================================");
        log.info("MOCK SMS SENT TO: {}", phoneNumber);
        log.info("MESSAGE: {}", message);
        log.info("=================================================");
    }
}
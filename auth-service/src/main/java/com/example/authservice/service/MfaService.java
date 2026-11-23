package com.example.authservice.service;

import com.example.authservice.dto.response.MfaSetupResponse;
import com.example.authservice.entity.User;

public interface MfaService {
    MfaSetupResponse generateMfaSetup(User user);
    boolean verifyAndEnableMfa(User user, String code);
    boolean verifyMfaCode(User user, String code);
    void disableMfa(User user);
}
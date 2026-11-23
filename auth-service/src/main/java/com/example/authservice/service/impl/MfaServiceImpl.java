package com.example.authservice.service.impl;

import com.example.authservice.dto.response.MfaSetupResponse;
import com.example.authservice.entity.User;
import com.example.authservice.repository.UserRepository;
import com.example.authservice.service.MfaService;
import dev.samstevens.totp.code.CodeGenerator;
import dev.samstevens.totp.code.CodeVerifier;
import dev.samstevens.totp.code.DefaultCodeGenerator;
import dev.samstevens.totp.code.DefaultCodeVerifier;
import dev.samstevens.totp.qr.QrData;
import dev.samstevens.totp.qr.QrGenerator;
import dev.samstevens.totp.qr.ZxingPngQrGenerator;
import dev.samstevens.totp.secret.DefaultSecretGenerator;
import dev.samstevens.totp.secret.SecretGenerator;
import dev.samstevens.totp.time.SystemTimeProvider;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Base64;

@Service
public class MfaServiceImpl implements MfaService {

    private final UserRepository userRepository;
    private final SecretGenerator secretGenerator;
    private final CodeVerifier codeVerifier;

    public MfaServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.secretGenerator = new DefaultSecretGenerator();

        // Setup code verifier (allows 1 period of time drift - 30 seconds before/after)
        this.codeVerifier = new DefaultCodeVerifier(new DefaultCodeGenerator(), new SystemTimeProvider());
    }

    @Override
    @Transactional
    public MfaSetupResponse generateMfaSetup(User user) {
        // Generate new secret
        String secret = secretGenerator.generate();

        // Temporarily save secret (user hasn't verified it yet, so mfaEnabled = false)
        user.setMfaSecret(secret);
        userRepository.save(user);

        // Build QR Code
        QrData data = new QrData.Builder()
                .label(user.getEmail())
                .secret(secret)
                .issuer("AuthService")
                .build();

        try {
            QrGenerator generator = new ZxingPngQrGenerator();
            byte[] imageData = generator.generate(data);
            String mimeType = generator.getImageMimeType();
            String dataUri = "data:" + mimeType + ";base64," + Base64.getEncoder().encodeToString(imageData);

            return MfaSetupResponse.builder()
                    .secret(secret)
                    .qrCodeImageUri(dataUri)
                    .build();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate QR code", e);
        }
    }

    @Override
    @Transactional
    public boolean verifyAndEnableMfa(User user, String code) {
        if (user.getMfaSecret() == null) {
            throw new IllegalStateException("MFA setup not initiated");
        }

        if (codeVerifier.isValidCode(user.getMfaSecret(), code)) {
            user.setMfaEnabled(true);
            userRepository.save(user);
            return true;
        }
        return false;
    }

    @Override
    public boolean verifyMfaCode(User user, String code) {
        if (!user.isMfaEnabled() || user.getMfaSecret() == null) {
            throw new IllegalStateException("MFA is not enabled for this user");
        }
        return codeVerifier.isValidCode(user.getMfaSecret(), code);
    }

    @Override
    @Transactional
    public void disableMfa(User user) {
        user.setMfaEnabled(false);
        user.setMfaSecret(null);
        userRepository.save(user);
    }
}
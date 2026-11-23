package com.example.authservice.security.jwt;

import com.example.authservice.config.AppProperties;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

@Component
public class JwtKeyProvider {

    private final PrivateKey privateKey;
    private final PublicKey publicKey;

    public JwtKeyProvider(AppProperties appProperties, ResourceLoader resourceLoader) {
        try {
            // Access nested properties: app.security.jwt.private-key-path
            this.privateKey = loadPrivateKey(resourceLoader.getResource(appProperties.getSecurity().getJwt().getPrivateKeyPath()));
            this.publicKey = loadPublicKey(resourceLoader.getResource(appProperties.getSecurity().getJwt().getPublicKeyPath()));
        } catch (Exception e) {
            throw new IllegalStateException("Failed to load JWT keys", e);
        }
    }

    public PrivateKey getPrivateKey() {
        return privateKey;
    }

    public PublicKey getPublicKey() {
        return publicKey;
    }

    private PrivateKey loadPrivateKey(Resource resource) throws Exception {
        try (InputStream is = resource.getInputStream()) {
            String key = new String(is.readAllBytes(), StandardCharsets.UTF_8)
                    .replace("-----BEGIN PRIVATE KEY-----", "")
                    .replace("-----END PRIVATE KEY-----", "")
                    .replaceAll("\\s+", "");
            byte[] keyBytes = Base64.getDecoder().decode(key);
            PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(keyBytes);
            return KeyFactory.getInstance("RSA").generatePrivate(spec);
        }
    }

    private PublicKey loadPublicKey(Resource resource) throws Exception {
        try (InputStream is = resource.getInputStream()) {
            String key = new String(is.readAllBytes(), StandardCharsets.UTF_8)
                    .replace("-----BEGIN PUBLIC KEY-----", "")
                    .replace("-----END PUBLIC KEY-----", "")
                    .replaceAll("\\s+", "");
            byte[] keyBytes = Base64.getDecoder().decode(key);
            X509EncodedKeySpec spec = new X509EncodedKeySpec(keyBytes);
            return KeyFactory.getInstance("RSA").generatePublic(spec);
        }
    }
}
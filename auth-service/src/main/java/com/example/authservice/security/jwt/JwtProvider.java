package com.example.authservice.security.jwt;

import com.example.authservice.config.AppProperties;
import com.example.authservice.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class JwtProvider {

    private final JwtKeyProvider keyProvider;
    private final AppProperties appProperties;

    public JwtProvider(JwtKeyProvider keyProvider, AppProperties appProperties) {
        this.keyProvider = keyProvider;
        this.appProperties = appProperties;
    }

    public String generateAccessToken(User user, boolean mfaVerified) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + (appProperties.getSecurity().getJwt().getAccessTokenExpirationMinutes() * 60 * 1000));

        return Jwts.builder()
                .subject(user.getId().toString())
                .issuer(appProperties.getSecurity().getJwt().getIssuer())
                .audience().add("auth-service-client").and()
                .issuedAt(now)
                .expiration(expiryDate)
                .id(UUID.randomUUID().toString()) // jti claim
                .claim("roles", user.getRoles().stream()
                        .map(r -> r.getName().name())
                        .collect(Collectors.toList()))
                .claim("mfa", mfaVerified)
                .signWith(keyProvider.getPrivateKey())
                .compact();
    }

    public Claims validateAndParseToken(String token) {
        return Jwts.parser()
                .verifyWith(keyProvider.getPublicKey())
                .requireIssuer(appProperties.getSecurity().getJwt().getIssuer())
                .requireAudience("auth-service-client")
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
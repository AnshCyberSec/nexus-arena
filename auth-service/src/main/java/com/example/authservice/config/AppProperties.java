package com.example.authservice.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "app")
public class AppProperties {
    private Security security = new Security();
    private Admin admin = new Admin();

    @Getter
    @Setter
    public static class Security {
        private Jwt jwt = new Jwt();
    }

    @Getter
    @Setter
    public static class Jwt {
        private String privateKeyPath;
        private String publicKeyPath;
        private long accessTokenExpirationMinutes;
        private long refreshTokenExpirationDays;
        private String issuer;
    }

    @Getter
    @Setter
    public static class Admin {
        private String email;
        private String password;
    }
}
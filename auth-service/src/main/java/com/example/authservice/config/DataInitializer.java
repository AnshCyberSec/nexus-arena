package com.example.authservice.config;

import com.example.authservice.entity.Role;
import com.example.authservice.entity.User;
import com.example.authservice.enums.AccountStatus;
import com.example.authservice.enums.RoleName;
import com.example.authservice.repository.RoleRepository;
import com.example.authservice.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AppProperties appProperties;

    public DataInitializer(UserRepository userRepository, RoleRepository roleRepository,
                           PasswordEncoder passwordEncoder, AppProperties appProperties) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.appProperties = appProperties;
    }

    @Override
    public void run(String... args) throws Exception {
        // Specifically check for admin, not just "any user"
        if (!userRepository.existsByEmail(appProperties.getAdmin().getEmail().toLowerCase())) {
            log.info("No admin found. Initializing system admin...");

            Role adminRole = roleRepository.findByName(RoleName.ROLE_ADMIN)
                    .orElseThrow(() -> new IllegalStateException("Admin role missing. Did Flyway migrations run?"));

            User admin = User.builder()
                    .email(appProperties.getAdmin().getEmail().toLowerCase())
                    .passwordHash(passwordEncoder.encode(appProperties.getAdmin().getPassword()))
                    .fullName("System Administrator")
                    .status(AccountStatus.ACTIVE)
                    .emailVerified(true)
                    .roles(Set.of(adminRole))
                    .build();

            userRepository.save(admin);
            log.info("System Admin created: {}", appProperties.getAdmin().getEmail());
        } else {
            log.info("Admin already exists. Skipping creation.");
        }
    }
}
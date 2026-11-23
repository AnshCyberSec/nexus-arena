package com.example.authservice.dto.response;

import com.example.authservice.enums.AccountStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private UUID id;
    private String email;
    private String fullName;
    private AccountStatus status;
    private boolean emailVerified;
    private boolean mfaEnabled;
    private Set<String> roles;
}

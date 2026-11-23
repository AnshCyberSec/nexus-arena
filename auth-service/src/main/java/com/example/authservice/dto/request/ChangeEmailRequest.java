package com.example.authservice.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChangeEmailRequest {

    @NotBlank(message = "Password is required for re-authentication")
    private String password;

    @NotBlank(message = "New email is required")
    @Email(message = "Please provide a valid email address")
    private String newEmail;
}
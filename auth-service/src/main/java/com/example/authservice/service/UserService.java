package com.example.authservice.service;

import com.example.authservice.dto.request.ChangeEmailRequest;
import com.example.authservice.dto.request.ChangePasswordRequest;
import com.example.authservice.dto.response.UserResponse;
import com.example.authservice.entity.User;
import com.example.authservice.enums.RoleName;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface UserService {
    Page<UserResponse> getAllUsers(Pageable pageable);
    void lockUser(UUID userId);
    void unlockUser(UUID userId);
    void changeUserRoles(UUID userId, java.util.Set<RoleName> roles);
    void changePassword(User user, ChangePasswordRequest request);
    void changeEmail(User user, ChangeEmailRequest request);
}
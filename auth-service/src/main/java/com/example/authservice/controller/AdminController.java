package com.example.authservice.controller;

import com.example.authservice.dto.response.ApiResponse;
import com.example.authservice.dto.response.UserResponse;
import com.example.authservice.enums.RoleName;
import com.example.authservice.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {
    private final UserService userService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<UserResponse>>> getAllUsers(@RequestParam(defaultValue = "0") int page,
                                                                       @RequestParam(defaultValue = "10") int size) {
        Page<UserResponse> users = userService.getAllUsers(PageRequest.of(page, size, Sort.by("createdAt").descending()));

        return ResponseEntity.ok(ApiResponse.<Page<UserResponse>>builder()
                .success(true)
                .message("Users fetched successfully")
                .data(users)
                .build());
    }


    @PostMapping("/users/{userId}/lock")
    public ResponseEntity<ApiResponse<Void>> lockUser(@PathVariable UUID userId){
        userService.lockUser(userId);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("User locked successfully")
                .build());
    }


    @PostMapping("/users/{userId}/unlock")
    public ResponseEntity<ApiResponse<Void>> unlockUser(@PathVariable UUID userId){
        userService.unlockUser(userId);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("User unlocked successfully")
                .build());
    }

    @PatchMapping("/users/{userId}/roles")
    public ResponseEntity<ApiResponse<Void>> changeRoles(@PathVariable UUID userId, @RequestBody Set<RoleName> roleNames){
        userService.changeUserRoles(userId,roleNames);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("User roles updated successfully")
                .build());
    }

}

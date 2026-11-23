package com.example.authservice.controller;

import com.example.authservice.dto.request.*;
import com.example.authservice.dto.response.ApiResponse;
import com.example.authservice.dto.response.AuthResponse;
import com.example.authservice.dto.response.UserResponse;
import com.example.authservice.exception.TokenException;
import com.example.authservice.mapper.UserMapper;
import com.example.authservice.security.userdetails.CustomUserDetails;
import com.example.authservice.service.AuthService;
import com.example.authservice.service.TokenService;
import com.example.authservice.util.ClientIpExtractor;
import com.example.authservice.util.CookieUtils;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.util.Optional;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;
    private final TokenService tokenService;
    private final UserMapper userMapper;
    private final String frontendBaseUrl;

    public AuthController(AuthService authService,
                          TokenService tokenService,
                          UserMapper userMapper,
                          @Value("${app.frontend.base-url}") String frontendBaseUrl) {
        this.authService = authService;
        this.tokenService = tokenService;
        this.userMapper = userMapper;
        this.frontendBaseUrl = frontendBaseUrl;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Void>> register(@Valid @RequestBody RegisterRequest request, HttpServletRequest httpRequest) {
        String ipAddress = ClientIpExtractor.getClientIp(httpRequest);
        authService.register(request, ipAddress);
        return new ResponseEntity<>(ApiResponse.<Void>builder()
                .success(true)
                .message("User registered successfully. Please check your email for verification.")
                .build(), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request,
                                                           HttpServletRequest httpRequest,
                                                           HttpServletResponse httpResponse) {
        String ipAddress = ClientIpExtractor.getClientIp(httpRequest);
        String userAgent = httpRequest.getHeader("User-Agent");

        AuthResponse authResponse = authService.login(request, ipAddress, userAgent);

        if (!authResponse.isMfaRequired() && authResponse.getRefreshToken() != null) {
            CookieUtils.addCookie(httpResponse, "refreshToken", authResponse.getRefreshToken(), 604800);
            authResponse.setRefreshToken(null);
        }

        return new ResponseEntity<>(ApiResponse.<AuthResponse>builder()
                .success(true)
                .message("Login successful")
                .data(authResponse)
                .build(), HttpStatus.OK);
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(
            @RequestBody(required = false) RefreshTokenRequest request,
            HttpServletRequest httpRequest,
            HttpServletResponse httpResponse) {

        String refreshToken = null;

        if (request != null && request.getRefreshToken() != null) {
            refreshToken = request.getRefreshToken();
        } else {
            Optional<Cookie> cookie = CookieUtils.getCookie(httpRequest, "refreshToken");
            if (cookie.isPresent()) {
                refreshToken = cookie.get().getValue();
            }
        }

        if (refreshToken == null) {
            throw new TokenException("Refresh token is required");
        }

        RefreshTokenRequest tokenRequest = new RefreshTokenRequest();
        tokenRequest.setRefreshToken(refreshToken);

        AuthResponse authResponse = tokenService.refreshToken(tokenRequest);

        CookieUtils.addCookie(httpResponse, "refreshToken", authResponse.getRefreshToken(), 604800);
        authResponse.setRefreshToken(null);

        return ResponseEntity.ok(ApiResponse.<AuthResponse>builder()
                .success(true)
                .message("Token refreshed successfully")
                .data(authResponse)
                .build());
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(HttpServletRequest httpRequest, HttpServletResponse httpResponse) {
        CookieUtils.deleteCookie(httpRequest, httpResponse, "refreshToken");

        Optional<Cookie> cookie = CookieUtils.getCookie(httpRequest, "refreshToken");
        if (cookie.isPresent()) {
            LogoutRequest request = new LogoutRequest();
            request.setRefreshToken(cookie.get().getValue());
            authService.logout(request);
        }

        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("Logged out successfully")
                .build());
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(@AuthenticationPrincipal CustomUserDetails userDetails) {
        UserResponse userResponse = userMapper.toResponse(userDetails.getUser());
        return ResponseEntity.ok(ApiResponse.<UserResponse>builder()
                .success(true)
                .message("User fetched successfully")
                .data(userResponse)
                .build());
    }

    @PostMapping("/mfa/verify-login")
    public ResponseEntity<ApiResponse<AuthResponse>> verifyMfaLogin(@Valid @RequestBody MfaVerifyLoginRequest request, HttpServletResponse httpResponse) {
        AuthResponse authResponse = authService.verifyMfaLogin(request);

        if (authResponse.getRefreshToken() != null) {
            CookieUtils.addCookie(httpResponse, "refreshToken", authResponse.getRefreshToken(), 7 * 24 * 60 * 60);
            authResponse.setRefreshToken(null);
        }

        return ResponseEntity.ok(ApiResponse.<AuthResponse>builder()
                .success(true)
                .message("MFA verification successful")
                .data(authResponse)
                .build());
    }

    @PostMapping("/verify-email")
    public ResponseEntity<ApiResponse<Void>> verifyEmailPost(@Valid @RequestBody VerifyEmailRequest request) {
        authService.verifyEmail(request);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("Email verified successfully. You can now login.")
                .build());
    }

    @GetMapping("/verify-email")
    public String verifyEmailGet(@RequestParam("token") String token, Model model) {
        try {
            VerifyEmailRequest request = new VerifyEmailRequest();
            request.setToken(token);
            authService.verifyEmail(request);
            return "verification-success";
        } catch (TokenException e) {
            model.addAttribute("errorMessage", e.getMessage());
            return "verification-error";
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("If an account exists, a reset link has been sent.")
                .build());
    }

    // GET: Email link se aane par frontend ke reset page pe bhejta hai
    @GetMapping("/reset-password")
    public RedirectView redirectToResetPassword(@RequestParam("token") String token) {
        String frontendUrl = frontendBaseUrl + "/reset-password?token=" + token;
        return new RedirectView(frontendUrl);
    }

    // POST: Frontend naya password bhejta hai
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("Password reset successfully. You can now login.")
                .build());
    }
}
package com.example.authservice.service;

public interface RateLimitService {
    boolean isAllowed(String key, int maxRequests, int windowSeconds);
}
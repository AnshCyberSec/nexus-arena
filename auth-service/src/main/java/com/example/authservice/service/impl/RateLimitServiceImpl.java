package com.example.authservice.service.impl;

import com.example.authservice.service.RateLimitService;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service // <-- YEH ANNOTATION ZAROORI HAI
public class RateLimitServiceImpl implements RateLimitService {

    private final StringRedisTemplate redisTemplate;

    public RateLimitServiceImpl(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @Override
    public boolean isAllowed(String key, int maxRequests, int windowSeconds) {
        String redisKey = "rate_limit:" + key;

        Long currentCount = redisTemplate.opsForValue().increment(redisKey);

        if (currentCount != null && currentCount == 1) {
            // First request, set expiration
            redisTemplate.expire(redisKey, Duration.ofSeconds(windowSeconds));
        }

        return currentCount != null && currentCount <= maxRequests;
    }
}
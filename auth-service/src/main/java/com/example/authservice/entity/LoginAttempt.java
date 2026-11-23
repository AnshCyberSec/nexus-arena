package com.example.authservice.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "login_attempts")
public class LoginAttempt extends BaseEntity{
    @Column(name = "email", nullable = false, length = 150)
    private String email;

    @Column(name = "ip_address",length = 45)
    private String ipAddress;

    @Column(name = "user_agent",length = 255)
    private String userAgent;

    @Column(name = "is_success", nullable = false)
    private boolean success;

    @Column(name = "failure_reason",length = 100)
    private  String failureReason;

    public LoginAttempt(){

    }

    public LoginAttempt(String email, String ipAddress, String userAgent, boolean success, String failureReason){
        this.email = email;
        this.ipAddress = ipAddress;
        this.userAgent = userAgent;
        this.success =success;
        this.failureReason = failureReason;
    }

}

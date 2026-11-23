// src/utils/constants.js

// API Endpoints (Same rahenge)
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    VERIFY_EMAIL: '/auth/verify-email',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    MFA_VERIFY_LOGIN: '/auth/mfa/verify-login',
  },
  USER: {
    CHANGE_PASSWORD: '/users/change-password',
    CHANGE_EMAIL: '/users/change-email',
  },
  MFA: {
    SETUP: '/mfa/setup',
    VERIFY: '/mfa/verify',
    DISABLE: '/mfa/disable',
  },
  OTP: {
    SEND: '/otp/send',
    VERIFY: '/otp/verify',
  },
};

export const OTP_PURPOSES = {
  EMAIL_VERIFICATION: 'EMAIL_VERIFICATION',
  PASSWORD_RESET: 'PASSWORD_RESET',
  LOGIN_MFA: 'LOGIN_MFA',
  SENSITIVE_ACTION: 'SENSITIVE_ACTION',
};

export const ROLES = {
  USER: 'ROLE_USER',
  ADMIN: 'ROLE_ADMIN',
  SUPER_ADMIN: 'ROLE_SUPER_ADMIN',
};

// App Info Changed
export const APP_NAME = 'Nexus';
export const APP_VERSION = '2.0.0';
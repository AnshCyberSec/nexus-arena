import axiosClient from './axiosClient';

export const authApi = {
  /**
   * Register a new user
   * @param {Object} data - { email, password, fullName }
   */
  register: (data) => {
    return axiosClient.post('/auth/register', data);
  },

  /**
   * Login user
   * @param {Object} data - { email, password }
   */
  login: (data) => {
    return axiosClient.post('/auth/login', data);
  },

  /**
   * Verify MFA during login (if enabled)
   * @param {Object} data - { mfaToken, code }
   */
  verifyMfaLogin: (data) => {
    return axiosClient.post('/auth/mfa/verify-login', data);
  },

  /**
   * Logout user
   * (Refresh token cookie automatically sent via withCredentials)
   */
  logout: () => {
    return axiosClient.post('/auth/logout');
  },

  /**
   * Request Forgot Password (Sends reset link)
   * @param {Object} data - { email }
   */
  forgotPassword: (data) => {
    return axiosClient.post('/auth/forgot-password', data);
  },

  /**
   * Reset Password using token
   * @param {Object} data - { token, newPassword }
   */
  resetPassword: (data) => {
    return axiosClient.post('/auth/reset-password', data);
  },

  /**
   * Get current user profile (Protected)
   */
  getCurrentUser: () => {
    return axiosClient.get('/auth/me');
  }
};
import axiosClient from './axiosClient';

export const userApi = {
  /**
   * Change Password (Requires current password)
   * @param {Object} data - { currentPassword, newPassword }
   */
  changePassword: (data) => {
    return axiosClient.post('/users/change-password', data);
  },

  /**
   * Change Email (Requires password to re-authenticate)
   * @param {Object} data - { password, newEmail }
   */
  changeEmail: (data) => {
    return axiosClient.post('/users/change-email', data);
  },

  /**
   * Setup MFA (Generates QR Code)
   */
  setupMfa: () => {
    return axiosClient.post('/mfa/setup');
  },

  /**
   * Verify and Enable MFA (Requires 6-digit code)
   * @param {Object} data - { code }
   */
  verifyMfa: (data) => {
    return axiosClient.post('/mfa/verify', data);
  },

  /**
   * Disable MFA
   */
  disableMfa: () => {
    return axiosClient.post('/mfa/disable');
  },

  /**
   * Send OTP (for Email verification or 2FA)
   * @param {String} purpose - e.g., "LOGIN_MFA", "EMAIL_VERIFICATION"
   */
  sendOtp: (purpose) => {
    return axiosClient.post(`/otp/send?purpose=${purpose}`);
  },

  /**
   * Verify OTP
   * @param {Object} data - { code, purpose }
   */
  verifyOtp: (data) => {
    return axiosClient.post('/otp/verify', data);
  }
};
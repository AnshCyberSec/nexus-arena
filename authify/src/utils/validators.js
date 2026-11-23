// src/utils/validators.js

export const validateEmail = (email) => {
  if (!email) return 'Email is required';
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) return 'Please enter a valid email address';
  return '';
};

export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters long';

  // Backend regex se match (1 uppercase, 1 lowercase, 1 number, 1 special char)
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!regex.test(password)) {
    return 'Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character (@$!%*?&)';
  }
  return '';
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return 'Please confirm your password';
  if (password !== confirmPassword) return 'Passwords do not match';
  return '';
};

export const validateName = (name) => {
  if (!name) return 'Full name is required';
  if (name.length < 2) return 'Name must be at least 2 characters';
  if (name.length > 100) return 'Name must not exceed 100 characters';
  return '';
};
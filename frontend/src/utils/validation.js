export function validateName(name) {
  if (name.trim().length < 20 || name.trim().length > 60) {
    return 'Name must be between 20 and 60 characters';
  }
  return '';
}

export function validateAddress(address) {
  if (address && address.length > 400) {
    return 'Address must be at most 400 characters';
  }
  return '';
}

export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email) ? '' : 'Enter a valid email address';
}

export function validatePassword(password) {
  if (password.length < 8 || password.length > 16) {
    return 'Password must be 8–16 characters';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return 'Password must contain at least one special character';
  }
  return '';
}

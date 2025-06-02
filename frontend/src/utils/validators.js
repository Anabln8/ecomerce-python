export function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
  
  export function isStrongPassword(password) {
    return password.length >= 8 && /\d/.test(password) && /[A-Z]/.test(password);
  }
  
  export function doPasswordsMatch(pass1, pass2) {
    return pass1 === pass2;
  }
  
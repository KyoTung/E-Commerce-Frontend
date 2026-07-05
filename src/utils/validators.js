// src/utils/validators.js

export const isValidIMEI = (imei, strict = false) => {
  if (typeof imei !== 'string') return false;
  const trimmed = imei.trim();
  
  // Kiểm tra cơ bản: chỉ chữ số và độ dài 14-16
  if (!/^\d{14,16}$/.test(trimmed)) return false;

  // Nếu chế độ strict, kiểm tra thêm Luhn (chỉ áp dụng cho 15 số)
  if (strict && trimmed.length === 15) {
    let sum = 0;
    for (let i = 0; i < 14; i++) {
      let digit = parseInt(trimmed[i], 10);
      if (i % 2 === 0) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
    }
    const checkDigit = (10 - (sum % 10)) % 10;
    return checkDigit === parseInt(trimmed[14], 10);
  }

  // Mặc định: chỉ cần đúng định dạng số và độ dài
  return true;
};
export function formatPrice(value) {
    return `${value.toFixed(2)} €`;
  }
  
  export function truncate(text, maxLength = 100) {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  }
  
  export function getFromLocalStorage(key, fallback = null) {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  }
  
  export function saveToLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
  
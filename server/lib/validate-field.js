function validateField(field, value) {
  if (!value) {
    return false;
  }
  switch (field) {
    case 'color':
      return value.match(/^#(?:[0-9a-fA-F]{3}){1,2}$/i);
    case 'email':
      return value.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i);
    case 'password':
      return value.match(/^[a-zA-Z0-9]{6,}$/i);
    case 'userName':
      return value.match(/^[a-zA-Z0-9]{6,}$/i);
    default:
      return false;
  }
}
module.exports = validateField;

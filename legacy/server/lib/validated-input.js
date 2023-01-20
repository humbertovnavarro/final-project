const fields = require('./fields');
function ValidatedInput(key, value) {
  this.error = null;
  this.value = value;
  this.key = key;
  if (fields[key] === undefined) {
    this.valid = false;
    this.error = 'That is not a valid data point.';
    return;
  }
  fields[key].regex.forEach(regex => {
    if (!value.match(regex.pattern)) {
      this.valid = false;
      this.error = regex.error;

    }
  });
  this.valid = true;
}
module.exports = ValidatedInput;

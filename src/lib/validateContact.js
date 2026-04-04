// lib/validateContact.js
export function validateContactForm(values) {
  const errors = {};

  const isEmpty = (v) => !v || String(v).trim() === '';

  if (isEmpty(values.firstName)) {
    errors.firstName = 'validation.firstNameRequired';
  } else if (values.firstName.trim().length < 2) {
    errors.firstName = 'validation.firstNameMin';
  }

  if (isEmpty(values.lastName)) {
    errors.lastName = 'validation.lastNameRequired';
  } else if (values.lastName.trim().length < 2) {
    errors.lastName = 'validation.lastNameMin';
  }

  if (isEmpty(values.email)) {
    errors.email = 'validation.emailRequired';
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = 'validation.emailInvalid';
  }

  if (!isEmpty(values.phone)) {
    const phoneRegex = /^[+]?[0-9\s()-]+$/;
    if (
      !phoneRegex.test(values.phone) ||
      values.phone.replace(/\D/g, '').length < 8
    ) {
      errors.phone = 'validation.phoneInvalid';
    }
  }

  if (isEmpty(values.country)) errors.country = 'validation.countryRequired';
  if (isEmpty(values.language)) errors.language = 'validation.languageRequired';
  if (isEmpty(values.service)) errors.service = 'validation.serviceRequired';

  if (isEmpty(values.message) || values.message.trim().length < 10) {
    errors.message = 'validation.messageMin';
  }

  if (!values.terms) errors.terms = 'validation.termsRequired';

  return errors;
}

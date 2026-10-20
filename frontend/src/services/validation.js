/**
 * Checks the checkout form before it is sent.
 * The API checks the same rules again. This only gives faster feedback.
 */

export function validateCheckout(form) {
  const errors = {};

  if (form.customer_name.trim().length < 2) {
    errors.customer_name = "Enter a name between 2 and 120 characters.";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  const digits = form.phone.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 15) {
    errors.phone = "Enter a phone number with 10 to 15 digits.";
  }
  if (form.address_line.trim().length < 5) {
    errors.address_line = "Enter a delivery address between 5 and 255 characters.";
  }
  if (form.city.trim().length < 2) {
    errors.city = "Enter a city.";
  }
  if (form.state.trim().length < 2) {
    errors.state = "Enter a state.";
  }

  const postalCode = form.postal_code.trim();
  if (postalCode.length < 4 || postalCode.length > 10) {
    errors.postal_code = "Enter a postal code of 4 to 10 characters.";
  }
  if (form.notes.trim().length > 500) {
    errors.notes = "Keep the delivery note under 500 characters.";
  }

  return errors;
}

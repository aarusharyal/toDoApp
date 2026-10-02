// Get registration form and input elements.
const form = document.getElementById("formRegistration");
const serverError = document.getElementById("serverError");
const fullName = document.getElementById("fullname");
const email = document.getElementById("email");
const username = document.getElementById("username");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirm-password");

// Validation patterns for supported field formats.
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
const passwordStrengthRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

// Display server-side validation errors returned in URL query parameters.
function showServerError() {
  const params = new URLSearchParams(window.location.search);
  const error = params.get("error");

  if (error === "EmailAlreadyExists") {
    serverError.textContent = "An account with that email already exists.";
  } else {
    serverError.textContent = "";
  }
}

// Show any server error when the page loads.
showServerError();

// Clear validation and server errors while the user types.
fullName.addEventListener("input", () => {
  fullName.setCustomValidity("");
  serverError.textContent = "";
});

email.addEventListener("input", () => {
  email.setCustomValidity("");
  serverError.textContent = "";
});

username.addEventListener("input", () => {
  username.setCustomValidity("");
});

password.addEventListener("input", () => {
  password.setCustomValidity("");
  confirmPassword.setCustomValidity("");
});

confirmPassword.addEventListener("input", () => {
  confirmPassword.setCustomValidity("");
});

// Prevent default submit handling and validate before sending form.
form.addEventListener("submit", function (event) {
  event.preventDefault();

  if (validateRegistrationForm()) {
    form.submit();
  }
});

// Validate all registration fields and set custom errors for invalid input.
function validateRegistrationForm() {
  const fullNameValue = fullName.value.trim();
  const emailValue = email.value.trim();
  const usernameValue = username.value.trim();
  const passwordValue = password.value.trim();
  const confirmPasswordValue = confirmPassword.value.trim();

  // Validate full name.
  if (fullNameValue === "" || fullNameValue.length < 3) {
    fullName.setCustomValidity(
      "Please enter your full name (at least 3 characters)",
    );
  } else {
    fullName.setCustomValidity("");
  }

  // Validate email format.
  if (emailValue === "" || !emailRegex.test(emailValue)) {
    email.setCustomValidity("Please enter a valid email address");
  } else {
    email.setCustomValidity("");
  }

  // Validate username format.
  if (usernameValue === "" || !usernameRegex.test(usernameValue)) {
    username.setCustomValidity(
      "Username should be 3-20 characters and may only contain letters, numbers, and underscores",
    );
  } else {
    username.setCustomValidity("");
  }

  // Validate password strength.
  if (passwordValue === "" || !passwordStrengthRegex.test(passwordValue)) {
    password.setCustomValidity(
      "Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character",
    );
  } else {
    password.setCustomValidity("");
  }

  // Validate password confirmation.
  if (confirmPasswordValue === "" || confirmPasswordValue !== passwordValue) {
    confirmPassword.setCustomValidity("Passwords must match");
  } else {
    confirmPassword.setCustomValidity("");
  }

  // Trigger browser validation messages and return success status.
  return form.reportValidity();
}

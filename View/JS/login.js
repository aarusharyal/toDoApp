"use strict";

console.log("login.js loaded");

const formLogin = document.getElementById("formLogin");
const emailInput = document.getElementById("loginUsername"); // Note: Backend expects 'email'
const passwordInput = document.getElementById("loginPassword");

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || typeof email !== "string") {
    return "Email is required";
  }

  const trimmedEmail = email.trim();

  if (trimmedEmail.length === 0) {
    return "Email cannot be empty";
  }

  if (!emailRegex.test(trimmedEmail)) {
    return "Please enter a valid email address";
  }

  return null; // Valid
}

function validatePassword(password) {
  if (!password || typeof password !== "string") {
    return "Password is required";
  }

  const trimmedPassword = password.trim();

  if (trimmedPassword.length === 0) {
    return "Password cannot be empty";
  }

  if (trimmedPassword.length < 6) {
    return "Password must be at least 6 characters";
  }

  return null; // Valid
}

function validateForm() {
  const emailValue = emailInput.value;
  const passwordValue = passwordInput.value;

  let isValid = true;

  // Validate email
  const emailError = validateEmail(emailValue);
  if (emailError) {
    showError(emailInput, emailError);
    isValid = false;
  } else {
    showSuccess(emailInput);
  }

  // Validate password
  const passwordError = validatePassword(passwordValue);
  if (passwordError) {
    showError(passwordInput, passwordError);
    isValid = false;
  } else {
    showSuccess(passwordInput);
  }

  // Return true only if ALL fields are valid
  return isValid;
}
function showError(input, message) {
  const formControl = input.parentElement;

  // Add error class, remove success class
  formControl.classList.add("error");
  formControl.classList.remove("success");

  // Display error message
  const errorSpan = formControl.querySelector(".error-message");
  if (errorSpan) {
    errorSpan.textContent = message;
    errorSpan.style.display = "block";
  }
}

function showSuccess(input) {
  const formControl = input.parentElement;

  // Add success class, remove error class
  formControl.classList.add("success");
  formControl.classList.remove("error");

  // Hide error message
  const errorSpan = formControl.querySelector(".error-message");
  if (errorSpan) {
    errorSpan.style.display = "none";
  }
}

formLogin.addEventListener("submit", async function (e) {
  // Don't let form submit yet
  e.preventDefault();

  // Validate all fields
  const isValid = validateForm();

  if (!isValid) {
    // Show general error message
    console.log("❌ Form validation failed");
    return; // Don't submit
  }

  console.log("Form validation passed");

  // Form is valid, let it submit to backend
  // Backend will handle actual authentication
  formLogin.submit();
});

emailInput.addEventListener("blur", function () {
  const error = validateEmail(this.value);
  if (error) {
    showError(this, error);
  } else {
    showSuccess(this);
  }
});

passwordInput.addEventListener("blur", function () {
  const error = validatePassword(this.value);
  if (error) {
    showError(this, error);
  } else {
    showSuccess(this);
  }
});

emailInput.addEventListener("focus", function () {
  const formControl = this.parentElement;
  formControl.classList.remove("error");
});

passwordInput.addEventListener("focus", function () {
  const formControl = this.parentElement;
  formControl.classList.remove("error");
});

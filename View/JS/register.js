const form = document.getElementById("formRegistration");
const serverError = document.getElementById("serverError");
const fullName = document.getElementById("fullname");
const email = document.getElementById("email");
const username = document.getElementById("username");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirm-password");

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
const passwordStrengthRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

function showServerError() {
  const params = new URLSearchParams(window.location.search);
  const error = params.get("error");

  if (error === "EmailAlreadyExists") {
    serverError.textContent = "An account with that email already exists.";
  } else {
    serverError.textContent = "";
  }
}

showServerError();

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

form.addEventListener("submit", function (event) {
  event.preventDefault();

  if (validateRegistrationForm()) {
    form.submit();
  }
});

function validateRegistrationForm() {
  const fullNameValue = fullName.value.trim();
  const emailValue = email.value.trim();
  const usernameValue = username.value.trim();
  const passwordValue = password.value.trim();
  const confirmPasswordValue = confirmPassword.value.trim();

  if (fullNameValue === "" || fullNameValue.length < 3) {
    fullName.setCustomValidity(
      "Please enter your full name (at least 3 characters)",
    );
  } else {
    fullName.setCustomValidity("");
  }

  if (emailValue === "" || !emailRegex.test(emailValue)) {
    email.setCustomValidity("Please enter a valid email address");
  } else {
    email.setCustomValidity("");
  }

  if (usernameValue === "" || !usernameRegex.test(usernameValue)) {
    username.setCustomValidity(
      "Username should be 3-20 characters and may only contain letters, numbers, and underscores",
    );
  } else {
    username.setCustomValidity("");
  }

  if (passwordValue === "" || !passwordStrengthRegex.test(passwordValue)) {
    password.setCustomValidity(
      "Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character",
    );
  } else {
    password.setCustomValidity("");
  }

  if (confirmPasswordValue === "" || confirmPasswordValue !== passwordValue) {
    confirmPassword.setCustomValidity("Passwords must match");
  } else {
    confirmPassword.setCustomValidity("");
  }

  return form.reportValidity();
}

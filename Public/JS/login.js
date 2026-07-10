const form = document.getElementById("formLogin");
const username = document.getElementById("loginUsername");
const password = document.getElementById("loginPassword");

console.log("login.js loaded");
form.addEventListener("submit", function (e) {
  e.preventDefault();
  validateForm();
});

function validateForm() {
  const usernameValue = username.value.trim();
  //   const emailValue = username.value.trim();
  const passwordValue = password.value.trim();
  //   const confirmPasswordValue = password.value.trim();

  if (usernameValue === "") {
    showError(username, "Username is required");
  } else {
    showSuccess(username);
  }
  if (passwordValue === "") {
    showError(password, "Password is required");
  } else {
    showSuccess(password);
  }
}

function showError(input, message) {
  const formControl = input.parentElement;
  formControl.classList.add("error");
  formControl.classList.remove("success");
  const small = formControl.querySelector(".error-message");
  small.innerText = message;
  small.style.display = "block";
}
function showSuccess(input) {
  const formControl = input.parentElement;
  formControl.classList.add("success");
  formControl.classList.remove("error");
}

function submitForm(event) {
  event.preventDefault();
  validateForm();
  location.href = "index.html";
}

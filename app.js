function handleCvUpload() {
  const input = document.getElementById("cv-upload");
  const file = input.files[0];
  const statusDiv = document.getElementById("cvStatus");

  if (file) {
    statusDiv.innerHTML = `    <div style = "border: 1px solid #ccc; padding:10px; display:flex; justify-content: space-between; align-items: center;">
      <span>${file.name}</span>
      <span>${(file.size / 1024).toFixed(2)} KB</span>
      <button onclick = "removeCV()" style="background:red; color:white; border:none; padding:5px 10px; cursor:pointer;">Remove</button>
    </div>
   `;
  }
}

function removeCV() {
  const statusDiv = document.getElementById("cvStatus");
  statusDiv.innerHTML = "";

  const oldInput = document.getElementById("cv-upload");
  const newInput = document.cloneNode(true);
  oldInput.parentNode.replaceChild(newInput, oldInput);
  newInput.addEventListener("change", handleCvUpload);
}
class Form {
  constructor(name, email, phone, message, file) {
    (this.name = name),
      (this.email = email),
      (this.phone = phone),
      (this.message = message),
      (this.file = file);
  }
}
class Alert {
  showAlert(message, className) {
    this.clearAlert();
    const div = document.createElement("div");
    div.className = `alert ${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".container");
    const form = document.querySelector(".register-form");
    container.insertBefore(div, form);

    setTimeout(() => {
      this.clearAlert();
    }, 3000);
  }
  clearAlert() {
    const currentAlert = document.querySelector(".alert");

    if (currentAlert) {
      currentAlert.remove();
    }
  }
}

const form = document.getElementById("registerForm");
const status = document.getElementById("my-form-status");

form.addEventListener("submit", async function handleSubmit(event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const message = document.getElementById("message").value.trim();
  const link = document.getElementById("link");

  const alert = new Alert();
  const userForm = new Form(name, email, phone, message, link);

  if (!name || !email || !phone || !message || !link) {
    alert.showAlert("Please fill in all fields.", "error");
    return;
  }

  const data = new FormData();
  data.append("name", name);
  data.append("email", email);
  data.append("phone", phone);
  data.append("message", message);
  data.append("link", link);
  alert.showAlert("⏳ Submitting your application...", "info");
  fetch(form.action, {
    method: form.method,
    body: data,
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        alert.showAlert("Your Application has been submitted ✅", "success");
        form.reset();

        setTimeout(() => {
          window.location.href = "/thank-you.html";
        }, 3000);
      } else {
        response.json().then((data) => {
          if (Object.hasOwn(data, "errors")) {
            const errorMsg = data["errors"]
              .map((error) => error["message"])
              .join(", ");
            alert.showAlert(errorMsg, "error");
          } else {
            alert.showAlert(
              "Oops! There was a problem submitting your form",
              "error"
            );
          }
        });
      }
    })
    .catch(() => {
      alert.showAlert("Network error. Please check your connection.", "error");
    });
});

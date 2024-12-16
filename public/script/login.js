export function inicializarLogin() {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  const showRegisterButton = document.getElementById("showRegisterForm");
  const showLoginButton = document.getElementById("showLoginForm");

  const errorModal = document.getElementById("errorModal");
  const modalErrorMessage = document.getElementById("modalErrorMessage");
  const closeModal = document.getElementById("closeModal");

  function mostrarModalError(mensaje) {
    modalErrorMessage.textContent = mensaje;
    errorModal.classList.remove("hidden");
  }

  closeModal.addEventListener("click", () => {
    errorModal.classList.add("hidden");
  });

  showRegisterButton.addEventListener("click", () => {
    loginForm.classList.add("hidden");
    registerForm.classList.remove("hidden");
  });

  showLoginButton.addEventListener("click", () => {
    registerForm.classList.add("hidden");
    loginForm.classList.remove("hidden");
  });

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const response = await fetch("/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailInput.value,
          contraseña: passwordInput.value,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        sessionStorage.setItem("usuario", JSON.stringify(data.usuario));
        window.location.href = "../pages/home.html";
      } else {
        const errorData = await response.json();
        mostrarModalError(errorData.message || "Error al iniciar sesión");
      }
    } catch (error) {
      mostrarModalError("Se produjo un error al intentar ingresar al sistema");
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    const newName = document.getElementById("newName").value;
    const newLastName = document.getElementById("newLastName").value;
    const newAddress = document.getElementById("newAddress").value;
    const newEmail = document.getElementById("newEmail").value;
    const newPassword = document.getElementById("newPassword").value;

    try {
      const response = await fetch("/usuarios/usuarioNuevo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: newName,
          apellido: newLastName,
          direccion: newAddress,
          email: newEmail,
          contraseña: newPassword,
        }),
      });

      if (response.ok) {
        alert("Registro exitoso. Ahora puedes iniciar sesión.");
        showLoginButton.click();
      } else {
        const errorData = await response.json();
        mostrarModalError(errorData.message || "Error al registrar usuario");
      }
    } catch (error) {
      mostrarModalError("Se produjo un error al intentar registrar el usuario");
    }
  }

  loginForm.addEventListener("submit", handleLogin);
  registerForm.addEventListener("submit", handleRegister);
}

// Inicializa EmailJS
(function () {
  emailjs.init({
    publicKey: "d6cClnGrNJL2j-Jh3",
  });
})();

// ==== Função TOAST ====
function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");

  const toast = document.createElement("div");
  toast.classList.add("toast", type);
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => toast.remove(), 4000);
}

// ==== Overlay de carregamento ====
const loadingOverlay = document.getElementById("loading-overlay");

function showLoading() {
  loadingOverlay.style.display = "flex";
}

function hideLoading() {
  loadingOverlay.style.display = "none";
}

// ==== FORM DE RECUPERAÇÃO ====
document
  .getElementById("recuperarForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const emailusuario = document.getElementById("email").value.trim();

    if (!emailusuario) {
      showToast("Digite um e-mail válido.", "error");
      return;
    }

    const linkRedefinicao = `https://seudominio.com/redefinir-senha?email=${encodeURIComponent(
      emailusuario
    )}`;

    const params = {
      emailusuario: emailusuario,
      email: emailusuario,
      link: linkRedefinicao,
      from_name: "Central de Serviço TI",
    };

    // Mostra carregamento
    showLoading();

    emailjs
      .send("service_ybwlqbt", "template_ytcqvfn", params)
      .then(() => {
        hideLoading();
        showToast(
          `Um e-mail foi enviado para ${emailusuario} com instruções para a redefinição de senha.`,
          "success"
        );

        document.getElementById("recuperarForm").reset();
      })
      .catch((error) => {
        hideLoading();
        console.error("Erro ao enviar e-mail:", error);
        showToast("Erro ao enviar o e-mail. Tente novamente.", "error");
      });
  });

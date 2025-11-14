// ================================
// CONFIGURAÇÃO DO SUPABASE
// ================================
const SUPABASE_URL = "https://ilnilousfwignxliyjqv.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlsbmlsb3VzZndpZ254bGl5anF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NjIzMTAsImV4cCI6MjA3ODAzODMxMH0.c2TTA1Mk7wu2SGYk7sZrY4mMp-O2PATcuRCIKUsRCpQ";

// ================================
// LOGIN ATUALIZADO
// ================================
document.addEventListener("DOMContentLoaded", function () {
  const btnLogin = document.querySelector(".btn-login");
  const toastContainer = document.getElementById("toast-container");
  const loadingOverlay = document.getElementById("loading-overlay");

  // Função padrão de toasts
  function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.classList.add("toast", type);
    toast.textContent = message;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  }

  btnLogin.addEventListener("click", async function () {
    const email = document.getElementById("email").value.trim().toLowerCase();
    const senha = document.getElementById("senha").value.trim();

    // ============================
    // VALIDAÇÕES PADRONIZADAS
    // ============================
    if (!email || !senha) {
      showToast("Preencha todos os campos.", "error");
      return;
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailValido.test(email)) {
      showToast("Adicione um email válido.", "error");
      return;
    }

    // ============================
    // MOSTRAR LOADING
    // ============================
    loadingOverlay.style.display = "flex";

    try {
      // Buscar o usuário
      const resposta = await fetch(
        `${SUPABASE_URL}/rest/v1/usuarios?email=eq.${email}&senha=eq.${senha}&select=*`,
        {
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
          },
        }
      );

      const usuarios = await resposta.json();

      loadingOverlay.style.display = "none";

      if (usuarios.length === 0) {
        showToast("Email ou senha incorretos.", "error");
        return;
      }

      const usuario = usuarios[0];

      // Salvar usuário
      localStorage.setItem("usuarioLogado", JSON.stringify(usuario));

      // Sucesso
      showToast(`Bem-vindo(a), ${usuario.nome}!`, "success");

      // Redirecionamento
      setTimeout(() => {
        switch (usuario.cargo) {
          case "aluno":
            window.location.href = "./aluno.html";
            break;
          case "analista":
            window.location.href = "./analista.html";
            break;
          case "gestor":
            window.location.href = "./gestor.html";
            break;
          default:
            showToast("Cargo inválido cadastrado para este usuário.", "error");
        }
      }, 1200);
    } catch (erro) {
      loadingOverlay.style.display = "none";
      console.error("Erro no login:", erro);
      showToast("Erro ao conectar com o servidor.", "error");
    }
  });
});

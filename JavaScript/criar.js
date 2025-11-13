document.addEventListener("DOMContentLoaded", function () {
  const btnCriar = document.querySelector(".btn-criar");
  const toastContainer = document.getElementById("toast-container");
  const loadingOverlay = document.getElementById("loading-overlay");

  // Função para exibir toasts (mensagens flutuantes)
  function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.classList.add("toast", type);
    toast.textContent = message;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  }

  // Configurações Supabase
  const SUPABASE_URL = "https://ilnilousfwignxliyjqv.supabase.co";
  const SUPABASE_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlsbmlsb3VzZndpZ254bGl5anF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NjIzMTAsImV4cCI6MjA3ODAzODMxMH0.c2TTA1Mk7wu2SGYk7sZrY4mMp-O2PATcuRCIKUsRCpQ";
  const TABLE_NAME = "usuarios";

  btnCriar.addEventListener("click", async function () {
    const nome = document.getElementById("nome").value.trim();
    const sobrenome = document.getElementById("sobrenome").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();
    const cargo = document.getElementById("tipo").value.trim();

    // Validações
    if (!nome || !sobrenome || !email || !senha || !cargo) {
      showToast("Preencha todos os campos.", "error");
      return;
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailValido.test(email)) {
      showToast("Adicione um email válido.", "error");
      return;
    }

    if (senha.length < 6) {
      showToast("A senha deve ter no mínimo 6 caracteres.", "error");
      return;
    }

    // Exibir spinner
    loadingOverlay.style.display = "flex";

    try {
      // Verifica se já existe
      const check = await fetch(
        `${SUPABASE_URL}/rest/v1/${TABLE_NAME}?email=eq.${email}`,
        {
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
          },
        }
      );
      const usuariosExistentes = await check.json();

      if (usuariosExistentes.length > 0) {
        showToast("Esse e-mail já está cadastrado!", "error");
        loadingOverlay.style.display = "none";
        return;
      }

      // Envio para Supabase
      const resposta = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE_NAME}`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify({ nome, sobrenome, email, senha, cargo }),
      });

      loadingOverlay.style.display = "none";

      if (!resposta.ok) {
        showToast("Erro ao criar conta. Tente novamente.", "error");
        return;
      }

      // Sucesso
      showToast(`Usuário ${nome} cadastrado com sucesso!`, "success");

      // Limpa campos
      ["nome", "sobrenome", "email", "senha", "tipo"].forEach((id) => {
        document.getElementById(id).value = "";
      });

      // Redireciona após 2s
      setTimeout(() => (window.location.href = "./index.html"), 2000);
    } catch (err) {
      loadingOverlay.style.display = "none";
      console.error("Erro:", err);
      showToast("Falha na conexão. Verifique sua internet.", "error");
    }
  });
});

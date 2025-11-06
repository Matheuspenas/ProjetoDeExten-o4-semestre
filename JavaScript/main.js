document.addEventListener("DOMContentLoaded", function () {
  const btnLogin = document.querySelector(".btn-login");
  const emailInput = document.getElementById("email");
  const senhaInput = document.getElementById("senha");

  if (!btnLogin || !emailInput || !senhaInput) {
    console.error("Botão ou campos do login não encontrados!");
    return;
  }

  // CONFIGURAÇÕES DO SUPABASE
const SUPABASE_URL = "https://ilnilousfwignxliyjqv.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlsbmlsb3VzZndpZ254bGl5anF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NjIzMTAsImV4cCI6MjA3ODAzODMxMH0.c2TTA1Mk7wu2SGYk7sZrY4mMp-O2PATcuRCIKUsRCpQ";
  const TABLE_NAME = "usuarios";

  btnLogin.addEventListener("click", async function () {
    const email = emailInput.value.trim().toLowerCase();
    const senha = senhaInput.value.trim();

    // Validações
    if (!email || !senha) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailValido.test(email)) {
      alert("E-mail inválido.");
      return;
    }

    if (senha.length < 6) {
      alert("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    try {
      // Busca usuário pelo email
      const resposta = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE_NAME}?email=eq.${email}`, {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      });

      if (!resposta.ok) {
        throw new Error("Erro ao conectar com o banco.");
      }

      const usuarios = await resposta.json();

      if (usuarios.length === 0) {
        alert("Usuário não encontrado.");
        return;
      }

      const usuario = usuarios[0];

      // Verifica senha
      if (usuario.senha !== senha) {
        alert("Senha incorreta.");
        return;
      }

      // Redireciona conforme cargo
      switch (usuario.cargo) {
        case "gestor":
          window.location.href = "./gestor.html";
          break;
        case "analista":
          window.location.href = "./analista.html";
          break;
        case "aluno":
          window.location.href = "./aluno.html";
          break;
        default:
          alert("Tipo de usuário inválido.");
      }
    } catch (err) {
      console.error("Erro no login:", err);
      alert("Não foi possível conectar ao banco. Verifique sua internet.");
    }
  });
});
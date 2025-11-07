// ================================
// CONFIGURAÇÃO DO SUPABASE
// ================================
const SUPABASE_URL = "https://ilnilousfwignxliyjqv.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlsbmlsb3VzZndpZ254bGl5anF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NjIzMTAsImV4cCI6MjA3ODAzODMxMH0.c2TTA1Mk7wu2SGYk7sZrY4mMp-O2PATcuRCIKUsRCpQ";

// ================================
// LOGIN
// ================================
document.addEventListener("DOMContentLoaded", function () {
  const btnLogin = document.querySelector(".btn-login");

  btnLogin.addEventListener("click", async function () {
    const email = document.getElementById("email").value.trim().toLowerCase();
    const senha = document.getElementById("senha").value.trim();

    if (!email || !senha) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    try {
      // Busca o usuário no Supabase
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

      if (usuarios.length === 0) {
        alert("Email ou senha incorretos.");
        return;
      }

      const usuario = usuarios[0];
      console.log("Usuário logado:", usuario);

      // Salva o usuário logado no localStorage
      localStorage.setItem("usuarioLogado", JSON.stringify(usuario));

      // Redireciona conforme o cargo
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
          alert("Cargo de usuário desconhecido.");
      }
    } catch (erro) {
      console.error("Erro no login:", erro);
      alert("Erro ao conectar com o servidor.");
    }
  });
});

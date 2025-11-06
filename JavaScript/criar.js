document.addEventListener("DOMContentLoaded", function () {
  const btnCriar = document.querySelector(".btn-criar");

  // CONFIGURAÇÕES DO SUPABASE
const SUPABASE_URL = "https://ilnilousfwignxliyjqv.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlsbmlsb3VzZndpZ254bGl5anF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NjIzMTAsImV4cCI6MjA3ODAzODMxMH0.c2TTA1Mk7wu2SGYk7sZrY4mMp-O2PATcuRCIKUsRCpQ";
  const TABLE_NAME = "usuarios";

  btnCriar.addEventListener("click", async function () {
    const nome = document.getElementById("nome").value.trim();
    const sobrenome = document.getElementById("sobrenome").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();
    const cargo = document.getElementById("tipo").value.trim();

    // === Validações básicas ===
    if (!nome || !sobrenome || !email || !senha || !cargo) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailValido.test(email)) {
      alert("Por favor, insira um e-mail válido.");
      return;
    }

    if (senha.length < 6) {
      alert("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    try {
      // === Verificar se o e-mail já existe ===
      const check = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE_NAME}?email=eq.${email}`, {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      });

      const usuariosExistentes = await check.json();
      if (usuariosExistentes.length > 0) {
        alert("Esse e-mail já está cadastrado!");
        return;
      }

      // === Envio para o Supabase ===
      const resposta = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE_NAME}`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          nome,
          sobrenome,
          email,
          senha, // ⚠️ apenas texto puro por enquanto
          cargo,
        }),
      });

      if (!resposta.ok) {
        const erro = await resposta.json();
        console.error("Erro ao inserir:", erro);
        alert("Erro ao criar conta. Tente novamente.");
        return;
      }

      // === Modal de sucesso ===
      const modal = document.getElementById("modal-sucesso");
      modal.style.display = "flex";
      document.getElementById("mensagem-modal").textContent = `Usuário ${nome} cadastrado com sucesso!`;

      document.querySelector(".btn-ok").onclick = () => {
        modal.style.display = "none";
        // Limpar formulário
        document.getElementById("nome").value = "";
        document.getElementById("sobrenome").value = "";
        document.getElementById("email").value = "";
        document.getElementById("senha").value = "";
        document.getElementById("tipo").value = "";
        // Redireciona para login
        window.location.href = "./index.html";
      };
      document.querySelector(".close-btn").onclick = () => (modal.style.display = "none");

    } catch (err) {
      console.error("Erro de conexão:", err);
      alert("Não foi possível conectar ao banco. Verifique sua internet.");
    }
  });
});
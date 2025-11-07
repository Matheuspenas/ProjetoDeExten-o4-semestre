// ================================
// CONFIGURAÇÕES DO SUPABASE
// ================================
const SUPABASE_URL = "https://ilnilousfwignxliyjqv.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlsbmlsb3VzZndpZ254bGl5anF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NjIzMTAsImV4cCI6MjA3ODAzODMxMH0.c2TTA1Mk7wu2SGYk7sZrY4mMp-O2PATcuRCIKUsRCpQ";

const TABLE_NAME = "chamados";

// ================================
// ELEMENTOS DA PÁGINA
// ================================
const modal = document.getElementById("modal");
const btnNovo = document.querySelector(".btn-novo");
const spanClose = document.querySelector(".close");
const formChamado = document.getElementById("formChamado");
const chamadosContainer = document.querySelector(".chamados");
const semChamados = document.querySelector(".sem-chamados");
const btnVerMais = document.querySelector(".btn-ver-mais");
const darkModeToggle = document.getElementById("darkModeToggle");

// ================================
// MODO ESCURO
// ================================
darkModeToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark-mode", darkModeToggle.checked);
});

// ================================
// MODAL
// ================================
btnNovo.addEventListener("click", () => (modal.style.display = "block"));
spanClose.addEventListener("click", () => (modal.style.display = "none"));
window.addEventListener("click", (e) => {
  if (e.target === modal) modal.style.display = "none";
});

// ================================
// FUNÇÃO: ATUALIZAR VISUALIZAÇÃO
// ================================
function atualizarCards() {
  const cards = document.querySelectorAll(".chamados .card");
  if (cards.length === 0) {
    semChamados.style.display = "block";
    btnVerMais.style.display = "none";
  } else {
    semChamados.style.display = "none";
    cards.forEach((card, index) => {
      if (index > 2) card.classList.add("hidden");
      else card.classList.remove("hidden");
    });
    btnVerMais.style.display = cards.length > 3 ? "inline-block" : "none";
    btnVerMais.textContent = "Ver mais";
  }
}

// ================================
// BOTÃO VER MAIS / VER MENOS
// ================================
btnVerMais.addEventListener("click", () => {
  const ocultos = document.querySelectorAll(".card.hidden");
  if (ocultos.length > 0) {
    document
      .querySelectorAll(".card")
      .forEach((c) => c.classList.remove("hidden"));
    btnVerMais.textContent = "Ver menos";
  } else {
    atualizarCards();
    btnVerMais.textContent = "Ver mais";
  }
});

// ================================
// FUNÇÃO: CARREGAR CHAMADOS DO BANCO
// ================================
async function carregarChamados() {
  try {
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
    const usuario_id = usuarioLogado?.id;

    if (!usuario_id) {
      console.warn("Nenhum usuário logado encontrado.");
      return;
    }

    const resposta = await fetch(
      `${SUPABASE_URL}/rest/v1/${TABLE_NAME}?usuario_id=eq.${usuario_id}&select=*`,
      {
        method: "GET",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      }
    );

    if (!resposta.ok) {
      throw new Error("Erro ao carregar chamados");
    }

    const chamados = await resposta.json();
    chamadosContainer.innerHTML = "";

    if (chamados.length === 0) {
      semChamados.style.display = "block";
    } else {
      semChamados.style.display = "none";

      const chamadosOrdenados = chamados.sort(
        (a, b) => new Date(b.criado_em) - new Date(a.criado_em)
      );

      chamadosOrdenados.forEach((c) => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
          <h3>${c.titulo}</h3>
          <p><strong>Tipo:</strong> ${c.tipo || "Não informado"}</p>
          <p><strong>Descrição:</strong> ${c.descricao}</p>
          <p><strong>Status:</strong> ${c.status}</p>
          <p><strong>Prioridade:</strong> ${c.prioridade}</p>
          <p><strong>Criado em:</strong> ${new Date(c.criado_em).toLocaleString(
            "pt-BR"
          )}</p>
        `;
        chamadosContainer.appendChild(card);
      });
    }

    atualizarCards();
  } catch (erro) {
    console.error("Erro ao carregar chamados:", erro);
  }
}

// ================================
// FUNÇÃO: CADASTRAR NOVO CHAMADO
// ================================
formChamado.addEventListener("submit", async (e) => {
  e.preventDefault();

  const titulo = document.getElementById("titulo").value.trim();
  const tipo = document.getElementById("tipo").value.trim();
  const descricao = document.getElementById("descricao").value.trim();

  if (!titulo || !tipo || !descricao) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
  const usuario_id = usuarioLogado?.id;

  if (!usuario_id) {
    alert("Erro: Usuário não identificado. Faça login novamente.");
    window.location.href = "./index.html";
    return;
  }

  try {
    const resposta = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE_NAME}`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        titulo,
        tipo,
        descricao,
        status: "Aberto",
        prioridade: "Não definida", // valor padrão aqui também
        usuario_id,
      }),
    });

    if (!resposta.ok) {
      const erro = await resposta.json();
      console.error("Erro ao criar chamado:", erro);
      alert("Erro ao criar chamado. Tente novamente.");
      return;
    }

    formChamado.reset();
    modal.style.display = "none";
    carregarChamados();
    alert("Chamado cadastrado com sucesso!");
  } catch (err) {
    console.error("Erro de conexão:", err);
    alert("Não foi possível conectar ao banco. Verifique sua internet.");
  }
});

// ================================
// INICIALIZAÇÃO
// ================================
carregarChamados();

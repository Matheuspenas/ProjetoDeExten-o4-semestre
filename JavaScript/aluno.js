// Seletores principais
const modal = document.getElementById("modal");
const btnNovo = document.querySelector(".btn-novo");
const spanClose = document.querySelector(".close");
const formChamado = document.getElementById("formChamado");
const chamadosContainer = document.querySelector(".chamados");
const semChamados = document.querySelector(".sem-chamados");
const btnVerMais = document.querySelector(".btn-ver-mais");
const darkModeToggle = document.getElementById("darkModeToggle");

darkModeToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark-mode", darkModeToggle.checked);
});

// Abrir e fechar modal
btnNovo.addEventListener("click", () => (modal.style.display = "block"));
spanClose.addEventListener("click", () => (modal.style.display = "none"));
window.addEventListener("click", (e) => {
  if (e.target === modal) modal.style.display = "none";
});

// Função para atualizar visibilidade de cards
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
    btnVerMais.textContent = "Ver menos";
  }
}

// Alternar entre ver mais e ver menos
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

// Carregar chamados do localStorage
function carregarChamados() {
  const chamados = JSON.parse(localStorage.getItem("chamados")) || [];
  chamadosContainer.innerHTML = "";

  if (chamados.length === 0) {
    semChamados.style.display = "block";
  } else {
    semChamados.style.display = "none";
    const chamadosReversos = chamados.slice().reverse();

    chamadosReversos.forEach((c) => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = `
        <h3>${c.titulo}</h3>
        <p><strong>Tipo de Solicitação:</strong> ${
          c.tipo || "Não Informado"
        }</p>
        <p><strong>Descrição:</strong> ${c.descricao}</p>
        <p><strong>Criado em:</strong> ${c.criadoEm}</p>
        ${
          c.atualizadoEm
            ? `<p><strong>Última atualização:</strong> ${c.atualizadoEm}</p>`
            : ""
        }
        <p><strong>Prioridade:</strong> ${c.prioridade}</p>
        <p class="status"><strong>Status:</strong>
          <span class="estado ${c.status.toLowerCase().replace(" ", "-")}">${
        c.status
      }</span>
        </p>
      `;
      chamadosContainer.appendChild(card);
    });
  }
  atualizarCards();
}

// Adicionar novo chamado
formChamado.addEventListener("submit", (e) => {
  e.preventDefault();
  const titulo = document.getElementById("titulo").value;
  // Renomeado de 'departamento' para 'tipo'
  const tipo = document.getElementById("tipo").value;
  const descricao = document.getElementById("descricao").value;

  // Gera data e hora automática
  const agora = new Date();
  const dataHora = agora.toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });

  const chamados = JSON.parse(localStorage.getItem("chamados")) || [];
  const novoChamado = {
    id: Date.now(),
    titulo,
    tipo, // Renomeado de 'departamento' para 'tipo'
    descricao,
    status: "Aberto",
    prioridade: "Baixa",
    criadoEm: dataHora,
    atualizadoEm: null,
  };

  chamados.push(novoChamado);
  localStorage.setItem("chamados", JSON.stringify(chamados));

  formChamado.reset();
  modal.style.display = "none";
  carregarChamados();
});

// Inicialização
carregarChamados();

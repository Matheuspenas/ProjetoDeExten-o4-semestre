// Script simples para abrir/fechar o menu
const toggle = document.getElementById("menu-toggle");
const menu = document.getElementById("menu");

toggle.addEventListener("click", () => {
  menu.classList.toggle("open");
});

// Selecionando elementos
const modal = document.getElementById("modal");
const btnNovo = document.querySelector(".btn-novo");
const spanClose = document.querySelector(".close");
const formChamado = document.getElementById("formChamado");
const chamadosContainer = document.querySelector(".chamados");

// Abrir modal
btnNovo.addEventListener("click", () => {
  modal.style.display = "block";
});

// Fechar modal
spanClose.addEventListener("click", () => {
  modal.style.display = "none";
});

// Fechar clicando fora do modal
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

// Cadastrar chamado
formChamado.addEventListener("submit", (e) => {
  e.preventDefault();

  const titulo = document.getElementById("titulo").value;
  const descricao = document.getElementById("descricao").value;

  // Criar novo card com status "Aberto"
  const card = document.createElement("div");
  card.classList.add("card");
  card.innerHTML = `
    <h3>${titulo}</h3>
    <p><strong>Descrição:</strong> ${descricao}</p>
    <p class="status aberto">Status: Aberto</p>
  `;

  chamadosContainer.appendChild(card);

  // Fechar modal e resetar formulário
  modal.style.display = "none";
  formChamado.reset();
});

const btnVerMais = document.querySelector(".btn-ver-mais");

// Função para atualizar visibilidade dos cards
function atualizarCards() {
  const cards = document.querySelectorAll(".chamados .card");
  cards.forEach((card, index) => {
    if (index > 2) {
      card.classList.add("hidden");
    } else {
      card.classList.remove("hidden");
    }
  });

  // Se houver mais de 3 cards, exibe o botão
  if (cards.length > 3) {
    btnVerMais.style.display = "inline-block";
    btnVerMais.textContent = "Ver mais ↓";
  } else {
    btnVerMais.style.display = "none";
  }
}

// Inicializa a exibição
atualizarCards();

// Toggle "Ver mais"
btnVerMais.addEventListener("click", () => {
  const cards = document.querySelectorAll(".chamados .card.hidden");
  if (cards.length > 0) {
    // Revela todos os cards ocultos
    document
      .querySelectorAll(".chamados .card")
      .forEach((card) => card.classList.remove("hidden"));
    btnVerMais.textContent = "Ver menos ↑";
  } else {
    // Oculta novamente os cards extras
    atualizarCards();
  }
});

// Cadastro de novo chamado
formChamado.addEventListener("submit", (e) => {
  e.preventDefault();

  const titulo = document.getElementById("titulo").value;
  const descricao = document.getElementById("descricao").value;

  const card = document.createElement("div");
  card.classList.add("card");
  card.innerHTML = `
    <h3>${titulo}</h3>
    <p><strong>Descrição:</strong> ${descricao}</p>
    <p class="status aberto">Status: Aberto</p>
  `;

  chamadosContainer.appendChild(card);

  modal.style.display = "none";
  formChamado.reset();

  // Atualiza visibilidade dos cards após adicionar
  atualizarCards();
});

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

// Criar elemento da mensagem "Não há chamados"
let semChamados = document.querySelector(".sem-chamados");
if (!semChamados) {
  semChamados = document.createElement("p");
  semChamados.classList.add("sem-chamados");
  semChamados.textContent = "Não há chamados no momento";
  chamadosContainer.appendChild(semChamados);
}

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

const btnVerMais = document.querySelector(".btn-ver-mais");

// Função para atualizar visibilidade dos cards e da mensagem
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

// Inicializa a exibição
atualizarCards();

// Toggle "Ver mais"
btnVerMais.addEventListener("click", () => {
  const cardsOcultos = document.querySelectorAll(".chamados .card.hidden");
  if (cardsOcultos.length > 0) {
    document
      .querySelectorAll(".chamados .card")
      .forEach((card) => card.classList.remove("hidden"));
    btnVerMais.textContent = "Ver menos";
  } else {
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
    <p class="status"><strong>Status:</strong> <span class="estado aberto">Aberto</span></p>
  `;

  chamadosContainer.appendChild(card);
  modal.style.display = "none";
  formChamado.reset();

  atualizarCards();
});

// CONFIGURAÇÕES DO SUPABASE

const SUPABASE_URL = "https://ilnilousfwignxliyjqv.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlsbmlsb3VzZndpZ254bGl5anF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NjIzMTAsImV4cCI6MjA3ODAzODMxMH0.c2TTA1Mk7wu2SGYk7sZrY4mMp-O2PATcuRCIKUsRCpQ";
const TABLE_NAME = "chamados";

// Declarando os ELEMENTOS DO HTML
const listaChamados = document.querySelector(".lista-chamados");
const filtroStatus = document.getElementById("filtro-status");
const filtroPrioridade = document.getElementById("filtro-prioridade");
const filtroTipo = document.getElementById("filtro-tipo");
const semChamados = document.querySelector(".sem-chamados");

const darkModeToggle = document.getElementById("darkModeToggle");
const userIcon = document.getElementById("userIcon");
const userDropdown = document.getElementById("userDropdown");
const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");
const btnLogout = document.getElementById("btnLogout");

// Variáveis carregadas depois do DOM
let toastContainer;
let loadingOverlay;

// GARANTIR QUE O DOM EXISTE ANTES DE ATIVAR TOAST E LOADING

document.addEventListener("DOMContentLoaded", () => {
  toastContainer = document.getElementById("toast-container");
  loadingOverlay = document.getElementById("loadingOverlay");

  console.log("DOM Loaded: Toast e Loading prontos.");
});

// FUNÇÃO DE TOAST

function showToast(message, type = "success") {
  if (!toastContainer) return;

  const toast = document.createElement("div");
  toast.classList.add("toast", type);
  toast.textContent = message;

  // MODO ESCURO AUTOMÁTICO
  if (document.body.classList.contains("dark-mode")) {
    toast.style.background = "#222";
    toast.style.color = "#fff";
  } else {
    toast.style.background = "#fff";
    toast.style.color = "#000";
  }

  toastContainer.appendChild(toast);

  setTimeout(() => toast.remove(), 4000);
}

// LOADING

function showLoading() {
  if (!loadingOverlay) return;

  loadingOverlay.style.display = "flex";

  if (document.body.classList.contains("dark-mode")) {
    loadingOverlay.style.background = "rgba(0,0,0,0.75)";
  } else {
    loadingOverlay.style.background = "rgba(255,255,255,0.75)";
  }
}

function hideLoading() {
  if (loadingOverlay) loadingOverlay.style.display = "none";
}

// MODO ESCURO

darkModeToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark-mode", darkModeToggle.checked);
});

// CARREGAR DADOS DO USUÁRIO

userIcon.addEventListener("click", () => {
  userDropdown.classList.toggle("show");
  carregarUsuario();
});

btnLogout.addEventListener("click", () => {
  localStorage.removeItem("usuarioLogado");
  window.location.href = "./index.html";
});

function carregarUsuario() {
  const u = JSON.parse(localStorage.getItem("usuarioLogado"));
  if (!u) return;
  userName.textContent = `${u.nome} ${u.sobrenome}`;
  userEmail.textContent = u.email;
}

// CARREGAR CHAMADOS DO SUPABASE

async function carregarChamados() {
  showLoading();

  try {
    const url = `${SUPABASE_URL}/rest/v1/${TABLE_NAME}?select=*,usuario_id(nome,sobrenome)&order=criado_em.desc`;

    const resposta = await fetch(url, {
      method: "GET",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    });

    if (!resposta.ok) throw new Error("Falha ao carregar chamados.");

    const chamados = await resposta.json();
    listaChamados.innerHTML = "";

    if (chamados.length === 0) {
      semChamados.style.display = "block";
      hideLoading();
      return;
    }

    semChamados.style.display = "none";

    chamados.forEach((c) => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.dataset.id = c.id;

      card.innerHTML = `
        <h3>${c.titulo}</h3>

        <p><strong>Usuário:</strong> ${
          c.usuario_id ? `${c.usuario_id.nome} ${c.usuario_id.sobrenome}` : "—"
        }</p>

        <p><strong>Descrição:</strong> ${c.descricao}</p>

        <p><strong>Tipo de Solicitação:</strong> ${
          c.tipo ?? "Não informado"
        }</p>

        <label>Status:</label>
        <select class="select-status">
          <option ${c.status === "Aberto" ? "selected" : ""}>Aberto</option>
          <option ${
            c.status === "Em andamento" ? "selected" : ""
          }>Em andamento</option>
          <option ${
            c.status === "Finalizado" ? "selected" : ""
          }>Finalizado</option>
        </select>

        <label>Prioridade:</label>
        <select class="select-prioridade">
          <option ${c.prioridade === "Baixa" ? "selected" : ""}>Baixa</option>
          <option ${c.prioridade === "Média" ? "selected" : ""}>Média</option>
          <option ${c.prioridade === "Alta" ? "selected" : ""}>Alta</option>
          <option ${
            c.prioridade === "Urgente" ? "selected" : ""
          }>Urgente</option>
          <option ${
            c.prioridade === "Não definido" ? "selected" : ""
          }>Não definido</option>
        </select>

        <p><strong>Criado em:</strong> ${new Date(c.criado_em).toLocaleString(
          "pt-BR"
        )}</p>

        ${
          c.atualizado_em
            ? `<p><strong>Última atualização:</strong> ${new Date(
                c.atualizado_em
              ).toLocaleString("pt-BR")}</p>`
            : ""
        }

        <button class="btn-salvar">Salvar Alterações</button>
      `;

      card.querySelector(".btn-salvar").addEventListener("click", () => {
        atualizarChamado(c.id, card);
      });

      listaChamados.appendChild(card);
    });

    aplicarFiltros();
  } catch (erro) {
    console.error(erro);
    showToast("Erro ao carregar chamados.", "error");
  }

  hideLoading();
}

// ATUALIZAR CHAMADO

async function atualizarChamado(id, card) {
  showLoading();

  const status = card.querySelector(".select-status").value;
  const prioridade = card.querySelector(".select-prioridade").value;

  try {
    const resposta = await fetch(
      `${SUPABASE_URL}/rest/v1/${TABLE_NAME}?id=eq.${id}`,
      {
        method: "PATCH",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          status,
          prioridade,
          atualizado_em: new Date().toISOString(),
        }),
      }
    );

    if (!resposta.ok) throw new Error("Falha ao atualizar chamado");

    showToast("Chamado atualizado!", "success");
    carregarChamados();
  } catch (erro) {
    console.error(erro);
    showToast("Erro ao atualizar chamado.", "error");
  }

  hideLoading();
}

// FILTROS

filtroStatus.addEventListener("change", aplicarFiltros);
filtroPrioridade.addEventListener("change", aplicarFiltros);
filtroTipo.addEventListener("change", aplicarFiltros);

function aplicarFiltros() {
  const fStatus = filtroStatus.value;
  const fPrioridade = filtroPrioridade.value;
  const fTipo = filtroTipo.value;

  const cards = document.querySelectorAll(".lista-chamados .card");

  let algum = false;

  cards.forEach((card) => {
    const status = card.querySelector(".select-status").value;
    const prioridade = card.querySelector(".select-prioridade").value;
    const tipo = card
      .querySelector("p:nth-child(4)")
      .textContent.split(": ")[1];

    const ok =
      (!fStatus || status === fStatus) &&
      (!fPrioridade || prioridade === fPrioridade) &&
      (!fTipo || tipo === fTipo);

    card.style.display = ok ? "block" : "none";

    if (ok) algum = true;
  });

  semChamados.style.display = algum ? "none" : "block";
}

// INICIALIZAÇÃO

carregarChamados();

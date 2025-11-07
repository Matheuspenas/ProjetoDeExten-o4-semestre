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
const listaChamados = document.querySelector(".lista-chamados");
const filtroStatus = document.getElementById("filtro-status");
const filtroPrioridade = document.getElementById("filtro-prioridade");
const filtroTipo = document.getElementById("filtro-tipo");
const semChamados = document.querySelector(".sem-chamados");

// ================================
// FUNÇÃO: CARREGAR CHAMADOS DO SUPABASE
// ================================
async function carregarChamados() {
  try {
    // Busca todos os chamados com info do usuário
    const url = `${SUPABASE_URL}/rest/v1/${TABLE_NAME}?select=*,usuario_id(nome,sobrenome)&order=criado_em.desc`;
    const resposta = await fetch(url, {
      method: "GET",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    });

    if (!resposta.ok) throw new Error("Erro ao carregar chamados");

    const chamados = await resposta.json();
    listaChamados.innerHTML = "";

    if (chamados.length === 0) {
      semChamados.style.display = "block";
      return;
    }

    semChamados.style.display = "none";

    chamados.forEach((c) => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.dataset.id = c.id;

      card.innerHTML = `
        <h3>${c.titulo}</h3>
        <p><strong>Aluno:</strong> ${
          c.usuario_id ? c.usuario_id.nome + " " + c.usuario_id.sobrenome : "—"
        }</p>
        <p><strong>Descrição:</strong> ${c.descricao}</p>
        <p><strong>Tipo de Solicitação:</strong> ${
          c.tipo || "Não informado"
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

      // Adiciona evento para salvar alterações
      card.querySelector(".btn-salvar").addEventListener("click", () => {
        atualizarChamado(c.id, card);
      });

      listaChamados.appendChild(card);
    });

    aplicarFiltros();
  } catch (erro) {
    console.error("Erro ao carregar chamados:", erro);
    alert("Não foi possível carregar os chamados do banco.");
  }
}

// ================================
// FUNÇÃO: ATUALIZAR CHAMADO NO SUPABASE
// ================================
async function atualizarChamado(id, card) {
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

    if (!resposta.ok) {
      const erro = await resposta.json();
      console.error("Erro ao atualizar chamado:", erro);
      alert("Erro ao atualizar chamado.");
      return;
    }

    alert("Chamado atualizado com sucesso!");
    carregarChamados();
  } catch (erro) {
    console.error("Erro de conexão:", erro);
    alert("Não foi possível conectar ao banco.");
  }
}

// ================================
// FILTROS
// ================================
filtroStatus.addEventListener("change", aplicarFiltros);
filtroPrioridade.addEventListener("change", aplicarFiltros);
filtroTipo.addEventListener("change", aplicarFiltros);

function aplicarFiltros() {
  const statusSelecionado = filtroStatus.value;
  const prioridadeSelecionada = filtroPrioridade.value;
  const tipoSelecionado = filtroTipo.value;

  const cards = document.querySelectorAll(".lista-chamados .card");
  let algumVisivel = false;

  cards.forEach((card) => {
    const status = card.querySelector(".select-status").value;
    const prioridade = card.querySelector(".select-prioridade").value;
    const tipo = card
      .querySelector("p:nth-child(4)")
      .textContent.split(": ")[1];

    const combina =
      (!statusSelecionado || status === statusSelecionado) &&
      (!prioridadeSelecionada || prioridade === prioridadeSelecionada) &&
      (!tipoSelecionado || tipo === tipoSelecionado);

    card.style.display = combina ? "block" : "none";
    if (combina) algumVisivel = true;
  });

  semChamados.style.display = algumVisivel ? "none" : "block";
}

// ================================
// INICIALIZAÇÃO
// ================================
carregarChamados();

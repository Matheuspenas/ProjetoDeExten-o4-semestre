const listaChamados = document.querySelector(".lista-chamados");
const filtroStatus = document.getElementById("filtro-status");
const filtroPrioridade = document.getElementById("filtro-prioridade");
// Renomeado para 'filtroTipo' e ID HTML para 'filtro-tipo'
const filtroTipo = document.getElementById("filtro-tipo");
const semChamados = document.querySelector(".sem-chamados");

// Carrega chamados do localStorage
function carregarChamados() {
  const chamados = JSON.parse(localStorage.getItem("chamados")) || [];
  listaChamados.innerHTML = "";

  if (chamados.length === 0) {
    semChamados.style.display = "block";
    return;
  }

  semChamados.style.display = "none";

  chamados.forEach((c) => {
    const card = document.createElement("div");
    card.id = `chamado-${c.id}`;
    card.classList.add("card");
    card.innerHTML = `
      <h3>${c.titulo}</h3>
      <p><strong>Descrição:</strong> ${c.descricao}</p>
      <p><strong>Tipo de Solicitação:</strong> ${c.tipo || "Não Informado"}</p>
      <p><strong>Criado em:</strong> ${c.criadoEm || "—"}</p>
      ${
        c.atualizadoEm
          ? `<p><strong>Última atualização:</strong> ${c.atualizadoEm}</p>`
          : ""
      }

      <label>Prioridade:</label>
      <select class="select-prioridade">
        <option ${c.prioridade === "Baixa" ? "selected" : ""}>Baixa</option>
        <option ${c.prioridade === "Média" ? "selected" : ""}>Média</option>
        <option ${c.prioridade === "Alta" ? "selected" : ""}>Alta</option>
        <option ${c.prioridade === "Urgente" ? "selected" : ""}>Urgente</option>
      </select>

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

      <button class="btn-salvar">Salvar Alterações</button>
    `;

    card.querySelector(".btn-salvar").addEventListener("click", () => {
      atualizarChamado(c.id, card);
    });

    listaChamados.appendChild(card);
  });

  // Aplica filtros ao carregar
  aplicarFiltros();
}

// Atualiza o chamado no localStorage
function atualizarChamado(id, card) {
  const chamados = JSON.parse(localStorage.getItem("chamados")) || [];
  const chamado = chamados.find((ch) => ch.id === id);

  if (chamado) {
    chamado.prioridade = card.querySelector(".select-prioridade").value;
    chamado.status = card.querySelector(".select-status").value;

    // Atualiza data/hora da última modificação
    const agora = new Date();
    chamado.atualizadoEm = agora.toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    });

    localStorage.setItem("chamados", JSON.stringify(chamados));
    alert("Chamado atualizado com sucesso!");
    carregarChamados();
  }
}

// Filtros
filtroStatus.addEventListener("change", aplicarFiltros);
filtroPrioridade.addEventListener("change", aplicarFiltros);
// Renomeado o listener para 'filtroTipo'
filtroTipo.addEventListener("change", aplicarFiltros);

function aplicarFiltros() {
  const statusSelecionado = filtroStatus.value;
  const prioridadeSelecionada = filtroPrioridade.value;
  // Renomeado para 'tipoSolicitacaoSelecionada'
  const tipoSolicitacaoSelecionada = filtroTipo.value;

  const chamados = JSON.parse(localStorage.getItem("chamados")) || [];
  const cards = document.querySelectorAll(".lista-chamados .card");
  let algumVisivel = false;

  cards.forEach((card) => {
    const status = card.querySelector(".select-status").value;
    const prioridade = card.querySelector(".select-prioridade").value;

    const idChamado = parseInt(card.id.replace("chamado-", ""));
    const chamadoOriginal = chamados.find((c) => c.id === idChamado);
    // Obtém o tipo do objeto salvo
    const tipo = chamadoOriginal ? chamadoOriginal.tipo : "";

    const combinaStatus = !statusSelecionado || status === statusSelecionado;
    const combinaPrioridade =
      !prioridadeSelecionada || prioridade === prioridadeSelecionada;
    // Renomeado para 'combinaTipo'
    const combinaTipo =
      !tipoSolicitacaoSelecionada || tipo === tipoSolicitacaoSelecionada;

    // Combina as 3 condições (Status, Prioridade, Tipo)
    if (combinaStatus && combinaPrioridade && combinaTipo) {
      card.style.display = "block";
      algumVisivel = true;
    } else {
      card.style.display = "none";
    }
  });

  semChamados.style.display = algumVisivel ? "none" : "block";
}

// Inicializa
carregarChamados();

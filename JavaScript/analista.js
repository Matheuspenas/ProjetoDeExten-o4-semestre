const listaChamados = document.querySelector(".lista-chamados");

// Carrega chamados do localStorage
function carregarChamados() {
  const chamados = JSON.parse(localStorage.getItem("chamados")) || [];
  listaChamados.innerHTML = "";

  if (chamados.length === 0) {
    listaChamados.innerHTML = "<p>Não há chamados abertos</p>";
    return;
  }

  chamados.forEach((c) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <h3>${c.titulo}</h3>
      <p><strong>Descrição:</strong> ${c.descricao}</p>

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
}

// Atualiza o chamado no localStorage
function atualizarChamado(id, card) {
  const chamados = JSON.parse(localStorage.getItem("chamados")) || [];
  const chamado = chamados.find((ch) => ch.id === id);

  if (chamado) {
    chamado.prioridade = card.querySelector(".select-prioridade").value;
    chamado.status = card.querySelector(".select-status").value;
    localStorage.setItem("chamados", JSON.stringify(chamados));
    alert("Chamado atualizado com sucesso!");
  }
}

carregarChamados();

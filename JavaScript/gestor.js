document.addEventListener("DOMContentLoaded", () => {
  const chamadosAbertos = document.getElementById("chamadosAbertos");
  const chamadosAtraso = document.getElementById("chamadosAtraso");
  const tempoMedio = document.getElementById("tempoMedio");
  const chamadosPrioridade = document.getElementById("chamadosPrioridade");

  const ctx = document.getElementById("graficoChamados").getContext("2d");

  // Gráfico principal (Barra)
  const chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: [],
      datasets: [
        {
          label: "Chamados",
          data: [],
          backgroundColor: "rgba(0, 71, 255, 0.5)",
          borderColor: "#0047ff",
          borderWidth: 1,
          borderRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true } },
    },
  });

  // Plugin do texto central para Gráfico de Rosca (Doughnut)
  const textoCentral = {
    id: "textoCentral",
    beforeDraw(chart, args, options) {
      const {
        ctx,
        chartArea: { width, top, bottom },
      } = chart;
      ctx.save();
      ctx.font = "bold 16px Poppins";
      ctx.fillStyle = "#333";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(options.text, width / 2, top + (bottom - top) / 2);
      ctx.restore();
    },
  };

  function atualizarCards() {
    return {
      abertos: Math.floor(Math.random() * 20 + 1),
      atraso: Math.floor(Math.random() * 5),
      tempo: (Math.random() * 24).toFixed(1),
      prioridade: Math.floor(Math.random() * 50 + 5),
    };
  }

  function criarGraficoRosca(id, valor, total, cor, unidade = "") {
    const ctxRosca = document.getElementById(id).getContext("2d");
    const restante = Math.max(total - valor, 0);

    new Chart(ctxRosca, {
      type: "doughnut",
      data: {
        labels: ["Concluído", "Restante"],
        datasets: [
          {
            data: [valor, restante],
            backgroundColor: [cor, "#e0e0e0"],
            borderWidth: 2,
            hoverOffset: 8,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          textoCentral: { text: `${valor}${unidade}` },
        },
        cutout: "70%",
        rotation: -90,
        circumference: 360,
      },
      plugins: [textoCentral],
    });
  }

  async function carregarGrafico() {
    const categorias = [
      "Suporte",
      "Infraestrutura",
      "Software",
      "Rede",
      "Outros",
    ];
    const dados = categorias.map(() => Math.floor(Math.random() * 20 + 1));

    chart.data.labels = categorias;
    chart.data.datasets[0].data = dados;
    chart.update();
  }

  function carregarAnalistas() {
    // Dados simulados com ID no formato de número de banco
    const analistas = [
      // Corrigido: 'ID' no lugar de 'Matrícula' na estrutura de dados
      { id: 101, nome: "Ana Silva", status: "Em Serviço (Baixa)", ativos: 3 },
      { id: 102, nome: "Bruno Costa", status: "Em Serviço (Média)", ativos: 7 },
      { id: 103, nome: "Carlos Melo", status: "Férias", ativos: 0 },
      { id: 104, nome: "Diana Souza", status: "Em Serviço (Alta)", ativos: 10 },
    ];

    const tabelaBody = document
      .getElementById("tabelaAnalistas")
      .querySelector("tbody");
    tabelaBody.innerHTML = "";

    analistas.forEach((analista) => {
      const linha = tabelaBody.insertRow();

      // Coluna 1: ID
      linha.insertCell().textContent = analista.id;
      // Coluna 2: Nome
      linha.insertCell().textContent = analista.nome;
      // Coluna 3: Status (Carga)
      linha.insertCell().textContent = analista.status;
      // Coluna 4: Chamados Ativos
      linha.insertCell().textContent = analista.ativos;
    });
  }

  function carregarUsuarios() {
    // Dados simulados com ID no formato de número de banco
    const usuarios = [
      {
        id: 5001,
        nome: "João Pereira",
        departamento: "Contabilidade",
        ultimoChamado: "2025-10-20",
      },
      {
        id: 5002,
        nome: "Maria Oliveira",
        departamento: "Marketing",
        ultimoChamado: "2025-11-01",
      },
      {
        id: 5003,
        nome: "Pedro Rocha",
        departamento: "RH",
        ultimoChamado: "2025-09-15",
      },
      {
        id: 5004,
        nome: "Luiza Santos",
        departamento: "Diretoria",
        ultimoChamado: "2025-10-30",
      },
    ];

    const tabelaBody = document
      .getElementById("tabelaUsuarios")
      .querySelector("tbody");
    tabelaBody.innerHTML = "";

    usuarios.forEach((usuario) => {
      const linha = tabelaBody.insertRow();

      // Coluna 1: ID
      linha.insertCell().textContent = usuario.id;
      // Coluna 2: Nome
      linha.insertCell().textContent = usuario.nome;
      // Coluna 3: Departamento
      linha.insertCell().textContent = usuario.departamento;
      // Coluna 4: Último Chamado
      linha.insertCell().textContent = usuario.ultimoChamado;
    });
  }

  function atualizarTudo() {
    const dados = atualizarCards();
    chamadosAbertos.textContent = dados.abertos;
    chamadosAtraso.textContent = dados.atraso;
    tempoMedio.textContent = `${dados.tempo} H`;
    chamadosPrioridade.textContent = dados.prioridade;

    carregarGrafico();

    criarGraficoRosca("roscaAbertos", dados.abertos, 25, "#0047ff");
    criarGraficoRosca("roscaAtraso", dados.atraso, 10, "#ff6b6b");
    criarGraficoRosca(
      "roscaTempo",
      parseFloat(dados.tempo),
      24,
      "#ffa726",
      "H"
    );
    criarGraficoRosca("roscaPrioridade", dados.prioridade, 60, "#42a5f5");

    // Tabelas de Gestão
    carregarAnalistas();
    carregarUsuarios();
  }

  document
    .getElementById("filtrarBtn")
    .addEventListener("click", carregarGrafico);

  atualizarTudo();
  setInterval(atualizarTudo, 5000);
});

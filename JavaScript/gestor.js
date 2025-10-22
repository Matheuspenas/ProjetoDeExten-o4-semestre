document.addEventListener("DOMContentLoaded", () => {
  const chamadosAbertos = document.getElementById("chamadosAbertos");
  const chamadosAtraso = document.getElementById("chamadosAtraso");
  const tempoMedio = document.getElementById("tempoMedio");
  const chamadosPrioridade = document.getElementById("chamadosPrioridade");

  const ctx = document.getElementById("graficoChamados").getContext("2d");

  // Gráfico principal
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

  // Plugin do texto central
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
      tempo: (Math.random() * 24).toFixed(1), // valor decimal
      prioridade: Math.floor(Math.random() * 50 + 5),
    };
  }

  function criarGraficoRosca(id, valor, total, cor, unidade = "") {
    const ctxRosca = document.getElementById(id).getContext("2d");

    // Evita valores negativos ou inconsistentes
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
          textoCentral: { text: `${total}${unidade}` }, // total exibido
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
  }

  document
    .getElementById("filtrarBtn")
    .addEventListener("click", carregarGrafico);

  atualizarTudo();
  setInterval(atualizarTudo, 5000);
});

// =======================================================================
// VARIÁVEIS GLOBAIS
// =======================================================================
// Declarações iniciais:
const darkModeToggle = document.getElementById("darkModeToggle");
let chartInstance; // Variável para armazenar a instância do gráfico principal
let roscaInstances = []; // Array para armazenar instâncias dos gráficos de rosca

// Cores base
const LIGHT_MODE_TEXT = "#333";
const DARK_MODE_TEXT = "#e0e0e0";
const LIGHT_MODE_GRID = "rgba(0, 0, 0, 0.1)";
const DARK_MODE_GRID = "rgba(255, 255, 255, 0.1)";

// =======================================================================
// LÓGICA DE DARK MODE E PERSISTÊNCIA
// =======================================================================

function getColors() {
  const isDarkMode = document.body.classList.contains("dark-mode");
  return {
    font: isDarkMode ? DARK_MODE_TEXT : LIGHT_MODE_TEXT,
    grid: isDarkMode ? DARK_MODE_GRID : LIGHT_MODE_GRID,
    bar: isDarkMode ? "rgba(30, 99, 233, 0.8)" : "rgba(0, 71, 255, 0.5)", // Cor da barra no DM
    barBorder: isDarkMode ? "#1e63e9" : "#0047ff", // Borda da barra no DM
  };
}

/**
 * Aplica o tema salvo ao carregar a página.
 */
function aplicarTemaSalvo() {
  const savedTheme = localStorage.getItem("darkModeEnabled");
  const isDarkMode = savedTheme === "true";

  document.body.classList.toggle("dark-mode", isDarkMode);
  darkModeToggle.checked = isDarkMode;
}

/**
 * Atualiza todos os gráficos existentes com base no tema atual.
 * É chamado após a criação inicial e a cada mudança de switch.
 */
function atualizarEstiloGraficos() {
  const colors = getColors();

  // 1. Atualiza o Gráfico Principal (Barra)
  if (chartInstance) {
    chartInstance.options.scales.y.grid.color = colors.grid;
    chartInstance.options.scales.y.ticks.color = colors.font;
    chartInstance.options.scales.x.ticks.color = colors.font;
    chartInstance.data.datasets[0].backgroundColor = colors.bar;
    chartInstance.data.datasets[0].borderColor = colors.barBorder;
    chartInstance.update();
  }

  // 2. Atualiza os Gráficos de Rosca e o Texto Central
  roscaInstances.forEach((rosca) => {
    // Atualiza a cor do texto central
    if (rosca.options.plugins.textoCentral) {
      rosca.options.plugins.textoCentral.color = colors.font;
    }
    rosca.update();
  });

  // 3. Atualiza a cor do texto padrão do Chart.js (geral)
  Chart.defaults.color = colors.font;
}

// Handler do Dark Mode (Original + Persistência + Gráficos)
darkModeToggle.addEventListener("change", () => {
  const isDarkMode = darkModeToggle.checked;

  document.body.classList.toggle("dark-mode", isDarkMode);
  localStorage.setItem("darkModeEnabled", isDarkMode);

  // Atualiza os estilos imediatamente
  atualizarEstiloGraficos();
});

// =======================================================================
// PLUGIN DO TEXTO CENTRAL (MODIFICADO PARA DARK MODE)
// =======================================================================
const textoCentral = {
  id: "textoCentral",
  beforeDraw(chart, args, options) {
    const {
      ctx,
      chartArea: { width, top, bottom },
    } = chart;
    ctx.save();
    ctx.font = "bold 16px Poppins";
    // Usa a cor dinâmica definida nas opções do plugin
    ctx.fillStyle = options.color || LIGHT_MODE_TEXT;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(options.text, width / 2, top + (bottom - top) / 2);
    ctx.restore();
  },
};

// =======================================================================
// FUNÇÕES PRINCIPAIS DE CRIAÇÃO/ATUALIZAÇÃO (PRESERVADAS)
// =======================================================================

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
  const colors = getColors();

  // Destrói a instância anterior para recriar com o novo texto central
  const existingChart = roscaInstances.find((c) => c.canvas.id === id);
  if (existingChart) existingChart.destroy();

  const newChart = new Chart(ctxRosca, {
    type: "doughnut",
    data: {
      labels: ["Concluído", "Restante"],
      datasets: [
        {
          data: [valor, restante],
          backgroundColor: [cor, "#d0d0d0"],
          borderWidth: 2,
          hoverOffset: 8,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        // Passa a cor do texto no Dark Mode para o plugin
        textoCentral: {
          text: `${valor}${unidade}`,
          color: colors.font, // Cor dinâmica
        },
      },
      cutout: "70%",
      rotation: -90,
      circumference: 360,
    },
    plugins: [textoCentral],
  });

  // Armazena ou substitui a instância
  if (existingChart) {
    roscaInstances = roscaInstances.filter((c) => c.canvas.id !== id);
  }
  roscaInstances.push(newChart);
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

  if (chartInstance) {
    chartInstance.data.labels = categorias;
    chartInstance.data.datasets[0].data = dados;
    chartInstance.update();
    atualizarEstiloGraficos(); // Garante cores atualizadas
  }
}

function carregarAnalistas() {
  const analistas = [
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
    linha.insertCell().textContent = analista.id;
    linha.insertCell().textContent = analista.nome;
    linha.insertCell().textContent = analista.status;
    linha.insertCell().textContent = analista.ativos;
  });
}

function carregarUsuarios() {
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
    linha.insertCell().textContent = usuario.id;
    linha.insertCell().textContent = usuario.nome;
    linha.insertCell().textContent = usuario.departamento;
    linha.insertCell().textContent = usuario.ultimoChamado;
  });
}

function atualizarTudo() {
  // Para resolver o problema de quebra do Dark Mode nos gráficos de rosca,
  // a função criarGraficoRosca agora precisa DESTRUIR a instância antiga
  // e criar uma nova toda vez que é chamada (porque Chart.js não permite
  // mudar o plugin de texto central dinamicamente).

  const dados = atualizarCards();
  chamadosAbertos.textContent = dados.abertos;
  chamadosAtraso.textContent = dados.atraso;
  tempoMedio.textContent = `${dados.tempo} H`;
  chamadosPrioridade.textContent = dados.prioridade;

  carregarGrafico();

  // Cria/Recria Gráficos de Rosca
  criarGraficoRosca("roscaAbertos", dados.abertos, 25, "#0047ff");
  criarGraficoRosca("roscaAtraso", dados.atraso, 10, "#ff6b6b");
  criarGraficoRosca("roscaTempo", parseFloat(dados.tempo), 24, "#ffa726", "H");
  criarGraficoRosca("roscaPrioridade", dados.prioridade, 60, "#42a5f5");

  // Tabelas de Gestão
  carregarAnalistas();
  carregarUsuarios();
}

// =======================================================================
// INICIALIZAÇÃO
// =======================================================================
document.addEventListener("DOMContentLoaded", () => {
  // 1. Aplica o tema Dark Mode (se salvo)
  aplicarTemaSalvo();

  // 2. Seletores dos cards (movemos para dentro do DOMContentLoaded)
  const chamadosAbertos = document.getElementById("chamadosAbertos");
  const chamadosAtraso = document.getElementById("chamadosAtraso");
  const tempoMedio = document.getElementById("tempoMedio");
  const chamadosPrioridade = document.getElementById("chamadosPrioridade");

  const ctx = document.getElementById("graficoChamados").getContext("2d");
  const colors = getColors();

  // 3. Gráfico principal (Barra) - Criado UMA ÚNICA VEZ
  chartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: [],
      datasets: [
        {
          label: "Chamados",
          data: [],
          // Usa as cores dinâmicas
          backgroundColor: colors.bar,
          borderColor: colors.barBorder,
          borderWidth: 1,
          borderRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          beginAtZero: true,
          // Usa cores dinâmicas para eixos
          grid: { color: colors.grid },
          ticks: { color: colors.font },
        },
        x: {
          grid: { color: colors.grid },
          ticks: { color: colors.font },
        },
      },
    },
  });

  // 4. Inicia a atualização de todos os dados e gráficos (incluindo as Rosca)
  document
    .getElementById("filtrarBtn")
    .addEventListener("click", carregarGrafico);

  atualizarTudo();
  setInterval(atualizarTudo, 5000);
});

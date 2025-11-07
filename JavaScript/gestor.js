// =======================================================================
// VARIÁVEIS GLOBAIS
// =======================================================================
const darkModeToggle = document.getElementById("darkModeToggle");
let chartInstance;
let roscaInstances = [];

const SUPABASE_URL = "https://ilnilousfwignxliyjqv.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlsbmlsb3VzZndpZ254bGl5anF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NjIzMTAsImV4cCI6MjA3ODAzODMxMH0.c2TTA1Mk7wu2SGYk7sZrY4mMp-O2PATcuRCIKUsRCpQ";

// Tipos de chamado baseados no HTML do aluno
const TIPOS_CHAMADOS = [
  "Acessos e Contas",
  "Hardware e Periféricos",
  "Software e Aplicativos",
  "Redes e Internet",
  "E-mail e Comunicação",
  "Multimídia e Salas de Aula",
  "Outro",
];

// =======================================================================
// DARK MODE
// =======================================================================
function getColors() {
  const isDarkMode = document.body.classList.contains("dark-mode");
  return {
    font: isDarkMode ? "#e0e0e0" : "#333",
    grid: isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
    bar: isDarkMode ? "rgba(30, 99, 233, 0.8)" : "rgba(0,71,255,0.5)",
    barBorder: isDarkMode ? "#1e63e9" : "#0047ff",
  };
}

function aplicarTemaSalvo() {
  const savedTheme = localStorage.getItem("darkModeEnabled") === "true";
  document.body.classList.toggle("dark-mode", savedTheme);
  darkModeToggle.checked = savedTheme;
}

darkModeToggle.addEventListener("change", () => {
  const isDark = darkModeToggle.checked;
  document.body.classList.toggle("dark-mode", isDark);
  localStorage.setItem("darkModeEnabled", isDark);
  atualizarEstiloGraficos();
});

function atualizarEstiloGraficos() {
  const colors = getColors();
  if (chartInstance) {
    chartInstance.options.scales.y.grid.color = colors.grid;
    chartInstance.options.scales.y.ticks.color = colors.font;
    chartInstance.options.scales.x.ticks.color = colors.font;
    chartInstance.data.datasets[0].backgroundColor = colors.bar;
    chartInstance.data.datasets[0].borderColor = colors.barBorder;
    chartInstance.update();
  }
  roscaInstances.forEach((rosca) => {
    if (rosca.options.plugins.textoCentral) {
      rosca.options.plugins.textoCentral.color = colors.font;
    }
    rosca.update();
  });
  Chart.defaults.color = colors.font;
}

// =======================================================================
// PLUGIN DE TEXTO CENTRAL
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
    ctx.fillStyle = options.color || "#333";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(options.text, width / 2, top + (bottom - top) / 2);
    ctx.restore();
  },
};

// =======================================================================
// FUNÇÃO PARA CRIAR GRÁFICOS DE ROSCA
// =======================================================================
function criarGraficoRosca(id, valor, total, cor, unidade = "") {
  const ctxRosca = document.getElementById(id).getContext("2d");
  const restante = Math.max(total - valor, 0);
  const colors = getColors();

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
        textoCentral: { text: `${valor}${unidade}`, color: colors.font },
      },
      cutout: "70%",
      rotation: -90,
      circumference: 360,
    },
    plugins: [textoCentral],
  });

  if (existingChart)
    roscaInstances = roscaInstances.filter((c) => c.canvas.id !== id);
  roscaInstances.push(newChart);
}

// =======================================================================
// FUNÇÃO PRINCIPAL DE ATUALIZAÇÃO
// =======================================================================
async function atualizarTudoBanco() {
  try {
    const [respUsuarios, respChamados] = await Promise.all([
      fetch(
        `${SUPABASE_URL}/rest/v1/usuarios?select=id,nome,sobrenome,cargo,email,criado_em&order=id.asc`,
        {
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
          },
        }
      ),
      fetch(
        `${SUPABASE_URL}/rest/v1/chamados?select=id,titulo,tipo,status,prioridade,usuario_id,criado_em,atualizado_em`,
        {
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
          },
        }
      ),
    ]);

    if (!respUsuarios.ok || !respChamados.ok)
      throw new Error("Erro ao buscar dados do banco");

    const usuarios = await respUsuarios.json();
    const chamados = await respChamados.json();

    // ==================================================
    // CARDS
    // ==================================================
    const abertos = chamados.filter(
      (c) => c.status.toLowerCase() === "aberto"
    ).length;
    const atraso = chamados.filter(
      (c) =>
        c.status.toLowerCase() !== "finalizado" &&
        (new Date() - new Date(c.criado_em)) / (1000 * 3600 * 24) > 2
    ).length;
    const tempoMedio = chamados.length
      ? (
          chamados.reduce(
            (acc, c) =>
              acc +
              ((c.atualizado_em ? new Date(c.atualizado_em) : new Date()) -
                new Date(c.criado_em)) /
                (1000 * 3600),
            0
          ) / chamados.length
        ).toFixed(1)
      : 0;
    const prioridade = chamados.filter((c) =>
      ["alta", "urgente"].includes(c.prioridade.toLowerCase())
    ).length;

    document.getElementById("chamadosAbertos").textContent = abertos;
    document.getElementById("chamadosAtraso").textContent = atraso;
    document.getElementById("tempoMedio").textContent = `${tempoMedio} H`;
    document.getElementById("chamadosPrioridade").textContent = prioridade;

    // ==================================================
    // GRÁFICOS DE ROSCA
    // ==================================================
    criarGraficoRosca(
      "roscaAbertos",
      abertos,
      Math.max(abertos, 25),
      "#0047ff"
    );
    criarGraficoRosca("roscaAtraso", atraso, Math.max(atraso, 10), "#ff6b6b");
    criarGraficoRosca("roscaTempo", parseFloat(tempoMedio), 24, "#ffa726", "H");
    criarGraficoRosca(
      "roscaPrioridade",
      prioridade,
      Math.max(prioridade, 60),
      "#42a5f5"
    );

    // ==================================================
    // GRÁFICO PRINCIPAL (BARRA POR TIPO)
    // ==================================================
    const dadosPorTipo = TIPOS_CHAMADOS.map(
      (tipo) => chamados.filter((c) => c.tipo === tipo).length
    );

    if (chartInstance) {
      chartInstance.data.labels = TIPOS_CHAMADOS;
      chartInstance.data.datasets[0].data = dadosPorTipo;
      chartInstance.update();
    }

    // ==================================================
    // TABELA ANALISTAS
    // ==================================================
    const analistas = usuarios.filter(
      (u) => u.cargo.toLowerCase() === "analista"
    );
    const tbodyAnalistas = document.querySelector("#tabelaAnalistas tbody");
    tbodyAnalistas.innerHTML = "";
    analistas.forEach((a) => {
      const ativos = chamados.filter(
        (ch) =>
          ch.usuario_id === a.id && ch.status.toLowerCase() !== "finalizado"
      ).length;
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${a.id}</td><td>${a.nome} ${a.sobrenome}</td><td>--</td><td>${ativos}</td>`;
      tbodyAnalistas.appendChild(tr);
    });

    // ==================================================
    // TABELA ALUNOS
    // ==================================================
    const alunos = usuarios.filter((u) => u.cargo.toLowerCase() === "aluno");
    const tbodyAlunos = document.querySelector("#tabelaUsuarios tbody");
    tbodyAlunos.innerHTML = "";
    alunos.forEach((aluno) => {
      const chamadosAluno = chamados.filter((ch) => ch.usuario_id === aluno.id);
      const ultimo = chamadosAluno.length
        ? new Date(
            chamadosAluno[chamadosAluno.length - 1].criado_em
          ).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })
        : "--";
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${aluno.id}</td><td>${aluno.nome} ${aluno.sobrenome}</td><td>${chamadosAluno.length}</td><td>${ultimo}</td>`;
      tbodyAlunos.appendChild(tr);
    });
  } catch (err) {
    console.error("Erro ao atualizar dados do banco:", err);
  }
}

// =======================================================================
// INICIALIZAÇÃO
// =======================================================================
document.addEventListener("DOMContentLoaded", () => {
  aplicarTemaSalvo();

  const ctx = document.getElementById("graficoChamados").getContext("2d");
  const colors = getColors();
  chartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: [],
      datasets: [
        {
          label: "Chamados",
          data: [],
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
          grid: { color: colors.grid },
          ticks: { color: colors.font },
        },
        x: { grid: { color: colors.grid }, ticks: { color: colors.font } },
      },
    },
  });

  atualizarTudoBanco();
  setInterval(atualizarTudoBanco, 5000);

  document
    .getElementById("filtrarBtn")
    .addEventListener("click", atualizarTudoBanco);
});

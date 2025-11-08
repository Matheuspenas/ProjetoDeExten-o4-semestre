// =======================================================================
// VARIÁVEIS GLOBAIS
// =======================================================================
const darkModeToggle = document.getElementById("darkModeToggle");
let chartInstance;
let roscaInstances = [];

const SUPABASE_URL = "https://ilnilousfwignxliyjqv.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlsbmlsb3VzZndpZ254bGl5anF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NjIzMTAsImV4cCI6MjA3ODAzODMxMH0.c2TTA1Mk7wu2SGYk7sZrY4mMp-O2PATcuRCIKUsRCpQ";

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
  const isDark = document.body.classList.contains("dark-mode");
  return {
    font: isDark ? "#e0e0e0" : "#333",
    grid: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
    bar: isDark ? "rgba(30, 99, 233, 0.8)" : "rgba(0, 71, 255, 0.5)",
    barBorder: isDark ? "#1e63e9" : "#0047ff",
  };
}

function aplicarTemaSalvo() {
  const saved = localStorage.getItem("darkModeEnabled") === "true";
  document.body.classList.toggle("dark-mode", saved);
  darkModeToggle.checked = saved;
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
    chartInstance.options.scales.x.grid.color = colors.grid;
    chartInstance.options.scales.y.ticks.color = colors.font;
    chartInstance.options.scales.x.ticks.color = colors.font;
    chartInstance.data.datasets[0].backgroundColor = colors.bar;
    chartInstance.data.datasets[0].borderColor = colors.barBorder;
    chartInstance.update();
  }
  roscaInstances.forEach((rosca) => rosca.update());
}

// =======================================================================
// PLUGIN TEXTO CENTRAL
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
// FUNÇÃO ROSCA
// =======================================================================
function criarGraficoRosca(id, valor, total, cor, unidade = "") {
  const ctx = document.getElementById(id).getContext("2d");
  const restante = Math.max(total - valor, 0);
  const colors = getColors();

  const old = roscaInstances.find((c) => c.canvas.id === id);
  if (old) old.destroy();

  const newChart = new Chart(ctx, {
    type: "doughnut",
    data: {
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
    },
    plugins: [textoCentral],
  });

  roscaInstances = roscaInstances.filter((c) => c.canvas.id !== id);
  roscaInstances.push(newChart);
}

// =======================================================================
// FUNÇÃO PRINCIPAL
// =======================================================================
async function atualizarTudoBanco() {
  try {
    const [respUsuarios, respChamados] = await Promise.all([
      fetch(
        `${SUPABASE_URL}/rest/v1/usuarios?select=id,nome,sobrenome,cargo,email`,
        {
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
          },
        }
      ),
      fetch(
        `${SUPABASE_URL}/rest/v1/chamados?select=id,titulo,status,prioridade,usuario_id,tipo,criado_em`,
        {
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
          },
        }
      ),
    ]);

    const usuarios = await respUsuarios.json();
    const chamados = await respChamados.json();
    const norm = (v) => (v ? v.trim().toLowerCase() : "");

    // ===============================
    // CONTADORES PRINCIPAIS
    // ===============================
    const abertos = chamados.filter((c) => norm(c.status) === "aberto").length;
    const finalizados = chamados.filter(
      (c) => norm(c.status) === "finalizado"
    ).length;
    const andamento = chamados.filter((c) =>
      ["andamento", "em andamento", "pendente", "processando"].includes(
        norm(c.status)
      )
    ).length;
    const prioridade = chamados.filter((c) =>
      ["alta", "urgente"].includes(norm(c.prioridade))
    ).length;

    // Atualiza cards
    document.getElementById("chamadosAbertos").textContent = abertos;
    document.getElementById("chamadosFinalizados").textContent = finalizados;
    document.getElementById("chamadosAndamento").textContent = andamento;
    document.getElementById("chamadosPrioridade").textContent = prioridade;

    // ===============================
    // ROSCAS
    // ===============================
    criarGraficoRosca("roscaAbertos", abertos, 50, "#0047ff");
    criarGraficoRosca("roscaFinalizados", finalizados, 50, "#00c853");
    criarGraficoRosca("roscaAndamento", andamento, 50, "#ffa726");
    criarGraficoRosca("roscaPrioridade", prioridade, 50, "#42a5f5");

    // ===============================
    // GRÁFICO PRINCIPAL
    // ===============================
    const dadosTipo = TIPOS_CHAMADOS.map(
      (t) =>
        chamados.filter((c) =>
          (c.tipo || "").toLowerCase().includes(t.toLowerCase())
        ).length
    );

    chartInstance.data.labels = TIPOS_CHAMADOS.map(
      (t) => t.replace(/e\s/g, "").split(" ")[0]
    );
    chartInstance.data.datasets[0].data = dadosTipo;
    chartInstance.update();

    // ===============================
    // TABELA ANALISTAS
    // ===============================
    const analistas = usuarios.filter((u) => norm(u.cargo) === "analista");
    const tbodyA = document.querySelector("#tabelaAnalistas tbody");
    tbodyA.innerHTML = "";
    analistas.forEach((a) => {
      const ativos = chamados.filter(
        (ch) => ch.usuario_id === a.id && norm(ch.status) !== "finalizado"
      ).length;
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${a.id}</td><td>${a.nome} ${a.sobrenome}</td><td>Ativo</td><td>${ativos}</td>`;
      tbodyA.appendChild(tr);
    });

    // ===============================
    // TABELA ALUNOS
    // ===============================
    const alunos = usuarios.filter((u) => norm(u.cargo) === "aluno");
    const tbodyU = document.querySelector("#tabelaUsuarios tbody");
    tbodyU.innerHTML = "";
    alunos.forEach((al) => {
      const chs = chamados.filter((c) => c.usuario_id === al.id);
      const ultimo = chs.length
        ? new Date(chs[chs.length - 1].criado_em).toLocaleDateString("pt-BR")
        : "--";
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${al.id}</td><td>${al.nome} ${al.sobrenome}</td><td>${chs.length}</td><td>${ultimo}</td>`;
      tbodyU.appendChild(tr);
    });
  } catch (err) {
    console.error("Erro ao atualizar dados:", err);
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
        x: {
          grid: { color: colors.grid },
          ticks: { color: colors.font },
        },
      },
    },
  });

  atualizarTudoBanco();
  setInterval(atualizarTudoBanco, 10000);
});

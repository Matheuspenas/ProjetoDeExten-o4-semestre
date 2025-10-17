// Aguarda o carregamento completo da página
document.addEventListener("DOMContentLoaded", function () {
  const btnCriar = document.querySelector(".btn-criar");

  // Seletores do modal
  const modal = document.getElementById("modal-sucesso");
  const closeBtn = document.querySelector(".close-btn");
  const okBtn = document.querySelector(".btn-ok");
  const mensagemModal = document.getElementById("mensagem-modal");

  btnCriar.addEventListener("click", function () {
    const nome = document.getElementById("nome").value.trim();
    const sobrenome = document.getElementById("sobrenome").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();
    const tipo = document.getElementById("tipo").value;

    // Verifica se todos os campos foram preenchidos
    if (!nome || !sobrenome || !email || !senha || !tipo) {
      alert("Por favor, preencha todos os campos para continuar.");
      return;
    }

    // Verifica se o e-mail é válido
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailValido.test(email)) {
      alert("Por favor, insira um e-mail válido.");
      return;
    }

    // Verificação do tamanho mínimo da senha (6 dígitos)
    if (senha.length < 6) {
      alert("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    // Mostra o modal de sucesso
    mensagemModal.textContent = `Bem-vindo(a), ${nome}! Sua conta foi criada com sucesso.`;
    modal.style.display = "flex";

    // Quando clicar em OK, fecha o modal e redireciona
    okBtn.onclick = () => {
      modal.style.display = "none";

      // Direciona o usuário conforme o tipo escolhido
      if (tipo === "gestor") {
        window.location.href = "./gestor.html";
      } else if (tipo === "aluno") {
        window.location.href = "./aluno.html";
      } else {
        alert("Selecione um tipo de usuário válido.");
      }
    };
  });

  // Fecha o modal ao clicar no X
  closeBtn.onclick = () => (modal.style.display = "none");

  // Fecha o modal se o usuário clicar fora dele
  window.onclick = (event) => {
    if (event.target === modal) modal.style.display = "none";
  };
});

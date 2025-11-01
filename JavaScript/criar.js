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

    // Verficação do tamanho máximo da senha (12 digitos)
    if (senha.length > 12) {
      alert("A senha deve ter no máximo 12 caracteres.");
      return;
    }

    const senhaForte = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;
    if (!senhaForte.test(senha)) {
      alert(
        "A senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial."
      );
      return;
    }

    // Mostra o modal de sucesso
    mensagemModal.textContent = `Bem-vindo(a), ${nome}! Sua conta foi criada com sucesso.`;
    modal.style.display = "flex";

    // Quando clicar em OK, fecha o modal e redireciona
    okBtn.onclick = () => {
      modal.style.display = "none";

      // Redirecionamento conforme tipo de usuário
      switch (tipo) {
        case "gestor":
          window.location.href = "./gestor.html";
          break;
        case "aluno":
          window.location.href = "./aluno.html";
          break;
        case "analista":
          window.location.href = "./analista.html";
          break;
        default:
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

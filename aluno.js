    // Script simples para abrir/fechar o menu
      const toggle = document.getElementById("menu-toggle");
      const menu = document.getElementById("menu");

      toggle.addEventListener("click", () => {
        menu.classList.toggle("open");
      });
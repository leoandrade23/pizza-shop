let modalQt = 1;
let modalKey;
let key;
let cart = [];

const qS = (el) => document.querySelector(el);
const qSAll = (el) => document.querySelectorAll(el);

// Imagem e Informação das Pizzas

pizzaJson.map((item, index) => {
  // Clonar toda a parte de ".pizza-item" dentro de ".models"
  let pizzaItem = qS(".models .pizza-item").cloneNode(true);

  // Adicionando identificador para pizza com "data-key" com valor do Index
  pizzaItem.setAttribute("data-key", index);

  // Foto das Pizzas
  pizzaItem.querySelector(
    ".pizza-item--img img"
  ).src = `_assets/_media/${item.img}`;

  // Preço da Pizza no Formato PT-BR
  pizzaItem.querySelector(
    ".pizza-item--price"
  ).innerHTML = `A partir de ${item.price[0].toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",
  })}`;

  // Nome da Pizza
  pizzaItem.querySelector(".pizza-item--name").innerHTML = item.name;

  // Descrição da Pizza
  pizzaItem.querySelector(".pizza-item--desc").innerHTML = item.description;

  // Adicionar as informações no HTML criando um ".pizza-area"
  qS(".pizza-area").append(pizzaItem);

  // Abrir a tela de seleção (modal) ao clicar em cada pizza
  pizzaItem.querySelector(".pizza-item a").addEventListener("click", (e) => {
    // Desativa a propriedade padrão de <a>
    e.preventDefault();

    // Abre a tela (modal) de maneira suave
    qS(".pizzaWindowArea").style.opacity = "0";
    qS(".pizzaWindowArea").style.display = "flex";
    setTimeout(() => {
      qS(".pizzaWindowArea").style.opacity = "1";
    }, 100);

    // Atribui a "key" o valor do Index presente em "data-key"
    key = e.target.closest(".pizza-item").getAttribute("data-key");
    modalKey = key;

    // Preencher as informações da tela de seleção buscando o valor de "key" no JSON
    qS(".pizzaBig img").src = `_assets/_media/${pizzaJson[key].img}`;
    qS(".pizzaInfo h1").innerHTML = pizzaJson[key].name;
    qS(".pizzaInfo--desc").innerHTML = pizzaJson[key].description;
    qS(".pizzaInfo--actualPrice").innerHTML = pizzaJson[
      key
    ].price[2].toLocaleString("pt-br", { style: "currency", currency: "BRL" });

    // Pré-seleciona um tamanho padrão "Grande"
    qS(".pizzaInfo--size.selected").classList.remove("selected");
    qSAll(".pizzaInfo--size").forEach((size, sizeIndex) => {
      if (sizeIndex == 2) {
        size.classList.add("selected");
      }
      // Preenche a informação dos tamanhos da pizza
      size.querySelector("span").innerHTML = pizzaJson[key].sizes[sizeIndex];
    });

    // Definindo a quantidade padrão em "1"
    modalQt = 1;
    qS(".pizzaInfo--qt").innerHTML = modalQt;
  });
});

// Eventos da tela de seleção (modal)

// Função para fechar a tela de seleção (modal)
const closeModal = () => {
  qS(".pizzaWindowArea").style.opacity = "0";
  setTimeout(() => {
    qS(".pizzaWindowArea").style.display = "none";
  }, 500);
};

// Ativar a função fechar a o clicar no "Cancelar" e "Voltar" (Mobile)
qSAll(".pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton").forEach(
  (item) => {
    item.addEventListener("click", closeModal);
  }
);

// Fechar a tela de seleção (modal) clicando fora dela
let modal = qS(".pizzaWindowArea");
modal.addEventListener("click", (event) => {
  if (event.target === event.currentTarget) {
    closeModal();
  }
});

// Alterar a quantidade selecionada - e +
qS(".pizzaInfo--qtmenos").addEventListener("click", () => {
  if (modalQt > 1) {
    modalQt--;
    qS(".pizzaInfo--qt").innerHTML = modalQt;
  }
});
qS(".pizzaInfo--qtmais").addEventListener("click", () => {
  modalQt++;
  qS(".pizzaInfo--qt").innerHTML = modalQt;
});

// Alterando o tamanho
qSAll(".pizzaInfo--size").forEach((size) => {
  size.addEventListener("click", () => {
    qS(".pizzaInfo--size.selected").classList.remove("selected");
    size.classList.add("selected");
    qS(".pizzaInfo--actualPrice").innerHTML = pizzaJson[key].price[
      size.getAttribute("data-key")
    ].toLocaleString("pt-br", { style: "currency", currency: "BRL" });
  });
});

// Adicionando ao carrinho
qS(".pizzaInfo--addButton").addEventListener("click", () => {
  let size = parseInt(qS(".pizzaInfo--size.selected").getAttribute("data-key"));
  let identify = `${pizzaJson[modalKey].id}@${size}`;
  let key = cart.findIndex((item) => item.identify == identify);
  if (key > -1) {
    cart[key].qt += modalQt;
  } else {
    cart.push({
      identify,
      id: pizzaJson[modalKey].id,
      size,
      qt: modalQt,
    });
  }
  updateCart();
  closeModal();
});

// Carrinho

// Abrir Carrinho no Mobile
qS(".menu-openner").addEventListener("click", () => {
  if (cart.length > 0) {
    qS("aside").style.left = "0vw";
  }
});

// Fechar Carrinho no Mobile
qS(".menu-closer").addEventListener("click", () => {
  qS("aside").style.left = "100vw";
});

// Atualizando o carrinho
const updateCart = () => {
  //Mostra a quantidade de itens no carrinho (Mobile)
  qS(".menu-openner span").innerHTML = cart.length;

  // Se o array "cart" for maior do que 0, abre a tela do carrinho
  if (cart.length > 0) {
    qS("aside").classList.add("show");

    // Zerando o carrinho e os valores
    qS(".cart").innerHTML = "";
    let pizzaValor = 0;
    let subtotal = 0;
    let desconto = 0;
    let total = 0;
    // Adiciona um loop "for" para percorrer o array "cart"
    for (let i in cart) {
      // Atribui a "pizzaItem" o valor do "item" em "pizzaJson"
      let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);

      // Variável para saber o tamanho da pizza que está no carrinho
      let pos = cart[i].size;

      // Clonar toda a parte de ".cart--item" dentro de ".models"
      let cartItem = qS(".models .cart--item").cloneNode(true);

      // Preenchendo as informações em ".cart--item" com base nos dados de "pizzaItem"
      cartItem.querySelector(
        ".cart--item img"
      ).src = `_assets/_media/${pizzaItem.img}`;

      // O Nome tem um template string para concatenar o Nome com o Tamanho
      cartItem.querySelector(".cart--item-nome").innerHTML = `${
        pizzaItem.name
      } (${pizzaItem.sizes[cart[i].size]})`; // Seleciona dentro do array size do JSON o tamanho

      // Subtotal individual das pizzas
      pizzaValor = pizzaItem.price[pos] * cart[i].qt;
      cartItem.querySelector(".cart--item-price").innerHTML =
        pizzaValor.toLocaleString("pt-br", {
          style: "currency",
          currency: "BRL",
        });

      // Configurando o botão de diminuir a quantidade no carrinho
      cartItem.querySelector(".cart--item-qt").innerHTML = cart[i].qt;
      cartItem
        .querySelector(".cart--item-qtmenos")
        .addEventListener("click", () => {
          if (cart[i].qt > 1) {
            cart[i].qt--;
          } else {
            cart.splice(i, 1);
          }
          updateCart();
        });

      // Configurando o botão de aumentar a quantidade no carrinho
      cartItem
        .querySelector(".cart--item-qtmais")
        .addEventListener("click", () => {
          cart[i].qt++;
          updateCart();
        });

      // Preenchendo todas as informações de foto, nome, tamanho e quantidade em ".cart"
      qS(".cart").append(cartItem);

      // Cálculo do Subtotal do Pedido mostrando na tela
      subtotal += pizzaItem.price[pos] * cart[i].qt;
      qS(".cart--totalitem.subtotal span:last-child").innerHTML =
        subtotal.toLocaleString("pt-br", {
          style: "currency",
          currency: "BRL",
        });
    }

    // Calculando e imprimindo na tela o valor do desconto
    desconto = subtotal * 0.1;
    qS(".cart--totalitem.desconto span:last-child").innerHTML =
      desconto.toLocaleString("pt-br", { style: "currency", currency: "BRL" });

    // Calculando e imprimindo na tela o valor total
    total = subtotal - desconto;
    qS(".cart--totalitem.total.big span:last-child").innerHTML =
      total.toLocaleString("pt-br", { style: "currency", currency: "BRL" });
  } else {
    // Se o array "cart" não tiver nada, remove a "class: show" que mostra o carrinho e no Mobile
    qS("aside").classList.remove("show");
    qS("aside").style.left = "100vw";
  }
};

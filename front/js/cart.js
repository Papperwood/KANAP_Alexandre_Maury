const cart = getCart(); // recuperation de la valeur du localStorage
function getCart() {
  // appel de la fonction getCart pour récupérer les données
  return JSON.parse(localStorage.getItem("kanapLs")); // retourne le tableau de toutes les données de l'api
}

initialize(); // appel de la fonction initialize

async function initialize() {
  productPublication(); // appel de la fonction productPublication
  suppressKanap(); // appel de la fonction suppressKanapm
  modifyQuantity(); // appel de la fonction modifyQuantity
  calculQteTotale(); // appel de la fonction calculQteTotale
  calculPrixTotal(); // appel de la fonction calculPrixTotal
}

// récuperation de l'api avec méthode fetch et stockage dans la variable
async function fetchApi() {
  let cartArrayFull = []; // création d'un tableau qui contient toutes les données
  let cartClassFull = JSON.parse(localStorage.getItem("kanapLs")); // recuperation de la valeur du localStorage
  if (cartClassFull !== null) {
    // si la valeur n'est pas nul alors fonction for est déclenché.
    for (let g = 0; g < cartClassFull.length; g++) {
      await fetch(
        "http://localhost:3000/api/products/" +
          cartClassFull[g].idSelectedProduct
      ) // récupération de l'api avec méthode fetch et stockage dans la variable
        .then((res) => res.json())
        .then((Kanap) => {
          const article = {
            // création d'un objet qui contient toutes les données de l'api
            _id: Kanap._id,
            name: Kanap.name,
            price: Kanap.price,
            color: cartClassFull[g].colorSelectedProduct,
            quantity: cartClassFull[g].quantity,
            alt: Kanap.altTxt,
            img: Kanap.imageUrl,
          };
          cartArrayFull.push(article); // ajout d'un article dans cartArrayFull
        })
        .catch(function (err) {
          // si l'api n'a pas été récupéré alors ......
          console.log(err); // affichage de l'erreur
        });
    }
  }
  return cartArrayFull; // retourne le tableau de toutes les données de l'api
}

// fontion pour intégrer les données de l'api à l'html
async function productPublication() {
  const responseFetch = await fetchApi(); // appel de la fonction fetchApi pour récupérer les données de l'api, stockage dans la variable responseFetch
  if (cart !== null && cart.length !== 0) {
    // si la valeur n'est pas nul et taille differente de 0 alors la fonction s'effectue
    const zonePanier = document.querySelector("#cart__items"); // récupération de l'élément html qui contient toutes les donné
    responseFetch.forEach((product) => {
      zonePanier.innerHTML += `<article class="cart__item" data-id="${product._id}" data-color="${product.color}">
                <div class="cart__item__img">
                  <img src= "${product.img}" alt="Photographie d'un canapé">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${product.name}</h2>
                    <p>${product.color}</p>
                    <p>${product.price} €</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté : </p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                  </div>
                </div>
              </article>`;
    });
  } else {
    // si la valeur n'est pas nul et taille différente
    return emptyCart(); // appel de la fonction emptyCart pour afficher le message d'erreur
  }
}

// met à jour la quantité d'articles dans un panier stocké dans le stockage local
async function modifyQuantity() {
  await fetchApi(); // appel de la fonction fetchApi pour recup données de l'api
  const quantityInCart = document.querySelectorAll(".itemQuantity"); // récupération de tous les champs de l'input
  for (let input of quantityInCart) {
    // pour chaque champ de l'input
    input.addEventListener("change", function () {
      // lorsque l'utilisateur clique sur un champ de l'input
      let cart = getCart(); // récupération de la valeur de la fonction ci dessus
      let idModif = input.closest(".cart__item").dataset.id; // récupération de l'id de l'article modifié
      let colorModif = input.closest(".cart__item").dataset.color; // récupération de la couleur de l'article modifié
      let findId = cart.filter((e) => e.idSelectedProduct === idModif);
      let findColor = findId.find((e) => e.colorSelectedProduct === colorModif); // fusion des deux lignes
      if (input.value > 0) {
        // si la quantité est supérieure à 0
        findColor.quantity = input.value; // on modifie la quantité de l'article modifié
        // appel de la fonction calculPrixTotal pour récupérer le prix total
      }
      calculQteTotale(); // appel de la fonction calculQteTotale pour récupérer la quantité total ligne 153
      calculPrixTotal();
      localStorage.setItem("kanapLs", JSON.stringify(cart));
    });
  }
}

// fonction qui supprime les articles du panier stocké dans le stockage local.
async function suppressKanap() {
  await fetchApi(); // appel de la fonction fetchApi pour recup données de l'api
  const kanapDelete = document.querySelectorAll(".deleteItem"); // récupération de tous les champs de l'input
  kanapDelete.forEach((article) => {
    // pour chaque champ de l'input
    article.addEventListener("click", function (event) {
      // ajout de l'evenement click sur un champ de l'input
      let cart = getCart(); // récupération de la valeur de la fonction ligne 66
      const idDelete = event.target.closest("article").getAttribute("data-id"); // récupération de l'id de l'article supprimé
      const colorDelete = event.target // récupération de la couleur de l'article supprimé
        .closest("article")
        .getAttribute("data-color");
      const searchDeleteKanap = cart.find(
        (element) =>
          element.idSelectedProduct == idDelete &&
          element.colorSelectedProduct == colorDelete
      );
      cart = cart.filter((item) => item != searchDeleteKanap);
      localStorage.setItem("kanapLs", JSON.stringify(cart)); // stockage de la valeur dans le localStorage
      const getSection = document.querySelector("#cart__items"); // récupération de l'élément html qui contient toutes les donnnées
      getSection.removeChild(event.target.closest("article")); // suppression de l'article
      alert("article supprimé !"); // affichage de l'erreur
      calculQteTotale(); // appel de la fonction calculQteTotale pour récupérer la quanttité total ligne 153
      calculPrixTotal(); // appel de la fonction calculPrixTotal pour récupérer le prix total
    });
  });
  if (getCart() !== null && getCart().length === 0) {
    // si la valeur n'est pas nul et taille différente
    localStorage.clear(); // stockage de la valeur dans le localStorage
    return emptyCart(); // appel de la fonction emptyCart pour afficher le message d'erreur
  }
}

// Panier Vide
function emptyCart() {
  const cartTitle = document.querySelector(
    // selection de l'input
    "#limitedWidthBlock div.cartAndFormContainer > h1"
  );
  const emptyCartMessage = "Retournez à la Boutique, Votre panier est vide !"; //  variable qui contient le message d'erreur
  cartTitle.textContent = emptyCartMessage; // affichage du message d'erreur
  cartTitle.style.fontSize = "40px";

  document.querySelector(".cart__order").style.display = "none";
  document.querySelector(".cart__price").style.display = "none";
}

// calcule la quantité totale d'articles dans un panier stocké dans le stockage local
function calculQteTotale() {
  let cart = getCart(); // récupération du panier
  const zoneTotalQuantity = document.querySelector("#totalQuantity"); // récupération de l'élément html qui contient toutes les données
  let quantityInCart = []; // tableau qui contient toutes les données de l'input
  if (cart === null || cart.length === 0) {
    // si la valeur n'est pas nul et taille différente
    emptyCart(); // appel de la fonction emptyCart pour afficher le message d'erreur
  } else {
    // si la valeur n'est pas nul et taille différente
    for (let kanap of cart) {
      // pour chaque article stocké dans le panier
      quantityInCart.push(parseInt(kanap.quantity)); // on ajoute la quantité de l'article stocké dans le tableau
      const reducer = (accumulator, currentValue) => accumulator + currentValue;
      zoneTotalQuantity.textContent = quantityInCart.reduce(reducer, 0);
    }
  }
}

// calcule le prix total des articles dans un panier stocké dans le stockage local
async function calculPrixTotal() {
  const responseFetch = await fetchApi(); // appel de la fonction fetchApi pour recup données de l'api
  let cart = getCart(); // récupération du panier
  const zoneTotalPrice = document.querySelector("#totalPrice"); // récupération de l'élément html qui contient toutes les données
  finalTotalPrice = []; // tableau qui contient toutes les données de l'input
  for (let p = 0; p < responseFetch.length; p++) {
    let sousTotal =
      parseInt(responseFetch[p].quantity) * parseInt(responseFetch[p].price);
    finalTotalPrice.push(sousTotal);

    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    zoneTotalPrice.textContent = finalTotalPrice.reduce(reducer, 0);
  }
}

// modifyQuantity(); // appel de la fonction modifyQuantity
// suppressKanap(); // appel de la fonction suppressKanapm

localStorage.setItem("kanapLs", JSON.stringify(cart)); // stockage de la valeur dans le localStorage

const formFirstNameErrorMsg = document.querySelector("#firstNameErrorMsg"); // declare variable qui contient le message d'erreur first name
const formLastNameErrorMsg = document.querySelector("#lastNameErrorMsg"); // declare variable qui contient le message d'erreur last name
const formAddressErrorMsg = document.querySelector("#addressErrorMsg"); // declare variable qui contient le message d'erreur adresse
const formCityErrorMsg = document.querySelector("#cityErrorMsg"); // declare variable qui contient le message d'erreur city
const formEmailErrorMsg = document.querySelector("#emailErrorMsg"); // declare variable qui contient le message d'erreur e-mail

// stock element du dom pour avoir les info du formulaire
const inputFirstName = document.getElementById("firstName");
const inputLastName = document.getElementById("lastName");
const inputAddress = document.getElementById("address");
const inputCity = document.getElementById("city");
const inputEmail = document.getElementById("email");

const regexFirstName = /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/;
const regexLastName = regexFirstName;
const regexAddress = /^[#.0-9a-zA-ZÀ-ÿ\s,-]{2,60}$/;
const regexCity = regexFirstName;
const regexEmail =
  /^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$/;

const zoneOrderButton = document.querySelector("#order");

zoneOrderButton.addEventListener("click", function (e) {
  e.preventDefault();

  let checkFirstName = inputFirstName.value;
  let checkLastName = inputLastName.value;
  let checkAddress = inputAddress.value;
  let checkCity = inputCity.value;
  let checkEmail = inputEmail.value;

  function orderValidation() {
    let cart = getCart();
    if (
      regexFirstName.test(checkFirstName) == false ||
      checkFirstName === null
    ) {
      formFirstNameErrorMsg.innerHTML = "Merci de renseigner un prénom valide";
      return false;
    } else if (
      regexLastName.test(checkLastName) == false ||
      checkLastName === null
    ) {
      formLastNameErrorMsg.innerHTML =
        "Merci de renseigner un nom de famille valide";
      return false;
    } else if (
      regexAddress.test(checkAddress) == false ||
      checkAddress === null
    ) {
      formAddressErrorMsg.innerHTML =
        "Merci de renseigner une adresse valide (Numéro, voie, nom de la voie, code postal)";
      return false;
    } else if (regexCity.test(checkCity) == false || checkCity === null) {
      formCityErrorMsg.innerHTML = "Merci de renseigner un nom de ville valide";
      return false;
    } else if (regexEmail.test(checkEmail) == false || checkEmail === null) {
      formEmailErrorMsg.innerHTML =
        "Merci de renseigner une adresse email valide";
      return false;
    } else {
      let contact = {
        firstName: checkFirstName,
        lastName: checkLastName,
        address: checkAddress,
        city: checkCity,
        email: checkEmail,
      };

      let products = [];

      for (let KanapId of cart) {
        products.push(KanapId.idSelectedProduct); // boucler sur la quantité de l'article stocké dans le panier
      }

      let finalOrderObject = { contact, products };

      const orderId = fetch("http://localhost:3000/api/products/order", {
        method: "POST",
        body: JSON.stringify(finalOrderObject),
        headers: {
          "Content-type": "application/json",
        },
      });
      orderId.then(async function (response) {
        const retour = await response.json();
        window.location.href = `confirmation.html?orderId=${retour.orderId}`;
      });
    }
  }
  orderValidation();
});

// original
document.title = "Page Panier";
let productRegisterInLocalStorage = JSON.parse(localStorage.getItem("produit"));
const productsPositionHtml = document.getElementById("cart__items");

let compositionProduitsPanier = [];

let totalPrice = 0;
let totalQuantity = 0;
let quantityProductPanier = 0;
let priceProductPanier = 0;
let totalProductPricePanier = 0;
let mesProduits = [];
const findProducts = 0;

let idDelete = 0;
let colorDelete = 0;

const boutonCommander = document.getElementById("order");
let errorFormulaireFirstName = true;
let errorFormulaireLastName = true;
let errorFormulaireAddress = true;
let errorFormulaireCity = true;
let errorFormulaireEmail = true;  

function totalProductsQuantity() {
  totalQuantity += parseInt(quantityProductPanier);
  console.log("Total quantité panier", totalQuantity);
  document.getElementById("totalQuantity").innerText = totalQuantity;
}

function totalProductsPrice() {
  totalProductPricePanier = quantityProductPanier * priceProductPanier;

  totalPrice += totalProductPricePanier;
  console.log("Total prix panier", totalPrice);
  document.getElementById("totalPrice").innerText = totalPrice;
}

function totaux() {
  totalProductsQuantity();
  totalProductsPrice();
}

function recalculTotalQuantity() {
  let newTotalQuantity = 0;
  for (const item of productRegisterInLocalStorage) {
    newTotalQuantity += parseInt(item.quantityProduct);
  }
  console.log("Nouvelle quantité totale panier", newTotalQuantity);

  document.getElementById("totalQuantity").innerText = newTotalQuantity;
}

function recalculTotalPrice() {
  let newTotalPrice = 0;

  for (const item of productRegisterInLocalStorage) {
    const idProductsLocalStorage = item.idProduct;
    const quantityProductsLocalStorage = item.quantityProduct;

    const findProducts = mesProduits.find(
      (element) => element._id === idProductsLocalStorage
    );

    if (findProducts) {
      const newTotalProductPricePanier =
        findProducts.price * quantityProductsLocalStorage;
      newTotalPrice += newTotalProductPricePanier;
      console.log("Nouveau prix total panier", newTotalPrice);
    }

    document.getElementById("totalPrice").innerText = newTotalPrice;
  }
}

let messageErrorQuantity = false;
function changeQuantity() {
  let changeQuantity = document.querySelectorAll(".itemQuantity");
  changeQuantity.forEach((item) => {
    item.addEventListener("change", (event) => {
      event.preventDefault();
      choiceQuantity = Number(item.value);

      let myArticle = item.closest("article");

      let selectMyArticleInLocalStorage = productRegisterInLocalStorage.find(
        (element) =>
          element.idProduct === myArticle.dataset.id &&
          element.colorProduct === myArticle.dataset.color
      );

      if (
        choiceQuantity > 0 &&
        choiceQuantity <= 100 &&
        Number.isInteger(choiceQuantity)
      ) {
        parseChoiceQuantity = parseInt(choiceQuantity);
        selectMyArticleInLocalStorage.quantityProduct = parseChoiceQuantity;
        localStorage.setItem(
          "produit",
          JSON.stringify(productRegisterInLocalStorage)
        );

        recalculTotalQuantity();
        recalculTotalPrice();
        messageErrorQuantity = false;
      } else {
        item.value = selectMyArticleInLocalStorage.quantityProduct;
        messageErrorQuantity = true;
      }
      if (messageErrorQuantity) {
        alert(
          "La quantité d'un article (même référence et même couleur) doit être comprise entre 1 et 100 et être un nombre entier. Merci de rectifier la quantité choisie."
        );
      }
    });
  });
}

function deleteProduct() {
  let selectSupprimer = document.querySelectorAll(".deleteItem");
  selectSupprimer.forEach((selectSupprimer) => {
    selectSupprimer.addEventListener("click", (event) => {
      event.preventDefault();

      let myArticle = selectSupprimer.closest("article");
      console.log(myArticle);

      productRegisterInLocalStorage = productRegisterInLocalStorage.filter(
        (element) =>
          element.idProduct !== myArticle.dataset.id ||
          element.colorProduct !== myArticle.dataset.color
      );

      localStorage.setItem(
        "produit",
        JSON.stringify(productRegisterInLocalStorage)
      );

      alert("Ce produit va être supprimé du panier.");

      if (myArticle.parentNode) {
        myArticle.parentNode.removeChild(myArticle);
      }

      if (
        productRegisterInLocalStorage === null ||
        productRegisterInLocalStorage.length === 0
      ) {
        messagePanierVide();
      } else {
        recalculTotalQuantity();
        recalculTotalPrice();
      }
    });
  });
}

function messagePanierVide() {
  compositionProduitsPanier = "Le panier est vide !";
  let newH2 = document.createElement("h2");
  productsPositionHtml.appendChild(newH2);
  newH2.innerText = compositionProduitsPanier;

  document.getElementById("totalQuantity").innerText = 0;
  document.getElementById("totalPrice").innerText = 0;
}

let textRegex = new RegExp(
  "^[^.?!:;,/\\/_-]([. '-]?[a-zA-Zàâäéèêëïîôöùûüç])+[^.?!:;,/\\/_-]$"
);
let addressRegex = new RegExp(
  "^[^.?!:;,/\\/_-]([, .:;'-]?[0-9a-zA-Zàâäéèêëïîôöùûüç])+[^.?!:;,/\\/_-]$"
);
let emailRegex = new RegExp(
  "^[^. ?!:;,/\\/_-]([._-]?[a-z0-9])+[^.?!: ;,/\\/_-][@][a-z0-9]+[.][a-z][a-z]+$"
);

let inputFirstName = document.getElementById("firstName");
let inputLastName = document.getElementById("lastName");
let inputAddress = document.getElementById("address");
let inputCity = document.getElementById("city");
let inputEmail = document.getElementById("email");

let checkValueFirstName;
let checkValueLastName;
let checkValueAddress;
let checkValueCity;
let checkValueEmail;

inputFirstName.addEventListener("change", function () {
  let firstNameErrorMsg = inputFirstName.nextElementSibling;
  checkValueFirstName = textRegex.test(inputFirstName.value);
  if (checkValueFirstName) {
    firstNameErrorMsg.innerText = "";
    errorFormulaireFirstName = false;
  } else {
    firstNameErrorMsg.innerText = "Veuillez indiquer un prénom.";
    errorFormulaireFirstName = true;
  }
});

inputLastName.addEventListener("change", function () {
  let lastNameErrorMsg = inputLastName.nextElementSibling;
  checkValueLastName = textRegex.test(inputLastName.value);
  if (checkValueLastName) {
    lastNameErrorMsg.innerText = "";
    errorFormulaireLastName = false;
  } else {
    lastNameErrorMsg.innerText = "Veuillez indiquer un nom de famille.";
    errorFormulaireLastName = true;
  }
});

inputAddress.addEventListener("change", function () {
  let addressErrorMsg = inputAddress.nextElementSibling;
  checkValueAddress = addressRegex.test(inputAddress.value);
  if (checkValueAddress) {
    addressErrorMsg.innerText = "";
    errorFormulaireAddress = false;
  } else {
    addressErrorMsg.innerText = "Veuillez indiquer une adresse.";
    errorFormulaireAddress = true;
  }
});

inputCity.addEventListener("change", function () {
  let cityErrorMsg = inputCity.nextElementSibling;
  checkValueCity = textRegex.test(inputCity.value);
  if (checkValueCity) {
    cityErrorMsg.innerText = "";
    errorFormulaireCity = false;
  } else {
    cityErrorMsg.innerText = "Veuillez indiquer le nom d'une ville.";
    errorFormulaireCity = true;
  }
});

inputEmail.addEventListener("change", function () {
  let emailErrorMsg = inputEmail.nextElementSibling;
  checkValueEmail = emailRegex.test(inputEmail.value);
  if (checkValueEmail) {
    emailErrorMsg.innerText = "";
    errorFormulaireEmail = false;
  } else {
    emailErrorMsg.innerText = "Veuillez renseigner un email correct.";
    errorFormulaireEmail = true;
  }
});

if (
  productRegisterInLocalStorage === null ||
  productRegisterInLocalStorage.length === 0
) {
  messagePanierVide();

  boutonCommander.addEventListener("click", (event) => {
    alert("Votre panier est vide !");
    event.preventDefault();
  });
} else {
  fetch("http://localhost:3000/api/products")
    .then((response) => response.json())
    .then((data) => {
      mesProduits = data;

      for (let i = 0; i < productRegisterInLocalStorage.length; i++) {
        let colorProductPanier = productRegisterInLocalStorage[i].colorProduct;
        let idProductPanier = productRegisterInLocalStorage[i].idProduct;
        quantityProductPanier =
          productRegisterInLocalStorage[i].quantityProduct;

        const compositionProduitsPanier = data.find(
          (element) => element._id === idProductPanier
        );

        priceProductPanier = compositionProduitsPanier.price;

        let newArticle = document.createElement("article");
        newArticle.setAttribute("class", "cart__item");
        newArticle.setAttribute("data-id", `${idProductPanier}`);
        newArticle.setAttribute("data-color", `${colorProductPanier}`);
        productsPositionHtml.appendChild(newArticle);

        let newDivImg = document.createElement("div");
        newDivImg.setAttribute("class", "cart__item__img");
        newArticle.appendChild(newDivImg);

        let newImg = document.createElement("img");
        newImg.setAttribute("src", compositionProduitsPanier.imageUrl);
        newImg.setAttribute("alt", compositionProduitsPanier.altTxt);
        newDivImg.appendChild(newImg);

        let newDivContent = document.createElement("div");
        newDivContent.setAttribute("class", "cart__item__content");
        newArticle.appendChild(newDivContent);

        let newDivContentDescription = document.createElement("div");
        newDivContentDescription.setAttribute(
          "class",
          "cart__item__content__description"
        );
        newDivContent.appendChild(newDivContentDescription);

        let newH2 = document.createElement("h2");
        newH2.innerText = compositionProduitsPanier.name;
        newDivContentDescription.appendChild(newH2);

        let newPColor = document.createElement("p");
        newPColor.innerText = colorProductPanier;
        newDivContentDescription.appendChild(newPColor);

        let newPPrice = document.createElement("p");
        newPPrice.innerText = compositionProduitsPanier.price + " €";
        newDivContentDescription.appendChild(newPPrice);

        let newDivContentSettings = document.createElement("div");
        newDivContentSettings.setAttribute(
          "class",
          "cart__item__content__settings"
        );
        newDivContent.appendChild(newDivContentSettings);

        let newDivContentSettingsQuantity = document.createElement("div");
        newDivContentSettingsQuantity.setAttribute(
          "class",
          "cart__item__content__settings__quantity"
        );
        newDivContentSettings.appendChild(newDivContentSettingsQuantity);

        let newPQuantite = document.createElement("p");
        newPQuantite.innerText = "Qté :";
        newDivContentSettingsQuantity.appendChild(newPQuantite);

        let newPInput = document.createElement("input");
        newPInput.setAttribute("type", "number");
        newPInput.setAttribute("class", "itemQuantity");
        newPInput.setAttribute("name", "itemQuantity");
        newPInput.setAttribute("min", "1");
        newPInput.setAttribute("max", "100");
        newPInput.setAttribute("value", `${quantityProductPanier}`);
        newDivContentSettingsQuantity.appendChild(newPInput);

        let newDivContentSettingsDelete = document.createElement("div");
        newDivContentSettingsDelete.setAttribute(
          "class",
          "cart__item__content__settings__delete"
        );
        newDivContentSettings.appendChild(newDivContentSettingsDelete);

        let newPDelete = document.createElement("p");
        newPDelete.setAttribute("class", "deleteItem");
        newPDelete.innerText = "Supprimer";
        newDivContentSettingsDelete.appendChild(newPDelete);

        totaux();
      }
      deleteProduct();

      changeQuantity();
    });
  boutonCommander.addEventListener("click", (event) => {
    event.preventDefault();
    if (
      productRegisterInLocalStorage === null ||
      productRegisterInLocalStorage.length === 0
    ) {
      alert("Votre panier est vide !");
    } else {
      if (
        !inputFirstName.value ||
        !inputLastName.value ||
        !inputAddress.value ||
        !inputCity.value ||
        !inputEmail.value
      ) {
        alert("Vous devez renseigner tous les champs !");
        event.preventDefault();
      } else if (
        errorFormulaireFirstName === true ||
        errorFormulaireLastName === true ||
        errorFormulaireAddress === true ||
        errorFormulaireCity === true ||
        errorFormulaireEmail === true
      ) {
        alert(
          "Veuillez vérifier les champs du formulaire et les remplir correctement !"
        );
        event.preventDefault();
      } else {
        let idProducts = [];
        for (let l = 0; l < productRegisterInLocalStorage.length; l++) {
          idProducts.push(productRegisterInLocalStorage[l].idProduct);
        }

        const order = {
          contact: {
            firstName: inputFirstName.value,
            lastName: inputLastName.value,
            address: inputAddress.value,
            city: inputCity.value,
            email: inputEmail.value,
          },
          products: idProducts,
        };

        const options = {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(order),
        };

        fetch("http://localhost:3000/api/products/order", options)
          .then((response) => response.json())
          .then((data) => {
            document.location.href = `confirmation.html?orderId=${data.orderId}`;
          })
          .catch((err) => {
            console.log("Erreur Fetch product.js", err);
            alert("Un problème a été rencontré lors de l'envoi du formulaire.");
          });

        localStorage.clear();
      }
    }
  });
}

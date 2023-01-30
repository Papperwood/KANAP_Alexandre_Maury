// création de la variable kanapId qui en utilisant window.location.search va prend l'Id du produit.
const kanapId = new URLSearchParams(window.location.search).get("id");
console.log(kanapId);
// if vérifie si la valeur de kanapId n'est pas nulle. Si la valeur n'est pas nulle, la valeur a sera enregistrée dans kanapId.
if (kanapId !== null) {
  // utilisation de la méthode fetch() pour récuperer les données de l'API ${kanapId} est la valeur stockée dans kanapId.  
  fetch(`http://localhost:3000/api/products/${kanapId}`)
    .then((response) => response.json())
    .then((selectProduct) => {
      // création de l'article (balise html) puis récuperation des données de l'Api pour les mettres en forme   
      console.log(selectProduct);
      const img = document.createElement("img");
        img.alt = selectProduct.altTxt;
        img.src = selectProduct.imageUrl;
        document.getElementsByClassName("item__img")[0].appendChild(img);
        document.getElementById("title").innerText = selectProduct.name;
        document.getElementById("price").innerText = selectProduct.price + " ";
        document.getElementById("description").innerText =
            selectProduct.description;
        // boucle de type forEach, definition de la couleur dans le selecteur de la page product 
        selectProduct.colors.forEach(function (color) {
            const option = document.createElement("option");
            const select = document.getElementById("colors");
            option.value = color;
            option.innerText = color;
            select.appendChild(option);
        });
// création de la fonction butonPanier qui va ajouter l'article au panier donc a cart.js plus tard       
      const butonPanier = document.querySelector("#addToCart");

        butonPanier.addEventListener("click", (event) => {
        event.preventDefault();

        const colorId = document.querySelector("#colors");

        choiceColor = colorId.value;

        const quantity = document.querySelector("#quantity");
        choiceQuantity = Number(quantity.value);
        console.log(choiceQuantity);
        if (
          choiceColor !== "" &&
          choiceQuantity > 0 &&
          choiceQuantity <= 100 &&
          Number.isInteger(choiceQuantity)
        ) {
          let optionsProduct = {
            idProduct: selectProduct._id,
            colorProduct: choiceColor,
            quantityProduct: choiceQuantity,
          };
          console.log(optionsProduct);
          let messageLocalStorageUpdating = false;
          const addProductLocalStorage = () => {
            let findProduct = produitEnregistreDansLocalStorage.find((x) => {
              return (
                x.idProduct === optionsProduct.idProduct &&
                x.colorProduct === optionsProduct.colorProduct
              );
            });
            if (findProduct) {
              const total =
                Number(findProduct.quantityProduct) +
                Number(optionsProduct.quantityProduct);
              if (total <= 100) {
                messageLocalStorageUpdating = false;
                findProduct.quantityProduct =
                  Number(findProduct.quantityProduct) +
                  Number(optionsProduct.quantityProduct);
                alert(
                  `La quantité du produit ${selectProduct.name} de couleur ${choiceColor} a bien été mise à jour.`
                );
              } else {
                messageLocalStorageUpdating = false;
                alert(
                  "La quantité d'un article (même référence et même couleur) ne peut pas dépasser 100. Merci de rectifier la quantité choisie."
                );
              }
            } else {
              messageLocalStorageUpdating = true;

              produitEnregistreDansLocalStorage.push(optionsProduct);
            }
            localStorage.setItem(
              "produit",
              JSON.stringify(produitEnregistreDansLocalStorage)
            );
          };
          let produitEnregistreDansLocalStorage = JSON.parse(
            localStorage.getItem("produit")
          );

          if (produitEnregistreDansLocalStorage) {
            addProductLocalStorage();
            console.log(produitEnregistreDansLocalStorage);
          } else {
            produitEnregistreDansLocalStorage = [];
            addProductLocalStorage();
            console.log(produitEnregistreDansLocalStorage);

            messageLocalStorageUpdating = false;
            alert(
              `Félicitations !! Vous venez d'ajouter votre premier produit dans le panier ! `
            );
          }

          if (messageLocalStorageUpdating) {
            alert(
              `Le produit ${selectProduct.name} de couleur ${choiceColor} a bien été ajouté au panier.`
            );
          }
        } else {
          alert(
            `La couleur n'est pas sélectionnée et/ou la quantité n'est pas comprise entre 1 et 100 ou n'est pas un nombre entier. Veuillez vérifier !`
          );
        }
      });
    })
    .catch((err) => {
      console.log(
        "Erreur Fetch product.js : l'id du produit est incorrect.",
        err
      );
      alert(`Le produit sélectionné n'a pas été trouvé !`);
      window.location.href = "index.html";
    });
} else {
  console.log("L'id du produit n'a pas été indiqué dans l'url.");
  alert(`Le produit sélectionné n'a pas été trouvé !`);
  window.location.href = "index.html";
}

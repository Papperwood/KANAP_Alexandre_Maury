// création de la variable kanapId qui en utilisant window.location.search va prend l'Id du produit.
const kanapId = new URLSearchParams(window.location.search).get("id");
console.log(kanapId);
// if vérifie si la valeur de kanapId n'est pas nulle. Si la valeur n'est pas nulle, la valeur a sera enregistrée dans kanapId.
if (kanapId !== null) {
  // utilisation de la méthode fetch() pour récuperer les données de l'API ${kanapId} est la valeur stockée dans kanapId.
  fetch(`http://localhost:3000/api/products/${kanapId}`)
    .then((response) => response.json())
    .then((product) => {
      // création de l'article (balise html) puis récuperation des données de l'Api pour les mettres en forme
      console.log(product);
      displayproduct(product);
      // création de la variable buttonPanier
      addProductEvent(product);
    })
    // Gestion de possible erreur de l'opération fetch() ci dessus en utilisant catch
    .catch((err) => {
      console.log(
        "Erreur Fetch product.js : l'id du produit est incorrect.",
        err
      );
      alert(`Le produit sélectionné n'a pas été trouvé !`);
      window.location.href = "index.html";
    });

  // if (kanapId !== null) n'est pas passé donc le produit ne sera pas afficher alors message d'erreur
} else {
  console.log("L'id du produit n'a pas été indiqué dans l'url.");
  alert(`Le produit sélectionné est introuvable !`);
  window.location.href = "index.html";
}

function displayproduct(product) {
  const img = document.createElement("img");
  img.alt = product.altTxt;
  img.src = product.imageUrl;
  document.getElementsByClassName("item__img")[0].appendChild(img);
  document.getElementById("title").innerText = product.name;
  document.getElementById("price").innerText = product.price + " ";
  document.getElementById("description").innerText = product.description;
  // boucle de type forEach, definition de la couleur dans le selecteur de la page product
  const select = document.getElementById("colors");
  product.colors.forEach((color) => {
    const option = document.createElement("option");
    option.value = color;
    option.innerText = color;
    select.appendChild(option);
  });
}
function addProductEvent(product) {
  const buttonPanier = document.querySelector("#addToCart");

  buttonPanier.addEventListener("click", (event) => {
    event.preventDefault();
    
    // colorId stock la couleur de l'Id qui sort de #colors avec la méthode document.querySelector
    const choiceColor = select.value;
    // quantity stock la quantité de l'Id qui sort de #quantity avec la méthode document.querySelector
    const quantity = document.querySelector("#quantity");
    const choiceQuantity = Number(quantity.value);
    console.log(choiceQuantity);
    // vérification choiceColor n'est pas une chaîne vide, choiceQuantity est supérieur à 0 et inférieur ou égal à 100 , choiceQuantity est un entier. puis le code est éxécuté
    if (
      choiceColor !== "" &&
      choiceQuantity > 0 &&
      choiceQuantity <= 100 &&
      Number.isInteger(choiceQuantity)
    ) {
      let optionsProduct = {
        idProduct: product._id,
        colorProduct: choiceColor,
        quantityProduct: choiceQuantity,
      };
      console.log(optionsProduct);
      // messageLocalStorage ci dessous permet d'afficher un message dynamique qui va grace à ${product.name} et ${choiceColor} donner le bon produit et la bonne couleur
      let messageLocalStorage = false;
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
            messageLocalStorage = false;
            findProduct.quantityProduct =
              Number(findProduct.quantityProduct) +
              Number(optionsProduct.quantityProduct);
            // if bien éxecuté donc message de validation
            alert(
              `La quantité du produit ${product.name} de couleur ${choiceColor} a bien été mise à jour.`
            );
          } else {
            messageLocalStorage = false;
            // if non éxecuté donc alert pour client
            alert(
              "La quantité d'un article (même référence et même couleur) ne peut pas dépasser 100. Merci de rectifier la quantité choisie."
            );
          }
        } else {
          messageLocalStorage = true;

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

        messageLocalStorage = false;
        alert(
          `Félicitations !! Vous venez d'ajouter votre premier produit dans le panier ! `
        );
      }

      if (messageLocalStorage) {
        alert(
          `Le produit ${product.name} de couleur ${choiceColor} a bien été ajouté au panier.`
        );
      }
    }
    // sinon message d'erreur qui répond au if
    else {
      alert(
        `La couleur n'est pas sélectionnée et/ou la quantité n'est pas comprise entre 1 et 100. Veuillez vérifier !`
      );
    }
  });
}

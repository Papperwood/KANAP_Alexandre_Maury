// Choisir l'endroit où afficher nos produits sur la page d'accueil, ici dans la section identifiée par "items".
const sectionItems = document.querySelector("#items");
// Récupération de toutes les données de l'API pour les stocker dans une constante listProducts.
fetch("http://localhost:3000/api/products")
  .then((response) => response.json())
  .then((data) => {
    for (const listProducts of data) {
      console.log(listProducts);

      let newA = document.createElement("a");
      newA.setAttribute("href", `./product.html?id=${listProducts._id}`);
      sectionItems.appendChild(newA);

      let newArticle = document.createElement("article");
      newA.appendChild(newArticle);

      let newImg = document.createElement("img");
      newImg.setAttribute("src", listProducts.imageUrl);
      newImg.setAttribute("alt", listProducts.altTxt);
      newArticle.appendChild(newImg);

      let newH3 = document.createElement("h3");
      newH3.setAttribute("class", "productName");
      newH3.innerText = listProducts.name;
      newArticle.appendChild(newH3);

      let newP = document.createElement("p");
      newP.setAttribute("class", "productDescription");
      newP.innerText = listProducts.description;
      newArticle.appendChild(newP);
    }
  })
  .catch((err) => {
    alert(
      `Désolé, il semble qu'il y ait eu une erreur lors du chargement du produit demandé. Veuillez vérifier votre connexion internet ou réessayer plus tard.`
    );
    console.log("Erreur Fetch index.js", err);
  });

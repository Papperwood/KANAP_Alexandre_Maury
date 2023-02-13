
// Variable articleItems, qui a pour fonction de stocker l'article avec son ID propre dans "#items".
const articleItems = document.querySelector("#items");
// utilisation de la fonction fetch() pour récuperer les données de l'API, then((response) => response.json()) extrait les données JSON.
// .then((data) => cree les elements HTML pour chaque produit. élément produit est créé en utilisant les méthodes createElement() et setAttribute().
fetch("http://localhost:3000/api/products")
  .then((response) => response.json())
  .then((products) => {
    for (const product of products) {
      console.log(product);

      let newA = document.createElement("a");
      newA.setAttribute("href", `./product.html?id=${product._id}`);
      articleItems.appendChild(newA);

      let newArticle = document.createElement("article");
      newA.appendChild(newArticle);

      let newImg = document.createElement("img");
      newImg.setAttribute("src", product.imageUrl);
      newImg.setAttribute("alt", product.altTxt);
      newArticle.appendChild(newImg);

      let newH3 = document.createElement("h3");
      newH3.setAttribute("class", "productName");
      newH3.innerText = product.name;
      newArticle.appendChild(newH3);

      let newP = document.createElement("p");
      newP.setAttribute("class", "productDescription");
      newP.innerText = product.description;
      newArticle.appendChild(newP);
    }
  })
  // Utilisation de la méthode catch() en cas d'echec de la fonction fetch() ce qui afficheras un message d'alerte. 
  .catch((err) => {
    alert(
      `Désolé, il semble qu'il y ait eu un problème lors du chargement du produit demandé. Veuillez vérifier votre connexion Internet ou réessayer plus tard. Si le problème persiste, veuillez nous contacter pour obtenir de l'assistance.`
    );
    console.log("Erreur Fetch index.js", err);
  });

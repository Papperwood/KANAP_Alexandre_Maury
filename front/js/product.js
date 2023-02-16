// 'new URL(location.href)' crée un nouvel URLobjet basé sur l'URL de la page actuelle. 
let url = new URL(location.href); 
// url.searchParams.get("id") récupère la valeur du paramètre "id"
let kanapPageId = url.searchParams.get("id"); 

const a = document.querySelector(".item__img"); // On récupère l'élément <img> qui contient l'image
const b = document.querySelector("#title"); // On récupère l'élément <h1> qui contient le titre
const c = document.querySelector("#price");	// On récupère l'élément <h1> qui contient le prix		
const d = document.querySelector("#description"); // On récupère l'élément qui contient la description
const e = document.querySelector("#colors"); // On récupère l'élément qui contient les couleurs
const f = document.querySelector("#quantity"); // On récupère l'élément qui contient la quantité

fetch(`http://localhost:3000/api/products/${kanapPageId}`) // On récupère l'élément
	.then((res) => res.json()) // On récupère la réponse
	.then((object) => { // On récupère l'objet JSON
		const imgKanap = object.imageUrl; // On récupère l'url de l'image
		const nameKanap = object.name; // On récupère le nom de l'image
		const priceKanap = object.price; // On récupère le prix de l'image
		const descriptionKanap = object.description; // On récupère la description de l'image
		const colorsKanap = object.colors; // On récupère les couleurs de l'image


		for (let couleur of colorsKanap) { // On récupère tous les couleurs de l'image
			e.innerHTML += `<option value="${couleur}">${couleur}</option>`; // On ajoute les couleurs dans le select
		}
		a.innerHTML += `<img src="${imgKanap}" alt="Photographie d'un canapé">`; // On ajoute l'image dans l'élément <img>
		b.innerText += `${nameKanap}`; // On ajoute le nom de l'image dans le h1
		c.innerText += `${priceKanap} `; // On ajoute le nom de l'image 
		d.innerText += `${descriptionKanap}`; // On ajoute la description du Kanap

		// variable button à qui on affecte le résultat de l'appel de 'document.getElementById()'
		const button = document.getElementById("addToCart");
		// // Ajout de addEventlistener sur le bouton 'addToCart' par un click
		button.addEventListener("click", () => { 
			// cartValue est l'objet qui contient les données du Kanap en question
			let cartValue = { 
				idSelectedProduct: kanapPageId,
				nameSelectedProduct: nameKanap,
				colorSelectedProduct: e.value,
				quantity: f.value
			};
			// mise en place de getCart 
			function getCart() {
				let cartValue = JSON.parse(localStorage.getItem("kanapLs")); // On récupère la valeur de "kanapLs" dans l'objet ci dessus
				if (cartValue === null) {
					return [];			// Si la valeur de "cartValue" est vide, retourne un tableau vide
				} else {
					return cartValue // Sinon retourne valeur de l'objet "cartValue"
				}
			}

			function addCart(product) {
				let cartValue = getCart(); // On récupère la valeur de "cartValue" dans l'objet 
				let foundProducts = cartValue.find( // méthode 'find' pour rechercher et retourner le produit 
					(item) => // 
						item.idSelectedProduct === product.idSelectedProduct && item.colorSelectedProduct === product.colorSelectedProduct	
					); 
				if (
						foundProducts == undefined && e.value != "" &&	f.value > 0 && f.value <= 100 // Si le produit n'est pas trouvé dans la liste de produits,
					) {
						product.quantity = f.value;  // On ajoute la quantité de l'image
						cartValue.push(product);	// méthode push ajoute le produit dans la liste de produits				 
				} else {
					let newQuantity = parseInt(foundProducts.quantity) + parseInt(f.value); // On ajoute la quantité de l'image
					foundProducts.quantity = newQuantity; // On met à jour la quantité de l'image
					}
					saveCart(cartValue);
					alert( // mise en place de l'alerte
						`Le canapé ${nameKanap} ${e.value} a été ajouté en ${f.value} exemplaires à votre panier !` // message dynamique avec ${} pour le nom , le prix et la quantité
					);
			}
			function saveCart(cartValue) { // On met à jour la quantité de l'image
				localStorage.setItem("kanapLs", JSON.stringify(cartValue)); // On met à jour la valeur de "cartValue" dans l'objet
			}
			if (e.value === "") { // Si la couleur non selctionnée est vid
				alert("Veuillez choisir une des couleur disponible.");
			}
			else if ( f.value <= 0 || f.value > 100) { // Si la quantité est invalide
				alert("Veuillez sélectionner une quantité comprise entre 1 et 100.");
			} else {
				addCart(cartValue); // On ajoute le produit dans la liste de produits
			}
		});
	})
	// méthode catch pour récupérer les erreurs dans la console si feet echoue
	.catch(function (err) {
		console.log(err);
	});

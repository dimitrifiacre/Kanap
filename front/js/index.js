// On récupère les produits de l'API
function getProduct() {
  fetch("http://localhost:3000/api/products")
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      let sectionItems = document.querySelector("#items");
      sectionItems.innerHTML = "Aucun produit n'a été trouvé";
    })

    // On affiche les données de l'API dans le DOM
    .then((resultAPI) => {
      const products = resultAPI;
      for (let product in products) {
        let productCard = document.createElement("a");
        document.querySelector("#items").appendChild(productCard);
        productCard.href = `./product.html?id=${resultAPI[product]._id}`;

        let productArticle = document.createElement("article");
        productCard.appendChild(productArticle);

        let productImage = document.createElement("img");
        productArticle.appendChild(productImage);
        productImage.src = resultAPI[product].imageUrl;
        productImage.alt = resultAPI[product].altTxt;

        let productName = document.createElement("h3");
        productArticle.appendChild(productName);
        productName.classList.add("productName");
        productName.innerHTML = resultAPI[product].name;

        let productDescription = document.createElement("p");
        productArticle.appendChild(productDescription);
        productDescription.classList.add("productDescription");
        productDescription.innerHTML = resultAPI[product].description;
      }
    });
}
// On lance la fonction (provisoirement)
getProduct();

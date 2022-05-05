// On cherche les paramètres de l'URL
let searchParams = new URLSearchParams(window.location.search);
let searchID = searchParams.get("id");

// On vérifie si l'URL a bien un ID
function checkProduct() {
  if (searchParams.has('id')) {
    let productID = searchParams.get('id');
  } else {
    let sectionItem = document.querySelector(".item");
    sectionItem.textContent = "Le produit n'a pas été trouvé";
    document.title = `Produit indisponible – Kanap`;
  }
}

// On récupère les données du produit en fonction de son ID
function showProduct() {
  fetch(`http://localhost:3000/api/products/${searchID}`)
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      let sectionItems = document.querySelector(".item");
      sectionItems.textContent = "Le produit n'a pas été trouvé";
    })

    // On affiche les données de l'API dans le DOM
    .then((resultAPI) => {
      document.title = `Canapé "${resultAPI.name}" – Kanap`;

      let productImage = document.createElement("img");
      document.querySelector(".item__img").appendChild(productImage);
      productImage.src = resultAPI.imageUrl;
      productImage.alt = resultAPI.altTxt;

      let productTitle = document.querySelector("#title");
      productTitle.textContent = resultAPI.name;

      let productPrice = document.querySelector("#price");
      productPrice.textContent = resultAPI.price;

      let productDescription = document.querySelector("#description");
      productDescription.textContent = resultAPI.description;

      let productColors = document.querySelector("#colors");
      for (let i = 0; i < resultAPI.colors.length; i++) {
        let productColorsOption = document.createElement("option");
        productColorsOption.textContent = resultAPI.colors[i];
        productColors.appendChild(productColorsOption);
      }
    });
}

// On lance les fonctions (provisoirement)
checkProduct();
showProduct();
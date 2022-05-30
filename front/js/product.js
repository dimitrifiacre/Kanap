// On cherche les paramètres de l'URL
let searchParams = new URLSearchParams(window.location.search);
let searchID = searchParams.get("id");

// On vérifie si l'URL a bien un ID
function checkProduct() {
  if (!(searchParams.has('id'))) {
    document.location.href = "./index.html";
  }
}

// On récupère les données du produit en fonction de son ID
function showProduct() {
  fetch(`http://localhost:3000/api/products/${searchID}`)
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      let sectionItem = document.querySelector(".item");
      sectionItem.textContent = "Le produit n'a pas été trouvé";
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
        productColorsOption.value = resultAPI.colors[i];
        productColors.appendChild(productColorsOption);
      }
    });
}

function addToCart() {
  let addToCartBtn = document.querySelector("#addToCart");
  let getStorage = JSON.parse(localStorage.getItem("products"));

  addToCartBtn.addEventListener("click", () => {

    // On crée le produit qui sera ajouté au panier
    let productAdded = {
      id: searchID,
      quantity: parseFloat(document.querySelector("#quantity").value),
      colors: document.querySelector("#colors").value,
    }

    // Tableau du localStorage
    let ProductsInCart = [];

    // On vérifie d'avoir choisi une couleur et que ça soit entre 1 et 100 quantités
    if (productAdded.colors == '') {
      alert('Vous devez choisir une couleur')
    } else if (productAdded.quantity < 1 || productAdded.quantity > 100) {
      alert('Vous devez choisir une quantité entre 1 et 100')
    } else {

      // Si le localStorage est vide, on crée le produit
      if (getStorage == null) {
        ProductsInCart.push(productAdded);
        localStorage.setItem("products", JSON.stringify(ProductsInCart));

        // Produit trouvé, on ajoute la quantité
      } else if (getStorage !== null && getStorage.find(product => product.id === searchID && product.colors === document.querySelector("#colors").value) != undefined) {

        // On cherche un produit par son ID/couleur que si un produit est déjà dans le localStorage
        let foundProduct = getStorage.find(product => product.id === searchID && product.colors === document.querySelector("#colors").value);
        ProductsInCart = getStorage;
        let addQuantity = parseInt(productAdded.quantity) + parseInt(foundProduct.quantity);
        foundProduct.quantity = addQuantity;
        localStorage.setItem("products", JSON.stringify(ProductsInCart));

        // Si le localStorage existe, on le récupère et on ajoute le nouveau produit
      } else if (getStorage !== null) {
        ProductsInCart = getStorage;
        ProductsInCart.push(productAdded);
        localStorage.setItem("products", JSON.stringify(ProductsInCart));
      }

      document.location.href = "./cart.html";
    }
  });
}

checkProduct();
showProduct();
addToCart()
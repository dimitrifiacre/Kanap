// On récupère le localStorage
let ProductsInCart = JSON.parse(localStorage.getItem("products"));

// On récupère les infos de l'API par rapport à l'ID du produit dans le localStorage
function getProduct(productLocalStorage) {
    fetch(`http://localhost:3000/api/products/${productLocalStorage.id}`)
        .then((response) => {
            return response.json();
        })
        .then((productAPI) => {
            showProduct(productLocalStorage, productAPI);
        })
        .catch((error) => {
            let errorMessage = document.querySelector("#cart__items");
            errorMessage.style.textAlign = "center";
            errorMessage.style.marginBottom = "135px";
            errorMessage.textContent = ("Aucune information trouvé à partir de l'API");
        });
}

// Le code et les variables qui seront affichés dans le panier
function showProduct(productLocalStorage, productAPI) {
    let products = document.querySelector("#cart__items");
    products.innerHTML += `
        <article class="cart__item" data-id="${productLocalStorage.id}" data-color="${productLocalStorage.colors}">
            <div class="cart__item__img">
                <img src="${productAPI.imageUrl}" alt="${productAPI.altTxt}">
            </div>
            <div class="cart__item__content">
                <div class="cart__item__content__description">
                    <h2>${productAPI.name}</h2>
                    <p>${productLocalStorage.colors}</p>
                    <p>${productAPI.price} €</p>
                </div>
                <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                        <p>Qté : </p>
                        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${productLocalStorage.quantity}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                    <p class="deleteItem">Supprimer</p>
                    </div>
                </div>
            </div>
        </article>`;
}

// Une boucle pour afficher les produits dans le panier
function addProduct() {
    if (ProductsInCart == null) {
        let errorMessage = document.querySelector("#cart__items");
        errorMessage.style.textAlign = "center";
        errorMessage.style.marginBottom = "135px";
        errorMessage.textContent = ("Votre panier est vide");
    } else {
        for (let product of ProductsInCart) {
            getProduct(product);
        }
    }
}

// On lance la fonction
addProduct();
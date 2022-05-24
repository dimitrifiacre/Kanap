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
    let deleteButtons = document.getElementsByClassName("deleteItem");
    let quantityInputs = document.getElementsByClassName("itemQuantity");

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

    // On appelle les fonctions lors du clic ou changement de l'input
    for (let button of deleteButtons) {
        button.addEventListener("click", removeProduct);
    }

    for (let input of quantityInputs) {
        input.addEventListener("change", editQuantityProduct);
    }
}

// Une boucle pour afficher les produits dans le panier
function addProduct() {
    if (ProductsInCart == null || ProductsInCart.length == 0) {
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

// On retire le produit du localStorage en fonction de son ID et sa couleur
function removeProduct(click) {
    let targetProduct = click.target.closest("article");
    ProductsInCart = ProductsInCart.filter(product => product._id !== targetProduct.dataset.id && product.colors !== targetProduct.dataset.color);
    localStorage.setItem("products", JSON.stringify(ProductsInCart));

    alert("Le produit a été supprimé");
    window.location.reload();
}

// On modifie la quantité du produit et on le remplace dans le localStorage
function editQuantityProduct(click) {
    let targetProduct = click.target.closest("article");

    if (product => product._id !== targetProduct.dataset.id && product.colors == targetProduct.dataset.color) {
        let quantityProduct = click.target.closest(".itemQuantity");

        // On cherche un produit par son ID/couleur dans le localStorage et on récupère sa quantité pour la remplacer par celle présente dans l'input 
        let foundProduct = ProductsInCart.find(product => product.id == targetProduct.dataset.id && product.colors == targetProduct.dataset.color);
        let newQuantity = parseInt(quantityProduct.value);
        foundProduct.quantity = newQuantity;
        localStorage.setItem("products", JSON.stringify(ProductsInCart));
    }
}

// On affiche le total des articles
function showTotalProduct() {
    let showTotalQuantity = document.querySelector("#totalQuantity");
    let totalQuantity = 0;

    for (let i = 0; i < ProductsInCart.length; i++) {
        totalQuantity += ProductsInCart[i].quantity;
    };

    showTotalQuantity.textContent = totalQuantity;
}

// On récupère les données du formulaire et du localStorage pour les envoyer au back
function toOrder() {
    let formLocation = document.querySelector(".cart__order__form");

    // Les différents RegExp
    let emailRegExp = new RegExp("^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$");
    let textRegExp = new RegExp("^[a-zéèçà]{3,50}(-| )?([a-zéèçà]{3,50})?$");

    // On vérifie que regexp est valide pour les textes
    function validInput(inputText) {
        let inputErrorMessage = inputText.nextElementSibling;

        if (textRegExp.test(inputText.value)) {
            inputErrorMessage.textContent = '';
            return true;
        } else {
            inputErrorMessage.textContent = 'Veuillez entrer un texte valide.';
            return false;
        }
    };

    // On vérifie que regexp est valide pour le mail
    function validEmail(inputEmail) {
        let emailErrorMessage = inputEmail.nextElementSibling;

        if (emailRegExp.test(inputEmail.value)) {
            emailErrorMessage.textContent = '';
            return true;
        } else {
            emailErrorMessage.textContent = 'Veuillez entrer un email valide.';
            return false;
        }
    };

    formLocation.firstName.addEventListener("change", function () {
        validInput(this);
    });

    formLocation.lastName.addEventListener("change", function () {
        validInput(this);
    });

    formLocation.address.addEventListener("change", function () {
        validInput(this);
    });

    formLocation.city.addEventListener("change", function () {
        validInput(this);
    });

    formLocation.email.addEventListener("change", function () {
        validEmail(this);
    });

    formLocation.order.addEventListener("click", (click) => {

        // On annule l'envoie du formulaire par défaut, on le vérifie avant
        click.preventDefault();

        // Tableau pour stocker uniquement les ID des produits
        let productID = [];
        for (let i = 0; i < ProductsInCart.length; i++) {
            productID.push(ProductsInCart[i].id);
        };

        // Objet pour stocker les informations du formulaire et ID produits
        let orderObject = {
            contact: {
                firstName: formLocation.firstName.value,
                lastName: formLocation.lastName.value,
                address: formLocation.address.value,
                city: formLocation.city.value,
                email: formLocation.email.value
            },
            products: productID
        };

        // Les options pour la méthode POST de fetch
        let fetchOptions = {
            method: 'POST',
            body: JSON.stringify(orderObject),
            headers: {
                "Content-Type": "application/json"
            }
        };

        // Condition pour vérifier si le panier n'est pas vide et que les inputs sont corrects. Si tout est bon, on envoie le formulaire
        if (orderObject.products.length == 0) {
            alert("Vous n'avez aucun produit dans le panier")
        } else if (validInput(formLocation.firstName) &&
            validInput(formLocation.lastName) &&
            validInput(formLocation.address) &&
            validInput(formLocation.city) &&
            validEmail(formLocation.email)
        ) {
            // On récupère les options et le tableau avec le contact et les ID
            fetch("http://localhost:3000/api/products/order", fetchOptions)
                .then((order) => {
                    console.log('Commande confirmé:\n')
                    console.table(orderObject);
                })
                .catch((error) => {
                    alert("Aucune information trouvé à partir de l'API");
                });
        } else {
            alert("Le formulaire n'est pas bon");
        }
    });
}

// On lance les fonctions
addProduct();
showTotalProduct();
toOrder();
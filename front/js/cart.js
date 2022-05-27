// On récupère le localStorage
let ProductsInCart = JSON.parse(localStorage.getItem("products"));

// On définit le total de la quantité et du prix à 0 par défaut et on additionne tout le panier
let totalProductsQuantity = 0;
let totalProductsPrice = 0;

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
    let productCartItems = document.querySelector("#cart__items");
    let deleteButtons = document.getElementsByClassName("deleteItem");
    let quantityInputs = document.getElementsByClassName("itemQuantity");

    // Création élément article
    let productArticle = document.createElement("article");
    productCartItems.appendChild(productArticle);
    productArticle.className = "cart__item";
    productArticle.setAttribute('data-id', productLocalStorage.id);
    productArticle.setAttribute('data-color', productLocalStorage.colors);

    // Création élément div
    let productDivImg = document.createElement("div");
    productArticle.appendChild(productDivImg);
    productDivImg.className = "cart__item__img";

    // Création élément image du produit
    let productImg = document.createElement("img");
    productDivImg.appendChild(productImg);
    productImg.src = productAPI.imageUrl;
    productImg.alt = productAPI.altTxt;

    // Création élément div
    let productContent = document.createElement("div");
    productArticle.appendChild(productContent);
    productContent.className = "cart__item__content";

    // Création élément div
    let productContentDesc = document.createElement("div");
    productContent.appendChild(productContentDesc);
    productContentDesc.className = "cart__item__content__description";

    // Création élément nom du produit
    let productName = document.createElement("h2");
    productContentDesc.appendChild(productName);
    productName.textContent = productAPI.name;

    // Création élément couleur du produit
    let productColor = document.createElement("p");
    productContentDesc.appendChild(productColor);
    productColor.textContent = productLocalStorage.colors;

    // Création élément prix du produit
    let productPrice = document.createElement("p");
    productContentDesc.appendChild(productPrice);
    productPrice.textContent = productAPI.price + ' €';

    // Création élément div
    let productContentSettings = document.createElement("div");
    productContent.appendChild(productContentSettings);
    productContentSettings.className = "cart__item__content__settings";

    // Création élément div
    let productContentQuantity = document.createElement("div");
    productContentSettings.appendChild(productContentQuantity);
    productContentQuantity.className = "cart__item__content__settings__quantity";

    // Création élément quantité du produit
    let productQuantity = document.createElement("p");
    productContentQuantity.appendChild(productQuantity);
    productQuantity.textContent = 'Qté : ';

    // Création élément input des couleurs
    let productQuantityInput = document.createElement("input");
    productContentQuantity.appendChild(productQuantityInput);
    productQuantityInput.value = productLocalStorage.quantity;
    productQuantityInput.className = "itemQuantity";
    productQuantityInput.setAttribute("type", "number");
    productQuantityInput.setAttribute("min", "1");
    productQuantityInput.setAttribute("max", "100");
    productQuantityInput.setAttribute("name", "itemQuantity");

    // Création élément div
    let productContentDelete = document.createElement("div");
    productContentSettings.appendChild(productContentDelete);
    productContentDelete.className = "cart__item__content__settings__delete";

    //Création élément bouton suppression
    let productDelete = document.createElement("p");
    productContentDelete.appendChild(productDelete);
    productDelete.className = "deleteItem";
    productDelete.textContent = 'Supprimer';

    // On appelle les fonctions lors du clic ou changement de l'input
    for (let button of deleteButtons) {
        button.addEventListener("click", removeProduct);
    }

    for (let input of quantityInputs) {
        input.addEventListener("change", editQuantityProduct);
    }

    // On se sert de la boucle pour additionner le total de quantité et prix des articles qu'on affiche
    totalProductsQuantity += productLocalStorage.quantity;
    totalProductsPrice += productLocalStorage.quantity * productAPI.price;

    let showTotalQuantity = document.querySelector("#totalQuantity");
    let showTotalPrice = document.querySelector("#totalPrice");

    showTotalQuantity.textContent = totalProductsQuantity;
    showTotalPrice.textContent = totalProductsPrice;
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
    let quantityProduct = click.target.closest(".itemQuantity");

    // On met la quantité à 1 par défaut si on essaye de mettre en dessous
    if (quantityProduct.value < 1) {
        quantityProduct.value = 1;
    } else {
        // On cherche un produit par son ID/couleur dans le localStorage et on récupère sa quantité pour la remplacer par celle présente dans l'input 
        let foundProduct = ProductsInCart.find(product => product.id == targetProduct.dataset.id && product.colors == targetProduct.dataset.color);
        let newQuantity = parseInt(quantityProduct.value);
        foundProduct.quantity = newQuantity;
        localStorage.setItem("products", JSON.stringify(ProductsInCart));
    }
}

// On récupère les données du formulaire et du localStorage pour les envoyer au back
function toOrder() {
    let formLocation = document.querySelector(".cart__order__form");

    // Les différents RegExp
    let emailRegExp = new RegExp("^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$");
    let textRegExp = new RegExp("^[a-zéèçàA-Z]{2,50}(-| )?([a-zéèçàA-Z]{2,50})?$");

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
                .then((response) => {
                    return response.json();
                })
                .then((order) => {
                    localStorage.clear();
                    document.location.href = `./confirmation.html?orderId=${order.orderId}`;
                })
                .catch((error) => {
                    alert("Aucune information trouvé à partir de l'API");
                });
        } else {
            alert("Le formulaire est incomplet ou incorrect");
        }
    });
}

// On lance les fonctions
addProduct();
toOrder();
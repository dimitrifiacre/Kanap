// On récupère les produits de l'API
function getProduct() {
    fetch("http://localhost:3000/api/products")
        .then(function (res) {
            return res.json();
        })
        .catch((error) => {
            let sectionItems = document.querySelector("#items");
            sectionItems.innerHTML = "Aucun produit n'a été trouvé";
        });
}

// On lance la fonction (provisoirement)
getProduct();
// On récupère le localStorage et on l'affiche
let ProductsInCart = JSON.parse(localStorage.getItem("products"));
console.log(ProductsInCart);
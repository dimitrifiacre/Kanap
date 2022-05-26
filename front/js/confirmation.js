// On cherche les paramètres de l'URL
let searchParams = new URLSearchParams(window.location.search);
let searchID = searchParams.get("orderId");

// On vérifie si l'URL a bien un orderId et si oui on affiche l'id de commande
function checkOrderId() {
    if (searchParams.has('orderId')) {
        // On affiche l'id de la commande sur la page
        let orderId = document.querySelector("#orderId");
        orderId.textContent = searchID;
    } else {
        document.location.href = './cart.html';
    }
}

// On lance la fonction
checkOrderId();
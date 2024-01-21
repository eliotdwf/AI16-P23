let formulaireCompte = document.getElementById("formulaire-compte");
function loadConnexionForm() {
    fetch("/test-form-connexion")
        .then(response => {
            response.text().then(content => {
                console.log(content);
                formulaireCompte.innerHTML = content;
                document.getElementById("btn-form-creer-compte").addEventListener("click", loadCreerCompteForm);
                initialiserFormConnexion();
            })
        })
        .catch((error => {
            console.log(error);
        }))
}

function loadCreerCompteForm() {
    fetch("/test-form-creer-compte")
        .then(response => {
            response.text().then(content => {
                console.log(content)
                formulaireCompte.innerHTML = content;
                document.getElementById("btn-form-connexion").addEventListener("click", loadConnexionForm);
                initialiserFormCreerCompte();
            })
        })
}
document.getElementById("btn-form-creer-compte").addEventListener("click", loadCreerCompteForm);
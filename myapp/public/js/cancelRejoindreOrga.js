let successMessageDiv = document.getElementById("success-message");
let infoMessageDiv = document.getElementById("info-message")
let success = localStorage.getItem("success");
if(success){
    //si on vient du formulaire pour rejoindre une orga, alors on affiche le message de succès
    successMessageDiv.style.removeProperty("display");
    infoMessageDiv.style.display = "none";
    localStorage.removeItem("success");
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // Défilement fluide
    });
}
else {
    //sinon on affiche le message comme quoi l'utilisateur a deja demandé à rejoindre une orga auparavant
    successMessageDiv.style.display = "none";
    infoMessageDiv.style.removeProperty("display");
}

document.getElementById("btn-annuler-demande").addEventListener("click", () => {
    fetch("/organisations/supprimer-demande-rejoindre-orga", {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'DELETE',
        body: JSON.stringify({
            siren : document.getElementById("siren").value,
        })
    })
        .then(result => {
            if(result.status === 200) {
                result.text().then(content => {
                    localStorage.setItem("alertMessages", content)
                    window.location.href = "/rejoindre-organisation";
                })
            }
            else {
                result.text().then(content => {
                    document.getElementById("alert-messages").innerHTML += content;
                })
            }
        })
})
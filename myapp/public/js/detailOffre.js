function supprimerOffre(idOffre, intituleOffre) {
    fetch("/offres/supprimer/" + idOffre, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ "intitule" : intituleOffre })
    })
        .then(response => {
            if(response.status === 200) {
                response.text().then(content => {
                    window.location.href = "/offres";
                    localStorage.setItem("alertMessages", content);
                })
            }
            else {
                response.text().then(content => {
                    updateAlertMessages(content);
                })
            }
        })
}

function updateAlertMessages(alertMessage){
    let alertMessages = document.getElementById("alertMessages");
    alertMessages.innerHTML += alertMessage;
}

let btnCandidats = document.getElementById("btn-candidats");
let btnOrganisation = document.getElementById("btn-organisation");
let divCandidatsOrganisation = document.getElementById("organisation-candidats");

function afficherCandidats(idOffre){
    fetch("/offres/candidatsList/" + idOffre)
        .then(response => {
            if(response.status === 200) {
                response.text().then(content => {
                    divCandidatsOrganisation.innerHTML = content;
                    btnCandidats.style.display = "none";
                    btnOrganisation.style.removeProperty("display");
                })
            }
        })
}

function afficherOrganisation(siren) {
    fetch("/organisations/description/" + siren)
        .then(response => {
            if(response.status === 200) {
                response.text().then(content => {
                    divCandidatsOrganisation.innerHTML = content;
                    btnCandidats.style.removeProperty("display");
                    btnOrganisation.style.display = "none";
                })
            }
        })
}
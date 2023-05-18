let alertMessages = document.getElementById("alertMessages");

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
                    updateAlertMessages(content);
                    updateOffresList();/*

                    let modal = document.getElementById('modalSuppressionOffre');
                    modal.modal("hide");*/
                })
            }
            else {
                response.text().then(content => {
                    updateAlertMessages(content);/*
                    let modal = document.getElementById('modalSuppressionOffre');
                    modal.classList.remove('show');
                    modal.setAttribute('aria-hidden', 'true');
                    modal.style.display = 'none';*/
                })
            }
        })
}

function updateOffresList() {
    console.log("maj des offres en cours");
    let tri = document.getElementById("select-tri-offres").value;
    let offresList = document.getElementById("liste-offres");
    //let etatOffre = document.getElementById("filtre-etat-offre");
    let etatOffre = 0;
    let body = {
        "tri": tri,
        "etatOffre": etatOffre
    }
    fetch("/offres/offresList", {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(body)
    })
        .then(response => {
            if(response.status != 200) {
                window.href.location = "/404"
            }
            else {
                response.text().then(content => {
                    console.log(content)
                    offresList.innerHTML = content;
                    console.log("maj des offres terminée");
                })
            }
        })
}

function updateAlertMessages(alertMessage){
    let alertMessages = document.getElementById("alertMessages");
    alertMessages.innerHTML += alertMessage;
}

document.getElementById("select-tri-offres").addEventListener("change", updateOffresList);
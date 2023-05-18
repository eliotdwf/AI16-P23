let alertMessages = document.getElementById("alertMessages");

/*function supprimerOffre(idOffre) {
    fetch("/offres/supprimer/" + idOffre)
        .then(response => {
            if(response.status === 200) {
                response.text().then(content => {
                    updateAlertMessages(content);
                    updateOffresList();
                })
            }
            else {
                response.text().then(content => {
                    updateAlertMessages(content);
                })
            }
        })
}*/

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

document.getElementById("select-tri-offres").addEventListener("change", updateOffresList);
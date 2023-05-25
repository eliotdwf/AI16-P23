let alertMessages = document.getElementById("alertMessages");

let alertMessagesContent = localStorage.getItem("alertMessages");
if(alertMessagesContent){
    updateAlertMessages(alertMessagesContent);
    localStorage.removeItem("alertMessages");
}


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
                    updateOffresList();
                })
            }
            else {
                response.text().then(content => {
                    updateAlertMessages(content);
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

/*function candidater(offreId, email) {
    let body = {
        "user": email,
        "candidature": offreId,
    }
    fetch("/candidatures/candidater", {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(body)
    })
    .then(response => {
        //console.log(response)
    })
    .catch(error => {
        console.log(error)
    })
}*/

function updateAlertMessages(alertMessage){
    let alertMessages = document.getElementById("alertMessages");
    alertMessages.innerHTML += alertMessage;
}

document.getElementById("select-tri-offres").addEventListener("change", updateOffresList);
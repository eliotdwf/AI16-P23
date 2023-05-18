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
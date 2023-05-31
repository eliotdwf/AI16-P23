let orgasList = document.getElementById("orgasTable");
document.getElementById("filtre-type-orga").value = "0";

function creerOrga(siren, emailCreateur) {
    fetch("/organisations/valider-creation", {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            siren : siren,
            emailCreateur: emailCreateur
        })
    })
        .then(response => {
            if(response.status === 200) {
                response.text().then(content => {
                    updateAlertMessages(content);
                    updateOrgasList();
                })
            }
        })
}

function supprimerOrga(siren, emailCreateur) {
    fetch("/organisations/refuser-creation", {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            siren : siren,
            emailCreateur: emailCreateur
        })
    })
        .then(response => {
            if(response.status === 200) {
                response.text().then(content => {
                    updateAlertMessages(content);
                    updateOrgasList();
                })
            }
        })
}

function updateAlertMessages(alertMessage){
    let alertMessages = document.getElementById("alertMessages");
    alertMessages.innerHTML += alertMessage;
}

function updateOrgasList() {
    let typeOrga = document.getElementById("filtre-type-orga").value;
    fetch("/organisations/orgasList", {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ typeOrga: typeOrga })
    })
        .then(response => {
            if(response.status != 200) {
                window.href.location = "/404"
            }
            else {
                response.text().then(content => {
                    orgasList.innerHTML = content;
                })
            }
        })
}

document.getElementById("filtre-type-orga").addEventListener("change", updateOrgasList);
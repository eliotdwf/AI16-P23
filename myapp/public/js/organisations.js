let orgasList = document.getElementById("orgasTable");

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

function updateAlertMessages(alertMessage){
    let alertMessages = document.getElementById("alertMessages");
    alertMessages.innerHTML += alertMessage;
}

function updateOrgasList() {
    console.log("maj des organisations en cours");
    let typeOrga = document.getElementById("filtre-type-orga").value;
    console.log("typeOrga :" + typeOrga)
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
                    console.log("content : " + content)
                    orgasList.innerHTML = content;
                })
            }
        })
}

document.getElementById("filtre-type-orga").addEventListener("change", updateOrgasList);
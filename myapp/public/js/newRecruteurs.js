function accepterDemande(email, siren) {
    fetch("/organisations/valider-nouveau-recruteur", {
        headers: { 'Content-Type': 'application/json' },
        method: "PUT",
        body: JSON.stringify({
            email: email,
            siren: siren
        })
    })
        .then(response => {
            if(response.status === 200) {
                updateUsersList(siren);
            }
            response.text().then(content => {
                document.getElementById("alertMessages").innerHTML += content;
            })
        })
}

function refuserDemande(email, siren) {
    fetch("/organisations/refuser-nouveau-recruteur", {
        headers: { 'Content-Type': 'application/json' },
        method: "PUT",
        body: JSON.stringify({
            email: email,
            siren: siren
        })
    })
        .then(response => {
            if(response.status === 200) {
                updateUsersList(siren);
            }
            response.text().then(content => {
                document.getElementById("alertMessages").innerHTML += content;
            })
        })
}

function updateUsersList(siren) {
    let usersTable = document.getElementById("usersTable");
    fetch("/organisations/futurs-recruteurs-list/" + siren)
        .then(response => {
            if(response.status === 200) {
                response.text().then(content => {
                    usersTable.innerHTML = content;
                })
            }
        })
}
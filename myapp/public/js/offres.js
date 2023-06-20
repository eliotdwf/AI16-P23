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

function supprimerCandidature(idOffre, redirect = true) {
    fetch("/candidatures/supprimer/" + idOffre, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'DELETE'
    })
    .then(response => {
        console.log(response)
        if(redirect) window.location.href = `/offres/${idOffre}`;
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

function downloadPiece(email, idOffre) {
    let list;
    fetch("/candidatures/get-pieces/"+email+"/"+idOffre)
        .then(response => response.json())
        .then(data => {
            for(let piece of data.pieces) {
                fetch("/candidatures/download/"+piece)
                    .then(response => {

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


function afficherPieces(idOffre, dejaCandidat){
    if(!dejaCandidat) {
        let details = document.getElementById("organisation-candidats");
        let bouton = document.getElementById("bouton-candidater-candidat");
        let pieces = document.getElementById("pieces-offre");
        if(details.style.display === "none") {
            details.style.display = "block";
            bouton.innerHTML = "Candidater";
            pieces.style.display = "none";
        }
        else {
            details.style.display = "none";
            bouton.innerHTML = "Offre";
            pieces.style.display = "block";
        }
    }
}

const optionToast = {
    animation: true,
    autohide: true,
    delay: 500
}

function candidater(id) {
    let resCode = 0;
    let listPieceInput = document.getElementsByClassName("piece-input");
    fetch(`/candidatures/candidater/${id}`,  {
        headers: {
            'enctype': 'multipart/form-data'
        },
        method: 'POST',
    })
    .then(response=>response.json())
    .then(candidature_id => {
        if(candidature_id.status === 500) {
            alert("Votre candidature n'a pas pu être créée");
        } else {
            resCode = 200;
            for (let el of listPieceInput) {
                if (el.files[0] == null) continue
                let form = new FormData();
                form.append("id", candidature_id.value);
                form.append( "description", el.id.trim())
                form.append("piece", el.files[0])

                fetch("/offres/pieceDossier/", {
                    headers: {
                        'enctype': 'multipart/form-data'
                    },
                    method: 'POST',
                    body: form
                })
                .then(response => {
                    if (response.status === 200) {
                        resCode = response.status;
                    } else {
                        alert("Votre candidature n'a pas pu être créée")
                    }
                })
                .catch(err => {
                    console.log(err);
                })
            }
        }
    }).then(() => {
        console.log(resCode)
            if (resCode === 200) {
                /*alert("Votre candidature a bien été enregistrée");
                let input = document.getElementsByClassName("piece-input");
                for(let el of input) {
                    el.value = "";
                }*/
                window.location.href = `/offres/${id}`;
            } else {
                alert("Votre candidature n'a pas pu être créée")
            }
        }
    )
    .catch(errorMessage => console.log(errorMessage));


}


// /*
// let alertMessages = document.getElementById("alertMessages");
//
// let alertMessagesContent = localStorage.getItem("alertMessages");
// if(alertMessagesContent){
//     updateAlertMessages(alertMessagesContent);
//     localStorage.removeItem("alertMessages");
// }
//
//
// function supprimerOffre(idOffre, intituleOffre) {
//     fetch("/offres/supprimer/" + idOffre, {
//         headers: {
//             'Accept': 'application/json',
//             'Content-Type': 'application/json'
//         },
//         method: 'POST',
//         body: JSON.stringify({ "intitule" : intituleOffre })
//     })
//         .then(response => {
//             if(response.status === 200) {
//                 response.text().then(content => {
//                     updateAlertMessages(content);
//                     updateOffresList();
//                 })
//             }
//             else {
//                 response.text().then(content => {
//                     updateAlertMessages(content);
//                 })
//             }
//         })
// }
//
function updateOffresList() {
    let tm = document.getElementById("select-type-metier").value
    let tc = document.getElementById("select-type-contrat").value
    let sal1 = document.getElementById("select-salaire-1").value
    let sal2 = document.getElementById("select-salaire-2").value
    let tri = document.getElementById("select-tri-offres").value;
    let offresList = document.getElementById("liste-offres");
    let etatOffre = 0;
    let body = {
        "tri": tri,
        "tm": tm,
        "tc": tc,
        "sal1": sal1,
        "sal2": sal2,
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
            if(response.status !== 200) {
                window.location.href = "/404"
            }
            else {
                response.text().then(content => {
                    offresList.innerHTML = content;
                })
            }
        })
}

function openCandidaturePiece(id) {
    window.location.href = "/offres/"+id;
}
//
document.getElementById("select-tri-offres").addEventListener("change", updateOffresList);

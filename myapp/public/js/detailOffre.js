// let alertMessagesContent = localStorage.getItem("alertMessages");
// if(alertMessagesContent){
//     updateAlertMessages(alertMessagesContent);
//     localStorage.removeItem("alertMessages");
// }
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
//                     window.location.href = "/offres";
//                     localStorage.setItem("alertMessages", content);
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
// function updateAlertMessages(alertMessage){
//     let alertMessages = document.getElementById("alertMessages");
//     alertMessages.innerHTML += alertMessage;
// }
//
// let btnCandidats = document.getElementById("btn-candidats");
// let btnOrganisation = document.getElementById("btn-organisation");
// let divCandidatsOrganisation = document.getElementById("organisation-candidats");
//
// function afficherCandidats(idOffre){
//     fetch("/offres/candidatsList/" + idOffre)
//         .then(response => {
//             if(response.status === 200) {
//                 response.text().then(content => {
//                     divCandidatsOrganisation.innerHTML = content;
//                     btnCandidats.style.display = "none";
//                     btnOrganisation.style.removeProperty("display");
//                 })
//             }
//         })
// }
//
// function afficherOrganisation(siren) {
//     fetch("/organisations/description/" + siren)
//         .then(response => {
//             if(response.status === 200) {
//                 response.text().then(content => {
//                     divCandidatsOrganisation.innerHTML = content;
//                     btnCandidats.style.removeProperty("display");
//                     btnOrganisation.style.display = "none";
//                 })
//             }
//         })
// }
//
//
// function afficherPieces(idOffre){
//     let details = document.getElementById("organisation-candidats");
//     let bouton = document.getElementById("bouton-candidater-candidat");
//     let pieces = document.getElementById("pieces-offre");
//     if(details.style.display === "none") {
//         details.style.display = "block";
//         bouton.innerHTML = "Candidater";
//         pieces.style.display = "none";
//     }
//     else {
//         details.style.display = "none";
//         bouton.innerHTML = "Offre";
//         pieces.style.display = "block";
//     }
// }
//
// const optionToast = {
//     animation: true,
//     autohide: true,
//     delay: 500
// }
//
// function candidater(id) {
//     let listPieceInput = document.getElementsByClassName("piece-input");
//     fetch(`/offres/candidater/${id}`,  {
//         headers: {
//             'enctype': 'multipart/form-data'
//         },
//         method: 'POST',
//     })
//         .then(response => {
//             console.log(response);
//         })
//         .catch(errorMessage => console.log(errorMessage));
//
//
//     for(let el of listPieceInput){
//         if(el.files[0] == null) continue
//         let form = new FormData();
//         form.append("id", id);
//         form.append("description", el.id.trim())
//         form.append("piece", el.files[0])
//
//         fetch("/offres/pieceDossier/", {
//             headers: {
//                 'enctype': 'multipart/form-data'
//             },
//             method: 'POST',
//             body: form
//         })
//             .then(response => {
//                 if(response.status === 200) {
//                     console.log("OK");
//                 } else {
//                     document.getElementById('alert-error-candidature').alert();
//                 }
//             })
//             .catch(err => {
//                 console.log(err);
//             })
//     }
// }
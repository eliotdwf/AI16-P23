const ERROR_REQUIRED_FIELDS_EMPTY = "Attention, tous les champs doivent être complétés !";
const ERROR_DATE_TODAY = "Attention, la date choisie ne doit pas être inférieure ou égale à la date du jour !"
const ERROR_UPDATE = "Une erreure est survenue lors de la mise à jour des informations. Veuillez réessayer."

let etatOffreIcone = document.getElementById("icon-etat-offre");
let etatOffreField = document.getElementById("etat-offre");
let intituleField = document.getElementById("intitule-offre");
let descriptionOffreField = document.getElementById("description-offre");
let rythmeField = document.getElementById("rythme");
let salaireField = document.getElementById("salaire");
let lieuMissionField = document.getElementById("lieu-mission");
let piecesCandidaturesField = document.getElementById("pieces-candidatures")
let typeMetierField = document.getElementById("type-metier");
let typeContratField = document.getElementById("type-contrat");
let dateValiditeField = document.getElementById("date-validite");

let fields = [intituleField, etatOffreField, descriptionOffreField, rythmeField, salaireField, lieuMissionField, piecesCandidaturesField,
typeMetierField, typeContratField, dateValiditeField];

let errorMessage = document.getElementById("errorMessage")

// Ajustez la hauteur du textarea en fonction de son contenu
descriptionOffreField.style.height = descriptionOffreField.scrollHeight + 'px';

//initialiser la date du champ input date-validite
const date = new Date();
const year = date.getFullYear();
const month = String(date.getMonth() + 1).padStart(2, '0');
const day = String(date.getDate()).padStart(2, '0');
const today = `${year}-${month}-${day}`;

dateValiditeField.setAttribute('min', today);

function updateIconeEtatOffre() {
    let svg;
    switch (etatOffreField.value) {
        case "1":
            svg = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-file-earmark-diff" viewBox="0 0 16 16">
                        <path d="M8 5a.5.5 0 0 1 .5.5V7H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V8H6a.5.5 0 0 1 0-1h1.5V5.5A.5.5 0 0 1 8 5zm-2.5 6.5A.5.5 0 0 1 6 11h4a.5.5 0 0 1 0 1H6a.5.5 0 0 1-.5-.5z"/>
                        <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"/>
                    </svg>`;
            break;
        case "2":
            svg = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-file-earmark-check" viewBox="0 0 16 16">
                        <path d="M10.854 7.854a.5.5 0 0 0-.708-.708L7.5 9.793 6.354 8.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3z"/>
                        <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"/>
                    </svg>`;
            break;
        case "3":
            svg = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-file-earmark-excel" viewBox="0 0 16 16">
                        <path d="M5.884 6.68a.5.5 0 1 0-.768.64L7.349 10l-2.233 2.68a.5.5 0 0 0 .768.64L8 10.781l2.116 2.54a.5.5 0 0 0 .768-.641L8.651 10l2.233-2.68a.5.5 0 0 0-.768-.64L8 9.219l-2.116-2.54z"/>
                        <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"/>
                    </svg>`;
            break;
    }
    etatOffreIcone.innerHTML = svg;
}

function champsValides() {
    let valide = true;
    fields.forEach(field => {
        if(field.value === ""){
            field.classList.add("is-invalid");
            valide = false;
        }
        else {
            field.classList.remove('is-invalid');
        }
    })
    if(!valide) {
        errorMessage.innerText = ERROR_REQUIRED_FIELDS_EMPTY;
        errorMessage.style.removeProperty("display");
    }
    else {
        errorMessage.style.display = "none";
    }
    return valide;
}

function dateValiditeCorrecte() {
    let valide = true;
    let dateChoisie = dateValiditeField.value
    if(new Date(dateChoisie) <= new Date(today)) {
        valide = false;
        dateValiditeField.classList.add("is-invalid");
        errorMessage.innerText = ERROR_DATE_TODAY;
        errorMessage.style.removeProperty("display");
    }
    else {
        dateValiditeField.classList.remove("is-invalid");
        errorMessage.style.display = "none";
    }
    return valide;
}

function updateOffre(idOffre) {
    errorMessage.style.display = "none";
    if(champsValides() && dateValiditeCorrecte()) {
        const body = {
            intitule: intituleField.value,
            description: descriptionOffreField.value,
            lieuMission: lieuMissionField.value,
            rythme: rythmeField.value,
            salaire: salaireField.value,
            idEtatOffre: etatOffreField.value,
            dateValidite: dateValiditeField.value,
            piecesCandidatures: piecesCandidaturesField.value,
            idTypeMetier: typeMetierField.value,
            idTypeContrat: typeContratField.value,
        }
        fetch("/offres/update/" + idOffre, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(body)
        })
            .then(response => {
                if(response.status === 200) {
                    response.text().then(content => {
                        localStorage.setItem("alertMessages", content)
                        window.location.href = "/offres/" + idOffre;
                    })
                }
                else {
                    errorMessage.innerText = ERROR_UPDATE;
                    errorMessage.style.removeProperty("display");
                }
            })
    }
}

fields.forEach(field => {
    field.addEventListener("change", () => {
        if(field.value === ""){
            field.classList.add("is-invalid");
            errorMessage.innerText = ERROR_REQUIRED_FIELDS_EMPTY;
            errorMessage.style.removeProperty("display");
        }
        else{
            field.classList.remove("is-invalid");
            champsValides();
        }
    })
})

dateValiditeField.addEventListener("change", dateValiditeCorrecte)
etatOffreField.addEventListener("change", updateIconeEtatOffre)

const ERROR_REQUIRED_FIELDS_EMPTY = "Attention, tous les champs doivent être complétés !";
const ERROR_DATE_TODAY = "Attention, la date choisie ne doit pas être inférieure ou égale à la date du jour !"
const ERROR_UPDATE = "Une erreure est survenue lors de la création de l'offre. Veuillez réessayer."

let intituleField = document.getElementById("intitule");
let descriptionOffreField = document.getElementById("description");
let rythmeField = document.getElementById("rythme");
let salaireField = document.getElementById("salaire");
let lieuMissionField = document.getElementById("lieu-mission");
let piecesCandidaturesField = document.getElementById("pieces-candidature")
let typeMetierField = document.getElementById("type-metier");
let typeContratField = document.getElementById("type-contrat");
let dateValiditeField = document.getElementById("date-validite");

let fields = [intituleField, descriptionOffreField, rythmeField, salaireField, lieuMissionField, piecesCandidaturesField,
    typeMetierField, typeContratField, dateValiditeField];

let errorMessage = document.getElementById("errorMessage");

//initialiser les selects
typeMetierField.value = "";
typeContratField.value = "";

//initialiser la date du champ input date-validite
const date = new Date();
const year = date.getFullYear();
const month = String(date.getMonth() + 1).padStart(2, '0');
const day = String(date.getDate()).padStart(2, '0');
const today = `${year}-${month}-${day}`;

dateValiditeField.setAttribute('min', today);

function anyFieldEmpty() {
    fields.forEach(field => {
        if(field.value == "") return true;
    })
    errorMessage.style.display = "none";
    return false;
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

function creerOffre(etatOffre) {
    errorMessage.style.display = "none";
    if (champsValides() && dateValiditeCorrecte()) {
        const body = {
            intitule: intituleField.value,
            description: descriptionOffreField.value,
            lieuMission: lieuMissionField.value,
            rythme: rythmeField.value,
            salaire: salaireField.value,
            idEtatOffre: etatOffre,
            dateValidite: dateValiditeField.value,
            piecesCandidatures: piecesCandidaturesField.value,
            idTypeMetier: typeMetierField.value,
            idTypeContrat: typeContratField.value,
        }
        fetch("/offres/create/", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(body)
        })
            .then(response => {
                if (response.status === 200) {
                    response.text().then(content => {
                        console.log(content)
                        localStorage.setItem("alertMessages", content)
                        window.location.href = "/offres";
                    })
                } else {
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
            anyFieldEmpty();
        }
    })
})

document.getElementById("btn-creer-publier").addEventListener("click", () => creerOffre(2));
document.getElementById("btn-creer-brouillon").addEventListener("click", () => creerOffre(1));

dateValiditeField.addEventListener("change", dateValiditeCorrecte);

document.querySelectorAll('[data-bs-toggle="popover"]')
    .forEach(popover => {
        new bootstrap.Popover(popover)
    })
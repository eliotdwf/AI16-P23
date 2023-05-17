const ERROR_REQUIRED_FIELDS_EMPTY = "Attention, tous les champs requis doivent être complétés !";
const ERROR_INVALID_SIREN = "Attention, le siren ne doit être composé que de caractères numériques !";
const ERROR_ALREADY_USED_SIREN = "Erreur, ce siren est déjà utilisé !"

let errorMessage = document.getElementById("errorMessage");


document.getElementById("create-orga-form").addEventListener("submit", function(event) {
    event.preventDefault();
    errorMessage.style.display = "none";
    if(!isAnyRequiredFieldEmpty() && isValidSiren()){
        let formData = new FormData();
        formData.append('siren', document.getElementById("siren").value);
        formData.append('nom', document.getElementById("nom").value);
        formData.append('type', document.getElementById("type").value);
        formData.append('siege', document.getElementById("siege").value);
        formData.append('logo', document.getElementById("logo").files[0]);
        formData.append('description', document.getElementById("description").value);
        fetch("/organisations/create", {
            method: 'POST',
            body: formData
        })
            .then((response) => {
                console.log("Dans le then du fetch");
                if(response.status === 201){
                    window.location.href = "/";
                }
                else if(response.status === 403) {
                    errorMessage.innerText = ERROR_ALREADY_USED_SIREN;
                    errorMessage.style.removeProperty("display");
                }
                else {
                    errorMessage.innerText = "Une erreur inconnue est survenue. Contactez les administrateurs.";
                    errorMessage.style.removeProperty("display");
                }
            });
    }
});

function isAnyRequiredFieldEmpty() {
    let invalidFields = false;
    let fields = document.getElementById("create-orga-form").querySelectorAll('input, select, textarea');
    fields.forEach((field) => {
        if(field.id != "logo"){
            if(field.id != "type") {
                if(field.value === ""){
                    invalidFields = true;
                    field.classList.add("is-invalid");
                }
                else{
                    field.classList.remove("is-invalid");
                }
            }
            else{
                if(field.value != "1" && field.value != "2"){
                    invalidFields = true;
                    field.classList.add("is-invalid");
                }
                else{
                    field.classList.remove("is-invalid");
                }
            }

        }

    })
    if(invalidFields){
        errorMessage.innerText = ERROR_REQUIRED_FIELDS_EMPTY;
        errorMessage.style.removeProperty("display")
    }
    else {
        errorMessage.style.display = "none";
    }
    return invalidFields;
}

function isValidSiren() {
    console.log("dans la vérification du siren")
    let sirenField = document.getElementById("siren");
    if(isNaN(sirenField.value)) {
        console.log("Siren n'est pas numérique")
        sirenField.classList.add("is-invalid");
        errorMessage.innerText = ERROR_INVALID_SIREN;
        errorMessage.style.removeProperty("display");
        return false;
    }
    else {
        sirenField.classList.remove("is-invalid");
        errorMessage.style.display = "none";
        return true;
    }
}

document.getElementById("create-orga-form").querySelectorAll('input, select, textarea').forEach((field) => {
    if(field.id != "logo"){
        field.addEventListener("change", () => {
            if(field.id === "type") {
                if(field.value != "1" && field.value != "2"){
                    field.classList.add("is-invalid");
                    errorMessage.innerText = ERROR_REQUIRED_FIELDS_EMPTY;
                    errorMessage.style.removeProperty("display");
                }
                else{
                    field.classList.remove("is-invalid");
                }
            }
            else {
                if(field.value === ""){
                    field.classList.add("is-invalid");
                    errorMessage.innerText = ERROR_REQUIRED_FIELDS_EMPTY;
                    errorMessage.style.removeProperty("display");
                }
                else{
                    field.classList.remove("is-invalid");
                }
            }
        })
    }
})


document.querySelectorAll('[data-bs-toggle="popover"]')
    .forEach(popover => {
        new bootstrap.Popover(popover)
    })
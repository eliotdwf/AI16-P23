const ERROR_REQUIRED_FIELDS = "Attention, tous les champs sont obligatoires !";
const ERROR_INVALID_PASSWORD_CONFIRMATION = "Attention, les mots de passes doivent être identiques !";
const ERROR_INVALID_PASSWORD = "Attention, le mot de passe doit faire au moins 8 caractères !";
const ERROR_ALREADY_USED_EMAIL = "Erreur, cette adresse email est déjà utilisée !";

let errorMessage = document.getElementById("errorMessage");


document.getElementById("create-account-form").addEventListener("submit", function(event) {
    event.preventDefault();
    console.log("dans le submit - avant la vérififcation)");
    errorMessage.style.display = "none";
    if(!isAnyFieldEmpty() && areValidContactFields() && isValidPassword() && isValidConfirmedPassword()){
        let body = {
            email: document.getElementById("email").value,
            pwd: document.getElementById("password").value,
            lastname: document.getElementById("lastname").value,
            firstname: document.getElementById("firstname").value,
            phone: document.getElementById("phone").value
        };
        console.log("dans le submit)");
        fetch("/users/create", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(body)
        })
            .then((response) => {
                console.log("Dans le then du fetch");
                if(response.status === 403){
                    document.getElementById("email").classList.add("is-invalid");
                    errorMessage.innerText = ERROR_ALREADY_USED_EMAIL;
                    errorMessage.style.removeProperty("display");
                }
                else if(response.status === 200) {
                    window.location.href = "/";
                }
                else {
                    errorMessage.style.removeProperty("display");
                    errorMessage.innerText = "Une erreur inconnue est survenue. Contactez les administrateurs.";
                }
            });
    }
});

function areValidContactFields() {
    //TODO : valider l'adresse email avec un regexp
    //TODO : valider le num de téléphone avec une regexp
    return true;
}

function isValidConfirmedPassword(){
    errorMessage.style.display = "none";

    let passwordField = document.getElementById("password");
    let confirmedPasswordField = document.getElementById("confirmedPassword");
    if(passwordField.value === confirmedPasswordField.value){
        return true;
    }
    else {
        passwordField.classList.add("is-invalid");
        confirmedPasswordField.classList.add("is-invalid");
        errorMessage.innerText = ERROR_INVALID_PASSWORD_CONFIRMATION;
        errorMessage.style.removeProperty("display");
        return false;
    }
}

function isValidPassword(){
    let pwdField = document.getElementById("password")
    errorMessage.style.display = "none";
    if(pwdField.value.length >= 8) {
        return true;
    }
    else {
        pwdField.classList.add("is-invalid");
        document.getElementById("confirmedPassword").classList.add("is-invalid");
        errorMessage.innerText = ERROR_INVALID_PASSWORD;
        errorMessage.style.removeProperty("display");
        return false;
    }
}

function isAnyFieldEmpty() {
    let invalidForm = false;
    let fields = document.getElementById("create-account-form").querySelectorAll('input, select');
    fields.forEach((field) => {
        if(field.value === ""){
            invalidForm = true;
            field.classList.add("is-invalid");
        }
        else{
            if(field.classList.contains("is-invalid")){
                field.classList.remove("is-invalid");
            }
        }
    })
    if(invalidForm){
        document.getElementById("errorMessage").innerText = ERROR_REQUIRED_FIELDS;
        document.getElementById("errorMessage").style.removeProperty("display")
    }
    else {
        document.getElementById("errorMessage").style.display = "none";
    }
    return invalidForm;
}


document.getElementById("create-account-form").querySelectorAll('input, select').forEach((field) => {
    field.addEventListener("change", () => {
        if(field.value === ""){
            field.classList.add("is-invalid");
            errorMessage.innerText = ERROR_REQUIRED_FIELDS;
            errorMessage.style.removeProperty("display");
        }
        else{
            field.classList.remove("is-invalid");
        }
    });
});


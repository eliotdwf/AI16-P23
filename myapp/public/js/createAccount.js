const ERROR_REQUIRED_FIELDS = "Attention, tous les champs sont obligatoires !";
const ERROR_INVALID_PASSWORD_CONFIRMATION = "Attention, les mots de passes doivent être identiques !";
const ERROR_INVALID_PASSWORD = "Attention, le mot de passe doit faire au moins 8 caractères !";

document.getElementById("create-account-form").addEventListener("submit", function(event) {
    event.preventDefault();
    let email = document.getElementById("email").value;
    let pwd = document.getElementById("password").value;
    if(!isAnyFieldEmpty() && isValidPassword(pwd) && isValidConfirmedPassword()){
        //TODO : requette ajax pour créer un compte
        window.location.href = "/connexion";
    }
});

function isValidConfirmedPassword(){
    let errorMessage = document.getElementById("errorMessage");
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

function isValidPassword(pwd){
    let errorMessage = document.getElementById("errorMessage");
    errorMessage.style.display = "none";
    if(pwd.length >= 8) {
        return true;
    }
    else {
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
    field.addEventListener("change", isAnyFieldEmpty);
});


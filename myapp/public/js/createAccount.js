document.getElementById("create-account-form").addEventListener("submit", function(event) {
    event.preventDefault();
    let email = document.getElementById("email").value;
    let pwd = document.getElementById("password").value;
    let confirmedPassword = document.getElementById("confirmedPassword").value;
    if(!isAnyFieldEmpty() && isValidConfirmedPassword()){
        window.location.href = "/connexion";
    }
});

function isValidConfirmedPassword(){
    let errorInvalidPassword = document.getElementById("invalidPassword");
    errorInvalidPassword.style.display = "none";

    let passwordField = document.getElementById("password");
    let confirmedPasswordField = document.getElementById("confirmedPassword");
    if(passwordField.value === confirmedPasswordField.value){
        return true;
    }
    else {
        passwordField.classList.add("is-invalid");
        confirmedPasswordField.classList.add("is-invalid");
        errorInvalidPassword.style.removeProperty("display");
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
    return invalidForm;
}
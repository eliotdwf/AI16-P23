document.getElementById("connexion-form").addEventListener("submit", function(event){
    console.log("Dans la fonction !")
    event.preventDefault();
    let email = document.getElementById("email").value;
    let pwd = document.getElementById("password").value;
    if(email === ""){
        document.getElementById("email").classList.add("is-invalid");
    }
    else{
        document.getElementById("email").classList.remove("is-invalid");
    }
    if(pwd === ""){
        document.getElementById("password").classList.add("is-invalid");
    }
    else{
        document.getElementById("password").classList.remove("is-invalid");
    }
    if(email != "" && pwd != "") {
        let body = {
            email: email,
            pwd: pwd
        };
        let errorMessage = document.getElementById("loginError");
        errorMessage.style.display = "none";
        fetch("/users/authentication", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(body)
        })
            .then((response) => {
                if(response.status === 401){
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

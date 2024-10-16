/*
On initialise le formulaire de maj des infos du compte
 */
function initialiserFormMajInfosCompte() {
    let majPwd = false;
    document.getElementById("btn-maj-infos-compte").addEventListener("click", event => {
        event.preventDefault();

        let pwd = document.getElementById("pwd").value;
        let nom = document.getElementById("nom").value;
        let prenom = document.getElementById("prenom").value;
        if(majPwd) {
            if(isPwdValide() && arePwdsIdentiques()) {
                fetchMajInfosCompte(pwd, nom, prenom);
            }
        }
        else {
            fetchMajInfosCompte("", nom, prenom);
        }
    })

    document.getElementById("pwd").addEventListener("change", isPwdValide);
    document.getElementById("pwd2").addEventListener("change", arePwdsIdentiques);

    let pwdInput = document.getElementById("pwd");
    let btnMajPwd = document.getElementById("btn-maj-pwd");
    btnMajPwd.addEventListener("click", () => {
        if(majPwd) {
            majPwd = false;
            document.getElementById("errorMessage").style.display = "none";
            pwdInput.classList.remove("is-invalid");
            document.getElementById("pwd2").classList.remove("is-invalid");
            document.getElementById("text-btn-maj-pwd").innerText = "Modifier le mot de passe";
        }
        else {
            majPwd = true;
            document.getElementById("text-btn-maj-pwd").innerText = "Conserver mon ancien mot de passe";
        }
    })
}

function fetchMajInfosCompte(pwd, nom, prenom) {
    let body = {
        nom : nom,
        prenom : prenom,
        password: pwd
    }
    fetch("/maj-infos-compte", {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'PUT',
        body: JSON.stringify(body)
    })
        .then(response => {
            if(response.status === 204) {
                loadInfosCompte();
            }
            else {
                console.log("Une erreur est survenue : code " + response.status)
            }
        })
        .catch(error => {
            console.error("Une erreur est survenue !\n" + error);
        })
}
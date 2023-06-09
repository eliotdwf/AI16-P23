let orgaField = document.getElementById("select-orga");
let typeOrgaField = document.getElementById("type-orga-select");
let btnRejoindre = document.getElementById("btn-rejoindre");
let optGrpAssos = document.getElementById("opt-grp-assos");
let optGrpEntreprises = document.getElementById("opt-grp-entreprises");

let alertMessagesContent = localStorage.getItem("alertMessages");
if(alertMessagesContent){
    // on vient de la page cancelRejoindreOrga
    document.getElementById("alert-messages").innerHTML = alertMessagesContent;
    localStorage.removeItem("alertMessages");
}

//initialisation de la page
orgaField.value = ""; //on initialise le select des orgas a l'option "choisir"
typeOrgaField.value = "0";
btnRejoindre.disabled = true;

orgaField.addEventListener("change", () => {
    btnRejoindre.disabled = (!orgaField.value);
})

typeOrgaField.addEventListener("change", () => {
    fetch("/organisations/api-orgas-crees", {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ typeOrga: typeOrgaField.value })
    })
        .then(response => {
            if(response.status === 200) {
                response.text().then(jsonData => {
                    let orgas = JSON.parse(jsonData);
                    optGrpAssos.innerHTML = "";
                    optGrpEntreprises.innerHTML = "";
                    typeOrga = typeOrgaField.value;
                    switch (typeOrga) {
                        case "1":
                            optGrpAssos.style.display = "none";
                            optGrpEntreprises.style.removeProperty("display");
                            orgas.forEach(orga => {
                                let content = `<option value="${orga.siren}"> ${orga.siren} | ${orga.nom} </option>`;
                                if(orga.id_type_organisation === 1){
                                    optGrpEntreprises.innerHTML += content;
                                }
                            });
                            break;
                        case "2":
                            optGrpAssos.style.removeProperty("display");
                            optGrpEntreprises.style.display = "none";
                            orgas.forEach(orga => {
                                let content = `<option value="${orga.siren}"> ${orga.siren} | ${orga.nom} </option>`;
                                if(orga.id_type_organisation === 2){
                                    optGrpAssos.innerHTML += content;
                                }
                            });
                            break;
                        default:
                            optGrpAssos.style.removeProperty("display");
                            optGrpEntreprises.style.removeProperty("display");
                            orgas.forEach(orga => {
                                let content = `<option value="${orga.siren}"> ${orga.siren} | ${orga.nom} </option>`;
                                if(orga.id_type_organisation === 1) {
                                    optGrpEntreprises.innerHTML += content;
                                }
                                if(orga.id_type_organisation === 2) {
                                    optGrpAssos.innerHTML += content;
                                }
                            });
                            break;
                    }
                    orgaField.value = "";
                    btnRejoindre.disabled = true;
                })
            }
        })
})

btnRejoindre.addEventListener("click", () => {
    new bootstrap.Modal(document.querySelector("#modal-rejoindre-orga")).show();
})

document.getElementById("btn-confirmer-rejoindre").addEventListener("click", () => {
    let siren = orgaField.value;
    fetch("/organisations/demander-rejoindre/" + siren, {
        method: 'POST'
    })
        .then((response) => {
            if(response.status === 200){
                localStorage.setItem("success", "true");
                window.location.reload();
            }
            else {
                errorMessage.style.removeProperty("display");
            }
        });
})


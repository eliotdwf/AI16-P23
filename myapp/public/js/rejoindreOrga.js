let orgaField = document.getElementById("select-orga");
let typeOrgaField = document.getElementById("type-orga-select");
let btnRejoindre = document.getElementById("btn-rejoindre");

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
                    document.getElementById("opt-grp-assos").innerHTML = "";
                    document.getElementById("opt-grp-entreprises").innerHTML = "";
                    orgas.forEach(orga => {
                        let content = `<option> ${orga.siren} | ${orga.nom} </option>`;
                        if(orga.id_type_organisation === 2){
                            document.getElementById("opt-grp-assos").innerHTML += content;
                        }
                        else {
                            document.getElementById("opt-grp-entreprises").innerHTML += content;
                        }
                    });
                })
            }
        })
})


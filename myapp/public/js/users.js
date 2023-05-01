function handleUserAccountUpdate(response) {
    if(response.status === 401) {
        window.location.href = "/connexion"
    }
    else if(response.status === 403) {
        response.text().then(content => {
            document.querySelector('main').innerHTML = content;
        })
    }
    else if(response.status === 200) {
        response.text().then(content => {
            updateAlertMessages(content);
            updateUsersList();
        })
    }
}


function deactivateUserAccount(email) {
    fetch("/users/deactivate-account/" + email)
        .then(handleUserAccountUpdate)
}


function activateUserAccount(email) {
    fetch("/users/activate-account/" + email)
        .then(handleUserAccountUpdate);
}

function giveAdminRights(email) {

}

function updateUsersList() {
    let role = document.getElementById("filtre-role").value;
    let usersTable = document.getElementById("usersTable");
    let body = {
        "role": role
    }
    fetch("/users/usersList", {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(body)
    })
        .then(response => {
            if(response.status === 401) {
                window.href.location = "/connexion"
            }
            else if(response.status === 403) {
                response.text().then(content => {
                    document.querySelector('main').innerHTML = content;
                })
            }
            else if(response.status === 200) {
                response.text().then(content => {
                    usersTable.innerHTML = content;
                })
            }
        })
}

function updateAlertMessages(alertMessage){
    let alertMessages = document.getElementById("alertMessages");
    alertMessages.innerHTML += alertMessage;
}

document.getElementById("filtre-role").addEventListener("change", updateUsersList);
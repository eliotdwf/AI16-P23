
function deactivateUserAccount(email) {
    fetch("/users/deactivate-account/" + email)
        .then(response => response.text())
        .then(response => {
            updateAlertMessages(response);
            updateUsersList();
        });
}


function activateUserAccount(email) {
    fetch("/users/activate-account/" + email)
        .then(response => response.text())
        .then(response => {
            updateAlertMessages(response);
            updateUsersList();
        });
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
        .then(response => response.text())
        .then(response => {
            usersTable.innerHTML = response;
        })
}

function updateAlertMessages(alertMessage){
    let alertMessages = document.getElementById("alertMessages");
    alertMessages.innerHTML += alertMessage;
}

document.getElementById("filtre-role").addEventListener("change", updateUsersList);
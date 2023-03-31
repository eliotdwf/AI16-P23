
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

function updateUsersList() {
    usersTable = document.getElementById("usersTable");
    fetch("/users/usersList")
        .then(response => response.text())
        .then(response => {
            usersTable.innerHTML = response;
        })
}

function updateAlertMessages(alertMessage){
    alertMessages = document.getElementById("alertMessages");
    alertMessages.innerHTML += alertMessage;
}
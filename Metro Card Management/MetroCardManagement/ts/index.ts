interface User {
    cardNumber: any,
    name: string,
    userName: string,
    userPassword: string,
    userPhone: string,
    userBalance: number
}

interface Travel {
    travelID: any,
    cardNumber: number,
    fromLocation: string,
    toLocation: string,
    date: Date,
    travelCost: number
}

interface Fair {
    ticketID: any,
    fromLocation: string,
    toLocation: string,
    price: number
}

let cardNumberAutoIncrement = 1000;
let travelIDAutoIncrement = 100;
let ticketIDAutoIncrement = 10;
let currentUser: User;
let NewUserNameStatus: true;
function displaySignUp() {
    let normalPage = document.getElementById("sign-in-form") as HTMLDListElement;
    let signUpPage = document.getElementById("sign-up-form") as HTMLDivElement;
    normalPage.style.display = "none";
    signUpPage.style.display = "flex";
    signUpPage.style.alignItems = "center";
}
function displaySignIn() {
    let normalPage = document.getElementById("sign-up-form") as HTMLDListElement;
    let signInPage = document.getElementById("sign-in-form") as HTMLDivElement;
    normalPage.style.display = "none";
    signInPage.style.display = "flex";
    signInPage.style.alignItems = "center";
}
async function takeToMainMenuBySignUp() {
    const UserArrayList = await fetchUsers();

    let newName = (document.getElementById("uname") as HTMLInputElement).value;
    let newUserName = (document.getElementById('sign-up-email-id') as HTMLInputElement).value;
    let newUserPassword = (document.getElementById('sign-up-password') as HTMLInputElement).value;
    let confirmUserPassword = (document.getElementById("confirm-password") as HTMLInputElement).value;
    let newPhone = (document.getElementById("number") as HTMLInputElement).value;
    if (NameCheck(newName)) {
        if (UserNameCheck(newUserName)) {
            if (PasswordCheck(newUserPassword)) {
                if (SamePassword(newUserPassword, confirmUserPassword)) {
                    const user: User = {
                        cardNumber: 0,
                        name: newName,
                        userName: newUserName,
                        userPassword: newUserPassword,
                        userPhone: newPhone,
                        userBalance: 100
                    };

                    addUser(user);
                    let signUpPage = document.getElementById("sign-up-form") as HTMLDListElement;
                    let signInPage = document.getElementById("sign-in-form") as HTMLDivElement;
                    signUpPage.style.display = "none";
                    signInPage.style.display = "flex";
                }
            }
        }
    }




}



function NameCheck(name: string) {
    var letters = /^[A-Za-z]+$/;
    if (letters.test(name)) {

        return true;

    }
    else {
        alert('Username must have alphabet characters only');
        return false;
    }
}

function UserNameCheck(userName: string) {
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (mailformat.test(userName)) {

        return true;

    }
    else {
        alert('Invalid emailID');
        return false;
    }
}

function PasswordCheck(password: string) {
    var pass = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&-+=()])(?=\\S+$).{8, 20}$/
    if (pass.test(password) == false) {
        return true;
    }
    else {
        alert("Invalid password");
        return false;
    }
}
function SamePassword(pass1: string, pass2: string) {
    if (pass1 != pass2) {
        alert("Password does not match");
        return false;
    }
    return true;
}
async function takeToMainMenuBySignIn() {
    const UserArrayList = await fetchUsers();
    let userEmail = (document.getElementById("email-id") as HTMLInputElement).value;
    let userPassword = (document.getElementById("password") as HTMLInputElement).value;
    let isTrue = true;
    for (let i = 0; i < UserArrayList.length; i++) {
        if (UserArrayList[i].userName == userEmail && UserArrayList[i].userPassword == userPassword) {
            let container = document.getElementById("container") as HTMLDListElement;
            let menu = document.getElementById("menu") as HTMLDListElement;
            container.style.display = "none";
            menu.style.display = "inline";
            isTrue = false;
            currentUser = UserArrayList[i];
            return;
        }

    }
    if (isTrue) {
        alert("Invalid credentials");
    }
}
async function displayTravelDetails() {
    hideAll();
    // let travelContent=document.getElementById("travel-content") as HTMLDivElement;
    // travelContent.style.display="flex"
    const FairList = await fetchFairs();
    const tableBody = document.querySelector("#travel-table tbody") as HTMLTableSectionElement;
    tableBody.innerHTML = "";
    FairList.forEach((fair) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                <td>${fair.fromLocation}</td>
                <td>${fair.toLocation}</td>
                <td>${fair.price}</td>
                <td>
                    <input type="button" value="BOOK" id="book-btn" onclick="BookTravel(${fair.ticketID});">
                </td>
            `;
        tableBody.appendChild(row);
    });
    let purchase = document.getElementById("travel-content") as HTMLDivElement;
    purchase.style.display = "flex";

}
let currentFair: Fair;
async function BookTravel(id: number) {
    const FairList = await fetchFairs();
    FairList.forEach((fair) => {
        if (fair.ticketID == id) {

            if (currentUser.userBalance >= fair.price) {
                currentUser.userBalance -= fair.price;
                alert("Ticket Confirmed");
                const newTravel: Travel = {
                    travelID: 0,
                    cardNumber: currentUser.cardNumber,
                    fromLocation: fair.fromLocation,
                    toLocation: fair.toLocation,
                    date: new Date("2024/05/07"),
                    travelCost: fair.price

                }
                addTravel(newTravel);
                const editUser: User = {
                    cardNumber: currentUser.cardNumber,
                    name: currentUser.name,
                    userName: currentUser.userName,
                    userPassword: currentUser.userPassword,
                    userPhone: currentUser.userPhone,
                    userBalance: currentUser.userBalance
                }
                updateUser(currentUser.cardNumber, editUser);
            }

        }

    });
}
async function displayTravelHistory() {
    const TravelList = await fetchTravels();
    const tableBody = document.querySelector("#order-table tbody") as HTMLTableSectionElement;
    tableBody.innerHTML = "";
    TravelList.forEach((travel) => {
        if (travel.cardNumber == currentUser.cardNumber) {
            const row = document.createElement("tr");
            row.innerHTML = `
                        <td>${travel.cardNumber}</td>
                        <td>${travel.fromLocation}</td>
                        <td>${travel.toLocation}</td>
                        <td>${travel.date.toString().split('T')[0].split('-').reverse().join('/')}</td>
                        <td>${travel.travelCost}</td>
                    `;
            tableBody.appendChild(row);
        }

    });
    hideAll();
    let travelHistory = document.getElementById("travel-history-content") as HTMLDivElement;
    travelHistory.style.display = "flex";
}
function displayTopUp()
{
    hideAll();
    let recharge = document.getElementById("recharge-content") as HTMLDivElement
    recharge.style.display="flex"
}
function rechargeAmount() {
    hideAll();
    let amount = (document.getElementById("amount-to-recharge") as HTMLInputElement).value;
    currentUser.userBalance += parseInt(amount);
    const user: User = {
        cardNumber: 0,
        userName: currentUser.userName,
        userBalance: currentUser.userBalance,
        name: currentUser.name,
        userPassword: currentUser.userPassword,
        userPhone: currentUser.userPhone
    }
    updateUser(currentUser.cardNumber, user);
    alert("recharge successfull");
    //displayMedicineList();
}
function displayShowBalanceDetails() {
    hideAll();
    let showbalance = document.getElementById("balance-check-content") as HTMLDivElement;
    showbalance.style.display = "flex";
    let balance = document.getElementById("display-balance") as HTMLInputElement;
    balance.value = (currentUser.userBalance).toString();
}
function hideAll() {
    let signUpForm = document.getElementById("sign-up-form") as HTMLDivElement
    let signInForm = document.getElementById("sign-in-form") as HTMLDivElement
    let travel = document.getElementById("travel-content") as HTMLDivElement
    let recharge = document.getElementById("recharge-content") as HTMLDivElement
    let balanceCheck = document.getElementById("balance-check-content") as HTMLDivElement
    let travelHistory = document.getElementById("travel-history-content") as HTMLDivElement
    signUpForm.style.display = "none";
    signInForm.style.display = "none";
    travel.style.display = "none";
    recharge.style.display = "none";
    balanceCheck.style.display = "none";
    travelHistory.style.display = "none";
}
async function fetchUsers(): Promise<User[]> {
    const apiUrl = 'http://localhost:5192/api/User';
    const response = await fetch(apiUrl);
    if (!response.ok) {
        throw new Error('Failed to fetch contacts');
    }
    return await response.json();
}

async function fetchTravels(): Promise<Travel[]> {
    const apiUrl = 'http://localhost:5192/api/Travel';
    const response = await fetch(apiUrl);
    if (!response.ok) {
        throw new Error('Failed to fetch contacts');
    }
    return await response.json();
}

async function fetchFairs(): Promise<Fair[]> {
    const apiUrl = 'http://localhost:5192/api/Fair';
    const response = await fetch(apiUrl);
    if (!response.ok) {
        throw new Error('Failed to fetch contacts');
    }
    return await response.json();
}

async function addUser(contact: User): Promise<void> {
    const response = await fetch('http://localhost:5192/api/User', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(contact)
    });
    if (!response.ok) {
        throw new Error('Failed to add contact');
    }
}

async function addTravel(contact: Travel): Promise<void> {
    const response = await fetch('http://localhost:5192/api/Travel', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(contact)
    });
    if (!response.ok) {
        throw new Error('Failed to add contact');
    }
}
async function addFair(contact: Fair): Promise<void> {
    const response = await fetch('http://localhost:5192/api/Fair', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(contact)
    });
    if (!response.ok) {
        throw new Error('Failed to add contact');
    }
}
async function updateUser(id: number, contact: User): Promise<void> {
    const response = await fetch(`http://localhost:5192/api/User/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(contact)
    });
    if (!response.ok) {
        throw new Error('Failed to update contact');
    }

}
async function updateTravel(id: number, contact: Travel): Promise<void> {
    const response = await fetch(`http://localhost:5192/api/Travel/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(contact)
    });
    if (!response.ok) {
        throw new Error('Failed to update contact');
    }

}
async function updateFair(id: number, contact: Fair): Promise<void> {
    const response = await fetch(`http://localhost:5192/api/Fair/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(contact)
    });
    if (!response.ok) {
        throw new Error('Failed to update contact');
    }

}

async function deleteMedicine(id: number): Promise<void> {
    const response = await fetch(`http://localhost:5192/api/Medicine/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        throw new Error('Failed to delete contact');
    }
}
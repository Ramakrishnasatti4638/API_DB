"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let cardNumberAutoIncrement = 1000;
let travelIDAutoIncrement = 100;
let ticketIDAutoIncrement = 10;
let currentUser;
let NewUserNameStatus;
function displaySignUp() {
    let normalPage = document.getElementById("sign-in-form");
    let signUpPage = document.getElementById("sign-up-form");
    normalPage.style.display = "none";
    signUpPage.style.display = "flex";
    signUpPage.style.alignItems = "center";
}
function displaySignIn() {
    let normalPage = document.getElementById("sign-up-form");
    let signInPage = document.getElementById("sign-in-form");
    normalPage.style.display = "none";
    signInPage.style.display = "flex";
    signInPage.style.alignItems = "center";
}
function takeToMainMenuBySignUp() {
    return __awaiter(this, void 0, void 0, function* () {
        const UserArrayList = yield fetchUsers();
        let newName = document.getElementById("uname").value;
        let newUserName = document.getElementById('sign-up-email-id').value;
        let newUserPassword = document.getElementById('sign-up-password').value;
        let confirmUserPassword = document.getElementById("confirm-password").value;
        let newPhone = document.getElementById("number").value;
        if (NameCheck(newName)) {
            if (UserNameCheck(newUserName)) {
                if (PasswordCheck(newUserPassword)) {
                    if (SamePassword(newUserPassword, confirmUserPassword)) {
                        const user = {
                            cardNumber: 0,
                            name: newName,
                            userName: newUserName,
                            userPassword: newUserPassword,
                            userPhone: newPhone,
                            userBalance: 100
                        };
                        addUser(user);
                        let signUpPage = document.getElementById("sign-up-form");
                        let signInPage = document.getElementById("sign-in-form");
                        signUpPage.style.display = "none";
                        signInPage.style.display = "flex";
                    }
                }
            }
        }
    });
}
function NameCheck(name) {
    var letters = /^[A-Za-z]+$/;
    if (letters.test(name)) {
        return true;
    }
    else {
        alert('Username must have alphabet characters only');
        return false;
    }
}
function UserNameCheck(userName) {
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (mailformat.test(userName)) {
        return true;
    }
    else {
        alert('Invalid emailID');
        return false;
    }
}
function PasswordCheck(password) {
    var pass = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&-+=()])(?=\\S+$).{8, 20}$/;
    if (pass.test(password) == false) {
        return true;
    }
    else {
        alert("Invalid password");
        return false;
    }
}
function SamePassword(pass1, pass2) {
    if (pass1 != pass2) {
        alert("Password does not match");
        return false;
    }
    return true;
}
function takeToMainMenuBySignIn() {
    return __awaiter(this, void 0, void 0, function* () {
        const UserArrayList = yield fetchUsers();
        let userEmail = document.getElementById("email-id").value;
        let userPassword = document.getElementById("password").value;
        let isTrue = true;
        for (let i = 0; i < UserArrayList.length; i++) {
            if (UserArrayList[i].userName == userEmail && UserArrayList[i].userPassword == userPassword) {
                let container = document.getElementById("container");
                let menu = document.getElementById("menu");
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
    });
}
function displayTravelDetails() {
    return __awaiter(this, void 0, void 0, function* () {
        hideAll();
        // let travelContent=document.getElementById("travel-content") as HTMLDivElement;
        // travelContent.style.display="flex"
        const FairList = yield fetchFairs();
        const tableBody = document.querySelector("#travel-table tbody");
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
        let purchase = document.getElementById("travel-content");
        purchase.style.display = "flex";
    });
}
let currentFair;
function BookTravel(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const FairList = yield fetchFairs();
        FairList.forEach((fair) => {
            if (fair.ticketID == id) {
                if (currentUser.userBalance >= fair.price) {
                    currentUser.userBalance -= fair.price;
                    alert("Ticket Confirmed");
                    const newTravel = {
                        travelID: 0,
                        cardNumber: currentUser.cardNumber,
                        fromLocation: fair.fromLocation,
                        toLocation: fair.toLocation,
                        date: new Date("2024/05/07"),
                        travelCost: fair.price
                    };
                    addTravel(newTravel);
                    const editUser = {
                        cardNumber: currentUser.cardNumber,
                        name: currentUser.name,
                        userName: currentUser.userName,
                        userPassword: currentUser.userPassword,
                        userPhone: currentUser.userPhone,
                        userBalance: currentUser.userBalance
                    };
                    updateUser(currentUser.cardNumber, editUser);
                }
            }
        });
    });
}
function displayTravelHistory() {
    return __awaiter(this, void 0, void 0, function* () {
        const TravelList = yield fetchTravels();
        const tableBody = document.querySelector("#order-table tbody");
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
        let travelHistory = document.getElementById("travel-history-content");
        travelHistory.style.display = "flex";
    });
}
function displayTopUp() {
    hideAll();
    let recharge = document.getElementById("recharge-content");
    recharge.style.display = "flex";
}
function rechargeAmount() {
    hideAll();
    let amount = document.getElementById("amount-to-recharge").value;
    currentUser.userBalance += parseInt(amount);
    const user = {
        cardNumber: 0,
        userName: currentUser.userName,
        userBalance: currentUser.userBalance,
        name: currentUser.name,
        userPassword: currentUser.userPassword,
        userPhone: currentUser.userPhone
    };
    updateUser(currentUser.cardNumber, user);
    alert("recharge successfull");
    //displayMedicineList();
}
function displayShowBalanceDetails() {
    hideAll();
    let showbalance = document.getElementById("balance-check-content");
    showbalance.style.display = "flex";
    let balance = document.getElementById("display-balance");
    balance.value = (currentUser.userBalance).toString();
}
function hideAll() {
    let signUpForm = document.getElementById("sign-up-form");
    let signInForm = document.getElementById("sign-in-form");
    let travel = document.getElementById("travel-content");
    let recharge = document.getElementById("recharge-content");
    let balanceCheck = document.getElementById("balance-check-content");
    let travelHistory = document.getElementById("travel-history-content");
    signUpForm.style.display = "none";
    signInForm.style.display = "none";
    travel.style.display = "none";
    recharge.style.display = "none";
    balanceCheck.style.display = "none";
    travelHistory.style.display = "none";
}
function fetchUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        const apiUrl = 'http://localhost:5192/api/User';
        const response = yield fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Failed to fetch contacts');
        }
        return yield response.json();
    });
}
function fetchTravels() {
    return __awaiter(this, void 0, void 0, function* () {
        const apiUrl = 'http://localhost:5192/api/Travel';
        const response = yield fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Failed to fetch contacts');
        }
        return yield response.json();
    });
}
function fetchFairs() {
    return __awaiter(this, void 0, void 0, function* () {
        const apiUrl = 'http://localhost:5192/api/Fair';
        const response = yield fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Failed to fetch contacts');
        }
        return yield response.json();
    });
}
function addUser(contact) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch('http://localhost:5192/api/User', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contact)
        });
        if (!response.ok) {
            throw new Error('Failed to add contact');
        }
    });
}
function addTravel(contact) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch('http://localhost:5192/api/Travel', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contact)
        });
        if (!response.ok) {
            throw new Error('Failed to add contact');
        }
    });
}
function addFair(contact) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch('http://localhost:5192/api/Fair', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contact)
        });
        if (!response.ok) {
            throw new Error('Failed to add contact');
        }
    });
}
function updateUser(id, contact) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`http://localhost:5192/api/User/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contact)
        });
        if (!response.ok) {
            throw new Error('Failed to update contact');
        }
    });
}
function updateTravel(id, contact) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`http://localhost:5192/api/Travel/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contact)
        });
        if (!response.ok) {
            throw new Error('Failed to update contact');
        }
    });
}
function updateFair(id, contact) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`http://localhost:5192/api/Fair/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contact)
        });
        if (!response.ok) {
            throw new Error('Failed to update contact');
        }
    });
}
function deleteMedicine(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`http://localhost:5192/api/Medicine/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Failed to delete contact');
        }
    });
}

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
let currentUser;
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
        let newEmail = document.getElementById('sign-up-email-id').value;
        let newUserPassword = document.getElementById('sign-up-password').value;
        let confirmUserPassword = document.getElementById("confirm-password").value;
        let gender;
        if (document.getElementById("gender-male").checked == true) {
            gender = document.getElementById("gender-male").value;
        }
        else {
            gender = document.getElementById("gender-female").value;
        }
        // if((document.getElementById("department") as HTMLInputElement).value)
        let department = document.getElementById("department").value;
        let phone = document.getElementById("number").value;
        if (NameCheck(newName)) {
            if (UserNameCheck(newEmail)) {
                if (PasswordCheck(newUserPassword)) {
                    if (SamePassword(newUserPassword, confirmUserPassword)) {
                        const user = {
                            userID: 0,
                            name: newName,
                            gender: gender,
                            department: department,
                            userPhone: phone,
                            userEmail: newEmail,
                            userPassword: newUserPassword,
                            walletBalance: 100
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
            if (UserArrayList[i].userEmail == userEmail && UserArrayList[i].userPassword == userPassword) {
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
function displayBorrowBook() {
    return __awaiter(this, void 0, void 0, function* () {
        hideAll();
        const BookList = yield fetchBooks();
        const tableBody = document.querySelector("#borrow-table tbody");
        tableBody.innerHTML = "";
        BookList.forEach((book) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${book.bookName}</td>
                <td>${book.authorName}</td>
                <td>${book.bookCount}</td>
                <td>
                    <input type="button" value="BUY" id="buy-btn" onclick="setBookID(${book.bookID})"
                </td>
                <td>
                    <input type="button" value="Delete" id="delete-btn" onclick="deleteBook(${book.bookID})">
                </td>
        `;
            tableBody.appendChild(row);
        });
        let borrow = document.getElementById("borrow-content");
        borrow.style.display = "flex";
    });
}
function displayAddForm() {
    hideAll();
    document.getElementById("borrow-content").style.display = "block";
    document.getElementById("add-form").style.display = "flex";
}
function AddBook() {
    let bookNameNew = document.getElementById("book-name").value;
    let authorNameNew = document.getElementById("author-name").value;
    let bookCountNew = document.getElementById("book-count").value;
    const book = {
        bookID: 0,
        bookName: bookNameNew,
        authorName: authorNameNew,
        bookCount: parseInt(bookCountNew)
    };
    addBook(book);
    displayBorrowBook();
}
// let globalBookIDForEdit:number;
// function setBookIDForEdit(id:number)
// {
//     let editForm=document.getElementById("edit-form") as HTMLDivElement 
//     editForm.style.display="flex";
//     EditBook(id);
// }
// async function EditBook(id:number){
//     hideAll();
//     const BookList=await fetchBooks();
//     // BookList.forEach((book)=>{
//     //     if()
//     // })
//     (document.getElementById("book-name-edit") as HTMLInputElement).innerHTML=
// }
function deleteBook(id) {
    deleteBookID(id);
    displayBorrowBook();
}
let globalBookID;
function setBookID(id) {
    globalBookID = id;
    hideAll();
    let bookForm = document.getElementById("buy-book");
    bookForm.style.display = "flex";
}
function getQuantity() {
    let quantity = document.getElementById("quantity").value;
    buyBook(parseInt(quantity));
    displayBorrowBook();
}
function buyBook(quantity) {
    return __awaiter(this, void 0, void 0, function* () {
        hideAll();
        let numberOfBook = 0;
        let nextAvailableDate;
        const BorrowList = yield fetchBorrows();
        BorrowList.forEach((borrow) => {
            if (borrow.userID == currentUser.userID && borrow.status == "Borrowed") {
                numberOfBook += borrow.borrowedBookCount;
            }
        });
        const BookList = yield fetchBooks();
        BookList.forEach((book) => {
            if (book.bookID == globalBookID) {
                if (numberOfBook < 3) {
                    if (numberOfBook + quantity <= 3) {
                        if (book.bookCount >= quantity) {
                            const borrow = {
                                borrowID: 0,
                                bookID: book.bookID,
                                userID: currentUser.userID,
                                borrowedBookCount: quantity,
                                borrowedDate: new Date('2024-05-07'),
                                status: "Borrowed",
                                paidFineAmount: 0
                            };
                            addBorrow(borrow);
                            book.bookCount -= quantity;
                            const books = {
                                bookID: book.bookID,
                                bookName: book.bookName,
                                authorName: book.authorName,
                                bookCount: book.bookCount
                            };
                            updateBook(globalBookID, books);
                            alert("Purchase successfull");
                            return;
                        }
                        else {
                            alert("Quantity entered is more than available quantity");
                            BorrowList.forEach((borrow) => {
                                if (borrow.bookID == book.bookID && borrow.status == "Borrowed") {
                                    nextAvailableDate = new Date(addDays(borrow.borrowedDate));
                                }
                            });
                            alert("The book's next available date is " + nextAvailableDate);
                            return;
                        }
                    }
                    else {
                        alert("Your entered quantity crosses 3. You can only buy 3 books");
                        return;
                    }
                }
                else {
                    alert("You already borrowed 3 books. Maximum 3 books only can be borrowed");
                    return;
                }
            }
        });
    });
}
function addDays(date) {
    let result = new Date(date);
    result.setDate(result.getDate() + 15);
    return result;
}
let globalBorrowID;
function displayReturnBook() {
    return __awaiter(this, void 0, void 0, function* () {
        hideAll();
        let returnBook = document.getElementById("return-book-content");
        returnBook.style.display = "flex";
        const tableBody = document.querySelector("#return-table tbody");
        tableBody.innerHTML = "";
        const BorrowList = yield fetchBorrows();
        BorrowList.forEach((borrowed) => {
            if (borrowed.userID == currentUser.userID && borrowed.status == "Borrowed") {
                const row = document.createElement("tr");
                row.innerHTML = `
                            <td>${borrowed.bookID}</td>
                            <td>${borrowed.borrowedDate.toString().split('T')[0].split('-').reverse().join('/')}</td>
                            <td>${borrowed.borrowedBookCount}</td>
                            <td id="${borrowed.borrowID}">${borrowed.status}</td>
                            <td>
                                <input type="button" value="Return" id="return-book" onclick="ReturnBook(${borrowed.borrowID})">
                            </td>
                `;
                tableBody.appendChild(row);
            }
        });
    });
}
function ReturnBook(id) {
    return __awaiter(this, void 0, void 0, function* () {
        globalBorrowID = id;
        let stringID = id.toString();
        const BookList = yield fetchBooks();
        const BorrowList = yield fetchBorrows();
        BorrowList.forEach((borrow) => {
            if (borrow.borrowID == globalBorrowID && borrow.userID == currentUser.userID && borrow.status == "Borrowed") {
                if ((DateCheck(addDays(borrow.borrowedDate))) < 15) {
                    borrow.status = "Returned";
                    const updatedBorrow = {
                        borrowID: borrow.borrowID,
                        bookID: borrow.bookID,
                        userID: borrow.userID,
                        borrowedDate: borrow.borrowedDate,
                        borrowedBookCount: borrow.borrowedBookCount,
                        status: borrow.status,
                        paidFineAmount: borrow.paidFineAmount
                    };
                    updateBorrow(globalBorrowID, updatedBorrow);
                    let newID = document.getElementById(stringID);
                    newID.innerHTML = "Returned";
                    BookList.forEach((book) => {
                        if (book.bookID == borrow.bookID) {
                            book.bookCount += borrow.borrowedBookCount;
                            const updatedBook = {
                                bookID: book.bookID,
                                bookName: book.bookName,
                                authorName: book.authorName,
                                bookCount: book.bookCount
                            };
                            updateBook(book.bookID, updatedBook);
                            return;
                        }
                    });
                }
                else {
                    borrow.status = "Returned";
                    borrow.paidFineAmount = (DateCheck(addDays(borrow.borrowedDate)));
                    if (currentUser.walletBalance >= borrow.paidFineAmount) {
                        const updatedBorrow = {
                            borrowID: borrow.borrowID,
                            bookID: borrow.bookID,
                            userID: borrow.userID,
                            borrowedDate: borrow.borrowedDate,
                            borrowedBookCount: borrow.borrowedBookCount,
                            status: borrow.status,
                            paidFineAmount: borrow.paidFineAmount
                        };
                        updateBorrow(globalBorrowID, updatedBorrow);
                        let newID = document.getElementById(stringID);
                        newID.innerHTML = "Returned";
                        currentUser.walletBalance -= borrow.paidFineAmount;
                        const updatedUser = {
                            userID: currentUser.userID,
                            name: currentUser.name,
                            gender: currentUser.gender,
                            department: currentUser.department,
                            userPhone: currentUser.userPhone,
                            userEmail: currentUser.userEmail,
                            userPassword: currentUser.userPassword,
                            walletBalance: currentUser.walletBalance
                        };
                        updateUser(currentUser.userID, updatedUser);
                        BookList.forEach((book) => {
                            if (book.bookID == borrow.bookID) {
                                book.bookCount += borrow.borrowedBookCount;
                                const updatedBook = {
                                    bookID: book.bookID,
                                    bookName: book.bookName,
                                    authorName: book.authorName,
                                    bookCount: book.bookCount
                                };
                                updateBook(book.bookID, updatedBook);
                                return;
                            }
                        });
                    }
                    else {
                        alert("Insufficient balance");
                        return;
                    }
                }
            }
        });
        displayReturnBook();
    });
}
function DateCheck(date) {
    const date1 = new Date(date);
    const span = Math.round((new Date().getTime() - date1.getTime()) / (24 * 60 * 60 * 1000));
    return span;
}
function displayTopUp() {
    hideAll();
    let topUp = document.getElementById("recharge-content");
    topUp.style.display = "flex";
}
function rechargeAmount() {
    let amount = document.getElementById("amount-to-recharge").value;
    currentUser.walletBalance += parseInt(amount);
    const user = {
        userID: currentUser.userID,
        name: currentUser.name,
        gender: currentUser.gender,
        department: currentUser.department,
        userPhone: currentUser.userPhone,
        userEmail: currentUser.userEmail,
        userPassword: currentUser.userPassword,
        walletBalance: currentUser.walletBalance
    };
    updateUser(currentUser.userID, user);
    alert("recharge successfull");
    //displayMedicineList();
}
function displayShowBalanceDetails() {
    hideAll();
    let showbalance = document.getElementById("show-balance-content");
    showbalance.style.display = "flex";
    let balance = document.getElementById("display-balance");
    balance.value = (currentUser.walletBalance).toString();
}
function displayBorrowedHistory() {
    return __awaiter(this, void 0, void 0, function* () {
        hideAll();
        let history = document.getElementById("borrow-history-content");
        history.style.display = "flex";
        const BorrowList = yield fetchBorrows();
        const tableBody = document.querySelector("#order-table tbody");
        tableBody.innerHTML = "";
        BorrowList.forEach((borrow) => {
            if (borrow.userID == currentUser.userID) {
                const row = document.createElement("tr");
                row.innerHTML = `
                            <td>${borrow.bookID}</td>
                            <td>${borrow.borrowedDate.toString().split('T')[0].split('-').reverse().join('/')}</td>
                            <td>${borrow.borrowedBookCount}</td>
                            <td>${borrow.status}</td>
                            <td>${borrow.paidFineAmount}</td>
                `;
                tableBody.appendChild(row);
            }
        });
    });
}
function hideAll() {
    let signUpForm = document.getElementById("sign-up-form");
    let signInForm = document.getElementById("sign-in-form");
    let borrow = document.getElementById("borrow-content");
    let bookForm = document.getElementById("buy-book");
    let returnBook = document.getElementById("return-book-content");
    let recharge = document.getElementById("recharge-content");
    let balance = document.getElementById("show-balance-content");
    let history = document.getElementById("borrow-history-content");
    let addForm = document.getElementById("add-form");
    signUpForm.style.display = "none";
    signInForm.style.display = "none";
    borrow.style.display = "none";
    bookForm.style.display = "none";
    returnBook.style.display = "none";
    recharge.style.display = "none";
    balance.style.display = "none";
    history.style.display = "none";
    addForm.style.display = "none";
}
function fetchUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        const apiUrl = 'http://localhost:5063/api/User';
        const response = yield fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }
        return yield response.json();
    });
}
function fetchBooks() {
    return __awaiter(this, void 0, void 0, function* () {
        const apiUrl = 'http://localhost:5063/api/Book';
        const response = yield fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Failed to fetch books');
        }
        return yield response.json();
    });
}
function fetchBorrows() {
    return __awaiter(this, void 0, void 0, function* () {
        const apiUrl = 'http://localhost:5063/api/Borrow';
        const response = yield fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Failed to fetch Borrows');
        }
        return yield response.json();
    });
}
function addUser(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch('http://localhost:5063/api/User', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });
        if (!response.ok) {
            throw new Error('Failed to add user');
        }
    });
}
function addBook(book) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch('http://localhost:5063/api/Book', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(book)
        });
        if (!response.ok) {
            throw new Error('Failed to add book');
        }
    });
}
function addBorrow(borrow) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch('http://localhost:5063/api/Borrow', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(borrow)
        });
        if (!response.ok) {
            throw new Error('Failed');
        }
    });
}
function updateUser(id, user) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`http://localhost:5063/api/User/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });
        if (!response.ok) {
            throw new Error('Failed to update contact');
        }
    });
}
function updateBook(id, book) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`http://localhost:5063/api/Book/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(book)
        });
        if (!response.ok) {
            throw new Error('Failed to update contact');
        }
    });
}
function updateBorrow(id, borrow) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`http://localhost:5063/api/Borrow/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(borrow)
        });
        if (!response.ok) {
            throw new Error('Failed to update contact');
        }
    });
}
function deleteBookID(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`http://localhost:5063/api/Book/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Failed to delete Book');
        }
    });
}

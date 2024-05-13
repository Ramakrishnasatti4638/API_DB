
interface Users {
    userID: number;
    name: string;
    gender: string;
    department: string;
    userPhone: string;
    userEmail: string;
    userPassword: string;
    walletBalance: number;
}

interface Books {
    bookID: number;
    bookName: string;
    authorName: string;
    bookCount: number;
}

interface Borrows {
    borrowID: number;
    bookID: number;
    userID: number;
    borrowedDate: Date;
    borrowedBookCount: number;
    status: string;
    paidFineAmount: number;
}
let currentUser: Users;


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
    let newEmail = (document.getElementById('sign-up-email-id') as HTMLInputElement).value;
    let newUserPassword = (document.getElementById('sign-up-password') as HTMLInputElement).value;
    let confirmUserPassword = (document.getElementById("confirm-password") as HTMLInputElement).value;
    let gender;
    if ((document.getElementById("gender-male") as HTMLInputElement).checked == true) {
        gender = (document.getElementById("gender-male") as HTMLInputElement).value;
    }
    else {
        gender = (document.getElementById("gender-female") as HTMLInputElement).value;
    }
    // if((document.getElementById("department") as HTMLInputElement).value)
    let department = (document.getElementById("department") as HTMLInputElement).value;
    let phone = (document.getElementById("number") as HTMLInputElement).value;
    if (NameCheck(newName)) {
        if (UserNameCheck(newEmail)) {
            if (PasswordCheck(newUserPassword)) {
                if (SamePassword(newUserPassword, confirmUserPassword)) {
                    const user: Users = {
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
        if (UserArrayList[i].userEmail == userEmail && UserArrayList[i].userPassword == userPassword) {
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

async function displayBorrowBook() {
    hideAll();
    const BookList = await fetchBooks();
    const tableBody = document.querySelector("#borrow-table tbody") as HTMLTableSectionElement
    tableBody.innerHTML = ""
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
    let borrow = document.getElementById("borrow-content") as HTMLDivElement
    borrow.style.display = "flex";


}

function displayAddForm() {
    hideAll();
    (document.getElementById("borrow-content") as HTMLDivElement).style.display = "block";
    (document.getElementById("add-form") as HTMLDivElement).style.display = "flex";

}

function AddBook() {
    let bookNameNew = (document.getElementById("book-name") as HTMLInputElement).value;
    let authorNameNew = (document.getElementById("author-name") as HTMLInputElement).value;
    let bookCountNew = (document.getElementById("book-count") as HTMLInputElement).value;
    const book: Books = {
        bookID: 0,
        bookName: bookNameNew,
        authorName: authorNameNew,
        bookCount: parseInt(bookCountNew)
    }
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
function deleteBook(id: number) {
    deleteBookID(id);
    displayBorrowBook();
}
let globalBookID: number;
function setBookID(id: number) {
    globalBookID = id;
    hideAll();
    let bookForm = document.getElementById("buy-book") as HTMLDivElement
    bookForm.style.display = "flex";
}

function getQuantity() {

    let quantity = (document.getElementById("quantity") as HTMLInputElement).value;
    buyBook(parseInt(quantity));
    displayBorrowBook();
}

async function buyBook(quantity: number) {
    hideAll()
    let numberOfBook = 0;
    let nextAvailableDate: Date;
    const BorrowList = await fetchBorrows();
    BorrowList.forEach((borrow) => {
        if (borrow.userID == currentUser.userID && borrow.status == "Borrowed") {
            numberOfBook += borrow.borrowedBookCount;
        }
    })
    const BookList = await fetchBooks();
    BookList.forEach((book) => {
        if (book.bookID == globalBookID) {
            if (numberOfBook < 3) {
                if (numberOfBook + quantity <= 3) {
                    if (book.bookCount >= quantity) {
                        const borrow: Borrows = {
                            borrowID: 0,
                            bookID: book.bookID,
                            userID: currentUser.userID,
                            borrowedBookCount: quantity,
                            borrowedDate: new Date('2024-05-07'),
                            status: "Borrowed",
                            paidFineAmount: 0
                        }
                        addBorrow(borrow);
                        book.bookCount -= quantity;
                        const books: Books = {
                            bookID: book.bookID,
                            bookName: book.bookName,
                            authorName: book.authorName,
                            bookCount: book.bookCount
                        }
                        updateBook(globalBookID, books);
                        alert("Purchase successfull");
                        return;
                    }
                    else {
                        alert("Quantity entered is more than available quantity");

                        BorrowList.forEach((borrow) => {
                            if (borrow.bookID == book.bookID && borrow.status == "Borrowed") {
                                nextAvailableDate = new Date(addDays(borrow.borrowedDate))
                            }
                        })
                        alert("The book's next available date is " + nextAvailableDate)
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
    })
}
function addDays(date: Date): Date {
    let result = new Date(date);
    result.setDate(result.getDate() + 15);
    return result;

}

let globalBorrowID: number;
async function displayReturnBook() {
    hideAll();
    let returnBook = document.getElementById("return-book-content") as HTMLDivElement
    returnBook.style.display = "flex";
    const tableBody = document.querySelector("#return-table tbody") as HTMLTableSectionElement;
    tableBody.innerHTML = "";
    const BorrowList = await fetchBorrows();
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
    })
}
async function ReturnBook(id: number) {
    globalBorrowID = id;
    let stringID = id.toString();
    const BookList = await fetchBooks();
    const BorrowList = await fetchBorrows();
    BorrowList.forEach((borrow) => {
        if (borrow.borrowID == globalBorrowID && borrow.userID == currentUser.userID && borrow.status == "Borrowed") {
            if ((DateCheck(addDays(borrow.borrowedDate))) < 15) {
                borrow.status = "Returned";
                const updatedBorrow: Borrows = {
                    borrowID: borrow.borrowID,
                    bookID: borrow.bookID,
                    userID: borrow.userID,
                    borrowedDate: borrow.borrowedDate,
                    borrowedBookCount: borrow.borrowedBookCount,
                    status: borrow.status,
                    paidFineAmount: borrow.paidFineAmount
                }
                updateBorrow(globalBorrowID, updatedBorrow);
                let newID = document.getElementById(stringID) as HTMLElement;
                newID.innerHTML = "Returned";
                BookList.forEach((book) => {
                    if (book.bookID == borrow.bookID) {
                        book.bookCount += borrow.borrowedBookCount;
                        const updatedBook: Books = {
                            bookID: book.bookID,
                            bookName: book.bookName,
                            authorName: book.authorName,
                            bookCount: book.bookCount
                        }
                        updateBook(book.bookID, updatedBook);
                        return;
                    }
                })

            }
            else {
                borrow.status = "Returned";
                borrow.paidFineAmount = (DateCheck(addDays(borrow.borrowedDate)))
                if (currentUser.walletBalance >= borrow.paidFineAmount) {
                    const updatedBorrow: Borrows = {
                        borrowID: borrow.borrowID,
                        bookID: borrow.bookID,
                        userID: borrow.userID,
                        borrowedDate: borrow.borrowedDate,
                        borrowedBookCount: borrow.borrowedBookCount,
                        status: borrow.status,
                        paidFineAmount: borrow.paidFineAmount
                    }


                    updateBorrow(globalBorrowID, updatedBorrow);

                    let newID = document.getElementById(stringID) as HTMLElement;
                    newID.innerHTML = "Returned";

                    currentUser.walletBalance -= borrow.paidFineAmount;
                    const updatedUser: Users = {
                        userID: currentUser.userID,
                        name: currentUser.name,
                        gender: currentUser.gender,
                        department: currentUser.department,
                        userPhone: currentUser.userPhone,
                        userEmail: currentUser.userEmail,
                        userPassword: currentUser.userPassword,
                        walletBalance: currentUser.walletBalance
                    }
                    updateUser(currentUser.userID, updatedUser);
                    BookList.forEach((book) => {
                        if (book.bookID == borrow.bookID) {
                            book.bookCount += borrow.borrowedBookCount;
                            const updatedBook: Books = {
                                bookID: book.bookID,
                                bookName: book.bookName,
                                authorName: book.authorName,
                                bookCount: book.bookCount
                            }
                            updateBook(book.bookID, updatedBook);
                            return;
                        }
                    })
                }
                else {
                    alert("Insufficient balance");
                    return;
                }

            }
        }
    })
    displayReturnBook();
}
function DateCheck(date: Date): number {
    const date1 = new Date(date);
    const span = Math.round((new Date().getTime() - date1.getTime()) / (24 * 60 * 60 * 1000));
    return span
}
function displayTopUp() {
    hideAll();
    let topUp = (document.getElementById("recharge-content") as HTMLInputElement);
    topUp.style.display = "flex";
}
function rechargeAmount() {
    let amount = (document.getElementById("amount-to-recharge") as HTMLInputElement).value;
    currentUser.walletBalance += parseInt(amount);
    const user: Users = {
        userID: currentUser.userID,
        name: currentUser.name,
        gender: currentUser.gender,
        department: currentUser.department,
        userPhone: currentUser.userPhone,
        userEmail: currentUser.userEmail,
        userPassword: currentUser.userPassword,
        walletBalance: currentUser.walletBalance
    }
    updateUser(currentUser.userID, user);
    alert("recharge successfull");
    //displayMedicineList();
}
function displayShowBalanceDetails() {
    hideAll();
    let showbalance = document.getElementById("show-balance-content") as HTMLDivElement;
    showbalance.style.display = "flex";
    let balance = document.getElementById("display-balance") as HTMLInputElement;
    balance.value = (currentUser.walletBalance).toString();
}

async function displayBorrowedHistory() {
    hideAll();
    let history = document.getElementById("borrow-history-content") as HTMLDivElement
    history.style.display = "flex"
    const BorrowList = await fetchBorrows();
    const tableBody = document.querySelector("#order-table tbody") as HTMLTableSectionElement
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
}
function hideAll() {
    let signUpForm = document.getElementById("sign-up-form") as HTMLDivElement
    let signInForm = document.getElementById("sign-in-form") as HTMLDivElement
    let borrow = document.getElementById("borrow-content") as HTMLDivElement
    let bookForm = document.getElementById("buy-book") as HTMLDivElement
    let returnBook = document.getElementById("return-book-content") as HTMLDivElement
    let recharge = document.getElementById("recharge-content") as HTMLDivElement
    let balance = document.getElementById("show-balance-content") as HTMLDivElement
    let history = document.getElementById("borrow-history-content") as HTMLDivElement
    let addForm = document.getElementById("add-form") as HTMLDivElement

    signUpForm.style.display = "none"
    signInForm.style.display = "none"
    borrow.style.display = "none"
    bookForm.style.display = "none"
    returnBook.style.display = "none"
    recharge.style.display = "none"
    balance.style.display = "none"
    history.style.display = "none"
    addForm.style.display = "none"
}

async function fetchUsers(): Promise<Users[]> {
    const apiUrl = 'http://localhost:5063/api/User';
    const response = await fetch(apiUrl);
    if (!response.ok) {
        throw new Error('Failed to fetch users')
    }
    return await response.json();
}

async function fetchBooks(): Promise<Books[]> {
    const apiUrl = 'http://localhost:5063/api/Book';
    const response = await fetch(apiUrl);
    if (!response.ok) {
        throw new Error('Failed to fetch books');
    }
    return await response.json();
}

async function fetchBorrows(): Promise<Borrows[]> {
    const apiUrl = 'http://localhost:5063/api/Borrow';
    const response = await fetch(apiUrl);
    if (!response.ok) {
        throw new Error('Failed to fetch Borrows');
    }
    return await response.json();
}

async function addUser(user: Users): Promise<void> {
    const response = await fetch('http://localhost:5063/api/User', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });
    if (!response.ok) {
        throw new Error('Failed to add user')
    }
}

async function addBook(book: Books): Promise<void> {
    const response = await fetch('http://localhost:5063/api/Book', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(book)
    });
    if (!response.ok) {
        throw new Error('Failed to add book')
    }
}

async function addBorrow(borrow: Borrows): Promise<void> {
    const response = await fetch('http://localhost:5063/api/Borrow', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(borrow)
    });
    if (!response.ok) {
        throw new Error('Failed');
    }
}

async function updateUser(id: number, user: Users): Promise<void> {
    const response = await fetch(`http://localhost:5063/api/User/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });
    if (!response.ok) {
        throw new Error('Failed to update contact');
    }

}

async function updateBook(id: number, book: Books): Promise<void> {
    const response = await fetch(`http://localhost:5063/api/Book/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(book)
    });
    if (!response.ok) {
        throw new Error('Failed to update contact');
    }

}

async function updateBorrow(id: number, borrow: Borrows): Promise<void> {
    const response = await fetch(`http://localhost:5063/api/Borrow/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(borrow)
    });
    if (!response.ok) {
        throw new Error('Failed to update contact');
    }

}

async function deleteBookID(id: number): Promise<void> {
    const response = await fetch(`http://localhost:5063/api/Book/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        throw new Error('Failed to delete Book');
    }
}
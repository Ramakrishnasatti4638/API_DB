"use strict";
let UserIdAutoIncrement = 1002;
let MedicineIdAutoIncrement = 15;
let OrderIdAutoIncrement = 100;
let OrderStatus;
let CurrentUserName;
let currentUser;
let currentMedicine;
let currentUserBalance;
let quantity;
let globalOrderId;
let medicineIDNew;
let NewUserNameStatus = true;
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
async function takeToMainMenuBySignUp() {
    if (NewUserNameStatus == true) {
        let newName = document.getElementById("uname").value;
        let newUserName = document.getElementById('sign-up-email-id').value;
        let newUserPassword = document.getElementById('sign-up-password').value;
        let confirmUserPassword = document.getElementById("confirm-password").value;
        let fileInput = document.getElementById("file-upload-user");
        if (!fileInput.files || fileInput.files.length == 0) {
            return;
        }
        let file = fileInput.files[0];
        let data = await ConvertToByteArray(file);
        if (NameCheck(newName)) {
            if (UserNameCheck(newUserName)) {
                if (PasswordCheck(newUserPassword)) {
                    if (SamePassword(newUserPassword, confirmUserPassword)) {
                        const user = {
                            userID: 0,
                            name: newName,
                            userName: newUserName,
                            userPassword: newUserPassword,
                            userBalance: 100,
                            userImage: data
                        };
                        UserIdAutoIncrement = user.userID;
                        addContact(user);
                        let signUpPage = document.getElementById("sign-up-form");
                        let signInPage = document.getElementById("sign-in-form");
                        signUpPage.style.display = "none";
                        signInPage.style.display = "flex";
                        document.getElementById("user-image").innerHTML = 'data:image/jpg;base64,' + data;
                    }
                }
            }
        }
    }
    else {
        alert("Entered details are wrong");
    }
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
async function takeToMainMenuBySignIn() {
    const UserArrayList = await fetchUsers();
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
            currentUserBalance = UserArrayList[i].userBalance;
            document.getElementById("welcome-name").innerHTML = currentUser.name;
            return;
        }
    }
    if (isTrue) {
        alert("Invalid credentials");
    }
}
async function displayMedicineList() {
    const MedicineList = await fetchMedicines();
    const tableBody = document.querySelector("#medicine-table tbody");
    tableBody.innerHTML = "";
    MedicineList.forEach((medicine) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                <td ><img src="${'data:image/jpg;base64,' + medicine.medicineImage} " class="image"></td>
                <td>${medicine.medicineName}</td>
                <td>${medicine.medicinePrice}</td>
                <td>${medicine.medicineCount}</td>
                <td>${medicine.medicineExpiry.toString().split('T')[0].split('-').reverse().join('/')}</td>
                <td>
                    <input type="button" value="Edit" id="edit-btn" onclick="setMedicineIdNew(${medicine.medicineID});">
                    <input type="button" value="Delete" id="delete-btn" onclick="deleteRow(${medicine.medicineID});">
                </td>
            `;
        tableBody.appendChild(row);
    });
}
;
function deleteRow(id) {
    // MedicineList = MedicineList.filter((item) => item.medicineId != id);
    deleteMedicine(id);
    displayMedicineList();
}
function displayEditForm() {
    editRow(medicineIDNew);
}
function setMedicineIdNew(id) {
    medicineIDNew = id;
    hideAll();
    let buyForm = document.getElementById("edit-form");
    buyForm.style.display = "flex";
}
function ConvertToByteArray(file) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = () => {
            let buffer = reader.result;
            let data = buffer.split(",")[1];
            resolve(data);
        };
        reader.onerror = () => {
            reject(new Error("Failed to read file"));
        };
        reader.readAsDataURL(file);
    });
}
async function editRow(id) {
    let medicineName = document.getElementById("medicine-name").value;
    let medicinePrice = document.getElementById("medicine-price").value;
    let medicineQuantity = document.getElementById("medicine-quantity").value;
    let medicineExpiry = document.getElementById("medicine-expiry").value;
    let fileInput = document.getElementById("file-upload");
    if (!fileInput.files || fileInput.files.length == 0) {
        return;
    }
    let file = fileInput.files[0];
    let data = await ConvertToByteArray(file);
    const editMedicine = {
        medicineImage: data,
        medicineID: medicineIDNew,
        medicineName: medicineName,
        medicinePrice: parseInt(medicinePrice),
        medicineCount: parseInt(medicineQuantity),
        medicineExpiry: new Date(medicineExpiry)
    };
    updateMedicine(medicineIDNew, editMedicine);
    displayMedicineList();
}
;
function displayAddForm() {
    hideAll();
    let displayForm = document.getElementById("add-form");
    let medicine = document.getElementById("medicine-details-content");
    let medicineTable = document.getElementById("medicine-table");
    medicine.style.display = "flex";
    medicineTable.style.display = "none";
    displayForm.style.display = "block";
}
async function addRow() {
    let medName = document.getElementById("add-medicine-name").value;
    let medPrice = document.getElementById("add-price").value;
    let medQuantity = document.getElementById("add-quantity").value;
    let medExpiry = document.getElementById("add-expiry").value;
    let fileInput = document.getElementById("file-upload-add");
    if (!fileInput.files || fileInput.files.length == 0) {
        return;
    }
    let file = fileInput.files[0];
    let data = await ConvertToByteArray(file);
    const MedicineList = await fetchMedicines();
    const medicine = {
        medicineID: 0,
        medicineName: medName,
        medicinePrice: parseInt(medPrice),
        medicineCount: parseInt(medQuantity),
        medicineExpiry: new Date(medExpiry),
        medicineImage: data
    };
    addMedicine(medicine);
    alert("Medicine added successfully");
    displayMedicineDetails();
}
function displayMedicineDetails() {
    hideAll();
    let medicine = document.getElementById("medicine-details-content");
    let medicineTable = document.getElementById("medicine-table");
    medicine.style.display = "flex";
    medicineTable.style.display = "block";
    displayMedicineList();
}
;
async function displayMedicineListForPurchase() {
    const tableBody = document.querySelector("#purchase-table tbody");
    const MedicineList = await fetchMedicines();
    tableBody.innerHTML = "";
    MedicineList.forEach((medicine) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                <td>${medicine.medicineName}</td>
                <td>${medicine.medicinePrice}</td>
                <td>${medicine.medicineCount}</td>
                <td>${medicine.medicineExpiry.toString().split('T')[0].split('-').reverse().join('/')}</td>
                <td>
                 <input type="button" value="BUY" id="${medicine.medicineID}" onclick="setMedicineID('${medicine.medicineID}');">
                </td>
            `;
        tableBody.appendChild(row);
    });
}
;
function setMedicineID(id) {
    medicineIDNew = id;
    let purchase = document.getElementById("purchase-content");
    let buyForm = document.getElementById("buy-medicine");
    purchase.style.display = "none";
    buyForm.style.display = "flex";
}
function displayPurchaseDetails() {
    hideAll();
    let purchase = document.getElementById("purchase-content");
    purchase.style.display = "flex";
    displayMedicineListForPurchase();
}
;
function getQuantity() {
    let quantity = document.getElementById("quantity").value;
    buyTheMedicines(parseInt(quantity));
}
;
async function buyTheMedicines(quantity) {
    const MedicineList = await fetchMedicines();
    const OrderList = await fetchOrders();
    for (let i = 0; i < MedicineList.length; i++) {
        if (medicineIDNew == MedicineList[i].medicineID) {
            if (MedicineList[i].medicineCount >= quantity) {
                if (quantity * MedicineList[i].medicinePrice <= currentUser.userBalance) {
                    const order = {
                        orderID: 0,
                        medicineID: MedicineList[i].medicineID,
                        userID: currentUser.userID,
                        medicineName: MedicineList[i].medicineName,
                        medicineCount: quantity,
                        orderStatusCancel: "Ordered"
                    };
                    addOrder(order);
                    currentUser.userBalance -= quantity * MedicineList[i].medicinePrice;
                    const user = {
                        userID: currentUser.userID,
                        userName: currentUser.userName,
                        userBalance: currentUser.userBalance,
                        name: currentUser.name,
                        userPassword: currentUser.userPassword,
                        userImage: currentUser.userImage
                    };
                    updateUser(currentUser.userID, user);
                    const medicine = {
                        medicineID: MedicineList[i].medicineID,
                        medicineName: MedicineList[i].medicineName,
                        medicinePrice: MedicineList[i].medicinePrice,
                        medicineCount: MedicineList[i].medicineCount - quantity,
                        medicineExpiry: MedicineList[i].medicineExpiry,
                        medicineImage: MedicineList[i].medicineImage
                    };
                    updateMedicine(MedicineList[i].medicineID, medicine);
                    alert("Purchase successfull");
                    hideAll();
                    return;
                }
                else {
                    alert("Insufficient balance");
                    break;
                }
            }
            alert("Given quantity is more than required quantity");
            break;
        }
    }
}
async function displayMedicineForCancel() {
    const OrderList = await fetchOrders();
    const tableBody = document.querySelector("#cancel-table tbody");
    tableBody.innerHTML = "";
    OrderList.forEach((order) => {
        if (order.userID == currentUser.userID && order.orderStatusCancel == "Ordered") {
            const row = document.createElement("tr");
            row.innerHTML = `
                        <td>${order.medicineName}</td>
                        <td>${order.medicineCount}</td>
                        <td>
                        
                        <input type="button" value="CANCEL" id="cancel-btn" onclick="cancelMedicine('${order.orderID}')">
                        </td>
                        <td id="${order.orderID}">${order.orderStatusCancel}</td>
                    `;
            tableBody.appendChild(row);
        }
    });
}
async function cancelMedicine(id) {
    globalOrderId = id;
    const MedicineList = await fetchMedicines();
    let changeID = id.toString();
    const OrderList = await fetchOrders();
    for (let i = 0; i < OrderList.length; i++) {
        for (let j = 0; j < MedicineList.length; j++) {
            if (OrderList[i].orderID == id && MedicineList[j].medicineID == OrderList[i].medicineID && OrderList[i].orderStatusCancel != "Cancelled") {
                const editOrder = {
                    orderID: globalOrderId,
                    medicineID: OrderList[i].medicineID,
                    userID: OrderList[i].userID,
                    medicineName: OrderList[i].medicineName,
                    medicineCount: OrderList[i].medicineCount,
                    orderStatusCancel: "Cancelled"
                };
                document.getElementById(changeID).innerHTML = "Cancelled";
                updateOrder(globalOrderId, editOrder);
                currentUser.userBalance += MedicineList[i].medicinePrice * OrderList[i].medicineCount;
                const user = {
                    userID: currentUser.userID,
                    userName: currentUser.userName,
                    userBalance: currentUser.userBalance,
                    name: currentUser.name,
                    userPassword: currentUser.userPassword,
                    userImage: currentUser.userImage
                };
                updateUser(currentUser.userID, user);
                const editMedicine = {
                    medicineID: MedicineList[j].medicineID,
                    medicineName: MedicineList[j].medicineName,
                    medicinePrice: MedicineList[j].medicinePrice,
                    medicineCount: MedicineList[j].medicineCount + OrderList[i].medicineCount,
                    medicineExpiry: MedicineList[j].medicineExpiry,
                    medicineImage: MedicineList[j].medicineImage
                };
                updateMedicine(MedicineList[j].medicineID, editMedicine);
            }
        }
    }
}
async function medicineCount(id, medicine) {
    const MedicineList = await fetchMedicines();
    for (let i = 0; i < MedicineList.length; i++) {
        if (id == MedicineList[i].medicineID) {
            MedicineList[i].medicineCount += medicine;
            currentUser.userBalance += MedicineList[i].medicinePrice * medicine;
            const user = {
                userID: currentUser.userID,
                userName: currentUser.userName,
                userBalance: currentUser.userBalance,
                name: currentUser.name,
                userPassword: currentUser.userPassword,
                userImage: currentUser.userImage
            };
            updateUser(currentUser.userID, user);
            break;
        }
    }
}
function displayCancelDetails() {
    hideAll();
    let cancel = document.getElementById("cancel-medicine-content");
    cancel.style.display = "flex";
    displayMedicineForCancel();
}
//Order details
async function displayOrders() {
    const OrderList = await fetchOrders();
    const tableBody = document.querySelector("#order-table tbody");
    tableBody.innerHTML = "";
    OrderList.forEach((order) => {
        if (order.userID == currentUser.userID) {
            const row = document.createElement("tr");
            row.innerHTML = `
                        <td>${order.medicineName}</td>
                        <td>${order.medicineCount}</td>
                        <td>${order.orderStatusCancel}</td>
                    `;
            tableBody.appendChild(row);
        }
    });
}
function displayOrderDetails() {
    hideAll();
    let order = document.getElementById("order-details-content");
    order.style.display = "flex";
    displayOrders();
}
function displayTopUp() {
    hideAll();
    let topUp = document.getElementById("topup-content");
    topUp.style.display = "flex";
}
function rechargeAmount() {
    let amount = document.getElementById("amount-to-recharge").value;
    currentUser.userBalance += parseInt(amount);
    const user = {
        userID: currentUser.userID,
        userName: currentUser.userName,
        userBalance: currentUser.userBalance,
        name: currentUser.name,
        userPassword: currentUser.userPassword,
        userImage: currentUser.userImage
    };
    updateUser(currentUser.userID, user);
    alert("recharge successfull");
    displayMedicineList();
}
function displayShowBalanceDetails() {
    hideAll();
    let showbalance = document.getElementById("show-balance-content");
    showbalance.style.display = "flex";
    let balance = document.getElementById("display-balance");
    balance.value = (currentUser.userBalance).toString();
}
function hideAll() {
    let purchase = document.getElementById("purchase-content");
    let cancel = document.getElementById("cancel-medicine-content");
    let topup = document.getElementById("topup-content");
    let balance = document.getElementById("show-balance-content");
    let order = document.getElementById("order-details-content");
    let medicine = document.getElementById("medicine-details-content");
    let buymedicine = document.getElementById("buy-medicine");
    let buyForm = document.getElementById("edit-form");
    let displayForm = document.getElementById("add-form");
    purchase.style.display = "none";
    cancel.style.display = "none";
    topup.style.display = "none";
    balance.style.display = "none";
    order.style.display = "none";
    medicine.style.display = "none";
    buymedicine.style.display = "none";
    buyForm.style.display = "none";
    displayForm.style.display = "none";
}
async function tableToCSV() {
    // let csv_data: any[]=[];
    // let rows=document.querySelectorAll('#order-table tr');
    // // csv_data=csv_data.concat('\n');
    // csv_data.push('\n');
    // for(let i=0;i<rows.length;i++)
    //     {
    //         let cols=rows[i].querySelectorAll('td,th');
    //         let csvrow=[];
    //         for(let j=0;j<cols.length;j++)
    //             {
    //                 csvrow.push(cols[j].innerHTML);
    //             }
    //         csv_data.push(csvrow.join(","));
    //         csv_data.push('\n');
    //         // csv_data=csv_data.concat('\n');
    //     }
    const OrderList = await fetchOrders();
    const currentUserOrders = OrderList.filter(order => order.userID == currentUser.userID);
    const titleKeys = Object.keys(currentUserOrders[0]);
    const csv_data = [];
    csv_data.push(titleKeys);
    currentUserOrders.forEach((item) => {
        csv_data.push(Object.values(item));
    });
    let csvContent = '';
    csv_data.forEach((item) => {
        csvContent += item.join(',') + '\n';
    });
    downloadCSVFile(csvContent);
}
function downloadCSVFile(csv_data) {
    let CSVFile;
    CSVFile = new Blob([csv_data], {
        type: "text/csv"
    });
    let temp_link = document.createElement('a');
    temp_link.download = "orders.csv";
    let url = window.URL.createObjectURL(CSVFile);
    temp_link.href = url;
    temp_link.style.display = "none";
    document.body.appendChild(temp_link);
    temp_link.click();
    document.body.removeChild(temp_link);
}
async function fetchUsers() {
    const apiUrl = 'http://localhost:5137/api/User';
    const response = await fetch(apiUrl);
    if (!response.ok) {
        throw new Error('Failed to fetch contacts');
    }
    return await response.json();
}
async function fetchMedicines() {
    const apiUrl = 'http://localhost:5137/api/Medicine';
    const response = await fetch(apiUrl);
    if (!response.ok) {
        throw new Error('Failed to fetch contacts');
    }
    return await response.json();
}
async function fetchOrders() {
    const apiUrl = 'http://localhost:5137/api/Order';
    const response = await fetch(apiUrl);
    if (!response.ok) {
        throw new Error('Failed to fetch contacts');
    }
    return await response.json();
}
async function addContact(contact) {
    const response = await fetch('http://localhost:5137/api/User', {
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
async function addMedicine(contact) {
    const response = await fetch('http://localhost:5137/api/Medicine', {
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
async function addOrder(contact) {
    const response = await fetch('http://localhost:5137/api/Order', {
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
async function updateMedicine(id, contact) {
    const response = await fetch(`http://localhost:5137/api/Medicine/${id}`, {
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
async function updateUser(id, contact) {
    const response = await fetch(`http://localhost:5137/api/User/${id}`, {
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
async function updateOrder(id, contact) {
    const response = await fetch(`http://localhost:5137/api/Order/${id}`, {
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
async function deleteMedicine(id) {
    const response = await fetch(`http://localhost:5137/api/Medicine/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        throw new Error('Failed to delete contact');
    }
}

interface Users {
    userID: number,
    name: string,
    userEmail: string,
    userPassword: string,
    userBalance: number,
    userImage: any
}

interface Products {
    productID: number,
    productName: string,
    quantityAvailable: number,
    pricePerQuantity: number,
    productExpiry: Date,
    productImage: any
}

interface Items {
    itemID: number,
    orderID: number,
    productID: number,
    purchaseCount: number,
    purchasePrice: number,
    productName: string
}
let localList: Array<Items> = new Array<Items>;
interface Orders {
    orderID: number,
    userID: number,
    purchaseDate: Date,
    purchaseStatus: string,
    totalPrice: number,
    productNames: string
}

let currentUser: Users;
let localCart = new Array;
let orderIDAutoIncrement = 100;
function displaySignUp() {
    hideAll();
    (document.getElementById("sign-up-form") as HTMLDivElement).style.display = "flex";
}
function displaySignIn() {
    hideAll();
    (document.getElementById("sign-in-form") as HTMLDivElement).style.display = "flex";
}
async function takeToMainMenuBySignUp() {

    let name = (document.getElementById("uname") as HTMLInputElement).value;
    let email = (document.getElementById("sign-up-email-id") as HTMLInputElement).value;
    let password = (document.getElementById("sign-up-password") as HTMLInputElement).value;
    let fileInput = (document.getElementById("file-upload-user") as HTMLInputElement)
    if (!fileInput.files || fileInput.files.length == 0) {
        return;
    }
    let file = fileInput.files[0];
    let data = await ConvertToByteArray(file);
    const newUser: Users = {
        userID: 0,
        name: name,
        userEmail: email,
        userPassword: password,
        userBalance: 200,
        userImage: data
    }
    addUser(newUser);
    takeToMainMenuBySignIn();
}
async function takeToMainMenuBySignIn() {
    hideAll();
    (document.getElementById("sign-in-form") as HTMLDivElement).style.display = "flex";
    let email = (document.getElementById("email-id") as HTMLInputElement).value;
    let password = (document.getElementById("password") as HTMLInputElement).value;
    const userList = await fetchUsers();
    userList.forEach((user) => {
        if (user.userEmail == email && user.userPassword == password) {
            currentUser = user;
            (document.getElementById("welcome-name") as HTMLElement).innerHTML = currentUser.name;
            alert("Login successfull");
            let menu = document.getElementById("menu") as HTMLDListElement;
            let container = document.getElementById("container") as HTMLDListElement;
            container.style.display = "none";
            menu.style.display = "inline";
        }
    })
}
async function displayStockDetails() {
    hideAll();
    (document.getElementById("stock-details-content") as HTMLDivElement).style.display = "flex";

    const tableBody = document.querySelector("#stock-table tbody") as HTMLTableSectionElement;
    const productList = await fetchProducts();
    tableBody.innerHTML = "";
    productList.forEach((product) => {
        if (product.quantityAvailable > 0) {
            const row = document.createElement("tr");
            row.innerHTML = `
                        <td><img src="${'data:image/jpg;base64,' + product.productImage} " class="imagetd"></td>
                        <td>${product.productName}</td>
                        <td>${product.pricePerQuantity}</td>
                        <td>${product.quantityAvailable}</td>
                        <td>${product.productExpiry.toString().split('T')[0].split('-').reverse().join('/')}</td>
                        <td>
                        <input type="button" value="Edit" id="edit-btn" onclick="setMedicineIdNew(${product.productID});">
                        <input type="button" value="Delete" id="delete-btn" onclick="deleteRow(${product.productID});">
                        </td>
                    `;
            tableBody.appendChild(row);
        }
    })
}
let productIDNew: number;
function setMedicineIdNew(id: number) {
    productIDNew = id;
    hideAll();

    let buyForm = document.getElementById("edit-form") as HTMLDivElement;
    buyForm.style.display = "flex";

}
function displayEditForm() {
    editRow(productIDNew);
}
async function editRow(id: number) {
    // const productList=await fetchProducts();
    // productList.forEach((product)=>{
    //     if(product.productID==productIDNew)
    //         {
    //             let name=(document.getElementById("item-name") as HTMLInputElement).value;
    //         }
    // })

    let itemName = (document.getElementById("item-name") as HTMLInputElement).value;
    let itemPrice = (document.getElementById("item-price") as HTMLInputElement).value;
    let itemQuantity = (document.getElementById("item-quantity") as HTMLInputElement).value;
    let itemExpiry = (document.getElementById("item-expiry") as HTMLInputElement).value;
    let fileInput = (document.getElementById("file-upload") as HTMLInputElement);
    if (!fileInput.files || fileInput.files.length == 0) {
        return;
    }
    let file = fileInput.files[0];
    let data = await ConvertToByteArray(file);
    const editProduct: Products = {
        productID: id,
        productName: itemName,
        pricePerQuantity: parseInt(itemPrice),
        quantityAvailable: parseInt(itemQuantity),
        productExpiry: new Date(itemExpiry),
        productImage: data
    };
    updateProduct(productIDNew, editProduct);
    displayStockDetails();

};
function deleteRow(id: number) {
    deleteProduct(id);
    displayStockDetails();
}
function displayAddForm() {
    hideAll();
    (document.getElementById("stock-details-content") as HTMLDivElement).style.display = "flex";
    (document.getElementById("add-form") as HTMLDivElement).style.display = "flex";

}
async function addRow() {
    let name = (document.getElementById("add-stock-name") as HTMLInputElement).value;
    let price = (document.getElementById("add-price") as HTMLInputElement).value;
    let quantity = (document.getElementById("add-quantity") as HTMLInputElement).value;
    let expiryDate = (document.getElementById("add-expiry") as HTMLInputElement).value;
    let fileInput = (document.getElementById("file-upload-add") as HTMLInputElement);
    if (!fileInput.files || fileInput.files.length == 0) {
        return;
    }
    let file = fileInput.files[0];
    let data = await ConvertToByteArray(file);
    const newProduct: Products = {
        productID: 0,
        productName: name,
        quantityAvailable: parseInt(quantity),
        pricePerQuantity: parseInt(price),
        productExpiry: new Date(expiryDate),
        productImage: data
    }
    addProduct(newProduct);
}
async function displayPurchaseDetails() {
    hideAll();
    (document.getElementById("purchase-content-1") as HTMLDivElement).style.display = "grid";
    //const tableBody = document.querySelector("#purchase-table tbody") as HTMLTableSectionElement;
    const productList = await fetchProducts();
    // tableBody.innerHTML = "";
    // productList.forEach((product) => {
    //     if (product.quantityAvailable > 0) {
    //         const row = document.createElement("tr");
    //         row.innerHTML = `
    //                     <td><img src="${'data:image/jpg;base64,' + product.productImage} " class="image"></td>
    //                     <td>${product.productName}</td>
    //                     <td>${product.pricePerQuantity}</td>
    //                     <td>${product.quantityAvailable}</td>
    //                     <td>${product.productExpiry.toString().split('T')[0].split('-').reverse().join('/')}</td>
    //                     <td>
    //                     <input type="button" value="Add To cart" id="add-to-cart-btn" onclick="setProductIdNew(${product.productID});">

    //                     </td>
    //                 `;
    //         tableBody.appendChild(row);
    //     }
    // });
    for (let i = 0; i < productList.length; i++) {
        let image = "imageid-" + productList[i].productID;
        let quantity = "quantity" + productList[i].productID;
        let price = "price" + productList[i].productID;
        let buttoned = "cartButton" + productList[i].productID;
        let named = "name" + productList[i].productID;
        (document.getElementById(image) as HTMLImageElement).src = 'data:image/jpg;base64,' + productList[i].productImage;
        (document.getElementById(quantity) as HTMLElement).innerHTML = productList[i].quantityAvailable.toString();
        (document.getElementById(price) as HTMLElement).innerHTML = productList[i].pricePerQuantity.toString();
        (document.getElementById(buttoned) as HTMLButtonElement).id = (productList[i].productID).toString();
        (document.getElementById(named) as HTMLButtonElement).innerHTML = productList[i].productName;

    }



}

let globalProductID: number;
let globalOrderID: number;
let orderCreated: boolean;
orderCreated = false;
async function setProductIdNew(id: number) {
    const orderList = await fetchOrders();
    if (orderCreated == false) {
        const newOrder: Orders = {
            orderID: orderList[(orderList.length) - 1].orderID + 1,
            userID: currentUser.userID,
            purchaseDate: new Date(),
            purchaseStatus: "Initiated",
            totalPrice: 0,
            productNames: ""
        }
        orderCreated = true;
        globalProductID = id;
        globalOrderID = newOrder.orderID;
        addOrder(newOrder);
    }

    globalProductID = id;
    hideAll();

    (document.getElementById("buy-product") as HTMLDivElement).style.display = "flex";

}
let itemID = 0;
async function getQuantity() {
    hideAll();
    let quantity = (document.getElementById("quantity") as HTMLInputElement).value;
    let productList = await fetchProducts();
    productList.forEach((product) => {
        if (product.productID == globalProductID) {
            if(parseInt(quantity)>product.quantityAvailable)
                {
                    alert("Entered quantity is more than available quantity");
                    return ;
                }
            const newItem: Items = {
                itemID: 0,
                orderID: globalOrderID,
                productID: product.productID,
                purchaseCount: parseInt(quantity),
                purchasePrice: product.pricePerQuantity * parseInt(quantity),
                productName: product.productName
            }
            addItem(newItem);
            localCart.push([(itemID++).toString(), product.productName, quantity.toString(), (product.pricePerQuantity * parseInt(quantity)).toString()])
            product.quantityAvailable -= parseInt(quantity);
            const editedProduct: Products = {
                productID: product.productID,
                productName: product.productName,
                quantityAvailable: product.quantityAvailable,
                pricePerQuantity: product.pricePerQuantity,
                productExpiry: product.productExpiry,
                productImage: product.productImage
            }
            updateProduct(product.productID, editedProduct);
            alert("Item added to cart");
            return;
        }
    })

}

async function displayCartDetails() {
    hideAll();
    (document.getElementById("cart-content") as HTMLDivElement).style.display = "flex";
    const tableBody = document.querySelector("#cart-table tbody") as HTMLTableSectionElement;
    tableBody.innerHTML = "";
    for (let i = 0; i < localCart.length; i++) {
        if (localCart[i].length != 0) {
            const row = document.createElement("tr");
            row.innerHTML = `
                        
                        <td>${localCart[i][1]}</td>
                        <td>${localCart[i][2]}</td>
                        <td>${localCart[i][3]}</td>
                        
                        <td>
                        <input type="button" value="Delete" id="delete-btn" onclick="deleteCartItem(${localCart[i][0]});">
                        
                        </td>
                    `;
            tableBody.appendChild(row);
        }


    }

};
function deleteCartItem(id: number) {
    for (let i = 0; i < localCart.length; i++) {
        if (id == parseInt(localCart[i][0])) {
            localCart[i] = [];
        }
    }
    deleteItem(id);
}
let names="";
async function buyProducts() {
    let totalPrice = 0;
    
    for (let i = 0; i < localCart.length; i++) {
        if (localCart[i].length != 0) {
            totalPrice += parseInt(localCart[i][3]);
        }
    }
    if (totalPrice <= currentUser.userBalance) {
        alert("Buy successfull");
        const userList = await fetchUsers();
        let itemList = await fetchItems();
        const orderList = await fetchOrders();
        itemList.forEach((item) => {
            if(item.orderID==globalOrderID)
                {
                    names += item.productName + ",";

                }
            
        })
        orderList.forEach((order) => {
            if (order.orderID == globalOrderID) {
                //order.items.push(localCart);
                order.purchaseStatus = "Ordered";
                order.totalPrice = totalPrice;
                const editedOrder: Orders = {
                    orderID: order.orderID,
                    userID: currentUser.userID,
                    purchaseDate: order.purchaseDate,
                    purchaseStatus: order.purchaseStatus,
                    totalPrice: order.totalPrice,
                    productNames: names
                }
                updateOrder(order.orderID, editedOrder);
                names="";
                currentUser.userBalance -= totalPrice;
                const editedUser: Users = {
                    userID: currentUser.userID,
                    name: currentUser.name,
                    userEmail: currentUser.userEmail,
                    userPassword: currentUser.userPassword,
                    userBalance: currentUser.userBalance,
                    userImage: currentUser.userImage
                }
                itemList=[]
            }
        })
        return;
    }
    alert("You don't have enough balance please recharge with Rs: " + totalPrice);
}
function displayTopUp() {
    hideAll();
    (document.getElementById("topup-content") as HTMLDivElement).style.display = "flex";

}
function rechargeAmount() {
    hideAll();
    currentUser.userBalance += parseInt((document.getElementById("amount-to-recharge") as HTMLInputElement).value);
    const updatedUser: Users = {
        userID: currentUser.userID,
        name: currentUser.name,
        userEmail: currentUser.userEmail,
        userPassword: currentUser.userPassword,
        userBalance: currentUser.userBalance,
        userImage: currentUser.userImage
    }
    updateUser(currentUser.userID, updatedUser);
}
function displayShowBalanceDetails() {
    hideAll();
    (document.getElementById("show-balance-content") as HTMLDivElement).style.display = "flex";
    (document.getElementById("display-balance") as HTMLInputElement).value = currentUser.userBalance.toString();
}
async function displayOrderDetails() {
    hideAll();
    (document.getElementById("order-details-content") as HTMLDivElement).style.display = "flex";
    let tableBody = document.querySelector("#order-table tbody") as HTMLTableSectionElement;
    tableBody.innerHTML = "";
    const orderList = await fetchOrders();
    const itemList = await fetchItems();
    orderList.forEach((order) => {
        
            if (order.userID == currentUser.userID) {
                const row = document.createElement("tr");
                row.innerHTML = `
                                    <td>${order.orderID}</td>
                                    <td>${order.productNames}</td>
                                    <td>${order.purchaseDate.toString().split('T')[0].split('-').reverse().join('/')}</td>
                                    <td>${order.totalPrice}</td>
                                    <td>
                                        <input type="button" value="Print Bill" onclick="tableToCSV(${order.orderID});"
                                    </td>
        
                                `;
                tableBody.appendChild(row);
            }
        })

}

async function displayOrderDetailsTable() {
    hideAll();
    (document.getElementById("order-details-content") as HTMLDivElement).style.display="block";
    let store=(document.getElementById("order-details-content") as HTMLDivElement)
    const OrderList = await fetchOrders();
    const itemList=await fetchItems();
    
    OrderList.forEach((order)=>{
        if(order.purchaseStatus=="Ordered" && currentUser.userID==order.userID )
            {
                const showOrder=document.createElement("div");
                showOrder.innerHTML="";
                showOrder.innerHTML=`
                    Name: ${currentUser.name} &nbsp;&nbsp;&nbsp;Total Price: ${order.totalPrice}&nbsp;&nbsp;&nbsp;Purchase Date: ${order.purchaseDate.toString().split('T')[0].split('-').reverse().join('/')}&nbsp;&nbsp;&nbsp;<input type="button" value="Export Data" id="export-btn" onclick="tableToCSV(${order.orderID});">
                `;
                let inTable=document.createElement("table");
                inTable.innerHTML="";
                inTable.innerHTML=`
                    <thead>
                        <th>Product Name</th>
                        <th>Product Quantity</th>
                        <th>Product Price</th>
                    </thead>
                    <tbody id="order-table">
                `
                itemList.forEach((item)=>{
                    if(item.orderID==order.orderID)
                        {
                            inTable.innerHTML+=`
                                <td>${item.productName}</td>
                                <td>${item.purchaseCount}</td>
                                <td>${item.purchasePrice}</td>
                            `
                        }
                })
                showOrder.appendChild(inTable);
                store.appendChild(showOrder);
                
            }
    })
}
async function tableToCSV(id:number) {
    const OrderList = await fetchItems();
    let newOrderList=OrderList.filter(order=>order.orderID==id)
    const titleKeys = Object.keys(newOrderList[0]);
    const csv_data = [];
    csv_data.push(titleKeys);
    let totalPrice=0;
    newOrderList.forEach((item) => {
        csv_data.push(Object.values(item))
        totalPrice+=item.purchasePrice;
    })
    let csvContent = '';
    csv_data.forEach((item) => {
        csvContent += item.join(',') + '\n';
    })
    csvContent+="Total Price"+ totalPrice;
    downloadCSVFile(csvContent);
}

function downloadCSVFile(csv_data: any) {
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
function hideAll() {
    (document.getElementById("sign-up-form") as HTMLDivElement).style.display = "none";
    (document.getElementById("sign-in-form") as HTMLDivElement).style.display = "none";
    (document.getElementById("topup-content") as HTMLDivElement).style.display = "none";
    (document.getElementById("show-balance-content") as HTMLDivElement).style.display = "none";
    (document.getElementById("stock-details-content") as HTMLDivElement).style.display = "none";
    (document.getElementById("add-form") as HTMLDivElement).style.display = "none";
    (document.getElementById("purchase-content-1") as HTMLDivElement).style.display = "none";
    (document.getElementById("buy-product") as HTMLDivElement).style.display = "none";
    (document.getElementById("cart-content") as HTMLDivElement).style.display = "none";
    //(document.getElementById("menu-content") as HTMLDivElement).style.display = "none";
    (document.getElementById("edit-form") as HTMLDivElement).style.display = "none";
    (document.getElementById("order-details-content") as HTMLDivElement).style.display = "none";
}
function ConvertToByteArray(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = () => {
            let buffer = reader.result as string;
            let data = buffer.split(",")[1];
            resolve(data);
        }
        reader.onerror = () => {
            reject(new Error("Failed to read file"));
        };
        reader.readAsDataURL(file)
    });
}

async function fetchUsers(): Promise<Users[]> {
    const apiUrl = 'http://localhost:5074/api/User';
    const response = await fetch(apiUrl);
    if (!response.ok) {
        throw new Error('Failed to fetch User');
    }
    return await response.json();
}

async function fetchProducts(): Promise<Products[]> {
    const apiUrl = 'http://localhost:5074/api/Product';
    const response = await fetch(apiUrl);
    if (!response.ok) {
        throw new Error('Failed to fetch Product');
    }
    return await response.json();
}
async function fetchItems(): Promise<Items[]> {
    const apiUrl = 'http://localhost:5074/api/Item';
    const response = await fetch(apiUrl);
    if (!response.ok) {
        throw new Error('Failed to fetch Items');
    }
    return await response.json();
}

async function fetchOrders(): Promise<Orders[]> {
    const apiUrl = 'http://localhost:5074/api/Order';
    const response = await fetch(apiUrl);
    if (!response.ok) {
        throw new Error('Failed to fetch Order');
    }
    return await response.json();
}

async function addUser(contact: Users): Promise<void> {
    const response = await fetch('http://localhost:5074/api/User', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(contact)
    });
    if (!response.ok) {
        throw new Error('Failed to add User');
    }
}

async function addProduct(contact: Products): Promise<void> {
    const response = await fetch('http://localhost:5074/api/Product', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(contact)
    });
    if (!response.ok) {
        throw new Error('Failed to add Product');
    }
}
async function addItem(contact: Items): Promise<void> {
    const response = await fetch('http://localhost:5074/api/Item', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(contact)
    });
    if (!response.ok) {
        throw new Error('Failed to add Item');
    }
}
async function addOrder(contact: Orders): Promise<void> {
    const response = await fetch('http://localhost:5074/api/Order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(contact)
    });
    if (!response.ok) {
        throw new Error('Failed to add Order');
    }
}
async function updateUser(id: number, contact: Users): Promise<void> {
    const response = await fetch(`http://localhost:5074/api/User/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(contact)
    });
    if (!response.ok) {
        throw new Error('Failed to update User');
    }

}
async function updateItem(id: number, contact: Items): Promise<void> {
    const response = await fetch(`http://localhost:5074/api/Item/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(contact)
    });
    if (!response.ok) {
        throw new Error('Failed to update Item');
    }

}
async function updateOrder(id: number, contact: Orders): Promise<void> {
    const response = await fetch(`http://localhost:5074/api/Order/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(contact)
    });
    if (!response.ok) {
        throw new Error('Failed to update Order');
    }

}
async function updateProduct(id: number, contact: Products): Promise<void> {
    const response = await fetch(`http://localhost:5074/api/Product/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(contact)
    });
    if (!response.ok) {
        throw new Error('Failed to update Product');
    }

}

async function deleteProduct(id: number): Promise<void> {
    const response = await fetch(`http://localhost:5074/api/Product/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        throw new Error('Failed to delete Product');
    }
}

async function deleteItem(id: number): Promise<void> {
    const response = await fetch(`http://localhost:5074/api/Item/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        throw new Error('Failed to delete Item');
    }
}
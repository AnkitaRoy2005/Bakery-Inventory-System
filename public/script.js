const BASE_URL = "http://localhost:5000";

// Load Data

window.onload = () => {

    loadProducts();
    loadGodown();

}

// ----------------------------
// Add Product
// ----------------------------

function showStatus(message, isError = false){
    const status = document.getElementById("status");
    status.textContent = message;
    status.style.color = isError ? "#b91c1c" : "#166534";
}

async function request(url, options){
    const response = await fetch(url, options);
    const data = await response.json().catch(() => ({}));

    if(!response.ok) throw new Error(data.message || "Something went wrong. Please try again.");

    return data;
}

async function addProduct(){

    const itemName=document.getElementById("name").value;

    const category=document.getElementById("category").value;

    const price=document.getElementById("price").value;

    if(!itemName.trim() || !category.trim() || price === "" || Number(price) < 0){
        showStatus("Enter a name, category, and a valid price.", true);
        return;
    }

    const data={

        itemName: itemName.trim(),
        category: category.trim(),
        price: Number(price),
        shopStock:0

    };

    try {
        await request(BASE_URL+"/products/add",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify(data)

        });

        document.getElementById("name").value = "";
        document.getElementById("category").value = "";
        document.getElementById("price").value = "";
        showStatus("Product added successfully.");
        loadProducts();
    } catch(error) {
        showStatus(error.message, true);
    }

}

// ----------------------------
// Load Products
// ----------------------------

async function loadProducts(){

    const res=await fetch(BASE_URL+"/products");

    const products=await res.json();

    let output="";

    products.forEach(product=>{

        output+=`

        <div class="card">

        <h3>${product.itemName}</h3>

        <p>Category : ${product.category}</p>

        <p>Price : ₹${product.price}</p>

        <p>Shop Stock :
        ${product.shopStock}

        ${product.shopStock<5 ? "<span class='low'>⚠ Low Stock</span>" : ""}

        </p>

        <button onclick="sellProduct('${product._id}')">
        Sell
        </button>

        <button onclick="updateStock('${product._id}')">
        Update
        </button>

        <button onclick="deleteProduct('${product._id}')">
        Delete
        </button>

        </div>

        `;

    });

    document.getElementById("productList").innerHTML=output;

}

// ----------------------------
// Delete
// ----------------------------

async function deleteProduct(id){

    await fetch(BASE_URL+"/products/delete/"+id,{

        method:"DELETE"

    });

    loadProducts();

}

// ----------------------------
// Sell Product
// ----------------------------

async function sellProduct(id){

    await fetch(BASE_URL+"/products/sell/"+id,{

        method:"POST"

    });

    loadProducts();

}

// ----------------------------
// Update Stock
// ----------------------------

async function updateStock(id){

    const stock=prompt("Enter New Shop Stock");

    await fetch(BASE_URL+"/products/update/"+id,{

        method:"PUT",

        headers:{

            "Content-Type":"application/json"

        },

        body:JSON.stringify({

            shopStock:Number(stock)

        })

    });

    loadProducts();

}

// ----------------------------
// Load Godown
// ----------------------------

async function loadGodown(){

    const res=await fetch(BASE_URL+"/godown");

    const items=await res.json();

    let output="";

    items.forEach(item=>{

        output+=`

        <div class="card">

        <h3>${item.itemName}</h3>

        <p>Quantity : ${item.quantity}</p>

        </div>

        `;

    });

    document.getElementById("godownList").innerHTML=output;
    document.getElementById("godownItems").innerHTML = items
        .map(item => `<option value="${item.itemName}"></option>`)
        .join("");

}

// ----------------------------
// Add Godown Stock
// ----------------------------

async function addGodownStock(){

    const itemName = document.getElementById("godownItem").value;
    const quantity = document.getElementById("godownQty").value;

    if(!itemName.trim() || !Number.isInteger(Number(quantity)) || Number(quantity) <= 0){
        showStatus("Enter a product name and a whole quantity greater than zero.", true);
        return;
    }

    try {
        await request(BASE_URL+"/godown/add",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({itemName: itemName.trim(), quantity:Number(quantity)})
        });

        document.getElementById("godownItem").value = "";
        document.getElementById("godownQty").value = "";
        showStatus("Godown stock added successfully.");
        loadGodown();
    } catch(error) {
        showStatus(error.message, true);
    }

}

// ----------------------------
// Transfer Stock
// ----------------------------

async function transferStock(){

    const itemName=document.getElementById("transferItem").value;

    const quantity=document.getElementById("transferQty").value;

    if(!itemName.trim() || !Number.isInteger(Number(quantity)) || Number(quantity) <= 0){
        showStatus("Enter an item name and a whole quantity greater than zero.", true);
        return;
    }

    try {
        await request(BASE_URL+"/godown/transfer",{

            method:"POST",

            headers:{

                "Content-Type":"application/json"

            },

            body:JSON.stringify({

                itemName: itemName.trim(),
                quantity:Number(quantity)

            })

        });

        document.getElementById("transferItem").value = "";
        document.getElementById("transferQty").value = "";
        showStatus("Stock transferred successfully.");
        loadGodown();
        loadProducts();
    } catch(error) {
        showStatus(error.message, true);
    }

}

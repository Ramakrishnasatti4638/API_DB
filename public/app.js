// Product data
const products = [
    { id: 1, name: 'Wireless Headphones', price: 79.99, emoji: '🎧' },
    { id: 2, name: 'Smart Watch', price: 199.99, emoji: '⌚' },
    { id: 3, name: 'Laptop Stand', price: 49.99, emoji: '💻' },
    { id: 4, name: 'Mechanical Keyboard', price: 129.99, emoji: '⌨️' },
    { id: 5, name: 'Portable Charger', price: 34.99, emoji: '🔋' },
    { id: 6, name: 'Wireless Mouse', price: 39.99, emoji: '🖱️' }
];

// Cart state
let cart = [];

// DOM elements
const productsGrid = document.getElementById('products-grid');
const cartSidebar = document.getElementById('cart-sidebar');
const cartItems = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');
const cartToggle = document.getElementById('cart-toggle');
const closeCart = document.getElementById('close-cart');
const overlay = document.getElementById('overlay');

// Render products
function renderProducts() {
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">${product.emoji}</div>
            <h3>${product.name}</h3>
            <div class="product-price">$${product.price.toFixed(2)}</div>
            <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                Add to Cart
            </button>
        </div>
    `).join('');
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCart();
    openCart();
}

// Update quantity
function updateQuantity(productId, delta) {
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity += delta;
        
        if (item.quantity <= 0) {
            cart = cart.filter(item => item.id !== productId);
        }
    }
    
    updateCart();
}

// Update cart display
function updateCart() {
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart items
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-header">
                    <h4>${item.name}</h4>
                    <span class="cart-item-price">$${item.price.toFixed(2)}</span>
                </div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
        `).join('');
    }
    
    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `$${total.toFixed(2)}`;
}

// Open cart
function openCart() {
    cartSidebar.classList.add('active');
    overlay.classList.add('active');
}

// Close cart
function closeCartSidebar() {
    cartSidebar.classList.remove('active');
    overlay.classList.remove('active');
}

// Event listeners
cartToggle.addEventListener('click', openCart);
closeCart.addEventListener('click', closeCartSidebar);
overlay.addEventListener('click', closeCartSidebar);

// Initialize
renderProducts();
updateCart();

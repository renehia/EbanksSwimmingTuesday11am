// Product data
const products = [
    {
        id: 1,
        name: "Beginner Swimming Lessons",
        price: 50.00,
        description: "Perfect for those new to swimming. Learn basic strokes and water safety.",
        image: "../Assets/0626eb826b30f7de3fa29245b38abcba.jpg"
    },
    {
        id: 2,
        name: "Intermediate Swimming Lessons",
        price: 65.00,
        description: "Improve your technique and learn advanced strokes.",
        image: "../Assets/4f5b436f3fd86249fdcc91e372b1c4c0.jpg"
    },
    {
        id: 3,
        name: "Advanced Swimming Lessons",
        price: 80.00,
        description: "Master competitive techniques and refine your skills.",
        image: "../Assets/6a1a9d2d33f7106184e876f7430a5614.jpg"
    },
    {
        id: 4,
        name: "Children's Swimming Lessons",
        price: 45.00,
        description: "Fun and safe swimming lessons designed for children ages 5-12.",
        image: "../Assets/8931c99f8123b7b9c426b316759bdbd6.jpg"
    },
    {
        id: 5,
        name: "Adult Swimming Lessons",
        price: 55.00,
        description: "Tailored lessons for adults of all skill levels.",
        image: "../Assets/ca292b88d816ced2b2bd52b56cacbf19.jpg"
    },
    {
        id: 6,
        name: "Private One-on-One Lessons",
        price: 100.00,
        description: "Personalized instruction with individual attention.",
        image: "../Assets/0626eb826b30f7de3fa29245b38abcba.jpg"
    }
];

function initializeProducts() {
    let storedProducts = localStorage.getItem('AllProducts');
    
    if (!storedProducts) {
        // First time - store the default products
        localStorage.setItem('AllProducts', JSON.stringify(products));
        return products;
    } else {
        // Already stored - retrieve them
        return JSON.parse(storedProducts);
    }
}

// Get products from localStorage (or use default) - stored as AllProducts
let allProducts = initializeProducts();

// When you UPDATE products, save them back to AllProducts:
function updateAllProducts(newProductList) {
    localStorage.setItem('AllProducts', JSON.stringify(newProductList));
}

// Cart storage in localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize cart count
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Load products on products page
function loadProducts() {
    const productsContainer = document.getElementById('products-container');
    if (!productsContainer) return;

    productsContainer.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px 8px 0 0;">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <button class="btn-primary add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        `;
        productsContainer.appendChild(productCard);
    });

    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            addToCart(productId);
        });
    });
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert(`${product.name} added to cart!`);
}

// Load cart items on cart page
function loadCart() {
    const cartItems = document.getElementById('cart-items');
    if (!cartItems) return;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty. <a href="products.html">Browse lessons</a></p>';
        updateCartSummary();
        return;
    }

    cartItems.innerHTML = '';
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>Price: $${item.price.toFixed(2)}</p>
            </div>
            <div class="cart-item-controls">
                <div class="quantity-control">
                    <button class="decrease-qty" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="increase-qty" data-id="${item.id}">+</button>
                </div>
                <div>
                    <p>Subtotal: $${(item.price * item.quantity).toFixed(2)}</p>
                    <button class="remove-item" data-id="${item.id}">Remove</button>
                </div>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });

    document.querySelectorAll('.increase-qty').forEach(button => {
        button.addEventListener('click', function() {
            updateQuantity(parseInt(this.getAttribute('data-id')), 1);
        });
    });

    document.querySelectorAll('.decrease-qty').forEach(button => {
        button.addEventListener('click', function() {
            updateQuantity(parseInt(this.getAttribute('data-id')), -1);
        });
    });

    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            removeFromCart(parseInt(this.getAttribute('data-id')));
        });
    });

    updateCartSummary();
}

// Update quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCart();
        updateCartCount();
    }
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
    updateCartCount();
}

// Calculate cart summary
function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = subtotal * 0.10;
    const afterDiscount = subtotal - discount;
    const tax = afterDiscount * 0.15;
    const total = afterDiscount + tax;

    // Update DOM
    const subtotalEl = document.getElementById('subtotal');
    const discountEl = document.getElementById('discount');
    const taxEl = document.getElementById('tax');
    const totalEl = document.getElementById('total');

    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (discountEl) discountEl.textContent = `$${discount.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
}

// Clear all items from cart
function clearCart() {
    if (confirm('Are you sure you want to clear all items from your cart?')) {
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCart();
        updateCartCount();
    }
}

// Load checkout page
function loadCheckout() {
    const checkoutItems = document.getElementById('checkout-items');
    const checkoutSubtotal = document.getElementById('checkout-subtotal');
    const checkoutDiscount = document.getElementById('checkout-discount');
    const checkoutTax = document.getElementById('checkout-tax');
    const checkoutTotal = document.getElementById('checkout-total');

    if (!checkoutItems) return;

    if (cart.length === 0) {
        window.location.href = 'products.html';
        return;
    }

    checkoutItems.innerHTML = '';
    cart.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'summary-row';
        itemDiv.innerHTML = `
            <span>${item.name} x${item.quantity}</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
        `;
        checkoutItems.appendChild(itemDiv);
    });

    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = subtotal * 0.10;
    const afterDiscount = subtotal - discount;
    const tax = afterDiscount * 0.15;
    const total = afterDiscount + tax;

    if (checkoutSubtotal) checkoutSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    if (checkoutDiscount) checkoutDiscount.textContent = `$${discount.toFixed(2)}`;
    if (checkoutTax) checkoutTax.textContent = `$${tax.toFixed(2)}`;
    if (checkoutTotal) checkoutTotal.textContent = `$${total.toFixed(2)}`;

    // Set payment amount field to total
    const paymentAmount = document.getElementById('payment-amount');
    if (paymentAmount) {
        paymentAmount.value = total.toFixed(2);
    }
}
//b. Login Page: 

// iii. Track login attempts
let loginAttempts = 0;
const maxAttempts = 3;
// i. Login form validation
function validateLoginForm() {
    const trn= document.getElementById('trn').value.trim();
    const password = document.getElementById('password').value;
    let isValid = true;

    // Clear previous errors
    document.getElementById('trn-error').textContent = '';
    document.getElementById('password-error').textContent = '';

    // ii. Validate TRN
    if (trn === '') {
        document.getElementById('trn-error').textContent = 'TRN is required';
        isValid = false;
    }

    // ii. Validate password
    if (password === '') {
        document.getElementById('password-error').textContent = 'Password is required';
        isValid = false;
    } else if (password.length < 8) {
        document.getElementById('password-error').textContent = 'Password must be at least 8 characters';
        isValid = false;
    }

    return isValid;
}

//Handle Login
function handleLogin(e) {
    e.preventDefault();
    if(!validateLoginForm()) return;

    const trn = document.getElementById('trn').value.trim();
    const password = document.getElementById('password').value;

    //Registered Users
    const users = JSON.parse(localStorage.getItem('RegistrationData')) || [];

    //Check credentials
    const user = users.find(u => u.trn === trn && u.password === password);

    if (user) {
        alert('Login successful!');
        window.location.href = 'products.html'; // Redirects user to product catalog
    } else {
        loginAttempts++;
        if (loginAttempts >= maxAttempts) {
            alert('Account locked! Too many failed attempts.');
            window.location.href = 'error.html'; // Redirects user to error page
        } else {
            alert(`Invalid TRN or Password. Attempts left: ${maxAttempts - loginAttempts}`);
        }
    }
}

// Clear form
function handleCancel() {
    document.getElementById('login-form').reset();
    document.getElementById('trn-error').textContent = '';
    document.getElementById('password-error').textContent = '';
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const cancelBtn = document.getElementById('cancel-btn');

    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    if (cancelBtn) cancelBtn.addEventListener('click', handleCancel);
});

// Handle password-reset
function handlePasswordReset(e) {
    e.preventDefault();

    // Clear previous errors
    document.getElementById('reset-trn-error').textContent = '';
    document.getElementById('new-password-error').textContent = '';
    document.getElementById('confirm-new-password-error').textContent = '';

    const trn = document.getElementById('reset-trn').value.trim();
    const newPassword = document.getElementById('new-password').value.trim();
    const confirmNewPassword = document.getElementById('confirm-new-password').value.trim();
    let isValid = true;

    if (trn === '') {
        document.getElementById('reset-trn-error').textContent = 'TRN is required';
        isValid = false;
    }

    if (newPassword === '') {
        document.getElementById('new-password-error').textContent = 'New password is required';
        isValid = false;
    } else if (newPassword.length < 8) {
        document.getElementById('new-password-error').textContent = 'Password must be at least 8 characters';
        isValid = false;
    }

    if (confirmNewPassword === '') {
        document.getElementById('confirm-new-password-error').textContent = 'Please confirm password';
        isValid = false;
    } else if (newPassword !== confirmNewPassword) {
        document.getElementById('confirm-new-password-error').textContent = 'Passwords do not match';
        isValid = false;
    }

    if (!isValid) return;

    // Load registered users
    const users = JSON.parse(localStorage.getItem('RegistrationData')) || [];
    const userIndex = users.findIndex(u => u.trn === trn);

    if (userIndex === -1) {
        document.getElementById('reset-trn-error').textContent = 'TRN not found';
        return;
    }

    // Update password
    users[userIndex].password = newPassword;
    localStorage.setItem('RegistrationData', JSON.stringify(users));

    alert('Password reset successful! Please login with your new password.');
    document.getElementById('reset-password-form').reset();
    window.location.href = 'login.html';
}

// Cancel button
function handleResetCancel() {
    document.getElementById('reset-password-form').reset();
    document.getElementById('reset-trn-error').textContent = '';
    document.getElementById('new-password-error').textContent = '';
    document.getElementById('confirm-new-password-error').textContent = '';
}

// Event listener
document.addEventListener('DOMContentLoaded', () => {
    const resetForm = document.getElementById('reset-password-form');
    const cancelBtn = document.getElementById('cancel-reset-btn');

    if (resetForm) resetForm.addEventListener('submit', handlePasswordReset);
    if (cancelBtn) cancelBtn.addEventListener('click', handleResetCancel);
});

//Question #1 a.
// Validate registration form
function validateRegistrationForm() {
    let isValid = true;

    // Clear previous errors
    document.getElementById('reg-first-name-error').textContent = '';
    document.getElementById('reg-last-name-error').textContent = '';
    document.getElementById('reg-dob-error').textContent = '';
    document.getElementById('reg-gender-error').textContent = '';
    document.getElementById('reg-phone-error').textContent = '';
    document.getElementById('reg-email-error').textContent = '';
    document.getElementById('reg-trn-error').textContent = '';
    document.getElementById('reg-password-error').textContent = '';
    document.getElementById('reg-confirm-password-error').textContent = '';

    // i. Get field values
    let firstName = document.getElementById('reg-first-name').value.trim();
    let lastName = document.getElementById('reg-last-name').value.trim();
    let dob = document.getElementById('reg-dob').value;
    let gender = document.getElementById('reg-gender').value;
    let phone = document.getElementById('reg-phone').value.trim();
    let email = document.getElementById('reg-email').value.trim();
    let trn = document.getElementById('reg-trn').value.trim();
    let password = document.getElementById('reg-password').value.trim();
    let confirmPassword = document.getElementById('reg-confirm-password').value.trim();

    // ii. Required field checks
    if (firstName === '') {
        document.getElementById('reg-first-name-error').textContent = 'First name is required';
        isValid = false;
    }
    if (lastName === '') {
        document.getElementById('reg-last-name-error').textContent = 'Last name is required';
        isValid = false;
    }
    if (dob === '') {
        document.getElementById('reg-dob-error').textContent = 'Date of birth is required';
        isValid = false;
    }
    if (gender === '') {
        document.getElementById('reg-gender-error').textContent = 'Gender is required';
        isValid = false;
    }
    if (phone === '') {
        document.getElementById('reg-phone-error').textContent = 'Phone number is required';
        isValid = false;
    }
    if (email === '') {
        document.getElementById('reg-email-error').textContent = 'Email is required';
        isValid = false;
    }
    if (trn === '') {
        document.getElementById('reg-trn-error').textContent = 'TRN is required';
        isValid = false;
    }
    if (password === '') {
        document.getElementById('reg-password-error').textContent = 'Password is required';
        isValid = false;
    }
    if (confirmPassword === '') {
        document.getElementById('reg-confirm-password-error').textContent = 'Please confirm password';
        isValid = false;
    }
    if (!isValid) return false 

    // iv. Age validation (must be 18+)
    let birthDate = new Date(dob);
    let today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    let monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    if (age < 18) {
        document.getElementById('reg-dob-error').textContent = 'You must be at least 18 years old';
        return false;
    }

    // Email format validation
    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        document.getElementById('reg-email-error').textContent = 'Invalid email format';
        isValid = false;
    }

    // Phone validation 
    if (!/^\d{10}$/.test(phone)) {
        document.getElementById('reg-phone-error').textContent = 'Phone must be 10 digits';
        isValid = false;
    }

    // v. TRN validation
    let trnPattern = /^\d{3}-\d{3}-\d{3}$/;
    if (!trnPattern.test(trn)) {
        document.getElementById('reg-trn-error').textContent = 'TRN must be in 000-000-000 format';
        isValid = false;
    }

    // iii. Password rules
    if (password.length < 8) {
        document.getElementById('reg-password-error').textContent = 'Password must be at least 8 characters';
        isValid = false;
    }

    // Confirm password
    if (password !== confirmPassword) {
        document.getElementById('reg-confirm-password-error').textContent = 'Passwords do not match';
        isValid = false;
    }

    if (!isValid) return false;

    // Load existing users
    let existingUsers = JSON.parse(localStorage.getItem('RegistrationData')) || [];

    // Check TRN uniqueness
    if (existingUsers.some(user => user.trn === trn)) {
        document.getElementById('reg-trn-error').textContent = 'TRN already registered';
        return false;
    }

    // Check email uniqueness
    if (existingUsers.some(user => user.email === email)) {
        document.getElementById('reg-email-error').textContent = 'Email already registered';
        return false;
    }

    
    let newUser = {
        firstName: firstName,
        lastName: lastName,
        dob: dob,
        gender: gender,
        phone: phone,
        email: email,
        trn: trn,
        password: password,
        dateRegistered: new Date().toISOString(),
        cart: [],
        invoices: []
    };

    // vi. Save user
    existingUsers.push(newUser);
    localStorage.setItem('RegistrationData', JSON.stringify(existingUsers));

    alert('Registration successful!');
    document.getElementById('registration-form').reset();

    return false;
}


// Validate checkout form
function validateCheckoutForm() {
    const shipName = document.getElementById('ship-name').value.trim();
    const shipAddress = document.getElementById('ship-address').value.trim();
    const shipCity = document.getElementById('ship-city').value.trim();
    const shipPhone = document.getElementById('ship-phone').value.trim();
    const paymentAmount = parseFloat(document.getElementById('payment-amount').value);
    let isValid = true;

    // Clear previous errors
    const errorElements = ['ship-name-error', 'ship-address-error', 'ship-city-error', 'ship-phone-error', 'payment-amount-error'];
    errorElements.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = '';
    });

    // Validate shipping name
    if (shipName === '') {
        document.getElementById('ship-name-error').textContent = 'Name is required';
        isValid = false;
    }

    // Validate address
    if (shipAddress === '') {
        document.getElementById('ship-address-error').textContent = 'Address is required';
        isValid = false;
    }

    // Validate city
    if (shipCity === '') {
        document.getElementById('ship-city-error').textContent = 'City is required';
        isValid = false;
    }

    // Validate phone
    if (shipPhone === '') {
        document.getElementById('ship-phone-error').textContent = 'Phone number is required';
        isValid = false;
    }

    // Calculate expected total
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = subtotal * 0.10;
    const afterDiscount = subtotal - discount;
    const tax = afterDiscount * 0.15;
    const expectedTotal = afterDiscount + tax;

    // Validate payment amount
    if (isNaN(paymentAmount) || paymentAmount <= 0) {
        document.getElementById('payment-amount-error').textContent = 'Please enter a valid payment amount';
        isValid = false;
    } else if (Math.abs(paymentAmount - expectedTotal) > 0.01) {
        document.getElementById('payment-amount-error').textContent = `Payment amount must match total: $${expectedTotal.toFixed(2)}`;
        isValid = false;
    }

    return isValid;
}

// Load featured lessons on homepage
function loadFeaturedLessons() {
    const featuredContainer = document.getElementById('featured-lessons');
    if (!featuredContainer) return;

    const featuredProducts = products.slice(0, 4);
    
    featuredContainer.innerHTML = '';
    featuredProducts.forEach(product => {
        const lessonCard = document.createElement('div');
        lessonCard.className = 'lesson-card';
        lessonCard.innerHTML = `
            <div class="lesson-header">
                <div class="lesson-company-logo">${product.name.charAt(0)}</div>
                <div class="lesson-info">
                    <h4>${product.name}</h4>
                    <div class="lesson-meta">by Ebanks Academy in Swimming Lessons</div>
                </div>
            </div>
            <div class="lesson-details">
                <span>All Locations</span>
                <span>$${product.price.toFixed(2)}/session</span>
            </div>
            <div class="lesson-price">$${product.price.toFixed(2)}</div>
            <p style="color: var(--gray-dark); font-size: 0.875rem; margin-bottom: 1rem;">${product.description}</p>
            <div class="lesson-footer">
                <div class="lesson-badges">
                    ${product.id <= 2 ? '<span class="badge badge-featured">Featured</span>' : ''}
                    ${product.id === 1 ? '<span class="badge badge-popular">Popular</span>' : ''}
                </div>
                <div class="lesson-actions">
                    <button class="icon-btn add-to-cart" data-id="${product.id}" title="Add to cart">+</button>
                    <button class="icon-btn" title="Save">♥</button>
                </div>
            </div>
        `;
        featuredContainer.appendChild(lessonCard);
    });

    featuredContainer.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            addToCart(productId);
        });
    });
}

// Initialize page based on current page
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();

    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    if (currentPage === 'index.html' || currentPage === '') {
        loadFeaturedLessons();
    } else if (currentPage === 'products.html') {
        loadProducts();
    } else if (currentPage === 'cart.html') {
        loadCart();
        
        const clearCartBtn = document.getElementById('clear-cart');
        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', clearCart);
        }

        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', function() {
                if (cart.length > 0) {
                    window.location.href = 'checkout.html';
                } else {
                    alert('Your cart is empty!');
                }
            });
        }

        const closeCartBtn = document.getElementById('close-cart');
        if (closeCartBtn) {
            closeCartBtn.addEventListener('click', function() {
                window.location.href = 'products.html';
            });
        }
    } else if (currentPage === 'checkout.html') {
        loadCheckout();

        const checkoutForm = document.getElementById('checkout-form');
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', function(e) {
                e.preventDefault();
                if (validateCheckoutForm()) {
                    alert('Order confirmed! Thank you for your purchase.');
                    cart = [];
                    localStorage.setItem('cart', JSON.stringify(cart));
                    window.location.href = 'index.html';
                }
            });
        }

        const cancelBtn = document.getElementById('cancel-checkout');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', function() {
                window.location.href = 'cart.html';
            });
        }
    } else if (currentPage === 'login.html') {
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            let attempts = 0;

            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();

                if (!validateLoginForm()) return;

                const username = document.getElementById('username').value.trim();
                const password = document.getElementById('password').value;
                const users = JSON.parse(localStorage.getItem('RegistrationData')) || [];
                const user = users.find(u => u.trn === username && u.password === password);

                if (user) {
                    alert('Login successful');
                    window.location.href= 'products.html'; //Redirects User to products page
                } else {
                    attempts++
                    alert ('Incorrect TRN or password. Attempt ${attempts} of 3.');
                    if(attempts >= 3) {
                        window.location.href = 'error.html'; // account locked page
                    }
                }
                
            });
        }
    } else if (currentPage === 'registration.html') {
        const registrationForm = document.getElementById('registration-form');
        if (registrationForm) {
            registrationForm.addEventListener('submit', function(e) {
                e.preventDefault();
                if (validateRegistrationForm()) {
                    alert('Registration successful! Please login.');
                    window.location.href = 'login.html';
                }
            });
        }
    }
});


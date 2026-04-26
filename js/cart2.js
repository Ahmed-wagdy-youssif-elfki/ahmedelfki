/**
 * cart.js
 * Handles shopping cart client-side state.
 */

document.addEventListener('DOMContentLoaded', () => {
    /* --- قاعدة بيانات وهمية للمنتجات (Mock Data) ---
       هذا المصفوفة تستخدم فقط لجلب تفاصيل المنتج (السعر، الصورة، العنوان) عند النقر على إضافته للسلة 
       نظراً لأننا جعلنا العرض الأساسي للصفحات بـ HTML لضمان سرعة التحميل والـ SEO المناسب. */
    window.STORE_PRODUCTS = [
        { id: 's1', title: 'Pro-Elite Compression Tee', price: 45.00, image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=500&q=80' },
        { id: 's2', title: 'Aero-Flex Shorts', price: 35.00, image: 'https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&w=500&q=80' },
        { id: 's3', title: 'Zero-Gravity Shoes', price: 120.00, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80' },
        { id: 's4', title: 'Core-Fit Gym Bag', price: 55.00, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=500&q=80' },
        { id: 'p1', title: 'Orthopedic Dog Bed', price: 89.99, image: 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=500&q=80' },
        { id: 'p2', title: 'Interactive Fetch Toy', price: 24.50, image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=500&q=80' },
        { id: 'p3', title: 'Reflective Trail Harness', price: 45.00, image: 'https://images.unsplash.com/photo-1601646670868-6d80a3794696?auto=format&fit=crop&w=500&q=80' },
        { id: 'p4', title: 'Stainless Steel Travel Bowl', price: 18.00, image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=500&q=80' }
    ];

    // State (متغير حالة السلة الذي يخزن العناصر المضافة)
    let cart = [];
    // DOM Elements
    const body = document.body;
    const cartBtn = document.getElementById('open-cart');
    const closeBtn = document.getElementById('close-cart');
    const overlay = document.getElementById('cart-overlay');
    const cartBadge = document.getElementById('cart-badge');
    const cartItemsContainer = document.getElementById('cart-items');
    const subtotalEl = document.getElementById('cart-subtotal-val');

    // Toggle Cart
    function toggleCart() {
        body.classList.toggle('cart-active');
    }

    if (cartBtn) cartBtn.addEventListener('click', toggleCart);
    if (closeBtn) closeBtn.addEventListener('click', toggleCart);
    if (overlay) overlay.addEventListener('click', toggleCart);

    // Global Add to Cart function
    window.addToCart = function(productId) {
        // Find product from global mock store array
        const product = window.STORE_PRODUCTS ? window.STORE_PRODUCTS.find(p => p.id === productId) : null;
        if (!product) return;

        // Check if exists
        const existing = cart.find(item => item.id === productId);
        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({ ...product, qty: 1 });
        }

        updateCartUI();
        
        // Open Cart to show feedback
        body.classList.add('cart-active');
    };

    window.updateQty = function(productId, delta) {
        const item = cart.find(i => i.id === productId);
        if (item) {
            item.qty += delta;
            if (item.qty <= 0) {
                removeFromCart(productId);
            } else {
                updateCartUI();
            }
        }
    };

    window.removeFromCart = function(productId) {
        cart = cart.filter(i => i.id !== productId);
        updateCartUI();
    };

    function updateCartUI() {
        let count = 0;
        let subtotal = 0;
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<div class="empty-cart-msg">Your cart is currently empty.</div>';
        } else {
            cartItemsContainer.innerHTML = '';
            cart.forEach(item => {
                count += item.qty;
                subtotal += item.price * item.qty;
                
                const el = document.createElement('div');
                el.className = 'cart-item';
                el.innerHTML = `
                    <img src="${item.image}" alt="${item.title}" class="cart-item-img">
                    <div class="cart-item-details">
                        <span class="cart-item-title">${item.title}</span>
                        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                        <div class="cart-item-actions">
                            <div class="qty-control">
                                <button class="qty-btn" onclick="updateQty('${item.id}', -1)"><i class="fa-solid fa-minus"></i></button>
                                <span class="qty-val">${item.qty}</span>
                                <button class="qty-btn" onclick="updateQty('${item.id}', 1)"><i class="fa-solid fa-plus"></i></button>
                            </div>
                            <button class="remove-item" onclick="removeFromCart('${item.id}')">Remove</button>
                        </div>
                    </div>
                `;
                cartItemsContainer.appendChild(el);
            });
        }

        // Update Badge Counters
        if(cartBadge) cartBadge.textContent = count;
        if(subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    }

    /* =========================================================
       WISHLIST STATE AND UI IMPLEMENTATION
       ========================================================= */
    let wishlist = [];
    
    // Inject wishlist sidebar dynamically
    const wishlistSidebarHTML = `
    <div class="wishlist-sidebar" id="wishlist-sidebar">
        <div class="cart-header">
            <h3>Your Wishlist <i class="fa-solid fa-heart" style="color:var(--clr-accent-sport); margin-left:8px;"></i></h3>
            <button class="close-cart" id="close-wishlist"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="cart-items" id="wishlist-items">
            <div class="empty-cart-msg">Your wishlist is currently empty.</div>
        </div>
    </div>
    `;
    document.body.insertAdjacentHTML('beforeend', wishlistSidebarHTML);
    
    // Inject Wishlist button into Header if it doesn't exist
    const headerActions = document.querySelector('.header-actions');
    let wlBtnObj = document.querySelector('.wishlist-btn');
    if (!wlBtnObj && headerActions) {
        const btnHtml = `
            <a href="#" class="action-btn wishlist-btn" id="open-wishlist" aria-label="Wishlist">
                <i class="fa-regular fa-heart"></i>
                <span class="badge" id="wishlist-badge">0</span>
            </a>
        `;
        const cartBtnElem = document.getElementById('open-cart');
        if(cartBtnElem) {
            cartBtnElem.insertAdjacentHTML('beforebegin', btnHtml);
        }
    }

    const openWishlistBtn = document.getElementById('open-wishlist') || document.querySelector('.wishlist-btn');
    const closeWishlistBtn = document.getElementById('close-wishlist');
    const wishlistItemsContainer = document.getElementById('wishlist-items');
    
    function toggleWishlist(e) {
        if(e) e.preventDefault();
        document.body.classList.toggle('wishlist-active');
        // close cart if open
        document.body.classList.remove('cart-active');
    }

    if(openWishlistBtn) {
        openWishlistBtn.addEventListener('click', toggleWishlist);
        openWishlistBtn.id = 'open-wishlist'; // Ensure ID exists for badge
    }
    if(closeWishlistBtn) closeWishlistBtn.addEventListener('click', toggleWishlist);
    
    // Re-bind overlay to handle both
    if(overlay) {
        overlay.addEventListener('click', () => {
            document.body.classList.remove('cart-active');
            document.body.classList.remove('wishlist-active');
        });
    }

    window.addToWishlist = function(productId) {
        const product = window.STORE_PRODUCTS ? window.STORE_PRODUCTS.find(p => p.id === productId) : null;
        if (!product) return;

        const exists = wishlist.find(item => item.id === productId);
        if (!exists) {
            wishlist.push(product);
            // Optional: Show toast or feedback
            const btn = document.activeElement;
            if (btn && btn.classList.contains('btn-icon')) {
                btn.innerHTML = '<i class="fa-solid fa-heart" style="color:var(--clr-accent-sport);"></i>';
            }
        }
        updateWishlistUI();
        document.body.classList.add('wishlist-active');
        document.body.classList.remove('cart-active');
    };

    window.removeFromWishlist = function(productId) {
        wishlist = wishlist.filter(i => i.id !== productId);
        updateWishlistUI();
    };

    window.moveToCart = function(productId) {
        removeFromWishlist(productId);
        window.addToCart(productId);
    };

    function updateWishlistUI() {
        const badge = document.getElementById('wishlist-badge');
        if(badge) badge.textContent = wishlist.length;

        if (wishlist.length === 0) {
            wishlistItemsContainer.innerHTML = '<div class="empty-cart-msg">Your wishlist is empty. Discover your next favorite item!</div>';
        } else {
            wishlistItemsContainer.innerHTML = '';
            wishlist.forEach(item => {
                const el = document.createElement('div');
                el.className = 'cart-item';
                el.innerHTML = `
                    <div style="position:relative;">
                        <img src="${item.image}" alt="${item.title}" class="cart-item-img">
                    </div>
                    <div class="cart-item-details">
                        <span class="cart-item-title">${item.title}</span>
                        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                        <div class="cart-item-actions" style="margin-top:0.75rem; justify-content:flex-start; gap:1rem;">
                            <button class="btn btn-primary" style="padding: 0.4rem 0.75rem; font-size:0.8rem;" onclick="moveToCart('${item.id}')">Add to Cart</button>
                            <button class="remove-item" onclick="removeFromWishlist('${item.id}')" style="font-size:0.8rem;">Remove</button>
                        </div>
                    </div>
                `;
                wishlistItemsContainer.appendChild(el);
            });
        }
    }

});

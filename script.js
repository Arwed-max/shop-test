// Beispielprodukte (kreativ erweitert)
const products = [
    {
        id: 1,
        title: "Feuchtigkeitsspendende Gesichtscreme",
        price: 19.99,
        category: "Gesichtspflege",
        brand: "Holt Beauty",
        description: "Leichte Creme für intensive Feuchtigkeit und geschmeidige Haut.",
        images: ["https://via.placeholder.com/300x200?text=Gesichtscreme"],
    },
    {
        id: 2,
        title: "Natürlicher Lippenbalsam",
        price: 7.99,
        category: "Lippenpflege",
        brand: "Holt Nature",
        description: "Pflegt und schützt die Lippen mit natürlichen Inhaltsstoffen.",
        images: ["https://via.placeholder.com/300x200?text=Lippenbalsam"],
    },
    {
        id: 3,
        title: "Revitalisierendes Shampoo",
        price: 12.99,
        category: "Haarpflege",
        brand: "Holt Hair",
        description: "Sanftes Shampoo für glänzendes und gesundes Haar.",
        images: ["https://via.placeholder.com/300x200?text=Shampoo"],
    },
];

// Admin Login-Daten
const adminData = {
    email: "Admin_XXX@example.com",
    password: "ichbinderAdmin",
};

let cart = JSON.parse(localStorage.getItem("holtCart")) || [];
let loggedInUser = null;

const sidebar = document.getElementById("sidebar");
const sidebarToggle = document.getElementById("sidebarToggle");
const sidebarClose = document.getElementById("sidebarClose");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const productsGrid = document.getElementById("productsGrid");
const cartList = document.getElementById("cartList");
const cartEmpty = document.getElementById("cartEmpty");
const checkoutBtn = document.getElementById("checkoutBtn");

const productDetailModal = document.getElementById("productDetailModal");
const modalCloseBtn = document.getElementById("modalCloseBtn");
const modalTitle = document.getElementById("modalTitle");
const modalImages = document.getElementById("modalImages");
const modalDescription = document.getElementById("modalDescription");
const modalPrice = document.getElementById("modalPrice");
const modalCategory = document.getElementById("modalCategory");
const modalBrand = document.getElementById("modalBrand");
const addToCartBtn = document.getElementById("addToCartBtn");

const loginToggle = document.getElementById("loginToggle");
const loginModal = document.getElementById("loginModal");
const loginCloseBtn = document.getElementById("loginCloseBtn");
const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const loginMessage = document.getElementById("loginMessage");

let currentProduct = null;

// Sidebar öffnen/schließen
sidebarToggle.addEventListener("click", () => {
    sidebar.classList.add("sidebar-open");
});

sidebarClose.addEventListener("click", () => {
    sidebar.classList.remove("sidebar-open");
});

// Login Modal öffnen/schließen
loginToggle.addEventListener("click", () => {
    loginModal.classList.remove("hidden");
    loginMessage.textContent = "";
});

loginCloseBtn.addEventListener("click", () => {
    loginModal.classList.add("hidden");
    loginMessage.textContent = "";
});

// Tabs Login/Registrierung wechseln
loginTab.addEventListener("click", () => {
    loginTab.classList.add("active-tab");
    registerTab.classList.remove("active-tab");
    loginForm.classList.add("active-form");
    loginForm.classList.remove("hidden");
    registerForm.classList.add("hidden");
    loginMessage.textContent = "";
});
registerTab.addEventListener("click", () => {
    registerTab.classList.add("active-tab");
    loginTab.classList.remove("active-tab");
    registerForm.classList.remove("hidden");
    loginForm.classList.add("hidden");
    loginMessage.textContent = "";
});

// Produkte anzeigen
function displayProducts(list) {
    productsGrid.innerHTML = "";
    if (list.length === 0) {
        productsGrid.innerHTML = "<p>Keine Produkte gefunden.</p>";
        return;
    }
    list.forEach((prod) => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.tabIndex = 0;
        card.setAttribute("role", "button");
        card.setAttribute("aria-pressed", "false");

        card.innerHTML = `
            <img src="${prod.images[0]}" alt="${prod.title}" />
            <div class="product-title">${prod.title}</div>
            <div class="product-price">${prod.price.toFixed(2)} €</div>
            <div class="product-category">${prod.category}</div>
        `;
        card.addEventListener("click", () => openProductDetail(prod.id));
        card.addEventListener("keypress", (e) => {
            if (e.key === "Enter") openProductDetail(prod.id);
        });
        productsGrid.appendChild(card);
    });
}

// Produkt-Detail öffnen
function openProductDetail(id) {
    currentProduct = products.find((p) => p.id === id);
    if (!currentProduct) return;

    modalTitle.textContent = currentProduct.title;
    modalImages.innerHTML = "";
    currentProduct.images.forEach((img) => {
        const imageEl = document.createElement("img");
        imageEl.src = img;
        imageEl.alt = currentProduct.title;
        modalImages.appendChild(imageEl);
    });
    modalDescription.textContent = currentProduct.description;
    modalPrice.textContent = currentProduct.price.toFixed(2);
    modalCategory.textContent = currentProduct.category;
    modalBrand.textContent = currentProduct.brand;
    productDetailModal.classList.remove("hidden");
}

// Produkt-Detail schließen
modalCloseBtn.addEventListener("click", () => {
    productDetailModal.classList.add("hidden");
});

// Produkt in Warenkorb hinzufügen
addToCartBtn.addEventListener("click", () => {
    if (!currentProduct) return;

    cart.push(currentProduct);
    localStorage.setItem("holtCart", JSON.stringify(cart));
    updateCartUI();
    productDetailModal.classList.add("hidden");
});

// Warenkorb anzeigen
function updateCartUI() {
    cartList.innerHTML = "";
    if (cart.length === 0) {
        cartEmpty.style.display = "block";
        checkoutBtn.disabled = true;
        return;
    } else {
        cartEmpty.style.display = "none";
        checkoutBtn.disabled = false;
    }
    const summary = {};
    cart.forEach((item) => {
        summary[item.id] = summary[item.id] ? summary[item.id] + 1 : 1;
    });
    for (const id in summary) {
        const product = products.find((p) => p.id == id);
        const li = document.createElement("li");
        li.textContent = `${product.title} x${summary[id]}`;
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "✕";
        removeBtn.style.background = "none";
        removeBtn.style.border = "none";
        removeBtn.style.cursor = "pointer";
        removeBtn.style.color = "red";
        removeBtn.addEventListener("click", () => {
            removeFromCart(product.id);
        });
        li.appendChild(removeBtn);
        cartList.appendChild(li);
    }
}

// Artikel aus Warenkorb entfernen
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem("holtCart", JSON.stringify(cart));
    updateCartUI();
}
// Suche
searchBtn.addEventListener("click", () => {
    const query = searchInput.value.toLowerCase();
    const results = products.filter((prod) => {
        return (
            prod.title.toLowerCase().includes(query) ||
            prod.description.toLowerCase().includes(query) ||
            prod.category.toLowerCase().includes(query) ||
            prod.brand.toLowerCase().includes(query)
        );
    });
    displayProducts(results);
});

// Checkout-Button
checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) return;
    alert("Zahlung aktuell nur Demo – später PayPal-Integration.");
    cart = [];
    localStorage.removeItem("holtCart");
    updateCartUI();
});

// Login
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    if (email === adminData.email && password === adminData.password) {
        loggedInUser = { email, isAdmin: true };
        loginMessage.style.color = "green";
        loginMessage.textContent = "Erfolgreich als Admin angemeldet!";
        setTimeout(() => loginModal.classList.add("hidden"), 1500);
    } else {
        loginMessage.textContent = "Falsche Zugangsdaten!";
    }
});

// Registrierung
registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;
    const confirm = document.getElementById("registerPasswordConfirm").value;

    if (password !== confirm) {
        loginMessage.textContent = "Passwörter stimmen nicht überein!";
        return;
    }

    loginMessage.style.color = "green";
    loginMessage.textContent = "Registrierung erfolgreich! Du kannst dich jetzt anmelden.";
    setTimeout(() => {
        loginTab.click();
    }, 1500);
});

// Initialisierung
displayProducts(products);
updateCartUI();
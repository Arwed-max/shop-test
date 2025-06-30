// script.js

// Produktdaten laden oder initialisieren
let products = JSON.parse(localStorage.getItem("products")) || [
  {
    title: "Lippenstift Rosa",
    brand: "Beautify",
    description: "Ein langanhaltender, feuchtigkeitsspendender Lippenstift in zartem Rosa.",
    category: "Make-Up",
    price: "12.99",
    images: ["https://via.placeholder.com/150", "https://via.placeholder.com/150"]
  },
  {
    title: "Tagescreme Natur",
    brand: "PureSkin",
    description: "Pflegende Tagescreme mit natürlichen Inhaltsstoffen.",
    category: "Pflege",
    price: "14.99",
    images: ["https://via.placeholder.com/150"]
  }
];

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// Produkte speichern
function saveProducts() {
  localStorage.setItem("products", JSON.stringify(products));
}
function saveFavorites() {
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

// Sidebar umschalten
document.getElementById("toggleSidebar").onclick = () => {
  document.getElementById("sidebar").classList.toggle("hidden");
};

// Produktanzeige
function renderProducts(sectionId, filterFn) {
  const section = document.getElementById(sectionId);
  if (!section) return;
  section.innerHTML = "";
  products.filter(filterFn).forEach((p, i) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${p.images[0]}" alt="${p.title}">
      <h3>${p.title}</h3>
      <p>${p.price} €</p>
      <button onclick="showDetail(${i})">Ansehen</button>
      <button onclick="toggleFavorite(${i})">${isFavorite(i) ? "★ Entfernen" : "☆ Merken"}</button>
    `;
    section.appendChild(card);
  });
}

// Favoriten anzeigen
function isFavorite(index) {
  return favorites.includes(index);
}
function toggleFavorite(index) {
  if (favorites.includes(index)) {
    favorites = favorites.filter(i => i !== index);
  } else {
    favorites.push(index);
  }
  saveFavorites();
  renderAll();
}

// Detailansicht
function showDetail(index) {
  const product = products[index];
  const modal = document.getElementById("productDetail");
  modal.style.display = "flex";

  document.getElementById("detailImages").innerHTML = product.images.map(img => `<img src="${img}">`).join("");
  document.getElementById("detailTitle").innerText = product.title;
  document.getElementById("detailBrand").innerText = "Marke: " + product.brand;
  document.getElementById("detailDescription").innerText = product.description;
  document.getElementById("detailCategory").innerText = "Kategorie: " + product.category;
  document.getElementById("detailPrice").innerText = "Preis: " + product.price + " €";

  document.getElementById("paypal-button-container").innerHTML = "";
  paypal.Buttons({
    createOrder: (data, actions) => {
      return actions.order.create({
        purchase_units: [{
          amount: { value: product.price }
        }]
      });
    },
    onApprove: (data, actions) => {
      return actions.order.capture().then(details => {
        alert("Danke für deinen Kauf, " + details.payer.name.given_name + "!");
      });
    }
  }).render('#paypal-button-container');
}

// Detail schließen
function closeDetail() {
  document.getElementById("productDetail").style.display = "none";
}

// Admin Login
const ADMIN_USER = "Admin_XXX";
const ADMIN_PASS_HASH = "b3b77c0ecedbe934f9b84c8883bfa0d12bb40a2cbd58582e2c597c7551ff36b6"; // 'ichbinderAdmin'

async function hashString(str) {
  const buffer = new TextEncoder().encode(str);
  const hash = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function loginAdmin() {
  const user = document.getElementById("adminUser").value;
  const pass = document.getElementById("adminPass").value;
  const hashed = await hashString(pass);

  if (user === ADMIN_USER && hashed === ADMIN_PASS_HASH) {
    alert("Willkommen Admin!");
    toggleLogin();
    document.getElementById("uploadSection").style.display = "block";
  } else {
    alert("Falsche Zugangsdaten!");
  }
}

function toggleLogin() {
  const modal = document.getElementById("loginModal");
  modal.style.display = modal.style.display === "flex" ? "none" : "flex";
}

// Produkt-Upload
function handleImageUpload(callback) {
  const fileInput = document.getElementById("productImageFile");
  const files = fileInput.files;
  if (!files.length) return callback([]);

  const reader = new FileReader();
  reader.onload = e => callback([e.target.result]);
  reader.readAsDataURL(files[0]);
}

function uploadProduct() {
  const title = document.getElementById("productTitle").value;
  const brand = document.getElementById("productBrand").value;
  const description = document.getElementById("productDescription").value;
  const category = document.getElementById("productCategory").value;
  const price = document.getElementById("productPrice").value;
  const imageUrl = document.getElementById("productImages").value.trim();

  handleImageUpload((uploadedImages) => {
    const allImages = imageUrl ? [imageUrl, ...uploadedImages] : uploadedImages;
    if (title && brand && description && category && price && allImages.length > 0) {
      products.push({ title, brand, description, category, price, images: allImages });
      saveProducts();
      renderAll();
      alert("Produkt hinzugefügt!");
    } else {
      alert("Bitte alle Felder ausfüllen.");
    }
  });
}

// Suche
function handleSearch() {
  const term = document.getElementById("searchInput").value.toLowerCase();
  renderProducts("recentlySearched", p =>
    p.title.toLowerCase().includes(term) ||
    p.description.toLowerCase().includes(term) ||
    p.category.toLowerCase().includes(term) ||
    p.brand.toLowerCase().includes(term)
  );
}

// Navigation
document.querySelectorAll(".navlink").forEach(link => {
  link.onclick = () => {
    const page = link.dataset.page;
    document.querySelectorAll("main > section").forEach(sec => sec.style.display = "none");
    document.getElementById(page).style.display = "block";
    document.getElementById("sidebar").classList.add("hidden");
  };
});

document.getElementById("backFromDetail").onclick = closeDetail;

// Alle Bereiche aktualisieren
function renderAll() {
  renderProducts("recentlySearched", () => true);
  renderProducts("favorites", (_, i) => favorites.includes(i));
  renderProducts("makeupCategory", p => p.category === "Make-Up");
}

renderAll();
}
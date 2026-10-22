
/* =================================
   NORDEN MEN - WEBSITE FASHION PRIA
   ================================= */

// GANTI dengan nomor WhatsApp tokomu.
// Format: kode negara + nomor, tanpa tanda + atau spasi.
const WHATSAPP_NUMBER = "6281234567890";

// DATA PRODUK CONTOH
const products = [
  {
    id: 1,
    name: "Essential Heavyweight Tee",
    category: "Kaos",
    price: 89000,
    oldPrice: 119000,
    tag: "BEST SELLER",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 2,
    name: "Relaxed Oxford Shirt",
    category: "Kemeja",
    price: 169000,
    oldPrice: null,
    tag: "NEW ARRIVAL",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 3,
    name: "Straight Fit Trousers",
    category: "Celana",
    price: 189000,
    oldPrice: null,
    tag: "",
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 4,
    name: "Everyday Overshirt",
    category: "Outer",
    price: 229000,
    oldPrice: 279000,
    tag: "PROMO",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 5,
    name: "Premium Cotton Tee",
    category: "Kaos",
    price: 99000,
    oldPrice: null,
    tag: "",
    image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 6,
    name: "Classic Linen Shirt",
    category: "Kemeja",
    price: 179000,
    oldPrice: 209000,
    tag: "FAVORIT",
    image: "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 7,
    name: "Relaxed Chino Pants",
    category: "Celana",
    price: 199000,
    oldPrice: null,
    tag: "",
    image: "https://images.unsplash.com/photo-1517438476312-10d79c077509?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 8,
    name: "Minimal Utility Jacket",
    category: "Outer",
    price: 289000,
    oldPrice: null,
    tag: "LIMITED",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=700&q=80"
  }
];

// STATE WEBSITE
const state = {
  category: "Semua",
  search: "",
  sort: "featured",
  cart: {}
};

// HELPER
const $ = selector => document.querySelector(selector);

const rupiah = amount =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(amount);

let toastTimer;

// NOTIFIKASI
function showToast(message) {
  const toast = $("#toast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

// FILTER DAN PENCARIAN
function getVisibleProducts() {
  let list = products.filter(product => {
    const categoryMatch =
      state.category === "Semua" ||
      product.category === state.category;

    const searchMatch =
      (product.name + " " + product.category)
        .toLowerCase()
        .includes(state.search.toLowerCase());

    return categoryMatch && searchMatch;
  });

  if (state.sort === "low") {
    list.sort((a, b) => a.price - b.price);
  }

  if (state.sort === "high") {
    list.sort((a, b) => b.price - a.price);
  }

  return list;
}

// TAMPILKAN PRODUK
function renderProducts() {
  const grid = $("#productGrid");
  if (!grid) return;

  const list = getVisibleProducts();

  if (list.length === 0) {
    grid.innerHTML = `
      <div class="empty-results">
        Produk tidak ditemukan.
        Coba kata kunci lain.
      </div>
    `;
    return;
  }

  grid.innerHTML = list.map(product => `
    <article class="product-card">
      <div class="product-image-wrap">

        <img
          class="product-image"
          src="${product.image}"
          alt="${product.name}"
          loading="lazy"
        >

        ${
          product.tag
            ? `<span class="product-tag">${product.tag}</span>`
            : ""
        }

        <button
          class="add-button"
          data-add="${product.id}"
          type="button"
        >
          + TAMBAH KE KERANJANG
        </button>

      </div>

      <div class="product-info">
        <div class="product-category">
          ${product.category}
        </div>

        <h3 class="product-name">
          ${product.name}
        </h3>

        <div class="price-row">
          <span class="price">
            ${rupiah(product.price)}
          </span>

          ${
            product.oldPrice
              ? `<span class="old-price">${rupiah(product.oldPrice)}</span>`
              : ""
          }
        </div>
      </div>
    </article>
  `).join("");
}

// HITUNG KERANJANG
function getCartCount() {
  return Object.values(state.cart)
    .reduce((total, item) => total + item.qty, 0);
}

function getCartTotal() {
  return Object.values(state.cart)
    .reduce((total, item) => total + item.price * item.qty, 0);
}

// TAMBAH PRODUK
function addToCart(id) {
  const product = products.find(item => item.id === id);
  if (!product) return;

  if (state.cart[id]) {
    state.cart[id].qty += 1;
  } else {
    state.cart[id] = { ...product, qty: 1 };
  }

  renderCart();
  showToast("Produk berhasil ditambahkan!");
}

// TAMPILKAN KERANJANG
function renderCart() {
  const itemsContainer = $("#cartItems");
  if (!itemsContainer) return;

  const entries = Object.values(state.cart);
  const count = getCartCount();
  const total = getCartTotal();

  $("#cartCount").textContent = count;
  $("#drawerCount").textContent = `(${count})`;
  $("#cartSubtotal").textContent = rupiah(total);

  if (entries.length === 0) {
    itemsContainer.innerHTML = `
      <div class="cart-empty">
        Keranjangmu masih kosong.<br>
        Yuk, pilih produk favoritmu!
      </div>
    `;
    return;
  }

  itemsContainer.innerHTML = entries.map(item => `
    <div class="cart-item">

      <img src="${item.image}" alt="${item.name}">

      <div>
        <h3>${item.name}</h3>

        <div class="item-price">
          ${rupiah(item.price)}
        </div>

        <div class="qty-control">
          <button
            type="button"
            data-qty="${item.id}"
            data-delta="-1"
            aria-label="Kurangi jumlah"
          >−</button>

          <span>${item.qty}</span>

          <button
            type="button"
            data-qty="${item.id}"
            data-delta="1"
            aria-label="Tambah jumlah"
          >+</button>
        </div>
      </div>

      <button
        class="remove-item"
        type="button"
        data-remove="${item.id}"
        aria-label="Hapus produk"
      >×</button>

    </div>
  `).join("");
}

// BUKA DAN TUTUP KERANJANG
function openCart() {
  $("#cartDrawer").classList.add("open");
  $("#overlay").classList.add("visible");
  $("#cartDrawer").setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  $("#cartDrawer").classList.remove("open");
  $("#overlay").classList.remove("visible");
  $("#cartDrawer").setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

// CHECKOUT WHATSAPP
function checkoutWhatsApp() {
  const entries = Object.values(state.cart);

  if (entries.length === 0) {
    showToast("Keranjang masih kosong.");
    return;
  }

  // Mencegah checkout menggunakan nomor contoh.
  if (
    !/^\d{10,15}$/.test(WHATSAPP_NUMBER) ||
    WHATSAPP_NUMBER === "6281234567890"
  ) {
    showToast("Ganti nomor WhatsApp di script.js dahulu.");
    return;
  }

  const orderDetails = entries.map(item =>
    `- ${item.name} x${item.qty}: ${rupiah(item.price * item.qty)}`
  ).join("\n");

  const message =
    `Halo NORDEN MEN, saya ingin memesan:\n\n` +
    `${orderDetails}\n\n` +
    `Subtotal: ${rupiah(getCartTotal())}\n\n` +
    `Mohon informasi stok, ongkir, dan pembayaran. Terima kasih.`;

  const url =
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank", "noopener,noreferrer");
}

// HUBUNGKAN EVENT WEBSITE
function initializeWebsite() {
  // Produk
  renderProducts();
  renderCart();

  // Tahun footer
  $("#year").textContent = new Date().getFullYear();

  // Tambah produk
  $("#productGrid").addEventListener("click", event => {
    const button = event.target.closest("[data-add]");

    if (button) {
      addToCart(Number(button.dataset.add));
    }
  });

  // Filter kategori
  $("#categoryFilters").addEventListener("click", event => {
    const button = event.target.closest("[data-category]");
    if (!button) return;

    state.category = button.dataset.category;

    document.querySelectorAll(".filter").forEach(item => {
      item.classList.toggle("active", item === button);
    });

    renderProducts();
  });

  // Urutkan harga
  $("#sortSelect").addEventListener("change", event => {
    state.sort = event.target.value;
    renderProducts();
  });

  // Pencarian
  $("#searchToggle").addEventListener("click", () => {
    $("#searchBar").classList.toggle("visible");

    if ($("#searchBar").classList.contains("visible")) {
      $("#searchInput").focus();
    }
  });

  $("#searchInput").addEventListener("input", event => {
    state.search = event.target.value;
    renderProducts();
  });

  $("#clearSearch").addEventListener("click", () => {
    $("#searchInput").value = "";
    state.search = "";
    renderProducts();
    $("#searchInput").focus();
  });

  // Buka/tutup keranjang
  $("#cartOpen").addEventListener("click", openCart);
  $("#cartClose").addEventListener("click", closeCart);
  $("#overlay").addEventListener("click", closeCart);

  // Ubah jumlah atau hapus produk
  $("#cartItems").addEventListener("click", event => {
    const qtyButton = event.target.closest("[data-qty]");
    const removeButton = event.target.closest("[data-remove]");

    if (qtyButton) {
      const id = Number(qtyButton.dataset.qty);
      const delta = Number(qtyButton.dataset.delta);

      if (state.cart[id]) {
        state.cart[id].qty += delta;

        if (state.cart[id].qty <= 0) {
          delete state.cart[id];
        }

        renderCart();
      }
    }

    if (removeButton) {
      delete state.cart[Number(removeButton.dataset.remove)];
      renderCart();
    }
  });

  // Menu HP
  $("#menuToggle").addEventListener("click", () => {
    $("#mobileNav").classList.toggle("open");
  });

  $("#mobileNav").querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      $("#mobileNav").classList.remove("open");
    });
  });

  // Tutup keranjang dengan Escape
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeCart();
  });

  // Pesan melalui WhatsApp
  $("#checkoutButton").addEventListener(
    "click",
    checkoutWhatsApp
  );
}

// Jalankan setelah HTML selesai dibaca
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeWebsite);
} else {
  initializeWebsite();
    }

const CART_KEY = "arcarsu-cart";
const ACCOUNT_KEY = "arcarsu-account";
const ORDER_KEY = "arcarsu-orders";
const ADMIN_PRODUCTS_KEY = "arcarsu-admin-products";
const ADMIN_EMAIL = "admin@arcarsu.com";
const WHATSAPP_URL = "https://wa.me/5491100000000";

const menuButton = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const yearTarget = document.querySelector("#current-year");
const contactForm = document.querySelector("#contact-form");
const formNote = document.querySelector("#form-note");
const cartLaunch = document.querySelector(".cart-launch");
const cartDrawer = document.querySelector("#cart-drawer");
const cartBackdrop = document.querySelector("#cart-backdrop");
const cartClose = document.querySelector(".cart-close");
const cartCount = document.querySelector("#cart-count");
const cartItems = document.querySelector("#cart-items");
const cartTotal = document.querySelector("#cart-total");
const cartCheckout = document.querySelector("#cart-checkout");
const checkoutProducts = document.querySelector("#checkout-products");
const checkoutSubtotal = document.querySelector("#checkout-subtotal");
const checkoutTotal = document.querySelector("#checkout-total");
const checkoutForm = document.querySelector("#checkout-form");
const checkoutEmpty = document.querySelector("#checkout-empty");
const accountToggle = document.querySelector(".account-toggle");
const accountPanel = document.querySelector("#account-panel");
const accountOverlay = document.querySelector("#account-overlay");
const accountModal = document.querySelector("#account-modal");
const accountModalClose = document.querySelector(".account-modal-close");
const accountForm = document.querySelector("#account-form");
const accountLogout = document.querySelector(".account-logout");
const accountTriggerText = document.querySelector("[data-account-trigger-text]");
const accountUser = document.querySelector("[data-account-user]");
const accountName = document.querySelector("[data-account-name]");
const notificationsToggle = document.querySelector(".notifications-toggle");
const notificationsPanel = document.querySelector("#notifications-panel");
const notificationsCount = document.querySelector("[data-notifications-count]");
const adminLink = document.querySelector("[data-admin-link]");
const adminGate = document.querySelector("#admin-gate");
const adminContent = document.querySelector("#admin-content");
const adminOrders = document.querySelector("#admin-orders");
const adminOrdersCount = document.querySelector("#admin-orders-count");
const adminPendingCount = document.querySelector("#admin-pending-count");
const adminProductsCount = document.querySelector("#admin-products-count");
const adminProductForm = document.querySelector("#admin-product-form");
const adminProductsList = document.querySelector("#admin-products-list");

const formatCurrency = (value) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);

const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (char) => {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return map[char] || char;
  });

const readCart = () => {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  } catch {
    return [];
  }
};

const writeCart = (cart) => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

const readAccount = () => {
  try {
    return JSON.parse(localStorage.getItem(ACCOUNT_KEY) || "null");
  } catch {
    return null;
  }
};

const writeAccount = (account) => {
  if (!account) {
    localStorage.removeItem(ACCOUNT_KEY);
    return;
  }

  localStorage.setItem(ACCOUNT_KEY, JSON.stringify(account));
};

const readOrders = () => {
  try {
    return JSON.parse(localStorage.getItem(ORDER_KEY) || "[]");
  } catch {
    return [];
  }
};

const writeOrders = (orders) => {
  localStorage.setItem(ORDER_KEY, JSON.stringify(orders));
};

const readAdminProducts = () => {
  try {
    return JSON.parse(localStorage.getItem(ADMIN_PRODUCTS_KEY) || "[]");
  } catch {
    return [];
  }
};

const writeAdminProducts = (products) => {
  localStorage.setItem(ADMIN_PRODUCTS_KEY, JSON.stringify(products));
};

const getTierUnits = (tier) => {
  const match = String(tier || "").match(/\d+/);
  return match ? Number(match[0]) : 1;
};

const getItemSubtotal = (item) => item.price * getTierUnits(item.tier) * item.quantity;

const getCartTotals = (cart) => {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + getItemSubtotal(item), 0);
  return { totalItems, totalPrice };
};

const openCart = () => {
  if (!cartDrawer || !cartBackdrop || !cartLaunch) return;
  closeAccountPanel();
  closeNotificationsPanel();
  cartDrawer.classList.add("is-open");
  cartBackdrop.classList.add("is-open");
  cartLaunch.setAttribute("aria-expanded", "true");
};

const closeCart = () => {
  if (!cartDrawer || !cartBackdrop || !cartLaunch) return;
  cartDrawer.classList.remove("is-open");
  cartBackdrop.classList.remove("is-open");
  cartLaunch.setAttribute("aria-expanded", "false");
};

const formatAccountName = (email) => {
  const base = String(email || "").split("@")[0].replace(/[._-]+/g, " ").trim();
  if (!base) return "Cliente Arcarsu";
  return base.replace(/\b\w/g, (char) => char.toUpperCase());
};

const isAdminAccount = (account) => String(account?.email || "").trim().toLowerCase() === ADMIN_EMAIL;

const openAccountModal = () => {
  if (!accountModal || !accountOverlay) return;
  accountModal.hidden = false;
  accountOverlay.hidden = false;
  accountModal.setAttribute("aria-hidden", "false");
  closeAccountPanel();
};

const closeAccountModal = () => {
  if (!accountModal || !accountOverlay) return;
  accountModal.hidden = true;
  accountOverlay.hidden = true;
  accountModal.setAttribute("aria-hidden", "true");
};

const openAccountPanel = () => {
  if (!accountPanel || !accountToggle) return;
  accountPanel.hidden = false;
  accountToggle.setAttribute("aria-expanded", "true");
};

const closeAccountPanel = () => {
  if (!accountPanel || !accountToggle) return;
  accountPanel.hidden = true;
  accountToggle.setAttribute("aria-expanded", "false");
};

const openNotificationsPanel = () => {
  if (!notificationsPanel || !notificationsToggle) return;
  notificationsPanel.hidden = false;
  notificationsToggle.setAttribute("aria-expanded", "true");
};

const closeNotificationsPanel = () => {
  if (!notificationsPanel || !notificationsToggle) return;
  notificationsPanel.hidden = true;
  notificationsToggle.setAttribute("aria-expanded", "false");
};

const renderAccountState = () => {
  const account = readAccount();

  if (accountTriggerText) {
    accountTriggerText.textContent = account?.name || "Iniciar sesion";
  }

  if (accountUser) {
    accountUser.hidden = !account;
  }

  if (accountName) {
    accountName.textContent = account?.name || "Cliente Arcarsu";
  }

  if (notificationsCount) {
    notificationsCount.textContent = "3";
  }

  if (adminLink) {
    adminLink.hidden = !isAdminAccount(account);
  }
};

const animateCartFeedback = () => {
  if (!cartLaunch) return;

  cartLaunch.classList.remove("is-bouncing");
  if (cartCount) {
    cartCount.classList.remove("is-bouncing");
  }

  requestAnimationFrame(() => {
    cartLaunch.classList.add("is-bouncing");
    if (cartCount) {
      cartCount.classList.add("is-bouncing");
    }
  });
};

const buildWhatsAppMessage = (cart, customer = null) => {
  const { totalPrice } = getCartTotals(cart);
  const cartLines = cart.map((item) => {
    const units = getTierUnits(item.tier);
    const subtotal = getItemSubtotal(item);
    return `- ${item.name} ${item.tier} (${formatCurrency(item.price)} c/u, ${units} unidades) x${item.quantity} - ${formatCurrency(subtotal)}`;
  });

  const customerLines = customer
    ? [
        `Nombre: ${customer.name}`,
        `Telefono: ${customer.phone}`,
        `Email: ${customer.email}`,
        `Entrega: ${customer.delivery}`,
        `Direccion: ${customer.address}`,
        `Localidad: ${customer.city}`,
        customer.notes ? `Notas: ${customer.notes}` : "",
      ].filter(Boolean)
    : [];

  const sections = ["Hola Arcarsu, quiero comprar:"];

  if (customerLines.length) {
    sections.push(customerLines.join("\n"));
  }

  sections.push(cartLines.join("\n"));
  sections.push(`Total estimado: ${formatCurrency(totalPrice)}`);

  return `${WHATSAPP_URL}?text=${encodeURIComponent(sections.join("\n\n"))}`;
};

const createOrderRecord = (cart, customer) => {
  const orders = readOrders();
  const { totalPrice } = getCartTotals(cart);
  const order = {
    id: `ARC-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: "Pendiente",
    total: totalPrice,
    customer,
    items: cart.map((item) => ({
      name: item.name,
      tier: item.tier,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
      subtotal: getItemSubtotal(item),
    })),
  };

  orders.unshift(order);
  writeOrders(orders);
  return order;
};

const updateCartView = () => {
  const cart = readCart();
  const { totalItems, totalPrice } = getCartTotals(cart);

  if (cartCount) {
    cartCount.textContent = String(totalItems);
  }

  if (cartTotal) {
    cartTotal.textContent = `Total: ${formatCurrency(totalPrice)}`;
  }

  if (cartCheckout) {
    cartCheckout.href = "./checkout.html";
    cartCheckout.classList.toggle("is-disabled", !cart.length);
    cartCheckout.setAttribute("aria-disabled", String(!cart.length));
  }

  renderAccountState();

  if (!cartItems) return;

  if (!cart.length) {
    cartItems.innerHTML = '<p class="cart-empty">Todavia no agregaste productos.</p>';
    return;
  }

  cartItems.innerHTML = cart
    .map(
      (item, index) => `
        <article class="cart-item">
          <img class="cart-item-thumb" src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" />
          <div>
            <h3>${escapeHtml(item.name)}</h3>
            <p>${escapeHtml(item.tier)} - ${formatCurrency(item.price)} c/u - Total ${formatCurrency(getItemSubtotal(item))}</p>
            <div class="cart-item-controls">
              <button type="button" aria-label="Restar" data-cart-action="decrease" data-index="${index}">-</button>
              <strong>${item.quantity}</strong>
              <button type="button" aria-label="Sumar" data-cart-action="increase" data-index="${index}">+</button>
              <button type="button" class="cart-remove" aria-label="Quitar" title="Quitar" data-cart-action="remove" data-index="${index}">🗑</button>
            </div>
          </div>
        </article>
      `
    )
    .join("");

};

const updateCheckoutView = () => {
  if (!checkoutProducts || !checkoutSubtotal || !checkoutTotal) return;

  const cart = readCart();
  const { totalPrice } = getCartTotals(cart);

  if (checkoutEmpty) {
    checkoutEmpty.hidden = cart.length > 0;
  }

  if (!cart.length) {
    checkoutProducts.innerHTML = "";
    checkoutSubtotal.textContent = formatCurrency(0);
    checkoutTotal.textContent = formatCurrency(0);
    if (checkoutForm) {
      checkoutForm.querySelector('button[type="submit"]').disabled = true;
    }
    return;
  }

  if (checkoutForm) {
    checkoutForm.querySelector('button[type="submit"]').disabled = false;
  }

  checkoutProducts.innerHTML = cart
    .map((item) => {
      const units = getTierUnits(item.tier);
      const subtotal = getItemSubtotal(item);
      return `
        <article class="checkout-product">
          <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" />
          <div>
            <strong>${escapeHtml(item.name)}</strong>
            <p>${escapeHtml(item.tier)} - ${formatCurrency(item.price)} c/u - ${units} unidades - Cantidad ${item.quantity}</p>
          </div>
          <strong>${formatCurrency(subtotal)}</strong>
        </article>
      `;
    })
    .join("");

  checkoutSubtotal.textContent = formatCurrency(totalPrice);
  checkoutTotal.textContent = formatCurrency(totalPrice);
};

const renderAdminOrders = () => {
  if (!adminOrders || !adminOrdersCount || !adminPendingCount) return;

  const orders = readOrders();
  const pending = orders.filter((order) => order.status !== "Completado").length;

  adminOrdersCount.textContent = String(orders.length);
  adminPendingCount.textContent = String(pending);

  if (!orders.length) {
    adminOrders.innerHTML = '<p class="admin-empty">Todavia no hay pedidos registrados.</p>';
    return;
  }

  adminOrders.innerHTML = orders
    .map((order, index) => {
      const itemsSummary = order.items
        .map((item) => `${escapeHtml(item.name)} ${escapeHtml(item.tier)} x${item.quantity}`)
        .join(", ");

      return `
        <article class="admin-order-card">
          <div class="admin-order-head">
            <div>
              <strong>${escapeHtml(order.id)}</strong>
              <p>${escapeHtml(order.customer.name)} - ${escapeHtml(order.customer.city)}</p>
            </div>
            <div class="admin-order-actions">
              <select data-order-status="${index}" aria-label="Estado del pedido">
                <option value="Pendiente" ${order.status === "Pendiente" ? "selected" : ""}>Pendiente</option>
                <option value="En preparacion" ${order.status === "En preparacion" ? "selected" : ""}>En preparacion</option>
                <option value="Completado" ${order.status === "Completado" ? "selected" : ""}>Completado</option>
                <option value="Con incidencia" ${order.status === "Con incidencia" ? "selected" : ""}>Con incidencia</option>
              </select>
            </div>
          </div>
          <p class="admin-order-meta">${new Date(order.createdAt).toLocaleString("es-AR")} - ${escapeHtml(order.customer.delivery)}</p>
          <p class="admin-order-items">${itemsSummary}</p>
          <div class="admin-order-foot">
            <span>${escapeHtml(order.customer.phone)}</span>
            <strong>${formatCurrency(order.total)}</strong>
          </div>
        </article>
      `;
    })
    .join("");
};

const renderAdminProducts = () => {
  if (!adminProductsList || !adminProductsCount) return;

  const products = readAdminProducts();
  adminProductsCount.textContent = String(products.length);

  if (!products.length) {
    adminProductsList.innerHTML = '<p class="admin-empty">Todavia no agregaste articulos desde el panel.</p>';
    return;
  }

  adminProductsList.innerHTML = products
    .map(
      (product, index) => `
        <article class="admin-product-card">
          <div>
            <strong>${escapeHtml(product.name)}</strong>
            <p>${escapeHtml(product.category)} - ${escapeHtml(product.material)} - ${escapeHtml(product.measure)}</p>
          </div>
          <div class="admin-product-meta">
            <span>x24 ${formatCurrency(product.price24)}</span>
            <span>x48 ${formatCurrency(product.price48)}</span>
            <button class="admin-delete" type="button" data-product-delete="${index}">Quitar</button>
          </div>
        </article>
      `
    )
    .join("");
};

const renderAdminPage = () => {
  if (!adminGate || !adminContent) return;

  const account = readAccount();
  const isAdmin = isAdminAccount(account);

  adminGate.hidden = isAdmin;
  adminContent.hidden = !isAdmin;

  if (!isAdmin) return;

  renderAdminOrders();
  renderAdminProducts();
};

const addCartItem = (button) => {
  const name = button.dataset.name || "Producto";
  const tier = button.dataset.tier || "x24";
  const price = Number(button.dataset.price || 0);
  const image = button.dataset.image || "./assets/mug-classic.svg";
  const cart = readCart();
  const existing = cart.find((item) => item.name === name && item.tier === tier);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ name, tier, price, image, quantity: 1 });
  }

  writeCart(cart);
  updateCartView();
  updateCheckoutView();
  animateCartFeedback();
};

const setupMenu = () => {
  if (!menuButton || !siteNav) return;

  menuButton.addEventListener("click", () => {
    const expanded = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!expanded));
    siteNav.classList.toggle("is-open", !expanded);
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuButton.setAttribute("aria-expanded", "false");
      siteNav.classList.remove("is-open");
    });
  });
};

const setupContactForm = () => {
  if (!contactForm) return;

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const message = String(formData.get("message") || "").trim();
    const subject = encodeURIComponent(`Consulta desde web Arcarsu - ${name || "Nuevo contacto"}`);
    const body = encodeURIComponent(
      `Nombre: ${name}\nEmail: ${email}\nTelefono: ${phone}\n\nMensaje:\n${message}`
    );

    window.location.href = `mailto:hola@arcarsu.com?subject=${subject}&body=${body}`;

    if (formNote) {
      formNote.textContent = "Se abrio tu cliente de correo para completar el envio.";
    }
  });
};

const setupAccount = () => {
  renderAccountState();

  if (notificationsToggle) {
    notificationsToggle.addEventListener("click", () => {
      closeAccountPanel();

      if (notificationsPanel?.hidden === false) {
        closeNotificationsPanel();
      } else {
        openNotificationsPanel();
      }
    });
  }

  if (accountToggle) {
    accountToggle.addEventListener("click", () => {
      const account = readAccount();
      closeNotificationsPanel();
      if (!account) {
        openAccountModal();
        return;
      }

      if (accountPanel?.hidden === false) {
        closeAccountPanel();
      } else {
        openAccountPanel();
      }
    });
  }

  if (accountModalClose) {
    accountModalClose.addEventListener("click", closeAccountModal);
  }

  if (accountOverlay) {
    accountOverlay.addEventListener("click", () => {
      closeAccountModal();
      closeAccountPanel();
      closeNotificationsPanel();
    });
  }

  if (accountForm) {
    accountForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const data = new FormData(accountForm);
      const email = String(data.get("email") || "").trim();
      const password = String(data.get("password") || "").trim();
      if (!email || !password) return;

      writeAccount({
        email,
        name: formatAccountName(email),
      });

      accountForm.reset();
      closeAccountModal();
      renderAccountState();
      renderAdminPage();
      openAccountPanel();
    });
  }

  if (accountLogout) {
    accountLogout.addEventListener("click", () => {
      writeAccount(null);
      closeAccountPanel();
      renderAccountState();
      renderAdminPage();
    });
  }

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.closest(".account-area")) return;
    closeAccountPanel();
    closeNotificationsPanel();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    closeAccountModal();
    closeAccountPanel();
    closeNotificationsPanel();
  });
};

const setupCartInteractions = () => {
  if (cartLaunch) {
    cartLaunch.addEventListener("click", openCart);
    cartLaunch.addEventListener("animationend", () => {
      cartLaunch.classList.remove("is-bouncing");
    });
  }

  if (cartCount) {
    cartCount.addEventListener("animationend", () => {
      cartCount.classList.remove("is-bouncing");
    });
  }

  if (cartClose) {
    cartClose.addEventListener("click", closeCart);
  }

  if (cartBackdrop) {
    cartBackdrop.addEventListener("click", closeCart);
  }

  document.querySelectorAll("[data-add-cart]").forEach((button) => {
    button.addEventListener("click", () => addCartItem(button));
  });

  if (cartItems) {
    cartItems.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;

      const actionTarget = target.closest("[data-cart-action]");
      if (!(actionTarget instanceof HTMLElement)) return;

      const action = actionTarget.dataset.cartAction;
      const index = Number(actionTarget.dataset.index);

      if (!action || Number.isNaN(index)) return;

      const cart = readCart();
      const item = cart[index];
      if (!item) return;

      if (action === "increase") item.quantity += 1;
      if (action === "decrease") item.quantity = Math.max(1, item.quantity - 1);
      if (action === "remove") cart.splice(index, 1);

      writeCart(cart);
      updateCartView();
      updateCheckoutView();
    });
  }
};

const setupFilters = () => {
  const filterBars = document.querySelectorAll(".filter-bar");
  if (!filterBars.length) return;

  filterBars.forEach((bar) => {
    const chips = bar.querySelectorAll(".filter-chip");
    const scope = bar.closest(".catalog-layout") || bar.parentElement;
    if (!scope) return;

    const cards = scope.querySelectorAll(".product-card[data-filter-group]");
    if (!cards.length) return;

    chips.forEach((chip) => {
      chip.addEventListener("click", () => {
        const filter = chip.dataset.filter || "all";

        chips.forEach((item) => item.classList.remove("is-active"));
        chip.classList.add("is-active");

        cards.forEach((card) => {
          const groups = (card.getAttribute("data-filter-group") || "").split(" ");
          const show = filter === "all" || groups.includes(filter);
          card.classList.toggle("is-hidden", !show);
        });
      });
    });
  });
};

let lightbox;
let lightboxImage;

const ensureLightbox = () => {
  if (lightbox && lightboxImage) return;

  lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.innerHTML = `
    <div class="lightbox-content" role="dialog" aria-modal="true" aria-label="Vista ampliada del producto">
      <button class="lightbox-close" type="button" aria-label="Cerrar imagen">x</button>
      <img class="lightbox-image" src="" alt="" />
    </div>
  `;

  document.body.appendChild(lightbox);
  lightboxImage = lightbox.querySelector(".lightbox-image");

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox || event.target.closest(".lightbox-close")) {
      lightbox.classList.remove("is-open");
    }
  });
};

const setupLightbox = () => {
  const visuals = document.querySelectorAll("[data-lightbox-src]");
  if (!visuals.length) return;

  ensureLightbox();

  visuals.forEach((visual) => {
    visual.addEventListener("click", () => {
      const src = visual.getAttribute("data-lightbox-src");
      const alt = visual.getAttribute("data-lightbox-alt") || "Producto";
      if (!src || !lightboxImage || !lightbox) return;

      lightboxImage.src = src;
      lightboxImage.alt = alt;
      lightbox.classList.add("is-open");
    });
  });
};

const setupCheckoutForm = () => {
  if (!checkoutForm) return;

  checkoutForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const cart = readCart();
    if (!cart.length) return;

    const data = new FormData(checkoutForm);
    const customer = {
      name: String(data.get("name") || "").trim(),
      phone: String(data.get("phone") || "").trim(),
      email: String(data.get("email") || "").trim(),
      address: String(data.get("address") || "").trim(),
      city: String(data.get("city") || "").trim(),
      delivery: String(data.get("delivery") || "").trim(),
      notes: String(data.get("notes") || "").trim(),
    };

    createOrderRecord(cart, customer);
    window.location.href = buildWhatsAppMessage(cart, customer);
  });
};

const setupAdmin = () => {
  if (!adminGate && !adminContent) return;

  renderAdminPage();

  if (adminOrders) {
    adminOrders.addEventListener("change", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLSelectElement)) return;

      const index = Number(target.dataset.orderStatus);
      if (Number.isNaN(index)) return;

      const orders = readOrders();
      const order = orders[index];
      if (!order) return;

      order.status = target.value;
      writeOrders(orders);
      renderAdminPage();
    });
  }

  if (adminProductForm) {
    adminProductForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const data = new FormData(adminProductForm);
      const products = readAdminProducts();

      products.unshift({
        name: String(data.get("name") || "").trim(),
        category: String(data.get("category") || "").trim(),
        material: String(data.get("material") || "").trim(),
        measure: String(data.get("measure") || "").trim(),
        price24: Number(data.get("price24") || 0),
        price48: Number(data.get("price48") || 0),
        image: String(data.get("image") || "").trim(),
      });

      writeAdminProducts(products);
      adminProductForm.reset();
      renderAdminProducts();
    });
  }

  if (adminProductsList) {
    adminProductsList.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;

      const button = target.closest("[data-product-delete]");
      if (!(button instanceof HTMLElement)) return;

      const index = Number(button.dataset.productDelete);
      if (Number.isNaN(index)) return;

      const products = readAdminProducts();
      products.splice(index, 1);
      writeAdminProducts(products);
      renderAdminProducts();
    });
  }
};

const setupClickableCards = () => {
  document.querySelectorAll("[data-card-link]").forEach((card) => {
    card.addEventListener("click", (event) => {
      const target = event.target;
      if (target instanceof HTMLElement && target.closest("a, button")) return;

      const href = card.getAttribute("data-card-link");
      if (!href) return;

      if (href.startsWith("http")) {
        window.open(href, "_blank", "noopener,noreferrer");
        return;
      }

      window.location.href = href;
    });
  });
};

setupMenu();
setupContactForm();
setupAccount();
setupCartInteractions();
setupFilters();
setupLightbox();
setupCheckoutForm();
setupAdmin();
setupClickableCards();
updateCartView();
updateCheckoutView();

if (yearTarget) {
  yearTarget.textContent = String(new Date().getFullYear());
}

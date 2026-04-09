const CART_KEY = "arcarsu-cart";
const ACCOUNT_KEY = "arcarsu-account";
const ORDER_KEY = "arcarsu-orders";
const ADMIN_PRODUCTS_KEY = "arcarsu-admin-products";
const BANNERS_KEY = "arcarsu-site-banners";
const ADMIN_EMAIL = "admin@arcarsu.com";
const WHATSAPP_URL = "https://wa.me/5491100000000";
const supabaseConfig = window.ARCARSU_SUPABASE_CONFIG || {};
const supabaseClient =
  supabaseConfig.url && supabaseConfig.anonKey && window.supabase?.createClient
    ? window.supabase.createClient(supabaseConfig.url, supabaseConfig.anonKey)
    : null;

const DEFAULT_NOTIFICATIONS = [
  {
    title: "Pedido completado",
    body: "Tu ultimo pedido fue preparado correctamente y esta listo para seguimiento.",
    kind: "success",
  },
  {
    title: "Sin stock parcial",
    body: "Uno de los productos pedidos necesita confirmacion antes de avanzar.",
    kind: "warning",
  },
  {
    title: "Actualizacion de pedido",
    body: "Hay cambios recientes en tiempos de entrega o preparacion.",
    kind: "info",
  },
];

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
const accountEmailInput = document.querySelector("#account-email");
const accountPasswordInput = document.querySelector("#account-password");
const accountAuthNote = document.querySelector("#account-auth-note");
const accountForgot = document.querySelector("#account-forgot");
const accountRegister = document.querySelector("#account-register");
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
const adminProductCancel = document.querySelector("#admin-product-cancel");
const adminTierList = document.querySelector("#admin-tier-list");
const adminTierAdd = document.querySelector("#admin-tier-add");
const adminBannerForm = document.querySelector("#admin-banner-form");
const adminBannersList = document.querySelector("#admin-banners-list");
const adminTabs = document.querySelectorAll("[data-admin-tab]");
const adminPanels = document.querySelectorAll("[data-admin-section]");
const homeBannerNodes = document.querySelectorAll("[data-home-banner]");

const BANNER_LABELS = {
  primary: "Inicio principal",
  secondary: "Inicio secundario",
  tazas: "Banner de tazas",
  mdf: "Banner de MDF",
};

const DEFAULT_BANNERS = {
  primary: {
    slot: "primary",
    eyebrow: "Promo de temporada",
    title: "Regalos personalizados para sorprender y vender mejor.",
    body: "Este bloque puede cambiarse por promociones mensuales, packs o campanas especiales.",
    buttonLabel: "Consultar promo",
    link: "https://wa.me/5491100000000",
    image: "./assets/stock/hands-wrapping.jpg",
  },
  secondary: {
    slot: "secondary",
    eyebrow: "Arcarsu",
    title: "Aqui puede ir otra promo o una categoria destacada.",
    body: "Este bloque puede adaptarse a una novedad, una campana visual o una linea principal del negocio.",
    buttonLabel: "Ver mas",
    link: "./contacto.html",
    image: "",
  },
  tazas: {
    slot: "tazas",
    eyebrow: "Campana destacada",
    title: "Espacio ideal para una promo real de tazas personalizadas.",
    body: "Puede mostrar temporada, regalos para fechas especiales o un lanzamiento de coleccion.",
    buttonLabel: "Consultar promo",
    link: "https://wa.me/5491100000000",
    image: "./assets/stock/mug-wood-table.jpg",
  },
  mdf: {
    slot: "mdf",
    eyebrow: "Coleccion MDF",
    title: "Espacio perfecto para destacar una promo real de cajas, cofres o souvenirs.",
    body: "Puede usarse para una campana por cantidad, una linea destacada o un lanzamiento estacional.",
    buttonLabel: "Consultar promo",
    link: "https://wa.me/5491100000000",
    image: "./assets/stock/craftsman-wood.jpg",
  },
};

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

const readBanners = () => {
  try {
    return JSON.parse(localStorage.getItem(BANNERS_KEY) || "null") || DEFAULT_BANNERS;
  } catch {
    return DEFAULT_BANNERS;
  }
};

const writeBanners = (banners) => {
  localStorage.setItem(BANNERS_KEY, JSON.stringify(banners));
};

const normalizePriceTiers = (tiers) => {
  const normalized = (Array.isArray(tiers) ? tiers : [])
    .map((tier) => ({
      minQty: Number(tier?.minQty || tier?.quantity || 0),
      unitPrice: Number(tier?.unitPrice || tier?.price || 0),
    }))
    .filter((tier) => tier.minQty > 0 && tier.unitPrice >= 0)
    .sort((a, b) => a.minQty - b.minQty);

  return normalized.length
    ? normalized
    : [
        { minQty: 24, unitPrice: 0 },
        { minQty: 48, unitPrice: 0 },
      ];
};

const getProductPriceTiers = (product) =>
  normalizePriceTiers(
    product?.priceTiers || [
      { minQty: 24, unitPrice: Number(product?.price24 || 0) },
      { minQty: 48, unitPrice: Number(product?.price48 || 0) },
    ]
  );

const renderAdminTierRows = (tiers = null) => {
  if (!adminTierList) return;

  const items = normalizePriceTiers(tiers || [
    { minQty: 24, unitPrice: 0 },
    { minQty: 48, unitPrice: 0 },
  ]);

  adminTierList.innerHTML = items
    .map(
      (tier, index) => `
        <div class="admin-tier-row">
          <div class="field">
            <label>Cantidad minima</label>
            <input type="number" min="1" name="tierQty" value="${escapeHtml(tier.minQty)}" required />
          </div>
          <div class="field">
            <label>Precio por unidad</label>
            <input type="number" min="1" name="tierPrice" value="${escapeHtml(tier.unitPrice)}" required />
          </div>
          <button class="admin-delete admin-tier-remove" type="button" data-tier-remove="${index}">Quitar</button>
        </div>
      `
    )
    .join("");
};

const readAdminTierRows = () => {
  if (!adminTierList) return normalizePriceTiers([]);

  const rows = Array.from(adminTierList.querySelectorAll(".admin-tier-row"));
  return normalizePriceTiers(
    rows.map((row) => {
      const quantityInput = row.querySelector('input[name="tierQty"]');
      const priceInput = row.querySelector('input[name="tierPrice"]');
      return {
        minQty: Number(quantityInput?.value || 0),
        unitPrice: Number(priceInput?.value || 0),
      };
    })
  );
};

const resetAdminProductForm = () => {
  if (!adminProductForm) return;
  adminProductForm.reset();
  const productIdField = adminProductForm.querySelector('input[name="productId"]');
  if (productIdField instanceof HTMLInputElement) {
    productIdField.value = "";
  }
  renderAdminTierRows();
  if (adminProductCancel) {
    adminProductCancel.hidden = true;
  }
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

const isAdminAccount = (account) =>
  account?.role === "admin" || String(account?.email || "").trim().toLowerCase() === ADMIN_EMAIL;

const openAccountModal = () => {
  if (!accountModal || !accountOverlay) return;
  setAccountAuthNote("");
  accountModal.hidden = false;
  accountOverlay.hidden = false;
  accountModal.setAttribute("aria-hidden", "false");
  closeAccountPanel();
};

const closeAccountModal = () => {
  if (!accountModal || !accountOverlay) return;
  setAccountAuthNote("");
  accountModal.hidden = true;
  accountOverlay.hidden = true;
  accountModal.setAttribute("aria-hidden", "true");
};

const setAccountAuthNote = (message, tone = "info") => {
  if (!accountAuthNote) return;
  if (!message) {
    accountAuthNote.hidden = true;
    accountAuthNote.textContent = "";
    accountAuthNote.dataset.tone = "";
    return;
  }

  accountAuthNote.hidden = false;
  accountAuthNote.textContent = message;
  accountAuthNote.dataset.tone = tone;
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

const renderNotifications = async () => {
  if (!notificationsPanel || !notificationsCount) return;

  let notifications = DEFAULT_NOTIFICATIONS;
  const account = readAccount();

  try {
    if (supabaseClient && account?.id) {
      const { data } = await supabaseClient
        .from("notifications")
        .select("id, title, body, kind, read, created_at")
        .order("created_at", { ascending: false })
        .limit(6);

      if (data?.length) {
        notifications = data;
      }
    }
  } catch {}

  notificationsCount.textContent = String(notifications.length);
  notificationsPanel.innerHTML = `
    <span class="account-panel-label">Notificaciones</span>
    <div class="notifications-list">
      ${notifications
        .map(
          (item) => `
            <article class="notification-item notification-${escapeHtml(item.kind || "info")}">
              <strong>${escapeHtml(item.title)}</strong>
              <p>${escapeHtml(item.body)}</p>
            </article>
          `
        )
        .join("")}
    </div>
  `;
};

const applyBannerData = (slot, data) => {
  const banner = document.querySelector(`[data-home-banner="${slot}"]`);
  if (!banner || !data) return;

  const eyebrow = banner.querySelector("[data-banner-eyebrow]") || banner.querySelector(".eyebrow");
  const title = banner.querySelector("[data-banner-title]") || banner.querySelector("h3");
  const body = banner.querySelector("[data-banner-body]") || banner.querySelector(".promo-content p");
  const button = banner.querySelector("[data-banner-button]") || banner.querySelector(".promo-content a");
  const image = banner.querySelector("[data-banner-image]");

  if (eyebrow) eyebrow.textContent = data.eyebrow || "";
  if (title) title.textContent = data.title || "";
  if (body) body.textContent = data.body || "";
  if (button) {
    button.textContent = data.buttonLabel || "Ver mas";
    button.href = data.link || "#";
  }
  if (image && data.image) {
    image.src = data.image;
    image.hidden = false;
  }
};

const renderSiteBanners = async () => {
  if (!homeBannerNodes.length && !adminBannersList) return;

  let banners = readBanners();

  try {
    if (supabaseClient) {
      const { data } = await supabaseClient
        .from("site_banners")
        .select("slot, eyebrow, title, body, button_label, link, image_url")
        .order("slot", { ascending: true });

      if (data?.length) {
        banners = data.reduce((acc, item) => {
          acc[item.slot] = {
            slot: item.slot,
            eyebrow: item.eyebrow,
            title: item.title,
            body: item.body,
            buttonLabel: item.button_label,
            link: item.link,
            image: item.image_url,
          };
          return acc;
        }, {});
      }
    }
  } catch {}

  const mergedBanners = Object.keys(DEFAULT_BANNERS).reduce((acc, key) => {
    acc[key] = { ...DEFAULT_BANNERS[key], ...(banners[key] || {}) };
    return acc;
  }, {});

  Object.entries(mergedBanners).forEach(([slot, banner]) => {
    applyBannerData(slot, banner);
  });

  if (adminBannersList) {
    adminBannersList.innerHTML = Object.values(mergedBanners)
      .map(
        (banner) => `
          <article class="admin-banner-card">
            <div>
              <strong>${escapeHtml(BANNER_LABELS[banner.slot] || banner.slot)}</strong>
              <p>${escapeHtml(banner.title)}</p>
            </div>
            <div class="admin-banner-meta">
              <span>${escapeHtml(banner.buttonLabel)}</span>
              <button class="admin-delete" type="button" data-banner-reset="${escapeHtml(banner.slot)}">Restaurar</button>
            </div>
          </article>
        `
      )
      .join("");
  }

  return mergedBanners;
};

const upsertBanner = async (banner) => {
  if (supabaseClient) {
    await supabaseClient.from("site_banners").upsert({
      slot: banner.slot,
      eyebrow: banner.eyebrow,
      title: banner.title,
      body: banner.body,
      button_label: banner.buttonLabel,
      link: banner.link,
      image_url: banner.image,
    });
    return;
  }

  const banners = readBanners();
  banners[banner.slot] = banner;
  writeBanners(banners);
};

const syncAccountFromSupabase = async () => {
  if (!supabaseClient) return readAccount();

  try {
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      writeAccount(null);
      renderAccountState();
      await renderNotifications();
      renderAdminPage();
      return null;
    }

    const { data: profile } = await supabaseClient
      .from("profiles")
      .select("full_name, role, email")
      .eq("id", user.id)
      .maybeSingle();

    const account = {
      id: user.id,
      email: profile?.email || user.email || "",
      name: profile?.full_name || formatAccountName(user.email),
      role: profile?.role || "customer",
    };

    writeAccount(account);
    renderAccountState();
    await renderNotifications();
    renderAdminPage();
    return account;
  } catch {
    return readAccount();
  }
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

const createOrderRecord = async (cart, customer) => {
  const account = readAccount();
  const { totalPrice } = getCartTotals(cart);

  if (supabaseClient) {
    const orderPayload = {
      user_id: account?.id || null,
      customer_name: customer.name,
      customer_email: customer.email,
      customer_phone: customer.phone,
      delivery: customer.delivery,
      address: customer.address,
      city: customer.city,
      notes: customer.notes,
      total: totalPrice,
    };

    const { data: order, error } = await supabaseClient
      .from("orders")
      .insert(orderPayload)
      .select("id")
      .single();

    if (!error && order?.id) {
      const itemsPayload = cart.map((item) => ({
        order_id: order.id,
        product_name: item.name,
        tier: item.tier,
        unit_price: item.price,
        package_units: getTierUnits(item.tier),
        package_quantity: item.quantity,
        subtotal: getItemSubtotal(item),
        image_url: item.image,
      }));

      await supabaseClient.from("order_items").insert(itemsPayload);
      return order;
    }
  }

  const orders = readOrders();
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

const renderAdminOrders = async () => {
  if (!adminOrders || !adminOrdersCount || !adminPendingCount) return;

  let orders = readOrders();

  if (supabaseClient) {
    const { data } = await supabaseClient
      .from("orders")
      .select(
        "id, created_at, status, total, customer_name, customer_email, customer_phone, delivery, address, city, notes, order_items(product_name, tier, package_quantity, unit_price, subtotal, image_url)"
      )
      .order("created_at", { ascending: false });

    if (data) {
      orders = data.map((order) => ({
        id: order.id,
        createdAt: order.created_at,
        status: order.status,
        total: Number(order.total || 0),
        customer: {
          name: order.customer_name,
          email: order.customer_email,
          phone: order.customer_phone,
          delivery: order.delivery,
          address: order.address,
          city: order.city,
          notes: order.notes,
        },
        items: (order.order_items || []).map((item) => ({
          name: item.product_name,
          tier: item.tier,
          quantity: item.package_quantity,
          price: Number(item.unit_price || 0),
          subtotal: Number(item.subtotal || 0),
          image: item.image_url || "",
        })),
      }));
    }
  }

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
              <select data-order-status="${index}" data-order-id="${escapeHtml(order.id)}" aria-label="Estado del pedido">
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

const renderAdminProducts = async () => {
  if (!adminProductsList || !adminProductsCount) return;

  let products = readAdminProducts();

  if (supabaseClient) {
    const { data, error } = await supabaseClient
        .from("admin_products")
        .select("id, name, category, material, measure, price_24, price_48, price_tiers, image_url")
        .order("created_at", { ascending: false });

    if (!error && data) {
      products = data.map((product) => ({
        id: product.id,
        name: product.name,
        category: product.category,
        material: product.material,
        measure: product.measure,
        price24: Number(product.price_24 || 0),
        price48: Number(product.price_48 || 0),
        priceTiers: getProductPriceTiers({
          price24: Number(product.price_24 || 0),
          price48: Number(product.price_48 || 0),
          priceTiers: product.price_tiers,
        }),
        image: product.image_url || "",
      }));
    } else {
      const { data: fallbackData } = await supabaseClient
        .from("admin_products")
        .select("id, name, category, material, measure, price_24, price_48, image_url")
        .order("created_at", { ascending: false });

      if (fallbackData) {
        products = fallbackData.map((product) => ({
          id: product.id,
          name: product.name,
          category: product.category,
          material: product.material,
          measure: product.measure,
          price24: Number(product.price_24 || 0),
          price48: Number(product.price_48 || 0),
          priceTiers: getProductPriceTiers({
            price24: Number(product.price_24 || 0),
            price48: Number(product.price_48 || 0),
          }),
          image: product.image_url || "",
        }));
      }
    }
  }

  adminProductsCount.textContent = String(products.length);

  if (!products.length) {
    adminProductsList.innerHTML = '<p class="admin-empty">Todavia no agregaste articulos desde el panel.</p>';
    return;
  }

  adminProductsList.innerHTML = products
    .map(
      (product, index) => {
        const tiers = getProductPriceTiers(product);
        return `
        <article class="admin-product-card">
          <div>
            <strong>${escapeHtml(product.name)}</strong>
            <p>${escapeHtml(product.category)} - ${escapeHtml(product.material)} - ${escapeHtml(product.measure)}</p>
            <div class="admin-tier-summary">
              ${tiers
                .map((tier) => `<span>Desde ${escapeHtml(tier.minQty)}: ${formatCurrency(tier.unitPrice)}</span>`)
                .join("")}
            </div>
          </div>
          <div class="admin-product-meta">
            <button class="button button-light admin-edit" type="button" data-product-edit="${index}" data-product-id="${escapeHtml(product.id || "")}" data-product-name="${escapeHtml(product.name)}" data-product-category="${escapeHtml(product.category)}" data-product-material="${escapeHtml(product.material)}" data-product-measure="${escapeHtml(product.measure)}" data-product-price-tiers="${escapeHtml(JSON.stringify(tiers))}" data-product-image-value="${escapeHtml(product.image || "")}">Editar</button>
            <button class="admin-delete" type="button" data-product-delete="${index}" data-product-id="${escapeHtml(product.id || "")}">Quitar</button>
          </div>
        </article>
      `;
      }
    )
    .join("");
};

const setAdminTab = (tabName = "overview") => {
  adminTabs.forEach((tab) => {
    const isActive = tab.dataset.adminTab === tabName;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });

  adminPanels.forEach((panel) => {
    const isActive = panel.dataset.adminSection === tabName;
    panel.classList.toggle("is-active", isActive);
    panel.hidden = !isActive;
  });
};

const renderAdminPage = async () => {
  if (!adminGate || !adminContent) return;

  const account = readAccount();
  const isAdmin = isAdminAccount(account);

  adminGate.hidden = isAdmin;
  adminContent.hidden = !isAdmin;

  if (!isAdmin) return;

  await renderSiteBanners();
  await renderAdminOrders();
  await renderAdminProducts();
  if (adminPanels.length) {
    const activeTab = document.querySelector("[data-admin-tab].is-active")?.getAttribute("data-admin-tab") || "overview";
    setAdminTab(activeTab);
  }
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
  renderNotifications();
  if (supabaseClient) {
    syncAccountFromSupabase();
    supabaseClient.auth.onAuthStateChange(() => {
      syncAccountFromSupabase();
    });
  }

  if (notificationsToggle) {
    notificationsToggle.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      closeAccountPanel();

      if (notificationsPanel?.hidden === false) {
        closeNotificationsPanel();
      } else {
        openNotificationsPanel();
      }
    });
  }

  if (accountToggle) {
    accountToggle.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
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
      setAccountAuthNote("");
      closeAccountModal();
      closeAccountPanel();
      closeNotificationsPanel();
    });
  }

  if (accountForm) {
    accountForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      setAccountAuthNote("");

      const data = new FormData(accountForm);
      const email = String(data.get("email") || "").trim();
      const password = String(data.get("password") || "").trim();
      if (!email || !password) return;

      if (supabaseClient) {
        const { error } = await supabaseClient.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setAccountAuthNote("No se pudo iniciar sesion. Revisa tus datos e intenta nuevamente.", "error");
          return;
        }

        await syncAccountFromSupabase();
      } else {
        writeAccount({
          email,
          name: formatAccountName(email),
          role: email.toLowerCase() === ADMIN_EMAIL ? "admin" : "customer",
        });
      }

      accountForm.reset();
      setAccountAuthNote("");
      closeAccountModal();
      renderAccountState();
      await renderNotifications();
      await renderAdminPage();
      openAccountPanel();
    });
  }

  if (accountForgot) {
    accountForgot.addEventListener("click", async () => {
      const email = String(accountEmailInput?.value || "").trim();
      if (!email) {
        setAccountAuthNote("Ingresa tu correo para enviarte el enlace de recuperacion.", "warning");
        accountEmailInput?.focus();
        return;
      }

      if (!supabaseClient) {
        setAccountAuthNote("La recuperacion por correo requiere la conexion con Supabase.", "warning");
        return;
      }

      const redirectTo = `${window.location.origin}/`;
      const { error } = await supabaseClient.auth.resetPasswordForEmail(email, { redirectTo });
      if (error) {
        setAccountAuthNote("No pudimos enviar el correo de recuperacion. Intenta otra vez.", "error");
        return;
      }

      setAccountAuthNote("Te enviamos un correo para recuperar tu contrasena.", "success");
    });
  }

  if (accountRegister) {
    accountRegister.addEventListener("click", async () => {
      const email = String(accountEmailInput?.value || "").trim();
      const password = String(accountPasswordInput?.value || "").trim();

      if (!email || !password) {
        setAccountAuthNote("Completa correo y contrasena para crear tu cuenta.", "warning");
        accountEmailInput?.focus();
        return;
      }

      if (!supabaseClient) {
        setAccountAuthNote("El registro real requiere la conexion con Supabase.", "warning");
        return;
      }

      const { error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        setAccountAuthNote("No pudimos crear la cuenta con esos datos. Prueba con otro correo.", "error");
        return;
      }

      setAccountAuthNote("Cuenta creada. Revisa tu correo para confirmarla y luego inicia sesion.", "success");
    });
  }

  if (accountLogout) {
    accountLogout.addEventListener("click", async () => {
      if (supabaseClient) {
        await supabaseClient.auth.signOut();
      }
      writeAccount(null);
      closeAccountPanel();
      renderAccountState();
      await renderNotifications();
      await renderAdminPage();
    });
  }

  document.addEventListener("click", (event) => {
    const target = event.target;
    const element = target instanceof Element ? target : null;
    if (element?.closest(".account-area")) return;
    if (element?.closest(".cart-launch")) return;
    closeAccountPanel();
    closeNotificationsPanel();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    setAccountAuthNote("");
    closeAccountModal();
    closeAccountPanel();
    closeNotificationsPanel();
  });
};

const setupGlobalControlFallbacks = () => {
  document.addEventListener("click", (event) => {
    const target = event.target;
    const element = target instanceof Element ? target : null;
    if (!element) return;

    const cartButton = element.closest(".cart-launch");
    if (cartButton instanceof HTMLElement) {
      event.preventDefault();
      openCart();
      return;
    }

    const notificationsButton = element.closest(".notifications-toggle");
    if (notificationsButton instanceof HTMLElement) {
      event.preventDefault();
      closeAccountPanel();
      if (notificationsPanel?.hidden === false) {
        closeNotificationsPanel();
      } else {
        openNotificationsPanel();
      }
      return;
    }

    const accountButton = element.closest(".account-toggle");
    if (accountButton instanceof HTMLElement) {
      event.preventDefault();
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
    }
  });
};

const setupCartInteractions = () => {
  if (cartLaunch) {
    cartLaunch.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      openCart();
    });
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

  checkoutForm.addEventListener("submit", async (event) => {
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

    await createOrderRecord(cart, customer);
    window.location.href = buildWhatsAppMessage(cart, customer);
  });
};

const setupAdmin = () => {
  if (!adminGate && !adminContent) return;

  renderAdminPage();

  if (adminOrders) {
    adminOrders.addEventListener("change", async (event) => {
      const target = event.target;
      if (!(target instanceof HTMLSelectElement)) return;

      const index = Number(target.dataset.orderStatus);
      if (Number.isNaN(index)) return;

      if (supabaseClient) {
        const orderId = target.dataset.orderId;
        if (!orderId) return;

        await supabaseClient.from("orders").update({ status: target.value }).eq("id", orderId);
      } else {
        const orders = readOrders();
        const order = orders[index];
        if (!order) return;

        order.status = target.value;
        writeOrders(orders);
      }

      await renderAdminPage();
    });
  }

  if (adminProductForm) {
    adminProductForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const data = new FormData(adminProductForm);
      const productId = String(data.get("productId") || "").trim();
      const priceTiers = readAdminTierRows();
      const price24 = priceTiers.find((tier) => tier.minQty === 24)?.unitPrice || priceTiers[0]?.unitPrice || 0;
      const price48 = priceTiers.find((tier) => tier.minQty === 48)?.unitPrice || priceTiers[1]?.unitPrice || priceTiers[0]?.unitPrice || 0;
      const product = {
        id: productId,
        name: String(data.get("name") || "").trim(),
        category: String(data.get("category") || "").trim(),
        material: String(data.get("material") || "").trim(),
        measure: String(data.get("measure") || "").trim(),
        price24,
        price48,
        priceTiers,
        image: String(data.get("image") || "").trim(),
      };

      if (supabaseClient) {
        const account = readAccount();
        const payload = {
          created_by: account?.id || null,
          name: product.name,
          category: product.category,
          material: product.material,
          measure: product.measure,
          price_24: product.price24,
          price_48: product.price48,
          price_tiers: product.priceTiers,
          image_url: product.image,
        };

        let response;
        try {
          if (productId) {
            response = await supabaseClient.from("admin_products").update(payload).eq("id", productId);
          } else {
            response = await supabaseClient.from("admin_products").insert(payload);
          }
        } catch {
          response = { error: new Error("fallback") };
        }

        if (response?.error) {
          const fallbackPayload = {
            created_by: account?.id || null,
            name: product.name,
            category: product.category,
            material: product.material,
            measure: product.measure,
            price_24: product.price24,
            price_48: product.price48,
            image_url: product.image,
          };

          if (productId) {
            await supabaseClient.from("admin_products").update(fallbackPayload).eq("id", productId);
          } else {
            await supabaseClient.from("admin_products").insert(fallbackPayload);
          }
        }
      } else {
        const products = readAdminProducts();
        if (productId) {
          const currentIndex = products.findIndex((item) => String(item.id || "") === productId);
          if (currentIndex >= 0) {
            products[currentIndex] = { ...products[currentIndex], ...product };
          }
        } else {
          products.unshift({ ...product, id: `local-${Date.now()}` });
        }
        writeAdminProducts(products);
      }

      resetAdminProductForm();
      await renderAdminProducts();
    });
  }

  if (adminProductCancel) {
    adminProductCancel.addEventListener("click", () => {
      resetAdminProductForm();
    });
  }

  if (adminTierAdd) {
    adminTierAdd.addEventListener("click", () => {
      const tiers = readAdminTierRows();
      const nextQty = (tiers[tiers.length - 1]?.minQty || 0) + 24 || 24;
      tiers.push({ minQty: nextQty, unitPrice: 0 });
      renderAdminTierRows(tiers);
    });
  }

  if (adminTierList) {
    adminTierList.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;

      const removeButton = target.closest("[data-tier-remove]");
      if (!(removeButton instanceof HTMLElement)) return;

      const index = Number(removeButton.dataset.tierRemove);
      if (Number.isNaN(index)) return;

      const tiers = readAdminTierRows();
      tiers.splice(index, 1);
      renderAdminTierRows(tiers.length ? tiers : [{ minQty: 24, unitPrice: 0 }]);
    });
  }

  if (adminProductsList) {
    adminProductsList.addEventListener("click", async (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;

      const editButton = target.closest("[data-product-edit]");
      if (editButton instanceof HTMLElement && adminProductForm) {
        const productIdField = adminProductForm.querySelector('input[name="productId"]');
        const nameField = adminProductForm.querySelector('input[name="name"]');
        const categoryField = adminProductForm.querySelector('[name="category"]');
        const materialField = adminProductForm.querySelector('input[name="material"]');
        const measureField = adminProductForm.querySelector('input[name="measure"]');
        const imageField = adminProductForm.querySelector('input[name="image"]');

        if (productIdField instanceof HTMLInputElement) productIdField.value = editButton.dataset.productId || "";
        if (nameField instanceof HTMLInputElement) nameField.value = editButton.dataset.productName || "";
        if (categoryField instanceof HTMLSelectElement) categoryField.value = editButton.dataset.productCategory || "Tazas";
        if (materialField instanceof HTMLInputElement) materialField.value = editButton.dataset.productMaterial || "";
        if (measureField instanceof HTMLInputElement) measureField.value = editButton.dataset.productMeasure || "";
        if (imageField instanceof HTMLInputElement) imageField.value = editButton.dataset.productImageValue || "";
        try {
          renderAdminTierRows(JSON.parse(editButton.dataset.productPriceTiers || "[]"));
        } catch {
          renderAdminTierRows();
        }
        if (adminProductCancel) adminProductCancel.hidden = false;
        setAdminTab("catalog");
        adminProductForm.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }

      const button = target.closest("[data-product-delete]");
      if (!(button instanceof HTMLElement)) return;

      if (supabaseClient) {
        const productId = button.dataset.productId;
        if (!productId) return;
        await supabaseClient.from("admin_products").delete().eq("id", productId);
      } else {
        const index = Number(button.dataset.productDelete);
        if (Number.isNaN(index)) return;

        const products = readAdminProducts();
        products.splice(index, 1);
        writeAdminProducts(products);
      }

      await renderAdminProducts();
    });
  }

  if (adminBannerForm) {
    adminBannerForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const data = new FormData(adminBannerForm);
      const banner = {
        slot: String(data.get("slot") || "primary"),
        eyebrow: String(data.get("eyebrow") || "").trim(),
        title: String(data.get("title") || "").trim(),
        body: String(data.get("body") || "").trim(),
        buttonLabel: String(data.get("buttonLabel") || "").trim(),
        link: String(data.get("link") || "").trim(),
        image: String(data.get("image") || "").trim(),
      };

      await upsertBanner(banner);
      adminBannerForm.reset();
      await renderSiteBanners();
    });
  }

  if (adminBannersList) {
    adminBannersList.addEventListener("click", async (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;

      const button = target.closest("[data-banner-reset]");
      if (!(button instanceof HTMLElement)) return;

      const slot = button.dataset.bannerReset;
      if (!slot || !(slot in DEFAULT_BANNERS)) return;

      await upsertBanner(DEFAULT_BANNERS[slot]);
      await renderSiteBanners();
    });
  }

  if (adminTabs.length) {
    adminTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        setAdminTab(tab.dataset.adminTab || "overview");
      });
    });
  }

  renderAdminTierRows();
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
setupGlobalControlFallbacks();
setupCartInteractions();
setupFilters();
setupLightbox();
setupCheckoutForm();
setupAdmin();
setupClickableCards();
renderSiteBanners();
updateCartView();
updateCheckoutView();

if (yearTarget) {
  yearTarget.textContent = String(new Date().getFullYear());
}

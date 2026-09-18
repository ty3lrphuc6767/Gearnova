/* GearNova - trang cửa hàng */
(function () {
  "use strict";

  const CATEGORY_LABELS = {
    ALL: "Tất cả",
    CPU: "CPU",
    GPU: "GPU",
    RAM: "RAM",
    SSD: "SSD",
    GEAR: "Gaming Gear",
  };

  // Mật khẩu này được yêu cầu là cố định cho bản demo.
  // Nếu đổi, phải đổi cùng giá trị trong supabase-setup.sql.
  const ADMIN_PASSWORD = "GearNova@2026";
  const ADMIN_SESSION_KEY = "gearnova_admin_unlocked";
  const LOCAL_PRODUCTS_KEY = "gearnova_local_products";
  const HIDDEN_PRODUCTS_KEY = "gearnova_hidden_products";

  const DEFAULT_PRODUCTS = [
    { id: "demo-cpu-7600", name: "AMD Ryzen 5 7600", category: "CPU", price: 4890000, description: "CPU 6 nhân 12 luồng nền tảng AM5, phù hợp gaming Full HD và đa nhiệm.", specs: ["6 nhân / 12 luồng", "Socket AM5", "Zen 4", "TDP 65W"] },
    { id: "demo-cpu-14700", name: "Intel Core i7-14700F", category: "CPU", price: 9290000, description: "Hiệu năng mạnh cho gaming, dựng hình và workstation phổ thông.", specs: ["20 nhân / 28 luồng", "Socket LGA1700", "Không tích hợp GPU", "Turbo tối đa 5.4 GHz"] },
    { id: "demo-gpu-4060", name: "ASUS Dual GeForce RTX 4060 OC 8GB", category: "GPU", price: 8290000, description: "Card đồ họa RTX 4060 cho game Full HD với Ray Tracing và DLSS 3.", specs: ["8GB GDDR6", "NVIDIA Ada Lovelace", "Ray Tracing", "DLSS 3"] },
    { id: "demo-gpu-4070", name: "Gigabyte RTX 4070 SUPER Gaming OC 12GB", category: "GPU", price: 17990000, description: "Lựa chọn mạnh cho gaming độ phân giải 2K và làm đồ họa.", specs: ["12GB GDDR6X", "Triple Fan", "Ray Tracing", "DLSS 3"] },
    { id: "demo-ram-fury", name: "Kingston Fury Beast 32GB DDR5 Kit", category: "RAM", price: 2490000, description: "Bộ RAM DDR5 32GB cân bằng cho game, thiết kế và công việc đa nhiệm.", specs: ["32GB (2 × 16GB)", "DDR5", "Dual Channel", "Tản nhiệt kim loại"] },
    { id: "demo-ram-corsair", name: "Corsair Vengeance RGB 32GB DDR5", category: "RAM", price: 2890000, description: "RAM DDR5 RGB cho các bộ máy gaming cao cấp.", specs: ["32GB", "DDR5", "RGB", "XMP / EXPO"] },
    { id: "demo-ssd-990", name: "Samsung 990 PRO 2TB NVMe", category: "SSD", price: 4590000, description: "SSD NVMe PCIe 4.0 tốc độ cao cho game và workstation.", specs: ["2TB", "M.2 NVMe", "PCIe 4.0", "Hiệu năng cao"] },
    { id: "demo-ssd-wd", name: "WD Black SN850X 1TB NVMe", category: "SSD", price: 2690000, description: "Ổ SSD gaming có tốc độ đọc ghi mạnh và độ trễ thấp.", specs: ["1TB", "PCIe 4.0", "M.2 2280", "NVMe"] },
    { id: "demo-gear-keychron", name: "Keychron K2 Pro Mechanical Keyboard", category: "GEAR", price: 2390000, description: "Bàn phím cơ 75% nhỏ gọn, kết nối không dây và USB-C.", specs: ["Layout 75%", "Mechanical", "Bluetooth", "USB-C"] },
    { id: "demo-gear-g502", name: "Logitech G502 X Gaming Mouse", category: "GEAR", price: 1890000, description: "Chuột gaming công thái học với cảm biến chính xác và nút tùy biến.", specs: ["Gaming Sensor", "Nút lập trình", "Ergonomic", "USB"] },
  ];

  document.addEventListener("DOMContentLoaded", boot);

  async function boot() {
    const session = await window.GearNovaAuth?.requireSession();
    if (!session) return;

    const user = session.user;
    const el = getElements();
    const profile = await window.GearNovaAuth.getProfile(user.id);
    const state = {
      user,
      profile,
      isAdmin: sessionStorage.getItem(ADMIN_SESSION_KEY) === "1",
      products: [],
      category: "ALL",
      search: "",
      cart: loadCart(),
      databaseAvailable: false,
      toastTimer: null,
    };

    renderAccount(state, el);
    bindNavigation(state, el);
    bindCategories(state, el);
    bindSearch(state, el);
    bindUserMenu(state, el);
    bindModalControls(state, el);
    bindProducts(state, el);
    bindCart(state, el);
    bindAdmin(state, el);

    await loadProducts(state, el);
    renderProducts(state, el);
    renderCart(state, el);
    updateActiveNavigation(el);

    window.sb.auth.onAuthStateChange((event, nextSession) => {
      if (event === "SIGNED_OUT" || !nextSession) {
        sessionStorage.removeItem(ADMIN_SESSION_KEY);
        window.location.replace("./login.html");
      }
    });

    window.addEventListener("resize", () => moveNavIndicator(el));
    document.fonts?.ready?.then(() => moveNavIndicator(el));
    hideLoader(el);
  }

  function getElements() {
    return {
      pageLoader: document.getElementById("pageLoader"),
      siteHeader: document.getElementById("siteHeader"),
      mainNav: document.getElementById("mainNav"),
      navLinks: [...document.querySelectorAll(".nav-link")],
      navIndicator: document.getElementById("navIndicator"),
      categoryCards: [...document.querySelectorAll(".category-card")],
      productGrid: document.getElementById("productGrid"),
      productResult: document.getElementById("productResult"),
      emptyProducts: document.getElementById("emptyProducts"),
      openSearchBtn: document.getElementById("openSearchBtn"),
      searchModal: document.getElementById("searchModal"),
      searchInput: document.getElementById("searchInput"),
      searchForm: document.getElementById("searchForm"),
      userArea: document.getElementById("userArea"),
      userBtn: document.getElementById("userBtn"),
      userMenu: document.getElementById("userMenu"),
      usernameDisplay: document.getElementById("usernameDisplay"),
      menuUsername: document.getElementById("menuUsername"),
      menuEmail: document.getElementById("menuEmail"),
      userInitial: document.getElementById("userInitial"),
      profileBtn: document.getElementById("profileBtn"),
      profileModal: document.getElementById("profileModal"),
      profileDetail: document.getElementById("profileDetail"),
      logoutBtn: document.getElementById("logoutBtn"),
      adminEntryBtn: document.getElementById("adminEntryBtn"),
      adminModal: document.getElementById("adminModal"),
      adminModalTitle: document.getElementById("adminModalTitle"),
      adminLoginForm: document.getElementById("adminLoginForm"),
      adminPassword: document.getElementById("adminPassword"),
      adminLoginBtn: document.getElementById("adminLoginBtn"),
      adminLoginMessage: document.getElementById("adminLoginMessage"),
      adminPanel: document.getElementById("adminPanel"),
      productForm: document.getElementById("productForm"),
      productName: document.getElementById("productName"),
      productCategory: document.getElementById("productCategory"),
      productPrice: document.getElementById("productPrice"),
      productImageUrl: document.getElementById("productImageUrl"),
      productDescription: document.getElementById("productDescription"),
      productSpecs: document.getElementById("productSpecs"),
      productFormMessage: document.getElementById("productFormMessage"),
      addProductBtn: document.getElementById("addProductBtn"),
      productModal: document.getElementById("productModal"),
      productDetail: document.getElementById("productDetail"),
      cartBtn: document.getElementById("cartBtn"),
      cartOverlay: document.getElementById("cartOverlay"),
      cartDrawer: document.getElementById("cartDrawer"),
      closeCartBtn: document.getElementById("closeCartBtn"),
      cartItems: document.getElementById("cartItems"),
      cartEmpty: document.getElementById("cartEmpty"),
      cartCount: document.getElementById("cartCount"),
      cartTotal: document.getElementById("cartTotal"),
      checkoutBtn: document.getElementById("checkoutBtn"),
      toast: document.getElementById("toast"),
    };
  }

  function renderAccount(state, el) {
    const metadataName = state.user.user_metadata?.display_name || state.user.user_metadata?.full_name;
    const displayName = state.profile?.display_name || metadataName || state.user.email?.split("@")[0] || "Tài khoản";
    const email = state.profile?.email || state.user.email || "";

    el.usernameDisplay.textContent = displayName;
    el.menuUsername.textContent = displayName;
    el.menuEmail.textContent = email;
    el.userInitial.textContent = displayName.trim().charAt(0).toUpperCase() || "U";
    el.adminEntryBtn.textContent = state.isAdmin ? "Quản trị sản phẩm" : "Mở quản trị";

    el.profileDetail.innerHTML = [
      ["Họ tên", displayName],
      ["Email", email],
      ["Vai trò", state.isAdmin ? "Quản trị viên" : "Khách hàng"],
    ].map(([label, value]) => `<dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd>`).join("");
  }

  async function loadProducts(state, el) {
    const { data, error } = await window.sb
      .from("products")
      .select("id, name, category, price, image_url, description, specs, created_at")
      .order("created_at", { ascending: false });

    let baseProducts;
    if (error) {
      console.warn("Không tải được bảng products:", error.message);
      state.databaseAvailable = false;
      baseProducts = DEFAULT_PRODUCTS.map((item) => normalizeProduct(item, "fallback"));
    } else {
      state.databaseAvailable = true;
      baseProducts = data?.length
        ? data.map((item) => normalizeProduct(item, "database"))
        : DEFAULT_PRODUCTS.map((item) => normalizeProduct(item, "fallback"));
    }

    const hiddenIds = new Set(loadHiddenProducts());
    const localProducts = loadLocalProducts();
    state.products = [...localProducts, ...baseProducts].filter((product) => !hiddenIds.has(product.id));
  }

  function normalizeProduct(item, source) {
    const category = normalizeCategory(item.category);
    return {
      id: String(item.id),
      name: String(item.name || "Sản phẩm chưa đặt tên"),
      category,
      price: Number(item.price || 0),
      image_url: safeImageUrl(item.image_url, category),
      description: String(item.description || "Chưa có mô tả."),
      specs: normalizeSpecs(item.specs),
      source,
    };
  }

  function normalizeCategory(value) {
    const raw = String(value || "GEAR").trim().toUpperCase();
    if (raw === "VGA") return "GPU";
    if (raw === "GEAR") return "GEAR";
    return CATEGORY_LABELS[raw] ? raw : "GEAR";
  }

  function normalizeSpecs(value) {
    if (Array.isArray(value)) return value.filter(Boolean).map((item) => String(item));
    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) return parsed.filter(Boolean).map((item) => String(item));
      } catch (_) {
        return value.split(/\r?\n|,/).map((item) => item.trim()).filter(Boolean);
      }
    }
    return [];
  }

  function bindNavigation(state, el) {
    el.navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        setActiveNavigation(link.dataset.section, el);
      });
    });

    let scrollFrame = null;
    window.addEventListener("scroll", () => {
      if (scrollFrame) return;
      scrollFrame = requestAnimationFrame(() => {
        updateActiveNavigation(el);
        scrollFrame = null;
      });
    }, { passive: true });
  }

  function updateActiveNavigation(el) {
    const sections = [...document.querySelectorAll("main .section-anchor")];
    const headerOffset = (el.siteHeader?.offsetHeight || 0) + 24;
    let activeId = sections[0]?.id || "home";

    for (const section of sections) {
      if (window.scrollY + headerOffset >= section.offsetTop) activeId = section.id;
    }
    setActiveNavigation(activeId, el);
  }

  function setActiveNavigation(id, el) {
    const next = el.navLinks.find((link) => link.dataset.section === id) || el.navLinks[0];
    if (!next) return;
    el.navLinks.forEach((link) => link.classList.toggle("is-active", link === next));
    moveNavIndicator(el);
  }

  function moveNavIndicator(el) {
    const active = el.mainNav?.querySelector(".nav-link.is-active");
    if (!active || !el.navIndicator) return;
    el.navIndicator.style.width = `${active.offsetWidth}px`;
    el.navIndicator.style.transform = `translateX(${active.offsetLeft}px)`;
  }

  function bindCategories(state, el) {
    el.categoryCards.forEach((card) => {
      card.addEventListener("click", () => {
        state.category = card.dataset.category;
        el.categoryCards.forEach((item) => item.classList.toggle("is-active", item === card));
        renderProducts(state, el);
        document.getElementById("products")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  function bindSearch(state, el) {
    el.openSearchBtn.addEventListener("click", () => {
      openModal(el.searchModal, el);
      el.searchInput.value = state.search;
      setTimeout(() => el.searchInput.focus(), 120);
    });

    el.searchInput.addEventListener("input", (event) => {
      state.search = event.target.value.trim();
      renderProducts(state, el);
    });

    el.searchForm.addEventListener("submit", (event) => {
      event.preventDefault();
      state.search = el.searchInput.value.trim();
      renderProducts(state, el);
      closeModal(el.searchModal, el);
      document.getElementById("products")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function bindUserMenu(state, el) {
    el.userBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      const isOpen = el.userMenu.classList.toggle("is-open");
      el.userBtn.setAttribute("aria-expanded", String(isOpen));
    });

    document.addEventListener("click", (event) => {
      if (!el.userArea.contains(event.target)) closeUserMenu(el);
    });

    el.profileBtn.addEventListener("click", () => {
      closeUserMenu(el);
      openModal(el.profileModal, el);
    });

    el.adminEntryBtn.addEventListener("click", () => {
      closeUserMenu(el);
      configureAdminModal(state, el);
      openModal(el.adminModal, el);
      if (state.isAdmin) el.productName.focus();
      else setTimeout(() => el.adminPassword.focus(), 100);
    });

    el.logoutBtn.addEventListener("click", async () => {
      el.logoutBtn.disabled = true;
      el.logoutBtn.textContent = "Đang đăng xuất…";
      try {
        sessionStorage.removeItem(ADMIN_SESSION_KEY);
        await window.GearNovaAuth.signOut();
      } catch (error) {
        console.error("Lỗi đăng xuất:", error);
      } finally {
        window.location.replace("./login.html");
      }
    });
  }

  function closeUserMenu(el) {
    el.userMenu.classList.remove("is-open");
    el.userBtn.setAttribute("aria-expanded", "false");
  }

  function bindModalControls(state, el) {
    document.querySelectorAll("[data-close-modal]").forEach((button) => {
      button.addEventListener("click", () => {
        const target = document.getElementById(button.dataset.closeModal);
        closeModal(target, el);
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      document.querySelectorAll(".modal.is-open").forEach((modal) => closeModal(modal, el));
      closeCart(el);
      closeUserMenu(el);
    });
  }

  function openModal(modal, el) {
    if (!modal) return;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    updateBodyLock(el);
  }

  function closeModal(modal, el) {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    updateBodyLock(el);
  }

  function updateBodyLock(el) {
    const hasModal = Boolean(document.querySelector(".modal.is-open"));
    const cartOpen = el.cartDrawer.classList.contains("is-open");
    document.body.classList.toggle("no-scroll", hasModal || cartOpen);
  }

  function renderProducts(state, el) {
    const keyword = normalizeText(state.search);
    const filtered = state.products.filter((product) => {
      const categoryMatch = state.category === "ALL" || product.category === state.category;
      const searchable = normalizeText(`${product.name} ${product.category} ${product.description} ${product.specs.join(" ")}`);
      return categoryMatch && searchable.includes(keyword);
    });

    el.emptyProducts.hidden = filtered.length !== 0;
    el.productGrid.innerHTML = filtered.map((product) => productCardHtml(product, state.isAdmin)).join("");

    if (state.search) {
      el.productResult.textContent = `${filtered.length} kết quả cho “${state.search}”`;
    } else if (state.category !== "ALL") {
      el.productResult.textContent = `${CATEGORY_LABELS[state.category]} · ${filtered.length} sản phẩm`;
    } else {
      el.productResult.textContent = `Hiển thị ${filtered.length} sản phẩm`;
    }
  }

  function productCardHtml(product, isAdmin) {
    const productId = escapeHtml(product.id);
    const image = escapeHtml(product.image_url);
    const deleteButton = isAdmin
      ? `<button class="card-action admin-delete" type="button" data-action="delete" data-product-id="${productId}">Xóa sản phẩm</button>`
      : "";

    return `
      <article class="product-card">
        <div class="product-image-wrap">
          <img src="${image}" alt="${escapeHtml(product.name)}" loading="lazy" />
          <span class="product-category-tag">${escapeHtml(CATEGORY_LABELS[product.category])}</span>
        </div>
        <div class="product-body">
          <h3>${escapeHtml(product.name)}</h3>
          <p class="product-price">${formatVnd(product.price)}</p>
          <div class="product-actions">
            <button class="card-action" type="button" data-action="detail" data-product-id="${productId}">Chi tiết</button>
            <button class="card-action add-cart" type="button" data-action="add-cart" data-product-id="${productId}">Thêm giỏ</button>
            ${deleteButton}
          </div>
        </div>
      </article>`;
  }

  function bindProducts(state, el) {
    el.productGrid.addEventListener("click", async (event) => {
      const button = event.target.closest("[data-action]");
      if (!button) return;
      const product = findProduct(state, button.dataset.productId);
      if (!product) return;

      if (button.dataset.action === "detail") {
        openProductDetail(product, state, el);
      }
      if (button.dataset.action === "add-cart") {
        addToCart(product, state, el);
      }
      if (button.dataset.action === "delete") {
        await deleteProduct(product, state, el);
      }
    });

    el.productDetail.addEventListener("click", (event) => {
      const addButton = event.target.closest("[data-action='add-cart']");
      if (!addButton) return;
      const product = findProduct(state, addButton.dataset.productId);
      if (!product) return;
      addToCart(product, state, el);
      closeModal(el.productModal, el);
      openCart(el);
    });
  }

  function openProductDetail(product, state, el) {
    const specs = product.specs.length
      ? product.specs.map((spec) => `<li>${escapeHtml(spec)}</li>`).join("")
      : "<li>Đang cập nhật thông số</li>";
    el.productDetail.innerHTML = `
      <div class="product-detail">
        <div class="product-detail-image"><img src="${escapeHtml(product.image_url)}" alt="${escapeHtml(product.name)}" /></div>
        <div class="product-detail-info">
          <p class="eyebrow">${escapeHtml(CATEGORY_LABELS[product.category])}</p>
          <h2 id="productModalTitle">${escapeHtml(product.name)}</h2>
          <p>${escapeHtml(product.description)}</p>
          <ul class="spec-list">${specs}</ul>
          <p class="detail-price">${formatVnd(product.price)}</p>
          <button class="button button-primary full-width" type="button" data-action="add-cart" data-product-id="${escapeHtml(product.id)}">Thêm vào giỏ hàng</button>
        </div>
      </div>`;
    openModal(el.productModal, el);
  }

  function bindCart(state, el) {
    el.cartBtn.addEventListener("click", () => openCart(el));
    el.closeCartBtn.addEventListener("click", () => closeCart(el));
    el.cartOverlay.addEventListener("click", () => closeCart(el));

    el.cartItems.addEventListener("click", (event) => {
      const button = event.target.closest("[data-cart-action]");
      if (!button) return;
      const id = button.dataset.productId;
      const item = state.cart.find((cartItem) => cartItem.id === id);
      if (!item) return;

      if (button.dataset.cartAction === "plus") item.quantity += 1;
      if (button.dataset.cartAction === "minus") item.quantity -= 1;
      if (button.dataset.cartAction === "remove" || item.quantity <= 0) {
        state.cart = state.cart.filter((cartItem) => cartItem.id !== id);
      }
      saveCart(state.cart);
      renderCart(state, el);
    });

    el.checkoutBtn.addEventListener("click", () => {
      showToast(state.cart.length ? "Chức năng thanh toán đang được phát triển." : "Giỏ hàng đang trống.", el, !state.cart.length);
    });
  }

  function addToCart(product, state, el) {
    const item = state.cart.find((cartItem) => cartItem.id === product.id);
    if (item) item.quantity += 1;
    else state.cart.push({ id: product.id, quantity: 1 });
    saveCart(state.cart);
    renderCart(state, el);
    showToast(`Đã thêm “${product.name}” vào giỏ hàng.`, el);
  }

  function renderCart(state, el) {
    const validItems = state.cart.filter((item) => findProduct(state, item.id));
    if (validItems.length !== state.cart.length) {
      state.cart = validItems;
      saveCart(state.cart);
    }

    let totalQuantity = 0;
    let total = 0;
    el.cartItems.innerHTML = state.cart.map((item) => {
      const product = findProduct(state, item.id);
      totalQuantity += item.quantity;
      total += product.price * item.quantity;
      return `
        <article class="cart-row">
          <img src="${escapeHtml(product.image_url)}" alt="${escapeHtml(product.name)}" />
          <div class="cart-row-main">
            <h3 title="${escapeHtml(product.name)}">${escapeHtml(product.name)}</h3>
            <p>${formatVnd(product.price)}</p>
            <div class="cart-controls">
              <button type="button" data-cart-action="minus" data-product-id="${escapeHtml(product.id)}" aria-label="Giảm số lượng">−</button>
              <span>${item.quantity}</span>
              <button type="button" data-cart-action="plus" data-product-id="${escapeHtml(product.id)}" aria-label="Tăng số lượng">+</button>
              <button class="remove-cart-item" type="button" data-cart-action="remove" data-product-id="${escapeHtml(product.id)}">Xóa</button>
            </div>
          </div>
        </article>`;
    }).join("");
    el.cartEmpty.hidden = state.cart.length !== 0;
    el.cartCount.textContent = String(totalQuantity);
    el.cartTotal.textContent = formatVnd(total);
  }

  function openCart(el) {
    el.cartDrawer.classList.add("is-open");
    el.cartDrawer.setAttribute("aria-hidden", "false");
    el.cartOverlay.classList.add("is-open");
    el.cartBtn.setAttribute("aria-expanded", "true");
    updateBodyLock(el);
  }

  function closeCart(el) {
    el.cartDrawer.classList.remove("is-open");
    el.cartDrawer.setAttribute("aria-hidden", "true");
    el.cartOverlay.classList.remove("is-open");
    el.cartBtn.setAttribute("aria-expanded", "false");
    updateBodyLock(el);
  }

  function configureAdminModal(state, el) {
    el.adminLoginMessage.textContent = "";
    el.productFormMessage.textContent = "";
    const isAdmin = state.isAdmin;
    el.adminModalTitle.textContent = isAdmin ? "Quản trị sản phẩm" : "Mở quyền quản trị";
    el.adminLoginForm.hidden = isAdmin;
    el.adminPanel.hidden = !isAdmin;
    el.adminLoginBtn.textContent = "Mở quản trị";
    if (!isAdmin) el.adminPassword.value = "";
  }

  function bindAdmin(state, el) {
    el.adminLoginForm.addEventListener("submit", (event) => {
      event.preventDefault();
      setFormMessage(el.adminLoginMessage, "");
      const password = el.adminPassword.value;
      if (!password) {
        setFormMessage(el.adminLoginMessage, "Hãy nhập mật khẩu quản trị.", "error");
        return;
      }
      if (password !== ADMIN_PASSWORD) {
        setFormMessage(el.adminLoginMessage, "Mật khẩu quản trị chưa đúng.", "error");
        return;
      }

      sessionStorage.setItem(ADMIN_SESSION_KEY, "1");
      state.isAdmin = true;
      renderAccount(state, el);
      configureAdminModal(state, el);
      renderProducts(state, el);
      showToast("Đã mở quyền quản trị sản phẩm.", el);
      setTimeout(() => el.productName.focus(), 50);
    });

    el.productForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!state.isAdmin) return;
      setFormMessage(el.productFormMessage, "");

      const name = el.productName.value.trim();
      const category = normalizeCategory(el.productCategory.value);
      const price = Number(el.productPrice.value);
      const description = el.productDescription.value.trim();
      const specs = el.productSpecs.value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
      const imageUrl = el.productImageUrl.value.trim();

      if (!name || !description || !Number.isFinite(price) || price < 0) {
        setFormMessage(el.productFormMessage, "Kiểm tra lại tên, giá và mô tả sản phẩm.", "error");
        return;
      }

      setLoading(el.addProductBtn, true, "Đang thêm…");
      let product;
      let storedInDatabase = false;
      try {
        const { data, error } = await window.sb.rpc("admin_add_product", {
          p_admin_password: ADMIN_PASSWORD,
          p_name: name,
          p_category: category,
          p_price: Math.round(price),
          p_image_url: imageUrl,
          p_description: description,
          p_specs: specs,
        });
        if (error) throw error;
        product = normalizeProduct(data, "database");
        storedInDatabase = true;
      } catch (error) {
        console.warn("Không lưu được sản phẩm qua Supabase, dùng bộ nhớ trình duyệt:", error?.message || error);
        product = normalizeProduct({
          id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          name,
          category,
          price: Math.round(price),
          image_url: imageUrl,
          description,
          specs,
        }, "local");
        saveLocalProducts([product, ...loadLocalProducts()]);
      }

      setLoading(el.addProductBtn, false, "+ Thêm sản phẩm");
      state.products.unshift(product);
      el.productForm.reset();
      el.productCategory.value = "CPU";
      setFormMessage(
        el.productFormMessage,
        storedInDatabase
          ? "Đã thêm sản phẩm và lưu vào Supabase."
          : "Đã thêm sản phẩm trên trình duyệt này. Chạy SQL mới để lưu chung vào Supabase.",
        "success",
      );
      renderProducts(state, el);
      showToast("Đã thêm sản phẩm.", el);
    });
  }

  async function deleteProduct(product, state, el) {
    if (!state.isAdmin) return;
    if (!window.confirm(`Xóa sản phẩm “${product.name}”? Hành động này không thể hoàn tác.`)) return;

    let deletedFromDatabase = false;
    if (product.source === "database") {
      try {
        const { error } = await window.sb.rpc("admin_delete_product", {
          p_admin_password: ADMIN_PASSWORD,
          p_product_id: Number(product.id),
        });
        if (error) throw error;
        deletedFromDatabase = true;
      } catch (error) {
        console.warn("Không xóa được qua Supabase, ẩn sản phẩm trên trình duyệt:", error?.message || error);
        hideProductLocally(product.id);
      }
    } else if (product.source === "local") {
      removeLocalProduct(product.id);
    } else {
      hideProductLocally(product.id);
    }

    state.products = state.products.filter((item) => item.id !== product.id);
    state.cart = state.cart.filter((item) => item.id !== product.id);
    saveCart(state.cart);
    renderProducts(state, el);
    renderCart(state, el);
    showToast(
      deletedFromDatabase || product.source !== "database"
        ? "Đã xóa sản phẩm."
        : "Đã ẩn sản phẩm trên trình duyệt này. Chạy SQL mới để xóa trên Supabase.",
      el,
    );
  }

  function findProduct(state, productId) {
    return state.products.find((product) => product.id === String(productId));
  }

  function loadCart() {
    try {
      const stored = JSON.parse(localStorage.getItem("gearnova_cart") || "[]");
      if (!Array.isArray(stored)) return [];
      return stored
        .map((item) => ({ id: String(item.id), quantity: Math.max(1, Number(item.quantity) || 1) }))
        .filter((item) => item.id);
    } catch (_) {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem("gearnova_cart", JSON.stringify(cart));
  }

  function loadLocalProducts() {
    return readStoredArray(LOCAL_PRODUCTS_KEY)
      .map((item) => normalizeProduct(item, "local"))
      .filter((product) => product.id.startsWith("local-"));
  }

  function saveLocalProducts(products) {
    writeStoredArray(LOCAL_PRODUCTS_KEY, products.map((product) => ({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      image_url: product.image_url,
      description: product.description,
      specs: product.specs,
    })));
  }

  function loadHiddenProducts() {
    return readStoredArray(HIDDEN_PRODUCTS_KEY).map((id) => String(id));
  }

  function hideProductLocally(productId) {
    const id = String(productId);
    const ids = new Set(loadHiddenProducts());
    ids.add(id);
    writeStoredArray(HIDDEN_PRODUCTS_KEY, [...ids]);
  }

  function removeLocalProduct(productId) {
    const id = String(productId);
    saveLocalProducts(loadLocalProducts().filter((product) => product.id !== id));
  }

  function readStoredArray(key) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || "[]");
      return Array.isArray(value) ? value : [];
    } catch (_) {
      return [];
    }
  }

  function writeStoredArray(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Không lưu được ${key}:`, error);
    }
  }

  function setFormMessage(element, text, type = "") {
    element.textContent = text;
    element.classList.toggle("is-error", type === "error");
    element.classList.toggle("is-success", type === "success");
  }

  function setLoading(button, isLoading, label) {
    button.disabled = isLoading;
    button.textContent = label;
  }

  function showToast(message, el, isError = false) {
    clearTimeout(el.toastTimer);
    el.toast.textContent = message;
    el.toast.classList.toggle("is-error", isError);
    el.toast.classList.add("is-open");
    el.toastTimer = setTimeout(() => el.toast.classList.remove("is-open"), 3000);
  }

  function hideLoader(el) {
    setTimeout(() => {
      el.pageLoader.classList.add("is-hidden");
      document.body.classList.remove("page-loading");
    }, 120);
  }

  function formatVnd(value) {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(Number(value) || 0);
  }

  function normalizeText(value) {
    return String(value || "")
      .toLocaleLowerCase("vi")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d");
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>'"]/g, (character) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#039;", '"': "&quot;",
    })[character]);
  }

  function safeImageUrl(value, category) {
    if (!value) return fallbackImage(category);
    try {
      const url = new URL(value, window.location.href);
      if (["http:", "https:", "data:"].includes(url.protocol)) return url.href;
    } catch (_) { /* use fallback */ }
    return fallbackImage(category);
  }

  function fallbackImage(category) {
    const colors = {
      CPU: ["#e53d56", "#661a30"],
      GPU: ["#ed4e47", "#5f1723"],
      RAM: ["#b82468", "#43143d"],
      SSD: ["#e06a2f", "#4f2320"],
      GEAR: ["#8f3acb", "#35224c"],
    };
    const [a, b] = colors[category] || colors.GEAR;
    const label = escapeSvgText(category === "GEAR" ? "GAMING GEAR" : category);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 620"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="800" height="620" fill="#0f131b"/><circle cx="650" cy="110" r="235" fill="url(#g)" opacity=".92"/><path d="M0 520L800 182V620H0z" fill="url(#g)" opacity=".66"/><rect x="82" y="140" width="290" height="290" rx="32" fill="none" stroke="#fff" stroke-width="12" opacity=".86"/><path d="M130 188h194v194H130z" fill="#fff" opacity=".12"/><text x="80" y="505" fill="#fff" font-family="Arial, sans-serif" font-size="55" font-weight="800">${label}</text><text x="82" y="555" fill="#fff" opacity=".75" font-family="Arial, sans-serif" font-size="25" letter-spacing="5">GEARNOVA</text></svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }

  function escapeSvgText(value) {
    return String(value).replace(/[&<>"']/g, "");
  }
})();

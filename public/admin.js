const adminState = {
  token: localStorage.getItem("mixermate-admin-token") || "",
  lang: localStorage.getItem("mixermate-admin-lang") || "en",
  activePanel: "overviewPanel",
  settings: {},
  categories: [],
  products: [],
  orders: [],
  leads: [],
  events: [],
  metrics: {}
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const money = (value) => `$${Number(value || 0).toFixed(2)}`;

const ADMIN_I18N = {
  en: {
    login_eyebrow: "Store admin",
    login_title: "Manage products, storefront, customers, and orders.",
    login_note: "Default local password is admin123. Change ADMIN_PASSWORD before going public.",
    password: "Password",
    sign_in: "Sign in",
    dashboard: "Dashboard",
    admin_title: "Store operations center",
    view_storefront: "View storefront",
    save_changes: "Save changes",
    nav_overview: "Overview",
    nav_products: "Products",
    nav_customers: "Customers",
    nav_orders: "Orders",
    nav_storefront: "Storefront",
    nav_analytics: "Analytics",
    quick_tasks: "Quick tasks",
    quick_tasks_title: "Keep the store ready to sell",
    manage_products: "Manage products",
    view_emails: "View customer emails",
    edit_homepage: "Edit homepage",
    recent_customers: "Recent customers",
    front_page: "Front page",
    hero_copy: "Hero and brand copy",
    catalog: "Catalog",
    products: "Products",
    add_product: "Add product",
    save_catalog: "Save catalog",
    import_csv: "Import CSV",
    product_help: "Upload product photos, edit sales copy, adjust prices, and save to publish changes on the storefront.",
    import_done: "Products imported. Click Save catalog to publish them.",
    photo: "Photo",
    upload_image: "Upload image",
    image_slot: "Image",
    gallery_help: "Upload up to 5 images. The first image is used as the product cover.",
    image_url: "Image URL",
    product_copy: "Product copy",
    sales: "Sales",
    orders: "Orders",
    order: "Order",
    customer: "Customer",
    total: "Total",
    status: "Status",
    created: "Created",
    customer_emails: "Customer emails",
    export_csv: "Export CSV",
    search_emails: "Search emails",
    leads: "Leads",
    name: "Name",
    email: "Email",
    interest: "Interest",
    analytics: "Analytics",
    recent_events: "Recent events",
    revenue: "Revenue",
    events: "Events",
    brand_name: "Brand name",
    announcement: "Announcement",
    hero_title: "Hero title",
    hero_subtitle: "Hero subtitle",
    support_email: "Support email",
    currency: "Currency",
    category: "Category",
    price: "Price",
    compare_at: "Compare at",
    badge: "Badge",
    model_fit: "Model fit",
    inventory: "Inventory",
    color: "Color",
    active: "Active",
    hidden: "Hidden",
    description: "Description",
    id: "ID",
    item_lines: "item lines",
    no_orders: "No orders yet.",
    no_leads: "No customer emails yet.",
    no_events: "No events yet.",
    login_failed: "Login failed",
    catalog_saved: "Catalog saved.",
    order_updated: "Order status updated.",
    image_loaded: "Image uploaded. Save catalog to publish it.",
    new_product: "New product",
    short_description: "Short product description.",
    delete: "Delete",
    no_delete_last: "Keep at least one product."
  },
  zh: {
    login_eyebrow: "店铺后台",
    login_title: "管理商品、前台页面、客户邮箱和订单。",
    login_note: "本地默认密码为 admin123。上线前请设置 ADMIN_PASSWORD。",
    password: "密码",
    sign_in: "登录",
    dashboard: "仪表盘",
    admin_title: "店铺运营中心",
    view_storefront: "查看前台",
    save_changes: "保存修改",
    nav_overview: "概览",
    nav_products: "商品",
    nav_customers: "客户",
    nav_orders: "订单",
    nav_storefront: "前台",
    nav_analytics: "数据",
    quick_tasks: "快捷操作",
    quick_tasks_title: "让店铺随时可以销售",
    manage_products: "管理商品",
    view_emails: "查看客户邮箱",
    edit_homepage: "编辑首页",
    recent_customers: "近期客户",
    front_page: "前台页面",
    hero_copy: "首屏与品牌文案",
    catalog: "商品目录",
    products: "商品",
    add_product: "新增商品",
    save_catalog: "保存目录",
    import_csv: "导入 CSV",
    product_help: "上传商品图片、编辑销售文案、调整价格，保存后同步到前台。",
    import_done: "商品已导入，点击保存目录后发布到前台。",
    photo: "图片",
    upload_image: "上传图片",
    image_slot: "图片",
    gallery_help: "最多上传 5 张图，第一张会作为商品封面。",
    image_url: "图片链接",
    product_copy: "商品文案",
    sales: "销售",
    orders: "订单",
    order: "订单",
    customer: "客户",
    total: "金额",
    status: "状态",
    created: "创建时间",
    customer_emails: "客户邮箱",
    export_csv: "导出 CSV",
    search_emails: "搜索邮箱",
    leads: "线索",
    name: "姓名",
    email: "邮箱",
    interest: "需求",
    analytics: "数据分析",
    recent_events: "近期事件",
    revenue: "销售额",
    events: "事件",
    brand_name: "品牌名",
    announcement: "公告",
    hero_title: "首屏标题",
    hero_subtitle: "首屏副标题",
    support_email: "客服邮箱",
    currency: "货币",
    category: "分类",
    price: "价格",
    compare_at: "划线价",
    badge: "标签",
    model_fit: "适配型号",
    inventory: "库存",
    color: "颜色",
    active: "显示",
    hidden: "隐藏",
    description: "描述",
    id: "ID",
    item_lines: "个商品行",
    no_orders: "暂无订单。",
    no_leads: "暂无客户邮箱。",
    no_events: "暂无事件。",
    login_failed: "登录失败",
    catalog_saved: "商品目录已保存。",
    order_updated: "订单状态已更新。",
    image_loaded: "图片已上传，保存目录后发布。",
    new_product: "新商品",
    short_description: "简短商品描述。",
    delete: "删除",
    no_delete_last: "至少保留一个商品。"
  }
};

function tr(key) {
  return ADMIN_I18N[adminState.lang]?.[key] || ADMIN_I18N.en[key] || key;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function toast(message) {
  const node = $("#toast");
  node.textContent = message;
  node.classList.add("show");
  window.setTimeout(() => node.classList.remove("show"), 2600);
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminState.token}`,
      ...(options.headers || {})
    }
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Request failed");
  return data;
}

function applyAdminLang() {
  document.documentElement.lang = adminState.lang === "zh" ? "zh" : "en";
  localStorage.setItem("mixermate-admin-lang", adminState.lang);
  $$("[data-admin-i18n]").forEach((node) => {
    node.textContent = tr(node.dataset.adminI18n);
  });
  $$("[data-admin-placeholder]").forEach((node) => {
    node.placeholder = tr(node.dataset.adminPlaceholder);
  });
  $$("[data-admin-lang]").forEach((button) => {
    button.classList.toggle("active", button.dataset.adminLang === adminState.lang);
  });
}

function showPanel(panelId) {
  adminState.activePanel = panelId;
  $$(".admin-panel").forEach((panel) => panel.classList.toggle("hidden", panel.id !== panelId));
  $$("[data-admin-target]").forEach((button) => {
    button.classList.toggle("active", button.dataset.adminTarget === panelId);
  });
}

function renderMetrics() {
  const metrics = [
    [tr("revenue"), money(adminState.metrics.revenue)],
    [tr("orders"), adminState.metrics.orders],
    [tr("leads"), adminState.metrics.leads],
    [tr("products"), adminState.products.length]
  ];
  $("#metricGrid").innerHTML = metrics
    .map(([label, value]) => `<article class="metric"><span>${label}</span><strong>${value}</strong></article>`)
    .join("");
}

function renderSettingsForm() {
  $("#settingsForm").innerHTML = `
    <label>${tr("brand_name")} <input name="brandName" value="${escapeHtml(adminState.settings.brandName)}" /></label>
    <label>${tr("announcement")} <input name="announcement" value="${escapeHtml(adminState.settings.announcement)}" /></label>
    <label>${tr("hero_title")} <textarea name="heroTitle" rows="3">${escapeHtml(adminState.settings.heroTitle)}</textarea></label>
    <label>${tr("hero_subtitle")} <textarea name="heroSubtitle" rows="3">${escapeHtml(adminState.settings.heroSubtitle)}</textarea></label>
    <label>${tr("support_email")} <input name="supportEmail" value="${escapeHtml(adminState.settings.supportEmail)}" /></label>
    <label>${tr("currency")} <input name="currency" value="${escapeHtml(adminState.settings.currency || "USD")}" /></label>
  `;
}

function productForm(product, index) {
  const images = normalizeImages(product);
  const imageSlots = Array.from({ length: 5 }, (_, slotIndex) => {
    const image = images[slotIndex] || "";
    return `
      <div class="image-slot">
        <div class="image-slot-preview">
          ${image ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(product.name)} ${slotIndex + 1}" />` : `<span>${tr("image_slot")} ${slotIndex + 1}</span>`}
        </div>
        <label class="image-upload compact">
          <span>${tr("upload_image")}</span>
          <input type="file" accept="image/*" data-image-upload="${index}" data-image-slot="${slotIndex}" />
        </label>
        <input data-image-url="${slotIndex}" value="${escapeHtml(image)}" placeholder="${tr("image_url")} ${slotIndex + 1}" />
      </div>
    `;
  }).join("");

  const categoryOptions = adminState.categories
    .map(
      (category) =>
        `<option value="${escapeHtml(category.id)}" ${product.category === category.id ? "selected" : ""}>${escapeHtml(category.name)}</option>`
    )
    .join("");

  return `
    <article class="product-editor-card" data-index="${index}">
      <div class="product-editor-media">
        <div class="image-slot-grid">${imageSlots}</div>
        <p class="admin-help">${tr("gallery_help")}</p>
      </div>
      <div class="product-editor-main">
        <div class="product-editor-head">
          <div>
            <label>${tr("name")} <input data-field="name" value="${escapeHtml(product.name)}" /></label>
          </div>
          <button class="ghost-button danger" type="button" data-delete-product="${index}">${tr("delete")}</button>
        </div>
        <div class="product-editor-grid">
          <label>${tr("category")} <select data-field="category">${categoryOptions}</select></label>
          <label>${tr("price")} <input data-field="price" type="number" step="0.01" value="${Number(product.price || 0)}" /></label>
          <label>${tr("compare_at")} <input data-field="compareAt" type="number" step="0.01" value="${Number(product.compareAt || 0)}" /></label>
          <label>${tr("inventory")} <input data-field="inventory" type="number" value="${Number(product.inventory || 0)}" /></label>
          <label>${tr("badge")} <input data-field="badge" value="${escapeHtml(product.badge)}" /></label>
          <label>${tr("model_fit")} <input data-field="modelFit" value="${escapeHtml(product.modelFit)}" /></label>
          <label>${tr("active")} <select data-field="active"><option value="true" ${product.active ? "selected" : ""}>${tr("active")}</option><option value="false" ${!product.active ? "selected" : ""}>${tr("hidden")}</option></select></label>
          <label>${tr("color")} <input data-field="color" type="color" value="${escapeHtml(product.color || "#f5ebe0")}" /></label>
        </div>
        <label>${tr("product_copy")} <textarea data-field="description" rows="4">${escapeHtml(product.description)}</textarea></label>
        <label>${tr("id")} <input data-field="id" value="${escapeHtml(product.id)}" /></label>
      </div>
    </article>
  `;
}

function renderProducts() {
  $("#adminProducts").innerHTML = adminState.products.map(productForm).join("");
  bindProductCardEvents();
}

function collectCatalog() {
  const settings = Object.fromEntries(new FormData($("#settingsForm")).entries());
  const products = [...document.querySelectorAll(".product-editor-card")].map((card) => {
    const product = {};
    card.querySelectorAll("[data-field]").forEach((input) => {
      let value = input.value;
      if (["price", "compareAt", "inventory"].includes(input.dataset.field)) value = Number(value);
      if (input.dataset.field === "active") value = value === "true";
      product[input.dataset.field] = value;
    });
    const images = [...card.querySelectorAll("[data-image-url]")]
      .map((input) => input.value.trim())
      .filter(Boolean)
      .slice(0, 5);
    product.images = images;
    product.image = images[0] || product.image || "";
    return product;
  });
  return { settings, categories: adminState.categories, products };
}

function syncProductsFromDom() {
  adminState.products = collectCatalog().products;
}

function bindProductCardEvents() {
  $$("[data-image-upload]").forEach((input) => {
    input.addEventListener("change", async () => {
      const file = input.files[0];
      if (!file) return;
      const dataUrl = await readFileAsDataUrl(file);
      const index = Number(input.dataset.imageUpload);
      const slotIndex = Number(input.dataset.imageSlot || 0);
      syncProductsFromDom();
      const images = normalizeImages(adminState.products[index]);
      images[slotIndex] = dataUrl;
      adminState.products[index].images = images.filter(Boolean).slice(0, 5);
      adminState.products[index].image = adminState.products[index].images[0] || dataUrl;
      renderProducts();
      toast(tr("image_loaded"));
    });
  });

  $$("[data-delete-product]").forEach((button) => {
    button.addEventListener("click", () => {
      if (adminState.products.length <= 1) return toast(tr("no_delete_last"));
      syncProductsFromDom();
      adminState.products.splice(Number(button.dataset.deleteProduct), 1);
      renderProducts();
    });
  });
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function normalizeImages(product) {
  const images = Array.isArray(product.images) ? product.images.filter(Boolean) : [];
  if (product.image && !images.includes(product.image)) images.unshift(product.image);
  return images.filter(Boolean).slice(0, 5);
}

function parseCsv(text) {
  const rows = [];
  let field = "";
  let row = [];
  let inQuotes = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];
    if (char === '"' && inQuotes && next === '"') {
      field += '"';
      index += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      row.push(field);
      field = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(field);
      if (row.some((value) => value.trim())) rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }
  row.push(field);
  if (row.some((value) => value.trim())) rows.push(row);
  if (!rows.length) return [];
  const headers = rows[0].map((header) => String(header || "").trim().toLowerCase().replace(/[\s_-]+/g, ""));
  return rows.slice(1).map((values) => {
    const record = {};
    headers.forEach((header, index) => {
      record[header] = values[index] || "";
    });
    return record;
  });
}

function csvValue(record, keys, fallback = "") {
  for (const key of keys) {
    const normalized = key.toLowerCase().replace(/[\s_-]+/g, "");
    if (record[normalized] !== undefined && String(record[normalized]).trim() !== "") return String(record[normalized]).trim();
  }
  return fallback;
}

function slug(value) {
  return (
    String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60) || `product-${Date.now()}`
  );
}

function numeric(value, fallback = 0) {
  const parsed = Number(String(value || "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(parsed) ? parsed : fallback;
}

function categoryFromRecord(name, category) {
  const text = `${name} ${category}`.toLowerCase();
  if (text.includes("pasta") || text.includes("roller") || text.includes("cutter")) return "pasta";
  if (text.includes("grinder") || text.includes("sausage")) return "grinders";
  if (text.includes("slicer") || text.includes("shredder") || text.includes("spiral")) return "slicers";
  if (text.includes("ice cream") || text.includes("beater") || text.includes("hook") || text.includes("dough")) return "baking";
  if (text.includes("bowl") || text.includes("shield") || text.includes("guard")) return "bowls";
  if (text.includes("clean") || text.includes("care") || text.includes("brush")) return "care";
  return "baking";
}

function productFromCsv(record) {
  const name = csvValue(record, ["name", "title", "item-name", "item name", "product-name", "product name"]);
  const sku = csvValue(record, ["sku", "seller-sku", "seller sku", "id", "asin"], slug(name));
  const category = csvValue(record, ["category", "product-type", "product type"]);
  const price = numeric(csvValue(record, ["price", "standard-price", "standard price", "sale-price"]));
  const compareAt = numeric(csvValue(record, ["compareAt", "compare at", "list-price", "list price", "msrp"]), Math.ceil(price * 1.25));
  const images = [
    csvValue(record, ["image", "image-url", "image url", "main-image-url", "main image url", "picture"]),
    csvValue(record, ["image2", "image-2", "image url 2", "picture2"]),
    csvValue(record, ["image3", "image-3", "image url 3", "picture3"]),
    csvValue(record, ["image4", "image-4", "image url 4", "picture4"]),
    csvValue(record, ["image5", "image-5", "image url 5", "picture5"])
  ].filter(Boolean);
  return {
    id: slug(sku || name),
    name,
    category: categoryFromRecord(name, category),
    price,
    compareAt,
    badge: csvValue(record, ["badge", "label"], "New"),
    modelFit: csvValue(record, ["modelFit", "model fit", "fit", "compatibility"], "All stand mixers"),
    color: csvValue(record, ["color", "swatch"], "#f5ebe0"),
    image: images[0] || "",
    images,
    description: csvValue(record, ["description", "item-description", "item description", "bullet-points", "bullets"], `${name} for KitchenAid-compatible stand mixers.`),
    inventory: numeric(csvValue(record, ["inventory", "quantity", "qty", "stock"]), 10),
    active: !["false", "0", "no", "hidden"].includes(csvValue(record, ["active", "status"], "true").toLowerCase())
  };
}

function renderOrders() {
  $("#ordersTable").innerHTML =
    adminState.orders
      .map(
        (order) => `
          <tr>
            <td><strong>${escapeHtml(order.id)}</strong><br><small>${order.items.length} ${tr("item_lines")}</small></td>
            <td>${escapeHtml(order.customer.name)}<br><small>${escapeHtml(order.customer.email)}</small></td>
            <td>${money(order.total)}</td>
            <td>
              <select data-order="${escapeHtml(order.id)}">
                ${["new", "paid", "fulfilled", "cancelled"]
                  .map((status) => `<option ${order.status === status ? "selected" : ""}>${status}</option>`)
                  .join("")}
              </select>
            </td>
            <td>${new Date(order.createdAt).toLocaleString()}</td>
          </tr>
        `
      )
      .join("") || `<tr><td colspan="5">${tr("no_orders")}</td></tr>`;

  $("#ordersTable").querySelectorAll("[data-order]").forEach((select) => {
    select.addEventListener("change", async () => {
      await api(`/api/admin/orders/${select.dataset.order}`, {
        method: "PATCH",
        body: JSON.stringify({ status: select.value })
      });
      toast(tr("order_updated"));
    });
  });
}

function filteredLeads() {
  const query = ($("#leadSearch")?.value || "").trim().toLowerCase();
  if (!query) return adminState.leads;
  return adminState.leads.filter((lead) =>
    [lead.name, lead.email, lead.interest].some((value) => String(value || "").toLowerCase().includes(query))
  );
}

function renderLeads() {
  const leads = filteredLeads();
  const html =
    leads
      .map(
        (lead) => `
          <article class="email-card">
            <div class="email-avatar">${escapeHtml((lead.name || lead.email || "?").slice(0, 1).toUpperCase())}</div>
            <div>
              <strong>${escapeHtml(lead.name || "-")}</strong>
              <a href="mailto:${escapeHtml(lead.email)}">${escapeHtml(lead.email)}</a>
              <span>${escapeHtml(lead.interest || "-")}</span>
            </div>
            <small>${lead.createdAt ? new Date(lead.createdAt).toLocaleString() : ""}</small>
          </article>
        `
      )
      .join("") || `<p>${tr("no_leads")}</p>`;
  $("#emailList").innerHTML = html;
  $("#recentEmailList").innerHTML = html;
}

function exportLeadsCsv() {
  const rows = [["name", "email", "interest", "createdAt"], ...filteredLeads().map((lead) => [lead.name || "", lead.email || "", lead.interest || "", lead.createdAt || ""])];
  const csv = rows.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "customer-emails.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function renderEvents() {
  $("#eventList").innerHTML =
    adminState.events
      .slice(0, 40)
      .map(
        (event) => `
          <article class="event-item">
            <strong>${escapeHtml(event.type)}</strong>
            <small>${new Date(event.createdAt).toLocaleString()}</small>
            <pre>${escapeHtml(JSON.stringify(event.payload, null, 2))}</pre>
          </article>
        `
      )
      .join("") || `<p>${tr("no_events")}</p>`;
}

function renderDashboard() {
  $("#loginPanel").classList.add("hidden");
  $("#dashboard").classList.remove("hidden");
  applyAdminLang();
  renderMetrics();
  renderSettingsForm();
  renderProducts();
  renderOrders();
  renderLeads();
  renderEvents();
  showPanel(adminState.activePanel);
}

async function loadDashboard() {
  const data = await api("/api/admin/dashboard");
  Object.assign(adminState, data);
  renderDashboard();
}

async function saveCatalog() {
  try {
    const payload = collectCatalog();
    adminState.settings = payload.settings;
    adminState.products = payload.products;
    await api("/api/admin/catalog", {
      method: "PUT",
      body: JSON.stringify(payload)
    });
    toast(tr("catalog_saved"));
    await loadDashboard();
  } catch (error) {
    toast(error.message);
  }
}

function bindAdmin() {
  $$("[data-admin-lang]").forEach((button) => {
    button.addEventListener("click", () => {
      adminState.lang = button.dataset.adminLang;
      if ($("#dashboard").classList.contains("hidden")) applyAdminLang();
      else renderDashboard();
    });
  });

  $$("[data-admin-target]").forEach((button) => {
    button.addEventListener("click", () => showPanel(button.dataset.adminTarget));
  });

  $$("[data-admin-target-button]").forEach((button) => {
    button.addEventListener("click", () => showPanel(button.dataset.adminTargetButton));
  });

  $("#loginForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
    try {
      const data = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }).then((response) => response.json());
      if (!data.token) throw new Error(tr("login_failed"));
      adminState.token = data.token;
      localStorage.setItem("mixermate-admin-token", data.token);
      await loadDashboard();
    } catch (error) {
      toast(error.message);
    }
  });

  $("#addProduct").addEventListener("click", () => {
    syncProductsFromDom();
    adminState.products.unshift({
      id: `product-${Date.now()}`,
      name: tr("new_product"),
      category: adminState.categories[0]?.id || "baking",
      price: 19,
      compareAt: 29,
      badge: "New",
      modelFit: "All stand mixers",
      color: "#f5ebe0",
      image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=80",
      description: tr("short_description"),
      inventory: 10,
      active: true
    });
    renderProducts();
  });

  $("#saveCatalog").addEventListener("click", saveCatalog);
  $("#saveCatalogTop").addEventListener("click", saveCatalog);
  $("#exportLeads").addEventListener("click", exportLeadsCsv);
  $("#leadSearch").addEventListener("input", renderLeads);

  $("#productCsvFile").addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const text = await file.text();
    const imported = parseCsv(text)
      .map(productFromCsv)
      .filter((product) => product.name && product.price);
    syncProductsFromDom();
    const byId = new Map(adminState.products.map((product) => [product.id, product]));
    imported.forEach((product) => byId.set(product.id, product));
    adminState.products = [...byId.values()];
    renderProducts();
    toast(tr("import_done"));
  });
}

bindAdmin();
applyAdminLang();
if (adminState.token) {
  loadDashboard().catch(() => {
    localStorage.removeItem("mixermate-admin-token");
  });
}

const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || "127.0.0.1";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || (() => {
  const pw = crypto.randomBytes(8).toString("hex");
  console.warn(`\n⚠  ADMIN_PASSWORD not set — one-time password: ${pw}\n   Set ADMIN_PASSWORD env var for a persistent password.\n`);
  return pw;
})();
const PUBLIC_DIR = path.join(__dirname, "public");
const DEFAULT_DB_FILE = path.join(__dirname, "data", "db.json");
const DB_FILE = process.env.DB_FILE || DEFAULT_DB_FILE;
const DATA_DIR = path.dirname(DB_FILE);
const SQLITE_PATH = DB_FILE.replace(/\.json$/, "") + ".sqlite";
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";
const SITE_URL = process.env.SITE_URL || `http://localhost:${PORT}`;
const SESSION_TOKENS = new Set();

const defaultDb = {
  settings: {
    brandName: "MixerAttach",
    announcement: "Purchases are completed securely on Amazon",
    heroTitle: "Upgrade Your Stand Mixer for Everyday Cooking",
    heroSubtitle:
      "Discover practical, easy-to-use attachments designed for pasta, prep, and more. Compatible with KitchenAid stand mixers.",
    supportEmail: "support@mixerattach.com",
    currency: "USD",
    ga4Id: "",
    gtmId: "",
    metaPixelId: "",
    tiktokPixelId: ""
  },
  categories: [
    { id: "bowls", name: "Bowls" },
    { id: "beaters", name: "Beaters" },
    { id: "hooks", name: "Dough Hooks" },
    { id: "guards", name: "Pouring Shields" },
    { id: "care", name: "Care Kits" }
  ],
  products: [
    {
      id: "steel-bowl-5qt",
      name: "5-Qt Stainless Bowl",
      category: "bowls",
      price: 44,
      compareAt: 58,
      badge: "Best seller",
      modelFit: "Tilt-head 4.5-5 qt",
      color: "#d7e4e8",
      image:
        "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=80",
      description:
        "Brushed stainless replacement bowl with ergonomic handle and clean pour lip.",
      inventory: 42,
      active: true
    },
    {
      id: "flex-edge-beater",
      name: "Flex Edge Beater",
      category: "beaters",
      price: 26,
      compareAt: 34,
      badge: "Low effort",
      modelFit: "Tilt-head 4.5-5 qt",
      color: "#e7d3c5",
      image:
        "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&w=900&q=80",
      description:
        "Scrapes the bowl while mixing frosting, cookie dough, and cake batter.",
      inventory: 64,
      active: true
    },
    {
      id: "spiral-dough-hook",
      name: "Coated Spiral Dough Hook",
      category: "hooks",
      price: 29,
      compareAt: 39,
      badge: "Bread day",
      modelFit: "Bowl-lift 5-6 qt",
      color: "#dcd7c6",
      image:
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80",
      description:
        "Heavy-duty hook for kneading pizza, brioche, sandwich bread, and bagels.",
      inventory: 38,
      active: true
    },
    {
      id: "clear-pouring-shield",
      name: "Clear Pouring Shield",
      category: "guards",
      price: 22,
      compareAt: 29,
      badge: "Less mess",
      modelFit: "Tilt-head 4.5-5 qt",
      color: "#cfe0d4",
      image:
        "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=900&q=80",
      description:
        "Clip-on shield that keeps flour inside the bowl and gives you a cleaner pour.",
      inventory: 57,
      active: true
    },
    {
      id: "attachment-care-kit",
      name: "Attachment Care Kit",
      category: "care",
      price: 18,
      compareAt: 24,
      badge: "Tune-up",
      modelFit: "All stand mixers",
      color: "#d8d6e8",
      image:
        "https://images.unsplash.com/photo-1583947581924-a6d1dc386a6f?auto=format&fit=crop&w=900&q=80",
      description:
        "Food-safe polish cloth, brush set, hub gasket, and quick maintenance checklist.",
      inventory: 73,
      active: true
    },
    {
      id: "baker-bundle",
      name: "Baker's Refresh Bundle",
      category: "beaters",
      price: 69,
      compareAt: 91,
      badge: "Bundle",
      modelFit: "Tilt-head 4.5-5 qt",
      color: "#dfd3bd",
      image:
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=900&q=80",
      description:
        "Flex edge beater, pouring shield, and care kit bundled for a faster refresh.",
      inventory: 26,
      active: true
    }
  ],
  orders: [],
  leads: [],
  events: []
};

// ── SQLite storage ────────────────────────────────────────────────────────────

let _sqliteDb = null;

function openDb() {
  if (_sqliteDb) return _sqliteDb;
  const { DatabaseSync } = require("node:sqlite");
  fs.mkdirSync(DATA_DIR, { recursive: true });
  _sqliteDb = new DatabaseSync(SQLITE_PATH);
  _sqliteDb.exec(`
    PRAGMA journal_mode=WAL;
    PRAGMA synchronous=NORMAL;
    CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS categories (position INTEGER DEFAULT 0, id TEXT PRIMARY KEY, name TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS products (id TEXT PRIMARY KEY, data TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS orders (id TEXT PRIMARY KEY, created_at TEXT NOT NULL, data TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS leads (id TEXT PRIMARY KEY, created_at TEXT NOT NULL, data TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS events (id TEXT PRIMARY KEY, type TEXT NOT NULL, created_at TEXT NOT NULL, data TEXT NOT NULL);
  `);
  return _sqliteDb;
}

function readDb() {
  const db = openDb();
  const settingsRows = db.prepare("SELECT key, value FROM settings").all();
  const settings = { ...defaultDb.settings };
  for (const row of settingsRows) {
    try { settings[row.key] = JSON.parse(row.value); } catch { settings[row.key] = row.value; }
  }
  const categories = db.prepare("SELECT id, name FROM categories ORDER BY position").all();
  const products = db.prepare("SELECT data FROM products").all().map((r) => JSON.parse(r.data));
  const orders = db.prepare("SELECT data FROM orders ORDER BY created_at DESC").all().map((r) => JSON.parse(r.data));
  const leads = db.prepare("SELECT data FROM leads ORDER BY created_at DESC").all().map((r) => JSON.parse(r.data));
  const events = db.prepare("SELECT data FROM events ORDER BY created_at DESC LIMIT 1000").all().map((r) => JSON.parse(r.data));
  return { settings, categories, products, orders, leads, events };
}

function writeDb(data) {
  const db = openDb();
  db.exec("BEGIN");
  try {
    db.prepare("DELETE FROM settings").run();
    const insSetting = db.prepare("INSERT INTO settings (key, value) VALUES (?, ?)");
    for (const [key, value] of Object.entries(data.settings || {})) {
      insSetting.run(key, JSON.stringify(value));
    }

    db.prepare("DELETE FROM categories").run();
    const insCat = db.prepare("INSERT INTO categories (position, id, name) VALUES (?, ?, ?)");
    (data.categories || []).forEach((cat, i) => insCat.run(i, cat.id, cat.name));

    db.prepare("DELETE FROM products").run();
    const insProd = db.prepare("INSERT INTO products (id, data) VALUES (?, ?)");
    for (const p of (data.products || [])) insProd.run(p.id, JSON.stringify(p));

    db.prepare("DELETE FROM orders").run();
    const insOrd = db.prepare("INSERT INTO orders (id, created_at, data) VALUES (?, ?, ?)");
    for (const o of (data.orders || [])) insOrd.run(o.id, o.createdAt || new Date().toISOString(), JSON.stringify(o));

    db.prepare("DELETE FROM leads").run();
    const insLead = db.prepare("INSERT INTO leads (id, created_at, data) VALUES (?, ?, ?)");
    for (const l of (data.leads || [])) insLead.run(l.id, l.createdAt || new Date().toISOString(), JSON.stringify(l));

    db.prepare("DELETE FROM events").run();
    const insEv = db.prepare("INSERT INTO events (id, type, created_at, data) VALUES (?, ?, ?, ?)");
    for (const e of (data.events || [])) insEv.run(e.id, e.type || "event", e.createdAt || new Date().toISOString(), JSON.stringify(e));

    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
}

function ensureDb() {
  const db = openDb();
  const { n } = db.prepare("SELECT COUNT(*) as n FROM settings").get();
  if (n === 0) {
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, "utf8");
        const data = normalizeCatalog(JSON.parse(raw));
        writeDb(data);
        fs.renameSync(DB_FILE, DB_FILE + ".migrated");
        console.log(`Migrated ${path.basename(DB_FILE)} → ${path.basename(SQLITE_PATH)}`);
      } catch (e) {
        console.error("Migration failed, seeding defaults:", e.message);
        writeDb(normalizeCatalog({ ...defaultDb }));
      }
    } else {
      writeDb(normalizeCatalog({ ...defaultDb }));
    }
  }
}

// ── HTTP helpers ──────────────────────────────────────────────────────────────

function sendJson(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body)
  });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 80_000_000) {
        req.destroy();
        reject(new Error("Payload too large"));
      }
    });
    req.on("end", () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
  });
}

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let total = 0;
    req.on("data", (chunk) => {
      chunks.push(chunk);
      total += chunk.length;
      if (total > 1_000_000) { req.destroy(); reject(new Error("Payload too large")); }
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function getToken(req) {
  const header = req.headers.authorization || "";
  return header.startsWith("Bearer ") ? header.slice(7) : "";
}

function requireAdmin(req, res) {
  if (!SESSION_TOKENS.has(getToken(req))) {
    sendJson(res, 401, { error: "Unauthorized" });
    return false;
  }
  return true;
}

function safePublicPath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const clean = decoded === "/" ? "/index.html" : decoded;
  const filePath = path.normalize(path.join(PUBLIC_DIR, clean));
  if (!filePath.startsWith(PUBLIC_DIR)) return null;
  return filePath;
}

function contentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return (
    {
      ".html": "text/html; charset=utf-8",
      ".css": "text/css; charset=utf-8",
      ".js": "application/javascript; charset=utf-8",
      ".json": "application/json; charset=utf-8",
      ".txt": "text/plain; charset=utf-8",
      ".xml": "application/xml; charset=utf-8",
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".svg": "image/svg+xml"
    }[ext] || "application/octet-stream"
  );
}

// ── Business logic ────────────────────────────────────────────────────────────

function hydrateOrderItems(items, products) {
  return items
    .map((item) => {
      const product = products.find((entry) => entry.id === item.id && entry.active);
      if (!product) return null;
      const qty = Math.max(1, Number(item.qty || 1));
      const images = Array.isArray(product.images) && product.images.length ? product.images : [product.image];
      return {
        id: product.id,
        name: product.name,
        price: product.price,
        image: images[0] || product.image,
        qty
      };
    })
    .filter(Boolean);
}

function slugify(value) {
  return (
    String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 80) || `product-${Date.now()}`
  );
}

function normalizeProduct(product) {
  const productName = product.productName || product.name || "";
  const productSlug = product.productSlug || slugify(product.id || productName);
  return {
    ...product,
    productName,
    productSlug,
    amazonUrl: product.amazonUrl || "",
    amazonAttributionUrl: product.amazonAttributionUrl || "",
    amazonButtonText: product.amazonButtonText || "Buy on Amazon",
    amazonButtonEnabled: product.amazonButtonEnabled !== false
  };
}

function normalizeCatalog(db) {
  db.settings = {
    ...defaultDb.settings,
    ...(db.settings || {})
  };
  db.products = Array.isArray(db.products) ? db.products.map(normalizeProduct) : [];
  db.categories = Array.isArray(db.categories) ? db.categories : [];
  db.orders = Array.isArray(db.orders) ? db.orders : [];
  db.leads = Array.isArray(db.leads) ? db.leads : [];
  db.events = Array.isArray(db.events) ? db.events : [];
  return db;
}

function recordEvent(db, event) {
  db.events.unshift({
    id: crypto.randomUUID(),
    type: String(event.type || "event"),
    payload: event.payload || {},
    path: event.path || "",
    createdAt: new Date().toISOString()
  });
  db.events = db.events.slice(0, 1000);
}

// ── Stripe helpers ────────────────────────────────────────────────────────────

function flattenParams(obj, prefix) {
  const result = [];
  for (const [key, value] of Object.entries(obj)) {
    const k = prefix ? `${prefix}[${key}]` : key;
    if (Array.isArray(value)) {
      value.forEach((item, i) => {
        if (item !== null && typeof item === "object") {
          result.push(...flattenParams(item, `${k}[${i}]`));
        } else {
          result.push([`${k}[${i}]`, String(item)]);
        }
      });
    } else if (value !== null && typeof value === "object") {
      result.push(...flattenParams(value, k));
    } else {
      result.push([k, String(value)]);
    }
  }
  return result;
}

function stripeRequest(method, urlPath, params) {
  return new Promise((resolve, reject) => {
    const body = params ? new URLSearchParams(flattenParams(params)).toString() : "";
    const options = {
      hostname: "api.stripe.com",
      port: 443,
      path: urlPath,
      method,
      headers: {
        Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(body)
      }
    };
    const req = https.request(options, (res) => {
      let raw = "";
      res.on("data", (chunk) => (raw += chunk));
      res.on("end", () => {
        try {
          const parsed = JSON.parse(raw);
          if (res.statusCode >= 400) reject(new Error(parsed.error?.message || `Stripe ${res.statusCode}`));
          else resolve(parsed);
        } catch {
          reject(new Error("Invalid Stripe response"));
        }
      });
    });
    req.on("error", reject);
    if (body) req.write(body);
    req.end();
  });
}

function verifyStripeSignature(rawBody, header, secret) {
  const parts = header.split(",").reduce(
    (acc, part) => {
      const eq = part.indexOf("=");
      const k = part.slice(0, eq);
      const v = part.slice(eq + 1);
      if (k === "t") acc.timestamp = v;
      else if (k === "v1") acc.signatures.push(v);
      return acc;
    },
    { timestamp: null, signatures: [] }
  );
  if (!parts.timestamp) return false;
  const signed = `${parts.timestamp}.${rawBody}`;
  const expected = crypto.createHmac("sha256", secret).update(signed).digest("hex");
  return parts.signatures.some((sig) => {
    try {
      return crypto.timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expected, "hex"));
    } catch {
      return false;
    }
  });
}

// ── API router ────────────────────────────────────────────────────────────────

async function handleApi(req, res, url) {
  // Stripe webhook must read raw body before anything else
  if (req.method === "POST" && url.pathname === "/api/webhook/stripe") {
    const rawBody = await readRawBody(req);
    if (STRIPE_WEBHOOK_SECRET) {
      const sig = req.headers["stripe-signature"] || "";
      if (!verifyStripeSignature(rawBody, sig, STRIPE_WEBHOOK_SECRET)) {
        sendJson(res, 400, { error: "Invalid signature" });
        return;
      }
    }
    let event;
    try { event = JSON.parse(rawBody); } catch { sendJson(res, 400, { error: "Invalid JSON" }); return; }
    if (event.type === "checkout.session.completed") {
      const db = normalizeCatalog(readDb());
      const session = event.data.object;
      const details = session.customer_details || {};
      const addr = details.address;
      const order = {
        id: `ST-${session.id.slice(-8).toUpperCase()}`,
        status: "paid",
        stripeSessionId: session.id,
        total: (session.amount_total || 0) / 100,
        items: [],
        customer: {
          name: details.name || "",
          email: details.email || "",
          phone: details.phone || "",
          address: addr ? [addr.line1, addr.city, addr.country].filter(Boolean).join(", ") : ""
        },
        createdAt: new Date().toISOString()
      };
      db.orders.unshift(order);
      recordEvent(db, { type: "stripe_payment", payload: { orderId: order.id, total: order.total } });
      writeDb(db);
    }
    sendJson(res, 200, { received: true });
    return;
  }

  const db = normalizeCatalog(readDb());

  if (req.method === "GET" && url.pathname === "/api/catalog") {
    sendJson(res, 200, {
      settings: {
        ...db.settings,
        stripeEnabled: !!STRIPE_SECRET_KEY,
        stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY || ""
      },
      categories: db.categories,
      products: db.products.filter((product) => product.active)
    });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/amazon-click") {
    const body = await readBody(req);
    const payload = {
      productName: String(body.productName || ""),
      productSlug: String(body.productSlug || ""),
      buttonLocation: String(body.buttonLocation || ""),
      pagePath: String(body.pagePath || body.path || ""),
      amazonUrl: String(body.amazonUrl || ""),
      clickedAt: String(body.clickedAt || new Date().toISOString()),
      referrer: String(body.referrer || ""),
      utmSource: String(body.utmSource || ""),
      utmMedium: String(body.utmMedium || ""),
      utmCampaign: String(body.utmCampaign || ""),
      userAgent: String(body.userAgent || req.headers["user-agent"] || "")
    };
    recordEvent(db, { type: "amazon_click", payload, path: payload.pagePath });
    writeDb(db);
    sendJson(res, 201, { ok: true });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/events") {
    const body = await readBody(req);
    recordEvent(db, body);
    writeDb(db);
    sendJson(res, 201, { ok: true });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/leads") {
    const body = await readBody(req);
    const lead = {
      id: crypto.randomUUID(),
      email: String(body.email || "").trim(),
      name: String(body.name || "").trim(),
      interest: String(body.interest || "").trim(),
      createdAt: new Date().toISOString()
    };
    if (!lead.email.includes("@")) {
      sendJson(res, 400, { error: "A valid email is required" });
      return;
    }
    db.leads.unshift(lead);
    recordEvent(db, { type: "lead_created", payload: lead });
    writeDb(db);
    sendJson(res, 201, { lead });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/orders") {
    const body = await readBody(req);
    const items = Array.isArray(body.items) ? body.items : [];
    const customer = body.customer || {};
    if (!items.length || !customer.email || !customer.name) {
      sendJson(res, 400, { error: "Customer and cart items are required" });
      return;
    }
    const orderItems = hydrateOrderItems(items, db.products);
    const total = orderItems.reduce((sum, item) => sum + item.price * item.qty, 0);
    const order = {
      id: `MM-${Date.now().toString(36).toUpperCase()}`,
      status: "new",
      items: orderItems,
      total,
      customer: {
        name: String(customer.name || ""),
        email: String(customer.email || ""),
        phone: String(customer.phone || ""),
        address: String(customer.address || ""),
        notes: String(customer.notes || "")
      },
      createdAt: new Date().toISOString()
    };
    db.orders.unshift(order);
    recordEvent(db, { type: "order_created", payload: { id: order.id, total } });
    writeDb(db);
    sendJson(res, 201, { order });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/checkout/stripe") {
    if (!STRIPE_SECRET_KEY) {
      sendJson(res, 503, { error: "Direct payment is not configured" });
      return;
    }
    const body = await readBody(req);
    const items = Array.isArray(body.items) ? body.items : [];
    if (!items.length) { sendJson(res, 400, { error: "Cart is empty" }); return; }
    const hydrated = hydrateOrderItems(items, db.products);
    if (!hydrated.length) { sendJson(res, 400, { error: "No valid products" }); return; }
    const currency = (db.settings.currency || "USD").toLowerCase();
    const session = await stripeRequest("POST", "/v1/checkout/sessions", {
      mode: "payment",
      line_items: hydrated.map((item) => ({
        price_data: {
          currency,
          product_data: { name: item.name },
          unit_amount: String(Math.round(item.price * 100))
        },
        quantity: String(item.qty)
      })),
      success_url: `${SITE_URL}/?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/?payment=cancelled`
    });
    sendJson(res, 200, { url: session.url });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/admin/login") {
    const body = await readBody(req);
    if (body.password !== ADMIN_PASSWORD) {
      sendJson(res, 401, { error: "Invalid password" });
      return;
    }
    const token = crypto.randomBytes(24).toString("hex");
    SESSION_TOKENS.add(token);
    sendJson(res, 200, { token });
    return;
  }

  if (url.pathname.startsWith("/api/admin/")) {
    if (!requireAdmin(req, res)) return;

    if (req.method === "GET" && url.pathname === "/api/admin/dashboard") {
      const revenue = db.orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
      const amazonClicks = db.events.filter((event) => event.type === "amazon_click");
      sendJson(res, 200, {
        settings: db.settings,
        categories: db.categories,
        products: db.products,
        orders: db.orders,
        leads: db.leads,
        events: db.events,
        amazonClicks,
        metrics: {
          revenue,
          orders: db.orders.length,
          leads: db.leads.length,
          events: db.events.length,
          amazonClicks: amazonClicks.length
        }
      });
      return;
    }

    if (req.method === "PUT" && url.pathname === "/api/admin/catalog") {
      const body = await readBody(req);
      db.settings = { ...db.settings, ...(body.settings || {}) };
      db.categories = Array.isArray(body.categories) ? body.categories : db.categories;
      db.products = Array.isArray(body.products) ? body.products.map(normalizeProduct) : db.products;
      writeDb(db);
      sendJson(res, 200, { ok: true });
      return;
    }

    if (req.method === "PATCH" && url.pathname.startsWith("/api/admin/orders/")) {
      const orderId = url.pathname.split("/").pop();
      const body = await readBody(req);
      const order = db.orders.find((entry) => entry.id === orderId);
      if (!order) {
        sendJson(res, 404, { error: "Order not found" });
        return;
      }
      order.status = String(body.status || order.status);
      writeDb(db);
      sendJson(res, 200, { order });
      return;
    }
  }

  sendJson(res, 404, { error: "Not found" });
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    if (url.pathname.startsWith("/api/")) {
      await handleApi(req, res, url);
      return;
    }

    const filePath = safePublicPath(url.pathname);
    if (!filePath || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }

    res.writeHead(200, { "Content-Type": contentType(filePath) });
    fs.createReadStream(filePath).pipe(res);
  } catch (error) {
    sendJson(res, 500, { error: error.message || "Server error" });
  }
});

ensureDb();
server.listen(PORT, HOST, () => {
  console.log(`MixerAttach store running at http://localhost:${PORT}`);
  console.log(`Admin: http://localhost:${PORT}/admin.html`);
  if (STRIPE_SECRET_KEY) console.log("Stripe direct payment: enabled");
});

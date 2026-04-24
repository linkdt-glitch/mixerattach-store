const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || "127.0.0.1";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const PUBLIC_DIR = path.join(__dirname, "public");
const DEFAULT_DB_FILE = path.join(__dirname, "data", "db.json");
const DB_FILE = process.env.DB_FILE || DEFAULT_DB_FILE;
const DATA_DIR = path.dirname(DB_FILE);
const SESSION_TOKENS = new Set();

const defaultDb = {
  settings: {
    brandName: "MixerAttach",
    announcement: "Free U.S. shipping over $59",
    heroTitle: "Premium KitchenAid Accessories",
    heroSubtitle:
      "Turn your stand mixer into the ultimate cooking tool with perfectly matched parts.",
    supportEmail: "support@mixerattach.com",
    currency: "USD"
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

function ensureDb() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DB_FILE)) {
    if (DB_FILE !== DEFAULT_DB_FILE && fs.existsSync(DEFAULT_DB_FILE)) {
      fs.copyFileSync(DEFAULT_DB_FILE, DB_FILE);
    } else {
      fs.writeFileSync(DB_FILE, JSON.stringify(defaultDb, null, 2));
    }
  }
}

function readDb() {
  ensureDb();
  return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
}

function writeDb(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

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
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".svg": "image/svg+xml"
    }[ext] || "application/octet-stream"
  );
}

function moneyTotal(items, products) {
  return items.reduce((sum, item) => {
    const product = products.find((entry) => entry.id === item.id && entry.active);
    const qty = Math.max(1, Number(item.qty || 1));
    return product ? sum + product.price * qty : sum;
  }, 0);
}

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

async function handleApi(req, res, url) {
  const db = readDb();

  if (req.method === "GET" && url.pathname === "/api/catalog") {
    sendJson(res, 200, {
      settings: db.settings,
      categories: db.categories,
      products: db.products.filter((product) => product.active)
    });
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
      sendJson(res, 200, {
        settings: db.settings,
        categories: db.categories,
        products: db.products,
        orders: db.orders,
        leads: db.leads,
        events: db.events,
        metrics: {
          revenue,
          orders: db.orders.length,
          leads: db.leads.length,
          events: db.events.length
        }
      });
      return;
    }

    if (req.method === "PUT" && url.pathname === "/api/admin/catalog") {
      const body = await readBody(req);
      db.settings = { ...db.settings, ...(body.settings || {}) };
      db.categories = Array.isArray(body.categories) ? body.categories : db.categories;
      db.products = Array.isArray(body.products) ? body.products : db.products;
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
  if (!process.env.ADMIN_PASSWORD) {
    console.log("Default admin password is admin123. Set ADMIN_PASSWORD in production.");
  }
});

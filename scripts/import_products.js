const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const inputFile = process.argv[2];
const dbFile = process.argv[3] || path.join(__dirname, "..", "data", "db.json");

if (!inputFile) {
  console.error("Usage: node scripts/import_products.js <products.csv|products.json> [data/db.json]");
  process.exit(1);
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

  const headers = rows[0].map((header) => normalizeKey(header));
  return rows.slice(1).map((values) => {
    const record = {};
    headers.forEach((header, index) => {
      record[header] = values[index] || "";
    });
    return record;
  });
}

function normalizeKey(key) {
  return String(key || "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "");
}

function pick(record, keys, fallback = "") {
  for (const key of keys) {
    const value = record[normalizeKey(key)];
    if (value !== undefined && String(value).trim() !== "") return String(value).trim();
  }
  return fallback;
}

function slug(value) {
  const base = String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
  return base || crypto.randomUUID().slice(0, 8);
}

function numberValue(value, fallback = 0) {
  const normalized = String(value || "").replace(/[^0-9.]/g, "");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function inferCategory(name, category) {
  const text = `${name} ${category}`.toLowerCase();
  if (text.includes("pasta") || text.includes("roller") || text.includes("cutter")) return "pasta";
  if (text.includes("grinder") || text.includes("sausage")) return "grinders";
  if (text.includes("slicer") || text.includes("shredder") || text.includes("spiral")) return "slicers";
  if (text.includes("ice cream") || text.includes("beater")) return "baking";
  if (text.includes("bowl") || text.includes("shield") || text.includes("guard")) return "bowls";
  if (text.includes("hook") || text.includes("dough")) return "baking";
  if (text.includes("clean") || text.includes("care") || text.includes("brush")) return "care";
  return "beaters";
}

function normalizeProduct(record) {
  const name = pick(record, ["name", "title", "item-name", "item name", "product-name", "product name"]);
  const sku = pick(record, ["sku", "seller-sku", "seller sku", "id", "asin", "product-id"], slug(name));
  const category = pick(record, ["category", "product-type", "product type"]);
  const price = numberValue(pick(record, ["price", "standard-price", "standard price", "sale-price"]));
  const compareAt = numberValue(pick(record, ["compareAt", "compare at", "list-price", "list price", "msrp"]), Math.ceil(price * 1.25));
  const image = pick(record, ["image", "image-url", "image url", "main-image-url", "main image url", "picture"]);
  const images = [
    image,
    pick(record, ["image2", "image-2", "image url 2", "picture2"]),
    pick(record, ["image3", "image-3", "image url 3", "picture3"]),
    pick(record, ["image4", "image-4", "image url 4", "picture4"]),
    pick(record, ["image5", "image-5", "image url 5", "picture5"])
  ].filter(Boolean);
  const description = pick(record, ["description", "item-description", "item description", "bullet-points", "bullets"], `${name} for KitchenAid-compatible stand mixers.`);
  const amazonUrl = pick(record, ["amazonUrl", "amazon url", "amazon-link", "amazon link"]);
  const amazonAttributionUrl = pick(record, ["amazonAttributionUrl", "amazon attribution url", "attribution-url", "attribution url"]);
  const productSlug = pick(record, ["productSlug", "product slug", "slug"], slug(sku || name));

  return {
    id: slug(sku || name),
    name,
    productName: pick(record, ["productName", "product name"], name),
    productSlug,
    category: inferCategory(name, category),
    price,
    compareAt,
    badge: pick(record, ["badge", "label"], "New"),
    modelFit: pick(record, ["modelFit", "model fit", "fit", "compatibility"], "All stand mixers"),
    color: pick(record, ["color", "swatch"], "#f5ebe0"),
    image: images[0] || image,
    images,
    description,
    inventory: numberValue(pick(record, ["inventory", "quantity", "qty", "stock"]), 10),
    active: !["false", "0", "no", "hidden"].includes(pick(record, ["active", "status"], "true").toLowerCase()),
    amazonUrl,
    amazonAttributionUrl,
    amazonButtonText: pick(record, ["amazonButtonText", "amazon button text"], "Buy on Amazon"),
    amazonButtonEnabled: !["false", "0", "no", "disabled"].includes(
      pick(record, ["amazonButtonEnabled", "amazon enabled", "enable amazon button"], "true").toLowerCase()
    )
  };
}

function readProducts(file) {
  const text = fs.readFileSync(file, "utf8");
  if (file.toLowerCase().endsWith(".json")) {
    const data = JSON.parse(text);
    return (Array.isArray(data) ? data : data.products || []).map((record) => normalizeProduct(record));
  }
  return parseCsv(text).map((record) => normalizeProduct(record));
}

const db = JSON.parse(fs.readFileSync(dbFile, "utf8"));
const importedProducts = readProducts(inputFile).filter((product) => product.name && product.price);

if (!importedProducts.length) {
  console.error("No valid products found. Required columns: name/title and price.");
  process.exit(1);
}

const currentById = new Map((db.products || []).map((product) => [product.id, product]));
importedProducts.forEach((product) => currentById.set(product.id, product));
db.products = [...currentById.values()];

fs.writeFileSync(dbFile, JSON.stringify(db, null, 2));
console.log(`Imported ${importedProducts.length} products into ${dbFile}`);

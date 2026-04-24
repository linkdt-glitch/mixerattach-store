# MixerAttach Independent Store

A deployable KitchenAid-compatible accessory store with:

- Front storefront, product filtering, guided kit builder, cart, order request checkout, and lead capture.
- Admin dashboard for hero copy, catalog editing, order status, leads, and analytics events.
- JSON file persistence for quick launch and easy migration to a database later.
- Zero npm dependencies. Run with Node only.

## Local Run

```bash
node server.js
```

Open:

- Storefront: http://localhost:3000
- Admin: http://localhost:3000/admin.html

Default local admin password:

```text
admin123
```

Set a real password before public deployment:

```bash
ADMIN_PASSWORD="your-strong-password" node server.js
```

## Deploy Fast

### Render

1. Push this folder to GitHub.
2. Create a new Render Web Service.
3. Build command: leave empty or use `echo "no build needed"`.
4. Start command: `node server.js`.
5. Add environment variable `ADMIN_PASSWORD`.

### Railway

1. Push to GitHub and import the repo in Railway.
2. Set start command to `node server.js` if Railway does not detect it.
3. Add environment variable `ADMIN_PASSWORD`.

### VPS

```bash
git clone <your-repo>
cd <your-repo>
ADMIN_PASSWORD="your-strong-password" PORT=3000 node server.js
```

Use Nginx or Caddy as a reverse proxy to bind your domain and HTTPS.

## Production Notes

- Replace demo images with your own licensed product photography.
- Keep the wording as "compatible with KitchenAid" unless you have brand authorization.
- Connect Stripe, PayPal, Shopify Checkout, or manual invoice payment before taking real paid orders.
- Move `data/db.json` to Postgres, Supabase, MySQL, or another managed database when traffic grows.

## Import Products

Amazon may block direct page scraping. The safest import path is to export your products from Seller Central or prepare a CSV with:

```text
sku,name,category,price,compareAt,badge,modelFit,color,image,image2,image3,image4,image5,description,inventory,active
```

Use the template at `data/products-import-template.csv`, then import from the admin dashboard or run:

```bash
node scripts/import_products.js data/products-import-template.csv
```

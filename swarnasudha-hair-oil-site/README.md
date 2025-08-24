
# Swarnasudha Hair Oil — Static Site (GitHub Pages)

A simple static website with cart and multiple payment options suitable for GitHub Pages hosting.

## Features
- Home, About, Benefits, Products, Cart, Contact pages
- Local cart (saved in browser)
- Checkout via Razorpay Payment Link, PayPal, UPI (manual), or WhatsApp order
- Mobile-friendly, lightweight

## Setup
1. Replace placeholders in `script.js`:
   - `RAZORPAY_PAYMENT_LINK` → Your link from Razorpay Dashboard (Payment Links).
   - `PAYPAL_BUSINESS_EMAIL` → Your PayPal email (or leave empty to hide PayPal flow).
   - `WHATSAPP_NUMBER` → Your WhatsApp number in international format, e.g., `9190xxxxxxx`.

2. Replace contact details in `footer` and `contact.html`.

3. Replace images inside `/assets` with your real logo and product photos.
   - Keep the same file names or update the `<img>` paths.

## Deploy to GitHub Pages
1. Create a new GitHub repository (e.g., `swarnasudha-hair-oil`).
2. Upload all files in this folder to the repo root.
3. Go to **Settings → Pages → Build and deployment → Source: Deploy from a branch**.
4. Select **Branch: main** and **Folder: / (root)**, click **Save**.
5. Your site will be live at: `https://<your-username>.github.io/<repo-name>/`

## How the Cart Works
- Items are stored in `localStorage` on the visitor’s browser.
- The **Razorpay** and **PayPal** buttons send a total for manual payment (best to cross-verify via WhatsApp).
- The **WhatsApp Order** button composes the full cart + total into a message to your WhatsApp.
- For fully automated payment + shipping collection, consider moving later to a hosted ecommerce (Wix/Shopify) or adding a backend.

## Notes
- Currency is INR by default.
- Prices are sample values; change them in `products.html` and keep in sync with your payment link.
- Always test payments first with small amounts.

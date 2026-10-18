# Homeward — store setup guide

Follow these steps in order. Most take a few minutes. The whole setup takes an afternoon, plus a few days of waiting for Yoco and Aramex to approve your accounts. **Start step 1 (accounts) today.**

> Shopify menus change from time to time. If a menu item has moved, use the search bar at the top of Shopify Admin.

---

## 0. What you need before you start

| You need | Why | Where |
|---|---|---|
| A registered business (CIPC), or at least a sole-proprietor bank account | Yoco and Aramex business accounts, and the ECT Act business disclosures | [bizportal.gov.za](https://www.bizportal.gov.za) |
| SA ID, proof of address, business bank account | Yoco's FICA verification | — |
| A Yoco account | Card payments | [yoco.com](https://www.yoco.com) |
| An Aramex business account (or a courier app that books Aramex) | Deliveries and waybills | [aramex.co.za](https://www.aramex.co.za) |
| Stock on hand in South Africa | The store promises same-day dispatch and 2–4 day delivery | — |
| A WhatsApp Business number and an email address | Customer support | — |

---

## 1. Open the accounts (start today, approvals take days)

1. **Yoco:** sign up at yoco.com and finish business verification (upload ID, proof of address and bank details). You need an approved account before Shopify can take payments.
2. **Aramex:** apply for a business/e-commerce account on aramex.co.za, or install a courier app that books Aramex for you (see step 9). Ask for their **satchel / small-parcel door-to-door rate**. That's your delivery cost per order.
3. **Shopify:** create a store at [shopify.com](https://www.shopify.com). The **Basic** plan is enough.

---

## 2. Shopify general settings

**Settings → General (Store details)**

- Store name: **Homeward Supply Co.**
- Store contact email: your support email (e.g. `hello@homeward.co.za`)
- Business address: your physical address (it appears on invoices)

**Settings → General → Store defaults**

- Currency: **South African Rand (ZAR)**. Set this **before your first order**.
- Time zone: **(GMT+02:00) Pretoria** / Johannesburg
- Unit system: Metric · Weight unit: grams
- Currency formatting (click *Change formatting*):
  - HTML without currency: `R{{amount}}`
  - HTML with currency: `R{{amount}} ZAR`
  - Email formats: the same

---

## 3. Upload the theme

**Option A: upload the zip (easiest)**

1. Download `dist/homeward-theme.zip` from this repository.
2. Shopify Admin → **Online Store → Themes → Add theme → Upload zip file** → choose the zip.
3. When it appears in your theme library, click **⋯ → Publish**.

**Option B: connect GitHub (updates automatically when the repo changes)**

1. Online Store → Themes → **Add theme → Connect from GitHub**.
2. Choose this repository and branch. Shopify reads the theme folders (`assets`, `config`, `layout`, `locales`, `sections`, `snippets`, `templates`) from the repo root and ignores the rest.

---

## 4. Fill in your business details (important for trust *and* the law)

Online Store → Themes → **Customize** → click the **gear icon (Theme settings)**:

**Business details**: these show in the footer, contact page and About page:

- Registered business name (e.g. *Homeward Supply Co. (Pty) Ltd*)
- CIPC registration number
- VAT number (leave empty if not VAT-registered)
- Physical address. Section 43 of the ECT Act requires it, and it's also your returns address.
- City you ship from
- Support email, phone, **WhatsApp number** (format `27821234567`)
- Support hours and response-time promise

**Delivery & guarantees**: these drive the delivery countdown and the promises shown on every page:

- Dispatch cut-off (default 13:00), delivery days (default 2–4)
- Public holidays list (2026 and 2027 are pre-filled; add 2028 next year)
- Return window (30 days) and warranty (12 months)

**Logo & favicon**: the built-in Homeward wordmark is used until you upload your own. Ready-made files are in `store-setup/brand/`.

> If you change the cut-off time, return window or warranty, also update the matching
> wording in the **announcement bar** (Header → Announcement bar) and the **trust bar** sections.

---

## 5. Add the product

1. **Products → Import** → upload `store-setup/products.csv`.
2. Open the imported product (*Wallet Tracker Card for iPhone (2-Pack)*) and drag in the four images from `store-setup/product-images/`, in numbered order.
3. Check the price is **R599.00**.
4. **Inventory:** the CSV imports the product *without* stock tracking, so it's always purchasable. Once you know your stock level, tick **Track quantity** and enter it.
5. **Cost per item:** enter what you pay per 2-pack so Shopify can report your profit.
6. Keep the product handle as `wallet-tracker-card-2-pack`. The homepage, header and cart find the product by this handle.

---

## 6. Create the pages

**Online Store → Pages → Add page.** For each page below, type the title, leave the content empty (the template provides it), pick the **Theme template** on the right, and check the URL handle under *Search engine listing*.

| Title | URL handle | Theme template |
|---|---|---|
| About us | `about` | `page.about` |
| FAQ | `faq` | `page.faq` |
| Contact | `contact` | `page.contact` |
| Shipping & delivery | `shipping` | `page.shipping` |
| Returns & warranty | `returns` | `page.returns` |
| Track your order | `track-order` | `page.track` |

The header and footer already link to these handles. All wording on these pages can be edited in **Customize** (open the page from the dropdown at the top).

---

## 7. Menus (optional)

The theme has a built-in menu (*Shop · How it works · FAQ · Track order · Contact*) and footer links, so you don't need to set anything up. If you'd rather manage them yourself, create menus under **Online Store → Navigation**, then select them in Customize → Header / Footer.

---

## 8. Payments: Yoco

> Shopify Payments isn't available in South Africa, so you need a third-party gateway.

1. Make sure your Yoco account is approved.
2. Shopify Admin → **Settings → Payments → Add payment method** (or *Choose a provider*) → search **Yoco**. The app is **Yoco Payments** in the Shopify App Store, made by Yoco.
3. Install it, sign in with your Yoco account, and **activate** it.
4. **Test it:** place a real order for R599 with your own card, then refund it from the Shopify order page. Check that the money and refund both show in your Yoco portal.
5. Shopify charges an extra transaction fee on third-party gateways (the percentage depends on your plan). Check **Settings → Plan** for the current rate and include it in your margin.

The payment icons on the store (product page, cart, footer) come straight from your enabled payment methods, so they update automatically once Yoco is active.

> If Yoco isn't listed for your store, other South African gateways that work with Shopify include Paystack, PayFast and Peach Payments. The theme doesn't need any changes, but update the
> words "Yoco" in Theme settings, the trust bar, FAQ and policies.

---

## 9. Shipping: Aramex

### 9a. Shipping rates in Shopify

**Settings → Shipping and delivery → General shipping rates → Manage**

1. Keep one zone, **Domestic: South Africa**. Delete any international zones.
2. Delete the default rates and **Add rate**:
   - Name: `Free Aramex delivery (2–4 working days)`
   - Price: **R0.00**
3. Save.

**Packages** (same page): add a package matching your mailer, for example *Card mailer, 22 × 16 × 3 cm, 100 g*, and set it as default.

> Free delivery is built into the R599 price. Budget your Aramex satchel rate (ask Aramex for your quote) per order when working out your margin.

### 9b. Booking Aramex and sending tracking to customers

Pick one:

- **Aramex directly:** book each parcel in your Aramex customer portal and print the waybill.
- **A courier app on Shopify:** for example **ScrubBill** in the Shopify App Store. It supports Aramex (and about 30 other South African couriers), pulls in your Shopify orders, creates and prints waybills, and sends tracking numbers back to Shopify automatically.

Then, for every order:

1. Shopify Admin → **Orders** → open the order → **Fulfil items**.
2. Add the **tracking number** and choose **Aramex** as the carrier (if Aramex isn't in the list, choose *Other* and paste the Aramex tracking link).
3. Leave **"Send shipment details to your customer now"** ticked → **Fulfil items**.

The customer gets an email with the tracking link. If you use a courier app, steps 2–3 happen automatically.

### 9c. Track-order page

The **Track your order** page sends customers to Aramex's tracking page with their waybill number. Before launch, open the page, enter a real waybill and check the Aramex result loads. If it doesn't, change the **Courier tracking link** in Customize → Track your order page.

### 9d. Collect a phone number at checkout

Aramex drivers need a cellphone number. **Settings → Checkout → Customer information → Shipping address phone number → Required.**

---

## 10. Taxes (VAT)

**Settings → Taxes and duties → South Africa**

- **VAT-registered:** turn on VAT collection at 15%, and under *Tax calculations* turn on **"Include tax in prices"** so R599 stays R599. Add your VAT number in Theme settings. The store then shows "VAT included".
- **Not VAT-registered:** don't collect tax. Leave the VAT number empty in Theme settings.

Ask your accountant whether you need to register for VAT.

---

## 11. Policies

**Settings → Policies:** paste in the files from `store-setup/policies/`, after replacing every `[placeholder]`:

| Shopify field | File |
|---|---|
| Return and refund policy | `refund-policy.md` |
| Privacy policy | `privacy-policy.md` |
| Terms of service | `terms-of-service.md` |
| Shipping policy | `shipping-policy.md` |
| Contact information | `contact-information.md` |

These appear in the footer and at checkout.

---

## 12. Emails customers receive

**Settings → Notifications → Customer notifications**

- **Customize email templates:** upload `store-setup/brand/homeward-logo.png`, set the accent colour to `#1E5F4B`.
- **Sender email:** use your own domain email (e.g. `hello@homeward.co.za`) and verify it.
- **Order confirmation:** add a line such as: *"Weekday orders placed before 13:00 are dispatched the same day. We'll email your Aramex tracking number as soon as your parcel is on its way."*
- **Shipping confirmation:** add: *"Need help? WhatsApp us on [number]."*

---

## 13. Domain and email

1. Buy a `.co.za` domain, either through **Settings → Domains → Buy new domain** or from a local registrar (e.g. Domains.co.za, xneelo), then **Connect existing domain**.
2. Set up a branded mailbox (`hello@yourdomain.co.za`) with Google Workspace, Zoho Mail or your registrar. Branded email builds far more trust than a Gmail address.
3. Check the name is free first: search the CIPC name register and the domain, and consider a trademark search before you invest in the brand.

---

## 14. POPIA basics

- **Settings → Customer privacy:** turn on the **cookie banner** for visitors.
- Register your **Information Officer** (usually the owner/director) with the Information Regulator through its online portal at [inforegulator.org.za](https://inforegulator.org.za). Registration is free.
- Only email people who opted in (the newsletter form and checkout checkbox handle this).

---

## 15. Apps worth adding

| App | Why | Cost |
|---|---|---|
| **Judge.me Product Reviews** | Verified reviews, automatic review-request emails. Add its block to the *Customer reviews* section on the homepage and product page. | Free plan |
| **ScrubBill** (or similar) | Aramex waybills plus automatic tracking sync | Per waybill |
| **Shopify Email / Shopify Forms** | Newsletter and launch emails | Free tier |
| **Google & YouTube, Facebook & Instagram** | Free product listings and ads, using the product data the theme already provides | Free to install |

> **Reviews:** the reviews section stays **hidden until you add real reviews**. Never invent reviews. Under the Consumer Protection Act that's a false, misleading or deceptive representation, and customers spot it quickly. Ask your first customers for honest reviews instead.

---

## 16. Before you remove the password

Work through [`LAUNCH-CHECKLIST.md`](LAUNCH-CHECKLIST.md), then go to **Online Store → Preferences → Password protection** and turn it off. You need a paid plan to do this.

While the password is on, visitors see the *Opening soon* page, which collects emails for launch day.

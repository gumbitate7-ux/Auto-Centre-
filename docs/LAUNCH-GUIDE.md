# CLIMORA launch guide

This guide walks you through turning the theme in this repository into a live store. Some steps need Shopify Admin access, a Yoco account, an Aramex account or legal review. **The theme does not configure these for you.** Each such step is marked with ⚠️.

---

## 1. Install and preview the theme

**Option A: Shopify CLI (recommended for development)**

```bash
npm install -g @shopify/cli
cd Auto-Centre-
shopify theme dev --store your-store.myshopify.com     # local preview with hot reload
shopify theme push --unpublished                        # upload as a new, unpublished theme
```

**Option B: GitHub integration.** Go to Online Store → Themes → Add theme → Connect from GitHub, then pick this repository and branch. The theme files are at the repository root.

**Option C: ZIP upload.** Zip the folders `assets config layout locales sections snippets templates`. Then go to Online Store → Themes → Add theme → Upload zip file.

Open **Customize** to edit any section, image, text, colour or product selection in the theme editor.

---

## 2. Store basics (Settings) ⚠️

1. **Settings → General:** set the store currency to **South African Rand (ZAR)** and add your business address.
2. **Settings → Taxes and duties:** if you are VAT-registered, configure 15% VAT and decide whether prices include tax. The theme shows "Taxes included." or "Taxes calculated at checkout." automatically.
3. **Settings → Notifications:** set the sender email. Contact-form messages and order emails use it.
4. **Online Store → Preferences:** set the homepage title and meta description (see section 9), and keep the password page on until launch.

---

## 3. Add the products ⚠️

Create each product in **Products → Add product**. The handles below are pre-wired into the homepage, curated sets and menus. If you use different handles, reselect the products in the theme editor.

| Title | Handle (URL) | Theme template | Product type | Variants |
| --- | --- | --- | --- | --- |
| CLIMORA SolarFlow | `climora-solarflow` | `product.solarflow` | Portable Cooling | Usually none |
| CLIMORA IceSoft | `climora-icesoft` | `product.icesoft` | Sleep Cooling | Size, Colour |
| CLIMORA FrostLayer | `climora-frostlayer` | `product.frostlayer` | Sleep Cooling | Size (Single, Double, Queen, King…) |

For each product:

- **Price, compare-at price, inventory, SKU and variants:** enter them in Shopify. The theme never hard-codes these.
- **Media:** upload at least 3 square photos (2000 × 2000px, a light ice/white background for consistency). Write descriptive alt text, e.g. *"CLIMORA FrostLayer cooling mattress topper on a queen bed"*. Assign variant images so the gallery switches when a size or colour is picked.
- **Description:** write a factual description. Only include claims your supplier can verify. Avoid temperature-reduction, medical or performance claims.
- **Theme template:** in the right-hand column, pick the template from the table above.
- **Specifications:** in the theme editor (Customize → Products → choose template → *Product information* → *Specifications*), each line is `Label | Value`. **Rows with an empty value are hidden.** Unverified specs (battery capacity, runtime, fabric composition, thickness and so on) are left empty on purpose; fill them in once verified. Alternatively, create a multi-line text metafield `custom.specifications` (same format) to manage specs per product.
- **Optional metafields** (Settings → Custom data → Products):
  - `custom.tagline` (single line text): the positioning line shown under the title on the generic template.
  - `custom.short_description` (single line text): the text on product cards.
  - `custom.specifications` (multi-line text): overrides the specs block.
- **Highlights:** product-page highlight chips and the "Why SolarFlow / IceSoft / FrostLayer" feature cards are editable in the theme editor. Review them against your supplier's information before launch.

---

## 4. Collections ⚠️

Create these in **Products → Collections**:

| Title | Handle | Theme template | Suggested conditions (automated) |
| --- | --- | --- | --- |
| Sleep Cooling | `sleep-cooling` | `collection.sleep-cooling` | Product type equals *Sleep Cooling* |
| Portable Cooling | `portable-cooling` | `collection.portable-cooling` | Product type equals *Portable Cooling* |

"Shop All" is Shopify's built-in `/collections/all`. Add a collection image (optional) and an SEO description for each.

---

## 5. Pages ⚠️

Create these in **Online Store → Pages**. The content is pre-designed in the templates; the page body can stay empty, or you can add extra text that appears under the main content.

| Page title | Handle | Theme template |
| --- | --- | --- |
| Our Story | `about` | `page.about` |
| Contact | `contact` | `page.contact` |
| FAQ | `faq` | `page.faq` |
| Shipping & Delivery | `shipping-delivery` | `page.shipping` |
| Returns & Refunds | `returns-refunds` | `page.returns` |

Then go to **Customize → Theme settings → Delivery** and select the *Shipping & Delivery* page so the product-page delivery note links to it.

**Privacy Policy and Terms & Conditions** are Shopify policies (section 8), not pages. The footer links to them automatically.

---

## 6. Navigation

Until you create menus, the header and footer show built-in CLIMORA navigation, so every link works from day one. To manage menus yourself, go to **Online Store → Navigation**:

- **Main menu** (`main-menu`): Home `/`, Shop All `/collections/all`, Sleep Cooling, Portable Cooling, Our Story (page), Contact (page).
- Optional footer menus: select them in **Customize → Footer**.

---

## 7. Payments: Yoco ⚠️

**Shopify Payments is not available in South Africa**, so you need a third-party payment provider. Yoco publishes an official app on the Shopify App Store (**Yoco Payments**: https://apps.shopify.com/yoco-payments). It integrates with Shopify's hosted checkout. Card details are entered on Shopify's or Yoco's secure payment pages, never in the theme, and **no API keys or credentials belong in theme code**.

Steps (confirm the current steps on the app listing and with Yoco support, as their onboarding can change):

1. Create and fully verify a **Yoco business account** (https://www.yoco.com/za/).
2. In Shopify Admin, install **Yoco Payments** from the Shopify App Store and follow the connection flow. Any keys are entered inside the app or Shopify Admin only.
3. Go to **Settings → Payments** and confirm Yoco is shown as an active payment method. Remove any test providers.
4. Check your Shopify plan is compatible with the app. Some merchants have reported plan-related compatibility errors, so confirm with Yoco or Shopify support if you see one.
5. Run a real low-value transaction and refund it (section 10).

The footer payment icons show only the payment methods Shopify reports as enabled, so they are always accurate.

*Alternatives if needed:* other South African providers, such as Payfast, Peach Payments and Paystack, also offer Shopify integrations.

---

## 8. Shipping: Aramex ⚠️

The storefront consistently shows: *"Your CLIMORA order will be delivered through our courier partner, Aramex. Estimated delivery is 5–10 business days, subject to order processing and courier collection."* You can edit it once in **Theme settings → Delivery**. **The theme does not invent shipping prices or tracking numbers**; those come from your Shopify shipping settings and fulfilments.

**Step 1: Shipping rates (Settings → Shipping and delivery).** Choose one approach:

- **Flat rates (simplest, works on every plan):** in your General shipping profile, create a South Africa zone and add a rate named e.g. **"Aramex Standard (5–10 business days)"**. Use the price you agree with Aramex; you can add a weight-based or free-over-amount rate if you want.
- **Live (calculated) Aramex rates:** this needs (a) an Aramex business account, (b) an app or integration that supports Aramex South Africa, and (c) Shopify's third-party calculated shipping rates feature. That feature is included on higher Shopify plans or available as a paid add-on, so check your plan. Options include Aramex's own e-commerce/fulfilment integration (https://www.aramex.com/sa/en/services-solutions/fulfillmentapp; confirm Shopify support with Aramex), third-party Shopify apps such as PluginHive's Aramex app, or South African shipping aggregators that list Aramex. Confirm Aramex ZA support before subscribing.

**Step 2: Fulfilment and tracking.** When you fulfil an order (Orders → order → Fulfil), enter the **Aramex waybill/tracking number** and select **Aramex** as the carrier, or choose "Other" and add the Aramex tracking URL. Shopify then emails the customer the shipping confirmation with tracking. An Aramex app can automate waybills and tracking.

**Step 3:** update **Settings → Policies → Shipping policy** (draft in `docs/policies/shipping-policy.md`).

---

## 9. Policies, legal and SEO ⚠️

**Policies (Settings → Policies).** Paste and adapt the drafts in `docs/policies/`:

- `privacy-policy.md`: POPIA-aware draft.
- `terms-of-service.md`
- `refund-policy.md`: reflects the ECTA 7-day cooling-off period and the CPA 6-month defective-goods rights.
- `shipping-policy.md`

> These are starting points, **not legal advice**. Have them reviewed by a South African legal professional before publishing. The Returns & Refunds page template contains a customer-friendly summary of the same terms, so update both if you change your policy.

**Recommended SEO titles and descriptions:**

| Where | SEO title | Meta description |
| --- | --- | --- |
| Homepage (Online Store → Preferences) | CLIMORA – Innovative Cooling Products in South Africa | Stay cool with CLIMORA: cooling mattress toppers, cooling pillowcases and solar rechargeable fans, delivered across South Africa by Aramex. |
| SolarFlow | CLIMORA SolarFlow – Solar Rechargeable Fan South Africa | A portable, solar-powered rechargeable fan for convenient airflow at home and outdoors. Delivered by Aramex in 5–10 business days. |
| IceSoft | CLIMORA IceSoft – Cooling Pillowcase | Bring a fresher feel to your sleep with the IceSoft cooling pillowcase. Soft, breathable and available in multiple sizes. |
| FrostLayer | CLIMORA FrostLayer – Cooling Mattress Topper South Africa | Rethink the way you sleep with the FrostLayer cooling mattress topper. Choose your mattress size; delivered by Aramex. |
| Sleep Cooling | Sleep Cooling – Cooling Bedding South Africa | Cooling mattress toppers and cooling pillowcases designed for warmer South African nights. |
| Portable Cooling | Portable Cooling Solutions – Solar Rechargeable Fans | Portable cooling solutions, including solar rechargeable fans for home, office and outdoor use. |

Only include "multiple sizes" and similar claims if they are true for your variants. The theme also outputs canonical URLs, Open Graph/Twitter tags, `Organization` and `WebSite` JSON-LD, and `Product` JSON-LD with live offers, prices and availability.

---

## 10. Test checkout ⚠️

1. **Before Yoco is live:** in Settings → Payments, temporarily activate *(for testing) Bogus Gateway* (available on stores without Shopify Payments). Place orders using card number `1` (success) or `2` (failure).
2. Test every path: add to cart from a product card, a product page and a curated set; change quantities in the drawer and on the cart page; remove items; use Buy Now; add an order note; apply a discount code at checkout.
3. Check that the shipping rate shows at checkout with the Aramex name, and that taxes behave as expected.
4. Fulfil a test order with a tracking number and check the customer email.
5. After installing Yoco, place one real low-value order, refund it, and confirm it appears in your Yoco dashboard.
6. Remove the Bogus Gateway.

---

## 11. Launch checklist

- [ ] Products have real photos, verified descriptions and specifications, prices and inventory
- [ ] Hero image uploaded (Customize → CLIMORA hero → Hero image), or keep the built-in illustration
- [ ] Collections, pages and templates assigned as in sections 3–5
- [ ] Contact email, phone (optional) and hours set in Theme settings → Contact & social
- [ ] Logo (optional: the built-in wordmark is used otherwise), favicon and social sharing image
- [ ] Yoco connected and tested; test gateways removed
- [ ] Aramex shipping rates configured; fulfilment and tracking process agreed
- [ ] Policies published (Settings → Policies) after legal review
- [ ] Domain connected (Settings → Domains), and SSL active (automatic)
- [ ] Theme published (Online Store → Themes → Publish)
- [ ] Password page removed (Online Store → Preferences)
- [ ] Submit `https://yourdomain/sitemap.xml` to Google Search Console

---

## What's included vs. what you configure

| Included in the theme | You configure in Shopify Admin / with partners |
| --- | --- |
| All storefront pages, sections, templates and theme settings | Products, prices, variants, inventory, photography |
| Cart drawer and cart page (Shopify Cart AJAX API), Buy Now (dynamic checkout) | Payment provider (Yoco app) |
| Predictive search (Shopify Predictive Search API) | Shipping rates, Aramex account, tracking |
| Contact form and newsletter (native Shopify forms → Customers) | Policies (legal review), taxes, domain |
| SEO meta and structured data | Per-page SEO text, Google Search Console |

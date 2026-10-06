# Escale Boutique — Shopify theme for boutique.escalevr.ca

Custom Online Store 2.0 theme for **Escale VR**'s parts, accessories and service-plan store.
French-first (fr-CA default), bilingual (en-CA), SEO/AEO/GEO-ready. Built by Maxx Stacks.

```
layout/       theme.liquid, password.liquid
sections/     header + footer groups, homepage sections, main-* templates, customer account
snippets/     schema-site, schema-product, breadcrumbs (BreadcrumbList), product-card, facets…
templates/    JSON templates (+ product.service-plan, page.contact, page.faq, robots.txt.liquid)
locales/      fr.default.json, en.json
assets/       base.css, theme.js (no dependencies, no jQuery)
scripts/      metafield-definitions.graphql
data/         products-import-template.csv
```

Theme Check (`theme-check:recommended`): **0 errors, 0 warnings.**

---

## 1. Domain: `boutique.escalevr.ca`, not `escalevr.ca/boutique`

Shopify can't be served from a sub-folder of a WordPress site. Proxying `/boutique` through
Cloudflare breaks checkout, customer accounts and order tracking, and puts the store in breach
of Shopify's terms. Use the subdomain:

| Record | Host | Value |
|---|---|---|
| CNAME | `boutique` | `shops.myshopify.com` |

Then in Shopify: **Settings → Domains → Connect existing domain → `boutique.escalevr.ca`**, set it as primary.
Add a **Boutique** link in the WordPress main menu and footer pointing to `https://boutique.escalevr.ca`.
Google treats the subdomain as part of the same brand once both sites link to each other and share the
Organization `@id` (`https://escalevr.ca/#organization`, already emitted by this theme).

## 2. GitHub → Shopify

```bash
git remote add origin git@github.com:<org>/escale-boutique.git
git push -u origin main
```
Shopify admin → **Online Store → Themes → Add theme → Connect from GitHub** → pick the repo and the `main` branch.
Shopify commits theme-editor changes back to the branch. Use a `staging` branch connected as a second, unpublished theme for review.

## 3. Store setup checklist (in this order)

1. **Plan & taxes:** Settings → Taxes: Canada, GST + QST registration numbers.
2. **Languages:** Settings → Languages → French = default, add English, publish. Install **Translate & Adapt** to translate products, collections and section text. Shopify outputs `hreflang` automatically for published languages, so don't add it by hand.
3. **Customer accounts:** Settings → Customer accounts → turn on **customer accounts** and show the login link. Customers then see pending, shipped and delivered orders with tracking. The theme also ships classic account templates (`templates/customers/*`): order list with an *En attente* tab, a 4-step progress tracker and per-item tracking links.
4. **Metafields:** run `scripts/metafield-definitions.graphql` (part number, condition, compatibility, specifications, plan features, collection SEO footer).
5. **Search & Discovery app → Filters:** Availability, Price, Vendor (*Marque*), Product type (*Catégorie*), Tag (*Liquidation*). Also add Part number to **search** fields so `4008-101-A65` finds the product.
6. **Collections** (automated, by tag or type):

   | Handle | Rule | Purpose |
   |---|---|---|
   | `liquidation` | tag = `liquidation` | the $300K inventory push |
   | `plans-entretien` | type = `Plan d'entretien` | service and spring plans (assign product template `service-plan`) |
   | `electricite-batteries`, `plomberie-eau`, `chauffage-climatisation`, `auvents-exterieur`, `attelage-remorquage`, `essieux-suspension-freins`, `entretien-produits`, `interieur-cuisine`, `accessoires-camping` | type = … | category tiles on the homepage |
   | `meyer`, `ntp-stag`, `keystone`, `atlas-trailer` | tag = `src-meyer`, etc. | distributor catalogs |
   | `nouveautes` | created in last X days / manual | homepage “Les essentiels de la saison” |

7. **Navigation:** create `escalevr-site` (white top bar, mirrors the dealership: Nos VR neufs → escalevr.ca/acheter/, Nos VR usagés → /vr-occasion/, Location → /louer-un-vr/, Services → /notre-service/, Financement → /financement/, Promotions → /promotions/), `main-menu` (Liquidation · Pièces ▾ (category children) · Plans d'entretien · Marques ▾ · Nous joindre), `footer`, `footer-help` (Livraison, Retours, FAQ, Suivi de commande, Politique de confidentialité).
8. **Pages:** *Nous joindre* (template `page.contact`), *FAQ* (`page.faq`), *Livraison et retours*. Pick that last page in Product → “Shipping & returns page” so every product carries the real policy.
9. **Policies:** Settings → Policies: refund, privacy (**Quebec Law 25**: name the person in charge of personal information), shipping, terms, all in French and English.
10. **Theme settings:** official Escale VR logos and brand colors (green #465C50, dark green #354940, orange #F5901D) are built in. Upload higher-resolution logo files (SVG/PNG ≥ 600 px) in Header/Footer if you have them, and set the Google logo under Business info. Confirm business info, hours and lat/long, which feed the LocalBusiness schema.
11. **Sales channels:** Google & YouTube (Merchant Center free listings; product schema and GTIN/MPN are ready), Shop app, Facebook & Instagram.

## 4. Loading the inventory

* **Escale VR's own stock (~$300K):** export from their DMS/parts system to `data/products-import-template.csv` columns (French titles, SKU = part number, `liquidation` tag, compare-at = original price) and import via **Products → Import** (or **Matrixify** for 1,000+ SKUs with images).
* **Distributor catalogs (Meyer, NTP-STAG, Keystone, Atlas):** each publishes a dealer data/inventory feed. Use a feed-sync app (Stock Sync, or Matrixify scheduled imports) to pull **only curated categories** with markup rules, tag them `src-<distributor>`, and set inventory to the distributor's stock. Don't dump 100K raw SKUs on day one: thin, duplicate distributor copy hurts SEO. Start with the RV categories that match search demand, then expand.

## 5. SEO / AEO / GEO built into the theme

* **Entity graph on every page:** `Organization` (escalevr.ca) + `AutoPartsStore` (NAP, geo, hours, areaServed) + `WebSite` with `SearchAction`.
* **Products:** `Product`/`ProductGroup`, per-variant `Offer`, `mpn`/`gtin`, `brand`, `itemCondition`, `shippingDetails`, `hasMerchantReturnPolicy` (Merchant Center-grade).
* **Collections:** `CollectionPage` + `ItemList`. A short intro at the top and a long SEO block at the bottom (`custom.description_bottom`) so the grid stays above the fold.
* **BreadcrumbList** everywhere, **FAQPage** on the homepage, FAQ page and plan pages, **BlogPosting** on articles.
* One `<h1>` per template. Responsive `srcset` images with LCP `fetchpriority="high"` and lazy-loading below the fold. No render-blocking JS. Fonts use `font-display: swap`.
* `robots.txt.liquid`: blocks crawl-budget waste on filter/sort URLs and explicitly allows GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot and Google-Extended.
* `noindex` on search, cart and account pages. Canonicals come from Shopify's `canonical_url`.
* **Titles/meta:** write them in the admin (“Search engine listing”) using the patterns in `data/products-import-template.csv`: *[Product] [key spec] pour VR | Escale VR* / description mentioning Beaumont, Lévis or Québec where natural.

## 6. Before launch

- [ ] Higher-resolution logo files (bundled ones are 189×64 px)
- [ ] Confirm hours, lat/long and return policy (FAQ answers state 30 days, change if different)
- [ ] Translate all section text into EN with Translate & Adapt
- [ ] Test order: place, fulfill with tracking, check account → order page shows tracking
- [ ] Submit `https://boutique.escalevr.ca/sitemap.xml` in Google Search Console (new property) and Bing Webmaster Tools
- [ ] Link the boutique from escalevr.ca header, footer and the *Pièces et entretien* page

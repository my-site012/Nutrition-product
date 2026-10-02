# NSNZ Nutrition - Shopify Theme

## Theme Overview
A premium dark-themed Shopify theme built for a sports nutrition/supplement store, inspired by:
- **SprintFit.co.nz** — Features & functionality (navigation, categories, product structure)
- **Amukti.in** — Clean Shopify layout patterns
- **Aina.in** — Premium e-commerce design language

---

## Theme Features ✅

### Header & Navigation
- ✅ Sticky header with blur effect
- ✅ Marquee announcement bar (scrolling offers)
- ✅ Hamburger mobile menu with slide-out drawer
- ✅ Multi-level dropdown navigation (3 levels deep)
- ✅ Live search autocomplete with product suggestions
- ✅ Cart icon with item count badge
- ✅ Wishlist icon
- ✅ Account icon

### Homepage Sections
- ✅ Hero banner (full-height, image/video support)
- ✅ Trust badges bar (free shipping, same-day dispatch, etc.)
- ✅ Shop by Category grid (8 categories with images)
- ✅ Featured Products grid (configurable collection)
- ✅ Promo/Sale banners (2-column layout)
- ✅ Shop by Goal (tabbed - Weight Loss / Muscle / Mass / Recovery / Energy)
- ✅ Brand logos section
- ✅ Customer reviews section

### Product Card
- ✅ Sale badge with % discount
- ✅ New / Hot / Bestseller badges
- ✅ Wishlist button (heart icon)
- ✅ Star ratings
- ✅ Brand name display
- ✅ Price + Compare price + Save %
- ✅ Variant chips (flavours/sizes)
- ✅ "Add to Cart" button (slides up on hover)
- ✅ Hover zoom on product image

### Collection/Category Page
- ✅ Breadcrumb navigation
- ✅ Filter sidebar (price, brand, tags, availability)
- ✅ Sort dropdown
- ✅ Product count display
- ✅ Pagination

### Product Page
- ✅ Image gallery with thumbnails
- ✅ Variant selectors (colour/size/flavour chips)
- ✅ Quantity selector
- ✅ Add to Cart + Buy Now buttons
- ✅ Real-time price update on variant change
- ✅ Trust badges (Free Shipping, Authentic, Returns)
- ✅ Product tags
- ✅ Tabbed content (Description / Nutritional Info / How to Use / Reviews)
- ✅ Related products

### Cart
- ✅ Slide-out cart drawer
- ✅ Add/Remove/Change quantity in cart
- ✅ Free shipping progress bar
- ✅ Checkout button
- ✅ Real-time cart updates via AJAX

### Other Features
- ✅ Toast notifications (add to cart, wishlist)
- ✅ Back to top button
- ✅ Scroll animations (fade in on scroll)
- ✅ Quick View modal (product preview)
- ✅ Newsletter subscription form
- ✅ Full responsive (mobile, tablet, desktop)
- ✅ Dark mode design throughout
- ✅ Countdown timer for flash sales

### Footer
- ✅ Trust badges row
- ✅ Brand logo + description + social links
- ✅ Shop / Help / About navigation columns
- ✅ Newsletter subscription
- ✅ Payment icons (Visa, MC, Amex, Afterpay, PayPal, Apple Pay, Google Pay)
- ✅ Copyright bar

---

## File Structure
```
shopify-theme/
├── layout/
│   └── theme.liquid          # Main layout (header, footer, cart drawer)
├── templates/
│   ├── index.json            # Homepage template
│   ├── collection.json       # Category page template
│   └── product.json          # Product page template
├── sections/
│   ├── index.liquid          # Homepage sections (hero, categories, products etc.)
│   ├── collection.liquid     # Collection page with filters
│   ├── product.liquid        # Product page full layout
│   └── footer.liquid         # Footer section
├── snippets/
│   └── product-card.liquid   # Reusable product card component
├── assets/
│   ├── theme.css             # All styles (dark theme)
│   └── theme.js              # All JavaScript (cart, menu, search etc.)
├── config/
│   ├── settings_schema.json  # Theme settings in Shopify admin
│   └── settings_data.json    # Default settings values
└── locales/
    └── en.default.json       # English translations
```

---

## How to Upload to Shopify

1. **ZIP the theme folder:**
   - Select all files inside `shopify-theme/` folder
   - Right-click → Compress/Zip → Name it `nsnz-nutrition-theme.zip`

2. **Upload to Shopify:**
   - Go to **Shopify Admin** → **Online Store** → **Themes**
   - Click **"Add Theme"** → **"Upload zip file"**
   - Select your `nsnz-nutrition-theme.zip`
   - Click **"Upload file"**

3. **Preview & Publish:**
   - Click **"Preview"** to see the theme
   - When ready, click **"Publish"** to make it live

4. **Customize in Theme Editor:**
   - Go to **Customize** in Shopify admin
   - Upload your logo, hero images, category images
   - Select your featured collection for homepage
   - Add your social media links
   - Configure navigation in **Online Store → Navigation**

---

## Navigation Setup

In Shopify Admin → **Online Store → Navigation**, create a menu called "Main menu" with these items:
- Sports Supplements → /collections/all-sports-supplements
  - Protein Powder → /collections/protein-powder
  - Creatine → /collections/creatine
  - Pre Workout → /collections/pre-workout
  - Protein Bars → /collections/protein-bars
  - Weight Loss → /collections/weight-loss
  - Amino Acids & BCAAs → /collections/amino-acids
  - Hydration & Endurance → /collections/hydration
  - Combos → /collections/combos
- Top 50 Supplements → /collections/top-50
- Natural Health → /collections/natural-health
- Accessories → /collections/accessories
- Shop by Goal → (dropdown)
- Special Offers → /collections/specials
- Clearance → /collections/clearance
- New Arrivals → /collections/new-arrivals
- Shop By Brand → /collections/all?sort_by=brand

---

## PDF Products (NSNZ_Order_September_2026)
The PDF contains your product order list. To import products:
1. Go to Shopify Admin → **Products** → **Import**
2. Download the Shopify CSV template
3. Fill in your products from the PDF
4. Upload the CSV file

---

## Support
For customization support, contact your developer.

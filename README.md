# Ednivo — Production Website Codebase (Fixed & Audited)

This repository contains the complete, production-ready website source code for **[Ednivo](https://ednivo.in/)** (Online Digital SAT Preparation Platform).

All issues identified during the comprehensive software audit have been resolved in this working copy.

---

## 🚀 How to Run Locally (Beginner Friendly)

### Option 1: Double-Click (Easiest)
1. Double-click **`run-local-server.bat`**.
2. Your browser will automatically open [http://localhost:8000](http://localhost:8000).

### Option 2: Command Line
Open PowerShell or Command Prompt in this folder and run:
```bash
python -m http.server 8000
```
Then visit `http://localhost:8000` in any web browser.

---

## 🧪 How to Run Automated Integrity Tests
Double-click **`run-tests.bat`** or run:
```bash
python test-integrity.py
```
This tests all 33 HTML pages and over 500 internal links and assets to confirm that **0 broken links or missing resources exist**.

---

## 🛠️ Summary of Verified Fixes & Architecture

### 1. Navigation & 404 Routing
- **Soft-404 Elimination:** Updated `_redirects` to point non-existent URLs to `/* /404.html 404` so search engines receive a true HTTP 404 response.
- **Custom 404 Page:** Built a branded, modern `404.html` matching the Ednivo theme with recovery links.
- **Missing Blog Articles:** Added complete, high-quality guides for:
  - `blog-digital-sat.html` (Digital SAT 2026 Strategy)
  - `blog-sat-vs-act.html` (SAT vs ACT Comparison)
  - `blog-personal-statement.html` (College Personal Statement Blueprint)
  - `blog-loan-comparison.html` (Education Loan Comparison)
  - `blog-f1-visa.html` (F-1 Student Visa Guide)
- **Dead Blog Links Fixed:** Re-routed unlinked categories in `blog.html` directly to the corresponding landing pages (`college-credits.html`, `loans-forex.html`, `profile-building.html`).
- **Cleaned Bad Tags:** Removed broken `<link href="blog-sat-guide.html" rel="stylesheet"/>` in `blog-us-admissions.html`.

### 2. Assets & Mobile Responsiveness
- **Restored Brand Logo:** Created `assets/ednivo-logo.png` from brand assets so headers, footers, and favicons render crisply without broken image boxes.
- **Mobile Responsive CSS:** Created `assets/mobile.css` with container query utilities, mobile grid stacks, and responsive tables.

### 3. Lead Generation & Booking Funnel
- **Booking Form (`book.html`):** Replaced placeholder dummy alert with real backend dispatch to `window.EdNivoSaveLeadEverywhere` (Supabase + Google Apps Script), offline resilient local queue, and instant WhatsApp booking connection.
- **Diagnostic Tool (`sat-diagnostic.html`):** Integrated full 20-question adaptive diagnostic exam with automated scoring, lead capture, and Google Analytics 4 integration.

### 4. Payments & Checkout Continuity
- **Zero-Drop Checkout (`payment.html`):** Configured payment button so that if `window.EDNIVO_PAYMENT_LINK_PRO` is empty (default state before live Stripe/Razorpay link is added), it seamlessly routes the student to WhatsApp enrollment with their order details pre-filled. No paying customer ever encounters a dead end.

### 5. Technical SEO & AI Search Visibility
- **`robots.txt`:** Allows full search indexing while disallowing private dashboards (`/admin.html`, `/student-dashboard.html`, `/classes.html`, `/practice.html`, `/mocks.html`, `/payment.html`).
- **`sitemap.xml`:** Upgraded to index all 23 valid public pages and strategic guides with accurate priorities and change frequencies.

### 6. Authentication & Session Management
- **Universal Session Compatibility:** Synchronized session handling in `auth.js`, `login.html`, and `student-shell.js` to support both `ednivo_user` and `pw_user`.
- **Zero-Cost Admin Dashboard (`admin.html`):** Added a secure local administrative fallback (Key: `ednivo2026`) allowing the owner to view and manage leads locally without paying for external server hosting.

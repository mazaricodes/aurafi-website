# Lafzi — Official Landing Page & Web Portal

> **100% Offline AI Video Captioning Studio for South Asian Creators**
> Transcribe 18 regional languages with native typography, Roman transliteration, and 24 viral creator styles.

---

## 🚀 GitHub Pages Deployment

This repository is ready to be hosted directly on **GitHub Pages**:

1. Go to your repository **Settings** on GitHub:
   `https://github.com/mazaricodes/lafzi-landing/settings/pages`
2. Under **Build and deployment**:
   - **Source**: `Deploy from a branch`
   - **Branch**: `main`
   - **Folder**: `/ (root)`
3. Click **Save**.
4. Your site will be live at:
   `https://mazaricodes.github.io/lafzi-landing/`

*(Note: GitHub Pages on private repositories requires GitHub Pro / Team. If you are on GitHub Free, make the repository public under Settings ➔ General ➔ Change visibility).*

---

## 💳 Gumroad Checkout Integration (Lafzi Studio)

The landing page features built-in Gumroad checkout integration for **Lafzi Studio** (Rs 2,950):

- **Overlay Checkout**: Powered by Gumroad Overlay (`https://gumroad.com/js/gumroad.js`).
- **Dynamic Promo Codes**: Discounts and promo codes are passed directly to Gumroad checkout via query parameters (`?discount_code=CODE`).
- **Configuration**:
  To connect your own live Gumroad product URL, update `DEFAULT_GUMROAD_URL` in `script.js` or define `window.LAFZI_GUMROAD_URL`:
  ```javascript
  window.LAFZI_GUMROAD_URL = "https://gumroad.com/l/YOUR-PRODUCT-SLUG";
  ```

---

## 📂 Project Structure

```
├── index.html          # Main landing page (Hero, Simulator, Features, Editions, FAQ)
├── styles.css          # Boxy liquid glass aesthetic with crimson highlights
├── script.js           # Live video & caption simulator, platform detect, Lemon Squeezy
├── admin.html          # Command & Control admin portal
├── admin.css           # Admin styling
├── admin.js            # Metrics & update broadcaster
├── .nojekyll           # Ensures static asset loading on GitHub Pages
└── assets/
    ├── lafzi-hero-logo.png  # Hero brand emblem
    ├── lafzi-logo.png       # Compact wordmark
    └── lafzi-icon.png       # App icon
```

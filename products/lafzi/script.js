/**
 * LAFZI — Modern Landing Page Interactivity
 * Features:
 * - Live Video & Caption Simulator with dynamic Word-by-Word karaoke animation
 * - 18 Language selector with Native & Roman transliteration scripts
 * - 8+ Viral Creator Style switcher (MrBeast, Hormozi, Abdaal, Crimson Punch, etc.)
 * - Auto OS Detection & Platform Download Modal (Apple Silicon, Intel Mac, Windows 64-bit)
 * - FAQ Accordion
 * - Interactive Language Cloud Pill selector
 */

// 18 Languages Dataset: Native Script + Roman Transliteration
const LANGUAGE_DATA = {
  urdu: {
    name: "Urdu",
    nativeName: "اردو",
    nativeWords: ["لفظوں", "کی", "طاقت", "سے", "اپنی", "ویڈیوز", "کو", "وائرل", "بنائیں"],
    romanWords: ["Lafzon", "ki", "taqat", "se", "apni", "videos", "ko", "viral", "banayein"]
  },
  hindi: {
    name: "Hindi",
    nativeName: "हिंदी",
    nativeWords: ["शब्दों", "की", "ताकत", "से", "अपने", "वीडियो", "को", "वायरल", "बनाएं"],
    romanWords: ["Shabdon", "ki", "taqat", "se", "apne", "video", "ko", "viral", "banayein"]
  },
  punjabi: {
    name: "Punjabi",
    nativeName: "ਪੰਜਾਬੀ",
    nativeWords: ["ਆਪਣੀ", "ਵੀਡੀਓ", "ਨੂੰ", "ਸਹੀ", "ਲਫ਼ਜ਼ਾਂ", "ਨਾਲ", "ਸੁਪਰਹਿੱਟ", "ਬਣਾਓ"],
    romanWords: ["Apni", "video", "nu", "sahi", "lafzan", "naal", "superhit", "banao"]
  },
  bengali: {
    name: "Bengali",
    nativeName: "বাংলা",
    nativeWords: ["সঠিক", "শব্দ", "দিয়ে", "আপনার", "ভিডিও", "ভাইরাল", "করুন"],
    romanWords: ["Sothik", "shobdo", "diye", "apnar", "video", "viral", "korun"]
  },
  tamil: {
    name: "Tamil",
    nativeName: "தமிழ்",
    nativeWords: ["சரியான", "வார்த்தைகளால்", "உங்கள்", "வீடியோவை", "வைரலாக்குங்கள்"],
    romanWords: ["Sariyana", "vaarthaigalaal", "ungal", "videovai", "viralaakkungal"]
  },
  telugu: {
    name: "Telugu",
    nativeName: "తెలుగు",
    nativeWords: ["సరైన", "పదాలతో", "మీ", "వీడియోను", "వైరల్", "చేయండి"],
    romanWords: ["Saraina", "padalatho", "mee", "videonu", "viral", "cheyandi"]
  },
  marathi: {
    name: "Marathi",
    nativeName: "मराठी",
    nativeWords: ["योग्य", "शब्दांनी", "आपले", "व्हिडिओ", "व्हायरल", "करा"],
    romanWords: ["Yogya", "shabdanni", "aaple", "video", "viral", "kara"]
  },
  gujarati: {
    name: "Gujarati",
    nativeName: "ગુજરાતી",
    nativeWords: ["સાચા", "શબ્દો", "સાથે", "તમારા", "વિડિયોને", "વાયરલ", "બનાવો"],
    romanWords: ["Saacha", "shabdo", "saathe", "tamara", "videone", "viral", "banavo"]
  },
  malayalam: {
    name: "Malayalam",
    nativeName: "മലയാളം",
    nativeWords: ["ശരിയായ", "വാക്കുകളിലൂടെ", "നിങ്ങളുടെ", "വീഡിയോ", "വൈറലാക്കുക"],
    romanWords: ["Sariyaya", "vaakkukaliloode", "ningalude", "video", "viralakkuka"]
  },
  kannada: {
    name: "Kannada",
    nativeName: "ಕನ್ನಡ",
    nativeWords: ["ನಿಖರವಾದ", "ಪದಗಳೊಂದಿಗೆ", "ನಿಮ್ಮ", "ವೀಡಿಯೊ", "ವೈರಲ್", "ಮಾಡಿ"],
    romanWords: ["Nikharavada", "padagalonthige", "nimma", "video", "viral", "maadi"]
  },
  pashto: {
    name: "Pashto",
    nativeName: "پښتو",
    nativeWords: ["د", "خپلو", "ویډیوګانو", "لپاره", "غوره", "او", "ښکلي", "کیپشنونه"],
    romanWords: ["Da", "khpalo", "videogaano", "lapara", "ghora", "au", "shkuli", "captionoona"]
  },
  sindhi: {
    name: "Sindhi",
    nativeName: "سنڌي",
    nativeWords: ["لفظن", "جي", "طاقت", "سان", "پنهنجي", "ويڊيو", "کي", "مشهور", "بنايو"],
    romanWords: ["Lafzan", "jee", "taqat", "saan", "panhinji", "video", "khe", "mashhoor", "banayo"]
  },
  saraiki: {
    name: "Saraiki",
    nativeName: "سرائیکی",
    nativeWords: ["اپݨی", "ویڈیو", "کوں", "مٹھی", "ٻولی", "نال", "وائرل", "بݨاؤ"],
    romanWords: ["Apni", "video", "koo", "mithi", "boli", "naal", "viral", "banao"]
  },
  balochi: {
    name: "Balochi",
    nativeName: "بلوچی",
    nativeWords: ["وتی", "ویڈیوانا", "گوں", "جوانیں", "لبزاں", "دیمروئی", "بدئے"],
    romanWords: ["Wati", "videyana", "gon", "jawaneen", "labzan", "deemroee", "badey"]
  },
  kashmiri: {
    name: "Kashmiri",
    nativeName: "کٲشُر",
    nativeWords: ["پنین", "ویڈیوز", "بنایو", "بہترین", "لفظن", "سیت", "وائرل"],
    romanWords: ["Panin", "videos", "banayiv", "behtareen", "lafzan", "seet", "viral"]
  },
  nepali: {
    name: "Nepali",
    nativeName: "नेपाली",
    nativeWords: ["सही", "शब्दहरूले", "तपाईंको", "भिडियो", "भाइरल", "बनाउनुहोस्"],
    romanWords: ["Sahi", "shabdaharu-le", "tapaiko", "video", "viral", "banaunuhos"]
  },
  sinhala: {
    name: "Sinhala",
    nativeName: "සිංහල",
    nativeWords: ["නිවැරදි", "වදන්", "සමඟ", "ඔබගේ", "වීඩියෝව", "වයිරල්", "කරන්න"],
    romanWords: ["Niweradi", "wadan", "samaga", "obage", "videowa", "viral", "karanna"]
  },
  english: {
    name: "English",
    nativeName: "English",
    nativeWords: ["Create", "Captivating", "Captions", "That", "Skyrocket", "Video", "Engagement"],
    romanWords: ["Create", "Captivating", "Captions", "That", "Skyrocket", "Video", "Engagement"]
  }
};

// Caption Style Presets for Live Simulator
const STYLE_PRESETS = {
  mrbeast: {
    name: "Beast Impact",
    font: "'Plus Jakarta Sans', sans-serif",
    textTransform: "uppercase",
    fontSize: "2.3rem",
    fontWeight: "900",
    color: "#ffffff",
    activeColor: "#ffe600",
    textShadow: "0 4px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000, 0 6px 12px rgba(0,0,0,0.8)",
    background: "transparent",
    borderRadius: "0",
    padding: "4px 8px"
  },
  hormozi: {
    name: "Hormozi Gold",
    font: "'Plus Jakarta Sans', sans-serif",
    textTransform: "uppercase",
    fontSize: "2.2rem",
    fontWeight: "900",
    color: "#ffffff",
    activeColor: "#00ff73",
    textShadow: "0 4px 0 #000, 0 8px 16px rgba(0,0,0,0.9)",
    background: "transparent",
    borderRadius: "0",
    padding: "4px 8px"
  },
  crimson: {
    name: "Lafzi Crimson",
    font: "'Syne', sans-serif",
    textTransform: "capitalize",
    fontSize: "2.2rem",
    fontWeight: "800",
    color: "#ffffff",
    activeColor: "#ef2b2d",
    textShadow: "0 0 24px rgba(239, 43, 45, 0.8), 0 2px 4px #000",
    background: "rgba(239, 43, 45, 0.12)",
    borderRadius: "8px",
    padding: "8px 16px"
  },
  cyber: {
    name: "Cyber Mint",
    font: "'JetBrains Mono', monospace",
    textTransform: "none",
    fontSize: "2.0rem",
    fontWeight: "700",
    color: "#94a3b8",
    activeColor: "#00ffb2",
    textShadow: "0 0 20px rgba(0, 255, 178, 0.7), 0 2px 4px #000",
    background: "rgba(0, 0, 0, 0.6)",
    borderRadius: "6px",
    padding: "8px 14px"
  },
  abdaal: {
    name: "Clean Minimal",
    font: "'DM Sans', sans-serif",
    textTransform: "none",
    fontSize: "2.1rem",
    fontWeight: "600",
    color: "#ffffff",
    activeColor: "#93c5fd",
    textShadow: "0 2px 8px rgba(0,0,0,0.7)",
    background: "transparent",
    borderRadius: "0",
    padding: "4px 6px"
  },
  boxhigh: {
    name: "Boxy Highlight",
    font: "'Plus Jakarta Sans', sans-serif",
    textTransform: "uppercase",
    fontSize: "2.1rem",
    fontWeight: "800",
    color: "#111116",
    activeColor: "#000000",
    textShadow: "none",
    background: "#ffcc00",
    borderRadius: "4px",
    padding: "6px 14px"
  }
};

// Global Interactive State
let currentLang = "urdu";
let currentScript = "roman"; // 'roman' or 'native'
let currentStyleKey = "mrbeast";
let activeWordIndex = 0;
let animationTimer = null;

// Initialize on DOM Loaded
document.addEventListener("DOMContentLoaded", () => {
  setupLanguageSelector();
  setupScriptToggle();
  setupStyleSelector();
  setupLanguageCloud();
  setupPlatformDetection();
  setupModalHandlers();
  setupFaqAccordion();
  setupCheckoutAndDiscounts();
  setupLocalCurrency();
  startWordAnimation();
});

// Setup Language Select Box
function setupLanguageSelector() {
  const select = document.getElementById("langSelect");
  if (!select) return;

  // Populate options
  select.innerHTML = "";
  Object.keys(LANGUAGE_DATA).forEach((key) => {
    const lang = LANGUAGE_DATA[key];
    const opt = document.createElement("option");
    opt.value = key;
    opt.textContent = `${lang.name} (${lang.nativeName})`;
    if (key === currentLang) opt.selected = true;
    select.appendChild(opt);
  });

  select.addEventListener("change", (e) => {
    currentLang = e.target.value;
    updateLanguageCloudSelection();
    activeWordIndex = 0;
    renderCaptionBox();
  });
}

// Setup Script Toggle (Native vs Roman)
function setupScriptToggle() {
  const romanBtn = document.getElementById("btnScriptRoman");
  const nativeBtn = document.getElementById("btnScriptNative");

  if (romanBtn) {
    romanBtn.addEventListener("click", () => {
      currentScript = "roman";
      romanBtn.classList.add("active");
      if (nativeBtn) nativeBtn.classList.remove("active");
      activeWordIndex = 0;
      renderCaptionBox();
    });
  }

  if (nativeBtn) {
    nativeBtn.addEventListener("click", () => {
      currentScript = "native";
      nativeBtn.classList.add("active");
      if (romanBtn) romanBtn.classList.remove("active");
      activeWordIndex = 0;
      renderCaptionBox();
    });
  }
}

// Setup Style Selector (Chips)
function setupStyleSelector() {
  const chips = document.querySelectorAll(".tpl-chip");
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      const styleId = chip.getAttribute("data-style");
      if (styleId && STYLE_PRESETS[styleId]) {
        currentStyleKey = styleId;
        applyStyleToRenderBox();
      }
    });
  });
}

// Setup Interactive 18 Languages Cloud
function setupLanguageCloud() {
  const cloud = document.getElementById("languagesCloud");
  if (!cloud) return;

  cloud.innerHTML = "";
  Object.keys(LANGUAGE_DATA).forEach((key) => {
    const lang = LANGUAGE_DATA[key];
    const pill = document.createElement("div");
    pill.className = `lang-cloud-pill ${key === currentLang ? "selected" : ""}`;
    pill.setAttribute("data-lang-key", key);

    pill.innerHTML = `
      <span>${lang.name}</span>
      <span class="native-script">${lang.nativeName}</span>
      <span class="roman-script">${lang.romanWords[0]}...</span>
    `;

    pill.addEventListener("click", () => {
      currentLang = key;
      const select = document.getElementById("langSelect");
      if (select) select.value = key;
      updateLanguageCloudSelection();
      activeWordIndex = 0;
      renderCaptionBox();

      // Smooth scroll to preview on desktop if needed
      const preview = document.getElementById("preview") || document.getElementById("captionPreviewWrap");
      if (preview && window.innerWidth > 768) {
        preview.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });

    cloud.appendChild(pill);
  });
}

function updateLanguageCloudSelection() {
  const pills = document.querySelectorAll(".lang-cloud-pill");
  pills.forEach((p) => {
    if (p.getAttribute("data-lang-key") === currentLang) {
      p.classList.add("selected");
    } else {
      p.classList.remove("selected");
    }
  });
}

// Render Caption Text with Word Spans
function renderCaptionBox() {
  const renderBox = document.getElementById("captionRenderBox");
  if (!renderBox) return;

  const langObj = LANGUAGE_DATA[currentLang] || LANGUAGE_DATA.urdu;
  const words = currentScript === "native" ? langObj.nativeWords : langObj.romanWords;

  // Text Direction for Urdu, Pashto, Sindhi, Balochi, Kashmiri in native script
  const isRtl = currentScript === "native" && ["urdu", "pashto", "sindhi", "saraiki", "balochi", "kashmiri"].includes(currentLang);
  renderBox.dir = isRtl ? "rtl" : "ltr";

  // Build HTML
  let html = `<div class="caption-rendered-text">`;
  words.forEach((word, idx) => {
    const isActive = idx === activeWordIndex;
    html += `<span class="word-span ${isActive ? "active" : ""}" data-word-idx="${idx}">${word}</span> `;
  });
  html += `</div>`;

  renderBox.innerHTML = html;
  applyStyleToRenderBox();
}

// Apply Style properties to Caption Box
function applyStyleToRenderBox() {
  const renderBox = document.getElementById("captionRenderBox");
  if (!renderBox) return;

  const style = STYLE_PRESETS[currentStyleKey] || STYLE_PRESETS.mrbeast;
  renderBox.style.fontFamily = style.font;
  renderBox.style.textTransform = style.textTransform;
  renderBox.style.fontSize = style.fontSize;
  renderBox.style.fontWeight = style.fontWeight;
  renderBox.style.background = style.background;
  renderBox.style.borderRadius = style.borderRadius;
  renderBox.style.padding = style.padding;

  const spans = renderBox.querySelectorAll(".word-span");
  spans.forEach((span, idx) => {
    if (idx === activeWordIndex) {
      span.style.color = style.activeColor;
      span.style.textShadow = style.textShadow;
      span.classList.add("active");
    } else {
      span.style.color = style.color;
      span.style.textShadow = style.textShadow;
      span.classList.remove("active");
    }
  });
}

// Continuous Word-by-Word Animation Loop
function startWordAnimation() {
  if (animationTimer) clearInterval(animationTimer);

  renderCaptionBox();

  animationTimer = setInterval(() => {
    const langObj = LANGUAGE_DATA[currentLang] || LANGUAGE_DATA.urdu;
    const words = currentScript === "native" ? langObj.nativeWords : langObj.romanWords;

    activeWordIndex = (activeWordIndex + 1) % words.length;

    const renderBox = document.getElementById("captionRenderBox");
    if (!renderBox) return;

    const style = STYLE_PRESETS[currentStyleKey] || STYLE_PRESETS.mrbeast;
    const spans = renderBox.querySelectorAll(".word-span");

    spans.forEach((span, idx) => {
      if (idx === activeWordIndex) {
        span.style.color = style.activeColor;
        span.classList.add("active");
      } else {
        span.style.color = style.color;
        span.classList.remove("active");
      }
    });
  }, 440); // 440ms cadence represents natural energetic speech rhythm
}

let currentDetectedPlatform = "macos-universal";

// Auto Detect Operating System
function setupPlatformDetection() {
  const ua = window.navigator.userAgent.toLowerCase();

  if (ua.includes("win")) {
    currentDetectedPlatform = "windows-x64";
  } else if (ua.includes("mac")) {
    currentDetectedPlatform = "macos-universal";
  }

  // Subtly highlight matching hero platform card
  if (currentDetectedPlatform === "windows-x64") {
    const winHero = document.getElementById("heroWindowsCard");
    if (winHero) winHero.style.borderColor = "var(--mint)";
  } else if (currentDetectedPlatform === "macos-universal") {
    const macHero = document.getElementById("heroMacSiliconCard");
    if (macHero) macHero.style.borderColor = "var(--mint)";
  }
}

const FREE_DOWNLOADS = {
  mac: "https://drive.usercontent.google.com/download?id=1Wg28zoajV6J4pEcfHVXpEwTBU7GLp8c_&export=download&confirm=t",
  mac_intel: "https://drive.usercontent.google.com/download?id=1Wg28zoajV6J4pEcfHVXpEwTBU7GLp8c_&export=download&confirm=t",
  windows: "https://drive.usercontent.google.com/download?id=1_rjVpBeG1ubkX2rRn4Kl-zVSckVTzBYZ&export=download&confirm=t",
};

function triggerDirectDownload(url, filename) {
  window.open(url, "_blank");
}

// Platform Download Modal Handlers
function setupModalHandlers() {
  const modal = document.getElementById("downloadModal");
  const modalClose = document.getElementById("modalClose");
  const triggers = document.querySelectorAll("[data-open-modal='downloadModal']");
  const modalTitle = document.getElementById("modalEditionTitle");
  const modalDesc = document.getElementById("modalEditionDesc");
  const macCard = document.getElementById("macDownloadCard");
  const macIntelCard = document.getElementById("macIntelDownloadCard");
  const winCard = document.getElementById("winDownloadCard");

  triggers.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const edition = btn.getAttribute("data-edition") || "free";

      if (macCard) macCard.href = FREE_DOWNLOADS.mac;
      if (macIntelCard) macIntelCard.href = FREE_DOWNLOADS.mac_intel;
      if (winCard) winCard.href = FREE_DOWNLOADS.windows;

      if (edition === "studio") {
        if (modalTitle) modalTitle.textContent = "Download Lafzi & Activate Studio";
        if (modalDesc) {
          modalDesc.innerHTML = `
            <strong>Step 1:</strong> Purchase your lifetime license key on <a href="${DEFAULT_GUMROAD_URL}" target="_blank" class="gumroad-button" style="color:var(--crimson-light);font-weight:700;text-decoration:underline;">Gumroad ($10 USD)</a>.<br>
            <strong>Step 2:</strong> Download the Lafzi installer below for your machine.<br>
            <strong>Step 3:</strong> In Lafzi, click <em>"⭐ Upgrade to Studio" → "Enter License Key"</em> to unlock all features!
          `;
        }
      } else {
        if (modalTitle) modalTitle.textContent = "Download Lafzi";
        if (modalDesc) {
          modalDesc.textContent =
            "100% offline, free forever, capped at 2 minutes per project. Select your workstation below to download from Google Drive.";
        }
      }

      if (modal) modal.classList.add("active");
    });
  });

  if (modalClose && modal) {
    modalClose.addEventListener("click", () => modal.classList.remove("active"));
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.remove("active");
    });
  }

  // Handle direct download clicks on cards
  const platformCards = document.querySelectorAll(".platform-card");
  platformCards.forEach((card) => {
    card.addEventListener("click", () => {
      const platformName = card.getAttribute("data-platform-name") || "Package";
      const dlType = (card.getAttribute("data-platform-download") || "").toLowerCase();
      const pLower = platformName.toLowerCase();
      let osKey = "macos_arm64";
      if (dlType.includes("intel") || pLower.includes("intel")) {
        osKey = "macos_x86_64";
      } else if (dlType.includes("win") || pLower.includes("win")) {
        osKey = "windows_x64";
      } else {
        osKey = "macos_arm64";
      }

      // Track platform download via Vercel Cloud Registry
      const registryHost = window.LAFZI_REGISTRY_URL || "https://lafzi-cloud-registry.vercel.app";
      fetch(`${registryHost}/api/downloads/track`, {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform: osKey }),
      }).catch(() => {});

      showToast(`✓ Starting download for ${platformName}...`);
    });
  });
}

// FAQ Accordion
function setupFaqAccordion() {
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    if (question) {
      question.addEventListener("click", () => {
        const isOpen = item.classList.contains("open");
        // Close others
        faqItems.forEach((other) => other.classList.remove("open"));
        if (!isOpen) {
          item.classList.add("open");
        }
      });
    }
  });
}

// Toast notification helper
function showToast(msg) {
  let toast = document.getElementById("lafziToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "lafziToast";
    toast.style.position = "fixed";
    toast.style.bottom = "28px";
    toast.style.right = "28px";
    toast.style.background = "#181822";
    toast.style.border = "1px solid var(--border-active)";
    toast.style.color = "#ffffff";
    toast.style.padding = "12px 20px";
    toast.style.borderRadius = "8px";
    toast.style.fontFamily = "var(--font-mono)";
    toast.style.fontSize = "0.82rem";
    toast.style.boxShadow = "0 10px 30px rgba(0,0,0,0.8), 0 0 20px rgba(239, 43, 45, 0.3)";
    toast.style.zIndex = "9999";
    toast.style.transition = "all 0.3s ease";
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    document.body.appendChild(toast);
  }

  toast.textContent = msg;
  toast.style.opacity = "1";
  toast.style.transform = "translateY(0)";

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
  }, 3000);
}

// -----------------------------------------------------------------------------
// Gumroad Checkout & Promo Code Integration
// -----------------------------------------------------------------------------
const DEFAULT_GUMROAD_URL = window.LAFZI_GUMROAD_URL || "https://maxxed45.gumroad.com/l/lafzi";
let activeDiscount = null;

function setupCheckoutAndDiscounts() {
  const applyBtn = document.getElementById("btnApplyPromo");
  const promoInput = document.getElementById("promoCodeInput");
  const feedback = document.getElementById("promoFeedbackMsg");
  const priceDisplay = document.getElementById("studioPriceAmount");
  const buyBtn = document.getElementById("btnBuyGumroad") || document.getElementById("btnBuyLemonSqueezy");

  function getActiveCheckoutUrl() {
    let url = DEFAULT_GUMROAD_URL;
    if (activeDiscount && activeDiscount.code) {
      const sep = url.includes("?") ? "&" : "?";
      url += `${sep}discount_code=${encodeURIComponent(activeDiscount.code)}`;
    }
    return url;
  }

  function syncBuyButton() {
    if (buyBtn) {
      buyBtn.href = getActiveCheckoutUrl();
    }
  }

  if (applyBtn && promoInput) {
    applyBtn.addEventListener("click", async () => {
      const code = promoInput.value.trim().toUpperCase();
      if (!code) {
        if (feedback) {
          feedback.style.display = "block";
          feedback.style.color = "#ff8b8e";
          feedback.textContent = "Please enter a promo code.";
        }
        return;
      }

      applyBtn.textContent = "...";
      try {
        const res = await fetch("/api/discounts/validate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, base_price: 10.0 }),
        });
        
        if (!res.ok) throw new Error("API unavailable");
        const data = await res.json();
        applyBtn.textContent = "Apply";

        if (data.valid) {
          activeDiscount = data;
          if (feedback) {
            feedback.style.display = "block";
            feedback.style.color = "var(--mint)";
            const sym = data.currency_symbol || "$";
            feedback.innerHTML = `✓ <strong>${data.code} applied!</strong> You save ${sym}${data.discount_amount} (${data.remaining_uses} uses remaining)`;
          }
          if (priceDisplay) {
            priceDisplay.innerHTML = `<span style="text-decoration: line-through; opacity: 0.45; font-size: 1.45rem; margin-right: 8px;">$10</span> $${Math.round(data.final_price)}`;
          }
          updateLocalEstimate(data.final_price);
        } else {
          activeDiscount = null;
          if (feedback) {
            feedback.style.display = "block";
            feedback.style.color = "#ff8b8e";
            feedback.textContent = `⚠️ ${data.error || "Invalid promo code"}`;
          }
          if (priceDisplay) {
            priceDisplay.textContent = "$10";
          }
          updateLocalEstimate(10);
        }
      } catch (err) {
        applyBtn.textContent = "Apply";
        // Static hosting fallback: pass discount code directly to Gumroad checkout URL
        activeDiscount = { code: code };
        if (feedback) {
          feedback.style.display = "block";
          feedback.style.color = "var(--mint)";
          feedback.innerHTML = `✓ Code <strong>${code}</strong> will be applied at Gumroad checkout!`;
        }
      }
      syncBuyButton();
    });

    promoInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        applyBtn.click();
      }
    });
  }

  // Gumroad Buy Handler (updates dynamic query params)
  if (buyBtn) {
    syncBuyButton();
    buyBtn.addEventListener("click", () => {
      const checkoutUrl = getActiveCheckoutUrl();
      buyBtn.href = checkoutUrl;
    });
  }
}

// -----------------------------------------------------------------------------
// Dynamic Local Currency Converter (Based on Viewer Location)
// -----------------------------------------------------------------------------
let cachedRate = null;
let cachedCurrency = "USD";
let cachedSymbol = "$";

function updateLocalEstimate(usdAmount) {
  const estimateEl = document.getElementById("localCurrencyEstimate");
  if (!estimateEl || !cachedRate || cachedCurrency === "USD") return;
  const localVal = Math.round(usdAmount * cachedRate);
  estimateEl.style.display = "block";
  estimateEl.innerHTML = `≈ ${cachedSymbol} ${localVal.toLocaleString()} ${cachedCurrency} <span style="font-size:0.75rem;opacity:0.75;font-weight:400;">(billed as $${usdAmount} on Gumroad)</span>`;
}

async function setupLocalCurrency() {
  const estimateEl = document.getElementById("localCurrencyEstimate");
  if (!estimateEl) return;

  const CURRENCY_SYMBOLS = {
    PKR: "Rs",
    INR: "₹",
    BDT: "৳",
    AED: "AED",
    SAR: "SAR",
    EUR: "€",
    GBP: "£",
    CAD: "CA$",
    AUD: "A$",
    TRY: "₺",
    USD: "$"
  };

  try {
    // 1. Detect visitor location & currency
    let userCurrency = "USD";
    try {
      const geoRes = await fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(3000) });
      if (geoRes.ok) {
        const geoData = await geoRes.json();
        if (geoData && geoData.currency) {
          userCurrency = geoData.currency.toUpperCase();
        }
      }
    } catch (e) {
      // Fallback detection from browser timezone
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      if (tz.includes("Karachi")) userCurrency = "PKR";
      else if (tz.includes("Kolkata") || tz.includes("Calcutta")) userCurrency = "INR";
      else if (tz.includes("Dhaka")) userCurrency = "BDT";
      else if (tz.includes("Dubai")) userCurrency = "AED";
      else if (tz.includes("Riyadh")) userCurrency = "SAR";
      else if (tz.includes("London")) userCurrency = "GBP";
    }

    if (userCurrency === "USD") {
      return;
    }

    cachedCurrency = userCurrency;
    cachedSymbol = CURRENCY_SYMBOLS[userCurrency] || userCurrency;

    // 2. Fetch live exchange rate from open exchange API
    let rate = null;
    try {
      const rateRes = await fetch("https://open.er-api.com/v6/latest/USD", { signal: AbortSignal.timeout(3000) });
      if (rateRes.ok) {
        const rateData = await rateRes.json();
        if (rateData && rateData.rates && rateData.rates[userCurrency]) {
          rate = rateData.rates[userCurrency];
        }
      }
    } catch (e) {
      // Fallback static benchmarks for common regions if offline / adblocked
      const fallbackRates = { PKR: 278, INR: 86.8, BDT: 118, AED: 3.67, SAR: 3.75, EUR: 0.92, GBP: 0.77, CAD: 1.38, AUD: 1.52 };
      rate = fallbackRates[userCurrency];
    }

    if (rate && rate > 0) {
      cachedRate = rate;
      updateLocalEstimate(10);
    }
  } catch (err) {
    console.debug("Local currency conversion skipped:", err);
  }
}



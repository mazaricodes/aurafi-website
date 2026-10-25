/**
 * LAFZI — Admin Portal Interactivity
 * Handles:
 * - Real-time metrics loading (Revenue, Installs, Downloads, Licenses)
 * - Software update publishing and remote manifest management
 * - License key generation, search, and revocation
 * - Discount code creation with cap limits and active toggling
 * - Gumroad order fulfillment and test simulator
 */

let currentData = null;

document.addEventListener("DOMContentLoaded", () => {
  setupTabs();
  setupForms();

  const gate = document.getElementById("adminAuthGate");
  if (gate) {
    const authed = sessionStorage.getItem("lafzi_admin_authed") === "true";
    if (authed) {
      gate.style.display = "none";
      loadAdminMetrics();
    } else {
      gate.style.display = "flex";
      const pinInput = document.getElementById("gatePinInput");
      if (pinInput) setTimeout(() => pinInput.focus(), 100);
    }
  } else {
    loadAdminMetrics();
  }
});

async function handleAuthSubmit(e) {
  e.preventDefault();
  const pinInput = document.getElementById("gatePinInput");
  const errElem = document.getElementById("gateError");
  const pin = (pinInput?.value || "").trim();

  if (!pin) {
    if (errElem) { errElem.textContent = "PIN cannot be empty."; errElem.style.display = "block"; }
    return;
  }

  const base = getRegistryBaseUrl();
  const url = `${base}/api/admin/metrics?admin_pin=${encodeURIComponent(pin)}`;

  try {
    const res = await fetch(url);
    if (res.ok) {
      localStorage.setItem("lafzi_admin_pin", pin);
      sessionStorage.setItem("lafzi_admin_authed", "true");
      const gate = document.getElementById("adminAuthGate");
      if (gate) gate.style.display = "none";
      loadAdminMetrics();
    } else {
      if (errElem) { errElem.textContent = "Invalid Admin PIN. Access denied."; errElem.style.display = "block"; }
    }
  } catch (err) {
    if (pin === getAdminPin()) {
      sessionStorage.setItem("lafzi_admin_authed", "true");
      const gate = document.getElementById("adminAuthGate");
      if (gate) gate.style.display = "none";
      loadAdminMetrics();
    } else {
      if (errElem) { errElem.textContent = "Authentication failed: " + err.message; errElem.style.display = "block"; }
    }
  }
}

// Setup Navigation Tabs
function setupTabs() {
  const tabs = document.querySelectorAll(".tab-btn");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      const target = tab.getAttribute("data-tab");
      document.querySelectorAll(".tab-content").forEach((c) => {
        c.classList.remove("active");
      });

      const activeContent = document.getElementById(target);
      if (activeContent) activeContent.classList.add("active");
    });
  });
}

function getAdminPin() {
  return localStorage.getItem("lafzi_admin_pin") || "lafzi2025";
}

function getRegistryBaseUrl() {
  const custom = localStorage.getItem("lafzi_cloud_registry_url");
  if (custom) return custom.replace(/\/$/, "");
  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    return window.location.port === "8000" ? "" : "http://localhost:3002";
  }
  return "https://lafzi-cloud-registry.vercel.app";
}

function configureCloudRegistry() {
  const currentUrl = localStorage.getItem("lafzi_cloud_registry_url") || "https://lafzi-cloud-registry.vercel.app";
  const newUrl = prompt("Enter your Vercel Cloud Registry URL:", currentUrl);
  if (newUrl !== null) {
    localStorage.setItem("lafzi_cloud_registry_url", newUrl.trim());
    const currentPin = getAdminPin();
    const newPin = prompt("Enter your Admin PIN (default: lafzi2025):", currentPin);
    if (newPin !== null) {
      localStorage.setItem("lafzi_admin_pin", newPin.trim());
    }
    showAdminToast(`✓ Cloud Registry configured: ${newUrl.trim()}`);
    loadAdminMetrics();
  }
}

// Load Metrics from Backend or Cloud Registry
async function loadAdminMetrics() {
  const base = getRegistryBaseUrl();
  const pin = getAdminPin();
  const url = base ? `${base}/api/admin/metrics?admin_pin=${encodeURIComponent(pin)}` : `/api/admin/metrics?admin_pin=${encodeURIComponent(pin)}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to load metrics from " + url);
    const data = await res.json();
    currentData = data;
    renderMetrics(data);
    renderRecentOrders(data.recent_orders || []);
    renderLicenseRegistry(data.recent_licenses || []);
    renderDiscountsTable(data.discounts || []);
    renderUpdateManifest(data.updates || {});
    renderAlertManifest(data.alert || {});
    renderDownloadsBreakdown(data.downloads || {});
  } catch (err) {
    console.warn("Cloud metrics load error:", err);
    if (base !== "") {
      try {
        const localRes = await fetch("/api/admin/metrics");
        if (localRes.ok) {
          const localData = await localRes.json();
          currentData = localData;
          renderMetrics(localData);
          renderRecentOrders(localData.recent_orders || []);
          renderLicenseRegistry(localData.recent_licenses || []);
          renderDiscountsTable(localData.discounts || []);
          renderUpdateManifest(localData.updates || {});
          renderAlertManifest(localData.alert || {});
          renderDownloadsBreakdown(localData.downloads || {});
          return;
        }
      } catch (localErr) {
        // ignore
      }
    }
    showAdminToast("⚠️ Tip: Click '☁️ Cloud Registry' above to connect your Vercel URL");
  }
}

// Render Top 4 KPI Cards
function renderMetrics(data) {
  const rev = data.revenue || {};
  const users = data.users || {};
  const dl = data.downloads || {};
  const lics = data.licenses || {};

  const symbol = rev.currency_symbol || "Rs";

  // Card 1: Revenue
  const revElem = document.getElementById("metricRevenue");
  if (revElem) revElem.textContent = `${symbol} ${Math.round(rev.total || 0).toLocaleString()}`;
  const revSub = document.getElementById("metricRevenueSub");
  if (revSub) revSub.textContent = `${rev.order_count || 0} completed orders (${symbol} ${rev.base_price || 10} base)`;

  // Card 2: Active Installs
  const userElem = document.getElementById("metricInstalls");
  if (userElem) userElem.textContent = (users.total_installs || 0).toLocaleString();
  const userSub = document.getElementById("metricInstallsSub");
  if (userSub) userSub.textContent = `${users.studio_installs || 0} Studio • ${users.base_installs || 0} Free`;

  // Card 3: Total Downloads
  const dlElem = document.getElementById("metricDownloads");
  if (dlElem) dlElem.textContent = (dl.total || 0).toLocaleString();
  const dlSub = document.getElementById("metricDownloadsSub");
  if (dlSub) dlSub.textContent = `${dl.macos_arm64 || 0} M-Silicon • ${dl.macos_x86_64 || 0} Intel • ${dl.windows_x64 || 0} Win`;

  // Card 4: Active License Keys
  const licElem = document.getElementById("metricLicenses");
  if (licElem) licElem.textContent = (lics.active_available || 0).toLocaleString();
  const licSub = document.getElementById("metricLicensesSub");
  if (licSub) licSub.textContent = `${lics.total_issued || 0} issued • ${lics.revoked || 0} revoked`;
}

// Render Downloads Platform Breakdown
function renderDownloadsBreakdown(dl) {
  const total = Math.max(1, dl.total || 0);
  const m1Pct = Math.round(((dl.macos_arm64 || 0) / total) * 100);
  const intelPct = Math.round(((dl.macos_x86_64 || 0) / total) * 100);
  const winPct = Math.round(((dl.windows_x64 || 0) / total) * 100);

  const container = document.getElementById("downloadsPlatformBar");
  if (container) {
    container.innerHTML = `
      <div style="display: flex; height: 10px; border-radius: 999px; overflow: hidden; background: rgba(255,255,255,0.06); margin-bottom: 12px;">
        <div style="width: ${m1Pct}%; background: #ef2b2d;" title="Apple Silicon: ${dl.macos_arm64 || 0}"></div>
        <div style="width: ${intelPct}%; background: #fbbf24;" title="Intel Mac: ${dl.macos_x86_64 || 0}"></div>
        <div style="width: ${winPct}%; background: #00ffb2;" title="Windows: ${dl.windows_x64 || 0}"></div>
      </div>
      <div style="display: flex; justify-content: space-between; font-size: 0.78rem; font-family: var(--font-mono); color: var(--text-muted);">
        <span><strong style="color: #ef2b2d;"> Apple Silicon:</strong> ${dl.macos_arm64 || 0} (${m1Pct}%)</span>
        <span><strong style="color: #fbbf24;"> Intel Mac:</strong> ${dl.macos_x86_64 || 0} (${intelPct}%)</span>
        <span><strong style="color: #00ffb2;">⊞ Windows:</strong> ${dl.windows_x64 || 0} (${winPct}%)</span>
      </div>
    `;
  }
}

// Render Recent Orders Table
function renderRecentOrders(orders) {
  const tbody = document.getElementById("ordersTableBody");
  if (!tbody) return;

  if (orders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-dim); padding: 24px;">No customer orders recorded yet. Use the Test Simulator tab to create one.</td></tr>`;
    return;
  }

  tbody.innerHTML = orders.map((o) => `
    <tr>
      <td><strong>${o.order_id}</strong></td>
      <td>${o.customer_name}<br><span style="font-size: 0.74rem; color: var(--text-dim);">${o.customer_email}</span></td>
      <td><strong>Rs ${Math.round(o.amount).toLocaleString()}</strong></td>
      <td>${o.discount_code ? `<span class="badge badge-warning">${o.discount_code}</span>` : "—"}</td>
      <td><code style="font-family: var(--font-mono); font-size: 0.78rem;">${o.license_key}</code></td>
      <td><span class="badge badge-active">Completed</span></td>
    </tr>
  `).join("");
}

// License Registry State & Filtering
let allLicensesCache = [];
let currentLicFilter = "all";
let currentLicSearch = "";

function renderLicenseRegistry(licenses) {
  allLicensesCache = Array.isArray(licenses) ? licenses : [];
  updateLicenseCounts();
  filterAndRenderLicenses();
}

function updateLicenseCounts() {
  const all = allLicensesCache.length;
  const active = allLicensesCache.filter((l) => l.status === "active" && l.hwid_bound).length;
  const unused = allLicensesCache.filter((l) => l.status === "unused").length;
  const revoked = allLicensesCache.filter((l) => l.status === "revoked").length;

  const setT = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };
  setT("licCountAll", all);
  setT("licCountActive", active);
  setT("licCountUnused", unused);
  setT("licCountRevoked", revoked);
}

function filterAndRenderLicenses() {
  const tbody = document.getElementById("licenseTableBody");
  if (!tbody) return;

  const query = currentLicSearch.trim().toLowerCase();
  const filtered = allLicensesCache.filter((l) => {
    // 1. Status Filter
    if (currentLicFilter === "active" && !(l.status === "active" && l.hwid_bound)) return false;
    if (currentLicFilter === "unused" && l.status !== "unused") return false;
    if (currentLicFilter === "revoked" && l.status !== "revoked") return false;

    // 2. Search query filter
    if (query) {
      const matchKey = (l.key || "").toLowerCase().includes(query);
      const matchEmail = (l.email || "").toLowerCase().includes(query);
      const matchHwid = (l.hwid_bound || "").toLowerCase().includes(query);
      const matchNote = (l.note || "").toLowerCase().includes(query);
      return matchKey || matchEmail || matchHwid || matchNote;
    }
    return true;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-dim); padding: 24px;">No matching license keys found.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map((l) => {
    const isRevoked = l.status === "revoked";
    const isActive = l.status === "active" && l.hwid_bound;
    const badgeClass = isRevoked ? "badge-revoked" : (isActive ? "badge-active" : "badge-warning");
    const label = isRevoked ? "Revoked" : (isActive ? "🟢 Active (Bound)" : "🟡 Unused");
    const dateStr = l.activated_at
      ? new Date(l.activated_at * 1000).toLocaleDateString()
      : (l.created_at ? new Date(l.created_at * 1000).toLocaleDateString() : "—");
    const platformStr = l.platform || (l.provider === "gumroad" ? "Gumroad" : "—");

    return `
      <tr>
        <td>
          <code style="font-family: var(--font-mono); font-size: 0.85rem; font-weight: 700; color: #fff;">${l.key}</code>
          <button class="btn btn-sm btn-secondary" style="margin-left: 6px; padding: 2px 6px;" onclick="copyText('${l.key}')" title="Copy Key">📋</button>
        </td>
        <td>${l.email ? `<strong style="color: #fff;">${l.email}</strong>` : '<span style="color: var(--text-dim);">Unassigned</span>'}</td>
        <td><span class="badge ${badgeClass}">${label}</span></td>
        <td><span style="font-family: var(--font-mono); font-size: 0.78rem; color: ${isActive ? 'var(--mint)' : 'var(--text-dim)'};">${l.hwid_bound || "—"}</span></td>
        <td><span style="font-size: 0.78rem; color: var(--text-muted);">${platformStr}</span></td>
        <td>${dateStr}</td>
        <td style="white-space: nowrap;">
          ${isActive ? `
            <button class="btn btn-sm btn-secondary" style="margin-right: 4px;" onclick="unbindKey('${l.key}')" title="Reset hardware binding so customer can activate on a new machine">🔄 Unbind</button>
            <button class="btn btn-sm btn-danger" onclick="revokeKey('${l.key}', true)">Revoke</button>
          ` : isRevoked ? `
            <button class="btn btn-sm btn-secondary" onclick="revokeKey('${l.key}', false)">Reinstate</button>
          ` : `
            <button class="btn btn-sm btn-danger" onclick="revokeKey('${l.key}', true)">Revoke</button>
          `}
        </td>
      </tr>
    `;
  }).join("");
}

async function unbindKey(key) {
  if (!confirm(`Release hardware binding for license key:\n${key}\n\nThis will allow the customer to activate Lafzi Studio on a new computer.`)) return;
  const base = getRegistryBaseUrl();
  const pin = getAdminPin();
  try {
    const res = await fetch(`${base}/api/license/unbind`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, admin_pin: pin }),
    });
    const data = await res.json();
    if (data.ok) {
      showAdminToast(`✓ Hardware binding released for ${key}`);
      loadAdminMetrics();
    } else {
      alert("Unbind failed: " + (data.error || "Unknown error"));
    }
  } catch (err) {
    alert("Error: " + err.message);
  }
}


// Render Discount Codes Table with Cap Limits
function renderDiscountsTable(discounts) {
  const tbody = document.getElementById("discountsTableBody");
  if (!tbody) return;

  if (discounts.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-dim); padding: 24px;">No discount codes created yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = discounts.map((d) => {
    const used = d.used_count || 0;
    const cap = d.cap || 100;
    const pct = Math.min(100, Math.round((used / cap) * 100));
    const isMaxed = used >= cap;
    const valText = d.type === "percent" ? `${d.value}% OFF` : `Rs ${d.value} Flat`;

    return `
      <tr>
        <td><strong style="color: #fff; font-family: var(--font-mono); font-size: 0.95rem;">${d.code}</strong></td>
        <td><span class="badge badge-warning">${valText}</span></td>
        <td>
          <div>${used} / ${cap} redemptions (${pct}%)</div>
          <div class="cap-track"><div class="cap-fill" style="width: ${pct}%;"></div></div>
        </td>
        <td>${isMaxed ? '<span style="color: var(--crimson-light); font-weight: 700;">Cap Reached</span>' : `${cap - used} remaining`}</td>
        <td>
          <span class="badge ${d.active && !isMaxed ? 'badge-active' : 'badge-revoked'}">
            ${d.active ? (isMaxed ? 'Full' : 'Active') : 'Paused'}
          </span>
        </td>
        <td>
          <button class="btn btn-sm btn-secondary" onclick="toggleDiscount('${d.code}')">
            ${d.active ? 'Pause' : 'Activate'}
          </button>
          <button class="btn btn-sm btn-danger" style="margin-left: 4px;" onclick="deleteDiscount('${d.code}')">
            ✕
          </button>
        </td>
      </tr>
    `;
  }).join("");
}

// Render Software Update Form
function renderUpdateManifest(upd) {
  const curVer = document.getElementById("currentPublishedVersion");
  if (curVer) curVer.textContent = `v${upd.latest_version || "1.0.0"}`;

  const notesPreview = document.getElementById("currentReleaseNotesPreview");
  if (notesPreview) notesPreview.textContent = upd.release_notes || "No release notes published.";

  const verInput = document.getElementById("updateVersionInput");
  if (verInput && !verInput.value) verInput.value = upd.latest_version || "1.0.0";

  const notesInput = document.getElementById("updateNotesInput");
  if (notesInput && !notesInput.value) notesInput.value = upd.release_notes || "";

  const dl = upd.downloads || {};
  if (document.getElementById("updateDlSilicon"))
    document.getElementById("updateDlSilicon").value =
      dl.macos_arm64 || "https://drive.google.com/file/d/1ko7UVnAsgrSxxZR4xD3nE-RStxfcQZHo/view?usp=sharing";
  if (document.getElementById("updateDlIntel"))
    document.getElementById("updateDlIntel").value =
      dl.macos_x86_64 || "https://drive.google.com/file/d/1gsIsR6cu6u_GQQGq4pMpPv4SpjBBFwAx/view?usp=sharing";
  if (document.getElementById("updateDlWindows"))
    document.getElementById("updateDlWindows").value =
      dl.windows_x64 || "https://drive.google.com/file/d/1Vy9Z0cHnD5kOr6hE5EkZSewV3oRRWuW5/view?usp=sharing";
}

// Render In-App Alert Broadcast Form & Badge
function renderAlertManifest(alert) {
  const badge = document.getElementById("alertActiveBadge");
  const isActive = Boolean(alert && alert.active && alert.title);
  if (badge) {
    if (isActive) {
      badge.className = "badge badge-active";
      badge.textContent = `🟢 Active (${alert.type ? alert.type.toUpperCase() : "INFO"})`;
    } else {
      badge.className = "badge";
      badge.textContent = "No Active Alert";
    }
  }

  const titleInput = document.getElementById("alertTitleInput");
  const msgInput = document.getElementById("alertMessageInput");
  const typeSelect = document.getElementById("alertTypeSelect");
  const labelInput = document.getElementById("alertActionLabel");
  const urlInput = document.getElementById("alertActionUrl");
  const checkActive = document.getElementById("alertActiveCheck");

  if (titleInput && !titleInput.value) titleInput.value = alert.title || "";
  if (msgInput && !msgInput.value) msgInput.value = alert.message || "";
  if (typeSelect && alert.type) typeSelect.value = alert.type;
  if (labelInput && !labelInput.value) labelInput.value = alert.action_label || "";
  if (urlInput && !urlInput.value) urlInput.value = alert.action_url || "";
  if (checkActive) checkActive.checked = isActive;
}

// Setup Form Submission Handlers
function setupForms() {
  // License Search & Filter Buttons
  const licSearch = document.getElementById("licenseSearchInput");
  if (licSearch) {
    licSearch.addEventListener("input", (e) => {
      currentLicSearch = e.target.value;
      filterAndRenderLicenses();
    });
  }

  const filterBtns = document.querySelectorAll(".filter-lic-btn");
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentLicFilter = btn.getAttribute("data-filter") || "all";
      filterAndRenderLicenses();
    });
  });

  // In-App Alert Broadcast Form
  const alertForm = document.getElementById("publishAlertForm");
  if (alertForm) {
    alertForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const title = document.getElementById("alertTitleInput").value.trim();
      const message = document.getElementById("alertMessageInput").value.trim();
      const type = document.getElementById("alertTypeSelect").value;
      const action_label = document.getElementById("alertActionLabel").value.trim();
      const action_url = document.getElementById("alertActionUrl").value.trim();
      const active = document.getElementById("alertActiveCheck").checked;

      try {
        const res = await fetch("/api/admin/alert/publish", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, message, type, action_label, action_url, active }),
        });
        const data = await res.json();
        if (data.ok) {
          showAdminToast(active ? "✓ In-App Alert broadcasted to all client apps!" : "✓ In-App Alert dismissed.");
          loadAdminMetrics();
        } else {
          alert("Failed to broadcast alert: " + (data.error || "Unknown error"));
        }
      } catch (err) {
        alert("Error publishing alert: " + err.message);
      }
    });
  }

  const btnClearAlert = document.getElementById("btnClearAlert");
  if (btnClearAlert) {
    btnClearAlert.addEventListener("click", async () => {
      if (!confirm("Dismiss active in-app alert from all consumer apps?")) return;
      try {
        await fetch("/api/admin/alert/publish", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: "", message: "", active: false }),
        });
        showAdminToast("✓ In-App Alert cleared.");
        loadAdminMetrics();
      } catch (err) {
        alert("Error: " + err.message);
      }
    });
  }

  // 1. Software Update Form
  const updateForm = document.getElementById("publishUpdateForm");
  if (updateForm) {
    updateForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const version = document.getElementById("updateVersionInput").value.trim();
      const notes = document.getElementById("updateNotesInput").value.trim();
      const mandatory = document.getElementById("updateMandatoryCheck").checked;
      const downloads = {
        macos_arm64: document.getElementById("updateDlSilicon").value.trim(),
        macos_x86_64: document.getElementById("updateDlIntel").value.trim(),
        windows_x64: document.getElementById("updateDlWindows").value.trim(),
      };

      try {
        const res = await fetch("/api/admin/updates/publish", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ version, release_notes: notes, mandatory, downloads }),
        });
        const data = await res.json();
        if (data.ok) {
          showAdminToast(`✓ Software update v${version} published successfully!`);
          loadAdminMetrics();
        } else {
          alert("Publish failed: " + (data.error || "Unknown error"));
        }
      } catch (err) {
        alert("Error publishing update: " + err.message);
      }
    });
  }

  // 2. Generate Batch Keys
  const genBtn = document.getElementById("btnGenerateKeys");
  if (genBtn) {
    genBtn.addEventListener("click", async () => {
      const count = parseInt(prompt("How many license keys would you like to generate?", "5"), 10);
      if (!count || count <= 0) return;
      const note = prompt("Optional label/note for these keys:", "Manual batch") || "";

      try {
        const res = await fetch("/api/admin/licenses/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ count, note }),
        });
        const keys = await res.json();
        showAdminToast(`✓ Generated ${keys.length} new Lafzi Studio license key(s)!`);
        loadAdminMetrics();
      } catch (err) {
        alert("Error generating keys: " + err.message);
      }
    });
  }

  // 3. Create Discount Code Modal Form
  const discForm = document.getElementById("createDiscountForm");
  if (discForm) {
    discForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const code = document.getElementById("discCodeInput").value.trim().toUpperCase();
      const type = document.getElementById("discTypeSelect").value;
      const value = parseFloat(document.getElementById("discValueInput").value);
      const cap = parseInt(document.getElementById("discCapInput").value, 10);
      const description = document.getElementById("discDescInput").value.trim();

      try {
        const res = await fetch("/api/admin/discounts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, type, value, cap, description }),
        });
        const data = await res.json();
        if (data.ok) {
          showAdminToast(`✓ Promo code ${code} created with cap of ${cap} redemptions!`);
          closeDiscountModal();
          loadAdminMetrics();
        } else {
          alert("Failed to create code: " + (data.error || "Unknown error"));
        }
      } catch (err) {
        alert("Error: " + err.message);
      }
    });
  }

  // 4. Test Purchase Simulator Form
  const simForm = document.getElementById("simulatePurchaseForm");
  if (simForm) {
    simForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("simNameInput").value.trim() || "Test Creator";
      const email = document.getElementById("simEmailInput").value.trim() || "creator@example.com";
      const amount = parseFloat(document.getElementById("simAmountInput").value) || 10;
      const code = document.getElementById("simDiscountInput").value.trim();

      try {
        const res = await fetch("/api/admin/test-purchase", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ customer_name: name, customer_email: email, amount, discount_code: code }),
        });
        const data = await res.json();
        if (data.ok) {
          showAdminToast(`✓ Simulated purchase successful! Key issued: ${data.license_key}`);
          loadAdminMetrics();
        }
      } catch (err) {
        alert("Simulation error: " + err.message);
      }
    });
  }
}

// Toggle Discount Code
async function toggleDiscount(code) {
  try {
    await fetch(`/api/admin/discounts/${encodeURIComponent(code)}/toggle`, { method: "POST" });
    loadAdminMetrics();
  } catch (err) {
    alert("Error toggling discount: " + err.message);
  }
}

// Delete Discount Code
async function deleteDiscount(code) {
  if (!confirm(`Delete promo code "${code}"?`)) return;
  try {
    await fetch(`/api/admin/discounts/${encodeURIComponent(code)}`, { method: "DELETE" });
    loadAdminMetrics();
  } catch (err) {
    alert("Error deleting discount: " + err.message);
  }
}

// Revoke or Reinstate License Key
async function revokeKey(key, revoke) {
  if (revoke && !confirm(`Revoke license key ${key}? This will immediately lock the user's Studio export.`)) return;
  const base = getRegistryBaseUrl();
  const pin = getAdminPin();
  try {
    const res = await fetch(`${base}/api/license/revoke`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, admin_pin: pin, reason: revoke ? "Revoked via Admin Portal" : "" }),
    });
    const data = await res.json();
    if (data.ok) {
      showAdminToast(`✓ License ${key} updated.`);
      loadAdminMetrics();
    } else {
      alert("Revoke failed: " + (data.error || "Unknown error"));
    }
  } catch (err) {
    alert("Error: " + err.message);
  }
}

// Helper: Open / Close Discount Modal
function openDiscountModal() {
  const m = document.getElementById("discountModal");
  if (m) m.classList.add("active");
}

function closeDiscountModal() {
  const m = document.getElementById("discountModal");
  if (m) m.classList.remove("active");
}

// Toast helper
function showAdminToast(msg) {
  let toast = document.getElementById("adminToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "adminToast";
    toast.style.position = "fixed";
    toast.style.bottom = "24px";
    toast.style.right = "24px";
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

function copyText(txt) {
  navigator.clipboard?.writeText(txt);
  showAdminToast(`Copied to clipboard: ${txt}`);
}

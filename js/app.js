/* ===== ASOSIY ILOVA ===== */
const $ = id => document.getElementById(id), C = CONFIG, RU = C.ru, UI = C.ui;
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const TEL = "tel:" + C.phone.replace(/\s/g, ""), TG = "https://t.me/" + C.telegram, WA = "https://wa.me/" + C.whatsapp;
const IG = "https://instagram.com/" + C.instagram, IG2 = "https://instagram.com/" + C.instagram2;
const LANGS = ["uz", "uz-cyrl", "ru"];
let LANG = "uz";
try { const s = localStorage.getItem("tx-lang"); if (LANGS.includes(s)) LANG = s; } catch (_) {}

/* ---- Lotin → kirill (o‘zbekcha) ---- */
const APOS = "‘’'ʻ`";
const isApos = ch => !!ch && APOS.indexOf(ch) > -1;
const CYR = { a: "а", b: "б", d: "д", e: "е", f: "ф", g: "г", h: "ҳ", i: "и", j: "ж", k: "к", l: "л", m: "м", n: "н", o: "о", p: "п", q: "қ", r: "р", s: "с", t: "т", u: "у", v: "в", w: "в", x: "х", y: "й", z: "з", c: "ц" };
const KEEP = ["Telegram", "WhatsApp", "Instagram", "FSH", "LH", "BPH"];
function cyrLower(s) {
  let r = "";
  for (let i = 0; i < s.length;) {
    const c = s[i], n = s[i + 1], n2 = s[i + 2];
    if (isApos(c)) { r += "ъ"; i++; continue; }
    if ((c === "o" || c === "g") && isApos(n)) { r += c === "o" ? "ў" : "ғ"; i += 2; continue; }
    if (c === "s" && n === "h") { r += "ш"; i += 2; continue; }
    if (c === "c" && n === "h") { r += "ч"; i += 2; continue; }
    if (c === "n" && n === "g" && !isApos(n2)) { r += "нг"; i += 2; continue; }
    if (c === "y" && n === "o" && !isApos(n2)) { r += "ё"; i += 2; continue; }
    if (c === "y" && (n === "u" || n === "a" || n === "e")) { r += { u: "ю", a: "я", e: "е" }[n]; i += 2; continue; }
    if (c === "e" && i === 0) { r += "э"; i++; continue; }
    r += CYR[c] || c; i++;
  }
  return r;
}
function cyrWord(w) {
  if (KEEP.indexOf(w) > -1) return w;
  let r = cyrLower(w.toLowerCase());
  if (w.length > 1 && w === w.toUpperCase()) return r.toUpperCase();
  if (w[0] !== w[0].toLowerCase()) r = r.charAt(0).toUpperCase() + r.slice(1);
  return r;
}
const cyr = s => String(s).replace(/[A-Za-z‘’'ʻ`]+/g, cyrWord);

/* ---- Tarjima yordamchilari ---- */
const ui = k => { const v = LANG === "ru" ? (UI.ru[k] ?? UI.uz[k]) : UI.uz[k]; return LANG === "uz-cyrl" ? cyr(v ?? "") : (v ?? ""); };
const L = s => (LANG === "uz-cyrl" ? cyr(s ?? "") : String(s ?? ""));
const P = (uz, ru) => (LANG === "ru" && ru != null ? ru : L(uz));
const brand = () => P(C.brand, RU.brand);
const addr = () => P(C.address, RU.address);
const svc = i => {
  const s = C.services[i], r = RU.services[i] || {};
  return {
    t: P(s.t, r.t), d: P(s.d, r.d), intro: P(s.intro, r.intro), who: P(s.who, r.who),
    items: LANG === "ru" && r.items ? r.items : s.items.map(x => L(x)),
    prices: LANG === "ru" && r.prices ? r.prices : s.prices.map(x => [L(x[0]), L(x[1])])
  };
};
const dr = i => {
  const d = C.doctors[i], r = RU.doctors[i] || {};
  return {
    n: P(d.n, r.n), r: P(d.r, r.r), b: P(d.b, r.b),
    stats: LANG === "ru" && r.stats ? r.stats : (d.stats || []).map(x => [L(x[0]), L(x[1])])
  };
};
const mNames = () => (LANG === "ru" ? CONFIG.months.ru : CONFIG.months.uz.map(x => L(x)));
const wNames = () => (LANG === "ru" ? CONFIG.wdays.ru : CONFIG.wdays.uz.map(x => L(x)));

/* ---- IKONKALAR ---- */
const IC = {search:'<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',tooth:'<path d="M7 3.5c-2.2 0-3.5 1.7-3.5 4 0 2.2.9 3.4 1.6 5.2.8 2 .9 3.7 1.4 6 .3 1.4 1.1 2.3 2 2.3 1.1 0 1.4-1.5 1.7-3 .2-1 .6-1.7 1.3-1.7s1.1.7 1.3 1.7c.3 1.5.6 3 1.7 3 .9 0 1.7-.9 2-2.3.5-2.3.6-4 1.4-6 .7-1.8 1.6-3 1.6-5.2 0-2.3-1.3-4-3.5-4-1.6 0-2.5.9-4 .9S8.6 3.5 7 3.5z"/>',implant:'<path d="M5 4h14c0 3-2.2 5-4.5 5h-5C7.2 9 5 7 5 4z"/><path d="M9 12h6M9.5 15h5M10 18h4M12 9v12"/>',crown:'<path d="M4 18h16M5 18l-1-10 5 4 3-6 3 6 5-4-1 10"/>',drop:'<path d="M12 3c3.5 4.5 6 7.5 6 11a6 6 0 0 1-12 0c0-3.5 2.5-6.5 6-11z"/><path d="M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5"/>',syringe:'<path d="M18 3l3 3M16 5l3 3M14 7l3 3-7.5 7.5-4-1-1-4zM5.5 18.5L3 21M10 13l2 2"/>',spark:'<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 16l.7 2 2 .7-2 .7L19 21.4l-.7-2-2-.7 2-.7z"/>',plus:'<circle cx="12" cy="12" r="8.5"/><path d="M12 8v8M8 12h8"/>'};
const svcIco = k => `<span class="svc-ico"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[k] || IC.plus}</svg></span>`;

/* ---- MENYU, SARLAVHALAR, MA’LUMOTLAR ---- */
const menuItems = () => C.menu.map((m, i) => [P(m[0], RU.menu[i]), m[1]]).filter(m => m[1] !== "#price");
const menuHtml = () => menuItems().map(m => `<a href="${m[1]}">${esc(m[0])}</a>`).join("");

function applyStatic() {
  document.documentElement.lang = LANG === "ru" ? "ru" : LANG === "uz-cyrl" ? "uz-Cyrl" : "uz";
  document.title = brand();
  document.querySelectorAll("[data-i18n]").forEach(el => { el.textContent = ui(el.dataset.i18n); });
  document.querySelectorAll("[data-i18n-aria]").forEach(el => el.setAttribute("aria-label", ui(el.dataset.i18nAria)));
  document.querySelectorAll("[data-i18n-title]").forEach(el => el.setAttribute("title", ui(el.dataset.i18nTitle)));
  document.querySelectorAll("#lang [data-lang]").forEach(b => b.classList.toggle("on", b.dataset.lang === LANG));
}

function renderBrand() {
  const b = brand();
  $("brand").innerHTML = C.logo ? `<img src="${C.logo}" alt="${esc(b)}">` : esc(b);
  $("brand2").textContent = b.toUpperCase();
  $("heroTitle").textContent = P(C.heroTitle, RU.heroTitle);
  $("heroText").textContent = P(C.heroText, RU.heroText);
}

function renderMenu() {
  $("menu").innerHTML = menuHtml();
  $("sfNav").innerHTML = menuHtml();
}

function renderServices() {
  $("serviceGrid").innerHTML = C.services.map((s, i) => {
    const v = svc(i);
    return `<article class="card svc" data-service="${i}" tabindex="0" role="button" aria-label="${esc(v.t)}: ${esc(ui("more"))}">${svcIco(s.ic)}<h3>${esc(v.t)}</h3><p class="muted">${esc(v.d)}</p><ul>${v.items.slice(0, 3).map(x => `<li>${esc(x)}</li>`).join("")}</ul><span class="svc-more">${esc(ui("more"))} <i aria-hidden="true">→</i></span></article>`;
  }).join("");
}

function renderDoctors() {
  $("docs").innerHTML = C.doctors.map((d, i) => {
    const v = dr(i);
    const fig = d.img ? `<img src="${esc(d.img)}" alt="${esc(v.n)}" width="480" height="600">` : `<div class="doc-ph">${esc(ui("docPh"))}</div>`;
    const stats = v.stats.length ? `<div class="doc-stats">${v.stats.map(s => `<div class="doc-stat"><b>${esc(s[0])}</b><span>${esc(s[1])}</span></div>`).join("")}</div>` : "";
    const btn = d.book === false ? "" : `<button class="btn" type="button" data-book="${i}">${esc(ui("book"))}</button>`;
    return `<div class="doc-block"><figure class="doc-fig">${fig}</figure><div class="doc-side"><div class="tag">${esc(v.r)}</div><h3>${esc(v.n)}</h3><p class="muted">${esc(v.b)}</p>${stats}${btn}</div></div>`;
  }).join("");
  $("docs").querySelectorAll(".doc-fig img").forEach(img => img.addEventListener("error", () => {
    const ph = document.createElement("div");
    ph.className = "doc-ph";
    ph.textContent = ui("docPh");
    img.replaceWith(ph);
  }));
}

function renderContact() {
  const I = p => `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
  const ic = {
    ph: I('<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>'),
    tg: I('<path d="M21 4L3 11l6 2.5L11.5 20l3-4.5L19 19z"/><path d="M9 13.5L21 4"/>'),
    pin: I('<path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>'),
    wa: I('<path d="M4 20l1.2-4A8 8 0 1 1 8 18.8z"/>'),
    ig: I('<rect x="4" y="4" width="16" height="16" rx="4.5"/><circle cx="12" cy="12" r="3.5"/><circle cx="17" cy="7" r=".6"/>')
  };
  const row = (icon, label, value, href) => `<li><span class="cico">${icon}</span><div><small>${esc(label)}</small>${href ? `<a href="${href}" target="_blank" rel="noopener">${esc(value)}</a>` : `<b>${esc(value)}</b>`}</div></li>`;
  $("clist").innerHTML =
    row(ic.ph, ui("cPhone"), C.phone, TEL) +
    row(ic.tg, "Telegram", "@" + C.telegram, TG) +
    row(ic.wa, "WhatsApp", C.phone, WA) +
    row(ic.ig, "Instagram", "@" + C.instagram, IG) +
    row(ic.ig, ui("cClinic"), "@" + C.instagram2, IG2) +
    row(ic.pin, ui("cAddr"), addr(), "");
  $("cbtns").innerHTML = `<a class="btn" href="${TG}" target="_blank" rel="noopener">Telegram</a><a class="btn ghost" href="${WA}" target="_blank" rel="noopener">WhatsApp</a>`;
  $("sfContact").innerHTML = `<a href="${TEL}">${esc(C.phone)}</a><span>${esc(addr())}</span>`;
  $("sfSocial").innerHTML = `<a href="${IG}" target="_blank" rel="noopener">Instagram</a><a href="${IG2}" target="_blank" rel="noopener">${esc(ui("cClinic"))}</a><a href="${TG}" target="_blank" rel="noopener">Telegram</a><a href="${WA}" target="_blank" rel="noopener">WhatsApp</a>`;
  $("sfCopy").textContent = "© " + new Date().getFullYear() + " " + brand() + ". " + ui("rights");
}

/* ===== MAXSUS MENYU (dropdown) ===== */
/* Har bir menyu: hidden input (tanlangan indeks), tugma, ro‘yxat. Ro‘yxat DD ichida aniqlanadi. */
let cur = 0, svcOpen = false;
const DD = {
  "dd-svc": { items: () => C.services.map((s, i) => ({ l: svc(i).t })), ph: () => ui("pickService") },
  "dd-doc": { items: () => C.doctors.map((d, i) => ({ l: dr(i).n })), ph: () => ui("noPref") },
  "dd-price": { items: () => svc(cur).prices.map(r => ({ l: r[0], p: r[1] })), ph: () => ui("pickPrice"), onPick: j => markPrice(j) }
};

function ddRender(id) {
  const root = $(id), def = DD[id];
  if (!root || !def) return;
  const items = def.items(), hid = root.querySelector("input"), idx = hid.value === "" ? -1 : +hid.value;
  const sel = items[idx];
  root.querySelector(".dd-val").textContent = sel ? (sel.p ? `${sel.l} — ${sel.p}` : sel.l) : def.ph();
  root.querySelector(".dd-btn").classList.toggle("has", !!sel);
  root.querySelector(".dd-list").innerHTML = items.map((it, i) =>
    `<li role="option" tabindex="0" data-i="${i}" aria-selected="${i === idx}"><span>${esc(it.l)}</span>${it.p ? `<b>${esc(it.p)}</b>` : ""}</li>`
  ).join("");
}
const renderDropdowns = () => Object.keys(DD).forEach(ddRender);

function pickDd(id, i) {
  $(id).querySelector("input").value = String(i);
  ddRender(id);
  closeAll();
  if (DD[id].onPick) DD[id].onPick(i);
}

function closeAll(except) {
  document.querySelectorAll(".dd.open, .dp.open").forEach(r => {
    if (r === except) return;
    r.classList.remove("open");
    r.querySelector(".dd-list, .dp-pop").hidden = true;
    r.querySelector(".dd-btn").setAttribute("aria-expanded", "false");
  });
}
function openRoot(root) {
  closeAll(root);
  root.classList.add("open");
  root.querySelector(".dd-list, .dp-pop").hidden = false;
  root.querySelector(".dd-btn").setAttribute("aria-expanded", "true");
}

/* ===== MAXSUS KALENDAR (sana) ===== */
const DP = { y: 0, m: 0 };
const fmtDate = v => { const [y, m, d] = v.split("-"); return `${d}.${m}.${y}`; };
const iso = (y, m, d) => `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

function dpSync() {
  const v = $("dt2").value;
  $("dp").querySelector(".dd-val").textContent = v ? fmtDate(v) : ui("pickDate");
  $("dpBtn").classList.toggle("has", !!v);
}
function dpOpen() {
  const v = $("dt2").value;
  const base = v ? new Date(v + "T00:00:00") : new Date();
  DP.y = base.getFullYear();
  DP.m = base.getMonth();
  dpDraw();
}
function dpDraw() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const { y, m } = DP;
  const startOff = (new Date(y, m, 1).getDay() + 6) % 7;
  const days = new Date(y, m + 1, 0).getDate();
  const sel = $("dt2").value;
  let h = `<div class="dp-head"><button type="button" class="dp-nav" data-dp="-1" aria-label="${esc(ui("prevMonth"))}">‹</button><b>${esc(mNames()[m])} ${y}</b><button type="button" class="dp-nav" data-dp="1" aria-label="${esc(ui("nextMonth"))}">›</button></div>`;
  h += `<div class="dp-wd">${wNames().map(w => `<span>${esc(w)}</span>`).join("")}</div><div class="dp-grid">`;
  for (let i = 0; i < startOff; i++) h += "<span></span>";
  for (let d = 1; d <= days; d++) {
    const dt = new Date(y, m, d), v = iso(y, m, d);
    const cls = ["dp-day", v === sel ? "sel" : "", dt.getTime() === today.getTime() ? "today" : ""].filter(Boolean).join(" ");
    h += `<button type="button" class="${cls}" data-v="${v}"${dt < today ? " disabled" : ""}>${d}</button>`;
  }
  $("dpPop").innerHTML = h + "</div>";
}

/* ===== XIZMAT PANELI (ochiladigan oyna) ===== */
const hashOf = i => "#xizmat-" + C.services[i].k;

function markPrice(j) {
  document.querySelectorAll("#rbody [data-price]").forEach(x => x.classList.toggle("sel", +x.dataset.price === j));
}

function showSvc(i, push, keep) {
  const v = svc(i);
  let saved = null;
  if (keep && $("svcForm")) saved = {
    n: $("svcN").value, p: $("svcP").value,
    pick: $("dd-price").querySelector("input").value, ok: $("svcOk").style.display
  };
  svcOpen = true;
  cur = i;
  $("readerClose").textContent = ui("backBtn");
  $("rt").textContent = v.t;
  const im = $("rimg");
  im.onerror = () => { im.hidden = true };
  im.src = "images/" + (i + 1) + ".png";
  im.alt = v.t;
  im.classList.add("sq");
  im.hidden = false;
  const tel = TEL, addrQ = encodeURIComponent(C.address);
  $("rbody").innerHTML = `<p class="lead">${esc(v.intro)}</p>
<div class="note"><b>${esc(ui("forWho"))}</b> ${esc(v.who)}</div>
<h3>${esc(ui("pricesH"))}</h3>
<p class="muted pick-hint">${esc(ui("pickHint"))}</p>
<ul class="plist">${v.prices.map((r, j) => `<li role="button" tabindex="0" data-price="${j}"><span class="pn">${esc(r[0])}</span><span class="pp">${esc(r[1])}</span></li>`).join("")}</ul>
<h3>${esc(ui("writeH"))}</h3>
<form id="svcForm" class="svc-form">
<label for="svcN">${esc(ui("sName"))}</label><input id="svcN" required>
<label for="svcP">${esc(ui("sPhone"))}</label><input id="svcP" type="tel" required placeholder="+998">
<label id="lSvc">${esc(ui("sService"))}</label>
<div class="dd" id="dd-price"><input type="hidden" value=""><button type="button" class="dd-btn" aria-haspopup="listbox" aria-expanded="false" aria-labelledby="lSvc"><span class="dd-val"></span></button><ul class="dd-list" role="listbox" hidden></ul></div>
<div class="svc-submit"><button class="btn" type="submit">${esc(ui("sSubmit"))}</button></div>
<div class="ok" id="svcOk">${esc(ui("mOk"))}</div>
</form>
<div class="svc-addr"><div class="svc-addr-in svc-addr-top"><h3>${esc(ui("addrH"))}</h3></div>
<iframe class="svc-map" title="${esc(ui("addrH"))}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=${addrQ}&amp;output=embed"></iframe>
<div class="svc-addr-in"><p class="svc-a">${esc(addr())}</p><p class="svc-ph"><a href="${tel}">${esc(C.phone)}</a></p>
<div class="svc-links"><a class="btn" href="${tel}">${esc(ui("call"))}</a><a class="btn ghost" href="${TG}" target="_blank" rel="noopener">Telegram</a></div></div></div>`;
  if (saved) {
    $("svcN").value = saved.n;
    $("svcP").value = saved.p;
    $("svcOk").style.display = saved.ok;
  }
  $("dd-price").querySelector("input").value = saved ? saved.pick : "";
  ddRender("dd-price");
  markPrice(saved && saved.pick !== "" ? +saved.pick : -1);
  $("reader").hidden = false;
  document.body.style.overflow = "hidden";
  if (!keep) $("reader").scrollTop = 0;
  if (push && location.hash !== hashOf(i)) history.pushState(null, "", hashOf(i));
}

function hideSvc(fromHash) {
  if (!svcOpen) return;
  svcOpen = false;
  $("reader").hidden = true;
  document.body.style.overflow = "";
  if (!fromHash && location.hash.indexOf("#xizmat-") === 0) history.back();
}
function fromHash() {
  const m = location.hash.match(/^#xizmat-(.+)$/);
  if (m) {
    const i = C.services.findIndex(x => x.k === m[1]);
    if (i > -1) { showSvc(i, false); return; }
  }
  hideSvc(true);
}

function choosePrice(j) {
  pickDd("dd-price", j);
  $("svcOk").style.display = "none";
  $("svcForm").scrollIntoView({ behavior: "smooth", block: "center" });
  setTimeout(() => $("svcN").focus({ preventScroll: true }), 450);
}

/* ===== MODAL ===== */
function openModal(docIdx) {
  $("d").value = docIdx === undefined || docIdx === "" ? "" : String(docIdx);
  ddRender("dd-doc");
  $("ok").style.display = "none";
  $("modal").classList.add("open");
  $("n").focus();
}
function closeModal() { $("modal").classList.remove("open"); }

/* ===== YUBORISH ===== */
function send(name, phone, doc, svcText, raw) {
  const text = `Yangi so‘rov\nIsm: ${name}\nTelefon: ${phone}${doc ? "\nShifokor: " + doc : ""}${svcText ? (raw ? "\n" : "\nXizmat: ") + svcText : ""}`;
  window.open(`https://t.me/${C.telegram}?text=${encodeURIComponent(text)}`, "_blank");
}

/* ===== HAMMA NARSANI QAYTA CHIZISH (til o‘zgarganda) ===== */
function renderAll() {
  applyStatic();
  renderBrand();
  renderMenu();
  renderServices();
  renderDoctors();
  renderContact();
  renderDropdowns();
  dpSync();
  if ($("dp").classList.contains("open")) dpDraw();
  if (svcOpen) showSvc(cur, false, true);
}

/* ===== HODISALAR ===== */
$("lang").addEventListener("click", e => {
  const b = e.target.closest("[data-lang]");
  if (!b) return;
  LANG = b.dataset.lang;
  try { localStorage.setItem("tx-lang", LANG); } catch (_) {}
  renderAll();
});

document.addEventListener("click", e => {
  const t = e.target;

  const ddBtn = t.closest(".dd-btn");
  if (ddBtn) {
    const root = ddBtn.closest(".dd, .dp");
    if (root.classList.contains("open")) closeAll();
    else { openRoot(root); if (root.id === "dp") dpOpen(); }
    return;
  }
  const li = t.closest(".dd-list li[data-i]");
  if (li) { pickDd(li.closest(".dd").id, +li.dataset.i); return; }
  const day = t.closest(".dp-day");
  if (day && !day.disabled) { $("dt2").value = day.dataset.v; dpSync(); closeAll(); return; }
  const nav = t.closest(".dp-nav");
  if (nav) {
    const d0 = new Date(DP.y, DP.m + (+nav.dataset.dp), 1);
    DP.y = d0.getFullYear(); DP.m = d0.getMonth();
    dpDraw();
    return;
  }
  if (!t.closest(".dd, .dp")) closeAll();

  const card = t.closest("[data-service]");
  if (card) { showSvc(+card.dataset.service, true); return; }
  const price = t.closest("#rbody [data-price]");
  if (price) { choosePrice(+price.dataset.price); return; }
  const book = t.closest("[data-book]");
  if (book) { openModal(book.dataset.book); return; }
  if (t.closest("#readerClose")) { hideSvc(false); return; }
  if (t.closest("#close") || t === $("modal")) closeModal();
});

document.addEventListener("keydown", e => {
  const k = e.key, tg = e.target;
  if (k === "Escape") {
    if (document.querySelector(".dd.open, .dp.open")) { closeAll(); return; }
    if ($("modal").classList.contains("open")) { closeModal(); return; }
    if (svcOpen) hideSvc(false);
    return;
  }
  if (k !== "Enter" && k !== " ") return;
  if (!tg.matches) return;
  if (tg.matches(".dd-list li, [data-service], #rbody [data-price]")) {
    e.preventDefault();
    if (tg.matches("[data-service]")) showSvc(+tg.dataset.service, true);
    else tg.click();
  }
});

document.addEventListener("submit", e => {
  e.preventDefault();
  if (e.target.id === "contactForm") {
    $("ok2").style.display = "block";
    const x = [];
    const si = $("s2").value;
    if (si !== "") x.push("Xizmat: " + C.services[+si].t);
    if ($("dt2").value) x.push("Sana: " + $("dt2").value);
    if ($("m2").value.trim()) x.push("Xabar: " + $("m2").value.trim());
    send($("n2").value, $("p2").value, "", x.join("\n"), true);
  } else if (e.target.id === "bookForm") {
    $("ok").style.display = "block";
    const di = $("d").value;
    send($("n").value, $("p").value, di === "" ? "" : C.doctors[+di].n);
  } else if (e.target.id === "svcForm") {
    const pk = $("dd-price").querySelector("input").value;
    if (pk === "") {
      openRoot($("dd-price"));
      $("dd-price").querySelector(".dd-btn").focus();
      return;
    }
    const sv = C.services[cur], r = sv.prices[+pk];
    $("svcOk").style.display = "block";
    send($("svcN").value, $("svcP").value, "", sv.t + ": " + r[0] + " — " + r[1]);
  }
});

/* ===== ISHGA TUSHIRISH ===== */
$("docs").className = "doc-feature";
renderAll();
addEventListener("hashchange", fromHash);
fromHash();

/* ===== NAVBAR SOYASI ===== */
const navEl = document.querySelector("header.nav");
const onScroll = () => navEl.classList.toggle("scrolled", scrollY > 10);
addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ===== SKROLL ANIMATSIYA ===== */
(function () {
  const io = "IntersectionObserver" in window ? new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { threshold: .12, rootMargin: "0px 0px -6% 0px" }) : null;
  function watch(el, delay) {
    el.classList.add("reveal");
    el.style.setProperty("--d", (delay || 0) + "ms");
    io ? io.observe(el) : el.classList.add("in");
  }
  document.querySelectorAll(".hero .wrap > *, section h2, section .muted:not(.card .muted), .banner, .logos, form, .tabs").forEach(el => { if (!el.classList.contains("reveal")) watch(el, 0); });
  document.querySelectorAll(".grid, .slider").forEach(g => [...g.children].forEach((c, i) => { if (!c.classList.contains("reveal")) watch(c, Math.min(i, 5) * 110); }));
})();

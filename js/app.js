/* منطق التطبيق: عرض الدروس والنماذج والمواد والفحص والمصطلحات + الحاسبات + حفظ التقدم */
"use strict";
const $ = s => document.querySelector(s);
const store = {
  get(k, d){ try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set(k, v){ localStorage.setItem(k, JSON.stringify(v)); }
};
let doneLessons = new Set(store.get("hw-done", []));
let doneChecks  = new Set(store.get("hw-checks", []));
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

/* ---------- التبويبات ---------- */
document.querySelectorAll(".tab").forEach(b => b.addEventListener("click", () => {
  document.querySelectorAll(".tab").forEach(x => x.classList.toggle("active", x === b));
  document.querySelectorAll(".view").forEach(v => v.classList.toggle("active", v.id === "view-" + b.dataset.tab));
}));

/* ---------- الدروس ---------- */
function totalLessons(){ return MODULES.reduce((a, m) => a + m.lessons.length, 0); }
function updateProgress(){
  $("#progressText").textContent = `${doneLessons.size} من ${totalLessons()} درساً`;
  $("#progressFill").style.width = (totalLessons() ? (doneLessons.size / totalLessons() * 100) : 0) + "%";
}
function renderLessons(filter = ""){
  const f = filter.trim();
  const wrap = $("#view-lessons"); wrap.innerHTML = "";
  let any = false;
  MODULES.forEach(m => {
    const lessons = m.lessons.map((l, i) => ({...l, idx: i})).filter(l =>
      !f || (m.title + l.t + l.body.join(" ") + l.steps.join(" ")).includes(f));
    if (!lessons.length) return;
    any = true;
    const mod = document.createElement("div"); mod.className = "module" + (f ? " open" : "");
    mod.innerHTML = `<div class="module-head"><div class="module-icon">${m.icon}</div>
      <div><h2>${esc(m.title)}</h2><p>${esc(m.desc)}</p></div></div><div class="module-body"></div>`;
    mod.querySelector(".module-head").addEventListener("click", () => mod.classList.toggle("open"));
    const body = mod.querySelector(".module-body");
    lessons.forEach(l => {
      const key = m.id + ":" + l.idx;
      const d = document.createElement("div"); d.className = "lesson";
      d.innerHTML = `<h3>${esc(l.t)}</h3>` +
        l.body.map(p => `<p>${esc(p)}</p>`).join("") +
        (l.steps?.length ? `<ol>${l.steps.map(s => `<li>${esc(s)}</li>`).join("")}</ol>` : "") +
        (l.warn ? `<div class="box warn">⚠️ ${esc(l.warn)}</div>` : "") +
        (l.tip ? `<div class="box tip">💰 عملي واقتصادي: ${esc(l.tip)}</div>` : "") +
        `<label class="done-row"><input type="checkbox" ${doneLessons.has(key) ? "checked" : ""}> أتممت هذا الدرس وفهمته</label>`;
      d.querySelector("input").addEventListener("change", e => {
        e.target.checked ? doneLessons.add(key) : doneLessons.delete(key);
        store.set("hw-done", [...doneLessons]); updateProgress();
      });
      body.appendChild(d);
    });
    wrap.appendChild(mod);
  });
  if (!any) wrap.innerHTML = `<p class="empty">لا نتائج مطابقة — جرّب كلمة أخرى.</p>`;
  updateProgress();
}

/* ---------- النماذج السورية ---------- */
function renderModels(){
  const wrap = $("#view-models"); wrap.innerHTML = "";
  MODELS.forEach(md => {
    const card = document.createElement("div"); card.className = "card";
    card.innerHTML = `
      <div class="model-head"><div class="module-icon">${md.icon}</div>
        <div><h2>${esc(md.name)}</h2><p class="sub2">${esc(md.sub)}</p></div></div>
      <p>${esc(md.desc)}</p>
      <h3>🧭 خطة التغذية والتوزيع</h3>${md.plan.map(p => `<p>${esc(p)}</p>`).join("")}
      <h3>🎛️ جدول الدارات واللوحة</h3>
      <div style="overflow-x:auto"><table><tr><th>#</th><th>الدارة</th><th>الحمل التقريبي</th><th>مقطع السلك</th><th>القاطع</th><th>ملاحظات</th></tr>
      ${md.circuits.map(c => `<tr>${c.map(x => `<td>${esc(x)}</td>`).join("")}</tr>`).join("")}</table></div>
      <p><b>اللوحة:</b> ${esc(md.board)}</p>
      <h3>🧾 قائمة المواد التقريبية</h3>
      <div style="overflow-x:auto"><table><tr><th>المادة</th><th>الكمية</th><th>ملاحظة</th></tr>
      ${md.bom.map(b => `<tr>${b.map(x => `<td>${esc(x)}</td>`).join("")}</tr>`).join("")}</table></div>
      <h3>🔨 خطوات التنفيذ بالترتيب</h3><ol>${md.steps.map(s => `<li>${esc(s)}</li>`).join("")}</ol>
      <h3>🚫 أخطاء شائعة في هذا النموذج</h3><ul>${md.mistakes.map(s => `<li>${esc(s)}</li>`).join("")}</ul>
      <div class="exercise">✍️ <b>نفّذ وتعلّم:</b> ${esc(md.exercise)}</div>`;
    wrap.appendChild(card);
  });
}

/* ---------- المواد ---------- */
let matCat = "الكل";
function renderMaterials(filter = ""){
  const wrap = $("#view-materials");
  const cats = ["الكل", ...new Set(MATERIALS.map(x => x.c))];
  const f = filter.trim();
  const list = MATERIALS.filter(x => (matCat === "الكل" || x.c === matCat) &&
    (!f || (x.n + x.s + x.m + x.e + x.a).includes(f)));
  wrap.innerHTML = `<div class="chips">${cats.map(c =>
    `<button class="chip ${c === matCat ? "active" : ""}" data-c="${esc(c)}">${esc(c)}</button>`).join("")}</div>` +
    (list.length ? `<div style="overflow-x:auto"><table><tr><th>المادة</th><th>المواصفة الصحيحة</th><th>التطور الحديث المفيد</th><th>الخيار الاقتصادي الذكي</th><th>تجنّب</th></tr>
      ${list.map(x => `<tr><td><b>${esc(x.n)}</b><br><small>${esc(x.c)}</small></td><td>${esc(x.s)}</td><td>${esc(x.m)}</td><td>${esc(x.e)}</td><td>${esc(x.a)}</td></tr>`).join("")}</table></div>`
    : `<p class="empty">لا مواد مطابقة.</p>`);
  wrap.querySelectorAll(".chip").forEach(ch => ch.addEventListener("click", () => { matCat = ch.dataset.c; renderMaterials($("#globalSearch").value); }));
}

/* ---------- قوائم الفحص ---------- */
function renderChecks(){
  const wrap = $("#view-checks"); wrap.innerHTML = "";
  CHECKLISTS.forEach((g, gi) => {
    const card = document.createElement("div"); card.className = "card check-group";
    card.innerHTML = `<h3>✅ ${esc(g.t)}</h3>`;
    g.items.forEach((it, ii) => {
      const key = gi + ":" + ii;
      const row = document.createElement("label"); row.className = "check-item";
      row.innerHTML = `<input type="checkbox" ${doneChecks.has(key) ? "checked" : ""}><span>${esc(it)}</span>`;
      row.querySelector("input").addEventListener("change", e => {
        e.target.checked ? doneChecks.add(key) : doneChecks.delete(key);
        store.set("hw-checks", [...doneChecks]);
      });
      card.appendChild(row);
    });
    wrap.appendChild(card);
  });
}

/* ---------- المصطلحات ---------- */
function renderGlossary(filter = ""){
  const f = filter.trim();
  const list = GLOSSARY.filter(g => !f || (g[0] + g[1] + g[2]).includes(f));
  $("#view-glossary").innerHTML = list.length ?
    `<div class="card"><table><tr><th>المصطلح</th><th>بالإنجليزية</th><th>ببساطة</th></tr>
     ${list.map(g => `<tr><td><b>${esc(g[0])}</b></td><td dir="ltr">${esc(g[1])}</td><td>${esc(g[2])}</td></tr>`).join("")}</table></div>`
    : `<p class="empty">لا مصطلحات مطابقة.</p>`;
}

/* ---------- الحاسبات ---------- */
const AMPACITY = [ // [مقطع مم², تحمّل محافظ داخل ماسورة A]
  [1.5, 14], [2.5, 20], [4, 28], [6, 36], [10, 50], [16, 66], [25, 83], [35, 103]];
const BREAKERS = [6, 10, 16, 20, 25, 32, 40, 50, 63, 80, 100];
function pickBreaker(i, wireAmp){
  const b = BREAKERS.find(x => x >= i * 1.0 && x <= wireAmp);
  return b ?? BREAKERS.find(x => x <= wireAmp) ?? 10;
}
function calcWire(){
  const P = +$("#wPower").value || 0, L = +$("#wLen").value || 0;
  const dropLimit = +$("#wType").value; // 3% إنارة => value 2? نستخدم القيمة كنسبة مباشرة:
  const limitPct = dropLimit === 2 ? 3 : 5;
  const I = P / 220;
  const minS = limitPct === 3 ? 1.5 : 2.5; // المآخذ لا تقل عن 2.5مم² مهما صغُر الحمل — قاعدة تأسيس
  let chosen = null;
  for (const [s, amp] of AMPACITY) {
    if (s < minS) continue;
    const dropV = 2 * L * I * 0.0175 / s, dropPct = dropV / 220 * 100;
    if (amp >= I && dropPct <= limitPct) { chosen = { s, amp, dropV, dropPct }; break; }
  }
  if (!chosen) {
    const [s, amp] = AMPACITY[AMPACITY.length - 1];
    const dropV = 2 * L * I * 0.0175 / s;
    chosen = { s, amp, dropV, dropPct: dropV / 220 * 100, over: amp < I };
  }
  const br = pickBreaker(I, chosen.amp);
  $("#wireResult").textContent =
    `التيار: ${I.toFixed(1)}A — المقطع المناسب: ${chosen.s} مم² نحاس (يتحمل ≈${chosen.amp}A داخل ماسورة)\n` +
    `القاطع: ${br}A — هبوط الجهد على ${L}م: ${chosen.dropV.toFixed(1)}V ‏(${chosen.dropPct.toFixed(1)}٪)\n` +
    `سلك الأرضي: ${chosen.s} مم²، ودارة كاملة = طور + حيادي + أرضي بنفس المقطع.` +
    (chosen.over ? `\nتنبيه: الحمل كبير جداً على مقطع واحد — قسّم الدارة أو راجع فنياً لتصميم خاص.` : "");
}
const APPLIANCES = [
  ["إنارة LED للبيت", 150, 1], ["براد", 150, 1], ["تلفاز + رسيفر", 150, 1], ["راوتر واي فاي", 15, 1],
  ["غسالة", 600, 0], ["سخان ماء كهربائي", 2000, 0], ["مكيف ١ طن", 1100, 0], ["مكيف ١٫٥ طن", 1600, 0],
  ["فرن كهربائي", 2500, 0], ["غلاية ماء", 1800, 0], ["ميكروويف", 1200, 0], ["مضخة ماء", 750, 0],
  ["مكواة", 1000, 0], ["مدفأة كهربائية", 2000, 0], ["مكنسة", 1400, 0], ["كمبيوتر مكتبي", 300, 0]];
function renderLoadList(){
  $("#loadList").innerHTML = APPLIANCES.map((a, i) => `
    <div class="load-row"><label style="flex:1"><input type="checkbox" id="ldOn${i}" ${a[2] ? "checked" : ""}> ${esc(a[0])} ‏(${a[1]}W)</label>
    <input type="number" id="ldQty${i}" value="1" min="0" max="10"></div>`).join("");
}
function calcLoad(){
  let total = 0;
  APPLIANCES.forEach((a, i) => { if ($("#ldOn" + i).checked) total += a[1] * (+$("#ldQty" + i).value || 0); });
  const div = +$("#loadDiv").value || 0.65;
  const sim = total * div, I = sim / 220;
  const main = BREAKERS.find(b => b >= I) ?? 100;
  const cable = (AMPACITY.find(([s, amp]) => amp >= main) || [35])[0];
  $("#loadResult").textContent =
    `مجموع الأحمال المركّبة: ${total}W — المتزامن التقديري (×${div}): ${Math.round(sim)}W ≈ ${I.toFixed(1)}A\n` +
    `القاطع الرئيسي المقترح: ${main}A — كابل ما بعد العداد: ${cable} مم² نحاس (وللمسافات الطويلة كبّر درجة لهبوط الجهد)`;
}
function calcBom(){
  const nL = +$("#bLights").value || 0, nS = +$("#bSockets").value || 0, nH = +$("#bHeavy").value || 0;
  const LL = +$("#bLenL").value || 0, LS = +$("#bLenS").value || 0, LH = +$("#bLenH").value || 0;
  const circL = Math.max(1, Math.ceil(nL / 7)), circS = Math.max(1, Math.ceil(nS / 6));
  const w15 = Math.round(circL * LL * 3 * 1.15), w25 = Math.round(circS * LS * 3 * 1.15), w4 = Math.round(nH * LH * 3 * 1.15);
  const conduit = Math.round((circL * LL + circS * LS + nH * LH) * 1.1);
  const breakers = circL + circS + nH + 2;
  $("#bomResult").textContent =
    `دارات إنارة: ${circL} (قاطع 10A لكلٍّ منها) — سلك 1.5مم² ≈ ${w15}م بمجموع الألوان\n` +
    `دارات مآخذ: ${circS} (قاطع 16A) — سلك 2.5مم² ≈ ${w25}م بمجموع الألوان\n` +
    `دارات ثقيلة: ${nH} (قواطع 20–25A) — سلك 4مم² ≈ ${w4}م بمجموع الألوان\n` +
    `مواسير ≈ ${conduit}م — علب تأسيس ≈ ${nL + nS + circL + circS} — قواطع دارات ≈ ${breakers} + رئيسي + حماية جهد + تسرب + SPD\n` +
    `لوحة مقترحة: ${breakers + 6} خطاً على الأقل (مع احتياطي مستقبلي).`;
}

/* ---------- البحث العام ---------- */
$("#globalSearch").addEventListener("input", e => {
  const v = e.target.value;
  renderLessons(v); renderMaterials(v); renderGlossary(v);
});

renderLessons(); renderModels(); renderLoadList(); renderMaterials(); renderChecks(); renderGlossary();

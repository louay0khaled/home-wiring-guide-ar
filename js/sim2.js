/* ============================================================
   محاكاة المنزل الحية 2D — شقة سورية ٩٠م² واقعية المخطط
   متسلسلة: مخطط ← مواسير ← أسلاك ← لوحة ← تشغيل تجريبي ← حياة حية
   في الحياة الحية: شغّل الأجهزة بنفسك، راقب الحمل، جرّب فصل
   القاطع بالحمل الزائد، بدّل بين الدولة والاشتراك والإنفرتر
   وراقب البطارية والخزان. كل ذلك على مخطط المنزل نفسه.
   ============================================================ */
"use strict";

/* ---------- هندسة المخطط ---------- */
const ROOMS = [
  { x: 70, y: 70, w: 290, h: 250, name: "غرفة نوم ١", c: "#fdf3e3" },
  { x: 70, y: 320, w: 290, h: 250, name: "غرفة نوم ٢", c: "#fdf3e3" },
  { x: 360, y: 70, w: 490, h: 260, name: "صالون", c: "#eef6ec" },
  { x: 360, y: 330, w: 70, h: 240, name: "ممر", c: "#f4f1ea" },
  { x: 430, y: 330, w: 170, h: 240, name: "حمّام", c: "#e8f3f8" },
  { x: 600, y: 330, w: 250, h: 240, name: "مطبخ", c: "#fdeeee" }
];
const FURN = [
  // [x,y,w,h,label,fill]
  [95, 95, 110, 70, "سرير", "#d9c7a7"], [225, 95, 60, 45, "خزانة", "#cbb894"], [95, 480, 110, 70, "سرير", "#d9c7a7"],
  [225, 520, 70, 40, "مكتب", "#d8cfc0"],
  [640, 95, 180, 55, "كنبة", "#b9cfb2"], [640, 250, 180, 40, "طاولة", "#d8cfc0"], [470, 95, 90, 50, "كنبة", "#b9cfb2"],
  [610, 345, 230, 35, "سطح عمل", "#e3c9c9"], [610, 520, 70, 40, "غسالة", "#cfd8dc"],
  [445, 345, 60, 45, "دش", "#bcd9e8"], [530, 345, 55, 40, "مغسلة", "#bcd9e8"], [445, 520, 45, 35, "مرحاض", "#bcd9e8"]
];
const PANEL_POS = { x: 395, y: 352 };

/* ---------- الدارات (نفس نموذج الشقة ٩٠م²) ---------- */
const CIRCUITS = [
  { n: 1, name: "إنارة الغرف والممر", color: "#f59e0b", paths: [[[395, 352], [395, 130], [330, 130], [215, 118]], [[395, 352], [395, 480], [330, 480], [300, 380], [215, 368]], [[395, 352], [395, 545]]] },
  { n: 2, name: "إنارة صالون ومطبخ وحمام", color: "#fbbf24", paths: [[[395, 352], [430, 352], [430, 120], [600, 118]], [[430, 352], [700, 352], [720, 366]], [[430, 352], [430, 420], [505, 420], [512, 392]]] },
  { n: 3, name: "مآخذ غرف النوم", color: "#38bdf8", paths: [[[395, 352], [395, 500], [340, 500], [150, 500], [112, 420]]] },
  { n: 4, name: "مآخذ الصالون (تلفاز)", color: "#818cf8", paths: [[[395, 352], [450, 352], [450, 200], [600, 200], [700, 268]]] },
  { n: 5, name: "مآخذ مطبخ — سطح عمل", color: "#fb7185", paths: [[[395, 352], [560, 352], [655, 356]]] },
  { n: 6, name: "براد المطبخ", color: "#34d399", paths: [[[395, 352], [560, 352], [560, 545], [806, 545]]] },
  { n: 7, name: "فرن كهربائي", color: "#ef4444", paths: [[[395, 352], [560, 352], [560, 545], [742, 540]]] },
  { n: 8, name: "سخان ماء الحمام", color: "#dc2626", paths: [[[395, 352], [430, 352], [430, 540], [540, 540]]] },
  { n: 9, name: "غسالة", color: "#a78bfa", paths: [[[395, 352], [560, 352], [560, 545], [628, 540]]] },
  { n: 10, name: "مكيف غرفة نوم ١", color: "#06b6d4", paths: [[[395, 352], [395, 130], [322, 96]]] },
  { n: 11, name: "مكيف الصالون", color: "#0891b2", paths: [[[395, 352], [450, 352], [450, 110], [806, 96]]] },
  { n: 12, name: "مضخة الخزان", color: "#84cc16", paths: [[[395, 352], [430, 352], [430, 540], [576, 540]]] }
];

/* ---------- الأجهزة ---------- */
/* src: أي المصادر تسمح بهذا الجهاز بالتأسيس: دولة d / اشتراك s / إنفرتر i */
const DEVICES = [
  { id: "l1", name: "إنارة الغرف", icon: "💡", x: 215, y: 118, w: 130, c: 1, src: "dsi", light: true },
  { id: "l1b", name: "إنارة نوم ٢", icon: "💡", x: 215, y: 368, w: 130, c: 1, src: "dsi", light: true },
  { id: "l2", name: "إنارة الصالون", icon: "💡", x: 600, y: 118, w: 180, c: 2, src: "dsi", light: true },
  { id: "l2b", name: "إنارة مطبخ/حمام", icon: "💡", x: 650, y: 420, w: 120, c: 2, src: "dsi", light: true },
  { id: "sock", name: "مآخذ وشواحن الغرف", icon: "🔌", x: 112, y: 420, w: 300, c: 3, src: "dsi" },
  { id: "tv", name: "تلفاز وراوتر", icon: "📺", x: 700, y: 282, w: 230, c: 4, src: "dsi" },
  { id: "kettle", name: "غلاية وميكروويف", icon: "☕", x: 655, y: 368, w: 2000, c: 5, src: "d" },
  { id: "fridge", name: "البراد", icon: "🧊", x: 806, y: 532, w: 150, c: 6, src: "dsi" },
  { id: "oven", name: "الفرن الكهربائي", icon: "🔥", x: 742, y: 528, w: 3000, c: 7, src: "d" },
  { id: "heater", name: "سخان الماء", icon: "🚿", x: 548, y: 528, w: 2000, c: 8, src: "d" },
  { id: "washer", name: "الغسالة", icon: "🌀", x: 628, y: 528, w: 1500, c: 9, src: "d" },
  { id: "ac1", name: "مكيف نوم ١", icon: "❄️", x: 322, y: 84, w: 1100, c: 10, src: "d", fan: true },
  { id: "ac2", name: "مكيف الصالون", icon: "❄️", x: 806, y: 84, w: 1600, c: 11, src: "d", fan: true },
  { id: "pump", name: "مضخة الخزان", icon: "💧", x: 584, y: 528, w: 600, c: 12, src: "ds" }
];
const SOURCES = {
  d: { name: "كهرباء الدولة", limitW: 8800, limitLabel: "قاطع رئيسي 40A" },
  s: { name: "خط الاشتراك", limitW: 2200, limitLabel: "اشتراك 10A" },
  i: { name: "الإنفرتر والبطارية", limitW: 1300, limitLabel: "إنفرتر 1600VA" }
};
const STAGES2 = [
  { t: "١ — مخطط النقاط", d: "هذا مخطط الشقة الحقيقي بغرفها وأثاثها. النقاط الصفراء هي مواقع الإنارة والمآخذ والأجهزة كما خُططت في درس التخطيط — لاحظ قرب اللوحة من المدخل وتجمّع أحمال المطبخ والحمام." },
  { t: "٢ — مدّ المواسير", d: "تُمدّ المواسير (الرمادية السميكة) من اللوحة إلى كل نقطة بمسارات أفقية وعمودية على الجدران، قبل اللياسة. راقب كيف تتفرع من الممر إلى الغرف." },
  { t: "٣ — سحب الأسلاك", d: "تُسحب الأسلاك الملوّنة داخل المواسير — لكل دارة لونها: طور وحيادي وأرضي معاً. لاحظ أن مسار كل دارة مستقل من اللوحة إلى نقطتها: هذا هو معنى «دارة منفصلة»." },
  { t: "٤ — اللوحة والحمايات", d: "تتركّب اللوحة بسلسلة حماياتها في اللوحة المصغّرة يميناً: رئيسي 40A ← حماية جهد ← SPD ← قاطع تسرب 30mA ← قواطع الدارات الـ١٢. كل قاطع سيضيء بلون دارته عند تشغيلها لاحقاً." },
  { t: "٥ — التشطيب والتشغيل التجريبي", d: "تُركّب المفاتيح والمآخذ وتُشغّل الدارات واحدة تلو الأخرى للفحص: إنارة، مآخذ، ثم الأحمال الثقيلة — كما في فحص التسليم تماماً." },
  { t: "٦ — الحياة الحية: شغّل بيتك بنفسك", d: "الآن البيت لك: انقر أي جهاز لتشغيله/إطفائه وراقب الحمل الكلي. جرّب تجاوز حدّ المصدر ليفصل القاطع، وبدّل المصدر (دولة/اشتراك/إنفرتر) لترى أثر التأسيس الصحيح: على الاشتراك والإنفرتر لا تعمل إلا الدارات الموصولة عليهما أصلاً، والبطارية تنفد مع الاستهلاك وتُشحن على الدولة، والعوّامة تفصل المضخة عند امتلاء الخزان." }
];

/* ---------- الحالة ---------- */
let S2 = { stage: -1, source: "d", on: new Set(["fridge"]), tripped: false, batteryWh: 2400, tank: 35, auto: null, msg: "" };
const BAT_MAX = 2400;

function circuitOf(dev){ return CIRCUITS.find(c => c.n === dev.c); }
function totalW(){ let t = 0; DEVICES.forEach(d => { if (S2.on.has(d.id) && !S2.tripped && d.src.includes(S2.source)) t += d.w; }); return t; }

/* ---------- بناء الواجهة ---------- */
function pathD(pts){ return "M" + pts.map(p => p.join(" ")).join(" L"); }
function buildSim2(){
  const host = document.getElementById("view-sim2");
  const furn = FURN.map(f =>
    `<rect x="${f[0]}" y="${f[1]}" width="${f[2]}" height="${f[3]}" rx="6" class="furn"/><text x="${f[0] + f[2] / 2}" y="${f[1] + f[3] / 2 + 4}" class="furn-t">${f[4]}</text>`).join("");
  const rooms = ROOMS.map(r =>
    `<rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" fill="${r.c}" class="room"/>
     <text x="${r.x + r.w / 2}" y="${r.y + 22}" class="room-t">${r.name}</text>`).join("");
  const conduitPaths = CIRCUITS.map(c => c.paths.map(p =>
    `<path d="${pathD(p)}" class="conduit" data-c="${c.n}"/>`).join("")).join("");
  const wirePaths = CIRCUITS.map(c => c.paths.map(p =>
    `<path d="${pathD(p)}" class="wire" data-c="${c.n}" style="stroke:${c.color}"/>`).join("")).join("");
  const points = DEVICES.map(d =>
    `<circle cx="${d.x}" cy="${d.y}" r="6" class="pt-dot" data-dev="${d.id}"/>`).join("");
  const devs = DEVICES.map(d =>
    `<g class="dev" data-dev="${d.id}" transform="translate(${d.x},${d.y})">
       <circle class="halo" r="26"/>
       <circle class="dev-bg" r="15"/>
       <text class="dev-icon" y="6">${d.icon}</text>
       <text class="dev-name" y="34">${d.name}</text>
       ${d.fan ? `<g class="fan"><path d="M0 -9 L3 0 L0 9 L-3 0 Z M-9 0 L0 3 L9 0 L0 -3 Z"/></g>` : ""}
     </g>`).join("");
  host.innerHTML = `
  <div class="card sim2-wrap">
    <h2>🏠 محاكاة المنزل الحية — شقة سورية ٩٠م² بمخطط واقعي</h2>
    <div class="sim2-toolbar">
      <button class="btn" id="s2Play">▶ تشغيل متسلسل تلقائي</button>
      <button class="btn sim2-ghost" id="s2Reset">↺ من البداية</button>
      <span class="sim2-stages">${STAGES2.map((s, i) => `<button class="chip s2-stage-chip" data-st="${i}">${s.t}</button>`).join("")}</span>
    </div>
    <div class="sim2-narr" id="s2Narr">اضغط «تشغيل متسلسل» لتشاهد تمديد الشقة مرحلة مرحلة على المخطط، أو اختر أي مرحلة مباشرة.</div>
    <div class="sim2-main">
      <div class="sim2-plan">
        <svg viewBox="0 0 920 640" class="sim2-svg" id="s2Svg">
          ${rooms}
          <rect x="70" y="70" width="780" height="500" class="outer-wall"/>
          <g id="layerFurn">${furn}</g>
          <g id="layerConduit" class="hidden-layer">${conduitPaths}</g>
          <g id="layerWire" class="hidden-layer">${wirePaths}</g>
          <g id="layerPoints" class="hidden-layer">${points}</g>
          <g transform="translate(${PANEL_POS.x},${PANEL_POS.y})">
            <rect x="-17" y="-20" width="34" height="40" rx="4" class="panel-box"/>
            <text y="4" class="panel-t">🎛️</text>
            <text y="34" class="dev-name">لوحة التوزيع</text>
          </g>
          <g transform="translate(770,610)">
            <rect x="-52" y="-16" width="104" height="30" rx="6" class="tank-box"/>
            <rect id="tankFill" x="-48" y="10" width="96" height="0" rx="4" class="tank-fill"/>
            <text y="4" class="tank-t">🛢️ خزان الماء <tspan id="tankPct">٣٥٪</tspan></text>
          </g>
          <g id="layerDevs" class="hidden-layer">${devs}</g>
        </svg>
        <div class="sim2-legend">مرّر/انقر دارة من القائمة لإبراز مسارها — وفي المرحلة ٦ انقر الأجهزة على المخطط لتشغيلها وإطفائها.</div>
        <div class="sim2-msg" id="s2Msg"></div>
      </div>
      <div class="sim2-side">
        <div class="sim2-panelbox">
          <h4>🎛️ اللوحة — قواطع الدارات</h4>
          <div id="s2Breakers">${CIRCUITS.map(c =>
            `<div class="brk" data-c="${c.n}"><span class="brk-dot" style="background:${c.color}"></span>${c.n}. ${c.name}<span class="brk-state">مطفأ</span></div>`).join("")}</div>
          <div class="sim2-trip hidden" id="s2Trip">⚡ فصل القاطع الرئيسي!<br><span id="s2TripWhy"></span><br><button class="btn" id="s2ResetBrk">إعادة رفع القاطع</button></div>
        </div>
        <div class="sim2-meters">
          <h4>📊 الحمل الحي</h4>
          <div>المصدر الحالي: <b id="s2SrcName">كهرباء الدولة</b></div>
          <div class="sim2-srcbtns">
            <button class="chip" data-src="d">🏛️ دولة</button>
            <button class="chip" data-src="s">🔌 اشتراك 10A</button>
            <button class="chip" data-src="i">🔋 إنفرتر</button>
          </div>
          <div class="meter-row"><span>الحمل الكلي</span><b id="s2Load">0 W</b></div>
          <div class="meter-bar"><div id="s2LoadFill"></div></div>
          <div class="meter-row"><span>الحدّ</span><span id="s2Limit">قاطع رئيسي 40A ‏(8800W)</span></div>
          <div class="meter-row" id="s2BatRow"><span>🔋 البطارية</span><b id="s2Bat">100٪</b></div>
          <div class="meter-bar bat"><div id="s2BatFill" style="width:100%"></div></div>
          <p class="hint">تبديل المصدر يعمل من المرحلة ٦ (الحياة الحية). على الاشتراك/الإنفرتر تعمل فقط الدارات الموصولة عليهما بالتأسيس — تماماً كالواقع.</p>
        </div>
      </div>
    </div>
  </div>`;
  bindSim2();
  document.querySelector('#view-sim2 [data-src="d"]').classList.add("active");
  setStage2(0, true);
  setInterval(tickSim2, 1000);
}

/* ---------- المراحل ---------- */
function animatePaths(sel){
  document.querySelectorAll(sel).forEach((p, i) => {
    const len = p.getTotalLength();
    p.style.strokeDasharray = len; p.style.strokeDashoffset = len;
    p.getBoundingClientRect();
    p.style.transition = `stroke-dashoffset 1.1s ease ${i * 0.12}s`;
    p.style.strokeDashoffset = "0";
  });
}
function setStage2(n, instant){
  S2.stage = n;
  document.querySelectorAll(".s2-stage-chip").forEach((ch, i) => ch.classList.toggle("active", i === n));
  document.getElementById("s2Narr").textContent = STAGES2[n].d;
  const L = id => document.getElementById(id);
  const show = (id, on) => L(id).classList.toggle("hidden-layer", !on);
  show("layerPoints", n >= 0);
  show("layerConduit", n >= 1); show("layerWire", n >= 2); show("layerDevs", n >= 4);
  if (n === 1 && !instant) animatePaths("#layerConduit path");
  if (n === 2 && !instant) animatePaths("#layerWire path");
  if (n === 4 && !instant) testRun();
  if (n < 5) setMsg(n === 4 ? "التشغيل التجريبي يعمل…" : "");
  if (n === 5) setMsg("🟢 البيت حيّ الآن — انقر الأجهزة على المخطط. جرّب: شغّل الفرن والسخان والمكيفين معاً على الدولة، ثم بدّل إلى الاشتراك وشاهد ماذا يحدث.");
  updateMeters();
}
function testRun(){
  const seq = ["l2", "l1", "fridge", "tv", "kettle", "ac2", "heater", "pump"];
  seq.forEach((id, i) => setTimeout(() => { if (S2.stage === 4) { S2.on.add(id); refreshDevs(); } }, 500 * (i + 1)));
  setTimeout(() => { if (S2.stage === 4) setMsg("✔ فحص التسليم: كل دارة استجابت وحدها بلا فصل — المشروع جاهز للتسليم. انتقل للمرحلة ٦ وعِش في البيت."); }, 500 * seq.length + 600);
}

/* ---------- التفاعل الحي ---------- */
function setMsg(t){ const m = document.getElementById("s2Msg"); if (m) m.innerHTML = t; }
function bindSim2(){
  document.querySelectorAll("#view-sim2 .dev").forEach(g => {
    g.addEventListener("click", () => toggleDev(g.dataset.dev));
  });
  document.querySelectorAll("#view-sim2 .brk").forEach(b => {
    b.addEventListener("mouseenter", () => highlightCircuit(+b.dataset.c, true));
    b.addEventListener("mouseleave", () => highlightCircuit(+b.dataset.c, false));
    b.addEventListener("click", () => highlightCircuit(+b.dataset.c, true));
  });
  document.querySelectorAll("#view-sim2 .s2-stage-chip").forEach(ch =>
    ch.addEventListener("click", () => { stopAuto(); setStage2(+ch.dataset.st); }));
  document.querySelectorAll("#view-sim2 [data-src]").forEach(b =>
    b.addEventListener("click", () => switchSource(b.dataset.src)));
  document.getElementById("s2Play").addEventListener("click", playAuto);
  document.getElementById("s2Reset").addEventListener("click", () => location.reload());
  document.getElementById("s2ResetBrk").addEventListener("click", () => {
    S2.tripped = false; document.getElementById("s2Trip").classList.add("hidden");
    setMsg("أعدتَ رفع القاطع. الأحمال مطفأة — شغّل بحكمة هذه المرة وراقب الحدّ."); refreshDevs();
  });
}
function highlightCircuit(n, on){
  document.querySelectorAll(`#layerWire path[data-c="${n}"], #layerConduit path[data-c="${n}"]`)
    .forEach(p => p.classList.toggle("hl", on));
}
function stopAuto(){ if (S2.auto) { clearInterval(S2.auto); S2.auto = null; document.getElementById("s2Play").textContent = "▶ تشغيل متسلسل تلقائي"; } }
function playAuto(){
  if (S2.auto) { stopAuto(); return; }
  document.getElementById("s2Play").textContent = "⏸ إيقاف";
  let n = 0; setStage2(0);
  S2.auto = setInterval(() => { n++; if (n >= STAGES2.length) { stopAuto(); return; } setStage2(n); }, 5200);
}
function switchSource(src){
  if (S2.stage < 5) { setMsg("تبديل المصدر يُفتح في المرحلة ٦ (الحياة الحية) — أكمل التسلسل أولاً."); return; }
  S2.source = src;
  document.querySelectorAll("#view-sim2 [data-src]").forEach(b => b.classList.toggle("active", b.dataset.src === src));
  const dropped = [];
  DEVICES.forEach(d => { if (S2.on.has(d.id) && !d.src.includes(src)) { S2.on.delete(d.id); dropped.push(d.name); } });
  setMsg(`🔄 بدّلت بقاطع التبديل إلى: <b>${SOURCES[src].name}</b>.` +
    (dropped.length ? ` الدارات التالية غير موصولة على هذا المصدر وبقيت مطفأة بالتأسيس: ${dropped.join("، ")}.` : " كل ما كان يعمل ما زال ضمن المسموح.") +
    (src === "i" ? " راقب البطارية وهي تنفد مع الاستهلاك." : src === "s" ? " حدّك 10A فقط — الأحمال الثقيلة ممنوعة بنيوياً." : ""));
  refreshDevs();
}
function toggleDev(id){
  const d = DEVICES.find(x => x.id === id);
  if (S2.stage < 5) { setMsg("الأجهزة تُشغَّل يدوياً في المرحلة ٦ (الحياة الحية). في المراحل الأولى راقب البناء متسلسلاً."); return; }
  if (S2.tripped) { setMsg("القاطع الرئيسي فاصل — أعد رفعه من اللوحة يميناً أولاً."); return; }
  if (S2.on.has(id)) { S2.on.delete(id); refreshDevs(); return; }
  if (!d.src.includes(S2.source)) {
    setMsg(`🚫 «${d.name}» غير موصولة على ${SOURCES[S2.source].name} أصلاً — هكذا صُمم التأسيس: لا سخان ولا فرن ولا مكيف على الاشتراك/الإنفرتر، مهما ألححت.`);
    return;
  }
  S2.on.add(id);
  const t = totalW();
  if (t > SOURCES[S2.source].limitW) {
    S2.tripped = true; S2.on.clear();
    document.getElementById("s2TripWhy").textContent =
      `الحمل وصل ${t}W متجاوزاً حدّ ${SOURCES[S2.source].name} (${SOURCES[S2.source].limitLabel} = ${SOURCES[S2.source].limitW}W) — ففصل فوراً حمايةً للأسلاك. هكذا يعمل القاطع الصحيح: يضحّي بالراحة ولا يسمح للحريق.`;
    document.getElementById("s2Trip").classList.remove("hidden");
    setMsg("⚡ فصل القاطع! راجع اللوحة يميناً لتعرف السبب، وخفّف فهمك للأحمال قبل إعادة الرفع.");
  }
  refreshDevs();
}
function refreshDevs(){
  document.querySelectorAll("#view-sim2 .dev").forEach(g => {
    const d = DEVICES.find(x => x.id === g.dataset.dev);
    g.classList.toggle("on", S2.on.has(d.id) && !S2.tripped && d.src.includes(S2.source));
  });
  document.querySelectorAll("#view-sim2 .brk").forEach(b => {
    const n = +b.dataset.c;
    const active = !S2.tripped && DEVICES.some(d => d.c === n && S2.on.has(d.id) && d.src.includes(S2.source));
    b.classList.toggle("live", active);
    b.querySelector(".brk-state").textContent = S2.tripped ? "فاصل ⚡" : active ? "يعمل" : "مطفأ";
  });
  updateMeters();
}
function updateMeters(){
  const t = totalW(), lim = SOURCES[S2.source];
  const L = document.getElementById("s2Load"); if (!L) return;
  L.textContent = `${t} W ‏(${(t / 220).toFixed(1)}A)`;
  document.getElementById("s2SrcName").textContent = lim.name;
  document.getElementById("s2Limit").textContent = `${lim.limitLabel} ‏(${lim.limitW}W)`;
  const fill = document.getElementById("s2LoadFill");
  fill.style.width = Math.min(100, t / lim.limitW * 100) + "%";
  fill.style.background = t / lim.limitW > 0.85 ? "#dc2626" : t / lim.limitW > 0.6 ? "#f59e0b" : "#16a34a";
  const pct = Math.max(0, Math.round(S2.batteryWh / BAT_MAX * 100));
  document.getElementById("s2Bat").textContent = pct + "٪";
  document.getElementById("s2BatFill").style.width = pct + "%";
  const tf = document.getElementById("tankFill");
  if (tf) {
    tf.setAttribute("height", (S2.tank / 100 * 24).toFixed(1));
    tf.setAttribute("y", (14 - S2.tank / 100 * 24).toFixed(1));
    document.getElementById("tankPct").textContent = Math.round(S2.tank) + "٪";
  }
}
function tickSim2(){
  if (S2.stage < 5) return;
  let changed = false;
  /* البطارية: تنفد على الإنفرتر وتُشحن على الدولة (زمن مسرّع للتعليم) */
  if (S2.source === "i" && !S2.tripped) {
    const t = totalW();
    if (t > 0) { S2.batteryWh = Math.max(0, S2.batteryWh - t * 0.06); changed = true;
      if (S2.batteryWh === 0) { S2.on.clear(); setMsg("🪫 فرغت البطارية وأطفأ الإنفرتر نفسه حمايةً لها. بدّل إلى الدولة لشحنها وتشغيل البيت."); } }
  } else if (S2.source === "d" && S2.batteryWh < BAT_MAX) {
    S2.batteryWh = Math.min(BAT_MAX, S2.batteryWh + 55); changed = true;
  }
  /* الخزان والعوّامة */
  if (S2.on.has("pump") && !S2.tripped && DEVICES.find(d => d.id === "pump").src.includes(S2.source)) {
    if (S2.tank < 100) {
      S2.tank = Math.min(100, S2.tank + 3); changed = true;
      const f = document.getElementById("tankFill");
      f.setAttribute("height", (S2.tank / 100 * 24).toFixed(0)); f.setAttribute("y", (14 - S2.tank / 100 * 24 + 0).toFixed(0));
      document.getElementById("tankPct").textContent = Math.round(S2.tank) + "٪";
      if (S2.tank >= 100) { S2.on.delete("pump"); setMsg("💧 امتلأ الخزان — العوّامة فصلت المضخة تلقائياً. لا صعود إلى السطح، لا فيضان، لا تشغيل جاف."); }
    }
  }
  if (changed) refreshDevs(); else updateMeters();
}

buildSim2();

/* ============================================================
   المحاكاة الشاملة — التطبيق كله بيت واحد حيّ
   من العامود والمحوّل، للعداد، للتأريض، للوحة حقيقية بمفاتيحها
   وحماياتها، لأسلاك تُقاس، ومفاتيح جدارية تعمل (مفرد وديفاتير)،
   ومقابس، ومراوح بمنظّمات، وأجهزة — وكل شيء محسوب حيّاً:
   تيار كل دارة وسلك، هبوط الجهد، الفصل الفردي والرئيسي،
   التسرب، ارتفاع الجهد، البطارية، والعداد بالكيلوواط والكلفة.
   ومسار تعليمي من الصفر يقودك مهمةً مهمة داخل هذا البيت نفسه.
   ============================================================ */
"use strict";

/* ---------- الدارات: مقطع، قاطع، طول تقريبي ---------- */
const FC = {
  1: { name: "إنارة ومراوح الغرف والممر", s: 1.5, brk: 10, len: 26, color: "#ea580c" },
  2: { name: "إنارة ومراوح صالون ومطبخ وحمام", s: 1.5, brk: 10, len: 22, color: "#ca8a04" },
  3: { name: "مآخذ غرف النوم", s: 2.5, brk: 16, len: 18, color: "#38bdf8" },
  4: { name: "مآخذ الصالون", s: 2.5, brk: 16, len: 15, color: "#818cf8" },
  5: { name: "مآخذ مطبخ — سطح عمل", s: 2.5, brk: 16, len: 14, color: "#fb7185" },
  6: { name: "البراد", s: 2.5, brk: 16, len: 16, color: "#34d399" },
  7: { name: "الفرن الكهربائي", s: 4, brk: 25, len: 13, color: "#ef4444" },
  8: { name: "سخان ماء الحمام", s: 4, brk: 20, len: 11, color: "#dc2626" },
  9: { name: "الغسالة", s: 2.5, brk: 16, len: 15, color: "#a78bfa" },
  10: { name: "مكيف غرفة نوم ١", s: 4, brk: 20, len: 17, color: "#06b6d4" },
  11: { name: "مكيف الصالون", s: 4, brk: 25, len: 20, color: "#0891b2" },
  12: { name: "مضخة الخزان", s: 2.5, brk: 16, len: 21, color: "#84cc16" }
};
/* مسارات الأسلاك على المخطط (من اللوحة 390,475) */
const FPATHS = {
  1: [[[390, 475], [390, 240], [330, 240], [206, 222]], [[390, 475], [390, 640], [330, 640], [330, 480], [206, 476]], [[390, 475], [390, 566]]],
  2: [[[390, 475], [470, 475], [470, 240], [614, 226]], [[470, 475], [700, 475], [749, 498]], [[470, 475], [470, 540], [514, 512]]],
  3: [[[390, 475], [390, 660], [330, 660], [200, 660], [116, 684]], [[330, 660], [256, 684]], [[390, 475], [390, 640], [330, 640], [330, 470], [116, 461]]],
  4: [[[390, 475], [470, 475], [470, 420], [694, 424]]],
  5: [[[390, 475], [560, 475], [659, 472]], [[560, 475], [739, 472]]],
  6: [[[390, 475], [560, 475], [560, 684], [859, 684]]],
  7: [[[390, 475], [560, 475], [560, 684], [640, 684], [640, 560], [794, 536]]],
  8: [[[390, 475], [470, 475], [470, 684], [514, 684]]],
  9: [[[390, 475], [560, 475], [560, 684], [644, 684]]],
  10: [[[390, 475], [390, 240], [336, 200]]],
  11: [[[390, 475], [470, 475], [470, 240], [874, 200]]],
  12: [[[390, 475], [470, 475], [470, 684], [554, 684]]]
};
/* ---------- الأجهزة والنقاط ---------- */
/* kind: light/fan/plug · sw: مفتاح جداري · src: d دولة، s اشتراك، i إنفرتر */
const FDEV = [
  { id: "ln1", name: "إنارة نوم ١", icon: "💡", x: 200, y: 215, w: 60, c: 1, src: "dsi", kind: "light" },
  { id: "fn1", name: "مروحة نوم ١", icon: "🌀", x: 200, y: 305, w: 0, c: 1, src: "dsi", kind: "fan" },
  { id: "ln2", name: "إنارة نوم ٢", icon: "💡", x: 200, y: 470, w: 60, c: 1, src: "dsi", kind: "light" },
  { id: "fn2", name: "مروحة نوم ٢", icon: "🌀", x: 200, y: 565, w: 0, c: 1, src: "dsi", kind: "fan" },
  { id: "lcor", name: "إنارة الممر", icon: "💡", x: 390, y: 560, w: 40, c: 1, src: "dsi", kind: "light" },
  { id: "lsal", name: "إنارة الصالون", icon: "💡", x: 620, y: 220, w: 150, c: 2, src: "dsi", kind: "light" },
  { id: "fsal", name: "مروحة الصالون", icon: "🌀", x: 620, y: 330, w: 0, c: 2, src: "dsi", kind: "fan" },
  { id: "lkit", name: "إنارة المطبخ", icon: "💡", x: 755, y: 505, w: 60, c: 2, src: "dsi", kind: "light" },
  { id: "lbth", name: "إنارة الحمام", icon: "💡", x: 520, y: 505, w: 40, c: 2, src: "dsi", kind: "light" },
  { id: "heat3", name: "مدفأة كهربائية", icon: "♨️", x: 110, y: 690, w: 2400, c: 3, src: "d", kind: "plug" },
  { id: "iron", name: "مكواة", icon: "🧺", x: 250, y: 690, w: 1100, c: 3, src: "d", kind: "plug" },
  { id: "chrg", name: "شواحن ومآخذ نوم", icon: "🔌", x: 110, y: 455, w: 200, c: 3, src: "dsi", kind: "plug" },
  { id: "tv", name: "تلفاز وراوتر", icon: "📺", x: 700, y: 430, w: 230, c: 4, src: "dsi", kind: "plug" },
  { id: "kettle", name: "غلاية ماء", icon: "☕", x: 665, y: 478, w: 1800, c: 5, src: "d", kind: "plug" },
  { id: "micro", name: "ميكروويف", icon: "📻", x: 745, y: 478, w: 1200, c: 5, src: "d", kind: "plug" },
  { id: "fridge", name: "البراد", icon: "🧊", x: 865, y: 690, w: 150, c: 6, src: "dsi", kind: "plug" },
  { id: "oven", name: "الفرن الكهربائي", icon: "🔥", x: 800, y: 545, w: 3000, c: 7, src: "d", kind: "plug" },
  { id: "heater", name: "سخان الماء", icon: "🚿", x: 520, y: 690, w: 2000, c: 8, src: "d", kind: "plug" },
  { id: "washer", name: "الغسالة", icon: "🫧", x: 650, y: 690, w: 1500, c: 9, src: "d", kind: "plug" },
  { id: "ac1", name: "مكيف نوم ١", icon: "❄️", x: 330, y: 192, w: 1100, c: 10, src: "d", kind: "plug" },
  { id: "ac2", name: "مكيف الصالون", icon: "❄️", x: 868, y: 192, w: 1600, c: 11, src: "d", kind: "plug" },
  { id: "pump", name: "مضخة الخزان", icon: "💧", x: 560, y: 690, w: 600, c: 12, src: "ds", kind: "plug" }
];
const FAN_W = [0, 20, 40, 60, 75];
/* المفاتيح الجدارية: كل مفتاح يتحكم بجهاز؛ مفتاحا الصالون ديفاتير */
const FSW = [
  { id: "sw1", dev: "ln1", x: 338, y: 300, label: "مفتاح إنارة نوم ١" },
  { id: "sw2", dev: "fn1", x: 338, y: 332, label: "منظّم مروحة نوم ١", reg: true },
  { id: "sw3", dev: "ln2", x: 338, y: 545, label: "مفتاح إنارة نوم ٢" },
  { id: "sw4", dev: "fn2", x: 338, y: 577, label: "منظّم مروحة نوم ٢", reg: true },
  { id: "sw5", dev: "lsal", x: 366, y: 300, label: "ديفاتير صالون — عند الباب" },
  { id: "sw6", dev: "lsal", x: 878, y: 300, label: "ديفاتير صالون — الطرف الثاني" },
  { id: "sw7", dev: "fsal", x: 366, y: 340, label: "منظّم مروحة الصالون", reg: true },
  { id: "sw8", dev: "lkit", x: 622, y: 545, label: "مفتاح إنارة المطبخ" },
  { id: "sw9", dev: "lbth", x: 424, y: 545, label: "مفتاح الحمام (خارجاً — أمان)" },
  { id: "sw10", dev: "lcor", x: 424, y: 640, label: "مفتاح الممر" }
];
const SRC_LIMIT = { d: 40, s: 10, i: 6 };        // أمبير الحد الأعلى لكل مصدر (الإنفرتر ≈ 1300W)
const SRC_NAME = { d: "كهرباء الدولة", s: "خط الاشتراك 10A", i: "الإنفرتر والبطارية" };

/* ---------- بطاقات تعليمية للمكونات ---------- */
const FINFO = {
  pole: ["العامود والمحوّل", "من هنا تبدأ الحكاية: محوّل الحي يخفّض الجهد إلى 220V، ويُمدّ كابل الدخول (الألمنيوم المجدول غالباً) من العامود إلى عداد بيتك. كل ما قبل العداد ملك شركة الكهرباء ومسؤوليتها.", "في المحاكاة: لاحظ أن العداد لا يدور إلا إذا كان في البيت حمل يعمل فعلاً."],
  meter: ["عداد الكهرباء", "يقيس ما تستهلكه بالكيلوواط/ساعة kWh وهو أساس فاتورتك. العداد ملك الشركة ومختوم — لا يُفتح أبداً. عملك يبدأ من بعده.", "في المحاكاة: العداد يحسب حيّاً — راقب عدّاده الرقمي وهو يزيد مع الأحمال، وانظر قسم «الطاقة والكلفة»."],
  earth: ["قضيب التأريض وحفرته", "قضيب نحاسي مغروس بالتربة يُوصل إليه سلك الأرضي الأخضر/الأصفر من اللوحة. عند تسرب الكهرباء لهيكل أي جهاز، يأخذ التيار طريق الأرض ويفصل قاطع التسرب بدل أن يمرّ بجسمك.", "في المحاكاة: اضغط زر «قياس المقاومة» بالمهمة لترى قيمة حفرة هذا البيت. الهدف أقل من 10Ω."],
  main: ["القاطع الرئيسي", "أول جهاز في اللوحة: يفصل الطور والحيادي معاً عن البيت كله. 40A هنا لأنه محسوب على الحمل المتزامن للشقة. هو مفتاحك الأول عند أي عمل أو طارئ.", "جرّب: افصله من اللوحة — يموت البيت كله فوراً، مهما كان المصدر."],
  vprot: ["قاطع حماية الجهد", "يراقب جهد الشبكة لحظة بلحظة: إن خرج عن النطاق الآمن (تقريباً 170–250V) يفصل البيت كله، ويعيد الوصل بعد استقرار الجهد وتأخير زمني يحمي الضواغط.", "جرّب سيناريو «ارتفاع جهد مفاجئ» وراقب شاشته وهو يفصل ثم يعيد."],
  spd: ["مانع الاندفاع SPD", "يمتصّ نبضات الجهد العابرة الهائلة (برق بعيد، تبديلات شبكة) ويفرّغها إلى التأريض. نافذته خضراء سليماً وحمراء بعد أن يضحّي بنفسه — عندها تُستبدل وحدته فقط.", "لا يعمل بلا تأريض جيد: هو وتأريضك فريق واحد."],
  rcd: ["قاطع التسرب الأرضي RCD ‏30mA", "حارس الأرواح: يقارن تيار الذهاب بتيار العودة 200 مرة بالثانية؛ إن اختلفا بأكثر من 30mA (تسرب عبر جسم أو عزل تالف) يفصل خلال أجزاء من الثانية. زر TEST يختبره ذاتياً — اضغطه شهرياً في بيتك الحقيقي.", "جرّب: اضغط TEST الآن في اللوحة، أو فعّل سيناريو «تسرب في السخان»."],
  chov: ["مبدّل المصادر (Changeover)", "مفتاح 1-0-2 ينقل تغذية البيت بين الدولة والاشتراك، وبوضع ثالث لخط الإنفرتر في هذا التصميم التعليمي. قانونه الحديدي: يستحيل فيزيائياً جمع مصدرين معاً أبداً.", "في الواقع: الاشتراك والدولة بمبدّل، والإنفرتر غالباً بمبدّل آلي ATS خاص به — والفكرة واحدة."],
  inv: ["الإنفرتر والبطارية", "إنفرتر جيبي نقي 1600VA وبطارية 2400Wh يغذّيان «خط الأساسيات» فقط: إنارة وبراد واتصال. الأحمال الثقيلة غير موصولة عليهما بالتأسيس — لا بالمزاج.", "راقب نسبة البطارية وهي تنفد مع الأحمال وتُشحن عند عودة الدولة (زمن مسرّع هنا للتعليم)."],
  tank: ["خزان الماء والعوّامة", "المضخة تملأ الخزان، والعوّامة (مفتاح مستوى) تفصلها تلقائياً عند الامتلاء وتصلها عند النقص — راحة وحماية من الفيضان والتشغيل الجاف معاً.", "شغّل المضخة واتركها: ستتوقف وحدها عند ١٠٠٪."],
  panel: ["لوحة التوزيع", "قلب البيت وعقله: تستقبل المصدر، تمرّره على الحمايات بالترتيب، وتوزّعه على ١٢ دارة مستقلة. كل قاطع فيها مفتاح وقاطع حماية لدارته وحدها — جرّب فصل أي قاطع وراقب دارته فقط تموت."],
  wire: ["السلك", "انقر أي سلك ملوّن على المخطط لترى بطاقته الحية: مقطعه وقاطعه وطوله وتياره الآن وهبوط الجهد عليه."],
  switch: ["المفتاح الجداري", "يقطع الطور دائماً لا الحيادي. المفرد لمكان واحد، والديفاتير (زوج) لمكانين بسلكي تنقّل، والمنظّم للمروحة بخطوات سرعة. مفاتيح هذا البيت تعمل فعلاً — جرّبها من المخطط."],
  socket: ["المأخذ (المقبس)", "نقطة التغذية المتنقلة: 16A بغالق حماية أطفال في هذا البيت. انقر أي جهاز موصول بمأخذ لتشغيله/إطفائه — أي أنك تنزع/تركّب فيشته فعلياً."]
};

/* ---------- الحالة ---------- */
let F = {
  mainOn: true, mainTrip: false, rcdTrip: false, vprotOff: false,
  source: "d", gridDown: false, subTrip: false, invTrip: false,
  brk: {}, cTrip: {}, on: new Set(["fridge"]), fan: { fn1: 0, fn2: 0, fsal: 0 },
  gridV: 220, spikeT: 0, leak: false, kwh: 0, bat: 2400, tank: 35,
  mission: +(localStorage.getItem("hwf-mission") || 0), doneM: new Set(JSON.parse(localStorage.getItem("hwf-done") || "[]")),
  testedEarth: false, testedRcd: false, sawWires: new Set(), infoKey: "pole", started: Date.now()
};
for (let n = 1; n <= 12; n++) { F.brk[n] = true; F.cTrip[n] = false; }
const BATMAX = 2400;
const dev = id => FDEV.find(d => d.id === id);
function devW(d){ return d.kind === "fan" ? FAN_W[F.fan[d.id]] : d.w; }
function srcAvailable(){ return F.source === "d" ? !F.gridDown : F.source === "s" ? true : F.bat > 0 && !F.invTrip; }
function housePowered(){ return F.mainOn && !F.mainTrip && !F.rcdTrip && !F.vprotOff && srcAvailable() && !F.subTrip; }
function circuitPowered(n){ return housePowered() && F.brk[n] && !F.cTrip[n]; }
function devActive(d){ return F.on.has(d.id) && circuitPowered(d.c) && d.src.includes(F.source); }
function circuitAmps(n){ let w = 0; FDEV.forEach(d => { if (d.c === n && devActive(d)) w += devW(d); }); return w / 220; }
function circuitWatts(n){ return circuitAmps(n) * 220; }
function totalW(){ let t = 0; for (let n = 1; n <= 12; n++) t += circuitWatts(n); return t; }
function totalA(){ return totalW() / 220; }

/* ---------- بناء الواجهة ---------- */
const FROOMS = [
  { x: 60, y: 170, w: 290, h: 260, name: "غرفة نوم ١", c: "#fdf3e3" },
  { x: 60, y: 430, w: 290, h: 290, name: "غرفة نوم ٢", c: "#fdf3e3" },
  { x: 350, y: 170, w: 550, h: 290, name: "صالون", c: "#eef6ec" },
  { x: 350, y: 460, w: 80, h: 260, name: "ممر", c: "#f4f1ea" },
  { x: 430, y: 460, w: 180, h: 260, name: "حمّام", c: "#e8f3f8" },
  { x: 610, y: 460, w: 290, h: 260, name: "مطبخ", c: "#fdeeee" }
];
function fpathD(pts){ return "M" + pts.map(p => p.join(" ")).join(" L"); }
function buildFull(){
  const host = document.getElementById("view-full");
  const rooms = FROOMS.map(r => `<rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" fill="${r.c}" class="room"/><text x="${r.x + r.w / 2}" y="${r.y + 24}" class="room-t">${r.name}</text>`).join("");
  const wires = Object.keys(FPATHS).map(n => FPATHS[n].map(p => {
    const ww = FC[n].s * 2.8 + 3;
    return `<path d="${fpathD(p)}" class="fconduit" style="stroke-width:${(ww + 6.5).toFixed(1)}"/>
     <path d="${fpathD(p)}" class="fwire" data-wire="${n}" style="stroke:${FC[n].color};stroke-width:${ww.toFixed(1)}"/>
     <path d="${fpathD(p)}" class="fwire-hit" data-wire="${n}"/>`;
  }).join("")).join("");
  const devs = FDEV.map(d => `
    <g class="fdev" data-dev="${d.id}" transform="translate(${d.x},${d.y})">
      <circle class="halo" r="27"/><circle class="dev-bg" r="15.5"/>
      <text class="dev-icon" y="6">${d.icon}</text>
      <text class="dev-name" y="36">${d.name}</text>
      ${d.kind === "fan" ? `<g class="fan"><path d="M0 -10 L3.5 0 L0 10 L-3.5 0 Z M-10 0 L0 3.5 L10 0 L0 -3.5 Z"/></g>` : ""}
    </g>`).join("");
  const sws = FSW.map(s => `
    <g class="fsw" data-sw="${s.id}" transform="translate(${s.x},${s.y})">
      <rect x="-8" y="-12" width="16" height="24" rx="3" class="sw-box"/>
      <line x1="0" y1="6" x2="0" y2="-6" class="sw-lever"/>
      <text class="sw-reg" y="24">${s.reg ? "منظّم" : ""}</text>
    </g>`).join("");
  host.innerHTML = `
  <div class="card full-wrap">
    <h2>🏠 المحاكاة الشاملة — بيت سوري حيّ من العامود إلى آخر مأخذ</h2>
    <p class="full-sub">هذا هو التطبيق كله الآن: بيت واحد تتعلم منه كل شيء. انقر أي مكوّن (عامود، عداد، سلك، قاطع، مفتاح، مأخذ، مروحة…) لترى بطاقته التعليمية، وشغّل البيت من مفاتيحه الجدارية ولوحته الحقيقية. واتبع «المسار التعليمي» يميناً — يقودك من الصفر مهمةً مهمة.</p>
    <div class="full-main">
      <div class="full-plan">
        <div class="full-layers">
          <b>الطبقات:</b>
          <button class="chip active" data-layer="fWires">🧵 المواسير والأسلاك</button>
          <button class="chip active" data-layer="fDevsG">🔌 الأجهزة والمفاتيح</button>
          <span class="hint">الأسلاك هي الخطوط الملوّنة السميكة الخارجة من اللوحة وسط الممر إلى كل غرفة — انقر أيّاً منها لقراءة مقطعه وتياره وهبوط جهده.</span>
        </div>
        <svg viewBox="0 0 1240 800" class="full-svg" id="fSvg">
          <g data-info="pole" class="clickable">
            <line x1="1130" y1="250" x2="1130" y2="45" class="pole"/>
            <line x1="1075" y1="70" x2="1185" y2="70" class="pole"/>
            <rect x="1082" y="88" width="52" height="42" rx="8" class="xfmr"/><text x="1108" y="114" class="svg-t">محوّل</text>
            <path d="M1125 78 C 1030 110, 965 170, 928 232" class="drop-wire"/>
            <path d="M1125 92 C 1040 130, 975 185, 930 244" class="drop-wire"/>
            <text x="1130" y="275" class="svg-t big">العامود</text>
          </g>
          <g data-info="meter" class="clickable">
            <rect x="906" y="222" width="52" height="62" rx="6" class="meter-box"/>
            <text x="932" y="248" class="svg-t">⚡ عداد</text>
            <text x="932" y="268" class="svg-t" id="meterKwh">0.00</text>
            <text x="932" y="302" class="svg-t">عداد الشركة</text>
          </g>
          <g data-info="tank" class="clickable">
            <rect x="700" y="88" width="130" height="58" rx="9" class="tank-box"/>
            <rect id="fTankFill" x="704" y="140" width="122" height="3" rx="4" class="tank-fill"/>
            <text x="765" y="112" class="svg-t">🛢️ خزان السطح</text>
            <text x="765" y="132" class="svg-t" id="fTankPct">٣٥٪</text>
            <path d="M800 146 V452 H566 V676" class="pipe"/>
          </g>
          ${rooms}
          <rect x="60" y="170" width="840" height="550" class="outer-wall"/>
          <g id="fWires">${wires}</g>
          <path d="M36 742 H368 V498" class="earth-wire"/>
          <g data-info="earth" class="clickable">
            <path d="M36 742 l-9 22 h18 Z" class="earth-rod"/>
            <text x="36" y="788" class="svg-t">⏚ التأريض</text>
          </g>
          <g data-info="inv" class="clickable">
            <rect x="356" y="648" width="68" height="46" rx="7" class="inv-box"/>
            <text x="390" y="668" class="svg-t">🔋 إنفرتر</text>
            <text x="390" y="686" class="svg-t" id="invPct">100٪</text>
          </g>
          <g data-info="panel" class="clickable" transform="translate(390,475)">
            <rect x="-19" y="-22" width="38" height="44" rx="5" class="panel-box"/>
            <text y="5" class="panel-t">🎛️</text><text y="38" class="dev-name">اللوحة</text>
          </g>
          <g id="fDevsG">${devs}
          ${sws}</g>
          <g data-info="socket" class="clickable"><rect x="492" y="440" width="17" height="13" rx="2" class="sock"/><text x="500" y="432" class="sw-reg">مأخذ فارغ</text></g>
          <g data-info="socket" class="clickable"><rect x="82" y="292" width="17" height="13" rx="2" class="sock"/><text x="90" y="284" class="sw-reg">مأخذ فارغ</text></g>
        </svg>
        <div class="full-msg" id="fMsg">👋 أهلاً بك في بيتك التعليمي. ابدأ من «المسار التعليمي» يميناً، أو جرّب بحرية: المفاتيح الصغيرة بجانب الأبواب تشغّل الإنارة والمراوح فعلاً.</div>
        <div class="full-scen">
          <b>🎬 سيناريوهات واقعية:</b>
          <button class="chip" id="scSpike">⚡ ارتفاع جهد مفاجئ</button>
          <button class="chip" id="scLeak">💧 تسرب في السخان</button>
          <button class="chip" id="scCut">🔌 انقطاع كهرباء الدولة</button>
        </div>
      </div>
      <div class="full-side">
        <div class="panel-real" id="fPanel"></div>
        <div class="coach" id="fCoach"></div>
        <div class="meters2" id="fMeters"></div>
        <div class="infocard" id="fInfo"></div>
      </div>
    </div>
  </div>`;
  renderPanel(); renderMeters(); showInfo("pole"); renderCoach(); bindFull(); refreshFull();
}

/* ---------- اللوحة الحقيقية ---------- */
function renderPanel(){
  const p = document.getElementById("fPanel");
  const rows = Object.keys(FC).map(n => {
    const c = FC[n];
    return `<div class="prow ${F.cTrip[n] ? "tripped" : ""}" data-brk="${n}">
      <div class="pswitch ${F.brk[n] && !F.cTrip[n] ? "on" : ""}" data-act="brk" data-n="${n}"><span></span></div>
      <div class="pmid"><div class="pname" style="border-color:${c.color}">${n}. ${c.name}</div>
      <div class="pbar"><div id="bar${n}"></div></div></div>
      <div class="pamp"><b id="amp${n}">0.0A</b><small>قاطع ${c.brk}A · سلك ${c.s}مم²</small>
      ${F.cTrip[n] ? `<button class="mini-btn" data-act="resetC" data-n="${n}">إعادة</button>` : ""}</div>
    </div>`;
  }).join("");
  p.innerHTML = `
    <h4>🎛️ لوحة التوزيع — حقيقية ومباشرة</h4>
    <div class="prow main-row ${F.mainTrip ? "tripped" : ""}">
      <div class="pswitch big ${F.mainOn && !F.mainTrip ? "on" : ""}" data-act="main"><span></span></div>
      <div class="pmid"><div class="pname">القاطع الرئيسي 40A</div><small data-info="main" class="plink">ما هذا؟</small></div>
      <div class="pamp"><b id="ampMain">0.0A</b><small>${F.mainTrip ? "⚡ فاصل — انقر المفتاح لإعادة الرفع" : "إجمالي البيت"}</small></div>
    </div>
    <div class="prow">
      <div class="vprot-screen ${F.vprotOff ? "off" : ""}"><span id="pvV">${F.gridV}V</span><small>${F.vprotOff ? "فاصل — حماية" : "الجهد سليم"}</small></div>
      <div class="pmid"><div class="pname">قاطع حماية الجهد</div><small data-info="vprot" class="plink">ما هذا؟</small></div>
      <div class="pamp"><span class="lamp ${F.vprotOff ? "red" : "green"}"></span><small>SPD <span class="lamp green"></span> <span data-info="spd" class="plink">؟</span></small></div>
    </div>
    <div class="prow ${F.rcdTrip ? "tripped" : ""}">
      <div class="pswitch ${!F.rcdTrip ? "on" : ""}" data-act="rcd"><span></span></div>
      <div class="pmid"><div class="pname">قاطع التسرب RCD ‏30mA</div><small data-info="rcd" class="plink">ما هذا؟</small></div>
      <div class="pamp"><button class="mini-btn test" data-act="test">TEST</button>
      ${F.rcdTrip ? `<button class="mini-btn" data-act="resetRcd">إعادة</button>` : ""}<small>${F.rcdTrip ? "⚡ فاصل" : "يحرس"}</small></div>
    </div>
    <div class="prow">
      <div class="chov">
        <button data-act="src" data-s="d" class="${F.source === "d" ? "active" : ""}">دولة</button>
        <button data-act="src" data-s="s" class="${F.source === "s" ? "active" : ""}">اشتراك</button>
        <button data-act="src" data-s="i" class="${F.source === "i" ? "active" : ""}">إنفرتر</button>
      </div>
      <div class="pmid"><div class="pname">مبدّل المصادر</div><small data-info="chov" class="plink">ما هذا؟</small></div>
      <div class="pamp">${F.subTrip ? `<button class="mini-btn" data-act="resetSub">إعادة قاطع الاشتراك</button>` : F.invTrip ? `<button class="mini-btn" data-act="resetInv">إعادة الإنفرتر</button>` : `<small>مصدر واحد فقط دائماً</small>`}</div>
    </div>
    <div class="prows">${rows}</div>`;
}
function renderMeters(){
  const m = document.getElementById("fMeters");
  const cost = tariff(F.kwh);
  m.innerHTML = `<h4>📊 الطاقة والكلفة (تعليمية تقديرية)</h4>
    <div class="mrow"><span>المصدر</span><b id="mSrc">${SRC_NAME[F.source]}</b></div>
    <div class="mrow"><span>الحمل الكلي</span><b id="mLoad">0 W</b></div>
    <div class="mrow"><span>جهد الشبكة الآن</span><b id="mV">${F.gridV} V</b></div>
    <div class="mrow"><span>استهلاك الجلسة</span><b id="mKwh">${F.kwh.toFixed(3)} kWh</b></div>
    <div class="mrow"><span>كلفتها التقديرية</span><b id="mCost">${cost} ل.س</b></div>
    <div class="mrow"><span>البطارية</span><b id="mBat">100٪</b></div>
    <p class="hint">الزمن هنا مسرّع ×٦٠ للتعليم: دقيقة محاكاة كل ثانية. التعرفة شرائح تقديرية لتعلم الحساب لا فاتورة رسمية.</p>`;
}
function tariff(kwh){ // شرائح تعليمية: أول 50 بـ6، ثم 12، ثم 25 ل.س
  return Math.round(Math.min(kwh, 50) * 6 + Math.min(Math.max(kwh - 50, 0), 50) * 12 + Math.max(kwh - 100, 0) * 25);
}
function setMsg(t){ const m = document.getElementById("fMsg"); if (m) m.innerHTML = t; }

/* ---------- بطاقة المعلومات ---------- */
function showInfo(key){
  F.infoKey = key;
  const box = document.getElementById("fInfo");
  if (key.startsWith("wire")) {
    const n = +key.slice(4), c = FC[n], I = circuitAmps(n);
    const dropV = 2 * c.len * Math.max(I, 0.001) * 0.0175 / c.s, dropPct = (dropV / 220 * 100);
    const prospect = (() => { let w = 0; FDEV.forEach(d => { if (d.c === n && F.on.has(d.id) && d.src.includes(F.source)) w += devW(d); }); return w / 220; })();
    box.innerHTML = `<h4>🔌 سلك الدارة ${n} — ${c.name}</h4>
      <p>المقطع: <b>${c.s} مم²</b> نحاس · القاطع: <b>${c.brk}A</b> · طول المسار التقريبي: <b>${c.len}م</b></p>
      <p>التيار المارّ الآن: <b>${I.toFixed(1)}A</b> (وعند تشغيل كل أحماله الموصولة: ${prospect.toFixed(1)}A) — حدّه الآمن بقاطعه ${c.brk}A.</p>
      <p>هبوط الجهد على هذا السلك الآن: <b>${dropV.toFixed(1)}V ‏(${dropPct.toFixed(1)}٪)</b> ${dropPct <= 5 ? "— ضمن الحد المقبول (≤٥٪)." : "— تجاوز الحد! هكذا يُكتشف أن المقطع صغير على الحمل/المسافة."}</p>
      <p>القاعدة: القاطع ≤ ما يتحمله السلك، والمقطع يكبر مع الحمل والمسافة معاً.</p>`;
    F.sawWires.add(n); missionCheck(); return;
  }
  if (key.startsWith("dev:")) {
    const d = dev(key.slice(4)), I = devActive(d) ? devW(d) / 220 : 0;
    box.innerHTML = `<h4>${d.icon} ${d.name}</h4>
      <p>${d.kind === "light" ? "نقطة إنارة LED حديثة: كفاءة عالية وحرارة شبه معدومة مقارنة بلمبات الأمس." : d.kind === "fan" ? "مروحة سقفية بمنظّم خطوات: استهلاكها يتغير مع السرعة (20–75W) — لاحظ عدّاد دارتها وهي تصعد." : "جهاز موصول بمأخذ على دارته الخاصة أو المشتركة كما في بطاقته."}</p>
      <p>قدرته: <b>${d.kind === "fan" ? "حتى 75W حسب السرعة" : d.w + "W"}</b> · دارته: <b>${d.c} — ${FC[d.c].name}</b> (سلك ${FC[d.c].s}مم²، قاطع ${FC[d.c].brk}A) · يعمل الآن: <b>${devActive(d) ? "نعم، ويسحب " + I.toFixed(1) + "A" : "لا"}</b></p>
      <p>مصادره المسموحة بالتأسيس: <b>${d.src.split("").map(x => SRC_NAME[x]).join(" + ")}</b>${d.src !== "dsi" ? " — لاحظ أنه لا يعمل على كل المصادر، وهذا مقصود بالتصميم." : ""}</p>`;
    return;
  }
  const inf = FINFO[key] || FINFO.panel;
  box.innerHTML = `<h4>${inf[0]}</h4><p>${inf[1]}</p>${inf[2] ? `<p class="info-try">👉 ${inf[2]}</p>` : ""}`;
}

/* ---------- المهام التعليمية من الصفر ---------- */
F.flags = {}; F.mSnap = { kwh: 0 }; F.sawInfo = new Set(["pole"]);
const MISSIONS = [
  { t: "القاطع الرئيسي — مفتاح بيتك الأول", e: "قبل أي عمل كهربائي في أي بيت: القاطع الرئيسي في اللوحة يمينك. هو أول ما تلمسه وآخر ما تعيده.", task: "افصل القاطع الرئيسي من اللوحة، ثم أعد تشغيله", check: () => F.flags.mainCycled },
  { t: "من العامود إلى العداد", e: "انظر أعلى يمين المخطط: المحوّل على العامود، وكابل الدخول ينزل إلى عداد الشركة على جدار البيت. العداد يعدّ ما تستهلكه فعلاً فقط.", task: "شغّل أي جهاز واتركه حتى يزيد عدّاد العداد بمقدار 0.01 kWh", check: () => F.kwh - F.mSnap.kwh >= 0.01 },
  { t: "التأريض — حمايتك الصامتة", e: "أسفل يسار المخطط: قضيب التأريض وسلكه الأخضر صاعداً إلى اللوحة. بدونه نصف حمايات البيت وهمية.", task: "انقر قضيب التأريض لفتح بطاقته، ثم اضغط زر قياس المقاومة في بطاقة المهمة", act: "📏 قِس مقاومة التأريض", check: () => F.testedEarth },
  { t: "جولة في اللوحة: الحمايات الثلاث", e: "في اللوحة ثلاثة حراس قبل القواطع: حماية الجهد، مانع الاندفاع SPD، وقاطع التسرب. افتح بطاقة كلٍّ منهم من روابط «ما هذا؟» في اللوحة.", task: "افتح بطاقات: حماية الجهد + SPD + قاطع التسرب", check: () => ["vprot", "spd", "rcd"].every(k => F.sawInfo.has(k)) },
  { t: "زر TEST — اختبر حارس الأرواح بنفسك", e: "قاطع التسرب يُختبر بزر TEST فيفصل فوراً كأنه كشف تسرباً حقيقياً. في بيتك الحقيقي: شهرياً.", task: "اضغط TEST في اللوحة، ثم أعد قاطع التسرب من زر «إعادة»", check: () => F.flags.rcdTested && F.flags.rcdReset },
  { t: "الأسلاك: مقاطع وتيارات وهبوط جهد", e: "كل سلك ملوّن على المخطط يحمل بطاقة حية: مقطعه وقاطعه وتياره الآن وهبوط الجهد عليه. الأسلاك الرفيعة للإنارة والسميكة للأحمال — قارن بنفسك.", task: "انقر ٣ أسلاك مختلفة واقرأ بطاقاتها", check: () => F.sawWires.size >= 3 },
  { t: "المفتاح المفرد — المفتاح يقطع الطور", e: "بجانب باب غرفة نوم ١ مفتاح صغير. جرّبه: هو من يشغّل الإنارة ويطفئها، لا النقر على اللمبة نفسها — كما في البيت الحقيقي.", task: "شغّل إنارة نوم ١ من مفتاحها الجداري ثم أطفئها منه", check: () => F.flags.ln1Lit && F.flags.ln1Off },
  { t: "الديفاتير — تحكم من مكانين", e: "إنارة الصالون لها مفتاحان: عند الباب وعند الطرف الثاني. كلٌّ منهما يقلب حالة المصباح مهما كان وضع الآخر — بسلكي تنقّل بينهما.", task: "شغّل إنارة الصالون من أحد الديفاتيرين وأطفئها من الآخر", check: () => F.flags.lsalA && F.flags.lsalB },
  { t: "المروحة والمنظّم", e: "مراوح السقف بمنظّمات خطوات بجانب مفاتيح الإنارة: كل خطوة سرعة واستهلاك مختلف (20/40/60/75W) — راقب تيار الدارة وهو يتغير.", task: "شغّل مروحة الصالون وارفعها إلى السرعة ٣ من منظّمها", check: () => F.fan.fsal === 3 },
  { t: "المقابس والأجهزة", e: "الأجهزة تُشغَّل من فيشها في المأخذ (انقر الجهاز نفسه). بعضها على دارات مستقلة وبعضها يتشارك دارة مآخذ — لاحظ بطاقة كل جهاز.", task: "شغّل ٣ أجهزة مقبس مختلفة في وقت واحد", check: () => FDEV.filter(d => d.kind === "plug" && devActive(d)).length >= 3 },
  { t: "حملّ دارة حتى يفصل قاطعها وحدها", e: "دارة مآخذ النوم (٣) قاطعها 16A. المدفأة 2400W + المكواة 1100W + الشواحن 200W = 16.8A — أكثر من حدّها بقليل. جرّب ولاحظ: دارة واحدة تموت والبيت كله حيّ.", task: "اجعل قاطع الدارة ٣ يفصل وحده، ثم خفّف الحمل وأعده من اللوحة", check: () => F.flags.cTrip3 && F.flags.cReset3 },
  { t: "الحمل الزائد على الرئيسي", e: "الآن العب بالنار حسابياً: على كهرباء الدولة، اجمع أحمالاً ثقيلة (فرن + سخان + مكيفان + غلاية…) حتى تتجاوز 40A. الرئيسي سيفصل حمايةً للبيت كله.", task: "اجعل الرئيسي يفصل بالحمل الزائد، ثم خفّف وأعد رفعه", check: () => F.flags.mainTrippedOnce && F.flags.mainResetOk },
  { t: "خط الاشتراك — حياة بـ10 أمبير", e: "بدّل مبدّل المصادر إلى «اشتراك». الدارات الثقيلة غير موصولة عليه بالتأسيس أصلاً (الفرن لن يعمل مهما حاولت)، والخفيفة تعمل ضمن 10A فقط.", task: "على الاشتراك: شغّل إنارة + البراد + التلفاز معاً، وحاول تشغيل الفرن", check: () => F.source === "s" && F.flags.ovenDenied && ["lsal", "fridge", "tv"].some(id => devActive(dev(id))) && devActive(dev("fridge")) },
  { t: "الإنفرتر والبطارية — إدارة الطاقة", e: "بدّل إلى «إنفرتر»: خط الأساسيات فقط، والبطارية تنفد مع كل واط. أنزلها تحت ٦٠٪ ثم عد إلى الدولة وراقبها تُشحن من جديد.", task: "أنزل البطارية تحت ٦٠٪ على الإنفرتر، ثم اشحنها فوق ٨٠٪ على الدولة", check: () => F.flags.batLow && F.source === "d" && F.bat / BATMAX > 0.8 },
  { t: "تشخيص عطل: تسرب في السخان", e: "فعّل سيناريو «تسرب في السخان» (أسفل المخطط) ثم شغّل السخان: قاطع التسرب سيفصل فوراً. التشخيص الصحيح: اعزل المتهم (أطفئ السخان) ثم أعد القاطع — لا تلغِ الحماية أبداً.", task: "اجعل التسرب يفصل القاطع، أطفئ السخان، أعد القاطع، وتأكد أن البيت عاد بدونه", check: () => F.flags.leakTripSeen && F.flags.leakDiagnosed && housePowered() && !F.on.has("heater") },
  { t: "المضخة والعوّامة", e: "شغّل مضخة الخزان وراقب مستوى الماء يصعد… واتركها تعمل: العوّامة ستفصلها وحدها عند الامتلاء. صعود السطح اليومي صار تاريخاً.", task: "شغّل المضخة حتى تفصلها العوّامة عند ١٠٠٪", check: () => F.flags.floatStopped },
  { t: "الطاقة والكلفة — فاتورتك تُبنى الآن", e: "العداد لا يرحم ولا يجامل: كل واط يعمل يتراكم كيلوواط/ساعة وكلفة. راقب قسم «الطاقة والكلفة» وأنت تشغّل الأحمال الثقيلة.", task: "اجمع 1 kWh استهلاكاً إضافياً من الآن", check: () => F.kwh - F.mSnap.kwh >= 1 }
];
function renderCoach(){
  const c = document.getElementById("fCoach"); if (!c) return;
  const idx = MISSIONS.findIndex((m, i) => !F.doneM.has(i));
  const total = MISSIONS.length, done = F.doneM.size;
  if (idx === -1) {
    c.innerHTML = `<h4>🎓 المسار التعليمي — اكتمل!</h4>
      <p>أنهيت المهام الـ${total} كلها داخل البيت الحي: من العامود والعداد والتأريض واللوحة، إلى الأسلاك والمفاتيح والديفاتير والمراوح، والفصل الفردي والرئيسي، والاشتراك والإنفرتر، وتشخيص التسرب والطاقة. هذا هو التمديد المنزلي كاملاً — مارسه هنا بحرية متى شئت.</p>
      <button class="mini-btn" data-act="restartMissions">↺ إعادة المسار من الصفر</button>`;
    return;
  }
  F.mission = idx; const m = MISSIONS[idx];
  if (!F.mSnap || F.mSnap.forMission !== idx) F.mSnap = { kwh: F.kwh, forMission: idx };
  c.innerHTML = `<h4>🎓 المسار التعليمي من الصفر — مهمة ${idx + 1} من ${total} (أنجزت ${done})</h4>
    <div class="coach-cur"><b>${m.t}</b><p>${m.e}</p>
    <div class="coach-task">🎯 ${m.task}</div>
    ${m.act ? `<button class="btn coach-act" data-act="missionAct">${m.act}</button>` : ""}
    <button class="mini-btn" data-act="skipMission">تخطّي هذه المهمة ←</button></div>
    <div class="coach-done">${[...F.doneM].sort((a, b) => a - b).map(i => `<span>✔ ${MISSIONS[i].t}</span>`).join("")}</div>`;
}
function missionCheck(){
  const idx = MISSIONS.findIndex((m, i) => !F.doneM.has(i));
  if (idx === -1) return;
  let ok = false;
  try { ok = MISSIONS[idx].check(); } catch (e) { ok = false; }
  if (ok) {
    F.doneM.add(idx); F.flags = {};
    localStorage.setItem("hwf-done", JSON.stringify([...F.doneM]));
    setMsg(`⭐ <b>مهمة منجزة: ${MISSIONS[idx].t}</b> — انتقل إلى المهمة التالية في «المسار التعليمي» يميناً.`);
    renderCoach();
  }
}

/* ---------- الإجراءات ---------- */
function msg(t){ setMsg(t); }
function toggleSwitch(sw){
  const d = dev(sw.dev);
  showInfo("switch");
  if (d.kind === "fan") {
    F.fan[d.id] = (F.fan[d.id] + 1) % 4;
    if (F.fan[d.id] > 0) F.on.add(d.id); else F.on.delete(d.id);
    msg(F.fan[d.id] ? `🌀 منظّم ${d.name}: السرعة ${F.fan[d.id]} (${FAN_W[F.fan[d.id]]}W)${circuitPowered(d.c) ? "" : " — لكن لا تغذية على دارتها الآن، فالمروحة واقفة رغم المنظّم."}` : `أطفأت ${d.name} من منظّمها.`);
  } else {
    const nowOn = !F.on.has(d.id);
    nowOn ? F.on.add(d.id) : F.on.delete(d.id);
    if (d.id === "ln1") { if (nowOn && circuitPowered(1)) F.flags.ln1Lit = true; if (!nowOn && F.flags.ln1Lit) F.flags.ln1Off = true; }
    if (d.id === "lsal") { if (sw.id === "sw5") F.flags.lsalA = true; if (sw.id === "sw6") F.flags.lsalB = true; }
    msg(nowOn ? `🔆 شغّلت «${d.name}» من ${sw.label}${devActive(d) ? "" : " — المفتاح وصل، لكن لا تغذية تصل الدارة الآن (راجع اللوحة/المصدر)."}` : `أطفأت «${d.name}» من ${sw.label}.`);
  }
  afterAction();
}
function toggleDev(d){
  if (d.kind === "light" || d.kind === "fan") {
    showInfo("dev:" + d.id);
    const sw = FSW.find(s => s.dev === d.id);
    msg(`💡 «${d.name}» تُشغَّل من مفتاحها الجداري${d.id === "lsal" ? " — ولها مفتاحان (ديفاتير)" : ""}${sw ? ` — ابحث عن المفتاح الصغير بجانب الباب` : ""}. انقر المفتاح لا اللمبة، كما في البيت الحقيقي.`);
    document.querySelectorAll(`[data-sw]`).forEach(g => { if (FSW.find(s => s.id === g.dataset.sw)?.dev === d.id) { g.classList.add("pulse"); setTimeout(() => g.classList.remove("pulse"), 1600); } });
    return;
  }
  if (!F.on.has(d.id) && !d.src.includes(F.source)) {
    if (d.id === "oven") F.flags.ovenDenied = true;
    msg(`🚫 «${d.name}» غير موصولة على ${SRC_NAME[F.source]} بالتأسيس — لن تعمل مهما حاولت. هكذا تُبنى خطوط الاشتراك والإنفرتر: بالفصل المادي لا بالوعود.`);
    showInfo("dev:" + d.id); return;
  }
  F.on.has(d.id) ? F.on.delete(d.id) : F.on.add(d.id);
  showInfo("dev:" + d.id);
  msg(F.on.has(d.id) ? `🔌 وصّلت «${d.name}» (${devW(d)}W)${devActive(d) ? " — تعمل الآن." : " — لكن دارتها بلا تغذية حالياً."}` : `فصلت «${d.name}».`);
  afterAction();
}
function prospectA(n){ let w = 0; FDEV.forEach(d => { if (d.c === n && F.on.has(d.id) && d.src.includes(F.source)) w += devW(d); }); return w / 220; }
function prospectTotalA(){ let t = 0; for (let n = 1; n <= 12; n++) if (F.brk[n]) t += prospectA(n); return t; }
function fedChain(){ return F.mainOn && !F.mainTrip && !F.rcdTrip && !F.vprotOff && srcAvailable() && !(F.source === "s" && F.subTrip) && !(F.source === "i" && F.invTrip); }
function evaluate(){
  // فصل دارة منفردة
  for (let n = 1; n <= 12; n++) {
    if (!F.cTrip[n] && fedChain() && F.brk[n] && prospectA(n) > FC[n].brk) {
      F.cTrip[n] = true; if (n === 3) F.flags.cTrip3 = true;
      msg(`⚡ فصل قاطع الدارة ${n} (${FC[n].name}) وحده: تيارها ${prospectA(n).toFixed(1)}A تجاوز قاطعها ${FC[n].brk}A. بقية البيت حيّة — هذا هو جمال فصل الدارات. خفّف حملها ثم أعد قاطعها.`);
    }
  }
  // فصل المصدر/الرئيسي
  const tot = prospectTotalA();
  if (fedChain() && tot > SRC_LIMIT[F.source]) {
    if (F.source === "d") { F.mainTrip = true; F.flags.mainTrippedOnce = true; msg(`⚡⚡ فصل القاطع الرئيسي! الحمل ${tot.toFixed(1)}A تجاوز 40A. فصلٌ يحمي كابل البيت كله. خفّف الأحمال ثم أعد رفعه من اللوحة.`); }
    if (F.source === "s") { F.subTrip = true; msg(`⚡ فصل قاطع خط الاشتراك: الحمل ${tot.toFixed(1)}A تجاوز 10A. صاحب المولدة يشكر القاطع الذي حمى بقية المشتركين منك. خفّف ثم أعد من اللوحة.`); }
    if (F.source === "i") { F.invTrip = true; msg(`⚡ أطفأ الإنفرتر نفسه: الحمل ${tot.toFixed(1)}A تجاوز قدرته (≈1300W). خفّف إلى الأساسيات ثم أعد تشغيله من اللوحة.`); }
  }
  // التسرب
  if (!F.rcdTrip && F.leak && devActive(dev("heater"))) {
    F.rcdTrip = true; F.flags.leakTripSeen = true;
    msg(`💧⚡ <b>تسرب!</b> قاطع التسرب فصل البيت كله خلال أجزاء من الثانية: سخان الماء يسرّب تياراً إلى الأرض/الماء. لا تعده قبل عزل المتهم: أطفئ السخان أولاً.`);
  }
}
function afterAction(){ evaluate(); refreshFull(); missionCheck(); }

/* ---------- تحديث المشهد ---------- */
function refreshFull(){
  document.querySelectorAll("#fSvg .fdev").forEach(g => {
    const d = dev(g.dataset.dev), act = devActive(d);
    g.classList.toggle("on", act);
    const fan = g.querySelector(".fan");
    if (fan) fan.style.animationDuration = act ? (1.7 - F.fan[d.id] * 0.4) + "s" : "0s";
  });
  document.querySelectorAll("#fSvg .fsw").forEach(g => {
    const sw = FSW.find(s => s.id === g.dataset.sw);
    const onState = sw.reg ? F.fan[sw.dev] > 0 : F.on.has(sw.dev);
    g.classList.toggle("on", onState);
  });
  document.querySelectorAll("#fSvg .fwire").forEach(p => {
    const n = +p.dataset.wire, I = circuitAmps(n), live = circuitPowered(n) && I > 0.05;
    p.classList.toggle("flow", live);
    p.style.animationDuration = live ? Math.max(0.45, 2.4 - I * 0.22) + "s" : "";
  });
  renderPanel();
  Object.keys(FC).forEach(n => {
    const a = document.getElementById("amp" + n), b = document.getElementById("bar" + n);
    if (a) a.textContent = circuitAmps(n).toFixed(1) + "A";
    if (b) { const r = circuitAmps(n) / FC[n].brk; b.style.width = Math.min(100, r * 100) + "%"; b.style.background = r > 0.85 ? "#dc2626" : r > 0.6 ? "#f59e0b" : "#16a34a"; }
  });
  const am = document.getElementById("ampMain"); if (am) am.textContent = totalA().toFixed(1) + "A";
  const ml = document.getElementById("mLoad"); if (ml) ml.textContent = `${Math.round(totalW())} W ‏(${totalA().toFixed(1)}A)`;
  const tf = document.getElementById("fTankFill");
  if (tf) { tf.setAttribute("height", (F.tank / 100 * 50).toFixed(1)); tf.setAttribute("y", (142 - F.tank / 100 * 50).toFixed(1)); }
  const tp = document.getElementById("fTankPct"); if (tp) tp.textContent = Math.round(F.tank) + "٪";
}

/* ---------- الربط ---------- */
function bindFull(){
  document.querySelectorAll("#view-full [data-layer]").forEach(btn => btn.addEventListener("click", () => {
    const g = document.getElementById(btn.dataset.layer); if (!g) return;
    const hide = g.style.display !== "none";
    g.style.display = hide ? "none" : "";
    btn.classList.toggle("active", !hide);
  }));
  const svg = document.getElementById("fSvg");
  svg.addEventListener("click", e => {
    const swG = e.target.closest("[data-sw]"); if (swG) { toggleSwitch(FSW.find(s => s.id === swG.dataset.sw)); return; }
    const dv = e.target.closest("[data-dev]"); if (dv) { toggleDev(dev(dv.dataset.dev)); return; }
    const wr = e.target.closest("[data-wire]"); if (wr) { showInfo("wire" + wr.dataset.wire); return; }
    const inf = e.target.closest("[data-info]"); if (inf) { showInfo(inf.dataset.info); F.sawInfo.add(inf.dataset.info); missionCheck(); }
  });
  document.getElementById("fPanel").addEventListener("click", e => {
    const pl = e.target.closest("[data-info]"); if (pl) { showInfo(pl.dataset.info); F.sawInfo.add(pl.dataset.info); missionCheck(); return; }
    const el = e.target.closest("[data-act]"); if (!el) return;
    const act = el.dataset.act, n = +el.dataset.n || 0;
    if (act === "main") {
      if (F.mainTrip) {
        if (prospectTotalA() > SRC_LIMIT.d) msg("🔁 أعدتَ رفعه لكن الحمل ما زال فوق 40A — سيفصل فوراً. خفّف أولاً ثم ارفع.");
        else { F.mainTrip = false; F.mainOn = true; if (F.flags.mainTrippedOnce) F.flags.mainResetOk = true; msg("✔ رفعت الرئيسي بعد تخفيف الحمل — عاد البيت. هكذا يُعاد القاطع: سببٌ أُزيل لا تجاهلٌ للرسالة."); }
      } else { F.mainOn = !F.mainOn; if (!F.mainOn) F.flags.mainOff = true; if (F.mainOn && F.flags.mainOff) F.flags.mainCycled = true; msg(F.mainOn ? "الرئيسي يعمل — البيت مغذّى." : "✂️ فصلت الرئيسي: البيت كله ميت الآن مهما كان المصدر. هذه هي نقطة البداية الآمنة لأي عمل."); }
    }
    if (act === "brk") {
      if (F.cTrip[n]) { resetCircuit(n); }
      else { F.brk[n] = !F.brk[n]; msg(F.brk[n] ? `قاطع الدارة ${n} يعمل.` : `فصلت قاطع الدارة ${n} يدوياً — دارتها فقط ميتة، وبقية البيت حيّة.`); }
    }
    if (act === "resetC") resetCircuit(n);
    if (act === "test") { F.rcdTrip = true; F.flags.rcdTested = true; F.testedRcd = true; msg("🔴 TEST ناجح: فصل قاطع التسرب فوراً كما يجب. حارسك صاحٍ — أعد تشغيله من زر «إعادة»."); }
    if (act === "rcd" || act === "resetRcd") {
      if (F.rcdTrip) {
        if (F.leak && F.on.has("heater")) msg("🔁 أعدته والسخان المسرّب ما زال موصولاً — سيفصل فوراً عند أي محاولة تشغيل. اعزل المتهم أولاً (أطفئ السخان) ثم أعد.");
        else { F.rcdTrip = false; if (F.flags.rcdTested) F.flags.rcdReset = true; if (F.flags.leakTripSeen && !F.on.has("heater")) F.flags.leakDiagnosed = true; msg("✔ أعدت قاطع التسرب — الحارس عاد إلى عمله."); }
      } else { F.rcdTrip = true; msg("فصلت قاطع التسرب يدوياً — البيت بلا حماية تسرب وبلا تغذية. لا تتركه هكذا."); }
    }
    if (act === "src") {
      F.source = el.dataset.s;
      const dropped = FDEV.filter(d => F.on.has(d.id) && !d.src.includes(F.source)).map(d => d.name);
      msg(`🔄 بدّلت المصدر إلى <b>${SRC_NAME[F.source]}</b> عبر مبدّل لا يجمع مصدرين أبداً.${dropped.length ? ` هذه الدارات غير موصولة عليه وبقيت ميتة: ${dropped.join("، ")}.` : ""}${F.source === "d" && F.gridDown ? " ⚠️ لكن كهرباء الدولة مقطوعة أصلاً (السيناريو مفعّل) — لا تغذية حتى تعود أو تبدّل." : ""}`);
      showInfo("chov");
    }
    if (act === "resetSub") { if (prospectTotalA() > SRC_LIMIT.s) msg("ما زال الحمل فوق 10A — خفّف ثم أعد."); else { F.subTrip = false; msg("✔ أعدت قاطع الاشتراك."); } }
    if (act === "resetInv") { if (prospectTotalA() > SRC_LIMIT.i) msg("ما زال الحمل فوق قدرة الإنفرتر — خفّف إلى الأساسيات ثم أعد."); else { F.invTrip = false; msg("✔ أعدت تشغيل الإنفرتر."); } }
    afterAction();
  });
  document.getElementById("fCoach").addEventListener("click", e => {
    const el = e.target.closest("[data-act]"); if (!el) return;
    if (el.dataset.act === "missionAct") {
      F.testedEarth = true;
      msg("📏 نتيجة القياس بجهاز الأرضي: <b>6Ω</b> — ممتاز، أقل من حدّ الـ10Ω. حفرة هذا البيت تربة رطبة وقضيبها ٢م. في بيتك: قِس ولا تخمّن.");
      showInfo("earth"); missionCheck();
    }
    if (el.dataset.act === "skipMission") {
      const idx = MISSIONS.findIndex((m, i) => !F.doneM.has(i));
      if (idx >= 0) { F.doneM.add(idx); F.flags = {}; localStorage.setItem("hwf-done", JSON.stringify([...F.doneM])); renderCoach(); }
    }
    if (el.dataset.act === "restartMissions") {
      F.doneM.clear(); F.flags = {}; localStorage.setItem("hwf-done", "[]"); renderCoach(); msg("↺ أعدنا المسار التعليمي من الصفر — بالتوفيق من جديد.");
    }
  });
  document.getElementById("scSpike").addEventListener("click", () => {
    if (F.spikeT > 0) return;
    F.spikeT = 5; msg("⚡⚡ حدث شبكة: الجهد يقفز الآن إلى 285V لثوانٍ! راقب قاطع حماية الجهد في اللوحة وهو يفصل البيت لحماية أجهزتك، ثم يعيد بعد الاستقرار والتأخير.");
  });
  document.getElementById("scLeak").addEventListener("click", e => {
    F.leak = !F.leak; e.target.classList.toggle("active", F.leak);
    msg(F.leak ? "💧 تم حقن عطل تسرب خفي في سخان الماء (محاكاة). شغّل السخان لترى حارس التسرب يعمل." : "أُصلح عطل التسرب (استُبدل السخان) — يمكنك إعادة قاطع التسرب بأمان.");
    afterAction();
  });
  document.getElementById("scCut").addEventListener("click", e => {
    F.gridDown = !F.gridDown; e.target.classList.toggle("active", F.gridDown);
    msg(F.gridDown ? "🔌 انقطعت كهرباء الدولة عن الحي (محاكاة). إن كنت عليها فبيتك مظلم — بدّل بالمبدّل إلى الاشتراك أو الإنفرتر كما في حياتنا اليومية." : "↩️ عادت كهرباء الدولة إلى الحي.");
    afterAction();
  });
}
function resetCircuit(n){
  if (prospectA(n) > FC[n].brk) { msg(`🔁 دارة ${n} ما زالت فوق حدّها (${prospectA(n).toFixed(1)}A > ${FC[n].brk}A) — خفّف حملها أولاً ثم أعد.`); return; }
  F.cTrip[n] = false; F.brk[n] = true; if (n === 3) F.flags.cReset3 = true;
  msg(`✔ أعدت قاطع الدارة ${n} بعد تخفيف حملها — عادت دارتها وحدها.`);
}

/* ---------- نبضة الزمن (ثانية = دقيقة محاكاة) ---------- */
let spikeCool = 0;
setInterval(() => {
  if (F.spikeT > 0) { F.spikeT--; F.gridV = 285; if (F.spikeT === 0) { spikeCool = 3; msg("الجهد عاد طبيعياً… قاطع الحماية ينتظر تأخيره الآمن قبل إعادة الوصل (حماية للضواغط)."); } }
  else if (spikeCool > 0) { spikeCool--; F.gridV = 220; }
  else if (F.gridDown) F.gridV = 0;
  else F.gridV = Math.max(197, Math.min(243, F.gridV + Math.round((Math.random() - 0.5) * 7)));
  F.vprotOff = F.spikeT > 0 || spikeCool > 0;
  // البطارية
  if (F.source === "i" && housePowered()) { F.bat = Math.max(0, F.bat - totalW() / 60); if (F.bat / BATMAX < 0.6) F.flags.batLow = true; if (F.bat === 0) msg("🪫 فرغت البطارية وأوقف الإنفرتر نفسه حمايةً لها. بدّل إلى الدولة للشحن."); }
  if (F.source === "d" && !F.gridDown && F.bat < BATMAX) F.bat = Math.min(BATMAX, F.bat + 40);
  // الطاقة
  F.kwh += totalW() / 60000;
  // الخزان
  if (devActive(dev("pump")) && F.tank < 100) {
    F.tank = Math.min(100, F.tank + 2);
    if (F.tank >= 100) { F.on.delete("pump"); F.flags.floatStopped = true; msg("💧 امتلأ الخزان — العوّامة فصلت المضخة وحدها. راقب مستوى الماء الأزرق أعلى المخطط."); afterAction(); }
  }
  // نصوص حية فقط (بلا إعادة بناء)
  const pv = document.getElementById("pvV"); if (pv) { pv.textContent = F.gridV + "V"; pv.parentElement.classList.toggle("off", F.vprotOff); pv.nextElementSibling.textContent = F.vprotOff ? "فاصل — حماية" : "الجهد سليم"; }
  const mv = document.getElementById("mV"); if (mv) mv.textContent = F.gridV + " V";
  const mk = document.getElementById("mKwh"); if (mk) mk.textContent = F.kwh.toFixed(3) + " kWh";
  const mc = document.getElementById("mCost"); if (mc) mc.textContent = tariff(F.kwh) + " ل.س";
  const mb = document.getElementById("mBat"); if (mb) mb.textContent = Math.round(F.bat / BATMAX * 100) + "٪";
  const ip = document.getElementById("invPct"); if (ip) ip.textContent = Math.round(F.bat / BATMAX * 100) + "٪";
  const mtr = document.getElementById("meterKwh"); if (mtr) mtr.textContent = F.kwh.toFixed(2);
  refreshFull();
  missionCheck();
}, 1000);

buildFull();

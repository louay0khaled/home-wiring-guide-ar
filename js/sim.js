/* ============================================================
   المحاكاة التطبيقية الكاملة — مشروع شقة سورية ٩٠م² من الصفر
   ١٠ مراحل متسلسلة: تنفتح كل مرحلة بعد نجاح التي قبلها،
   ولكل مرحلة مهمة تفاعلية (اختيار/ترتيب/توصيل/تحديد) ونتيجة.
   التوصيل: انقر نقطتين لوصلهما بسلك — الوصلات الصحيحة تُرسم.
   ============================================================ */
"use strict";

const SIM_STAGES = [
{ id: "plan", icon: "📐", title: "المرحلة ١ — المخطط وتقسيم الدارات",
  scene: "استلمت شقة ٩٠م² على العظم: غرفتا نوم، صالون، مطبخ، حمام. صاحبها يريد كهرباء عملية واقتصادية وخط اشتراك لاحقاً. أول عمل على الورق قبل أي حفر.",
  type: "choice",
  q: "أي تقسيم دارات هو الصحيح لهذه الشقة؟",
  options: [
    "قاطعان كبيران فقط: واحد لكل الإنارة والمآخذ معاً وآخر لباقي البيت — أرخص",
    "دارات منفصلة بالوظيفة: إنارة، مآخذ غرف، مآخذ مطبخ ×٢، فرن، سخان، غسالة، وكل مكيف وحده — مع دارات خفيفة مخصصة لخط الاشتراك",
    "دارة واحدة لكل نقطة في البيت مهما صغُرت — أدقّ شيء ممكن"],
  correct: 1,
  explain: "الفصل بالوظيفة هو التوازن الصحيح: عطلٌ لا يطفئ البيت، وتشخيص سريع، وخط اشتراك يغذي الدارات الخفيفة فقط. قاطعان كبيران يعنيان أعطالاً معمّمة، ودارة لكل نقطة ترفٌ بلا فائدة." },

{ id: "earth", icon: "⏚", title: "المرحلة ٢ — تنفيذ حفرة التأريض",
  scene: "قبل أي تمديد داخلي، ننفّذ تأريض البناء. رتّب خطوات العمل بالنقر عليها بالترتيب الصحيح.",
  type: "order",
  items: [
    "اختيار بقعة تربة رطبة بعيدة عن الأساسات والتمديدات الصحية",
    "غرس قضيب النحاس ١٫٥–٢٫٤م حتى لا يبقى منه إلا طرف الربط",
    "ربط سلك التأريض الرئيسي بالمشبك البرونزي المحكم",
    "تركيب علبة فحص عند نقطة الربط لحمايته وإتاحة قياسه لاحقاً",
    "قياس/توثيق المقاومة (الهدف أقل من ١٠ أوم) ومدّ السلك الرئيسي إلى لوحة الشقة"],
  explain: "التأريض يُبنى من الأرض إلى اللوحة بهذا الترتيب، والقياس والتوثيق جزء من العمل لا رفاهية: كل حمايات البيت (تسرب وSPD) تقف على هذه الحفرة." },

{ id: "meter", icon: "🏗️", title: "المرحلة ٣ — كابل الدخول والعداد",
  scene: "حان وصل البيت بكهرباء الدولة. العداد عند مدخل البناء واللوحة داخل الشقة على مسافة ١٨ متراً، والحمل المتزامن المحسوب ≈ ٣٣ أمبير.",
  type: "choice",
  q: "ما الإجراء الصحيح؟",
  options: [
    "أفتح علبة العداد المختومة بنفسي وأوصل منها مباشرة — أسرع",
    "الربط عند العداد يتم عبر شركة الكهرباء/فني مؤهل، وأمدّ أنا كابل ١٠مم² من بعد العداد إلى اللوحة بقاطع رئيسي 40A",
    "أمدّ كابل ٢٫٥مم² مؤقتاً الآن وأكبّره لاحقاً عند الحاجة"],
  correct: 1,
  explain: "ختم العداد خط أحمر قانوني وخطير. عملك يبدأ من بعد العداد: كابل رئيسي محسوب (١٠مم² لهذا الحمل والمسافة) وقاطع رئيسي مطابق — لا مؤقتات رفيعة تحت أحمال بيت كامل." },

{ id: "panel", icon: "🎛️", title: "المرحلة ٤ — تجميع لوحة التوزيع",
  scene: "وصلت مكونات اللوحة الحديثة. ركّب سلسلة الحماية بالنقر على المكونات بترتيب مرور الكهرباء الصحيح من المدخل إلى الدارات.",
  type: "order",
  items: [
    "القاطع الرئيسي الثنائي 40A",
    "قاطع حماية الجهد القابل للضبط",
    "مانع اندفاع الجهد SPD إلى بار الأرضي",
    "قاطع التسرب الرئيسي 30mA نوع A",
    "قواطع الدارات MCB/RCBO لكل دارة"],
  explain: "الترتيب: حمايات عامة عند المدخل أولاً (فصل عام، حماية جهد، امتصاص اندفاع)، ثم حماية التسرب، ثم قواطع الدارات. أي خلط يجعل جهازاً يحمي آخر بطريقة خاطئة أو لا يحمي شيئاً." },

{ id: "conduit", icon: "🧱", title: "المرحلة ٥ — التأسيس والمواسير",
  scene: "الجدران جاهزة للتعليم والحفر قبل اللياسة. أحد المسارات المقترحة على المخطط يمرّ مائلاً اختصاراً بين علبتين.",
  type: "choice",
  q: "ما القرار الصحيح بشأن المسار المائل؟",
  options: [
    "أعتمده — أقصر وأوفر بالمواسير والسلك",
    "أرفضه: المسارات أفقية وعمودية فقط، حتى يعرف أي شخص بعد سنوات أين يمرّ السلك فلا يثقبه",
    "أعتمده بشرط تصويره فقط"],
  correct: 1,
  explain: "المائل اليوم هو برغي صورة يخترق سلكاً بعد خمس سنوات. الأفقي/العمودي قاعدة عالمية لأنها تجعل مسار السلك قابلاً للتنبؤ من مواضع المفاتيح والمآخذ نفسها — والتصوير مساعد لا بديل." },

{ id: "switch1", icon: "💡", title: "المرحلة ٦ — توصيل دارة مفتاح مفرد (توصيل تفاعلي)",
  scene: "ركّبنا العلب وسحبنا الأسلاك. الآن وصّل دارة إنارة الممر بنفسك: انقر أي نقطتين لمدّ سلك بينهما. القاعدة: المفتاح يقطع الطور، والحيادي يذهب للمصباح مباشرة.",
  type: "connect",
  points: [
    { id: "ph", x: 285, y: 35, label: "طور من اللوحة" },
    { id: "nt", x: 285, y: 165, label: "حيادي من اللوحة" },
    { id: "s1", x: 160, y: 35, label: "مفتاح — طرف ١" },
    { id: "s2", x: 160, y: 85, label: "مفتاح — طرف ٢" },
    { id: "l1", x: 45, y: 60, label: "مصباح — طرف ١" },
    { id: "l2", x: 45, y: 130, label: "مصباح — طرف ٢" }],
  pairs: [["ph", "s1"], ["s2", "l1"], ["nt", "l2"]],
  pairNames: { "ph|s1": "الطور إلى المفتاح", "l1|s2": "خط الرجوع من المفتاح إلى المصباح", "l2|nt": "الحيادي إلى المصباح مباشرة" },
  explain: "بهذه التوصيلة: المفتاح يقطع الطور فتغيير اللمبة آمن، والمصباح يطيع المفتاح، ولا جهد على القاعدة وهي مطفأة. لو وصلت الحيادي بالمفتاح لعملت اللمبة أيضاً — لكن بقيت حيّة وهي مطفأة، وهذا هو الفرق بين «يشتغل» و«صحيح»." },

{ id: "switch2", icon: "🔀", title: "المرحلة ٧ — توصيل الديفاتير: تحكم من مكانين (توصيل تفاعلي)",
  scene: "غرفة النوم الرئيسية: إنارتها يجب أن تُدار من الباب ومن جانب السرير. وصّل الديفاتيرين بنفسك: مشترك الأول يستقبل الطور، سلكا تنقّل بين الطرفين المتناظرين، ومشترك الثاني يطعم المصباح.",
  type: "connect",
  points: [
    { id: "ph", x: 292, y: 30, label: "طور" },
    { id: "nt", x: 292, y: 172, label: "حيادي" },
    { id: "a0", x: 215, y: 100, label: "مفتاح١ — مشترك" },
    { id: "a1", x: 215, y: 45, label: "مفتاح١ — طرف أ" },
    { id: "a2", x: 215, y: 155, label: "مفتاح١ — طرف ب" },
    { id: "b0", x: 105, y: 100, label: "مفتاح٢ — مشترك" },
    { id: "b1", x: 105, y: 45, label: "مفتاح٢ — طرف أ" },
    { id: "b2", x: 105, y: 155, label: "مفتاح٢ — طرف ب" },
    { id: "l1", x: 28, y: 70, label: "مصباح ١" },
    { id: "l2", x: 28, y: 132, label: "مصباح ٢" }],
  pairs: [["ph", "a0"], ["a1", "b1"], ["a2", "b2"], ["b0", "l1"], ["nt", "l2"]],
  pairNames: { "a0|ph": "الطور إلى مشترك المفتاح الأول", "a1|b1": "سلك تنقّل أ بين الطرفين", "a2|b2": "سلك تنقّل ب بين الطرفين", "b0|l1": "مشترك الثاني إلى المصباح", "l2|nt": "الحيادي إلى المصباح" },
  explain: "اكتمل الديفاتير: أيّ مفتاح يقلب طريق التيار بين سلكي التنقل، فيضيء المصباح أو ينطفئ من الباب ومن السرير معاً مهما كان وضع الآخر. أضف مفتاحاً وسطياً (كروازيه) بينهما إن احتجت مكاناً ثالثاً كدرج طويل." },

{ id: "changeover", icon: "🔄", title: "المرحلة ٨ — خط الاشتراك وقاطع التبديل",
  scene: "ركّبنا خط اشتراك 10A من مولدة الحي. الجار يقترح: «بلا تعقيد التبديل، صِل خط المولدة بمأخذ عندك وغذِّ اللوحة منه عند الحاجة».",
  type: "choice",
  q: "ما موقفك المهني الصحيح؟",
  options: [
    "أقبل — حل مجرّب عند كثيرين ويوفر ثمن قاطع التبديل",
    "أرفض قطعاً: التغذية حصراً عبر قاطع تبديل 1-0-2 يستحيل معه جمع الدولة والمولدة، وبقاطع فرعي 10A ودارات خفيفة مخصصة",
    "أقبل بشرط فصل القاطع الرئيسي يدوياً كل مرة"],
  correct: 1,
  explain: "التغذية العكسية من مقبس تصنع أطرافاً ذكراً حيّة وقد تعيد الكهرباء إلى شبكة المولدة أو الدولة فتصعق عامل صيانة. التبديل المتعاكس ميكانيكياً هو الحل الوحيد المقبول — و«سأنتبه يدوياً» ليست حماية، لأن النسيان مسألة وقت." },

{ id: "inverter", icon: "🔋", title: "المرحلة ٩ — خط الإنفرتر: ماذا يدخل وماذا يُمنع؟",
  scene: "سنركّب إنفرتر 1600VA ببطارية واحدة وبميزانية محسوبة. حدّد الأحمال التي تدخل خط الأساسيات بالضبط — لا أكثر ولا أقل.",
  type: "multi",
  items: ["إنارة LED للبيت كله (≈١٢٠W)", "البراد (≈١٠٠W)", "الراوتر والشواحن وشاشة (≈٨٠W)", "سخان الماء ٢٠٠٠W", "المكيف ١٫٥ طن", "الفرن الكهربائي", "الغلاية ١٨٠٠W"],
  correctSet: [0, 1, 2],
  explain: "الأساسيات ≈ ٣٠٠W فقط: حياة كاملة بإضاءة وبراد واتصال، وبطارية واحدة تكفي ليلة. كل حمل حراري أو ضاغط كبير خارج الخط بالتأسيس لا بالوعود — هكذا يبقى الإنفرتر الصغير كافياً والبطارية تعيش." },

{ id: "test", icon: "✅", title: "المرحلة ١٠ — فحص التسليم: قاطع يفصل!",
  scene: "يوم التسليم. نفّذتَ الاختبارات الخمسة وكل شيء سليم، لكن عند تجربة حمل المطبخ الكامل فصل قاطع التسرب مرة واحدة ثم عمل بعد إعادة رفعه.",
  type: "choice",
  q: "ما التصرف الصحيح قبل التسليم؟",
  options: [
    "أسلّم المشروع — فصل مرة واحدة قد يكون صدفة، وصاحب البيت يراقب",
    "لا تسليم حتى أجد السبب بمنهج التقسيم: أفصل أحمال الدارة وأعيدها حملاً حملاً حتى يظهر المتسرب (غالباً جهاز أو رطوبة نقطة)، وأصلحه جذرياً",
    "أرفع حساسية قاطع التسرب إلى 100mA حتى لا يفصل"],
  correct: 1,
  explain: "الفصل رسالة لا إزعاج: قاطع تسرب فصل مرة تحت حمل حقيقي يعني تسرباً حدّياً سيتفاقم. ورفع الحساسية إلى 100mA يلغي حماية الأرواح فعلياً. المنهج: قسّم، اعزل، أصلح، أعد الفحص كاملاً — ثم سلّم بضمير مرتاح ووثائق كاملة." }
];

/* ---------- الحالة والحفظ ---------- */
let simState = JSON.parse(localStorage.getItem("hw-sim") || "{}"); // {stageId: score}
function saveSim(){ localStorage.setItem("hw-sim", JSON.stringify(simState)); }
function simPassed(i){ return SIM_STAGES[i] && simState[SIM_STAGES[i].id] != null; }
function stageUnlocked(i){ return i === 0 || simPassed(i - 1); }

function renderSim(){
  const wrap = document.getElementById("view-sim");
  const doneCount = SIM_STAGES.filter(s => simState[s.id] != null).length;
  const avg = doneCount ? Math.round(SIM_STAGES.reduce((a, s) => a + (simState[s.id] || 0), 0) / doneCount) : 0;
  let html = `<div class="card sim-intro">
    <h2>🎮 المحاكاة التطبيقية الكاملة — مدّد شقة سورية ٩٠م² من الصفر</h2>
    <p>هنا لا تقرأ: <b>تُنفّذ</b>. عشر مراحل بنفس ترتيب المشروع الحقيقي — من رسم المخطط وحفرة التأريض
    حتى فحص التسليم — وكل مرحلة مهمة تفاعلية يجب أن تنجح فيها لتفتح التي بعدها: رتّب خطوات،
    اتخذ قرارات مهنية، و<b>وصّل دارتَي المفتاح المفرد والديفاتير بنفسك</b> بالنقر على النقاط.
    نتيجتك تُحفظ على جهازك.</p>
    <div class="progress-label"><span>مراحل منجزة: ${doneCount} من ${SIM_STAGES.length}</span><span>${doneCount ? "متوسط النتيجة: " + avg + "٪" : ""}</span></div>
    <div class="progress-bar sim-bar"><div style="width:${doneCount / SIM_STAGES.length * 100}%"></div></div>
    ${doneCount === SIM_STAGES.length ? `<div class="box tip">🏆 <b>أنهيت المحاكاة كاملة بمتوسط ${avg}٪!</b> نفّذتَ افتراضياً تمديد شقة كاملة: مخططاً وتأريضاً ولوحة وتأسيساً وتوصيلات ومصادر بديلة وفحصاً. تذكير واجب: المحاكاة تعلّم التفكير والترتيب، والتنفيذ الحقيقي يكون دائماً بفصل الكهرباء والتحقق وأدوات السلامة — وعند العداد عبر المختصين.</div>` : ""}
  </div>`;
  SIM_STAGES.forEach((s, i) => {
    const locked = !stageUnlocked(i), score = simState[s.id];
    html += `<div class="card sim-stage ${locked ? "locked" : ""}" id="sim-${s.id}">
      <h3>${s.icon} ${s.title} ${score != null ? `<span class="sim-score">✔ نتيجتك: ${score}٪</span>` : locked ? "🔒" : ""}</h3>
      <p>${s.scene}</p>
      ${locked ? `<p class="hint">أكمل المرحلة السابقة لتفتح هذه المرحلة.</p>` : `<div class="sim-body" data-stage="${i}"></div>`}
    </div>`;
  });
  wrap.innerHTML = html;
  SIM_STAGES.forEach((s, i) => { if (stageUnlocked(i)) mountStage(i); });
}

/* ---------- تركيب المراحل حسب نوعها ---------- */
function mountStage(i){
  const s = SIM_STAGES[i];
  const host = document.querySelector(`.sim-body[data-stage="${i}"]`);
  if (!host) return;
  host.innerHTML = "";
  const already = simState[s.id] != null;
  if (s.type === "choice") mountChoice(host, s, i, already);
  else if (s.type === "order") mountOrder(host, s, i, already);
  else if (s.type === "multi") mountMulti(host, s, i, already);
  else if (s.type === "connect") mountConnect(host, s, i, already);
}
function finishStage(host, s, score){
  simState[s.id] = Math.max(simState[s.id] || 0, score);
  saveSim();
  const fb = document.createElement("div");
  fb.className = "box tip"; fb.style.marginTop = "10px";
  fb.innerHTML = `✔ <b>أحسنت — نتيجتك في هذه المرحلة: ${score}٪.</b><br>${s.explain}<br><button class="btn" onclick="renderSim()">متابعة إلى المرحلة التالية ↓</button>`;
  host.appendChild(fb);
  fb.scrollIntoView({ behavior: "smooth", block: "center" });
}
function failMsg(host, text){
  let fb = host.querySelector(".sim-fail");
  if (!fb) { fb = document.createElement("div"); fb.className = "box warn sim-fail"; host.appendChild(fb); }
  fb.textContent = "✖ " + text;
}

function mountChoice(host, s, i, already){
  let tries = 0;
  const q = document.createElement("p"); q.innerHTML = `<b>${s.q}</b>`; host.appendChild(q);
  s.options.forEach((op, oi) => {
    const b = document.createElement("button"); b.className = "sim-opt"; b.textContent = op;
    b.addEventListener("click", () => {
      if (simState[s.id] != null && already) return;
      if (oi === s.correct) { b.classList.add("right"); finishStage(host, s, tries === 0 ? 100 : tries === 1 ? 60 : 40); }
      else { tries++; b.classList.add("wrong"); b.disabled = true; failMsg(host, "قرار غير صحيح — راجع درس هذه المرحلة وحاول من جديد."); }
    });
    host.appendChild(b);
  });
}

function mountOrder(host, s, i, already){
  let next = 0, errors = 0;
  const order = s.items.map((t, idx) => ({ t, idx })).sort(() => Math.random() - 0.5);
  const p = document.createElement("p"); p.innerHTML = "<b>انقر الخطوات بالترتيب الصحيح:</b>"; host.appendChild(p);
  const got = document.createElement("div"); got.className = "sim-got"; host.appendChild(got);
  order.forEach(o => {
    const b = document.createElement("button"); b.className = "sim-opt"; b.textContent = o.t;
    b.addEventListener("click", () => {
      if (o.idx === next) {
        b.disabled = true; b.classList.add("right"); next++;
        got.innerHTML += `<div>‏${next}. ${o.t}</div>`;
        if (next === s.items.length) finishStage(host, s, Math.max(40, 100 - errors * 15));
      } else { errors++; failMsg(host, "ليست هذه الخطوة التالية — فكّر بتسلسل العمل الحقيقي."); }
    });
    host.appendChild(b);
  });
}

function mountMulti(host, s, i, already){
  let submitted = 0;
  const p = document.createElement("p"); p.innerHTML = "<b>حدّد الأحمال المسموحة على خط الإنفرتر:</b>"; host.appendChild(p);
  const boxes = s.items.map((t, idx) => {
    const l = document.createElement("label"); l.className = "check-item";
    l.innerHTML = `<input type="checkbox" value="${idx}"><span>${t}</span>`; host.appendChild(l); return l;
  });
  const btn = document.createElement("button"); btn.className = "btn"; btn.textContent = "تأكيد اختياري";
  btn.addEventListener("click", () => {
    const chosen = boxes.filter(b => b.querySelector("input").checked).map(b => +b.querySelector("input").value).sort();
    const ok = JSON.stringify(chosen) === JSON.stringify([...s.correctSet].sort());
    if (ok) finishStage(host, s, submitted === 0 ? 100 : 60);
    else { submitted++; failMsg(host, "اختيار غير دقيق: خط الأساسيات للأحمال الخفيفة المستمرة فقط — أي حمل حراري أو ضاغط كبير يبقى على الدولة."); }
  });
  host.appendChild(btn);
}

function mountConnect(host, s, i, already){
  let selected = null, errors = 0;
  const made = new Set();
  const key = (a, b) => [a, b].sort().join("|");
  const expected = new Set(s.pairs.map(p => key(p[0], p[1])));
  const p = document.createElement("p"); p.innerHTML = "<b>انقر نقطة ثم نقطة ثانية لمدّ سلك بينهما. أكمل كل الوصلات الصحيحة:</b>"; host.appendChild(p);
  const status = document.createElement("div"); status.className = "sim-status";
  status.textContent = `وصلات صحيحة: ٠ من ${expected.size}`; host.appendChild(status);
  const NS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("viewBox", "0 0 320 200"); svg.setAttribute("class", "sim-svg");
  const gLines = document.createElementNS(NS, "g"); svg.appendChild(gLines);
  const pos = {}; s.points.forEach(pt => pos[pt.id] = pt);
  s.points.forEach(pt => {
    const g = document.createElementNS(NS, "g"); g.setAttribute("class", "sim-pt"); g.dataset.id = pt.id;
    const c = document.createElementNS(NS, "circle");
    c.setAttribute("cx", pt.x); c.setAttribute("cy", pt.y); c.setAttribute("r", 11);
    const t = document.createElementNS(NS, "text");
    t.setAttribute("x", pt.x); t.setAttribute("y", pt.y - 17); t.setAttribute("text-anchor", "middle"); t.textContent = pt.label;
    g.appendChild(c); g.appendChild(t);
    g.addEventListener("click", () => {
      if (simState[s.id] != null && already && made.size === expected.size) return;
      if (!selected) { selected = pt.id; c.classList.add("sel"); return; }
      if (selected === pt.id) { selected = null; c.classList.remove("sel"); return; }
      const k = key(selected, pt.id);
      svg.querySelectorAll("circle.sel").forEach(x => x.classList.remove("sel"));
      if (expected.has(k) && !made.has(k)) {
        made.add(k);
        const a = pos[selected], b = pos[pt.id];
        const ln = document.createElementNS(NS, "line");
        ln.setAttribute("x1", a.x); ln.setAttribute("y1", a.y); ln.setAttribute("x2", b.x); ln.setAttribute("y2", b.y);
        ln.setAttribute("class", "sim-wire"); gLines.appendChild(ln);
        status.textContent = `✔ ${s.pairNames[k] || "وصلة صحيحة"} — وصلات صحيحة: ${made.size} من ${expected.size}`;
        if (made.size === expected.size) finishStage(host, s, Math.max(40, 100 - errors * 10));
      } else if (made.has(k)) { failMsg(host, "هذه الوصلة منجزة أصلاً."); }
      else { errors++; failMsg(host, "وصلة خاطئة — لن تُرسم. تذكّر القاعدة في وصف المشهد وحاول من جديد."); }
      selected = null;
    });
    svg.appendChild(g);
  });
  host.appendChild(svg);
  const rst = document.createElement("button"); rst.className = "btn sim-reset"; rst.textContent = "↺ إعادة التوصيل من جديد";
  rst.addEventListener("click", () => renderSim());
  host.appendChild(rst);
}

renderSim();

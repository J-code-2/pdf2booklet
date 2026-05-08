const dropzone = document.getElementById("dropzone");
const fileInput = document.getElementById("file-input");
const statusBox = document.getElementById("status");
const fileName = document.getElementById("file-name");
const modeSelect = document.getElementById("mode-select");
const fitModeSelect = document.getElementById("fit-mode-select");
const marginMmInput = document.getElementById("margin-mm");
const gapMmInput = document.getElementById("gap-mm");
const swapSidesInput = document.getElementById("swap-sides");
const convertBtn = document.getElementById("convert-btn");
const vizStats = document.getElementById("viz-stats");
const vizPairs = document.getElementById("viz-pairs");
const languageSelect = document.getElementById("language-select");
let selectedFile = null;
let currentLang = "de";

const i18n = {
  de: {
    topbarChip: "Lokal im Browser-Workflow",
    heroBadge: "Schnell. Sicher. Druckbereit.",
    heroTitle: "PDF-Seiten professionell fuer Booklets anordnen",
    heroSubtitle:
      "Lade eine PDF hoch und erhalte in Sekunden ein sauber aufbereitetes Drucklayout fuer Schneiden, Stapeln oder Falzen - ohne Cloud-Upload.",
    heroH1: "Keine Registrierung",
    heroH2: "Lokale Verarbeitung",
    heroH3: "Live-Vorschau der Seitenlogik",
    quickTitle: "Quick Start",
    quick1: "PDF hochladen",
    quick2: "Layout einstellen",
    quick3: "Download starten",
    quickNote: "Empfehlung: Split-Stack + Einpassen + Rand 4 mm + Abstand 2 mm.",
    sectionLayoutTitle: "1. Datei & Layout",
    sectionLayoutSubtle: "Alles lokal auf deinem Rechner",
    dropzone: "<strong>PDF hier ablegen</strong> oder klicken zum Auswaehlen",
    fileNone: "Noch keine Datei ausgewaehlt",
    labelMode: "Reihenfolge-Modus",
    modeSplit: "Split-Stack (Standard): [1, half+1], [2, half+2], ... ideal fuer Stapel halbieren",
    modeReverse: "Reverse-Right: [1, N], [2, N-1], ... sinnvoll bei alternativer Ablage-Reihenfolge",
    labelFit: "Skalierung",
    fitContain: "Einpassen (empfohlen): Seiten werden proportional in den Slot skaliert",
    fitOriginal: "Originalgroesse: keine Skalierung, moegliches Abschneiden bei grossen Seiten",
    labelMargin: "Aussenrand (mm)",
    labelGap: "Mittelsteg / Abstand (mm)",
    swap: "Links/Rechts tauschen (nuetzlich, falls Drucker Rueckseiten gespiegelt ausgibt)",
    convert: "2. PDF umwandeln",
    feature1t: "Flexibles Layout",
    feature1p: "Split-Stack, Reverse-Right, Rand- und Abstandssteuerung fuer verschiedene Druckworkflows.",
    feature2t: "Kontrollierte Ausgabe",
    feature2p: "Skalierung (Einpassen/Original) plus optionale Seitenvertauschung fuer problemlose Rueckseiten.",
    feature3t: "Verstaendliche Visualisierung",
    feature3p: "Sieh vorab exakt, wie Seiten auf Blaetter verteilt und physisch verarbeitet werden.",
    helpTitle: "Welche Einstellung soll ich nehmen?",
    helpText:
      "Starte mit <strong>Split-Stack + Einpassen + Rand 4 mm + Abstand 2 mm</strong>. Wenn die Reihenfolge nach dem Schneiden nicht passt, probiere zuerst <strong>Reverse-Right</strong>, danach optional <strong>Links/Rechts tauschen</strong>.",
    vizTitle: "Live Visualisierung",
    vizSubtle: "Vor dem Druck pruefen",
    vizSubtitle: "Hier siehst du live, wie die Seiten auf Blaetter verteilt werden.",
    workflowTitle: "Anrichte-Vorlagen (beide Formate)",
    workflowSubtitle: "Kleine Grafik-Anleitung fuer die physische Verarbeitung nach dem Druck.",
    workflowPillA: "Format A",
    workflowATitle: "Split-Stack: Stapel teilen und aufeinanderlegen",
    workflowANote: "Ergebnis: korrekte Lesereihenfolge durch Stapeln nach dem Schnitt.",
    workflowPillB: "Format B",
    workflowBTitle: "Falz-Buch: In der Mitte knicken",
    workflowBNote: "Ergebnis: gefalztes Heft/Buchblock, anschliessend ineinanderlegen.",
    statTotalPages: "Gesamtseiten",
    statSheets: "Blaetter (Output)",
    statBlanks: "Leerseiten",
    pairSheet: "Blatt",
    pairLeft: "Links",
    pairRight: "Rechts",
    pairBlank: "leer",
    statusPdfOnly: "Bitte nur PDF-Dateien hochladen.",
    statusProcessing: "Verarbeite PDF...",
    statusError: "Fehler bei der Verarbeitung.",
    statusDone: "Fertig. Download gestartet.",
    statusNetwork: "Netzwerkfehler. Bitte erneut versuchen.",
    statusChooseFile: "Bitte zuerst eine PDF-Datei auswaehlen.",
    statusSelectedPrefix: "Ausgewaehlt",
  },
  en: {
    topbarChip: "Local browser workflow",
    heroBadge: "Fast. Secure. Print-ready.",
    heroTitle: "Arrange PDF pages professionally for booklets",
    heroSubtitle:
      "Upload a PDF and get a clean print layout for cutting, stacking, or folding in seconds - no cloud upload.",
    heroH1: "No registration",
    heroH2: "Local processing",
    heroH3: "Live page-order preview",
    quickTitle: "Quick Start",
    quick1: "Upload PDF",
    quick2: "Adjust layout",
    quick3: "Start download",
    quickNote: "Recommended setup: Split-Stack + Fit + Margin 4 mm + Gap 2 mm.",
    sectionLayoutTitle: "1. File & Layout",
    sectionLayoutSubtle: "Everything stays on your computer",
    dropzone: "<strong>Drop PDF here</strong> or click to select",
    fileNone: "No file selected yet",
    labelMode: "Order mode",
    modeSplit: "Split-Stack (default): [1, half+1], [2, half+2], ... best when you split the stack in half",
    modeReverse: "Reverse-Right: [1, N], [2, N-1], ... useful for alternative stacking workflows",
    labelFit: "Scaling",
    fitContain: "Fit (recommended): pages are scaled proportionally to each slot",
    fitOriginal: "Original size: no scaling, large pages may be clipped",
    labelMargin: "Outer margin (mm)",
    labelGap: "Center gap (mm)",
    swap: "Swap left/right (helpful if your printer flips back pages)",
    convert: "2. Convert PDF",
    feature1t: "Flexible layout",
    feature1p: "Split-Stack, Reverse-Right, and margin/gap control for different print workflows.",
    feature2t: "Controlled output",
    feature2p: "Scaling options plus optional side swap for consistent back-side output.",
    feature3t: "Clear visualization",
    feature3p: "See exactly how pages map onto sheets before printing.",
    helpTitle: "Which settings should I use?",
    helpText:
      "Start with <strong>Split-Stack + Fit + Margin 4 mm + Gap 2 mm</strong>. If the reading order is off after cutting, try <strong>Reverse-Right</strong>, then optionally <strong>Swap Left/Right</strong>.",
    vizTitle: "Live Visualization",
    vizSubtle: "Validate before print",
    vizSubtitle: "See how pages are distributed onto sheets in real time.",
    workflowTitle: "Arrangement guides (both formats)",
    workflowSubtitle: "Small visual guide for physical handling after print.",
    workflowPillA: "Format A",
    workflowATitle: "Split-Stack: split the stack and place one half on top",
    workflowANote: "Result: correct reading order after cutting and stacking.",
    workflowPillB: "Format B",
    workflowBTitle: "Fold booklet: fold each sheet down the middle",
    workflowBNote: "Result: folded booklet block ready for nesting.",
    statTotalPages: "Total pages",
    statSheets: "Sheets (output)",
    statBlanks: "Blank pages",
    pairSheet: "Sheet",
    pairLeft: "Left",
    pairRight: "Right",
    pairBlank: "blank",
    statusPdfOnly: "Please upload PDF files only.",
    statusProcessing: "Processing PDF...",
    statusError: "Processing error.",
    statusDone: "Done. Download started.",
    statusNetwork: "Network error. Please try again.",
    statusChooseFile: "Please choose a PDF first.",
    statusSelectedPrefix: "Selected",
  },
  fr: {
    topbarChip: "Traitement local dans le navigateur",
    heroBadge: "Rapide. Securise. Pret a imprimer.",
    heroTitle: "Organisez vos pages PDF pour livrets, simplement et proprement",
    heroSubtitle:
      "Importez un PDF et obtenez en quelques secondes une mise en page propre pour couper, empiler ou plier - sans envoi vers le cloud.",
    heroH1: "Sans inscription",
    heroH2: "Traitement local",
    heroH3: "Apercu en direct de l'ordre des pages",
    quickTitle: "Demarrage rapide",
    quick1: "Importer PDF",
    quick2: "Regler la mise en page",
    quick3: "Lancer le telechargement",
    quickNote: "Recommande: Split-Stack + Ajuster + Marge 4 mm + Ecart 2 mm.",
    sectionLayoutTitle: "1. Fichier et mise en page",
    sectionLayoutSubtle: "Tout reste sur votre ordinateur",
    dropzone: "<strong>Deposez le PDF ici</strong> ou cliquez pour choisir",
    fileNone: "Aucun fichier selectionne",
    labelMode: "Mode d'ordre",
    modeSplit: "Split-Stack (defaut): [1, half+1], [2, half+2], ... ideal pour couper la pile en deux",
    modeReverse: "Reverse-Right: [1, N], [2, N-1], ... utile selon votre methode d'assemblage",
    labelFit: "Mise a l'echelle",
    fitContain: "Ajuster (recommande): pages redimensionnees proportionnellement dans chaque zone",
    fitOriginal: "Taille originale: pas de redimensionnement, possible rognage",
    labelMargin: "Marge externe (mm)",
    labelGap: "Ecart central (mm)",
    swap: "Inverser gauche/droite (utile si votre imprimante retourne les verso)",
    convert: "2. Convertir le PDF",
    feature1t: "Mise en page flexible",
    feature1p: "Split-Stack, Reverse-Right, et controle des marges/ecarts pour differents workflows.",
    feature2t: "Sortie controlee",
    feature2p: "Options de mise a l'echelle et inversion optionnelle des cotes pour des verso fiables.",
    feature3t: "Visualisation claire",
    feature3p: "Voyez exactement la distribution des pages avant impression.",
    helpTitle: "Quels reglages choisir ?",
    helpText:
      "Commencez avec <strong>Split-Stack + Ajuster + Marge 4 mm + Ecart 2 mm</strong>. Si l'ordre de lecture n'est pas correct apres la coupe, essayez <strong>Reverse-Right</strong>, puis <strong>Inverser gauche/droite</strong>.",
    vizTitle: "Visualisation en direct",
    vizSubtle: "Verifier avant impression",
    vizSubtitle: "Voyez en temps reel comment les pages sont reparties sur les feuilles.",
    workflowTitle: "Guides d'assemblage (deux formats)",
    workflowSubtitle: "Petit guide visuel pour la manipulation physique apres impression.",
    workflowPillA: "Format A",
    workflowATitle: "Split-Stack : couper la pile en deux puis superposer",
    workflowANote: "Resultat : ordre de lecture correct apres la coupe et l'empilage.",
    workflowPillB: "Format B",
    workflowBTitle: "Livret plie : plier chaque feuille au milieu",
    workflowBNote: "Resultat : bloc plie pret a etre assemble.",
    statTotalPages: "Pages totales",
    statSheets: "Feuilles (sortie)",
    statBlanks: "Pages blanches",
    pairSheet: "Feuille",
    pairLeft: "Gauche",
    pairRight: "Droite",
    pairBlank: "vide",
    statusPdfOnly: "Veuillez televerser uniquement des PDF.",
    statusProcessing: "Traitement du PDF...",
    statusError: "Erreur de traitement.",
    statusDone: "Termine. Telechargement lance.",
    statusNetwork: "Erreur reseau. Veuillez reessayer.",
    statusChooseFile: "Veuillez d'abord choisir un PDF.",
    statusSelectedPrefix: "Selectionne",
  },
  ar: {
    topbarChip: "سير عمل محلي داخل المتصفح",
    heroBadge: "سريع. آمن. جاهز للطباعة.",
    heroTitle: "تنسيق صفحات PDF بشكل احترافي للكتيبات",
    heroSubtitle:
      "ارفع ملف PDF واحصل خلال ثوانٍ على تخطيط طباعة مرتب للقص او التكديس او الطي - من دون رفع سحابي.",
    heroH1: "بدون تسجيل",
    heroH2: "معالجة محلية",
    heroH3: "معاينة مباشرة لترتيب الصفحات",
    quickTitle: "بداية سريعة",
    quick1: "ارفع ملف PDF",
    quick2: "اضبط التخطيط",
    quick3: "ابدأ التحميل",
    quickNote: "مقترح: Split-Stack + ملاءمة + هامش 4 مم + مسافة 2 مم.",
    sectionLayoutTitle: "1. الملف والتخطيط",
    sectionLayoutSubtle: "كل شيء يبقى على جهازك",
    dropzone: "<strong>اسحب ملف PDF هنا</strong> او انقر للاختيار",
    fileNone: "لم يتم اختيار ملف بعد",
    labelMode: "وضع الترتيب",
    modeSplit: "Split-Stack (افتراضي): [1, half+1], [2, half+2], ... مناسب عند تقسيم الرزمة الى نصفين",
    modeReverse: "Reverse-Right: [1, N], [2, N-1], ... مفيد حسب طريقة ترتيبك للتكديس",
    labelFit: "التحجيم",
    fitContain: "ملاءمة (موصى به): يتم التحجيم بشكل متناسب داخل كل خانة",
    fitOriginal: "الحجم الاصلي: بدون تحجيم وقد يحدث قص",
    labelMargin: "الهامش الخارجي (مم)",
    labelGap: "المسافة الوسطى (مم)",
    swap: "تبديل اليمين/اليسار (مفيد اذا كانت الطابعة تعكس صفحات الخلفية)",
    convert: "2. تحويل PDF",
    feature1t: "تخطيط مرن",
    feature1p: "Split-Stack و Reverse-Right مع تحكم بالهوامش والمسافات.",
    feature2t: "مخرجات دقيقة",
    feature2p: "خيارات التحجيم مع تبديل جانبي اختياري للحصول على ظهر صفحات اكثر ثباتا.",
    feature3t: "معاينة واضحة",
    feature3p: "شاهد توزيع الصفحات على الاوراق قبل الطباعة.",
    helpTitle: "ما هي الاعدادات المناسبة؟",
    helpText:
      "ابدأ بـ <strong>Split-Stack + ملاءمة + هامش 4 مم + مسافة 2 مم</strong>. اذا لم يكن ترتيب القراءة صحيحا بعد القص، جرّب <strong>Reverse-Right</strong> ثم <strong>تبديل اليمين/اليسار</strong>.",
    vizTitle: "معاينة مباشرة",
    vizSubtle: "تحقق قبل الطباعة",
    vizSubtitle: "شاهد مباشرة كيف يتم توزيع الصفحات على الاوراق.",
    workflowTitle: "ادلة التجهيز (كلا النمطين)",
    workflowSubtitle: "رسم توضيحي صغير للترتيب اليدوي بعد الطباعة.",
    workflowPillA: "النمط A",
    workflowATitle: "Split-Stack: قسّم الرزمة الى نصفين ثم ضع نصفا فوق الاخر",
    workflowANote: "النتيجة: ترتيب قراءة صحيح بعد القص والتكديس.",
    workflowPillB: "النمط B",
    workflowBTitle: "نمط الطي: اطوِ كل ورقة من المنتصف",
    workflowBNote: "النتيجة: كتيب مطوي جاهز للتجميع.",
    statTotalPages: "اجمالي الصفحات",
    statSheets: "عدد الاوراق",
    statBlanks: "صفحات فارغة",
    pairSheet: "ورقة",
    pairLeft: "يسار",
    pairRight: "يمين",
    pairBlank: "فارغ",
    statusPdfOnly: "يرجى رفع ملفات PDF فقط.",
    statusProcessing: "جار معالجة ملف PDF...",
    statusError: "حدث خطأ في المعالجة.",
    statusDone: "تم. بدأ التنزيل.",
    statusNetwork: "خطأ في الشبكة. حاول مرة اخرى.",
    statusChooseFile: "يرجى اختيار ملف PDF اولا.",
    statusSelectedPrefix: "تم اختيار",
  },
};

function t(key) {
  return i18n[currentLang][key] || i18n.de[key] || key;
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function setHTML(id, value) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = value;
}

function applyLanguage(lang) {
  currentLang = i18n[lang] ? lang : "de";
  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";

  setText("topbar-chip", t("topbarChip"));
  setText("hero-badge", t("heroBadge"));
  setText("hero-title", t("heroTitle"));
  setText("hero-subtitle", t("heroSubtitle"));
  setText("hero-highlight-1", t("heroH1"));
  setText("hero-highlight-2", t("heroH2"));
  setText("hero-highlight-3", t("heroH3"));
  setText("quickstart-title", t("quickTitle"));
  setText("quickstart-step-1", t("quick1"));
  setText("quickstart-step-2", t("quick2"));
  setText("quickstart-step-3", t("quick3"));
  setText("quickstart-note", t("quickNote"));
  setText("section-layout-title", t("sectionLayoutTitle"));
  setText("section-layout-subtle", t("sectionLayoutSubtle"));
  setHTML("dropzone-text", t("dropzone"));
  setText("label-mode-select", t("labelMode"));
  setText("mode-option-split", t("modeSplit"));
  setText("mode-option-reverse", t("modeReverse"));
  setText("label-fit-mode-select", t("labelFit"));
  setText("fit-option-contain", t("fitContain"));
  setText("fit-option-original", t("fitOriginal"));
  setText("label-margin-mm", t("labelMargin"));
  setText("label-gap-mm", t("labelGap"));
  setText("swap-sides-text", t("swap"));
  setText("convert-btn", t("convert"));
  setText("feature-1-title", t("feature1t"));
  setText("feature-1-text", t("feature1p"));
  setText("feature-2-title", t("feature2t"));
  setText("feature-2-text", t("feature2p"));
  setText("feature-3-title", t("feature3t"));
  setText("feature-3-text", t("feature3p"));
  setText("help-title", t("helpTitle"));
  setHTML("help-text", t("helpText"));
  setText("viz-title", t("vizTitle"));
  setText("viz-subtle", t("vizSubtle"));
  setText("viz-subtitle", t("vizSubtitle"));
  setText("workflow-title", t("workflowTitle"));
  setText("workflow-subtitle", t("workflowSubtitle"));
  setText("workflow-pill-a", t("workflowPillA"));
  setText("workflow-a-title", t("workflowATitle"));
  setText("workflow-a-note", t("workflowANote"));
  setText("workflow-pill-b", t("workflowPillB"));
  setText("workflow-b-title", t("workflowBTitle"));
  setText("workflow-b-note", t("workflowBNote"));

  if (selectedFile) {
    fileName.textContent = `${t("statusSelectedPrefix")}: ${selectedFile.name}`;
  } else {
    fileName.textContent = t("fileNone");
  }
}

function setStatus(message, type = "") {
  statusBox.textContent = message;
  statusBox.className = `status ${type}`.trim();
}

function renderVisualization(payload) {
  vizStats.innerHTML = `
    <div class="stat-card"><span class="stat-label">${t("statTotalPages")}</span><span class="stat-value">${payload.total_pages}</span></div>
    <div class="stat-card"><span class="stat-label">${t("statSheets")}</span><span class="stat-value">${payload.total_sheets}</span></div>
    <div class="stat-card"><span class="stat-label">${t("statBlanks")}</span><span class="stat-value">${payload.blank_pages}</span></div>
  `;

  vizPairs.innerHTML = payload.pairs
    .map(
      (pair) => `
      <div class="pair-card">
        <span class="pair-title">${t("pairSheet")} ${pair.sheet}</span>
        <div class="sheet-preview">
          <div class="sheet-half">
            <span class="sheet-half-label">${t("pairLeft")}</span>
            <span class="sheet-half-value">${pair.left}</span>
          </div>
          <div class="sheet-divider" aria-hidden="true"></div>
          <div class="sheet-half">
            <span class="sheet-half-label">${t("pairRight")}</span>
            <span class="sheet-half-value">${pair.right ?? t("pairBlank")}</span>
          </div>
        </div>
      </div>
    `,
    )
    .join("");
}

async function refreshPreview() {
  const file = selectedFile || fileInput.files?.[0];
  if (!file) {
    vizStats.innerHTML = "";
    vizPairs.innerHTML = "";
    return;
  }

  const data = new FormData();
  data.append("pdf", file);
  data.append("mode", modeSelect.value);

  try {
    const response = await fetch("/api/preview", {
      method: "POST",
      body: data,
    });
    if (!response.ok) {
      vizStats.innerHTML = "";
      vizPairs.innerHTML = "";
      return;
    }
    const payload = await response.json();
    renderVisualization(payload);
  } catch (err) {
    vizStats.innerHTML = "";
    vizPairs.innerHTML = "";
  }
}

async function uploadFile(file) {
  if (!file) return;
  if (!file.name.toLowerCase().endsWith(".pdf")) {
    setStatus(t("statusPdfOnly"), "error");
    return;
  }

  fileName.textContent = `${t("statusSelectedPrefix")}: ${file.name}`;
  convertBtn.disabled = true;
  setStatus(t("statusProcessing"), "");

  const data = new FormData();
  data.append("pdf", file);
  data.append("mode", modeSelect.value);
  data.append("fit_mode", fitModeSelect.value);
  data.append("margin_mm", marginMmInput.value || "0");
  data.append("gap_mm", gapMmInput.value || "0");
  data.append("swap_sides", String(swapSidesInput.checked));

  try {
    const response = await fetch("/api/rearrange", {
      method: "POST",
      body: data,
    });

    if (!response.ok) {
      let message = "Fehler bei der Verarbeitung.";
      message = t("statusError");
      try {
        const payload = await response.json();
        if (payload.error) message = payload.error;
      } catch (e) {
        // keep fallback message
      }
      setStatus(message, "error");
      convertBtn.disabled = false;
      return;
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name.replace(/\.pdf$/i, "") + "-cutstack.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    setStatus(t("statusDone"), "success");
  } catch (err) {
    setStatus(t("statusNetwork"), "error");
  } finally {
    convertBtn.disabled = false;
  }
}

dropzone.addEventListener("click", () => fileInput.click());
dropzone.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    fileInput.click();
  }
});

fileInput.addEventListener("change", () => {
  const file = fileInput.files?.[0];
  if (file) {
    selectedFile = file;
    fileName.textContent = `${t("statusSelectedPrefix")}: ${file.name}`;
    refreshPreview();
  }
});

["dragenter", "dragover"].forEach((eventName) => {
  dropzone.addEventListener(eventName, (e) => {
    e.preventDefault();
    dropzone.classList.add("drag-over");
  });
});

["dragleave", "drop"].forEach((eventName) => {
  dropzone.addEventListener(eventName, (e) => {
    e.preventDefault();
    dropzone.classList.remove("drag-over");
  });
});

dropzone.addEventListener("drop", (e) => {
  const file = e.dataTransfer?.files?.[0];
  if (file) {
    selectedFile = file;
    fileName.textContent = `${t("statusSelectedPrefix")}: ${file.name}`;
    refreshPreview();
  }
});

modeSelect.addEventListener("change", refreshPreview);
languageSelect.addEventListener("change", (e) => {
  applyLanguage(e.target.value);
  refreshPreview();
});

convertBtn.addEventListener("click", () => {
  const file = selectedFile || fileInput.files?.[0];
  if (!file) {
    setStatus(t("statusChooseFile"), "error");
    return;
  }
  uploadFile(file);
});

applyLanguage("de");

/**
 * Combined by jsDelivr.
 * Original files:
 * - /gh/monirkarimbd-web/scanner@main/copycost.js
 * - /gh/monirkarimbd-web/scanner@main/bdresult.js
 * - /gh/monirkarimbd-web/scanner@main/iphcon.js
 * - /gh/monirkarimbd-web/scanner@main/examfaq.js
 * - /gh/monirkarimbd-web/scanner@main/agreement.js
 * - /gh/monirkarimbd-web/scanner@main/pdfms.js
 * - /gh/monirkarimbd-web/scanner@main/gd.js
 * - /gh/monirkarimbd-web/scanner@main/routine.js
 * - /gh/monirkarimbd-web/scanner@main/property.js
 * - /gh/monirkarimbd-web/scanner@main/pshortcuts.js
 * - /gh/monirkarimbd-web/scanner@main/salary.js
 * - /gh/monirkarimbd-web/scanner@main/visacrop.js
 * - /gh/monirkarimbd-web/scanner@main/familycard01.js
 * - /gh/monirkarimbd-web/scanner@main/bcalendar.js
 * - /gh/monirkarimbd-web/scanner@main/flight1.js
 * - /gh/monirkarimbd-web/scanner@main/visacheck1.js
 * - /gh/monirkarimbd-web/scanner@main/p-n-posts1.js
 * - /gh/monirkarimbd-web/scanner@main/bgre1.js
 * - /gh/monirkarimbd-web/scanner@main/jophotos1.js
 * - /gh/monirkarimbd-web/scanner@main/pp1.js
 * - /gh/monirkarimbd-web/scanner@main/datecon1.js
 * - /gh/monirkarimbd-web/scanner@main/travelbook0.js
 * - /gh/monirkarimbd-web/scanner@main/eidcard01.js
 * - /gh/monirkarimbd-web/scanner@main/quot.js
 * - /gh/monirkarimbd-web/scanner@main/inv.js
 * - /gh/monirkarimbd-web/scanner@main/pdfcompr.js
 * - /gh/monirkarimbd-web/scanner@main/wpformatter.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
let costLang = "en";

// ইংরেজি সংখ্যাকে বাংলায় রূপান্তর করার ফাংশন
function toBengaliNumber(n) {
    const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return n.toString().replace(/\d/g, digit => bengaliDigits[digit]);
}

function openCostCalcModal() {
    // আগের ফাংশনটির মতোই
    if(typeof setActiveMode === "function") setActiveMode('mode-cost-calc');
    document.getElementById('costCalcModal').style.display = 'flex';
    calculatePrintingCost();
}

function closeCostCalcModal() {
    document.getElementById('costCalcModal').style.display = 'none';
}

function setCostLang(lang) {
    costLang = lang;
    document.getElementById('cost-en-btn').classList.toggle('active', lang === 'en');
    document.getElementById('cost-bn-btn').classList.toggle('active', lang === 'bn');

    const strings = {
        en: {
            title: "Photocopy & Print Cost Calculator",
            paper: "Paper Rim Price (BDT)",
            ink: "Ink/Toner Price",
            yield: "Page Yield (Approx)",
            elec: "Electricity/Bill (Per Page)",
            sell: "Selling Price (Per Page)",
            costPer: "Cost Per Page:",
            profitPer: "Profit Per Page:",
            unit: "BDT",
            tip: "Tip: Generally, one Rim has 500 sheets. Calculation is based on single-side print."
        },
        bn: {
            title: "ফটোকপি ও প্রিন্টিং খরচ ক্যালকুলেটর",
            paper: "কাগজের রিমের দাম (টাকা)",
            ink: "কালি বা টোনারের দাম",
            yield: "মোট প্রিন্ট সংখ্যা (আনুমানিক)",
            elec: "বিদ্যুৎ ও অন্যান্য (প্রতি পেইজ)",
            sell: "বিক্রয় মূল্য (প্রতি পেইজ)",
            costPer: "প্রতি পেইজ খরচ:",
            profitPer: "প্রতি পেইজ লাভ:",
            unit: "টাকা",
            tip: "টিপস: সাধারণত ১ রিমে ৫০০ টি কাগজ থাকে। হিসাবটি এক পাশের প্রিন্টের জন্য।"
        }
    };

    document.getElementById('cost-title').innerText = strings[lang].title;
    document.getElementById('lbl-paper-price').innerText = strings[lang].paper;
    document.getElementById('lbl-ink-price').innerText = strings[lang].ink;
    document.getElementById('lbl-ink-yield').innerText = strings[lang].yield;
    document.getElementById('lbl-electricity').innerText = strings[lang].elec;
    document.getElementById('lbl-sell-price').innerText = strings[lang].sell;
    document.getElementById('txt-cost-per-page').innerText = strings[lang].costPer;
    document.getElementById('txt-profit-per-page').innerText = strings[lang].profitPer;
    document.getElementById('cost-tip').innerText = strings[lang].tip;
    
    // কারেন্সি সিম্বল বা ইউনিট আপডেট
    document.getElementById('unit-cost').innerText = strings[lang].unit;
    document.getElementById('unit-profit').innerText = strings[lang].unit;

    calculatePrintingCost(); // ভাষা পরিবর্তনের সাথে সাথে সংখ্যা আপডেট হবে
}

function calculatePrintingCost() {
    const paperPrice = parseFloat(document.getElementById('paper-price').value) || 0;
    const inkPrice = parseFloat(document.getElementById('ink-price').value) || 0;
    const inkYield = parseFloat(document.getElementById('ink-yield').value) || 1;
    const elecCost = parseFloat(document.getElementById('elec-cost').value) || 0;
    const sellPrice = parseFloat(document.getElementById('sell-price').value) || 0;

    const paperCostPerPage = paperPrice / 500;
    const inkCostPerPage = inkPrice / inkYield;
    const totalCost = paperCostPerPage + inkCostPerPage + elecCost;
    const netProfit = sellPrice - totalCost;

    let finalCost = totalCost.toFixed(2);
    let finalProfit = netProfit.toFixed(2);

    // যদি ভাষা বাংলা হয়, তবে সংখ্যা পরিবর্তন করো
    if (costLang === 'bn') {
        finalCost = toBengaliNumber(finalCost);
        finalProfit = toBengaliNumber(finalProfit);
    }

    document.getElementById('res-total-cost').innerText = finalCost;
    document.getElementById('res-net-profit').innerText = finalProfit;
}
;

const bdResultList = [
  { name: "প্রাথমিক শিক্ষা অধিদপ্তর", logo: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiXodoER66gM-MD5WM7zYTW5eezYhfMr5jP8vTl1b-EfV661cyeLLCRDiUKsa9xEppY5LPaTypt3YVZ9hEG0xMtYD6PKFNJN-mV9oCUbQpvw7gXET3WGKnbMLGjMXIPNoEysYSMp5eYYvuGc5FO8wqwTSgNun2tQn7RvsgytkC6TPSIHO_FMb4dbgj5lnI/s1600/logo.png", link: "http://180.211.137.51/" },
  { name: "প্রাথমিক শিক্ষা-বিদ্যালয় ভিত্তিক", logo: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiXodoER66gM-MD5WM7zYTW5eezYhfMr5jP8vTl1b-EfV661cyeLLCRDiUKsa9xEppY5LPaTypt3YVZ9hEG0xMtYD6PKFNJN-mV9oCUbQpvw7gXET3WGKnbMLGjMXIPNoEysYSMp5eYYvuGc5FO8wqwTSgNun2tQn7RvsgytkC6TPSIHO_FMb4dbgj5lnI/s1600/logo.png", link: "http://180.211.137.51/ResultSchWise.aspx" },
  { name: "বাংলাদেশ শিক্ষা বোর্ড", logo: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjhj_2hUiFrSnQ6VO2EGrRCBdRkj3cN4YwALyTzAvs-kMEu0hu9lSgHVEPykJC7oGeslSS78SUdEPrzXLDJNhx4gPyrzb5Okr0jsk6VjDRJZkckZXxwhrOsfcU2xpz0KyuLOMNVGIQ83t-e6hBpAb0ykBoIs64NdPYcy5yskUNbtE0LH1wNc-0JpqPHpIA/s1600/teletalk-sim-operator-logo-png_seeklogo-388669.png", link: "http://www.educationboardresults.gov.bd/" },
  { name: "পরীক্ষার রেজাল্ট বিডি", logo: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi75b8dqCJ2Q3-LmZeyVDtemeEQ7LWvnBaW0X-9dNCKRn3MDXr9qePBUoNDXHKeEG0bdeeEzCriwA5Ikvq1Cw7bkb0yPS4pNO4mnrvuRlD3JxRXH4inWWnbg4HYETFDWFYlHfP0MGLnPF9QdapTydA2Of1YcEFK3ZUQKo12BDXJzvdoGNXL9tbFQCY6qnQ/s1600/gov.png", link: "https://eboardresults.com/v2/home?lang=bn" },
  { name: "কওমী মাদরাসা শিক্ষাবোর্ড", logo: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjAJGMfSZz316xWNK89yzTyYHIGJhGH91xYzs5yl-9aEDfrGEuNeFdaxVo5rUxHzmrpantEBxBZx0DXbDkgymwHY6Yjd9LEaFqwWYK5EjfV8vmGQBod2xY_ocP9MobQxp7KWl6mzudytDErtiQugbupC62vIcGeQv7GM1JEkv2ziIopqC_m_r8Hz3dmXJE/s1600/logog.png", link: "https://wifaqresult.com/" },
  { name: "কারিগরী শিক্ষা বোর্ড", logo: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgsWKJbNW1tqGJwAfIjIs9IroBQqybgu0-UAASCTNCIQz7f-LZyqVs7V0c0kU8NoHfaAU-LpPPHfvlJ7BvB_eBdaj0CuYXU0uhlnHQoV4-scnixWwnXEUdCUv0W86Vv2fZzdrWtaHyBjlYUtTMyMPm4xAKeWNmYflffA2iR6PVV5F-WHvdNkbwETkk-ZNk/s1600/bteb.png", link: "http://180.211.162.102:8444/result_arch/index.php" },
  { name: "মেডিকেল রেজাল্ট - MBBS", logo: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgcxGGo9qNiX0qYv8ZsJ15ujaxsOZZpLMQwYvTU2nyG5u-HN5wMv8vr0iqVjzPydnppJSdNRZt9OOHj1Zn5xF1jMp4pHuRScWplEVTz0-mex1xuXl_MC1iCnKrLHu7FhKG-cyWXX1VhFeYEK_IZ7ufr6KNfdXzxw3XTmpyQwL5HIgEnxHzbbozWhhsjF4U/s1600/mbbs.png", link: "https://result.dghs.gov.bd/mbbs/" },
  { name: "মেডিকেল রেজাল্ট - BDS", logo: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh1k57tM21m-MayivBlMHgrAgXol72eVTZxdoAftCXj2l8n8nWaD5i7rbRBHOGQzEm5MQk9zJpjYbbRA5tXSvEFxIel5MBpBgQaQDnaFahFmZphtpRBU_VvDkN8sDKTQUjRf51ptk6RvWq7Ef-PgA2SdVojOHPXelsgiWkdrjE5Ib8GOIpg1LzX2e3VgK4/s1600/bds.png", link: "https://result.dghs.gov.bd/bds/" },
  { name: "বিদ্যালয়ের অভ্যন্তরীণ রেজাল্ট", logo: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgVLfPOctwoXCwYtrjXBdqr7b4e7PNgCdMSY-a30srU935HpcZMmFFfkUnwEb_CzI-36GmuEI3trwWE1dkyc3bH-tRYceoZCqK3iKq6bIm4XdvsdWqKOJDJ3tTHyTDCfMZf-1kk_AFmDIgiPcY_kMkhDm1fYcEu0wbs3TurF38W2qAqxvQSR561ZI8tXRo/s1600/css.png", link: "http://sib.gov.bd/" },
  
  // নতুন ৩টি সাইট নিচে যুক্ত হলো
  { name: "জাতীয় বিশ্ববিদ্যালয় (NU)", logo: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgbnFkrCb_igD2AAVIb1ry-WU40ahVN-G9mFv_W_6GNCI4M1XMnbsbbcXhHslPV1Dt3RTXH-DUiEIXMa2AP73zL2nuJHnYBgtSndxto5VfLknT1N1gkXmRx4Rjjzdbs9t3GGZqGeHaxKFs8-hfNJXr_XYtoYpH3cS6keJMt6Ipc0x_US3A4UVEIyL3le98/s320/NU.png", link: "http://results.nu.ac.bd/" },
  { name: "উন্মুক্ত বিশ্ববিদ্যালয় (BOU)", logo: "https://exam.bou.ac.bd/images/boulogo-new.png", link: "https://exam.bou.ac.bd/" },
  { name: "শিক্ষক নিবন্ধন (NTRCA)", logo: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg131ftwBH64wYaULxvxrjArhqa8AF_Bo-oE4WbfLC5O3aVvM8Cpfn5hl9U2ZaDjzImYjoaNWsrZW8i1BCweQhaZnTCxBAzd2o6-tLtyhAbYX7ERp68UKaET0y9hOmeHtGNGrIP2Aan4ia1TA4J619XK7bBnzyr_W73H6xdYbLkPg5w3bYE5LwRjae48IU/s320/ntrca.png", link: "http://ntrca.teletalk.com.bd/result/" }
];

// রেজাল্ট গ্রেডিয়েন্ট প্যালেট
const resGradients = [
  "linear-gradient(135deg, #FF8A80, #FF5252)",
  "linear-gradient(135deg, #A5D6A7, #66BB6A)",
  "linear-gradient(135deg, #90CAF9, #42A5F5)",
  "linear-gradient(135deg, #FFE082, #FFB347)",
  "linear-gradient(135deg, #F48FB1, #F06292)",
  "linear-gradient(135deg, #80CBC4, #26A69A)"
];

function openResultModal() {
    if(typeof setActiveMode === "function") setActiveMode('mode-result-check');
    document.getElementById('resultCheckModal').style.display = 'flex';
    renderResultGrid();
}

function closeResultModal() {
    document.getElementById('resultCheckModal').style.display = 'none';
}

function renderResultGrid() {
    const container = document.getElementById("result-master-grid");
    if(!container) return;
    container.innerHTML = "";

    bdResultList.forEach((item, index) => {
        const card = document.createElement("div");
        card.className = "res-card-item";
        card.style.background = resGradients[index % resGradients.length];
        
        card.innerHTML = `
            <img src="${item.logo}" alt="${item.name}">
            <span>${item.name}</span>
            <div class="btn-res-visit">ভিজিট করুন</div>
        `;
        
        card.onclick = () => window.open(item.link, '_blank');
        container.appendChild(card);
    });
}
;

let currentHeicFiles = [];
let convertedHeicResults = [];

function openHeicModal() {
    if(typeof setActiveMode === "function") setActiveMode('mode-heic-converter');
    document.getElementById('heicConverterModal').style.display = 'flex';
}

function closeHeicModal() {
    document.getElementById('heicConverterModal').style.display = 'none';
}

// ফাইল সিলেক্ট করার লজিক
function handleHeicSelection(event) {
    const files = event.target.files;
    if (!files.length) return;
    
    currentHeicFiles = Array.from(files);
    const status = document.getElementById('heicStatus');
    status.style.display = 'flex';
    status.innerText = `${currentHeicFiles.length} file(s) selected. Click Convert to start.`;
    
    document.getElementById('convertHeicBtn').style.display = 'flex';
    document.getElementById('heicActionArea').style.display = "none";
    document.getElementById('previewHEIC').innerHTML = "";
    convertedHeicResults = [];
}

// কনভার্ট করার লজিক
async function processHeicConversion() {
    // ইমেজ আপলোড ছাড়া বাটন কাজ করবে না
    if (currentHeicFiles.length === 0) return;

    const btn = document.getElementById('convertHeicBtn');
    const actionArea = document.getElementById('heicActionArea');
    const status = document.getElementById('heicStatus');
    const format = document.getElementById('heicFormatSelect').value;
    const quality = parseFloat(document.getElementById('heicQualityRange').value);
    const previewArea = document.getElementById('previewHEIC');

    btn.style.display = "none";
    status.style.display = 'flex';
    previewArea.innerHTML = "";
    convertedHeicResults = [];

    for (let i = 0; i < currentHeicFiles.length; i++) {
        const file = currentHeicFiles[i];
        status.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Processing (${i + 1}/${currentHeicFiles.length}): ${file.name}`;

        try {
            // HEIC to Blob
            let resultBlob = await heic2any({
                blob: file,
                toType: format === 'image/webp' ? 'image/jpeg' : format,
                quality: quality
            });

            if (Array.isArray(resultBlob)) resultBlob = resultBlob[0];

            // WebP Support via Canvas
            if (format === 'image/webp') {
                resultBlob = await convertHeicToWebP(resultBlob, quality);
            }

            const url = URL.createObjectURL(resultBlob);
            const ext = format.split('/')[1].replace('jpeg', 'jpg');
            const newName = file.name.replace(/\.[^/.]+$/, "") + "." + ext;

            convertedHeicResults.push({ url, name: newName });

            // Preview UI
            const card = document.createElement('div');
            card.style = "background:#fff; border:1px solid #ddd; border-radius:12px; padding:8px; text-align:center; width:120px; box-shadow:0 2px 5px rgba(0,0,0,0.05);";
            card.innerHTML = `
                <img src="${url}" style="width:100px; height:100px; object-fit:cover; border-radius:8px; margin-bottom:5px;">
                <div style="font-size:9px; font-weight:700; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; color:#4b5563; margin-bottom:5px;">${newName}</div>
                <a href="${url}" download="${newName}" style="display:inline-block; padding:4px 8px; background:#0ea5e9; color:#fff; border-radius:4px; font-size:9px; font-weight:800; text-decoration:none;" class="single-dl">DOWNLOAD</a>
            `;
            previewArea.appendChild(card);

        } catch (err) {
            console.error("Error converting " + file.name, err);
        }
    }

    status.innerText = "Conversion Finished!";
    actionArea.style.display = "grid";
}

// WebP Helper
function convertHeicToWebP(blob, quality) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            canvas.toBlob(b => resolve(b), 'image/webp', quality);
        };
        img.src = URL.createObjectURL(blob);
    });
}

// ডাউনলোড লজিক
function downloadAllConvertedHeic() {
    if (convertedHeicResults.length === 0) return;
    
    convertedHeicResults.forEach((file, index) => {
        setTimeout(() => {
            const link = document.createElement('a');
            link.href = file.url;
            link.download = file.name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }, index * 500); // গ্যাপ রাখা হয়েছে যাতে ব্রাউজার ব্লক না করে
    });
}

function resetHeicTool() {
    currentHeicFiles = [];
    convertedHeicResults = [];
    document.getElementById('heicInput').value = "";
    document.getElementById('previewHEIC').innerHTML = "";
    document.getElementById('heicStatus').style.display = "none";
    document.getElementById('heicActionArea').style.display = "none";
    document.getElementById('convertHeicBtn').style.display = 'flex';
}
;

let fqQuestions = [];
let fqLogoSrc = null;
let fqLang = "bn";

function openFqModal() {
    const modal = document.getElementById('fqMakerModal');
    if (modal) {
        modal.style.display = 'flex';
        if(typeof setActiveMode === "function") setActiveMode('mode-fq-maker');
        setFqLang(fqLang);
    }
}

function closeFqModal() {
    document.getElementById('fqMakerModal').style.display = 'none';
}

function toFqNum(n) {
    if (fqLang !== 'bn') return n;
    const digits = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
    return n.toString().replace(/\d/g, d => digits[d]);
}

function setFqLang(lang) {
    fqLang = lang;
    document.getElementById('fq-btn-bn').classList.toggle('active', lang === 'bn');
    document.getElementById('fq-btn-en').classList.toggle('active', lang === 'en');
    
    const ui = {
        bn: { title: "পরীক্ষার প্রশ্নপত্র মেকার", step1: "১. প্রতিষ্ঠানের তথ্য", step2: "২. প্রশ্নপত্র তৈরি করুন", btnP: "প্রিন্ট করুন", btnR: "সব মুছুন", inst: "প্রতিষ্ঠানের নাম", exam: "পরীক্ষার নাম", cls: "শ্রেণি", sub: "বিষয়", time: "সময়", marks: "পূর্ণমান", addDesc: "+ বড় প্রশ্ন", addMcq: "+ MCQ প্রশ্ন" },
        en: { title: "Exam Question Paper Maker", step1: "1. Institution Info", step2: "2. Create Questions", btnP: "Direct Print", btnR: "Clear All", inst: "Institution Name", exam: "Exam Title", cls: "Class", sub: "Subject", time: "Time", marks: "Marks", addDesc: "+ Descriptive Q.", addMcq: "+ MCQ Question" }
    };
    
    document.getElementById('fq-main-title').innerText = ui[lang].title;
    document.getElementById('lbl-step1').innerText = ui[lang].step1;
    document.getElementById('lbl-step2').innerText = ui[lang].step2;
    document.getElementById('fq-name').placeholder = ui[lang].inst;
    document.getElementById('fq-exam-title').placeholder = ui[lang].exam;
    document.getElementById('fq-class').placeholder = ui[lang].cls;
    document.getElementById('fq-sub').placeholder = ui[lang].sub;
    document.getElementById('fq-time').placeholder = ui[lang].time;
    document.getElementById('fq-marks').placeholder = ui[lang].marks;
    document.getElementById('btn-add-desc').innerText = ui[lang].addDesc;
    document.getElementById('btn-add-mcq').innerText = ui[lang].addMcq;
    document.getElementById('btn-fq-print').innerHTML = `<i class='fa-solid fa-print'></i> ${ui[lang].btnP}`;
    document.getElementById('btn-fq-reset').innerHTML = `<i class='fa-solid fa-trash-can'></i> ${ui[lang].btnR}`;
    
    renderFqInputs();
    drawFq();
}

function loadFqLogo(event) {
    const reader = new FileReader();
    reader.onload = (e) => {
        fqLogoSrc = e.target.result;
        document.getElementById('fq-logo-pv').src = fqLogoSrc;
        document.getElementById('fq-logo-pv').style.display = 'flex';
        document.getElementById('fq-plus-ico').style.display = 'none';
        drawFq();
    };
    reader.readAsDataURL(event.target.files[0]);
}

function addFqItem(type) {
    fqQuestions.push({ id: Date.now(), type, qText: '', options: ['', '', '', ''], marks: '' });
    renderFqInputs();
    drawFq();
}

function removeFqItem(id) {
    fqQuestions = fqQuestions.filter(q => q.id !== id);
    renderFqInputs();
    drawFq();
}

function updateFqData(id, field, val, optIdx = null) {
    const q = fqQuestions.find(i => i.id === id);
    if (optIdx !== null) q.options[optIdx] = val;
    else q[field] = val;
    drawFq();
}

function renderFqInputs() {
    const container = document.getElementById('fq-questions-container');
    if (!container) return;
    container.innerHTML = "";

    fqQuestions.forEach((q, index) => {
        const div = document.createElement('div');
        div.className = "fq-q-card";

        const qLabel = (fqLang === 'bn') ? 'প্রশ্ন' : 'Question';
        const qPlace = (fqLang === 'bn') ? 'প্রশ্ন লিখুন...' : 'Type question...';
        const optPlace = (fqLang === 'bn') ? 'অপশন' : 'Option';
        const marksPlace = (fqLang === 'bn') ? 'মার্কস' : 'Marks';

        let html = `<button class="fq-rem-btn" onclick="removeFqItem(${q.id})">&times;</button>
            <small style="font-weight:800; color:#4f46e5;">${qLabel} ${toFqNum(index+1)} (${q.type === 'mcq' ? 'MCQ' : (fqLang === 'bn' ? 'বড়' : 'Descriptive')})</small>
            <textarea placeholder="${qPlace}" oninput="updateFqData(${q.id}, 'qText', this.value)">${q.qText}</textarea>`;
        
        if (q.type === 'mcq') {
            html += `<div class="fq-grid-2">
                ${q.options.map((opt, i) => `
                    <input placeholder="${optPlace} ${toFqNum(i+1)}" value="${opt}" oninput="updateFqData(${q.id}, 'options', this.value, ${i})"/>
                `).join('')}
            </div>`;
        }

        html += `<input placeholder="${marksPlace}" value="${q.marks}" oninput="updateFqData(${q.id}, 'marks', this.value)" style="width:85px; margin-top:5px; font-weight:bold;"/>`;
        
        div.innerHTML = html;
        container.appendChild(div);
    });
}

function drawFq() {
    const inst = document.getElementById('fq-name').value || (fqLang === 'bn' ? "প্রতিষ্ঠানের নাম" : "Institution Name");
    const exam = document.getElementById('fq-exam-title').value || (fqLang === 'bn' ? "পরীক্ষার নাম" : "Exam Title");
    const labels = fqLang === 'bn' ? ['শ্রেণি', 'বিষয়', 'সময়', 'পূর্ণমান'] : ['Class', 'Subject', 'Time', 'Marks'];
    const optLabels = fqLang === 'bn' ? ['(ক)', '(খ)', '(গ)', '(ঘ)'] : ['(a)', '(b)', '(c)', '(d)'];

    let html = `<div style="text-align:center; border-bottom: 2px solid #000; padding-bottom: 8px; margin-bottom: 10px;">
                    ${fqLogoSrc ? `<img src="${fqLogoSrc}" style="height:45px; margin-bottom:5px;">` : ''}
                    <h1 style="margin:0; font-size:20px;">${inst}</h1>
                    <h2 style="margin:2px 0; font-size:15px;">${exam}</h2>
                </div>
                <div style="display:flex; justify-content:space-between; font-weight:bold; border-bottom: 1px solid #000; padding-bottom:5px; margin-bottom:15px; font-size:13px;">
                    <span>${labels[0]}: ${document.getElementById('fq-class').value}</span>
                    <span>${labels[1]}: ${document.getElementById('fq-sub').value}</span>
                    <span>${labels[2]}: ${document.getElementById('fq-time').value}</span>
                    <span>${labels[3]}: ${toFqNum(document.getElementById('fq-marks').value)}</span>
                </div>`;

    fqQuestions.forEach((q, index) => {
        html += `<div style="margin-bottom:10px; line-height:1.4;">
                    <div style="display:flex; justify-content:space-between;">
                        <span><b>${toFqNum(index+1)}.</b> ${q.qText}</span>
                        <b>${toFqNum(q.marks)}</b>
                    </div>
                    ${q.type === 'mcq' ? `<div style="display:grid; grid-template-columns: 1fr 1fr; margin-left:20px; font-size:12px;">
                        ${q.options.map((opt, i) => `<span>${optLabels[i]} ${opt}</span>`).join('')}
                    </div>` : ''}
                </div>`;
    });
    document.getElementById('fq-render-area').innerHTML = html;
}

function printFqPaper() {
    const printContent = document.getElementById('fq-render-area').innerHTML;
    const printWindow = window.open('', '', 'height=800,width=1000');
    printWindow.document.write('<html><head><title>Question Paper</title>');
    printWindow.document.write('<link href="https://fonts.maateen.me/solaiman-lipi/font.css" rel="stylesheet">');
    printWindow.document.write('<style>body{margin:0;padding:0;background:#fff;}#print-wrapper{width:210mm;height:297mm;padding:20mm;box-sizing:border-box;font-family:"SolaimanLipi",Arial,sans-serif!important;font-size:14px;color:#000;}#print-wrapper * {font-family:"SolaimanLipi",Arial,sans-serif!important;} @page{size:A4;margin:0;}h1,h2{margin:5px 0;text-align:center;}</style></head><body>');
    printWindow.document.write('<div id="print-wrapper">' + printContent + '</div>');
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    setTimeout(() => { printWindow.print(); printWindow.close(); }, 700);
}

function resetFqTool() {
    document.querySelectorAll('#fqMakerModal input').forEach(i => i.value = "");
    document.querySelectorAll('#fqMakerModal textarea').forEach(i => i.value = "");
    fqQuestions = []; fqLogoSrc = null;
    document.getElementById('fq-logo-pv').style.display = 'none';
    document.getElementById('fq-plus-ico').style.display = 'flex';
    renderFqInputs(); drawFq();
}
;

function openAgreementModal() {
    setActiveMode('mode-agreement');
    document.getElementById('agreementModal').style.display = 'flex';
    setAgLang('bn');
    setTimeout(adjustAgPreviewScale, 300);
}

let agLang = 'bn';

const agTemplates = {
  bn: {
    rent: { 
      title: 'আবাসিক বাসা ভাড়ার চুক্তিপত্র', 
      text: 'অদ্য ইংরেজি {{val2}} তারিখে এই বাসা ভাড়ার চুক্তিপত্র সম্পাদিত হইল। প্রথম পক্ষ (মালিক): {{name}}, পিতা: ...................., ঠিকানা: {{address}}। দ্বিতীয় পক্ষ (ভাড়াটিয়া): {{p2}}, পিতা: ...................., স্থায়ী ঠিকানা: ....................। শর্তাবলী: ১) অত্র ফ্ল্যাটের মাসিক ভাড়া {{val1}} টাকা মাত্র যা প্রতি মাসের ৫ তারিখের মধ্যে পরিশোধযোগ্য। ২) অগ্রিম জামানত বাবদ ............ টাকা প্রথম পক্ষ বুঝিয়া পাইলেন। ৩) চুক্তির মেয়াদ অদ্য হইতে পরবর্তী ২ (দুই) বছরের জন্য বলবৎ থাকিবে। ৪) বিদ্যুৎ, গ্যাস ও পানির বিল দ্বিতীয় পক্ষ বহন করিবেন। ৫) ফ্ল্যাটের কোনো আসবাবপত্র বা দেয়ালের ক্ষতি হইলে দ্বিতীয় পক্ষ নিজ খরচে মেরামত করিয়া দিবেন। ৬) কোনো পক্ষ চুক্তি বাতিল করিতে চাহিলে ৩ মাস পূর্বে লিখিত নোটিশ প্রদান করিতে হইবে। ৭) অসামাজিক কোনো কাজে লিপ্ত হইলে মালিক বিনা নোটিশে উচ্ছেদ করার অধিকার রাখেন। উভয় পক্ষ সজ্ঞানে অত্র চুক্তিতে স্বাক্ষর করিলেন।' 
    },
    land: { 
      title: 'জমি বিক্রয় বায়না চুক্তিপত্র', 
      text: 'আমি প্রথম পক্ষ (বিক্রেতা): {{name}}, পিতা: {{witness}}, সাং: .................। আপনি দ্বিতীয় পক্ষ (ক্রেতা): {{p2}}। নিম্ন তফশিল বর্ণিত জমি বিক্রয়ের প্রস্তাব করিলে আপনি তাহা ক্রয় করিতে সম্মত হইয়াছেন। জমির মোট মূল্য নির্ধারণ করা হইয়াছে {{val1}} টাকা। অদ্য বায়না বাবদ নগদ ........... টাকা প্রদান করা হইল। শর্তাবলী: ১) অবশিষ্ট টাকা আগামী {{val2}} মাসের মধ্যে পরিশোধ করিয়া দলিল রেজিষ্ট্রি করিয়া লইতে হইবে। ২) বিক্রেতা এই মর্মে অঙ্গীকার করিতেছেন যে, জমিটি সকল প্রকার দায়-মুক্ত ও নিষ্কণ্টক। ৩) নির্ধারিত সময়ের মধ্যে ক্রেতা সম্পূর্ণ মূল্য পরিশোধে ব্যর্থ হইলে বায়ানার টাকা বাজেয়াপ্ত হইবে। ৪) যদি বিক্রেতা দলিল দিতে অস্বীকার করেন তবে ক্রেতা আদালতের মাধ্যমে দলিল করিয়া লইতে পারিবেন। ৫) অদ্য হইতে জমির দখল ক্রেতা বুঝিয়া পাইলেন। সাক্ষীদের উপস্থিতিতে অত্র চুক্তি স্বাক্ষরিত হইল।' 
    },
    shop: { 
      title: 'দোকান ঘর ভাড়ার চুক্তিপত্র', 
      text: 'দোকান মালিক (প্রথম পক্ষ): {{name}}, ঠিকানা: {{address}}। দোকান ভাড়াটিয়া (দ্বিতীয় পক্ষ): {{p2}}। অত্র চুক্তিপত্রের শর্ত নিম্নরূপ: ১) দোকানের অগ্রিম জামানত বাবদ {{val1}} টাকা দ্বিতীয় পক্ষ প্রদান করিলেন। ২) মাসিক ভাড়া নির্ধারণ করা হইল ........... টাকা। ৩) চুক্তির মেয়াদ {{val2}} বছর পর্যন্ত বলবৎ থাকিবে। ৪) দোকান ঘরের ট্রেড লাইসেন্স ও আনুষঙ্গিক কর দ্বিতীয় পক্ষ বহন করিবেন। ৫) দোকান ঘরের অভ্যন্তরীণ সাজসজ্জা ভাড়াটিয়া নিজ খরচে করিবেন, তবে মূল কাঠামোর পরিবর্তন করা যাইবে না। ৬) মেয়াদ শেষে দোকান ছাড়িতে হইলে ৩ মাস পূর্বে নোটিশ দিতে হইবে এবং মালিককে পূর্বের অবস্থায় দোকান বুঝাইয়া দিতে হইবে। ৭) প্রতি মাসের ভাড়া পরবর্তী মাসের ৭ তারিখের মধ্যে পরিশোধ করিতে হইবে। ৮) কোনো পক্ষ শর্ত ভঙ্গ করিলে আইনত ব্যবস্থা গ্রহণ করা যাইবে।' 
    },
    money: { 
      title: 'টাকা ধারের অঙ্গীকারনামা', 
      text: 'দাতা: {{p2}}, গ্রহিতা: {{name}}, পিতা: {{witness}}। আমি গ্রহিতা বিশেষ ব্যবসায়িক প্রয়োজনে দ্বিতীয় পক্ষের নিকট হইতে নগদ {{val1}} টাকা ঋণ হিসেবে গ্রহণ করিলাম। শর্তাবলী: ১) উক্ত টাকা সম্পূর্ণ সুদমুক্ত ধার হিসেবে গণ্য হইবে। ২) আমি অঙ্গীকার করিতেছি যে, আগামী {{val2}} তারিখের মধ্যে উক্ত টাকা এককালীন পরিশোধ করিব। ৩) যদি আমি নির্ধারিত সময়ে টাকা পরিশোধ করিতে ব্যর্থ হই, তবে পাওনাদার আমার বিরুদ্ধে প্রচলিত আইনে মামলা দায়ের করিয়া টাকা আদায় করিতে পারিবেন। ৪) টাকার বিনিময়ে আমি কোনো স্থাবর সম্পত্তি বন্ধক রাখিলে তাহা পাওনাদারের অধীনে থাকিবে। ৫) অত্র চুক্তিতে সাক্ষ্য প্রদানকারী ব্যক্তিগণ এই লেনদেনের সাক্ষী হিসেবে গণ্য হইবেন। আমি সুস্থ মস্তিষ্কে কারো প্ররোচনা ছাড়াই এই অঙ্গীকারনামায় স্বাক্ষর করিলাম।' 
    },
    car: { 
      title: 'মোটরযান বিক্রয় ও হস্তান্তর চুক্তি', 
      text: 'বিক্রেতা: {{name}}, ক্রেতা: {{p2}}। গাড়ির বিবরণ: {{address}}, ইঞ্জিন নং: ..............., চেসিস নং: ...............। বিক্রয় মূল্য: {{val1}} টাকা। অদ্য ক্রেতা বিক্রেতাকে সমুদয় টাকা বুঝাইয়া দিলেন। শর্তাবলী: ১) অদ্য হইতে গাড়ির মালিকানা ও দখল ক্রেতার নিকট অর্পিত হইল। ২) গাড়ির পূর্ববর্তী সকল মামলা, ট্যাক্স টোকেন ও বকেয়া বিক্রেতা পরিশোধ করিলেন। ৩) অদ্যকার পর হইতে গাড়ির যে কোনো দুর্ঘটনা বা অপরাধমূলক কাজের দায়ভার ক্রেতা {{p2}} এর উপর বর্তাইবে। ৪) আগামী {{val2}} দিনের মধ্যে নামজারী বা মালিকানা পরিবর্তনের জন্য বিক্রেতা প্রয়োজনীয় সকল দলিলে স্বাক্ষর প্রদান করিবেন। ৫) ভবিষ্যতে বিক্রেতা এই গাড়ির উপর আর কোনো দাবি করিতে পারিবেন না। উভয় পক্ষ এই চুক্তিতে স্বেচ্ছায় স্বাক্ষর প্রদান করিলেন।' 
    },
    partnership: { 
      title: 'অংশীদারিত্ব ব্যবসায়িক চুক্তিপত্র', 
      text: 'অংশীদারগণ: ১) {{name}}, ২) {{p2}}। ব্যবসার নাম: ...................., ঠিকানা: {{address}}। শর্তাবলী: ১) ব্যবসায় মোট মূলধন {{val1}} টাকা, যাহা উভয় পক্ষ সমানভাবে অথবা আনুপাতিক হারে বিনিয়োগ করিলেন। ২) ব্যবসার লাভ-ক্ষতি বিনিয়োগের অনুপাত অনুযায়ী বন্টন করা হইবে। ৩) চুক্তির মেয়াদ আগামী {{val2}} বছর পর্যন্ত বলবৎ থাকিবে। ৪) ব্যবসার সকল হিসাব-নিকাশ একটি নির্দিষ্ট ব্যাংক অ্যাকাউন্টের মাধ্যমে পরিচালিত হইবে এবং উভয় পক্ষের স্বাক্ষর আবশ্যক। ৫) কোনো অংশীদার ব্যবসা ত্যাগ করিতে চাহিলে ৬ মাস পূর্বে অবহিত করিতে হইবে। ৬) নতুন অংশীদার গ্রহণ করিতে হইলে সকল অংশীদারের লিখিত সম্মতি প্রয়োজন। ৭) ব্যবসার সকল নথিপত্র প্রধান কার্যালয়ে সংরক্ষিত থাকিবে। ৮) মতবিরোধ দেখা দিলে আপোষ-মীমাংসা বা সালিশি আইনের মাধ্যমে সমাধান করা হইবে।' 
    },
    construction: { 
      title: 'বাড়ি নির্মাণ কাজের চুক্তিপত্র', 
      text: 'মালিক: {{name}}, ঠিকাদার: {{p2}}। কাজের স্থান: {{address}}। শর্তাবলী: ১) ভবনটি অনুমোদিত নকশা অনুযায়ী নির্মাণ করিতে হইবে। ২) মোট বাজেট ধরা হইয়াছে {{val1}} টাকা। ৩) কাজ সম্পন্ন করার শেষ সময় {{val2}} তারিখ নির্ধারণ করা হইল। ৪) ব্যবহৃত রড, সিমেন্ট ও অন্যান্য উপকরণের গুণগত মান মালিকের পর্যবেক্ষণ অনুযায়ী হইতে হইবে। ৫) যদি নির্ধারিত সময়ে কাজ শেষ না হয়, তবে ঠিকাদারকে জরিমানা প্রদান করিতে হইবে। ৬) শ্রমিকের নিরাপত্তার দায়িত্ব ঠিকাদারের থাকিবে। ৭) কাজের অগ্রগতির ভিত্তিতে কিস্তিতে টাকা পরিশোধ করা হইবে। ৮) কোনো ত্রুটিপূর্ণ কাজ ধরা পড়িলে ঠিকাদারকে নিজ খরচে তাহা পুনঃনির্মাণ করিয়া দিতে হইবে। মালিক ও ঠিকাদার সজ্ঞানে এই চুক্তিতে আবদ্ধ হইলেন।' 
    },
    flat: { 
      title: 'ফ্ল্যাট বিক্রয় চুক্তিপত্র', 
      text: 'বিক্রেতা: {{name}}, ক্রেতা: {{p2}}। ফ্ল্যাটের ঠিকানা: {{address}}, আয়তন: ............ বর্গফুট। মোট মূল্য: {{val1}} টাকা। অদ্য বুকিং মানি বাবদ নগদ ........... টাকা পরিশোধ করা হইল। শর্তাবলী: ১) বাকি টাকা আগামী {{val2}} তারিখের মধ্যে অথবা কিস্তির মাধ্যমে পরিশোধযোগ্য। ২) ফ্ল্যাট হস্তান্তরের সময় রেজিষ্ট্রেশন ও মিউটেশন সম্পন্ন করিয়া দিতে হইবে। ৩) ফ্ল্যাট নির্মাণে ব্যবহৃত ফিক্সচারসমূহ চুক্তিতে বর্ণিত মান অনুযায়ী হইতে হইবে। ৪) যদি বিক্রেতা ফ্ল্যাট দিতে ব্যর্থ হন, তবে মূল টাকার দ্বিগুণ ফেরত দিতে বাধ্য থাকিবেন। ৫) কমন স্পেস ব্যবহারের নিয়মাবলী সরকারি আইন মোতাবেক হইবে। ৬) গ্যাস, বিদ্যুৎ ও পানি সংযোগের খরচ ক্রেতা বহন করিবেন। উভয় পক্ষ শর্তাবলী মানিয়া চলিতে বাধ্য থাকিবেন।' 
    },
    loan: { 
      title: 'ঋণ পরিশোধের আইনি অঙ্গীকারনামা', 
      text: 'আমি {{name}}, পিতা: {{witness}}, অত্র অঙ্গীকারনামা দ্বারা ঘোষণা করিতেছি যে, আমি দ্বিতীয় পক্ষ {{p2}} এর নিকট হইতে ব্যক্তিগত প্রয়োজনে {{val1}} টাকা ঋণ গ্রহণ করিয়াছি। আমি অঙ্গীকার করিতেছি যে, উক্ত টাকা আগামী {{val2}} তারিখের মধ্যে অথবা নিম্নোক্ত কিস্তি অনুযায়ী পরিশোধ করিব। শর্তাবলী: ১) কোনো কারণে আমি মৃত্যুবরণ করিলে আমার উত্তরসূরিগণ এই ঋণ পরিশোধে বাধ্য থাকিবে। ২) ঋণের টাকা পরিশোধে বিলম্ব হইলে আইনত দণ্ডনীয় হইব। ৩) পাওনাদার চাইলে আমার স্থাবর সম্পত্তি হইতে পাওনা টাকা আদায়ের অধিকার রাখিবেন। ৪) কোনো ওজর-আপত্তি ছাড়াই টাকা ফেরত দিতে আমি অঙ্গীকারবদ্ধ। ৫) পাওনাদার কর্তৃক প্রদত্ত রসিদ পরিশোধের প্রমাণ হিসেবে গণ্য হইবে। অত্র দলিলটি একটি সাক্ষ্য হিসেবে সংরক্ষিত থাকিবে।' 
    },
    servant: { 
      title: 'গৃহকর্মী বা ব্যক্তিগত কর্মচারী নিয়োগ চুক্তি', 
      text: 'নিয়োগকারী: {{name}}, কর্মচারী: {{p2}}। কর্মস্থল: {{address}}। মাসিক বেতন: {{val1}} টাকা। শর্তাবলী: ১) কর্মচারীকে প্রতিদিন সকাল ........... হইতে রাত ........... পর্যন্ত ডিউটি পালন করিতে হইবে। ২) নিয়োগের মেয়াদ অদ্য হইতে {{val2}} মাস/বছর বলবৎ থাকিবে। ৩) কর্মচারীর সততা ও নিষ্ঠার সাথে কাজ করিতে হইবে, কোনো প্রকার চুরির প্রমাণ পাওয়া গেলে তাকে তাৎক্ষণিক বরখাস্ত ও আইনগত ব্যবস্থা নেওয়া হইবে। ৪) মাসে ২ দিন ছুটি ভোগের অধিকার থাকিবে। ৫) নিয়োগকারী কর্মচারীর নিরাপত্তা ও খাদ্যের বিষয় বিবেচনা করিবেন। ৬) চাকরি ছাড়িতে হইলে ১ মাস পূর্বে নোটিশ দিতে হইবে। ৭) বেতন মাসের ১০ তারিখের মধ্যে পরিশোধ করা হইবে। উভয় পক্ষ শর্তাবলীতে একমত হইয়া স্বাক্ষর করিলেন।' 
    },
    lease: { 
      title: 'দীর্ঘমেয়াদী জমি লিজ বা ইজারা চুক্তি', 
      text: 'লিজ দাতা: {{name}}, লিজ গ্রহিতা: {{p2}}। জমির অবস্থান ও বিবরণ: {{address}}। লিজের মেয়াদ: {{val2}} বছর। বাৎসরিক লিজ ফি: {{val1}} টাকা। শর্তাবলী: ১) লিজ গ্রহিতা উক্ত জমিতে কেবলমাত্র চুক্তিতে উল্লিখিত ফসল বা কাঠামো নির্মাণ করিতে পারিবেন। ২) প্রতি বছরের ফি অগ্রিম পরিশোধযোগ্য। ৩) মেয়াদ শেষে লিজ গ্রহিতা জমিটি পূর্বের অবস্থায় দাতার নিকট বুঝাইয়া দিবেন। ৪) দাতা লিজের মেয়াদের মধ্যে জমিতে কোনো বিঘ্ন ঘটাইতে পারিবেন না। ৫) সরকারি কোনো খাজনা বা কর দাতা পরিশোধ করিবেন। ৬) লিজ গ্রহিতা জমিটি তৃতীয় পক্ষের নিকট হস্তান্তর বা উপ-লিজ দিতে পারিবেন না। ৭) শর্ত ভঙ্গে লিজ বাতিল বলিয়া গণ্য হইবে। সাক্ষীদের উপস্থিতিতে অদ্য চুক্তিপত্রটি সম্পাদিত হইল।' 
    },
    marriage_ag: { 
      title: 'দেনমোহর ও দাম্পত্য অধিকার সংক্রান্ত অঙ্গীকারনামা', 
      text: 'আমি {{name}}, পিতা: {{witness}}, অত্র অঙ্গীকারনামা প্রদান করিতেছি যে, আমার স্ত্রী {{p2}} এর পাওনা দেনমোহর বাবদ {{val1}} টাকা ধার্য করা হইয়াছে। অদ্য তারিখে আমি দেনমোহর বাবদ ........... টাকা নগদ পরিশোধ করিলাম। শর্তাবলী: ১) বাকি টাকা ভবিষ্যতে আমি স্ত্রীর চাহিবা মাত্র অথবা কিস্তিতে পরিশোধে বাধ্য থাকিব। ২) আমি আমার স্ত্রীর ভরণ-পোষণ ও সামাজিক নিরাপত্তা বজায় রাখিব। ৩) দাম্পত্য জীবনে কোনো প্রকার নির্যাতন বা অমানবিক আচরণ করিব না। ৪) আমাদের সন্তানদের উজ্জ্বল ভবিষ্যতের জন্য আমি সচেষ্ট থাকিব। ৫) অদ্য {{val2}} তারিখে আমরা এই অঙ্গীকারে আবদ্ধ হইলাম। আমাদের দাম্পত্য জীবন সুখের ও দীর্ঘস্থায়ী হউক। এই অঙ্গীকারনামা আমাদের মধ্যকার সকল ভুল বোঝাবুঝি অবসানের দলিল হিসেবে গণ্য হইবে।' 
    },
    transport: { 
      title: 'পরিবহন বা যানবহন ভাড়া চুক্তিপত্র', 
      text: 'যানবাহন মালিক: {{name}}, ভাড়াটিয়া: {{p2}}। যানের বিবরণ: {{address}}। শর্তাবলী: ১) দৈনিক/মাসিক ভাড়া {{val1}} টাকা নির্ধারণ করা হইল। ২) জ্বালানি খরচ ও পার্কিং ফি ভাড়াটিয়া বহন করিবেন। ৩) চুক্তির মেয়াদ {{val2}} পর্যন্ত বলবৎ থাকিবে। ৪) কোনো যান্ত্রিক ত্রুটি দেখা দিলে মালিক মেরামত করিবেন, তবে দুর্ঘটনাজনিত ক্ষতি ভাড়াটিয়া বহন করিবেন। ৫) চালকের লাইসেন্স ও প্রয়োজনীয় কাগজপত্র মালিক নিশ্চিত করিবেন। ৬) গাড়িটি কোনো প্রকার অবৈধ কাজে ব্যবহার করা যাইবে না। ৭) নির্দিষ্ট সময় শেষে গাড়িটি মালিককে বুঝাইয়া দিতে হইবে। ৮) কোনো দুর্ঘটনা ঘটিলে তাৎক্ষণিক মালিককে অবহিত করিতে হইবে। উভয় পক্ষ অত্র চুক্তিতে একমত পোষণ করিলেন।' 
    },
    event: { 
      title: 'ইভেন্ট ম্যানেজমেন্ট বা অনুষ্ঠান পরিচালনা চুক্তি', 
      text: 'আয়োজক/ক্লায়েন্ট: {{name}}, ইভেন্ট ডিরেক্টর: {{p2}}। অনুষ্ঠানের স্থান: {{address}}। ইভেন্ট সম্পন্ন হওয়ার তারিখ: {{val2}}। মোট চুক্তি মূল্য: {{val1}} টাকা। শর্তাবলী: ১) অগ্রিম ৫০% টাকা অদ্য প্রদান করা হইল। ২) ডেকোরেশন, খাবার ও সাউন্ড সিস্টেমের গুণগত মান নিশ্চিত করিতে হইবে। ৩) অনুষ্ঠানে কোনো বিঘ্ন ঘটিলে ইভেন্ট ডিরেক্টর দায়ী থাকিবেন। ৪) প্রাকৃতিক দুর্যোগ বা জরুরি কারণে অনুষ্ঠান পিছিয়ে গেলে উভয় পক্ষের সম্মতিতে নতুন তারিখ নির্ধারণ হইবে। ৫) অতিরিক্ত কোনো সেবা চাহিলে অতিরিক্ত মূল্য পরিশোধ করিতে হইবে। ৬) অনুষ্ঠান শেষে বাকি টাকা পরিশোধযোগ্য। ৭) নির্ধারিত সময়ের মধ্যে কাজ শুরু ও শেষ করিতে হইবে। উভয় পক্ষ শর্তাবলীতে স্বাক্ষর করিলেন।' 
    },
    mortgage: { 
      title: 'স্থাবর সম্পত্তি বন্ধকী চুক্তিপত্র', 
      text: 'বন্ধক দাতা: {{name}}, বন্ধক গ্রহিতা: {{p2}}। বন্ধকী সম্পদের বিবরণ: {{address}}। ঋণের পরিমাণ: {{val1}} টাকা। শর্তাবলী: ১) ঋণের টাকা পরিশোধ না হওয়া পর্যন্ত সম্পদের মূল দলিল বন্ধক গ্রহিতার নিকট থাকিবে। ২) ঋণের মেয়াদ আগামী {{val2}} তারিখ পর্যন্ত। ৩) যদি দাতা নির্ধারিত সময়ে টাকা পরিশোধে ব্যর্থ হন, তবে গ্রহিতা উক্ত সম্পত্তি বিক্রয় করিয়া পাওনা টাকা আদায়ের অধিকার রাখিবেন। ৪) সম্পদের ভোগ-দখল চুক্তির শর্ত মোতাবেক দাতার নিকট থাকিবে। ৫) বন্ধকী পিরিয়ডে সম্পদের কোনো ক্ষতি সাধন করা যাইবে না। ৬) সরকারি কর ও খাজনা দাতা পরিশোধ করিবেন। ৭) ঋণ পরিশোধের সাথে সাথে দলিল ফেরত প্রদান করা হইবে। উভয় পক্ষ সজ্ঞানে অত্র দলিলে স্বাক্ষর করিলেন।' 
    },
    employment: {
      title: 'চাকরির নিয়োগপত্র ও অঙ্গীকারনামা',
      text: 'নিয়োগকারী প্রতিষ্ঠান: {{name}}, ঠিকানা: {{address}}। কর্মচারী: {{p2}}। পদবী: ...............। শর্তাবলী: ১) মাসিক বেতন {{val1}} টাকা এবং অন্যান্য ভাতা প্রযোজ্য ক্ষেত্রে প্রদান করা হইবে। ২) ডিউটির সময় সকাল ৯টা হইতে সন্ধ্যা ৬টা পর্যন্ত। ৩) পরীক্ষার কাল (Probation Period) {{val2}} মাস। ৪) কর্মচারী প্রতিষ্ঠানের সকল গোপনীয়তা রক্ষা করিবেন। ৫) প্রতিষ্ঠানের স্বার্থের পরিপন্থী কোনো কাজে লিপ্ত হইলে তাৎক্ষণিক বহিষ্কার করা হইবে। ৬) পদত্যাগ করিতে চাইলে ১ মাস পূর্বে লিখিত নোটিশ প্রদান করিতে হইবে। ৭) সকল প্রকার ছুটির জন্য কর্তৃপক্ষের পূর্বানুমতি আবশ্যক। ৮) প্রতিষ্ঠানের শৃঙ্খলা বজায় রাখা কর্মচারীর মৌলিক দায়িত্ব। নিয়োগকারী ও কর্মচারী উভয় পক্ষ এই শর্তাবলীতে একমত।'
    },
    security: {
      title: 'নিরাপত্তা গার্ড বা সিকিউরিটি সার্ভিস চুক্তি',
      text: 'ক্লায়েন্ট: {{name}}, সিকিউরিটি এজেন্সি: {{p2}}। সেবার স্থান: {{address}}। শর্তাবলী: ১) এজেন্সি প্রতিদিন ২৪ ঘণ্টা নিরাপত্তার জন্য গার্ড সরবরাহ করিবে। ২) প্রতি মাসে সার্ভিস চার্জ হিসেবে {{val1}} টাকা প্রদান করিতে হইবে। ৩) চুক্তির মেয়াদ {{val2}} মাস পর্যন্ত। ৪) ডিউটিরত অবস্থায় কোনো চুরি বা ক্ষয়ক্ষতি হইলে এজেন্সি তদন্ত সাপেক্ষে ক্ষতিপূরণ দিতে বাধ্য থাকিবে। ৫) গার্ডদের ইউনিফর্ম ও আনুষঙ্গিক সরঞ্জাম এজেন্সি প্রদান করিবে। ৬) কোনো গার্ডের আচরণ সন্তোষজনক না হইলে তাৎক্ষণিক পরিবর্তন করিয়া দিতে হইবে। ৭) বিল পরবর্তী মাসের ৫ তারিখের মধ্যে পরিশোধ করিতে হইবে। ৮) উভয় পক্ষ নোটিশের মাধ্যমে চুক্তি বাতিল করিতে পারিবে।'
    },
    supply: {
      title: 'পণ্য সরবরাহ বা সাপ্লাই চুক্তিপত্র',
      text: 'সরবরাহকারী: {{name}}, ক্রেতা: {{p2}}। পণ্যের বিবরণ: {{address}}। শর্তাবলী: ১) পণ্যের একক প্রতি মূল্য {{val1}} টাকা নির্ধারণ করা হইল। ২) পণ্য সরবরাহের শেষ তারিখ {{val2}}। ৩) মানসম্মত পণ্য সরবরাহ না করিলে ক্রেতা পণ্য ফেরত দিতে পারিবেন। ৪) ডেলিভারি খরচ সরবরাহকারী/ক্রেতা বহন করিবেন। ৫) পণ্যের বিল ডেলিভারির পর কিস্তিতে বা এককালীন পরিশোধযোগ্য। ৬) জরুরি প্রয়োজনে অর্ডারের পরিমাণ পরিবর্তন করা যাইতে পারে। ৭) কোনো পক্ষ চুক্তি লঙ্ঘন করিলে বাজারমূল্য অনুযায়ী জরিমানা দিতে হইবে। ৮) অত্র চুক্তিপত্রের সকল কপি উভয় পক্ষের নিকট সংরক্ষিত থাকিবে।'
    },
    internet: {
      title: 'আইএসপি বা ইন্টারনেট সংযোগ চুক্তিপত্র',
      text: 'সেবা প্রদানকারী: {{name}}, গ্রাহক: {{p2}}। গ্রাহকের ঠিকানা: {{address}}। ব্যান্ডউইথ: ........... Mbps। মাসিক বিল: {{val1}} টাকা। শর্তাবলী: ১) সংযোগ প্রদানের মেয়াদ অদ্য হইতে {{val2}} বছর। ২) গ্রাহক প্রতি মাসের ১০ তারিখের মধ্যে বিল পরিশোধ করিবেন। ৩) কোনো টেকনিক্যাল সমস্যা হইলে সেবা প্রদানকারী ২৪ ঘণ্টার মধ্যে সমাধান করিবেন। ৪) রাউটার ও আনুষঙ্গিক যন্ত্রপাতি গ্রাহক নিজ দায়িত্বে রক্ষণাবেক্ষণ করিবেন। ৫) অবৈধ কোনো কাজে ইন্টারনেট ব্যবহার করা যাইবে না। ৬) বিল বকেয়া থাকিলে সংযোগ বিচ্ছিন্ন করার অধিকার সেবা প্রদানকারীর রহিয়াছে। ৭) পুনরায় সংযোগের জন্য চার্জ প্রদান করিতে হইবে। উভয় পক্ষ শর্তসমূহ মানিয়া চলিতে সম্মত হইলেন।'
    },
    freelance: {
      title: 'সফটওয়্যার বা আইটি প্রজেক্ট চুক্তিপত্র',
      text: 'ডেভেলপার: {{name}}, ক্লায়েন্ট: {{p2}}। প্রজেক্টের নাম: {{address}}। বাজেট: {{val1}} টাকা। প্রজেক্ট ডেলিভারি সময়: {{val2}}। শর্তাবলী: ১) প্রজেক্ট শুরুর আগে ৩০% টাকা অগ্রিম দিতে হইবে। ২) প্রজেক্ট চলাকালীন ডেভেলপার নিয়মিত আপডেট প্রদান করিবেন। ৩) ডেলিভারির পর ৩ মাস পর্যন্ত বাগ ফিক্সিং সাপোর্ট ফ্রি প্রদান করা হইবে। ৪) সোর্স কোড ক্লায়েন্টের সম্পত্তি হিসেবে গণ্য হইবে। ৫) অতিরিক্ত ফিচারের জন্য অতিরিক্ত পেমেন্ট করিতে হইবে। ৬) চুক্তির শর্ত ভঙ্গ করিলে প্রজেক্ট বাতিল বলিয়া গণ্য হইবে। ৭) কোনো গোপনীয় তথ্য তৃতীয় পক্ষের নিকট শেয়ার করা যাইবে না। অদ্য এই চুক্তিপত্রটি চূড়ান্ত বলিয়া গণ্য হইল।'
    }
  },
  en: {
    rent: { 
      title: 'Residential House Rent Agreement', 
      text: 'This Rental Agreement is executed on {{val2}} between First Party (Landlord): {{name}}, Address: {{address}} and Second Party (Tenant): {{p2}}. Terms and Conditions: 1) The monthly rent is fixed at {{val1}} payable by the 5th of each month. 2) A security deposit of ............ has been received by the landlord. 3) The lease period shall be for 2 years starting from today. 4) Utility bills including electricity, water, and gas shall be paid by the tenant. 5) The tenant shall not make any structural changes to the premises without written consent. 6) Either party can terminate this agreement by giving 3 months advance notice. 7) Any illegal activities within the premises will lead to immediate eviction. Both parties have signed this agreement in sound mind.' 
    },
    land: { 
      title: 'Land Sale Advance (Bayana) Agreement', 
      text: 'This agreement is made between Seller: {{name}} and Buyer: {{p2}}. The seller agrees to sell the land described at {{address}} for a total price of {{val1}}. An advance amount of ........... has been paid today. Conditions: 1) The remaining balance must be paid within {{val2}} months to complete the registration. 2) The seller guarantees that the land is free from all encumbrances and legal disputes. 3) If the buyer fails to pay the balance in time, the advance will be forfeited. 4) If the seller refuses to register the land, the buyer can seek legal remedy through court. 5) Physical possession is handed over to the buyer today. Signed by both parties in the presence of witnesses.' 
    },
    shop: { 
      title: 'Commercial Shop Lease Agreement', 
      text: 'Landlord: {{name}}, Tenant: {{p2}}. Location: {{address}}. Terms: 1) The tenant has paid an advance security deposit of {{val1}}. 2) Monthly rent is fixed at ........... per month. 3) This lease is valid for {{val2}} years. 4) The tenant is responsible for trade licenses and commercial taxes. 5) Internal decorations are allowed but the main structure cannot be altered. 6) The tenant must provide 3 months notice before vacating the shop. 7) Rent must be paid by the 7th of every month. 8) Legal action can be taken by either party for breach of contract. Executed on this day with full consent.' 
    },
    money: { 
      title: 'Financial Loan/Debt Agreement', 
      text: 'Lender: {{p2}}, Borrower: {{name}}, Father: {{witness}}. I, the borrower, have received a cash loan of {{val1}} from the lender for personal business needs. Terms: 1) This loan is interest-free. 2) I promise to repay the full amount by {{val2}}. 3) If I fail to repay on time, the lender has the right to file a legal suit to recover the money. 4) The borrower will be liable for all legal costs incurred. 5) Any property pledged as security will remain with the lender until full repayment. 6) This document serves as legal evidence of the debt. Signed voluntarily without any pressure.' 
    },
    vehicle: { 
      title: 'Vehicle Sale & Transfer Agreement', 
      text: 'Seller: {{name}}, Buyer: {{p2}}. Vehicle Details: {{address}}. Sale Price: {{val1}}. Conditions: 1) The seller has received full payment and handed over the keys and documents. 2) All previous taxes, fines, and legal issues are cleared by the seller. 3) From today, the buyer is solely responsible for any accidents or legal liabilities related to the vehicle. 4) The seller will provide necessary signatures for ownership transfer within {{val2}} days. 5) The seller waives all future claims on the vehicle. 6) Both parties have verified the engine and chassis numbers. Signed on this date.' 
    },
    partnership: { 
      title: 'Business Partnership Agreement', 
      text: 'Partners: {{name}} and {{p2}}. Business Name: ...................., Address: {{address}}. Terms: 1) Total investment is {{val1}} contributed as per agreed shares. 2) Profits and losses will be shared according to the investment ratio. 3) The partnership duration is {{val2}} years. 4) A joint bank account will be operated for all business transactions. 5) Any partner wishing to leave must give 6 months notice. 6) New partners can only be added with unanimous written consent. 7) Proper accounting records must be maintained and accessible to all partners. 8) Disputes will be settled through arbitration or mutual discussion.' 
    },
    construction: { 
      title: 'Building Construction Contract', 
      text: 'Owner: {{name}}, Contractor: {{p2}}. Site Location: {{address}}. Terms: 1) The building must be constructed as per the approved architectural plan. 2) The total budget is fixed at {{val1}}. 3) Completion date is set for {{val2}}. 4) High-quality materials like rod, cement, and sand must be used as specified. 5) Delay in completion will result in a penalty per day. 6) The contractor is responsible for the safety of laborers. 7) Payments will be made in installments based on progress. 8) Any structural defects must be rectified by the contractor at their own cost. Signed by both parties.' 
    },
    flat: { 
      title: 'Flat/Apartment Purchase Agreement', 
      text: 'Seller: {{name}}, Buyer: {{p2}}. Flat Address: {{address}}, Size: ............ Sqft. Total Price: {{val1}}. Booking money of ........... has been paid. Terms: 1) The balance amount shall be paid by {{val2}} or through installments. 2) The seller will provide a clear title and mutation at the time of handover. 3) Fixtures and fittings must be of the quality mentioned in the brochure. 4) If the seller fails to deliver, double the booking amount will be refunded. 5) Utility connection costs are to be borne by the buyer. 6) Common space usage will be as per building bylaws. Both parties agree to abide by these terms.' 
    },
    loan_repay: { 
      title: 'Loan Repayment Commitment Bond', 
      text: 'I, {{name}}, Father: {{witness}}, hereby declare that I owe {{val1}} to {{p2}}. I commit to repaying the said amount by {{val2}} or as per the agreed schedule. Terms: 1) In case of my demise, my legal heirs will be responsible for this debt. 2) Delay in payment will allow the lender to take legal action. 3) The lender has the right to recover the amount from my movable or immovable assets. 4) No excuses for non-payment will be accepted after the deadline. 5) This document is a binding legal instrument. Signed in the presence of witnesses.' 
    },
    employment: { 
      title: 'Employment Contract & Appointment', 
      text: 'Employer: {{name}}, Address: {{address}}. Employee: {{p2}}. Designation: ............... Terms: 1) Monthly salary is {{val1}} plus other applicable benefits. 2) Working hours are 9 AM to 6 PM. 3) The probation period is {{val2}} months. 4) The employee must maintain strict confidentiality of business trade secrets. 5) Any misconduct will lead to immediate termination without notice. 6) Resignation requires a 1-month written notice. 7) Leaves must be pre-approved by the management. 8) The employee must follow all company policies. Both parties accept the terms.' 
    },
    lease_long: { 
      title: 'Long-term Land Lease Agreement', 
      text: 'Lessor: {{name}}, Lessee: {{p2}}. Land Description: {{address}}. Lease Period: {{val2}} years. Annual Lease Fee: {{val1}}. Terms: 1) The lessee can use the land only for the purposes specified in the contract. 2) The annual fee must be paid in advance. 3) Upon expiry, the land must be returned to the lessor in its original state. 4) The lessor will not interfere with the possession during the lease period. 5) Government taxes and land revenue are to be paid by the lessor. 6) Sub-leasing to a third party is strictly prohibited without consent. 7) Breach of terms will nullify the lease. Signed on this day.' 
    },
    dower_marriage: { 
      title: 'Dower (Mahr) & Marital Commitment', 
      text: 'I, {{name}}, Father: {{witness}}, declare that the dower for my wife {{p2}} is fixed at {{val1}}. I have paid ........... as prompt dower today. Terms: 1) The remaining amount will be paid on demand or in installments. 2) I will provide proper maintenance and a safe living environment for my wife. 3) I will treat my wife with respect and dignity. 4) I will be responsible for the welfare of our future children. 5) This commitment is made on {{val2}}. 6) This document serves as a record of our marital rights and obligations. May our marriage be blessed. Signed by both parties.' 
    },
    transport: { 
      title: 'Vehicle Hire/Rental Agreement', 
      text: 'Vehicle Owner: {{name}}, Hirer: {{p2}}. Vehicle Details: {{address}}. Terms: 1) The hire charge is {{val1}} per day/month. 2) Fuel and parking costs are the responsibility of the hirer. 3) The contract is valid until {{val2}}. 4) Mechanical failures are handled by the owner, but damage due to negligence is paid by the hirer. 5) The owner ensures the vehicle has valid insurance and papers. 6) The vehicle must not be used for any illegal activities. 7) Any accident must be reported immediately. 8) The vehicle must be returned in good condition. Agreed by both.' 
    },
    event: { 
      title: 'Event Management Service Agreement', 
      text: 'Client: {{name}}, Event Planner: {{p2}}. Venue: {{address}}. Event Date: {{val2}}. Total Contract Value: {{val1}}. Terms: 1) An advance of 50% is paid today. 2) The planner must ensure the quality of food, decoration, and sound. 3) The planner is responsible for any mismanagement during the event. 4) In case of cancellation, the refund policy will apply as per standard terms. 5) Any extra services will be charged additionally. 6) The balance must be paid immediately after the event. 7) The event must start and end at the scheduled time. Signed by both parties.' 
    },
    mortgage: { 
      title: 'Property Mortgage/Pledge Agreement', 
      text: 'Mortgagor: {{name}}, Mortgagee: {{p2}}. Property Details: {{address}}. Loan Amount: {{val1}}. Terms: 1) The original property documents will remain with the mortgagee until the loan is cleared. 2) The loan must be repaid by {{val2}}. 3) If the mortgagor fails to repay, the mortgagee has the legal right to sell the property to recover the debt. 4) Possession remains with the mortgagor unless specified otherwise. 5) No changes to the property should be made during the mortgage. 6) All taxes are to be paid by the owner. 7) Documents will be returned upon full settlement. Signed with full consent.' 
    },
    security_service: { 
      title: 'Security Guard Service Agreement', 
      text: 'Client: {{name}}, Agency: {{p2}}. Service Location: {{address}}. Terms: 1) The agency will provide 24/7 security personnel. 2) Monthly service charge is {{val1}}. 3) Contract period is {{val2}} months. 4) The agency is liable for losses proven to be due to guard negligence. 5) Guards must be in uniform and well-trained. 6) The client can request a replacement for any unsatisfactory guard. 7) Bills must be cleared within the 5th of every month. 8) Either party can terminate with 1-month notice. Both parties have signed this contract.' 
    },
    supply_goods: { 
      title: 'Goods Supply Agreement', 
      text: 'Supplier: {{name}}, Buyer: {{p2}}. Item Details: {{address}}. Unit Price: {{val1}}. Delivery Deadline: {{val2}}. Terms: 1) Items must meet the quality standards specified. 2) The buyer has the right to reject defective goods. 3) Delivery costs are included in the price. 4) Payment will be made within 15 days of delivery. 5) Orders can be adjusted with mutual consent. 6) Failure to deliver on time may result in a penalty. 7) This contract is binding for both parties. Executed on the date mentioned above.' 
    },
    internet_isp: { 
      title: 'ISP/Internet Service Agreement', 
      text: 'Provider: {{name}}, Subscriber: {{p2}}. Address: {{address}}. Bandwidth: ........... Mbps. Monthly Bill: {{val1}}. Duration: {{val2}}. Terms: 1) The subscriber must pay the bill by the 10th of each month. 2) The provider will resolve any technical downtime within 24 hours. 3) Routers and equipment provided are the property of the ISP/Subscriber as per the plan. 4) Illegal use of internet is strictly prohibited. 5) Non-payment will result in service suspension. 6) Reactivation fees may apply. Both parties agree to the terms of service.' 
    },
    it_project: { 
      title: 'Software Development/IT Project Contract', 
      text: 'Developer: {{name}}, Client: {{p2}}. Project Name: {{address}}. Total Budget: {{val1}}. Deadline: {{val2}}. Terms: 1) 30% advance is required to start work. 2) Regular progress updates must be provided by the developer. 3) Post-delivery support will be provided for 3 months. 4) All source codes and IP rights belong to the client after full payment. 5) Extra features will be billed separately. 6) Strict confidentiality must be maintained regarding project data. Both parties have signed this document.' 
    },
    cleaning: { 
      title: 'Commercial Cleaning Service Agreement', 
      text: 'Client: {{name}}, Service Provider: {{p2}}. Site: {{address}}. Monthly Fee: {{val1}}. Contract Duration: {{val2}}. Terms: 1) Cleaning will be performed daily/weekly as per the schedule. 2) All cleaning chemicals and equipment are provided by the service provider. 3) The provider ensures the background check of their staff. 4) Payment is due at the end of each month. 5) Damages caused during cleaning must be compensated. 6) The client provides access to water and electricity. Signed by both parties in agreement.' 
    }
  }
};

function adjustAgPreviewScale() {
    const container = document.querySelector('.ag-preview-scroll');
    const wrapper = document.getElementById('ag-wrapper');
    const paper = document.getElementById('ag-editor-box');
    if (!container || !paper) return;
    const containerWidth = container.offsetWidth - 30;
    const paperWidth = 812; 
    if (containerWidth < paperWidth) {
        const scale = containerWidth / paperWidth;
        wrapper.style.transform = `scale(${scale})`;
        container.style.height = (paper.offsetHeight * scale + 50) + "px";
    } else {
        wrapper.style.transform = 'scale(1)';
        container.style.height = "auto";
    }
}

function closeAgreementModal() {
    document.getElementById('agreementModal').style.display = 'none';
}

function setAgLang(lang) {
    agLang = lang;
    document.getElementById('ag-bn-btn').classList.toggle('active', lang === 'bn');
    document.getElementById('ag-en-btn').classList.toggle('active', lang === 'en');
    const isBN = lang === 'bn';
    
    document.getElementById('ag-main-title').innerHTML = isBN ? "<i class='fa-solid fa-file-signature'/> চুক্তিপত্র রাইটিং" : "<i class='fa-solid fa-file-signature'/> Agreement letter writing";
    document.getElementById('lbl-ag-temp').innerText = isBN ? 'চুক্তিপত্র নির্বাচন করুন' : 'Select Agreement Template';
    document.getElementById('lbl-ag-p1').innerText = isBN ? 'প্রথম পক্ষের নাম' : 'First Party Name';
    document.getElementById('lbl-ag-p2').innerText = isBN ? 'দ্বিতীয় পক্ষের নাম' : 'Second Party Name';
    document.getElementById('lbl-ag-witness').innerText = isBN ? 'সাক্ষীর নাম/পিতার নাম' : 'Witness/Father Name';
    document.getElementById('lbl-ag-addr').innerText = isBN ? 'বিষয়ের বিবরণ/ঠিকানা' : 'Subject/Address';
    document.getElementById('lbl-ag-val1').innerText = isBN ? 'টাকার পরিমাণ/শর্ত ১' : 'Amount/Condition 1';
    document.getElementById('lbl-ag-val2').innerText = isBN ? 'মেয়াদ/শর্ত ২' : 'Duration/Condition 2';
    document.getElementById('lbl-ag-margin').innerText = isBN ? 'স্ট্যাম্প টপ স্পেস (Inch)' : 'Stamp Top Space (Inch)';
    document.getElementById('lbl-ag-sig1').innerText = isBN ? 'প্রথম পক্ষের স্বাক্ষর' : 'First Party Signature';
    document.getElementById('lbl-ag-sig2').innerText = isBN ? 'দ্বিতীয় পক্ষের স্বাক্ষর' : 'Second Party Signature';
    document.getElementById('lbl-ag-preview-hint').innerText = isBN ? 'স্ট্যাম্প প্রিভিউ (ইমেজটি প্রিন্টে আসবে না)' : 'STAMP PREVIEW (IMAGE WILL NOT PRINT)';

    document.getElementById('ag-intro-box').innerHTML = isBN ? 
        "<b>নির্দেশনা:</b> বিভিন্ন টেমপ্লেট ক্ষেত্রে শূন্যস্থান পূরণ না হলে ম্যানুয়ালি টাইপ করে নিবেন। এটি লিগ্যাল (২১৫ মিমি x ৩৪৫ মিমি) সাইজ স্ট্যাম্প পেপারের জন্য। শুধুমাত্র ব্যাকগ্রাউন্ড ছাড়া লেখাগুলো প্রিন্ট হবে।" : 
        "<b>Note:</b> If the blanks are not filled in various template fields, type them manually. This is for legal (215mm x 345mm) size stamp paper. Only texts without background will be printed.";

    const select = document.getElementById('ag-template-select');
    select.innerHTML = '';
    const data = agTemplates[lang];
    for (let key in data) {
        let opt = document.createElement('option');
        opt.value = key; opt.innerText = data[key].title;
        select.appendChild(opt);
    }
    applyAgTemplate(select.value);
}

function applyAgTemplate(key) {
    window.currentAgKey = key;
    updateAgPreview();
}

function updateAgPreview() {
    const data = agTemplates[agLang][window.currentAgKey];
    document.getElementById('ag-title-ui').innerText = data.title;
    const inputs = {
        name: document.getElementById('ag-p1').value || '.......',
        p2: document.getElementById('ag-p2').value || '.......',
        witness: document.getElementById('ag-witness').value || '.......',
        address: document.getElementById('ag-address').value || '.......',
        val1: document.getElementById('ag-val1').value || '.......',
        val2: document.getElementById('ag-val2').value || '.......'
    };
    let body = data.text;
    for (let key in inputs) {
        body = body.replace(new RegExp(`{{${key}}}`, 'g'), `<b>${inputs[key]}</b>`);
    }
    document.getElementById('ag-body-ui').innerHTML = body;
}

function updateAgMargin(val) {
    document.getElementById('ag-top-margin').style.height = val + 'px';
    document.getElementById('ag-margin-val').innerText = (val / 100).toFixed(1) + " Inch";
}

function printAgreement() {
    const margin = document.getElementById('ag-top-margin').offsetHeight;
    const title = document.getElementById('ag-title-ui').innerText;
    const body = document.getElementById('ag-body-ui').innerHTML;
    const s1 = document.getElementById('lbl-ag-sig1').innerText;
    const s2 = document.getElementById('lbl-ag-sig2').innerText;

    const win = window.open('', '', 'width=900,height=1000');
    win.document.write(`
        <html><head><title>Print Agreement</title>
        <link href="https://fonts.maateen.me/solaiman-lipi/font.css" rel="stylesheet">
        <style>
            @page { size: 215mm 345mm; margin: 0; }
            body { margin: 0; padding: 0; font-family: 'SolaimanLipi', Arial, sans-serif; text-align: justify; }
            .p-cont { width: 215mm; min-height: 345mm; padding: 20mm; box-sizing: border-box; }
            .t-sp { height: ${margin}px; }
            .tit { text-align: center; text-decoration: underline; font-size: 24px; margin-bottom: 30px; font-weight: bold; }
            .content { line-height: 1.8; font-size: 18px; min-height: 500px; white-space: pre-wrap; }
            .foot { margin-top: 80px; display: flex; justify-content: space-between; font-weight: bold; font-size: 16px; }
        </style></head>
        <body><div class="p-cont"><div class="t-sp"></div><div class="tit">${title}</div><div class="content">${body}</div>
        <div class="foot"><div><br>________________<br>${s1}</div><div><br>________________<br>${s2}</div></div></div>
        <script>window.onload=function(){setTimeout(()=>{window.print();window.close();},700);};<\/script></body></html>
    `);
    win.document.close();
}

function resetAgreement() {
    document.querySelectorAll('.ag-inputs input, .ag-inputs textarea').forEach(i => i.value = '');
    updateAgPreview();
}
window.addEventListener('resize', adjustAgPreviewScale);


(function() {
    try {
        var allowed = ["seba.pro.bd", "www.seba.pro.bd", "digitalseba.pages.dev", "localhost", "127.0.0.1"];
        var host = window.location.hostname;
        if (host && !allowed.some(function(d){ return host === d || host.endsWith("." + d); })) {
            console.warn("Unauthorized domain copy detected.");
        }
    } catch(e) {}
})();
;

let mergeFiles = [];
let splitFile = null;

// আপনার ওয়েবসাইটের ডিফল্ট অ্যালার্ট ফাংশন (নিশ্চিত করার জন্য পুনরায় দেওয়া হলো)
function triggerSiteAlert(msg) {
    if (typeof showAlert === "function") {
        showAlert(msg);
    } else {
        // যদি showAlert ফাংশনটি গ্লোবাল না হয় তবে সরাসরি আপনার পপআপ আইডি ব্যবহার করবে
        const popup = document.getElementById('customPopup');
        const msgBox = document.getElementById('popupMessage');
        if (popup && msgBox) {
            msgBox.innerText = msg;
            popup.style.display = 'flex';
        } else {
            alert(msg); // ব্যাকআপ
        }
    }
}

function openPdfToolModal() {
    if(typeof setActiveMode === "function") setActiveMode('mode-pdf-tool');
    document.getElementById('pdfToolModal').style.display = 'flex';
}

function closePdfToolModal() {
    document.getElementById('pdfToolModal').style.display = 'none';
}

function switchPdfTab(tab) {
    document.getElementById('tab-merge-btn').classList.toggle('active', tab === 'merge');
    document.getElementById('tab-split-btn').classList.toggle('active', tab === 'split');
    document.getElementById('section-merge').style.display = tab === 'merge' ? 'block' : 'none';
    document.getElementById('section-split').style.display = tab === 'split' ? 'block' : 'none';
    document.getElementById('pdf-tool-status').style.display = 'none';
}

// --- MERGER LOGIC ---
function handleMergeFiles(event) {
    const files = Array.from(event.target.files);
    mergeFiles = [...mergeFiles, ...files];
    renderMergeList();
}

function renderMergeList() {
    const list = document.getElementById('merge-file-list');
    const btn = document.getElementById('btn-merge-start');
    list.innerHTML = "";
    if(mergeFiles.length > 0) {
        list.style.display = 'flex';
        btn.style.display = 'flex';
        mergeFiles.forEach((f, i) => {
            list.innerHTML += `<div class="pdf-item">
                <span>${i+1}. ${f.name}</span>
                <button class="pdf-rem-btn" onclick="removeMergeFile(${i})">&times;</button>
            </div>`;
        });
    } else {
        list.style.display = "none";
        btn.style.display = "none";
    }
}

function removeMergeFile(index) {
    mergeFiles.splice(index, 1);
    renderMergeList();
}

async function processMergePDF() {
    const status = document.getElementById('pdf-tool-status');
    
    if (mergeFiles.length < 2) {
        triggerSiteAlert("Please select at least 2 PDF files to merge!");
        return;
    }

    status.style.display = 'flex';
    status.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Merging PDFs...';

    try {
        if (typeof PDFLib === 'undefined') {
            throw new Error("PDF Library is not loaded yet. Please check your internet.");
        }

        const mergedPdf = await PDFLib.PDFDocument.create();
        for (const f of mergeFiles) {
            const bytes = await f.arrayBuffer();
            let pdf;
            try {
                pdf = await PDFLib.PDFDocument.load(bytes);
            } catch (e) {
                throw new Error(`File "${f.name}" is password protected or corrupted. Please remove the password first.`);
            }
            const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            copiedPages.forEach((page) => mergedPdf.addPage(page));
        }
        const pdfBytes = await mergedPdf.save();
        downloadBlob(pdfBytes, "Merged_By_ID_Scanner_Pro.pdf", "application/pdf");
        status.innerHTML = '<span style="color:#059669;">Success! Files Merged.</span>';
    } catch (err) {
        status.style.display = "none";
        triggerSiteAlert(err.message);
    }
}

// --- SPLITTER LOGIC ---
function handleSplitFile(event) {
    splitFile = event.target.files[0];
    if(splitFile) {
        document.getElementById('split-file-name').innerText = splitFile.name;
        document.getElementById('split-controls').style.display = 'flex';
    }
}

async function processSplitPDF() {
    const rangeInput = document.getElementById('split-pages-input').value.trim();
    const status = document.getElementById('pdf-tool-status');

    if (!splitFile) {
        triggerSiteAlert("Please select a PDF file first!");
        return;
    }
    if (!rangeInput) {
        triggerSiteAlert("Please enter the page numbers or range to extract (e.g. 1, 2-5)!");
        return;
    }

    status.style.display = 'flex';
    status.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Extracting pages...';

    try {
        const bytes = await splitFile.arrayBuffer();
        const pdf = await PDFLib.PDFDocument.load(bytes);
        const newPdf = await PDFLib.PDFDocument.create();
        const totalPages = pdf.getPageCount();
        
        const pagesToExtract = parsePageRange(rangeInput, totalPages);
        
        if (pagesToExtract.length === 0) {
            throw new Error("Invalid page range. Please check the page numbers.");
        }

        const copiedPages = await newPdf.copyPages(pdf, pagesToExtract.map(p => p - 1));
        copiedPages.forEach(p => newPdf.addPage(p));

        const pdfBytes = await newPdf.save();
        downloadBlob(pdfBytes, "Extracted_Pages.pdf", "application/pdf");
        status.innerHTML = '<span style="color:#059669;">Success! Pages Extracted.</span>';
    } catch (err) {
        status.style.display = "none";
        triggerSiteAlert(err.message);
    }
}

function parsePageRange(input, max) {
    const pages = new Set();
    input.split(',').forEach(part => {
        if(part.includes('-')) {
            const [start, end] = part.split('-').map(Number);
            if(start > 0 && end >= start) {
                for(let i = start; i <= end; i++) if(i <= max) pages.add(i);
            }
        } else {
            const val = Number(part.trim());
            if(val > 0 && val <= max) pages.add(val);
        }
    });
    return Array.from(pages).sort((a,b) => a-b);
}

// Helper Download Function
function downloadBlob(data, fileName, mimeType) {
    const blob = new Blob([data], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}
;

let gdLang = "bn";

const gdTemplates = {
    bn: {
        mobile: { title: "মোবাইল ফোন হারানো", body: "আমি নিম্নস্বাক্ষরকারী এই মর্মে জানাচ্ছি যে, আজ ইংরেজি {{time}} ঘটিকার সময় {{place}} হইতে আমার ব্যবহৃত মোবাইল ফোনটি অসাবধানতাবশত হারাইয়া গিয়াছে। ফোনটির বিবরণ: {{desc}}। অনেক খোঁজাখুঁজি করিয়াও ফোনটি পাওয়া যায় নাই। বিষয়টি আপনার থানায় সাধারণ ডায়েরিভুক্ত করার জন্য অনুরোধ জানাচ্ছি।" },
        nid: { title: "ভোটার আইডি (NID) কার্ড হারানো", body: "আমি নিম্নস্বাক্ষরকারী এই মর্মে জানাচ্ছি যে, আজ ইংরেজি {{time}} ঘটিকার সময় {{place}} হইতে আমার মূল জাতীয় পরিচয়পত্র (NID Card) হারাইয়া গিয়াছে। কার্ডের বিবরণ: {{desc}}। আইনগত প্রয়োজনে বিষয়টি ডায়েরিভুক্ত করা একান্ত আবশ্যক। বিষয়টি থানায় সাধারণ ডায়েরিভুক্ত করার জন্য সবিনয় অনুরোধ করিতেছি।" },
        certificate: { title: "শিক্ষাগত সনদপত্র হারানো", body: "আমি নিম্নস্বাক্ষরকারী এই মর্মে জানাচ্ছি যে, অদ্য ইংরেজি {{time}} তারিখ {{place}} হইতে যাতায়াতের সময় আমার শিক্ষাগত যোগ্যতার মূল সনদপত্রটি হারাইয়া গিয়াছে। সার্টিফিকেটের বিবরণ: {{desc}}। বিষয়টি থানায় সাধারণ ডায়েরিভুক্ত করিয়া আমাকে বাধিত করিবেন।" },
        passport: { title: "পাসপোর্ট হারিয়ে যাওয়া", body: "আমি নিম্নস্বাক্ষরকারী এই মর্মে জানাচ্ছি যে, {{place}} হইতে যাতায়াতের পথে আমার আন্তর্জাতিক পাসপোর্টটি হারাইয়া গিয়াছে। পাসপোর্ট নম্বর: {{desc}}। উক্ত পাসপোর্টটি ভবিষ্যতে আইনগত সুরক্ষার জন্য আপনার থানায় সাধারণ ডায়েরিভুক্ত করা প্রয়োজন।" },
        license: { title: "ড্রাইভিং লাইসেন্স হারানো", body: "আমি নিম্নস্বাক্ষরকারী এই মর্মে জানাচ্ছি যে, ইংরেজি {{time}} ঘটিকায় {{place}} হইতে আমার মূল ড্রাইভিং লাইসেন্সটি হারাইয়া গিয়াছে। লাইসেন্স নম্বর: {{desc}}। বিষয়টি ডায়েরিভুক্ত করার আবেদন জানাচ্ছি।" },
        cheque: { title: "ব্যাংক চেক বই হারানো", body: "আমি নিম্নস্বাক্ষরকারী এই মর্মে জানাচ্ছি যে, আমার নিম্নবর্ণিত ব্যাংক চেক বইটি হারাইয়া গিয়াছে। ব্যাংকের নাম ও অ্যাকাউন্ট নম্বর: {{desc}}। স্থান: {{place}}। উক্ত চেক বইটির অপব্যবহার রোধে বিষয়টি ডায়েরিভুক্ত করার অনুরোধ জানাচ্ছি।" },
        sim: { title: "সিম কার্ড হারানো", body: "আমি নিম্নস্বাক্ষরকারী এই মর্মে জানাচ্ছি যে, আমার ব্যবহৃত সিম কার্ডটি {{place}} হইতে হারাইয়া গিয়াছে। সিম নম্বর: {{desc}}। সিমটি পুনরায় উত্তোলন করার লক্ষ্যে বিষয়টি থানায় ডায়েরিভুক্ত করার আবেদন জানাচ্ছি।" },
        money: { title: "নগদ টাকা ও মানিব্যাগ হারানো", body: "আমি নিম্নস্বাক্ষরকারী এই মর্মে জানাচ্ছি যে, {{place}} হইতে আমার ব্যবহৃত মানিব্যাগটি হারাইয়া গিয়াছে। ব্যাগের ভেতর নগদ ........... টাকা এবং {{desc}} ছিল। বিষয়টি আপনার থানায় ডায়েরিভুক্ত করার জন্য অনুরোধ করছি।" },
        deed: { title: "জমির দলিল হারানো", body: "আমি নিম্নস্বাক্ষরকারী এই মর্মে জানাচ্ছি যে, {{place}} হইতে যাতায়াতের সময় আমার নিম্নবর্ণিত জমির মূল দলিলটি হারাইয়া গিয়াছে। দলিলের বিবরণ: {{desc}}। বিষয়টি ডায়েরিভুক্ত করিয়া পরবর্তী ব্যবস্থা গ্রহণে বাধিত করিবেন।" },
        missing: { title: "ব্যক্তি নিখোঁজ সংবাদ", body: "আমি নিম্নস্বাক্ষরকারী এই মর্মে জানাচ্ছি যে, আমার নিকটাত্মীয় {{name}} গত ইংরেজি {{time}} তারিখ হইতে {{place}} হইতে নিখোঁজ রহিয়াছেন। তাঁহার বিবরণ: {{desc}}। সম্ভাব্য সকল স্থানে সন্ধান করিয়াও তাঁহার খোঁজ পাওয়া যায় নাই। বিষয়টি ডায়েরিভুক্ত করার অনুরোধ জানাচ্ছি।" },
        threat: { title: "হুমকি সংক্রান্ত জিডি", body: "আমি নিম্নস্বাক্ষরকারী এই মর্মে জানাচ্ছি যে, গত ইংরেজি {{time}} তারিখ হইতে {{place}} এলাকায় কতিপয় অজ্ঞাত ব্যক্তি আমাকে প্রাণনাশের হুমকি প্রদান করিতেছে। বিবরণ: {{desc}}। বর্তমানে আমি নিরাপত্তাহীনতায় ভুগিতেছি। বিষয়টি ডায়েরিভুক্ত করিয়া আইনগত সুরক্ষা প্রদানের অনুরোধ জানাচ্ছি।" },
        land_issue: { title: "জমির সীমানা বিরোধ", body: "আমি নিম্নস্বাক্ষরকারী এই মর্মে জানাচ্ছি যে, আমার নিম্নবর্ণিত জমিতে বিবাদীগণ বেআইনিভাবে প্রবেশের চেষ্টা করিতেছে। জমির বিবরণ: {{desc}}। বিষয়টি শান্তি-শৃঙ্খলা বজায় রাখার স্বার্থে থানায় ডায়েরিভুক্ত করার আবেদন জানাচ্ছি।" },
        atm_card: { title: "এটিএম কার্ড হারানো", body: "আমি নিম্নস্বাক্ষরকারী এই মর্মে জানাচ্ছি যে, ইংরেজি {{time}} ঘটিকায় {{place}} হইতে আমার ডেবিট/ক্রেডিট কার্ডটি হারাইয়া গিয়াছে। কার্ডের বিবরণ: {{desc}}। বিষয়টি ডায়েরিভুক্ত করার অনুরোধ জানাচ্ছি।" },
        tenant: { title: "ভাড়াটিয়া তথ্য প্রদান", body: "আমি নিম্নস্বাক্ষরকারী অত্র বাড়ির মালিক। আমার বাড়িতে নতুন ভাড়াটিয়া নিয়োগ করা হইয়াছে। ভাড়াটিয়ার নাম ও এনআইডি নম্বর: {{desc}}। ঠিকানা: {{address}}। আইনগত নিয়ম পালনার্থে ভাড়াটিয়ার তথ্য আপনার থানায় ডায়েরিভুক্ত করার আবেদন জানাচ্ছি।" },
        general: { title: "সাধারণ হারানো সংবাদ", body: "আমি নিম্নস্বাক্ষরকারী এই মর্মে জানাচ্ছি যে, ইংরেজি {{time}} ঘটিকায় {{place}} হইতে আমার নিম্নবর্ণিত জিনিসটি হারাইয়া গিয়াছে। বিবরণ: {{desc}}। অনেক খোঁজাখুঁজি করিয়াও পাওয়া যায় নাই। বিষয়টি থানায় সাধারণ ডায়েরিভুক্ত করার অনুরোধ জানাচ্ছি।" }
    },
    en: {
        mobile: { title: "Loss of Mobile Phone", body: "I, the undersigned, would like to report that today at {{time}}, I lost my mobile phone at {{place}}. Mobile Details: {{desc}}. Despite a thorough search, I couldn't find it. I request you to record this in the General Diary (GD)." },
        nid: { title: "Loss of NID Card", body: "I, the undersigned, am reporting that my original National Identity (NID) Card was lost today at {{place}}. NID Details: {{desc}}. This GD is required for future legal procedures. I request you to record this matter." },
        certificate: { title: "Loss of Educational Certificate", body: "I, the undersigned, state that my original educational certificate was lost while traveling through {{place}} at {{time}}. Certificate Details: {{desc}}. Please record this in your station's General Diary." },
        passport: { title: "Loss of International Passport", body: "I, the undersigned, am reporting the loss of my International Passport at {{place}}. Passport No: {{desc}}. To avoid any future legal complications, I request you to record this GD." },
        license: { title: "Loss of Driving License", body: "I, the undersigned, report that my original Driving License was lost at {{place}} around {{time}}. License Details: {{desc}}. I request you to record this information in the GD." },
        bank_cheque: { title: "Loss of Bank Cheque Book", body: "I, the undersigned, report that my bank cheque book has been lost at {{place}}. Bank & A/C Details: {{desc}}. Please record this in the General Diary to prevent misuse." },
        money: { title: "Loss of Cash and Wallet", body: "I, the undersigned, state that I lost my wallet containing cash and documents at {{place}} at {{time}}. Wallet Details: {{desc}}. I request you to record this loss in the GD." },
        general: { title: "General Loss Report", body: "I, the undersigned, report that I lost the following item at {{place}} at {{time}}. Description: {{desc}}. I request you to record this in the General Diary for legal security." }
    }
};

function openGdModal() {
    if(typeof setActiveMode === "function") setActiveMode('mode-gd-maker');
    document.getElementById('gdMakerModal').style.display = 'flex';
    setGdLang(gdLang);
}

function closeGdModal() {
    document.getElementById('gdMakerModal').style.display = 'none';
}

function setGdLang(lang) {
    gdLang = lang;
    document.getElementById('gdm-btn-bn').classList.toggle('active', lang === 'bn');
    document.getElementById('gdm-btn-en').classList.toggle('active', lang === 'en');
    const isBN = lang === 'bn';
    
    // UI Labels
    document.getElementById('gdm-ui-title').innerText = isBN ? "পুলিশ জিডি আবেদন রাইটিং" : "Police GD Application Writing";
    document.getElementById('lbl-gdm-temp').innerText = isBN ? 'জিডির বিষয় নির্বাচন করুন' : 'Select GD Subject';
    document.getElementById('lbl-gdm-step1').innerText = isBN ? '১. থানা ও তারিখ' : '1. Station & Date';
    document.getElementById('lbl-gdm-step2').innerText = isBN ? '২. আবেদনকারীর তথ্য' : '2. Applicant Info';
    document.getElementById('lbl-gdm-step3').innerText = isBN ? '৩. হারানো জিনিসের বিবরণ' : '3. Details of Loss';
    
    document.getElementById('gdm-ps-name').placeholder = isBN ? "থানার নাম" : "Police Station Name";
    document.getElementById('gdm-date').placeholder = isBN ? "আবেদনের তারিখ" : "Application Date";
    document.getElementById('gdm-name').placeholder = isBN ? "আপনার পূর্ণ নাম" : "Full Name";
    document.getElementById('gdm-father').placeholder = isBN ? "পিতা/স্বামীর নাম" : "Father/Husband Name";
    document.getElementById('gdm-phone').placeholder = isBN ? "মোবাইল নম্বর" : "Mobile Number";
    document.getElementById('gdm-address').placeholder = isBN ? "পূর্ণ ঠিকানা (গ্রাম, ডাকঘর, উপজেলা, জেলা)" : "Full Address";
    document.getElementById('gdm-lost-place').placeholder = isBN ? "কোথা থেকে হারিয়েছে?" : "Place of loss?";
    document.getElementById('gdm-lost-time').placeholder = isBN ? "কখন হারিয়েছে? (সময় ও তারিখ)" : "Time & Date of loss?";
    document.getElementById('gdm-lost-desc').placeholder = isBN ? "ব্র্যান্ড, আইডি নম্বর বা অন্যান্য বিবরণ" : "Brand, ID No, or details";
    
    document.getElementById('btn-gdm-print').querySelector('span').innerText = isBN ? "প্রিন্ট করুন (A4)" : "Print (A4)";
    document.getElementById('btn-gdm-reset').querySelector('span').innerText = isBN ? "সব মুছুন" : "Clear All";

    const select = document.getElementById('gdm-template-select');
    select.innerHTML = '';
    const data = gdTemplates[lang];
    for (let key in data) {
        let opt = document.createElement('option');
        opt.value = key; opt.innerText = data[key].title;
        select.appendChild(opt);
    }
    applyGdTemplate(select.value);
}

function applyGdTemplate(key) {
    window.currentGdKey = key;
    updateGd();
}

function toGdN(n) {
    if (gdLang !== 'bn') return n;
    const d = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
    return n.toString().replace(/\d/g, x => d[x]);
}

function updateGd() {
    const val = (id) => document.getElementById(id).value;
    const data = gdTemplates[gdLang][window.currentGdKey] || gdTemplates[gdLang]['general'];
    
    const ps = val('gdm-ps-name') || ".......";
    const date = val('gdm-date') || "01/01/2026";
    const name = val('gdm-name') || ".......";
    const father = val('gdm-father') || ".......";
    const phone = val('gdm-phone') || ".......";
    const addr = val('gdm-address') || ".......";
    const place = val('gdm-lost-place') || ".......";
    const time = val('gdm-lost-time') || ".......";
    const desc = val('gdm-lost-desc') || ".......";

    let bodyText = data.body
        .replace(/{{time}}/g, `<b>${time}</b>`)
        .replace(/{{place}}/g, `<b>${place}</b>`)
        .replace(/{{desc}}/g, `<b>${desc}</b>`)
        .replace(/{{name}}/g, `<b>${name}</b>`)
        .replace(/{{address}}/g, `<b>${addr}</b>`);

    const html = `
        <div style="font-size:16px; line-height:1.8; color:#000;">
            <p>${gdLang === 'bn' ? 'তারিখ:' : 'Date:'} ${toGdN(date)}</p>
            <p>${gdLang === 'bn' ? 'বরাবর,<br>ভারপ্রাপ্ত কর্মকর্তা' : 'To,<br>The Officer In Charge'}<br>
            ${ps} ${gdLang === 'bn' ? 'থানা, বাংলাদেশ।' : 'Police Station, Bangladesh.'}</p>
            
            <p><b>${gdLang === 'bn' ? 'বিষয়: সাধারণ ডায়েরি (GD) করার জন্য আবেদন।' : 'Subject: Prayer for recording a General Diary (GD).'}</b></p>
            
            <p>${gdLang === 'bn' ? 'জনাব,' : 'Sir,'}</p>
            <p style="text-align:justify;">${bodyText}</p>
            
            <p style="margin-top:25px;">${gdLang === 'bn' ? 'আবেদনকারীর তথ্য:' : "Applicant's Details:"}<br>
            ${gdLang === 'bn' ? 'নাম:' : 'Name:'} ${name}<br>
            ${gdLang === 'bn' ? 'পিতা/স্বামী:' : 'Father/Husband:'} ${father}<br>
            ${gdLang === 'bn' ? 'ঠিকানা:' : 'Address:'} ${addr}</p>

            <div style="margin-top:60px;">
                <p>${gdLang === 'bn' ? 'বিনীত নিবেদক,' : 'Sincerely Yours,'}</p>
                <br>
                <p>____________________<br>
                (${name})<br>
                ${gdLang === 'bn' ? 'মোবাইল:' : 'Mobile:'} ${toGdN(phone)}</p>
            </div>
        </div>
    `;

    document.getElementById('gdm-render-area').innerHTML = html;
}

function printGd() {
    const printContent = document.getElementById('gdm-render-area').innerHTML;
    const printWindow = window.open('', '', 'height=800,width=1000');
    printWindow.document.write('<html><head><title>Print GD Application</title>');
    printWindow.document.write('<link href="https://fonts.maateen.me/solaiman-lipi/font.css" rel="stylesheet">');
    printWindow.document.write('<style>body{margin:0;padding:0;background:#fff;}#wrap{width:210mm;height:297mm;padding:25mm;box-sizing:border-box;font-family:"SolaimanLipi",Arial,sans-serif!important;}</style></head><body>');
    printWindow.document.write('<div id="wrap">' + printContent + '</div>');
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    setTimeout(() => { printWindow.print(); printWindow.close(); }, 700);
}

function resetGd() {
    document.querySelectorAll('#gdm-input-panel input, #gdm-input-panel textarea').forEach(i => i.value = "");
    updateGd();
}
;

let rtLang = "bn";
let rtPeriods = ["1st", "2nd", "3rd", "4th"];
let rtDaysKeys = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
let rtData = {}; 

const bnSuffixMap = {
    1: "ম", 2: "য়", 3: "য়", 4: "র্থ", 5: "ম", 6: "ষ্ঠ", 7: "ম", 8: "ম", 9: "ম", 10: "ম",
    11: "শ", 12: "শ", 13: "শ", 14: "শ", 15: "শ"
};
const enSuffixMap = { 1: "st", 2: "nd", 3: "rd" };

function openRoutineModal() {
    if(typeof setActiveMode === "function") setActiveMode('mode-routine-maker');
    document.getElementById('routineMakerModal').style.display = 'flex';
    initializeRtData();
    setRtLang(rtLang);
}

function closeRoutineModal() {
    document.getElementById('routineMakerModal').style.display = 'none';
}

function initializeRtData() {
    rtDaysKeys.forEach(day => {
        if (!rtData[day]) rtData[day] = {};
        rtPeriods.forEach(p => {
            if (!rtData[day][p]) rtData[day][p] = "";
        });
    });
}

function formatPeriodName(n, lang) {
    let num = parseInt(n);
    if (isNaN(num)) return n;
    if (lang === 'bn') {
        const digits = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
        let bnNum = num.toString().replace(/\d/g, d => digits[d]);
        return bnNum + (bnSuffixMap[num] || "তম");
    } else {
        return num + (enSuffixMap[num] || "th");
    }
}

function setRtLang(lang) {
    rtLang = lang;
    document.getElementById('rt-btn-bn').classList.toggle('active', lang === 'bn');
    document.getElementById('rt-btn-en').classList.toggle('active', lang === 'en');

    const ui = {
        bn: {
            title: "ক্লাস রুটিন মেকার", step1: "১. প্রতিষ্ঠানের তথ্য", step2: "২. পিরিয়ড ও সময়", step3: "৩. বিষয় বিন্যাস",
            inst: "প্রতিষ্ঠানের নাম", head: "রুটিনের শিরোনাম", cls: "শ্রেণি", ver: "শাখা/সেকশন",
            addP: "+ পিরিয়ড যোগ করুন", print: "প্রিন্ট করুন (A4)", reset: "সব মুছুন", 
            days: ["শনিবার", "রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার"]
        },
        en: {
            title: "Class Routine Maker", step1: "1. Institution Details", step2: "2. Periods & Time", step3: "3. Subjects Grid",
            inst: "Institution Name", head: "Routine Title", cls: "Class", ver: "Section/Shift",
            addP: "+ Add Period", print: "Print (A4)", reset: "Clear All", 
            days: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
        }
    };

    document.getElementById('rt-main-title').innerText = ui[lang].title;
    document.getElementById('lbl-rt-step1').innerText = ui[lang].step1;
    document.getElementById('lbl-rt-step2').innerText = ui[lang].step2;
    document.getElementById('lbl-rt-step3').innerText = ui[lang].step3;
    document.getElementById('rt-inst-name').placeholder = ui[lang].inst;
    document.getElementById('rt-sub-title').placeholder = ui[lang].head;
    document.getElementById('rt-class-info').placeholder = ui[lang].cls;
    document.getElementById('rt-version-info').placeholder = ui[lang].ver;
    document.getElementById('btn-add-period').innerText = ui[lang].addP;
    document.getElementById('btn-rt-print').innerHTML = `<i class='fa-solid fa-print'></i> ${ui[lang].print}`;
    document.getElementById('btn-rt-reset').innerHTML = `<i class='fa-solid fa-trash-can'></i> ${ui[lang].reset}`;

    renderRtInputs();
    updateRoutine();
}

function addRtPeriod() {
    if (rtPeriods.length >= 15) return;
    let n = rtPeriods.length + 1;
    rtPeriods.push(n === 1 ? "1st" : n === 2 ? "2nd" : n === 3 ? "3rd" : n + "th");
    initializeRtData();
    renderRtInputs();
    updateRoutine();
}

function renderRtInputs() {
    const pContainer = document.getElementById('rt-periods-container');
    pContainer.innerHTML = "";
    rtPeriods.forEach((p, i) => {
        const div = document.createElement('div');
        div.className = "rt-input-row";
        div.innerHTML = `<input value="${formatPeriodName(i + 1, rtLang)}" oninput="rtPeriods[${i}]=this.value; updateRoutine()"/>
                         <button onclick="rtPeriods.splice(${i},1); renderRtInputs(); updateRoutine()" style="border:none; background:#fee2e2; color:red; cursor:pointer;">&times;</button>`;
        pContainer.appendChild(div);
    });

    const dContainer = document.getElementById('rt-days-container');
    dContainer.innerHTML = "";
    const dayLabels = rtLang === 'bn' ? ["শনিবার", "রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার"] : ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    
    rtDaysKeys.forEach((dayKey, dIdx) => {
        const div = document.createElement('div');
        div.className = "rt-day-box";
        let html = `<p style="margin:0 0 8px; font-weight:800; font-size:12px; color:#4b5563;">${dayLabels[dIdx]}</p>
                    <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(70px, 1fr)); gap:5px;">`;
        rtPeriods.forEach((p, i) => {
            html += `<input placeholder="${formatPeriodName(i+1, rtLang)}" value="${rtData[dayKey][p] || ''}" oninput="rtData['${dayKey}']['${p}']=this.value; updateRoutine()"/>`;
        });
        html += `</div>`;
        div.innerHTML = html;
        dContainer.appendChild(div);
    });
}

function toBnN(n) {
    if (rtLang !== 'bn') return n;
    return n.toString().replace(/\d/g, d => "০১২৩৪৫৬৭৮৯"[d]);
}

function updateRoutine() {
    const inst = document.getElementById('rt-inst-name').value || (rtLang === 'bn' ? "প্রতিষ্ঠানের নাম" : "Institution Name");
    const head = document.getElementById('rt-sub-title').value || (rtLang === 'bn' ? "রুটিনের শিরোনাম" : "Routine Title");
    const cls = document.getElementById('rt-class-info').value;
    const ver = document.getElementById('rt-version-info').value;
    const dayLabels = rtLang === 'bn' ? ["শনিবার", "রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার"] : ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];

    let html = `<div style="text-align:center; border-bottom:2px solid #000; padding-bottom:8px; margin-bottom:10px;">
                    <h1 style="margin:0; font-size:18px; font-weight:900;">${inst}</h1>
                    <h2 style="margin:2px 0; font-size:14px;">${head}</h2>
                    <div style="display:flex; justify-content:center; gap:20px; font-weight:bold; font-size:12px; margin-top:3px;">
                        <span>${rtLang === 'bn' ? 'শ্রেণি:' : 'Class:'} ${cls || '...'}</span>
                        <span>${rtLang === 'bn' ? 'শাখা:' : 'Section:'} ${ver || '...'}</span>
                    </div>
                </div>
                <table><thead><tr><th style="width:70px;">${rtLang === 'bn' ? 'দিন/বার' : 'Day'}</th>`;
    rtPeriods.forEach((p, i) => { html += `<th>${formatPeriodName(i + 1, rtLang)}</th>`; });
    html += `</tr></thead><tbody>`;

    rtDaysKeys.forEach((dayKey, i) => {
        html += `<tr><td><b>${dayLabels[i]}</b></td>`;
        rtPeriods.forEach(p => { html += `<td>${rtData[dayKey][p] || ''}</td>`; });
        html += `</tr>`;
    });
    html += `</tbody></table>`;
    document.getElementById('rt-render-area').innerHTML = html;
}

function printRoutinePaper() {
    const content = document.getElementById('rt-render-area').innerHTML;
    const pWin = window.open('', '', 'height=1100,width=850');
    pWin.document.write('<html><head><title>Routine Print</title>');
    pWin.document.write('<link href="https://fonts.maateen.me/solaiman-lipi/font.css" rel="stylesheet">');
    pWin.document.write(`<style>
        body{margin:0;padding:0;background:#fff;}
        #p-wrap{ width: 210mm; height: 297mm; padding: 20mm; box-sizing: border-box; font-family:"SolaimanLipi", Arial, sans-serif!important; }
        table{width:100%; border-collapse:collapse; table-layout:fixed; margin-top:15px;}
        th, td{border:1px solid #000; padding:6px; text-align:center; font-size:12px; font-family:"SolaimanLipi", Arial, sans-serif!important;}
        h1{font-size:22px; margin:0; text-align:center;} h2{font-size:16px; text-align:center;}
        @page { size: A4 portrait; margin: 0; }
    </style></head><body>`);
    pWin.document.write('<div id="p-wrap">' + content + '</div>');
    pWin.document.write('</body></html>');
    pWin.document.close();
    setTimeout(() => { pWin.print(); pWin.close(); }, 1000);
}

function resetRoutineTool() {
    document.querySelectorAll('#routineMakerModal input').forEach(i => i.value = "");
    rtData = {}; initializeRtData(); renderRtInputs(); updateRoutine();
}
;

let propLang = "bn";

function openPropModal() {
    if(typeof setActiveMode === "function") setActiveMode('mode-property-calc');
    document.getElementById('propertyCalcModal').style.display = 'flex';
    setPropLang(propLang);
}

function closePropModal() {
    document.getElementById('propertyCalcModal').style.display = 'none';
}

function toPropN(n) {
    if (propLang !== 'bn') return n.toLocaleString();
    const d = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
    return n.toString().replace(/\d/g, x => d[x]);
}

function setPropLang(lang) {
    propLang = lang;
    document.getElementById('prop-bn-btn').classList.toggle('active', lang === 'bn');
    document.getElementById('prop-en-btn').classList.toggle('active', lang === 'en');
    
    const ui = {
        bn: {
            title: "সম্পত্তি বন্টন ক্যালকুলেটর (ফারায়েজ)",
            step1: "১. সম্পত্তির বিবরণ", step2: "২. জীবিত উত্তরাধিকারীগণ",
            land: "মোট জমি (শতাংশ)", cash: "মোট টাকা (নগদ)",
            wife: "স্ত্রী", husband: "স্বামী", son: "পুত্র", daughter: "কন্যা", father: "পিতা", mother: "মাতা",
            note: "<b>নির্দেশনা:</b> মৃত ব্যক্তির স্ত্রী, স্বামী, সন্তান বা পিতা-মাতা যারা বেঁচে আছেন তাদের পাশে টিক দিন এবং সংখ্যা লিখুন।",
            btnP: "প্রিন্ট রিপোর্ট", btnR: "সব মুছুন"
        },
        en: {
            title: "Property Distribution Calculator (Farayez)",
            step1: "1. Property Details", step2: "2. Living Heirs",
            land: "Total Land (Decimal)", cash: "Total Money (Cash)",
            wife: "Wife", husband: "Husband", son: "Son", daughter: "Daughter", father: "Father", mother: "Mother",
            note: "<b>Note:</b> Check the heirs who are alive and enter their quantity to calculate the shares.",
            btnP: "Print Report", btnR: "Clear All"
        }
    };

    const d = ui[lang];
    document.getElementById('prop-ui-title').innerText = d.title;
    document.getElementById('lbl-prop-step1').innerText = d.step1;
    document.getElementById('lbl-prop-step2').innerText = d.step2;
    document.getElementById('lbl-prop-land').innerText = d.land;
    document.getElementById('lbl-prop-cash').innerText = d.cash;
    document.getElementById('t-wife').innerText = d.wife;
    document.getElementById('t-husband').innerText = d.husband;
    document.getElementById('t-son').innerText = d.son;
    document.getElementById('t-daughter').innerText = d.daughter;
    document.getElementById('t-father').innerText = d.father;
    document.getElementById('t-mother').innerText = d.mother;
    document.getElementById('prop-info-note').innerHTML = d.note;
    document.getElementById('btn-prop-print').innerHTML = `<i class='fa-solid fa-print'></i> ${d.btnP}`;
    document.getElementById('btn-prop-reset').innerHTML = `<i class='fa-solid fa-trash-can'></i> ${d.btnR}`;

    calculateFarayez();
}

function calculateFarayez() {
    const land = parseFloat(document.getElementById('prop-land').value) || 0;
    const cash = parseFloat(document.getElementById('prop-cash').value) || 0;

    const wife = document.getElementById('h-wife').checked;
    const husband = document.getElementById('h-husband').checked;
    const father = document.getElementById('h-father').checked;
    const mother = document.getElementById('h-mother').checked;
    const hasSon = document.getElementById('h-son').checked;
    const hasDaughter = document.getElementById('h-daughter').checked;

    const qWife = parseInt(document.getElementById('q-wife').value) || 1;
    const qSon = parseInt(document.getElementById('q-son').value) || 0;
    const qDaughter = parseInt(document.getElementById('q-daughter').value) || 0;

    let heirs = [];
    let residue = 1.0;

    if (wife) {
        let share = (hasSon || hasDaughter) ? (1/8) : (1/4);
        heirs.push({ label: propLang==='bn'?'স্ত্রী':'Wife', count: qWife, totalShare: share });
        residue -= share;
    }

    if (husband) {
        let share = (hasSon || hasDaughter) ? (1/4) : (1/2);
        heirs.push({ label: propLang==='bn'?'স্বামী':'Husband', count: 1, totalShare: share });
        residue -= share;
    }

    if (mother) {
        let share = (hasSon || hasDaughter) ? (1/6) : (1/3);
        heirs.push({ label: propLang==='bn'?'মাতা':'Mother', count: 1, totalShare: share });
        residue -= share;
    }

    if (father) {
        let share = (hasSon || hasDaughter) ? (1/6) : 0; 
        if (share > 0) {
            heirs.push({ label: propLang==='bn'?'পিতা':'Father', count: 1, totalShare: share });
            residue -= share;
        }
    }

    if (hasSon || hasDaughter || (father && residue > 0)) {
        let totalUnits = (qSon * 2) + (qDaughter * 1);
        
        if (totalUnits === 0 && father) {
            let pIdx = heirs.findIndex(h => h.label === (propLang==='bn'?'পিতা':'Father'));
            if (pIdx !== -1) heirs[pIdx].totalShare += residue;
            else heirs.push({ label: propLang==='bn'?'পিতা':'Father', count: 1, totalShare: residue });
            residue = 0;
        } else if (totalUnits > 0) {
            let unitValue = residue / totalUnits;
            if (hasSon) heirs.push({ label: propLang==='bn'?'পুত্র':'Son', count: qSon, totalShare: unitValue * 2 * qSon });
            if (hasDaughter) heirs.push({ label: propLang==='bn'?'কন্যা':'Daughter', count: qDaughter, totalShare: unitValue * qDaughter });
            residue = 0;
        }
    }

    renderPropReport(heirs, land, cash);
}

function renderPropReport(heirs, land, cash) {
    const area = document.getElementById('prop-print-area');
    const labels = propLang === 'bn' ? 
        { h1: "উত্তরাধিকার বন্টননামা রিপোর্ট", h3: "সম্পত্তি বন্টনের বিস্তারিত হিসাব", th1: "উত্তরাধিকারী", th2: "অংশ", th3: "জমি (শতাংশ)", th4: "টাকা (নগদ)", empty: "উত্তরাধিকারী নির্বাচন করুন।" } :
        { h1: "Inheritance Distribution Report", h3: "Detailed Calculation of Property", th1: "Heir", th2: "Share", th3: "Land (Decimal)", th4: "Cash (Money)", empty: "Please select heirs to calculate." };

    if (heirs.length === 0) {
        area.innerHTML = `<p style="text-align:center; padding:100px; color:#94a3b8;">${labels.empty}</p>`;
        return;
    }

    let rows = "";
    heirs.forEach(h => {
        let pShare = (h.totalShare / h.count);
        rows += `<tr>
            <td>${h.label} ${h.count > 1 ? '('+toPropN(h.count)+')' : ''}</td>
            <td>${(pShare * 100).toFixed(3)}%</td>
            <td>${toPropN((pShare * land).toFixed(2))}</td>
            <td>${toPropN((pShare * cash).toFixed(2))}</td>
        </tr>`;
    });

    area.innerHTML = `
        <h1>${labels.h1}</h1>
        <h3>${labels.h3}</h3>
        <div style="margin-bottom:20px; font-weight:bold;">
            ${propLang === 'bn' ? 'মোট জমি:' : 'Total Land:'} ${toPropN(land)} | 
            ${propLang === 'bn' ? 'মোট নগদ:' : 'Total Cash:'} ${toPropN(cash)}
        </div>
        <table class="prop-table">
            <thead>
                <tr>
                    <th>${labels.th1}</th>
                    <th>${labels.th2}</th>
                    <th>${labels.th3}</th>
                    <th>${labels.th4}</th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>
        <div style="margin-top:50px; border-top:1px solid #ddd; padding-top:10px; font-size:12px; color:#666; text-align:center;">
            Generated by: Digital Seba - www.seba.pro.bd
        </div>
    `;
}

function printPropPaper() {
    const printContent = document.getElementById('prop-print-area').innerHTML;
    const distName = document.getElementById('ram-district-select') ? document.getElementById('ram-district-select').value : '';
    
    const pWin = window.open('', '', 'height=900,width=1000');
    
    pWin.document.write('<html><head><title>Inheritance Report - www.seba.pro.bd</title>');
    
    pWin.document.write('<link href="https://fonts.maateen.me/solaiman-lipi/font.css" rel="stylesheet">');
    
    pWin.document.write('<style>');
    pWin.document.write(`
        body { margin: 0; padding: 0; background: #fff; }
        #p-wrapper { 
            width: 210mm; 
            min-height: 297mm; 
            padding: 20mm; 
            box-sizing: border-box; 
            font-family: "SolaimanLipi", Arial, sans-serif !important;
            color: #000;
        }
        h1 { font-size: 26px; text-align: center; margin-bottom: 5px; color: #059669; }
        h3 { font-size: 18px; text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
        .prop-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        .prop-table th, .prop-table td { border: 1px solid #000; padding: 10px; text-align: center; font-weight: bold; font-size: 15px; }
        thead { background: #f2f2f2 !important; -webkit-print-color-adjust: exact; }
        @page { size: A4; margin: 0; }
        .footer-note { margin-top: 50px; text-align: center; font-size: 12px; border-top: 1px solid #ddd; padding-top: 10px; }
    `);
    pWin.document.write('</style></head><body>');
    
    pWin.document.write('<div id="p-wrapper">' + printContent + '</div>');
    pWin.document.write('</body></html>');
    
    pWin.document.close();
    
    setTimeout(() => {
        pWin.print();
        pWin.close();
    }, 700);
}

function resetPropTool() {
    document.getElementById('prop-land').value = "";
    document.getElementById('prop-cash').value = "";
    document.querySelectorAll('#propertyCalcModal input[type="checkbox"]').forEach(c => c.checked = false);
    calculateFarayez();
}
;

const psShortcutsData = [
    // --- TOOLS (Single Key) ---
    { key: "V", category: "tool", bn: "মুভ টুল (Move Tool)", en: "Move Tool" },
    { key: "M", category: "tool", bn: "রেকট্যাঙ্গুলার/ইলিপটিক্যাল মার্কুই টুল", en: "Marquee Tool" },
    { key: "L", category: "tool", bn: "ল্যাসো টুল (Lasso/Polygonal/Magnetic)", en: "Lasso Tool" },
    { key: "W", category: "tool", bn: "ম্যাজিক ওয়ান্ড / কুইক সিলেকশন", en: "Magic Wand / Quick Selection" },
    { key: "C", category: "tool", bn: "ক্রপ টুল / স্লাইস টুল", en: "Crop / Slice Tool" },
    { key: "I", category: "tool", bn: "আইড্রপার / রুলার / নোট", en: "Eyedropper / Ruler" },
    { key: "J", category: "tool", bn: "স্পট হিলিং / প্যাচ / কনটেন্ট অ্যাওয়ার", en: "Spot Healing / Patch Tool" },
    { key: "B", category: "tool", bn: "ব্রাশ / পেন্সিল / কালার রিপ্লেসমেন্ট", en: "Brush / Pencil Tool" },
    { key: "S", category: "tool", bn: "ক্লোন স্ট্যাম্প / প্যাটার্ন স্ট্যাম্প", en: "Clone Stamp Tool" },
    { key: "Y", category: "tool", bn: "হিস্ট্রি ব্রাশ / আর্ট হিস্ট্রি ব্রাশ", en: "History Brush Tool" },
    { key: "E", category: "tool", bn: "ইরেজার টুল (Eraser)", en: "Eraser Tool" },
    { key: "G", category: "tool", bn: "গ্রেডিয়েন্ট / পেইন্ট বাকেট", en: "Gradient / Paint Bucket" },
    { key: "O", category: "tool", bn: "ডজ / বার্ন / স্পঞ্জ টুল", en: "Dodge / Burn Tool" },
    { key: "P", category: "tool", bn: "পেন টুল (Pen Tool)", en: "Pen Tool" },
    { key: "T", category: "tool", bn: "টাইপ টুল (Horizontal/Vertical Text)", en: "Type Tool" },
    { key: "A", category: "tool", bn: "পাথ সিলেকশন / ডিরেক্ট সিলেকশন", en: "Path / Direct Selection" },
    { key: "U", category: "tool", bn: "শেপ টুল (Rectangle/Ellipse/Line)", en: "Shape Tool" },
    { key: "K", category: "tool", bn: "ফ্রেম টুল (Frame Tool)", en: "Frame Tool" },
    { key: "H", category: "tool", bn: "হ্যান্ড টুল (Hand Tool)", en: "Hand Tool" },
    { key: "R", category: "tool", bn: "রোটেট ভিউ টুল (Rotate View)", en: "Rotate View Tool" },
    { key: "Z", category: "tool", bn: "জুম টুল (Zoom Tool)", en: "Zoom Tool" },
    { key: "D", category: "tool", bn: "ডিফল্ট কালার (সাদা-কালোর) রিসেট", en: "Default Colors" },
    { key: "X", category: "tool", bn: "ফোরগ্রাউন্ড ও ব্যাকগ্রাউন্ড কালার সুইচ", en: "Switch FG/BG Colors" },
    { key: "Q", category: "tool", bn: "কুইক মাস্ক মোড অন/অফ", en: "Quick Mask Mode" },
    { key: "F", category: "tool", bn: "স্ক্রিন মোড পরিবর্তন (Full Screen)", en: "Change Screen Mode" },
    { key: "Shift + Tool Key", category: "tool", bn: "একই গ্রুপের টুলের মধ্যে সুইচ করা", en: "Cycle Through Hidden Tools" },

    // --- FILE & APP MANAGEMENT ---
    { key: "Ctrl + N", category: "file", bn: "নতুন ফাইল বা ডকুমেন্ট তৈরি", en: "New Document" },
    { key: "Ctrl + O", category: "file", bn: "ফাইল ওপেন করা", en: "Open File" },
    { key: "Ctrl + Alt + O", category: "file", bn: "অ্যাডোবি ব্রিজ থেকে ওপেন", en: "Open in Bridge" },
    { key: "Ctrl + W", category: "file", bn: "বর্তমান ফাইলটি বন্ধ করা", en: "Close Document" },
    { key: "Ctrl + Alt + W", category: "file", bn: "সবগুলো ফাইল একসাথে বন্ধ করা", en: "Close All" },
    { key: "Ctrl + S", category: "file", bn: "ফাইল সেভ করা", en: "Save" },
    { key: "Ctrl + Shift + S", category: "file", bn: "সেভ অ্যাজ (Save As)", en: "Save As" },
    { key: "Ctrl + Alt + S", category: "file", bn: "কপি সেভ করা", en: "Save a Copy" },
    { key: "Ctrl + Shift + Alt + S", category: "file", bn: "ওয়েবের জন্য সেভ করা (Legacy)", en: "Save for Web" },
    { key: "Ctrl + P", category: "file", bn: "প্রিন্ট মেনু ওপেন", en: "Print" },
    { key: "Ctrl + K", category: "file", bn: "প্রেফারেন্স সেটিংস (Preferences)", en: "Preferences" },
    { key: "Ctrl + Q", category: "file", bn: "ফটোশপ থেকে বের হওয়া", en: "Exit Photoshop" },
    { key: "F12", category: "file", bn: "ফাইল রিভার্ট করা (Revert)", en: "Revert File" },

    // --- EDITING & TRANSFORMATION ---
    { key: "Ctrl + Z", category: "edit", bn: "আনডু / রিডু (Undo/Redo)", en: "Undo/Redo" },
    { key: "Ctrl + Alt + Z", category: "edit", bn: "ধাপে ধাপে পেছনে যাওয়া", en: "Step Backward" },
    { key: "Ctrl + Shift + Z", category: "edit", bn: "ধাপে ধাপে সামনে যাওয়া", en: "Step Forward" },
    { key: "Ctrl + C", category: "edit", bn: "কপি করা", en: "Copy" },
    { key: "Ctrl + X", category: "edit", bn: "কাট করা", en: "Cut" },
    { key: "Ctrl + V", category: "edit", bn: "পেস্ট করা", en: "Paste" },
    { key: "Ctrl + Shift + V", category: "edit", bn: "একই জায়গায় পেস্ট করা", en: "Paste in Place" },
    { key: "Ctrl + T", category: "edit", bn: "ফ্রি ট্রান্সফর্ম (ছোট/বড় করা)", en: "Free Transform" },
    { key: "Ctrl + Shift + T", category: "edit", bn: "আগের ট্রান্সফর্ম রিপিট করা", en: "Repeat Last Transform" },
    { key: "Ctrl + Alt + Shift + T", category: "edit", bn: "ট্রান্সফর্ম ডুপ্লিকেট রিপিট", en: "Duplicate & Repeat Transform" },
    { key: "Shift + F5", category: "edit", bn: "ফিল মেনু (Fill)", en: "Fill" },
    { key: "Alt + Backspace", category: "edit", bn: "ফোরগ্রাউন্ড কালার দিয়ে ফিল", en: "Fill with Foreground Color" },
    { key: "Ctrl + Backspace", category: "edit", bn: "ব্যাকগ্রাউন্ড কালার দিয়ে ফিল", en: "Fill with Background Color" },

    // --- IMAGE ADJUSTMENTS ---
    { key: "Ctrl + L", category: "adjust", bn: "লেভেলস ঠিক করা (Levels)", en: "Levels" },
    { key: "Ctrl + M", category: "adjust", bn: "কার্ভস ঠিক করা (Curves)", en: "Curves" },
    { key: "Ctrl + U", category: "adjust", bn: "হিউ / স্যাচুরেশন পরিবর্তন", en: "Hue/Saturation" },
    { key: "Ctrl + B", category: "adjust", bn: "কালার ব্যালেন্স (Color Balance)", en: "Color Balance" },
    { key: "Ctrl + Shift + L", category: "adjust", bn: "অটো লেভেলস (Auto Levels)", en: "Auto Levels" },
    { key: "Ctrl + Shift + Alt + L", category: "adjust", bn: "অটো কন্ট্রাস্ট", en: "Auto Contrast" },
    { key: "Ctrl + Shift + B", category: "adjust", bn: "অটো কালার (Auto Color)", en: "Auto Color" },
    { key: "Ctrl + I", category: "adjust", bn: "কালার ইনভার্ট (উল্টানো)", en: "Invert Color" },
    { key: "Ctrl + Shift + U", category: "adjust", bn: "সাদা-কালোর করা (Desaturate)", en: "Desaturate" },
    { key: "Ctrl + Alt + I", category: "adjust", bn: "ইমেজ সাইজ পরিবর্তন", en: "Image Size" },
    { key: "Ctrl + Alt + C", category: "adjust", bn: "ক্যানভাস সাইজ পরিবর্তন", en: "Canvas Size" },
    { key: "Ctrl + Shift + Alt + B", category: "adjust", bn: "ব্ল্যাক অ্যান্ড হোয়াইট অ্যাডজাস্ট", en: "Black & White" },

    // --- LAYERS ---
    { key: "Ctrl + J", category: "layer", bn: "লেয়ার কপি বা ডুপ্লিকেট করা", en: "Duplicate Layer" },
    { key: "Ctrl + Shift + J", category: "layer", bn: "কাট করে নতুন লেয়ারে নেওয়া", en: "Layer via Cut" },
    { key: "Ctrl + Shift + N", category: "layer", bn: "নতুন লেয়ার তৈরি", en: "New Layer" },
    { key: "Ctrl + G", category: "layer", bn: "লেয়ারগুলো গ্রুপ করা", en: "Group Layers" },
    { key: "Ctrl + Shift + G", category: "layer", bn: "লেয়ারগুলো আনগ্রুপ করা", en: "Ungroup Layers" },
    { key: "Ctrl + E", category: "layer", bn: "নিচের লেয়ারের সাথে যুক্ত করা", en: "Merge Down" },
    { key: "Ctrl + Shift + E", category: "layer", bn: "সব ভিজিবল লেয়ার এক করা", en: "Merge Visible" },
    { key: "Ctrl + Alt + Shift + E", category: "layer", bn: "সব লেয়ার এক করে নতুন লেয়ার", en: "Stamp Visible" },
    { key: "Ctrl + Alt + G", category: "layer", bn: "ক্লিপিং মাস্ক তৈরি/বাতিল", en: "Clipping Mask" },
    { key: "Ctrl + [", category: "layer", bn: "লেয়ার এক ধাপ নিচে নামানো", en: "Send Backward" },
    { key: "Ctrl + ]", category: "layer", bn: "লেয়ার এক ধাপ উপরে উঠানো", en: "Bring Forward" },
    { key: "Ctrl + Shift + [", category: "layer", bn: "লেয়ার সবার নিচে পাঠানো", en: "Send to Back" },
    { key: "Ctrl + Shift + ]", category: "layer", bn: "লেয়ার সবার উপরে আনা", en: "Bring to Front" },
    { key: "Alt + [ / ]", category: "layer", bn: "একটি লেয়ার থেকে অন্য লেয়ারে যাওয়া", en: "Select Layers" },
    { key: "Ctrl + /", category: "layer", bn: "লেয়ার লক বা আনলক করা", en: "Lock/Unlock Layer" },

    // --- SELECTION ---
    { key: "Ctrl + A", category: "select", bn: "সবকিছু সিলেক্ট করা", en: "Select All" },
    { key: "Ctrl + D", category: "select", bn: "সিলেকশন বাতিল (Deselect)", en: "Deselect" },
    { key: "Ctrl + Shift + D", category: "select", bn: "পুনরায় সিলেকশন করা (Reselect)", en: "Reselect" },
    { key: "Ctrl + Shift + I", category: "select", bn: "সিলেকশন উল্টানো (Inverse)", en: "Inverse Selection" },
    { key: "Ctrl + Alt + R", category: "select", bn: "সিলেক্ট অ্যান্ড মাস্ক / রিফাইন এজ", en: "Select and Mask" },
    { key: "Shift + F6", category: "select", bn: "ফেদার সিলেকশন (Feather)", en: "Feather" },

    // --- BRUSH & PAINTING ---
    { key: "[", category: "brush", bn: "ব্রাশের সাইজ কমানো", en: "Decrease Brush Size" },
    { key: "]", category: "brush", bn: "ব্রাশের সাইজ বাড়ানো", en: "Increase Brush Size" },
    { key: "{", category: "brush", bn: "ব্রাশের হার্ডনেস কমানো", en: "Decrease Hardness" },
    { key: "}", category: "brush", bn: "ব্রাশের হার্ডনেস বাড়ানো", en: "Increase Hardness" },
    { key: "0 - 9", category: "brush", bn: "ব্রাশের অপাসিটি পরিবর্তন (১০% - ১০০%)", en: "Change Opacity" },
    { key: "Shift + 0-9", category: "brush", bn: "ব্রাশের ফ্লো (Flow) পরিবর্তন", en: "Change Flow" },
    { key: ",", category: "brush", bn: "আগের ব্রাশে যাওয়া", en: "Previous Brush" },
    { key: ".", category: "brush", bn: "পরের ব্রাশে যাওয়া", en: "Next Brush" },
    { key: "Caps Lock", category: "brush", bn: "প্রিসিশন কার্সার অন/অফ", en: "Precise Cursor" },

    // --- VIEW & NAVIGATION ---
    { key: "Ctrl + R", category: "view", bn: "রুলার (Ruler) দেখানো বা লুকানো", en: "Rulers" },
    { key: "Ctrl + ;", category: "view", bn: "গাইড (Guides) দেখানো বা লুকানো", en: "Show Guides" },
    { key: "Ctrl + '", category: "view", bn: "গ্রিড (Grid) দেখানো বা লুকানো", en: "Show Grid" },
    { key: "Ctrl + 0", category: "view", bn: "স্ক্রিনের সাথে ইমেজ ফিট করা", en: "Fit on Screen" },
    { key: "Ctrl + 1", category: "view", bn: "আসল সাইজে দেখা (100%)", en: "Actual Pixels" },
    { key: "Ctrl + +", category: "view", bn: "জুম ইন (Zoom In)", en: "Zoom In" },
    { key: "Ctrl + -", category: "view", bn: "জুম আউট (Zoom Out)", en: "Zoom Out" },
    { key: "Spacebar (Hold)", category: "view", bn: "হ্যান্ড টুল নেভিগেশন", en: "Hand Tool (Hold)" },
    { key: "Tab", category: "view", bn: "সব প্যানেল লুকানো বা দেখানো", en: "Show/Hide Panels" },
    { key: "Shift + Tab", category: "view", bn: "শুধুমাত্র টুলবার ও ডান পাশের প্যানেল লুকানো", en: "Hide Side Panels" },

    // --- BLENDING MODES ---
    { key: "Shift + +", category: "blend", bn: "ব্লেন্ডিং মোড পরেরটিতে যাওয়া", en: "Next Blending Mode" },
    { key: "Shift + -", category: "blend", bn: "ব্লেন্ডিং মোড আগেরটিতে যাওয়া", en: "Previous Blending Mode" },
    { key: "Shift + Alt + N", category: "blend", bn: "নরমাল মোড (Normal Mode)", en: "Normal Mode" },
    { key: "Shift + Alt + M", category: "blend", bn: "মাল্টিপ্লাই মোড (Multiply)", en: "Multiply Mode" },
    { key: "Shift + Alt + S", category: "blend", bn: "স্ক্রিন মোড (Screen)", en: "Screen Mode" },
    { key: "Shift + Alt + O", category: "blend", bn: "ওভারলে মোড (Overlay)", en: "Overlay Mode" },
    { key: "Shift + Alt + H", category: "blend", bn: "হার্ড লাইট (Hard Light)", en: "Hard Light" },
    { key: "Shift + Alt + C", category: "blend", bn: "কালার মোড (Color)", en: "Color Blending" },

    // --- TEXT & TYPOGRAPHY ---
    { key: "Ctrl + Shift + L", category: "text", bn: "টেক্সট বামে রাখা (Align Left)", en: "Align Left" },
    { key: "Ctrl + Shift + C", category: "text", bn: "টেক্সট মাঝে রাখা (Align Center)", en: "Align Center" },
    { key: "Ctrl + Shift + R", category: "text", bn: "টেক্সট ডানে রাখা (Align Right)", en: "Align Right" },
    { key: "Ctrl + Shift + >", category: "text", bn: "টেক্সটের সাইজ বাড়ানো", en: "Increase Font Size" },
    { key: "Ctrl + Shift + <", category: "text", bn: "টেক্সটের সাইজ কমানো", en: "Decrease Font Size" },
    { key: "Alt + ↓ / ↑", category: "text", bn: "লাইন স্পেসিং পরিবর্তন (Leading)", en: "Change Leading" },
    { key: "Ctrl + Enter", category: "text", bn: "টেক্সট টাইপ সম্পন্ন করা (Commit)", en: "Commit Text Edit" },

    // --- FILTERS & SPECIAL ---
    { key: "Ctrl + Shift + X", category: "filter", bn: "লিকুইফাই ফিল্টার (Liquify)", en: "Liquify Filter" },
    { key: "Ctrl + Shift + A", category: "filter", bn: "ক্যামেরা র ফিল্টার (Camera Raw)", en: "Camera Raw Filter" },
    { key: "Ctrl + Alt + V", category: "filter", bn: "ভ্যানিশিং পয়েন্ট", en: "Vanishing Point" },
    { key: "Ctrl + F", category: "filter", bn: "সবশেষে ব্যবহৃত ফিল্টার আবার দেওয়া", en: "Apply Last Filter" }
];

let psLang = "bn";
let currentPsCat = "all";

function openPsShortcutsModal() {
    if(typeof setActiveMode === "function") setActiveMode('mode-ps-shortcuts');
    document.getElementById('psShortcutsModal').style.display = 'flex';
    renderPsShortcuts(psShortcutsData);
}

function closePsModal() {
    document.getElementById('psShortcutsModal').style.display = 'none';
}

function setPsLang(lang) {
    psLang = lang;
    document.getElementById('ps-btn-bn').classList.toggle('active', lang === 'bn');
    document.getElementById('ps-btn-en').classList.toggle('active', lang === 'en');
    
    const ui = {
        bn: { title: "ফটোশপ মাস্টার শর্টকাট", placeholder: "টুল বা কমান্ড লিখে সার্চ করুন..." },
        en: { title: "Photoshop Master Shortcuts", placeholder: "Search for tool or command..." }
    };
    
    document.getElementById('ps-ui-title').innerText = ui[lang].title;
    document.getElementById('ps-search-input').placeholder = ui[lang].placeholder;
    filterPsShortcuts();
}

function renderPsShortcuts(data) {
    const container = document.getElementById("ps-master-grid");
    container.innerHTML = "";

    data.forEach(item => {
        const card = document.createElement("div");
        card.className = "ps-card-item";
        card.innerHTML = `
            <div class="ps-key-box">${item.key}</div>
            <div class="ps-desc-text">${psLang === 'bn' ? item.bn : item.en}</div>
        `;
        container.appendChild(card);
    });
}

function filterPsByCategory(cat) {
    currentPsCat = cat;
    document.querySelectorAll('.ps-cat-btn').forEach(btn => {
        btn.classList.toggle('active', btn.innerText.toLowerCase().includes(cat));
    });
    filterPsShortcuts();
}

function filterPsShortcuts() {
    const query = document.getElementById('ps-search-input').value.toLowerCase();
    const filtered = psShortcutsData.filter(item => {
        const matchesQuery = item.bn.toLowerCase().includes(query) || 
                             item.en.toLowerCase().includes(query) || 
                             item.key.toLowerCase().includes(query);
        const matchesCat = currentPsCat === "all" || item.category === currentPsCat;
        return matchesQuery && matchesCat;
    });
    renderPsShortcuts(filtered);
}
;

let salList = [];
let salLogoData = null;
let salLanguage = "bn";
let salOrientation = "p";

function openSalModal() {
    document.getElementById('salaryMakerModal').style.display = 'flex';
    if(typeof setActiveMode === "function") setActiveMode('mode-salary');
    
    if (salList.length === 0) {
        const defaultName = salLanguage === 'bn' ? "নাম লিখুন" : "Enter Name";
        const defaultDesig = salLanguage === 'bn' ? "পদবী" : "Designation";
        salList = [["1", defaultName, defaultDesig, "0", "0", "0", "0", "0"]];
    }
    setSalLang(salLanguage);
}

function closeSalModal() {
    document.getElementById('salaryMakerModal').style.display = 'none';
}

function setSalLang(lang) {
    salLanguage = lang;
    document.getElementById('sal-btn-bn').classList.toggle('active', lang === 'bn');
    document.getElementById('sal-btn-en').classList.toggle('active', lang === 'en');
    
    salList.forEach(row => {
        if (lang === 'en') {
            if (row[1] === "নাম লিখুন") row[1] = "Enter Name";
            if (row[2] === "পদবী") row[2] = "Designation";
        } else {
            if (row[1] === "Enter Name") row[1] = "নাম লিখুন";
            if (row[2] === "Designation") row[2] = "পদবী";
        }
    });

    const ui = {
        bn: {
            title: "স্যালারি শীট মেকার",
            step1: "১. প্রতিষ্ঠানের তথ্য",
            step2: "২. সেটিংস",
            inst: "প্রতিষ্ঠানের নাম লিখুন",
            month: "মাস ও বছর (উদা: জানুয়ারি - ২০২৬)",
            add: "+ কর্মচারী যোগ",
            print: "প্রিন্ট",
            reset: "রিসেট",
            orientP: "লম্বালম্বি প্রিন্ট (P)",
            orientL: "আড়াআড়ি প্রিন্ট (L)"
        },
        en: {
            title: "Salary Sheet Maker",
            step1: "1. Institution Info",
            step2: "2. Settings",
            inst: "Enter Institution Name",
            month: "Month & Year (e.g. Jan - 2026)",
            add: "+ Add Employee",
            print: "Print",
            reset: "Reset",
            orientP: "Portrait Print (P)",
            orientL: "Landscape Print (L)"
        }
    };

    document.getElementById('sal-ui-title').innerText = ui[lang].title;
    document.getElementById('lbl-sal-step1').innerText = ui[lang].step1;
    document.getElementById('lbl-sal-step2').innerText = ui[lang].step2;
    document.getElementById('sal-inst-name').placeholder = ui[lang].inst;
    document.getElementById('sal-sub-title').placeholder = ui[lang].month;
    document.getElementById('btn-add-sal').innerText = ui[lang].add;
    document.getElementById('btn-sal-print-ui').innerHTML = `<i class='fa-solid fa-print'/> ${ui[lang].print}`;
    document.getElementById('btn-sal-reset-ui').innerHTML = `<i class='fa-solid fa-trash-can'/> ${ui[lang].reset}`;
    
    const sel = document.getElementById('sal-orient');
    sel.options[0].text = ui[lang].orientP;
    sel.options[1].text = ui[lang].orientL;

    drawSal();
}

function loadSalLogo(event) {
    const reader = new FileReader();
    reader.onload = (e) => {
        salLogoData = e.target.result;
        document.getElementById('sal-logo-pv').src = salLogoData;
        document.getElementById('sal-logo-pv').style.display = 'flex';
        document.getElementById('sal-plus-ico').style.display = 'none';
        drawSal();
    };
    reader.readAsDataURL(event.target.files[0]);
}

function addSalRow() {
    let sl = salList.length + 1;
    salList.push([sl.toString(), "", "", "0", "0", "0", "0", "0"]);
    drawSal();
}

function updateSalData(r, c, val) {
    salList[r][c] = val;
    if (c >= 3 && c <= 6) {
        let b = parseFloat(salList[r][3]) || 0;
        let a = parseFloat(salList[r][4]) || 0;
        let bo = parseFloat(salList[r][5]) || 0;
        let d = parseFloat(salList[r][6]) || 0;
        salList[r][7] = (b + a + bo - d).toString();
    }
    drawSal();
}

function toSalBN(n) {
    if (salLanguage !== 'bn') return n;
    return n.toString().replace(/\d/g, d => "০১২৩৪৫৬৭৮৯"[d]);
}

function setSalOrient(orient) {
    salOrientation = orient;
    drawSal();
}

function drawSal() {
    const inst = document.getElementById('sal-inst-name').value || (salLanguage === 'bn' ? "প্রতিষ্ঠানের নাম" : "Institution Name");
    const sub = document.getElementById('sal-sub-title').value || (salLanguage === 'bn' ? "বেতন তালিকা - ২০২৬" : "Salary Sheet - 2026");
    const renderArea = document.getElementById('sal-render-area');
    renderArea.className = salOrientation === 'p' ? 'sal-p-size' : 'sal-l-size';

    const headers = salLanguage === 'bn' ? 
        ["ক্র.নং", "নাম", "পদবী", "মূল বেতন", "ভাতা", "বোনাস", "কর্তন", "নিট বেতন"] : 
        ["SL", "Name", "Designation", "Basic", "Allow.", "Bonus", "Deduc.", "Net Pay"];

    let table = `<table><thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>`;
    salList.forEach((row, rIdx) => {
        table += '<tr>';
        row.forEach((cell, cIdx) => {
            const isReadonly = (cIdx === 0 || cIdx === 7);
            const displayValue = (cIdx >= 3) ? toSalBN(cell) : (cIdx === 0 ? toSalBN(cell) : cell);
            table += `<td ${!isReadonly ? 'contenteditable="true"' : ''} onblur="updateSalData(${rIdx}, ${cIdx}, this.innerText)">${displayValue}</td>`;
        });
        table += '</tr>';
    });
    table += '</tbody></table>';

    renderArea.innerHTML = `
        <div style="text-align:center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px;">
            ${salLogoData ? `<img src="${salLogoData}" style="height:50px; margin-bottom:5px;">` : ''}
            <h1 style="margin:0; font-size:22px; font-weight:900;">${inst}</h1>
            <h2 style="margin:5px 0 0; font-size:16px; color:#333;">${sub}</h2>
        </div>
        ${table}
        <div style="margin-top:60px; display:flex; justify-content:space-between; font-weight:bold; font-size:13px; padding: 0 30px;">
            <div style="text-align:center; border-top:1px solid #000; width:150px; padding-top:5px;">${salLanguage==='bn'?'ক্যাশিয়ার':'Cashier'}</div>
            <div style="text-align:center; border-top:1px solid #000; width:150px; padding-top:5px;">${salLanguage==='bn'?'অধ্যক্ষ/মালিক':'Owner/Principal'}</div>
        </div>`;
}

function printSalPaper() {
    const content = document.getElementById('sal-render-area').innerHTML;
    const isL = salOrientation === 'l';
    const pWin = window.open('', '', 'height=850,width=1100');
    pWin.document.write('<html><head><title>Salary Sheet</title>');
    pWin.document.write('<link href="https://fonts.maateen.me/solaiman-lipi/font.css" rel="stylesheet">');
    // প&#2509;র&#2495;ন&#2509;ট সিএসএস য&#2494; অট&#2507;ম&#2503;ট&#2495;ক ম&#2494;র&#2509;জ&#2495;ন ও প&#2503;জ ব&#2509;র&#2503;ক ম&#2503;ইনট&#2503;ইন করব&#2503;
    pWin.document.write(`<style>
        @import url('https://fonts.maateen.me/solaiman-lipi/font.css');
        body { margin: 0; padding: 0; background: #fff; }
        #p-wrap { 
            width: ${isL ? '297mm' : '210mm'}; 
            padding: 15mm; 
            margin: 0 auto;
            box-sizing: border-box; 
            font-family: "SolaimanLipi", Arial, sans-serif !important;
        }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; border: 1.5px solid #000; table-layout: auto; page-break-inside: auto; }
        tr { page-break-inside: avoid; page-break-after: auto; }
        th, td { border: 1px solid #000; padding: 6px; font-size: 13px; text-align: center; color: #000; }
        thead { display: table-header-group; background: #f2f2f2; }
        @page { size: A4 ${isL ? 'landscape' : 'portrait'}; margin: 15mm 10mm; }
    </style></head><body><div id="p-wrap">${content}</div></body></html>`);
    pWin.document.close();
    setTimeout(() => { pWin.print(); pWin.close(); }, 800);
}

function resetSalTool() {
    document.getElementById('sal-inst-name').value = "";
    document.getElementById('sal-sub-title').value = "";
    salLogoData = null;
    
    document.getElementById('fq-logo-pv').style.display = 'none';
    document.getElementById('fq-plus-ico').style.display = 'flex';
    
    const defaultName = salLanguage === 'bn' ? "নাম লিখুন" : "Enter Name";
    const defaultDesig = salLanguage === 'bn' ? "পদবী" : "Designation";
    
    salList = [["1", defaultName, defaultDesig, "0", "0", "0", "0", "0"]];
    
    drawSal();
}
;

let visaCropper = null;
let currentVisaWidthMM = 51;
let currentVisaHeightMM = 51;
let finalCroppedVisaBase64 = null;

// 100+ Countries Visa Photo Dimensions (Width x Height in mm)
const visaCountriesData = [
    { name: "United States (US)", w: 51, h: 51 },
    { name: "India", w: 51, h: 51 },
    { name: "United Kingdom (UK)", w: 35, h: 45 },
    { name: "Schengen (Europe)", w: 35, h: 45 },
    { name: "Canada (Visa)", w: 35, h: 45 },
    { name: "Canada (PR/Passport)", w: 50, h: 70 },
    { name: "Australia", w: 35, h: 45 },
    { name: "New Zealand", w: 35, h: 45 },
    { name: "China", w: 33, h: 48 },
    { name: "Japan", w: 35, h: 45 },
    { name: "Saudi Arabia", w: 40, h: 60 },
    { name: "United Arab Emirates (UAE)", w: 40, h: 60 },
    { name: "Malaysia", w: 35, h: 50 },
    { name: "Singapore", w: 35, h: 45 },
    { name: "South Korea", w: 35, h: 45 },
    { name: "Thailand", w: 35, h: 45 },
    { name: "South Africa", w: 35, h: 45 },
    { name: "Russia", w: 35, h: 45 },
    { name: "Brazil", w: 50, h: 70 },
    { name: "Argentina", w: 40, h: 40 },
    { name: "Bangladesh (Passport)", w: 40, h: 50 },
    { name: "Pakistan", w: 35, h: 45 },
    { name: "Nepal", w: 35, h: 45 },
    { name: "Sri Lanka", w: 35, h: 45 },
    { name: "Maldives", w: 35, h: 45 },
    { name: "Afghanistan", w: 35, h: 45 },
    { name: "Albania", w: 36, h: 47 },
    { name: "Algeria", w: 35, h: 45 },
    { name: "Angola", w: 35, h: 45 },
    { name: "Armenia", w: 35, h: 45 },
    { name: "Austria", w: 35, h: 45 },
    { name: "Azerbaijan", w: 35, h: 45 },
    { name: "Bahamas", w: 50, h: 50 },
    { name: "Bahrain", w: 40, h: 60 },
    { name: "Belarus", w: 35, h: 45 },
    { name: "Belgium", w: 35, h: 45 },
    { name: "Bolivia", w: 40, h: 40 },
    { name: "Bosnia", w: 35, h: 45 },
    { name: "Bulgaria", w: 35, h: 45 },
    { name: "Cambodia", w: 40, h: 60 },
    { name: "Cameroon", w: 40, h: 40 },
    { name: "Chile", w: 40, h: 40 },
    { name: "Colombia", w: 40, h: 40 },
    { name: "Costa Rica", w: 50, h: 50 },
    { name: "Croatia", w: 35, h: 45 },
    { name: "Cuba", w: 40, h: 40 },
    { name: "Cyprus", w: 35, h: 45 },
    { name: "Czech Republic", w: 35, h: 45 },
    { name: "Denmark", w: 35, h: 45 },
    { name: "Dominican Republic", w: 50, h: 50 },
    { name: "Ecuador", w: 40, h: 40 },
    { name: "Egypt", w: 40, h: 60 },
    { name: "Estonia", w: 35, h: 45 },
    { name: "Ethiopia", w: 40, h: 40 },
    { name: "Fiji", w: 35, h: 45 },
    { name: "Finland", w: 36, h: 47 },
    { name: "France", w: 35, h: 45 },
    { name: "Georgia", w: 35, h: 45 },
    { name: "Germany", w: 35, h: 45 },
    { name: "Greece", w: 35, h: 45 },
    { name: "Hong Kong", w: 40, h: 50 },
    { name: "Hungary", w: 35, h: 45 },
    { name: "Iceland", w: 36, h: 47 },
    { name: "Indonesia", w: 35, h: 45 },
    { name: "Iran", w: 40, h: 60 },
    { name: "Iraq", w: 40, h: 60 },
    { name: "Ireland", w: 35, h: 45 },
    { name: "Israel", w: 51, h: 51 },
    { name: "Italy", w: 35, h: 45 },
    { name: "Jamaica", w: 50, h: 50 },
    { name: "Jordan", w: 40, h: 60 },
    { name: "Kazakhstan", w: 40, h: 50 },
    { name: "Kenya", w: 35, h: 45 },
    { name: "Kuwait", w: 40, h: 60 },
    { name: "Lebanon", w: 40, h: 60 },
    { name: "Lithuania", w: 40, h: 50 },
    { name: "Luxembourg", w: 35, h: 45 },
    { name: "Macau", w: 40, h: 50 },
    { name: "Malta", w: 35, h: 45 },
    { name: "Mexico", w: 40, h: 40 },
    { name: "Morocco", w: 40, h: 60 },
    { name: "Myanmar", w: 40, h: 60 },
    { name: "Netherlands", w: 35, h: 45 },
    { name: "Nigeria", w: 35, h: 45 },
    { name: "Norway", w: 35, h: 45 },
    { name: "Oman", w: 40, h: 60 },
    { name: "Panama", w: 50, h: 50 },
    { name: "Peru", w: 50, h: 50 },
    { name: "Philippines", w: 35, h: 45 },
    { name: "Poland", w: 35, h: 45 },
    { name: "Portugal", w: 35, h: 45 },
    { name: "Qatar", w: 38, h: 48 },
    { name: "Romania", w: 35, h: 45 },
    { name: "Serbia", w: 35, h: 45 },
    { name: "Slovakia", w: 35, h: 45 },
    { name: "Spain", w: 35, h: 45 },
    { name: "Sweden", w: 35, h: 45 },
    { name: "Switzerland", w: 35, h: 45 },
    { name: "Syria", w: 40, h: 40 },
    { name: "Taiwan", w: 35, h: 45 },
    { name: "Turkey", w: 50, h: 60 },
    { name: "Ukraine", w: 35, h: 45 },
    { name: "Uruguay", w: 40, h: 40 },
    { name: "Uzbekistan", w: 35, h: 45 },
    { name: "Venezuela", w: 40, h: 40 },
    { name: "Vietnam", w: 40, h: 60 },
    { name: "Yemen", w: 40, h: 60 },
    { name: "Zimbabwe", w: 50, h: 50 }
];

// Initialize Modal & Dropdown
function openVisaModal() {
    setActiveMode('mode-visa-photo');
    document.getElementById('visaModal').style.display = 'flex';
    populateCountryList(visaCountriesData);
}

function closeVisaModal() {
    document.getElementById('visaModal').style.display = 'none';
    deleteVisaImage(); 
}

// Dropdown Logic
function toggleVisaDropdown() {
    const menu = document.getElementById('dropdownMenu');
    menu.classList.toggle('show');
    if(menu.classList.contains('show')) {
        document.getElementById('visaSearchInput').focus();
    }
}

function populateCountryList(data) {
    const list = document.getElementById('visaCountryList');
    list.innerHTML = '';
    data.forEach(country => {
        let unit = (country.w === 51) ? 'inch' : 'mm';
        let displayW = (country.w === 51) ? '2' : country.w;
        let displayH = (country.h === 51) ? '2' : country.h;
        
        let li = document.createElement('li');
        li.innerHTML = `${country.name} <span>${displayW}x${displayH} ${unit}</span>`;
        li.onclick = () => selectCountry(country.name, country.w, country.h);
        list.appendChild(li);
    });
}

function filterVisaCountries() {
    const input = document.getElementById('visaSearchInput').value.toLowerCase();
    const filtered = visaCountriesData.filter(c => c.name.toLowerCase().includes(input));
    populateCountryList(filtered);
}

function selectCountry(name, w, h) {
    currentVisaWidthMM = w;
    currentVisaHeightMM = h;
    
    let unit = (w === 51 || w === 50) && h === 51 ? 'inch' : 'mm';
    let displayW = w === 51 ? '2' : w;
    let displayH = h === 51 ? '2' : h;
    
    document.getElementById('selected-country-text').innerText = `${name} (${displayW} x ${displayH} ${unit})`;
    document.getElementById('visa-specs-text').innerText = `${displayW} x ${displayH} ${unit}`;
    
    document.getElementById('dropdownMenu').classList.remove('show');

    if(visaCropper) {
        visaCropper.setAspectRatio(w / h);
    }
}

// Close dropdown when clicking outside
window.addEventListener('click', function(e) {
    if (!document.getElementById('visaDropdown').contains(e.target)) {
        document.getElementById('dropdownMenu').classList.remove('show');
    }
});


// Image & Cropper Logic
function loadVisaImage(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const image = document.getElementById('visa-image');
        image.src = e.target.result;
        
        document.getElementById('visa-placeholder').style.display = 'none';
        document.getElementById('visa-upload-btn').style.display = 'none';
        document.getElementById('visa-result-preview').style.display = 'none';
        image.style.display = 'flex';
        
        document.getElementById('visa-precrop-actions').style.display = 'grid';
        document.getElementById('btn-visa-reset').style.display = 'none';
        document.getElementById('btn-visa-jpg').disabled = true;
        document.getElementById('btn-visa-pdf').disabled = true;
        finalCroppedVisaBase64 = null;

        if (visaCropper) {
            visaCropper.destroy();
        }

        const ratio = currentVisaWidthMM / currentVisaHeightMM;

        visaCropper = new Cropper(image, {
            aspectRatio: ratio,
            viewMode: 1,
            autoCropArea: 0.8,
            dragMode: 'move',
            guides: true,
            center: true,
            highlight: false,
            cropBoxMovable: true,
            cropBoxResizable: true,
            toggleDragModeOnDblclick: false,
            zoomOnWheel: false
        });
    };
    reader.readAsDataURL(file);
}

function getPxAt300DPI(mm) {
    return Math.round((mm / 25.4) * 300);
}

function performVisaCrop() {
    if (!visaCropper) return;
    
    const targetWidthPx = getPxAt300DPI(currentVisaWidthMM);
    const targetHeightPx = getPxAt300DPI(currentVisaHeightMM);

    const canvas = visaCropper.getCroppedCanvas({
        width: targetWidthPx,
        height: targetHeightPx,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high'
    });

    finalCroppedVisaBase64 = canvas.toDataURL('image/jpeg', 1.0);

    visaCropper.destroy();
    visaCropper = null;
    document.getElementById('visa-image').style.display = 'none';
    
    const resultImg = document.getElementById('visa-result-preview');
    resultImg.src = finalCroppedVisaBase64;
    resultImg.style.display = 'flex';

    document.getElementById('visa-precrop-actions').style.display = 'none';
    document.getElementById('btn-visa-reset').style.display = 'flex';
    
    document.getElementById('btn-visa-jpg').disabled = false;
    document.getElementById('btn-visa-pdf').disabled = false;

    document.getElementById('visaDropdown').style.pointerEvents = 'none';
    document.getElementById('visaDropdown').style.opacity = '0.5';
}

function deleteVisaImage() {
    if(visaCropper) {
        visaCropper.destroy();
        visaCropper = null;
    }
    finalCroppedVisaBase64 = null;
    
    document.getElementById('visa-input').value = '';
    document.getElementById('visa-image').src = '';
    document.getElementById('visa-result-preview').src = '';
    
    document.getElementById('visa-image').style.display = 'none';
    document.getElementById('visa-result-preview').style.display = 'none';
    document.getElementById('visa-placeholder').style.display = 'flex';
    document.getElementById('visa-upload-btn').style.display = 'flex';
    
    document.getElementById('visa-precrop-actions').style.display = 'none';
    document.getElementById('btn-visa-reset').style.display = 'none';
    document.getElementById('btn-visa-jpg').disabled = true;
    document.getElementById('btn-visa-pdf').disabled = true;

    document.getElementById('visaDropdown').style.pointerEvents = 'auto';
    document.getElementById('visaDropdown').style.opacity = '1';
}

function downloadVisaSingle() {
    if (!finalCroppedVisaBase64) return;
    const link = document.createElement('a');
    link.download = `Visa_Photo_${currentVisaWidthMM}x${currentVisaHeightMM}.jpg`;
    link.href = finalCroppedVisaBase64;
    link.click();
}

function openVisaCopiesModal() {
    if (!finalCroppedVisaBase64) return;
    // Set default value to 6
    document.getElementById('visa-copy-count').value = 4;
    // Show the custom UI
    document.getElementById('visaCopiesModal').style.display = 'flex';
}

function closeVisaCopiesModal() {
    document.getElementById('visaCopiesModal').style.display = 'none';
}

function changeVisaCopies(amount) {
    let input = document.getElementById('visa-copy-count');
    let val = parseInt(input.value) || 0;
    val += amount;
    if (val < 1) val = 1;
    if (val > 100) val = 100; // Limit to maximum 100 copies
    input.value = val;
}

function executeVisaPDF() {
    // Hide the modal first
    closeVisaCopiesModal();
    
    // Get the quantity from our custom UI
    let copiesInput = document.getElementById('visa-copy-count').value;
    const totalCopies = parseInt(copiesInput);
    
    if (isNaN(totalCopies) || totalCopies <= 0) return;

    // Proceed with jsPDF generation
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ format: 'a4', unit: 'mm' });

    // A4 paper dimensions and margins
    const pageWidth = 210; 
    const pageHeight = 297; 
    const margin = 15; 
    const gap = 5; 

    let currentX = margin;
    let currentY = margin;

    // Automatic Grid Layout Logic
    for (let i = 0; i < totalCopies; i++) {
        
        // Check if next image exceeds right margin
        if (currentX + currentVisaWidthMM > pageWidth - margin) {
            currentX = margin;
            currentY += currentVisaHeightMM + gap;
        }
        
        // Check if next image exceeds bottom margin
        if (currentY + currentVisaHeightMM > pageHeight - margin) {
            doc.addPage();
            currentX = margin;
            currentY = margin;
        }
        
        // Add cut line (border)
        doc.setDrawColor(200, 200, 200);
        doc.rect(currentX - 0.2, currentY - 0.2, currentVisaWidthMM + 0.4, currentVisaHeightMM + 0.4);
        
        // Add cropped image
        doc.addImage(finalCroppedVisaBase64, 'JPEG', currentX, currentY, currentVisaWidthMM, currentVisaHeightMM);
        
        // Move X to the right for the next image
        currentX += currentVisaWidthMM + gap;
    }

    doc.save(`Visa_Print_A4_${currentVisaWidthMM}x${currentVisaHeightMM}.pdf`);
}
;

function openFamilyCardModal() {
   setActiveMode('');
      document.getElementById('familyCardModal').style.display = 'flex';
      updateFamilyCard();    
  }

  function closeFamilyCardModal() {
      document.getElementById('familyCardModal').style.display = 'none';
  }

  // English to Bangla Number Converter Logic
  const engToBdNum = (str) => {
      const bnMap = { '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪', '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯' };
      return str.replace(/[0-9]/g, match => bnMap[match]);
  };

  function updateFamilyCard() {
      // 1. ইনপুট ডাটা গ্রহণ
      let authority = document.getElementById('fc-authority').value || 'ওয়ার্ড মেম্বার';
      let union = document.getElementById('fc-union').value || '[ইউনিয়ন/পৌরসভার নাম]';
      let name = document.getElementById('fc-name').value || '.........................................................';
      let father = document.getElementById('fc-father').value || '...........................................................';
      let mother = document.getElementById('fc-mother').value || '.................................................................';
      let nid = document.getElementById('fc-nid').value || '......................................................';
      let mobile = document.getElementById('fc-mobile').value || '..............................................................';
      
      let vill = document.getElementById('fc-vill').value || '...........................';
      let po = document.getElementById('fc-po').value || '...........................';
      let wordRaw = document.getElementById('fc-word').value;
      let word = wordRaw ? engToBdNum(wordRaw) : '.........';
      let upz = document.getElementById('fc-upz').value || '...........................';
      let dist = document.getElementById('fc-dist').value || '...........................';

      let sonRaw = document.getElementById('fc-son').value;
      let daughterRaw = document.getElementById('fc-daughter').value;
      let son = sonRaw !== '' ? engToBdNum(sonRaw) : '......';
      let daughter = daughterRaw !== '' ? engToBdNum(daughterRaw) : '......';

      // 2. ডাইনামিক প্রিন্ট টেমপ্লেট (HTML এবং CSS সহ)
      const printContent = `
          <!-- ছবির ফ্রেম -->
          <div style="position: absolute; top: 20mm; right: 20mm; width: 40mm; height: 50mm; border: 1px dashed #000; display: flex; align-items: center; justify-content: center; text-align: center; padding: 5px; font-size: 12px; color: #4b5563;">
              পাসপোর্ট সাইজ ছবি<br/>(স্ট্যাপলার দিয়ে সংযুক্ত করুন)
          </div>

          <!-- টাইটেল -->
          <div style="text-align: center; margin-bottom: 25px; padding-right: 45mm;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 900; color: #000; display: inline-block; border-bottom: 1px solid #000; padding-bottom: 5px; margin-top: 10px;">ফ্যামিলি কার্ড প্রাপ্তির আবেদন</h1>
          </div>

          <!-- আবেদন বডি -->
          <div style="font-size: 16px; line-height: 1.6; margin-bottom: 20px; color: #000;">
              বরাবর,<br/>
              <span style="font-weight: 900; font-size: 18px;">${authority}</span><br/>
              <span style="font-weight: bold;">${union}</span><br/><br/>
              <b style="font-size: 17px;">বিষয়: ফ্যামিলি কার্ড / ফ্যামিলি কার্ড পাওয়ার আবেদন প্রসঙ্গে।</b><br/><br/>
              জনাব,<br/>
              বিনীত নিবেদন এই যে, আমি আপনার এলাকার একজন স্থায়ী বাসিন্দা। আমার পরিবারের বর্তমান আর্থ-সামাজিক অবস্থার প্রেক্ষিতে সরকারি সুবিধাদি ও রেশন পাওয়ার জন্য একটি ফ্যামিলি কার্ড পাওয়া আমার জন্য অত্যন্ত প্রয়োজন। নিচে আমার এবং আমার পরিবারের বিস্তারিত তথ্যাদি প্রদান করা হলো:
          </div>

          <div style="font-size: 16px; line-height: 1.8; margin-bottom: 20px; color: #000;">
              ১। আবেদনকারীর নাম: <b style="font-size: 17px;">${name}</b><br/>
              ২। পিতা/স্বামীর নাম: <span>${father}</span><br/>
              ৩। মাতার নাম: <span>${mother}</span><br/>
              ৪। জাতীয় পরিচয়পত্র নং: <span>${nid}</span><br/>
              ৫। মোবাইল নম্বর: <span>${mobile}</span><br/>
          </div>

          <div style="font-size: 16px; margin-bottom: 8px; color: #000;"><b>৬। বর্তমান ও স্থায়ী ঠিকানা:</b></div>
          <div style="font-size: 16px; line-height: 1.8; margin-bottom: 20px; padding-left: 20px; color: #000;">
              গ্রাম / মহল্লা: <span style="font-weight:bold;">${vill}</span>, 
              ডাকঘর: <span style="font-weight:bold;">${po}</span> <br/>
              ওয়ার্ড নং: <span style="font-weight:bold;">${word}</span>, 
              উপজেলা: <span style="font-weight:bold;">${upz}</span>, 
              জেলা: <span style="font-weight:bold;">${dist}</span>
          </div>

          <div style="font-size: 16px; margin-bottom: 8px; color: #000;"><b>৭। পরিবারের সদস্য বিবরণ:</b></div>
          <div style="font-size: 16px; line-height: 1.8; margin-bottom: 25px; padding-left: 20px; color: #000;">
              ছেলে সন্তান: <b>${son}</b> জন, 
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; মেয়ে সন্তান: <b>${daughter}</b> জন।
          </div>

          <div style="font-size: 16px; line-height: 1.6; margin-bottom: 10px; color: #000;">
              অতএব, মহোদয়ের নিকট বিনীত প্রার্থনা, উপরোক্ত তথ্যাদি যাচাইপূর্বক আমাকে একটি ফ্যামিলি কার্ড প্রদানের প্রয়োজনীয় ব্যবস্থা গ্রহণে মর্জি হয়।
          </div>

          <!-- সিগনেচার -->
          <div style="display: flex; justify-content: space-between; font-size: 16px; color: #000; margin-top: auto; padding-top: 20px;">
              <div style="text-align: center; font-weight: bold;">
                  <br/>_______________________<br/>
                  স্বাক্ষর (প্রাপক / ওয়ার্ড প্রতিনিধি)
              </div>
              <div style="text-align: center; font-weight: bold;">
                  <br/>_______________________<br/>
                  আবেদনকারীর স্বাক্ষর
              </div>
          </div>
      `;

      // 3. এইচটিএমএল বক্সে ডাটা যুক্ত করা
      document.getElementById('fc-pdf-container').innerHTML = printContent;
  }

  function downloadFamilyCardPDF() {
    const element = document.getElementById('fc-pdf-container');
    const btn = document.getElementById('btn-fc-download');
    
    // Original styles to restore later
    const originalTransform = element.style.transform;
    const originalMarginBottom = element.style.marginBottom;
    const originalMarginLeft = element.style.marginLeft;
    const originalMarginRight = element.style.marginRight;
    const originalBoxShadow = element.style.boxShadow;

    // Loading state
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> ডাউনলোডিং...';
    btn.style.opacity = '0.7';
    btn.disabled = true;

    // Wait for fonts to be loaded before proceeding
    document.fonts.ready.then(() => {
        // Temporarily remove transform and box-shadow for cleaner capture
        element.style.transform = 'scale(1)'; // Set to full size for capture
        element.style.marginBottom = '0';
        element.style.marginLeft = '0';
        element.style.marginRight = '0';
        element.style.boxShadow = 'none';

        // Add a small delay to ensure browser re-renders with new styles
        setTimeout(() => {
            var opt = {
                margin:       0,
                filename:     'Family_Card_Form_2026.pdf',
                image:        { type: 'jpeg', quality: 1.0 },
                html2canvas:  { 
                    scale: 2, 
                    useCORS: true, 
                    scrollY: 0,
                    logging: true, 
                    allowTaint: true,
                    backgroundColor: null // Transparent background if not explicitly set in CSS
                }, 
                jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
                pagebreak:    { mode: 'avoid-all' }
            };

            html2pdf().set(opt).from(element).save().then(() => {
                // Restore original styles
                element.style.transform = originalTransform;
                element.style.marginBottom = originalMarginBottom;
                element.style.marginLeft = originalMarginLeft;
                element.style.marginRight = originalMarginRight;
                element.style.boxShadow = originalBoxShadow;
                
                // Restore button
                btn.innerHTML = '<i class="fa-solid fa-cloud-arrow-down"></i> PDF ডাউনলোড করুন';
                btn.style.opacity = '1';
                btn.disabled = false;
            }).catch(err => {
                console.error("PDF Error: ", err);
                
                // Restore original styles even on error
                element.style.transform = originalTransform;
                element.style.marginBottom = originalMarginBottom;
                element.style.marginLeft = originalMarginLeft;
                element.style.marginRight = originalMarginRight;
                element.style.boxShadow = originalBoxShadow;

                btn.innerHTML = '<i class="fa-solid fa-cloud-arrow-down"></i> PDF ডাউনলোড করুন';
                btn.style.opacity = '1';
                btn.disabled = false;
                alert("দুঃখিত, PDF তৈরি করতে সমস্যা হচ্ছে। বিস্তারিত জানতে Console চেক করুন।");
            });
        }, 100); // 100ms delay
    }).catch(err => {
        console.error("Font loading error: ", err);
        // Restore button if font loading fails
        btn.innerHTML = '<i class="fa-solid fa-cloud-arrow-down"></i> PDF ডাউনলোড করুন';
        btn.style.opacity = '1';
        btn.disabled = false;
        alert("ফন্ট লোড করতে সমস্যা হয়েছে। PDF তৈরি সম্ভব নয়। বিস্তারিত জানতে Console চেক করুন।");
    });
  }

  function resetFamilyCard() {
      const inputs = document.querySelectorAll('#familyCardModal input, #familyCardModal textarea');
      inputs.forEach(input => input.value = '');
      document.getElementById('fc-authority').value = 'ওয়ার্ড মেম্বার';
      updateFamilyCard();
  }

  // অটো ইনিশিয়ালাইজ করার জন্য
  window.addEventListener('load', function() {
      updateFamilyCard();
  });
;

let currentCalDate = new Date();
  let clockInterval;
  
  // বাংলাদেশের চাঁদ দেখার ওপর ভিত্তি করে ১ দিন পেছানো (৩ মার্চ = ১৩ রমজান)
  let hijriOffset = -1; 

  // Close modal when clicked outside
  window.addEventListener('click', function(event) {
      let modal = document.getElementById('calendarModal');
      if (event.target == modal) {
          closeCalendarModal();
      }
  });

  function openCalendarModal() {
      // setActiveMode undefined থাকলে যেন error না দেয় তাই try-catch যুক্ত করা হয়েছে
      try {
          if (typeof setActiveMode === 'function') {
              setActiveMode('mode-calendar');
          }
      } catch (e) {}

      document.getElementById('calendarModal').style.display = 'flex';
      
      currentCalDate = new Date(); 
      startClock();
      updateTodaySummary(); 
      renderCalendar();     
  }

  function closeCalendarModal() {
      document.getElementById('calendarModal').style.display = 'none';
      if (clockInterval) clearInterval(clockInterval); // ঘড়ি বন্ধ করা
  }

  function changeMonth(dir) {
      currentCalDate.setMonth(currentCalDate.getMonth() + dir);
      renderCalendar();
  }

  function goToToday() {
      currentCalDate = new Date();
      renderCalendar();
  }

  // ইংরেজি থেকে বাংলা সংখ্যা কনভার্টার
  function toBnNum(num) {
      if (num === undefined || num === null) return '';
      const eng = ['0','1','2','3','4','5','6','7','8','9'];
      const bng =['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
      return num.toString().split('').map(c => eng.includes(c) ? bng[eng.indexOf(c)] : c).join('');
  }

  // কততম মাস (Ordinal Numbers in Bengali)
  function getOrdinalBn(num) {
      if(num == 1) return '১ম'; if(num == 2) return '২য়'; if(num == 3) return '৩য়';
      if(num == 4) return '৪র্থ'; if(num == 5) return '৫ম'; if(num == 6) return '৬ষ্ঠ';
      if(num == 7) return '৭ম'; if(num == 8) return '৮ম'; if(num == 9) return '৯ম';
      if(num == 10) return '১০ম'; if(num == 11) return '১১তম'; if(num == 12) return '১২শ';
      return toBnNum(num) + 'তম';
  }

  function getBnDateWithSuffix(day) {
      if (day === 1) return '১লা';
      if (day === 2) return '২রা';
      if (day === 3) return '৩রা';
      if (day === 4) return '৪ঠা';
      if (day >= 5 && day <= 18) return toBnNum(day) + 'ই';
      if (day >= 19 && day <= 31) return toBnNum(day) + 'শে';
      return toBnNum(day);
  }

  // লাইভ ঘড়ি ফাংশন
  function startClock() {
      if (clockInterval) clearInterval(clockInterval); // Prevent memory leak / overlap
      function updateTime() {
          let now = new Date();
          let h = now.getHours();
          let m = now.getMinutes();
          let s = now.getSeconds();
          let ampm = h >= 12 ? 'পিএম' : 'এএম';
          h = h % 12;
          h = h ? h : 12; // 0 কে 12 বানাবে
          let timeStr = toBnNum(h.toString().padStart(2, '0')) + ':' + 
                        toBnNum(m.toString().padStart(2, '0')) + ':' + 
                        toBnNum(s.toString().padStart(2, '0')) + ' ' + ampm;
          document.getElementById('cal-clock-text').innerHTML = '<i class="fa-regular fa-clock"></i> বর্তমান সময়: ' + timeStr;
      }
      updateTime();
      clockInterval = setInterval(updateTime, 1000);
  }

  const enMonthsBn =["জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"];
  const bnMonthsList =["বৈশাখ", "জ্যৈষ্ঠ", "আষাঢ়", "শ্রাবণ", "ভাদ্র", "আশ্বিন", "কার্তিক", "অগ্রহায়ণ", "পৌষ", "মাঘ", "ফাল্গুন", "চৈত্র"];
  
  function getSeason(monthIndex) {
      const seasons =['গ্রীষ্ম', 'গ্রীষ্ম', 'বর্ষা', 'বর্ষা', 'শরৎ', 'শরৎ', 'হেমন্ত', 'হেমন্ত', 'শীত', 'শীত', 'বসন্ত', 'বসন্ত'];
      return seasons[monthIndex];
  }

  function getBengaliDate(gDate) {
      // Government Revised Calendar Logic (2018/2019 BD)
      const bnDays =[31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 29, 30]; 
      
      let gy = gDate.getFullYear();
      let isLeap = (gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0);
      bnDays[10] = isLeap ? 30 : 29; 
      
      let bYear = gy - 593;
      let baishakh1 = new Date(gy, 3, 14); 
      
      if (gDate < baishakh1) {
          bYear -= 1;
          baishakh1 = new Date(gy - 1, 3, 14);
          let prevIsLeap = ((gy - 1) % 4 === 0 && (gy - 1) % 100 !== 0) || ((gy - 1) % 400 === 0);
          bnDays[10] = prevIsLeap ? 30 : 29;
      }
      
      let utc1 = Date.UTC(gDate.getFullYear(), gDate.getMonth(), gDate.getDate());
      let utc2 = Date.UTC(baishakh1.getFullYear(), baishakh1.getMonth(), baishakh1.getDate());
      let diffDays = Math.floor((utc1 - utc2) / (1000 * 60 * 60 * 24));
      
      let d = diffDays;
      let mIdx = 0;
      while (d >= bnDays[mIdx]) {
          d -= bnDays[mIdx];
          mIdx++;
      }
      
      return { date: d + 1, month: bnMonthsList[mIdx], monthIndex: mIdx, year: bYear };
  }

  function getHijriDateObj(date) {
      try {
          let adjustedDate = new Date(date.getTime() + (hijriOffset * 24 * 60 * 60 * 1000));
          let formatter = new Intl.DateTimeFormat('en-US-u-ca-islamic-umalqura', { day: 'numeric', month: 'numeric', year: 'numeric' });
          let parts = formatter.formatToParts(adjustedDate);
          
          let hd = parseInt(parts.find(p => p.type === 'day').value);
          let hm = parseInt(parts.find(p => p.type === 'month').value);
          let hy = parts.find(p => p.type === 'year').value;
          
          const hijriMonths =["মহররম", "সফর", "রবিউল আউয়াল", "রবিউস সানি", "জমাদিউল আউয়াল", "জমাদিউস সানি", "রজব", "শাবান", "রমজান", "শাওয়াল", "জিলকদ", "জিলহজ"];
          
          return { day: hd, monthStr: hijriMonths[hm - 1], monthIndex: hm, yearStr: toBnNum(hy) };
      } catch (e) {
          return { day: 1, monthStr: "হিজরি মাস", monthIndex: 1, yearStr: "১৪৪৭" };
      }
  }

  function updateTodaySummary() {
      const today = new Date();
      const daysBn =['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
      const dayName = daysBn[today.getDay()];
      
      const bdDate = getBengaliDate(today); 
      const season = getSeason(bdDate.monthIndex);
      
      const enDateSuffix = getBnDateWithSuffix(today.getDate());
      const enMonthName = enMonthsBn[today.getMonth()];
      const enMonthOrd = getOrdinalBn(today.getMonth() + 1);
      const enYear = toBnNum(today.getFullYear());
      
      const hjDateObj = getHijriDateObj(today);
      const hjMonthOrd = getOrdinalBn(hjDateObj.monthIndex);
      
      const summaryText = `আজ ${dayName}, ${getBnDateWithSuffix(bdDate.date)} ${bdDate.month} ${toBnNum(bdDate.year)} বঙ্গাব্দ, যা বাংলা ক্যালেন্ডারের ${season} ঋতুতে পড়ে। সংশ্লিষ্ট ইংরেজি তারিখ ${enDateSuffix} ${enMonthName} ${enYear} খ্রিষ্টাব্দ (বছরের ${enMonthOrd} মাস) এবং হিজরি তারিখ ${getBnDateWithSuffix(hjDateObj.day)} ${hjDateObj.monthStr} ${hjDateObj.yearStr} হিজরি (হিজরি বছরের ${hjMonthOrd} মাস)। বর্তমান বাংলা মাস হলো ${bdDate.month}, বাংলা বছরের ${getOrdinalBn(bdDate.monthIndex + 1)} মাস।`;
      
      document.getElementById('cal-summary-text').innerText = summaryText;
  }

  function renderCalendar() {
      const year = currentCalDate.getFullYear();
      const month = currentCalDate.getMonth();
      const today = new Date(); 

      document.getElementById('cal-title-main').innerText = `${enMonthsBn[month]} ${toBnNum(year)}`;
      
      let firstDayDate = new Date(year, month, 1);
      let lastDayDate = new Date(year, month + 1, 0);
      
      let bdFirst = getBengaliDate(firstDayDate);
      let bdLast = getBengaliDate(lastDayDate);
      let hjLast = getHijriDateObj(lastDayDate);

      document.getElementById('cal-title-sub').innerText = `${bdFirst.month} - ${bdLast.month} ${toBnNum(bdLast.year)} | হিজরি ${hjLast.yearStr}`;

      const firstDayIndex = firstDayDate.getDay(); 
      const totalDays = lastDayDate.getDate();
      
      const calBody = document.getElementById('cal-body');
      let html = '';

      for (let x = 0; x < firstDayIndex; x++) {
          html += `<div class="cal-day-box empty"></div>`;
      }

      for (let i = 1; i <= totalDays; i++) {
          let currDate = new Date(year, month, i);
          let bd = getBengaliDate(currDate);
          let hj = getHijriDateObj(currDate);

          let isTodayClass = (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) ? 'today' : '';
          let dayOfWeek = currDate.getDay();
          let isWeekendClass = (dayOfWeek === 5 || dayOfWeek === 6) ? 'weekend' : ''; 
          
          let titleText = `ইংরেজি: ${toBnNum(i)} ${enMonthsBn[month]} ${toBnNum(year)}\nবাংলা: ${toBnNum(bd.date)} ${bd.month} ${toBnNum(bd.year)}\nআরবি: ${toBnNum(hj.day)} ${hj.monthStr} ${hj.yearStr}`;

          // Full string inside the boxes with Tooltip
          html += `
          <div class="cal-day-box ${isTodayClass} ${isWeekendClass}" title="${titleText}">
              <div class="en-date">${toBnNum(i)} ${enMonthsBn[month]}</div>
              <div class="bn-date">${toBnNum(bd.date)} ${bd.month}</div>
              <div class="ar-date">${toBnNum(hj.day)} ${hj.monthStr}</div>
          </div>`;
      }

      calBody.innerHTML = html;
  }
;

const flightData =[
      { name: "Bangladesh", flag: "bd", url: "https://www.biman-airlines.com/#flight#check-in" },
      { name: "Saudi Arabia", flag: "sa", url: "https://www.saudia.com/en-SA/book-and-manage/manage/manage-booking" },
      { name: "Oman", flag: "om", url: "https://www.omanair.com/en/manage-bookings" },
      { name: "United Arab Emirates", flag: "ae", url: "https://www.emirates.com/english/manage-booking/online-check-in/" },
      { name: "Malaysia", flag: "my", url: "https://www.malaysiaairlines.com/hq/en/travel-info/check-in.html" },
      { name: "Malaysia (US)", flag: "my", url: "https://www.malaysiaairlines.com/us/en/travel-info/check-in.html" },
      { name: "Qatar", flag: "qa", url: "https://cki.qatarairways.com/cki/dashboard" },
      { name: "Kuwait", flag: "kw", url: "https://kuwaitairways.com/en/manage-booking" },
      { name: "Italy", flag: "it", url: "https://www.ita-airways.com/en_en/check-in-search.html" },
      { name: "Singapore", flag: "sg", url: "https://www.singaporeair.com/en_UK/sg/plan-travel/your-booking/managebooking/" },
      { name: "USA", flag: "us", url: "https://www.united.com/en/us" },
      { name: "France", flag: "fr", url: "https://wwws.airfrance.fr/en/check-in" },
      { name: "France (Egypt Trip)", flag: "fr", url: "https://wwws.airfrance.com.eg/trip" },
      { name: "Australia", flag: "au", url: "https://check-in.virginaustralia.com/checkin/index.html#/login" },
      { name: "Maldives", flag: "mv", url: "https://maldivian.aero/" },
      { name: "Japan", flag: "jp", url: "https://booking.flyairjapan.com/en/checkin" },
      { name: "Japan (Jeju Air)", flag: "jp", url: "https://wcc.jejuair.net/en/ibe/checkin/viewCheckin.do" },
      { name: "Bahrain", flag: "bh", url: "https://www.gulfair.com/flying-with-us/before-you-travel/manage" },
      { name: "Kenya", flag: "ke", url: "https://www.kenya-airways.com/en/book-manage/manage-booking/" },
      { name: "Vietnam", flag: "vn", url: "https://www.vietnamairlines.com/vn/en/travel-information/check-in/online-check-in" },
      { name: "Turkey", flag: "tr", url: "https://www.turkishairlines.com/en-us/tccmanagebooking/main.html" },
      { name: "Ethiopia", flag: "et", url: "https://www.ethiopianairlines.com/us/book/manage/manage-booking" },
      { name: "Ethiopia (EG)", flag: "et", url: "https://www.ethiopianairlines.com/eg/book/manage" },
      { name: "Iceland", flag: "is", url: "https://www.icelandair.com/support/pre-flight/manage-booking/" },
      { name: "Zambia", flag: "zm", url: "https://www.zambia-airways.com/" },
      { name: "Jordan", flag: "jo", url: "https://www.rj.com/en/plan-and-book/before-you-fly/book-your-ticket" },
      { name: "Spain", flag: "es", url: "https://www.iberia.com/us/booking/manage-booking/" },
      { name: "Germany", flag: "de", url: "https://www.lufthansa.com/jo/en/my-bookings" },
      { name: "Brazil", flag: "br", url: "https://www.latamairlines.com/us/en/latam-travel/manage-booking" },
      { name: "India", flag: "in", url: "https://www.airindia.com/content/air-india/in/en/manage/booking.html" },
      { name: "China", flag: "cn", url: "https://www.airchina.com.cn/en/index/managebooking" },
      { name: "Canada", flag: "ca", url: "https://www.aircanada.com/us/en/aco/home/book/manage-reservation.html" },
      { name: "United Kingdom", flag: "gb", url: "https://www.britishairways.com/travel/manage-your-booking/public/en_us" },
      { name: "South Africa", flag: "za", url: "https://www.flysaa.com/gb/en/book-manage/your-booking" },
      { name: "Russia", flag: "ru", url: "https://www.aeroflot.ru/ru-en/menu/check-in" },
      { name: "Mexico", flag: "mx", url: "https://www.aeromexico.com/en-us/travel-resources/manage-my-trip" },
      { name: "Argentina", flag: "ar", url: "https://www.aerolineas.com.ar/en/manage-booking" },
      { name: "Thailand", flag: "th", url: "https://www.thaiairways.com/en_SA/Manage_My_Booking/My_Booking.page" },
      { name: "Egypt", flag: "eg", url: "https://digital.egyptair.com/ssci/identification" },
      { name: "Egypt (Air Cairo)", flag: "eg", url: "https://aircairo.com/en-gl/my-booking" },
      { name: "South Korea", flag: "kr", url: "https://flyairseoul.com/I/en/viewCheckInList.do" },
      { name: "South Korea (Air Busan)", flag: "kr", url: "https://en.airbusan.com/web/individual/reserve/index" },
      { name: "South Korea (Korean Air)", flag: "kr", url: "https://www.koreanair.com/?hl=en" },
      { name: "Nepal", flag: "np", url: "https://www.nepalairlines.com.np/manage-booking/" },
      { name: "Nepal (Himalaya)", flag: "np", url: "https://www.himalaya-airlines.com/" },
      { name: "Hong Kong", flag: "hk", url: "https://www.cathaypacific.com/cx/en_HK/book-manage/manage-your-booking.html" },
      { name: "Bhutan", flag: "bt", url: "https://www.drukair.com.bt/manage-your-booking/" },
      { name: "Sri Lanka", flag: "lk", url: "https://www.srilankaairlines.com/book/manage-booking" },
      { name: "Philippines", flag: "ph", url: "https://www.philippineairlines.com/us/en/manage-booking.html" },
      { name: "Indonesia", flag: "id", url: "https://www.garuda-indonesia.com/sg/en" },
      { name: "Indonesia (Amadeus)", flag: "id", url: "https://checkin.si.amadeus.net/1ASIHSSCWEBGA/sscwga/checkin?ln=en" },
      { name: "Brunei", flag: "bn", url: "https://www.flyroyalbrunei.com/brunei/en/book-manage/online-check-in/" },
      { name: "Lebanon", flag: "lb", url: "https://www.beirutairport.gov.lb/_flight.php" },
      { name: "Lebanon (Air Arabia)", flag: "lb", url: "https://webcheckin.airarabia.com/accelaero/en/index.html#/en" },
      { name: "Pakistan", flag: "pk", url: "https://www.piac.com.pk/" },
      { name: "Iraq", flag: "iq", url: "https://www.ixigo.com/airlines/iraqi_airways-ia/flight-status" },
      { name: "Iraq (Jazeera)", flag: "iq", url: "https://www.jazeeraairways.com/en-bd?#check-in" },
      { name: "Netherlands", flag: "nl", url: "https://www.klm.com/check-in" },
      { name: "Switzerland", flag: "ch", url: "https://www.swiss.com/gb/en/fly/check-in/online-check-in.html" },
      { name: "Sweden", flag: "se", url: "https://www.flysas.com/en/checkin" },
      { name: "Denmark", flag: "dk", url: "https://dat.dk/en/online-check-in/" },
      { name: "Poland", flag: "pl", url: "https://www.lot.com/pl/en/manage-booking/overview" },
      { name: "Portugal", flag: "pt", url: "https://www.flytap.com/en-dk/check-in-information" },
      { name: "Greece", flag: "gr", url: "https://en.aegeanair.com/plan/manage-booking/" },
      { name: "New Zealand", flag: "nz", url: "https://flightbookings.airnewzealand.com/vmanage/actions/retrieve/webcheck" },
      { name: "Morocco", flag: "ma", url: "https://www.royalairmaroc.com/us-en/booking/online-check-in" },
      { name: "Romania", flag: "ro", url: "https://digital.tarom.ro/ssci/identification?lang=ro-RO" }, // TAROM Airlines
      { name: "Taiwan", flag: "tw", url: "https://booking.evaair.com/flyeva/eva/b2c/manage-your-trip/online-checked-in-login.aspx?lang=en-global" }, // EVA Air
      { name: "Nigeria", flag: "ng", url: "https://flyairpeace.com/" },
      { name: "Austria", flag: "at", url: "https://www.austrian.com/us/en/online-check-in" }, // Austrian Airlines
      { name: "Belgium", flag: "be", url: "https://www.brusselsairlines.com/be/en/check-in-options-and-info/online-check-in-options.html" }, // Brussels Airlines
      { name: "Croatia", flag: "hr", url: "https://wci.croatiaairlines.hr/web/ck_retrieve?langCode=en" }, // Croatia Airlines
      { name: "Finland", flag: "fi", url: "https://www.finnair.com/en/check-in" },
      { name: "Ireland", flag: "ie", url: "https://www.aerlingus.com/html/en-US/home.html" }, // Aer Lingus
      { name: "Laos", flag: "la", url: "https://laoairlines.com/en/check-in-online/" }, // Laos
      { name: "Colombia", flag: "co", url: "https://checkinnew.avianca.com/Check-In?lang=En" } // Avianca
  ];

  function openFlightModal() {
      setActiveMode('mode-flight-check');
      document.getElementById('flightModal').style.display = 'flex';
      document.getElementById('flightSearchInput').value = ''; // Clear search box
      renderFlights(flightData); // Render all cards initially
  }

  function closeFlightModal() {
      document.getElementById('flightModal').style.display = 'none';
      document.getElementById('flightSearchInput').value = '';
  }

  function renderFlights(data) {
      const grid = document.getElementById('flightGrid');
      grid.innerHTML = '';
      
      if(data.length === 0) {
          grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #ef4444; font-weight: bold; font-family: \'Inter\', sans-serif; font-size: 16px;">Sorry, no country found with this name!</p>';
          return;
      }

      data.forEach(item => {
          const card = document.createElement('a');
          card.href = item.url;
          card.target = '_blank';
          card.className = 'flight-card';
          card.innerHTML = `
              <img src="https://flagcdn.com/w40/${item.flag}.png" alt="${item.name}">
              <span>${item.name}</span>
          `;
          grid.appendChild(card);
      });
  }

  function filterFlights() {
      const query = document.getElementById('flightSearchInput').value.toLowerCase();
      const filtered = flightData.filter(item => item.name.toLowerCase().includes(query));
      renderFlights(filtered);
  }
;

// Unique variable name for Visa tool
  const vchkDataList = [
      { name: "KSA Visa", flag: "sa", url: "https://ksavisa.sa/?c=0" },
      { name: "Saudi Arabia (MOFA)", flag: "sa", url: "https://visa.mofa.gov.sa/VisaPerson/GetApplicantData" },
      { name: "Saudi Arabia (Portal)", flag: "sa", url: "https://visa.mofa.gov.sa/" },
      { name: "UAE", flag: "ae", url: "https://smart.gdrfad.gov.ae/Public_Th/StatusInquiry_New.aspx" },
      { name: "Malaysia", flag: "my", url: "https://malaysiavisa.imi.gov.my/evisa/check-evisa" },
      { name: "Oman", flag: "om", url: "https://evisa.rop.gov.om/en/track-your-application" },
      { name: "Qatar", flag: "qa", url: "https://portal.moi.gov.qa/wps/portal/MOIInternet/services/inquiries/visaservices/enquiryandprinting" },
      { name: "Kuwait (Enquiry)", flag: "kw", url: "https://rnt.moi.gov.kw/esrv/VisaStat.do?lang=eng" },
      { name: "Kuwait (eVisa)", flag: "kw", url: "https://e-visa-kuwait.com/visa-check-status" },
      { name: "Italy", flag: "it", url: "https://blsitalyvisa.com/senegal/page/track_application" },
      { name: "Singapore", flag: "sg", url: "https://service2.mom.gov.sg/workpass/enquiry/search" },
      { name: "USA", flag: "us", url: "https://ceac.state.gov/ceacstattracker/status.aspx" },
      { name: "France", flag: "fr", url: "https://www.atlys.com/tools/france-visa-status-checker" },
      { name: "Iraq", flag: "iq", url: "https://eservice.evisa.iq/" },
      { name: "Australia", flag: "au", url: "https://online.immi.gov.au/evo/firstParty" },
      { name: "Turkey", flag: "tr", url: "https://evisa.gov.tr/en/status/" },
      { name: "Greece", flag: "gr", url: "https://bd-gr.gvcworld.eu/en/what-is-the-status-of-my-visa-application" },
      { name: "New Zealand", flag: "nz", url: "https://nzeta.immigration.govt.nz/check-status" },
      { name: "Egypt", flag: "eg", url: "https://www.egyptianivisa.org/egypt-evisa-status-enquiry" },
      { name: "Denmark", flag: "dk", url: "https://www.vfsvisaonline.com/Global-Passporttracking/Track/Index?q=shSA0YnE4pLF9Xzwon/x/Ey/UM5rKPMuPWoM9so6dErw9MlQ/wjq9lJGkU959vsBvrOFDstsG0wBzADuf+qGXcEGxkEz8sbjc3mvJlPR49k=" },
      { name: "Albania", flag: "al", url: "https://consular.indonesianembassy.org.uk/check/trackvisa" },
      { name: "Indonesia", flag: "id", url: "https://consular.indonesianembassy.org.uk/check/trackvisa" },
      { name: "Lithuania", flag: "lt", url: "https://www.vfsvisaonline.com/Global-Passporttracking/Track/Index?q=shSA0YnE4pLF9Xzwon/x/BlZx7aT/DWezFVMeYX2hmCSlRWDIXclcabmR5zKiHoZVNKPNERmgyRABJaNCwx2aNZmzCtnJ5Bpf2LBrfP6k2X0Q1z2DPxJQm33rNuqa4Iv" },
      { name: "Cambodia", flag: "kh", url: "https://www.evisa.gov.kh/check_change" },
      { name: "Thailand", flag: "th", url: "https://thailand-e-visas.com/application-status/" },
      { name: "Vietnam", flag: "vn", url: "https://evisa.xuatnhapcanh.gov.vn/tra-cuu-thi-thuc" },
      { name: "Philippines", flag: "ph", url: "https://evisa.gov.ph/verifier" },
      { name: "Canada", flag: "ca", url: "https://services3.cic.gc.ca/ecas/authenticate.do" },
      { name: "Norway", flag: "no", url: "https://www.vfsvisaonline.com/Global-Passporttracking/Track/Index?q=shSA0YnE4pLF9Xzwon/x/MMWoQ2u/1NQd8ht0KuMDeqNJEBHzf/pf00e1uZwPSD2zYt8RkPOrijzqBSPrG6SpBLEnwcTgTEc55ZX0BXECrU=" },
      { name: "Sweden", flag: "se", url: "https://www.vfsvisaonline.com/Global-Passporttracking/Track/Index?q=shSA0YnE4pLF9Xzwon/x/A9+3ayKh2o6XUmXfdhngCYyU8AwlJS2teDiX9NGhCu5j7J2hGzy30dPAPM6bu3jEpSgRCiBikLlY7P5ZmCR3Qk=" },
      { name: "Switzerland", flag: "ch", url: "https://www.swiss-visa.ch/" },
      { name: "Netherlands", flag: "nl", url: "https://visatracking.vfsglobal.com/Global-Passporttracking/Track/Index?q=shSA0YnE4pLF9Xzwon/x/GAZMwphNakm2hstnNbT9MeLtMSNCgJ8GiT50RSS4w+IoAskZVw2rQ7iiIFWAOR5ntDOxlsmSQFg9knxElfrZWb0fOJES+KlD+VXNw0o9R+8" },
      { name: "Belgium", flag: "be", url: "https://infovisa.ibz.be/InfovisaNl.aspx" },
      { name: "Spain", flag: "es", url: "https://sutramiteconsular.maec.es/" },
      { name: "Germany", flag: "de", url: "https://videx.diplo.de/videx/visum-erfassung/en/videx-langfristiger-aufenthalt" },
      { name: "UK", flag: "gb", url: "https://www.gov.uk/visa-processing-times" },
      { name: "India", flag: "in", url: "https://www.passtrack.net/regular_passport.php" },
      { name: "Pakistan", flag: "pk", url: "https://visa.nadra.gov.pk/verify/" },
      { name: "Nepal", flag: "np", url: "https://nepaliport.immigration.gov.np/visa-check" },
      { name: "Sri Lanka", flag: "lk", url: "https://eta.gov.lk/etaslvisa/pages/checkStatus.jsp" },
      { name: "Bangladesh", flag: "bd", url: "https://www.bdvisa.com/track-your-application.html" },
      { name: "Japan", flag: "jp", url: "https://www.atlys.com/tools/japan-visa-status-checker" },
      { name: "Malaysia (US)", flag: "my", url: "https://ceac.state.gov/CEACStatTracker/Status.aspx?App=NIV" },
      { name: "France (Egypt Trip)", flag: "fr", url: "https://www.atlys.com/tools/france-visa-status-checker" },
      { name: "Maldives", flag: "mv", url: "https://www.immigration.gov.mv/visa/status" },
      { name: "Japan (Jeju Air)", flag: "jp", url: "https://www.atlys.com/tools/japan-visa-status-checker" },
      { name: "Bahrain", flag: "bh", url: "https://www.lmra.gov.bh/EMS_Web/checkEligibilityRW.action?methodName=loadPageInEnglish" },
      { name: "Kenya", flag: "ke", url: "https://etakenya.go.ke/" },
      { name: "Ethiopia", flag: "et", url: "https://www.evisa.gov.et/visa-extension" },
      { name: "Ethiopia (EG)", flag: "et", url: "https://www.evisa.gov.et/#/checkstatus" },
      { name: "Iceland", flag: "is", url: "https://visa.government.is/" },
      { name: "Zambia", flag: "zm", url: "https://zambia-visa.com/application-status/" },
      { name: "Jordan", flag: "jo", url: "https://www.jsdbiz.com/jordan-visa/check-status" },
      { name: "Brazil", flag: "br", url: "https://formulario-mre.serpro.gov.br/sci/pages/web/ui/#/consultar-situacao" },
      { name: "China", flag: "cn", url: "https://www.visaforchina.cn/FRA3_EN/qianzhengyewu" },
      { name: "United Kingdom", flag: "gb", url: "https://atlantis-abs-uk.vfsglobal.com/track-status?missionCode=GBR&countryCode=bgd&lang=en" },
      { name: "South Africa", flag: "za", url: "https://www.vfsvisaonline.com/DHAOnlineTracking/OnlineTracking.aspx" },
      { name: "Russia", flag: "ru", url: "https://evisacheck.kdmid.ru/" },
      { name: "Mexico", flag: "mx", url: "https://ceac.state.gov/CEACStatTracker/Status.aspx?App=NIV" },
      { name: "Argentina", flag: "ar", url: "https://visatracking.vfsglobal.com/Global-Passporttracking/Track/Index?q=shSA0YnE4pLF9Xzwon/x/OVMz2fDVFo4HOHOD9+ZsS2aHQ5OzxnlPZonjofTOFmXYjYZNB/WcybRu22/pkuUnBnZFnpXvi+eqDV278ea0+cviut6qFkTvksiSXp49VJmi8S4ALf6edfaHHbBMlJkoQ==" },
      { name: "Egypt (Air Cairo)", flag: "eg", url: "https://www.egyptianivisa.org/egypt-evisa-status-enquiry" },
      { name: "South Korea South", flag: "kr", url: "https://www.visa.go.kr/openPage.do?MENU_ID=10301" },
      { name: "South Korea (Air Busan)", flag: "kr", url: "https://www.visa.go.kr/openPage.do?MENU_ID=10301" },
      { name: "South Korea (Korean Air)", flag: "kr", url: "https://www.visa.go.kr/openPage.do?MENU_ID=10301" },
      { name: "Nepal (Himalaya)", flag: "np", url: "https://nepaliport.immigration.gov.np/visa-check" },
      { name: "Hong Kong", flag: "hk", url: "https://www.gov.hk/en/residents/immigration/nonpermanent/appstatusenq.htm" },
      { name: "Bhutan", flag: "bt", url: "https://immi.gov.bt/track-application/" },
      { name: "Indonesia (Amadeus)", flag: "id", url: "https://consular.indonesianembassy.org.uk/check/trackvisa" },
      { name: "Brunei", flag: "bn", url: "https://ceac.state.gov/CEACStatTracker/Status.aspx?App=NIV" },
      { name: "Lebanon", flag: "lb", url: "https://www.vfsvisaonline.com/Global-Passporttracking/Track/Index?q=shSA0YnE4pLF9Xzwon/x/CQ1P0LBKn66dLdNUfueK+xykiaI75SBZmV+meEP0Shx+uY52hy40GYbxyEPSfVV0g==" },
      { name: "Lebanon (Air Arabia)", flag: "lb", url: "https://www.vfsvisaonline.com/Global-Passporttracking/Track/Index?q=shSA0YnE4pLF9Xzwon/x/CQ1P0LBKn66dLdNUfueK+xykiaI75SBZmV+meEP0Shx+uY52hy40GYbxyEPSfVV0g==" },
      { name: "Iraq (Jazeera)", flag: "iq", url: "https://evisatraveller.mfa.ir/en/request/status/" },
      { name: "Poland", flag: "pl", url: "https://www.lot.com/rs/en/journey/special-services/travel-documents/travel-poland" },
      { name: "Portugal", flag: "pt", url: "https://in-gr.gvcworld.eu/en/what-is-the-status-of-my-visa-application" },
      { name: "Morocco", flag: "ma", url: "https://www.acces-maroc.ma/#/" },
      { name: "Romania", flag: "ro", url: "https://eviza.mae.ro/checkvisasticker" },
      { name: "Taiwan", flag: "tw", url: "https://www.jsdbiz.com/taiwan-visa/check-status" },
      { name: "Nigeria", flag: "ng", url: "https://immigration.gov.ng/check-visa-status/" },
      { name: "Austria", flag: "at", url: "https://www.vfsvisaonline.com/Global-Passporttracking/Track/Index?q=shSA0YnE4pLF9Xzwon%2Fx%2FB1eRfIlnOB2pWKLJ+6DYKyWgZoHLe2GNbJkZ93iyjEl6rOHB0%2Fcj6EXI40E2L+qrDDcWx6thm8IQSpoEhrPV5Y%3D" },
      { name: "Croatia", flag: "hr", url: "https://www.vfsvisaonline.com/Global-Passporttracking/Track/Index?q=shSA0YnE4pLF9Xzwon/x/LP5/hPag7COaFyhj+cLMlOg9lNxUTlJ+42mSIvhkjncyNlltInk2p6br8++WFRun6cSkO/+CjAWX4wQx/eUVBg=" },
      { name: "Finland", flag: "fi", url: "https://www.vfsvisaonline.com/Global-Passporttracking/Track/Index?q=shSA0YnE4pLF9Xzwon/x/K3TR28D6QZe7ZMQ849/GyMRu9oyBCGJ+NHqcGb/3GtVGbtnQ4WSUJQfYtSTvHun11+DkcDbTJUiJ8V2wuqc1Kk=" },
      { name: "Ireland", flag: "ie", url: "https://www.vfsvisaonline.com/Global-Passporttracking/Track/Index?q=shSA0YnE4pLF9Xzwon/x/KgjqpWLKpJv1+Cz1ga9/6EJfiYm1eKv4NloVE0HSGxAWwDd5VF9ztQ5srrLkyiWzIGvaqmiihvJ+fYFO3rrCDY=" },
      { name: "Colombia", flag: "co", url: "https://tramitesmre.cancilleria.gov.co/tramites/enlinea/consultarEstadoSolicitud.xhtml" },

      // নতুন যুক্ত করা দেশসমূহ
      { name: "Azerbaijan", flag: "az", url: "https://evisa.gov.az/en/check-status" },
      { name: "Georgia", flag: "ge", url: "https://www.vfsvisaonline.com/Global-Passporttracking/Track/Index?q=shSA0YnE4pLF9Xzwon/x/DeEEtn3ZhPEQYqzaKN/BsKSM/nm00Fis8ALFgXo4W8j+jiCvWBCuYHbampJnUCUIZTJpGTKOr/CwH627D3ueSc=" },
      { name: "Kazakhstan", flag: "kz", url: "https://www.vmp.gov.kz/en/services/visa-service" },
      { name: "Uzbekistan", flag: "uz", url: "https://e-visa.gov.uz/status" },
      { name: "Ukraine", flag: "ua", url: "https://evisa.mfa.gov.ua/" },
      { name: "Belarus", flag: "by", url: "https://visa.by/en/" },
      { name: "Serbia", flag: "rs", url: "https://www.evisawelcometoserbiagov.online/track-your-visa-application.php" },
      { name: "Bosnia and Herzegovina", flag: "ba", url: "https://bihembassygov.com/application-tracking/" },
      { name: "Montenegro", flag: "me", url: "https://evisa-gov.me/montenegro-visa-status-checker.html" },
      { name: "North Macedonia", flag: "mk", url: "https://evisa-gov.me/montenegro-visa-status-checker.html" },
      { name: "Bulgaria", flag: "bg", url: "https://visatracking.vfsglobal.com/Global-Passporttracking/Track/Index?q=shSA0YnE4pLF9Xzwon/x/AoKGAVyoVK/e8oAZk1pB9ed+n4cBnpujmSr+kOjjctvXM4q1Ljd0+2VRpM1gmxlg7swPiJ4N9yq1xcqMFsmkXk=" },
      { name: "Cyprus", flag: "cy", url: "https://visatracking.vfsglobal.com/Global-Passporttracking/Track/Index?q=shSA0YnE4pLF9Xzwon/x/Gf42uXe16FaHjaImDmi3NThsPkForn5Z0KgMyi+TRO/LgKgOeYhx9STbQ9Tu05ACIpVIq9IsbUcEEzzIkqZcxo=" },
      { name: "Malta", flag: "mt", url: "https://identita.gov.mt/central-visa-unit-services-visa-application-tracking/" },
      { name: "Slovakia", flag: "sk", url: "https://blsslovakiavisa.com/vietnam/track-application.php" },
      { name: "Slovenia", flag: "si", url: "https://svvmzz.adapta.si/statusnew.php" },
      { name: "Hungary", flag: "hu", url: "https://www.vfsvisaonline.com/Global-Passporttracking/Track/Index?q=shSA0YnE4pLF9Xzwon/x/FVWGkYuENF3aj/jI+9gY9pE83UEf2P6x9Sl8cvMqFf44wJKuUWVDH9Jtdz9xIMJdOsTyX1xa5hqsDlAXWW6bgaCacs7ghVCD/m/hX3R1bli" },
      { name: "Czech Republic", flag: "cz", url: "https://visatracking.vfsglobal.com/Global-Passporttracking/Track/Index?q=shSA0YnE4pLF9Xzwon/x/Jdf3aByYnqcjO/DruY4vPZfAMLbwkob13WiEvth/SSJfQ80KIaOztETUA08burPeR4P2J0qDrahwmCCZxPpk4WVr/NoFf/4JSJx33ePxMq4" },
      { name: "Latvia", flag: "lv", url: "https://www.vfsvisaonline.com/Global-Passporttracking/Track/Index?q=shSA0YnE4pLF9Xzwon/x/H4U4Yoxvegz1LFctYtWZRfI62JQCrj2NXrFipZADwMYWhmeoXqut6WKqRfOVcdxV84uSQ9PQpcGmZumtlL3TqQ=" },
      { name: "Estonia", flag: "ee", url: "https://visatracking.vfsglobal.com/Global-Passporttracking/Track/Index?q=shSA0YnE4pLF9Xzwon/x/CbH0A9wGBx658I5hrzrIX1gbnQaKHsBo/ZKbK61qsclzAGD3HS+9eeZitNQBHMmLSC2eA5W19fJFkwvEXpuzIw=" },
      { name: "Luxembourg", flag: "lu", url: "https://luxembourgvisacheck.com/verify-luxembourg-visa/" },
      { name: "Iran", flag: "ir", url: "https://evisatraveller.mfa.ir/en/request/status/" },
      { name: "Israel", flag: "il", url: "https://www.vfsvisaonline.com/Global-Passporttracking/Track/Index?q=shSA0YnE4pLF9Xzwon/x/E0nJ2YmLdPRwhIGpRxXn6XIAjxpzt2kVi+fwWg5R+RrqFTrFQAgsMnLxFfy23QVJFAiZIA0BbyUbFH9o/ukXH6CiYJWiv+OfCetxh/dwanY" },
      { name: "Ghana", flag: "gh", url: "https://www.ghana.gov.gh/find-application/" },
      { name: "South Sudan", flag: "ss", url: "https://www.evisa.gov.ss/" },
      { name: "Uganda", flag: "ug", url: "https://www.jsdbiz.com/uganda-visa/check-status" },
      { name: "Rwanda", flag: "rw", url: "https://irembo.gov.rw/user/citizen/service/rdb/tourism_and_travel/visa_and_permit" },
      { name: "Tanzania", flag: "tz", url: "https://visa.immigration.go.tz/checkapplicationstatus" },
      { name: "Mozambique", flag: "mz", url: "https://mnzonline.vfsevisa.com/moz/en/track-status" },
      { name: "Angola", flag: "ao", url: "https://www.jsdbiz.com/angola-visa/check-status" },
      { name: "Democratic Republic of Congo", flag: "cd", url: "https://congo-evisa.com/application-status/" },
      { name: "Congo (Republic of the)", flag: "cg", url: "https://congovisacheck.com/" },
      { name: "Gabon", flag: "ga", url: "https://evisa.dgdi.ga/#/check" },
      { name: "Cameroon", flag: "cm", url: "https://cameroon-visa.info/application-status/" },
      { name: "Senegal", flag: "sn", url: "https://visatracking.vfsglobal.com/Global-Passporttracking/Track/Index?q=shSA0YnE4pLF9Xzwon/x/MMWoQ2u/1NQd8ht0KuMDeqNJEBHzf/pf00e1uZwPSD2sHw7Ed+0eLzULaYh51OqLY73Hw1opL/fy3AJ9TC6LQM=" },
      { name: "Cote d'Ivoire", flag: "ci", url: "https://www.ivorycoastimmigration.org/check-status" },
      { name: "Fiji", flag: "fj", url: "https://www.vfsvisaonline.com/Global-Passporttracking/Track/Index?q=shSA0YnE4pLF9Xzwon/x/K3TR28D6QZe7ZMQ849/GyMRu9oyBCGJ+NHqcGb/3GtVjHzLqLb4jbd05jwMIb65+LszmBPTl5tEfBJ22L1R8eY=" },
      { name: "Papua New Guinea", flag: "pg", url: "https://evisa.ica.gov.pg/evisa/account/status" },
      { name: "Samoa", flag: "ws", url: "https://ws.usembassy.gov/visas/visa-information/" },
      { name: "Tonga", flag: "to", url: "https://www.tongaconsul.com/visa" },
      { name: "Vanuatu", flag: "vu", url: "https://visa.vfsglobal.com/vut/en/aus/track-application" },
      { name: "Solomon Islands", flag: "sb", url: "https://immigration.gov.sb/know-your-visa-requirements/" },
      { name: "Laos", flag: "la", url: "https://laoevisa.gov.la/index" },
      { name: "Kenya", flag: "ke", url: "https://etakenya.go.ke/" }

  ];

  function openVchkModal() {
      setActiveMode('mode-vchk-tool');
      document.getElementById('vchkModalMain').style.display = 'flex';
      document.getElementById('vchkSearchInput').value = '';
      renderVchk(vchkDataList);
  }

  function closeVchkModal() {
      document.getElementById('vchkModalMain').style.display = 'none';
      document.getElementById('vchkSearchInput').value = '';
  }

  function renderVchk(data) {
      const grid = document.getElementById('vchkGridArea');
      grid.innerHTML = '';

      if (data.length === 0) {
          grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #ef4444; font-weight: bold; font-family: \'Inter\', sans-serif; font-size: 16px;">Sorry, no visa link found for this country!</p>';
          return;
      }

      data.forEach(item => {
          const card = document.createElement('a');
          card.href = item.url;
          card.target = '_blank';
          card.className = 'vchk-card';
          const flagImgSrc = item.flag === 'globe' ? 'https://upload.wikimedia.org/wikipedia/commons/2/22/Globe_icon.svg' : `https://flagcdn.com/w40/${item.flag}.png`;
          card.innerHTML = `
              <img src="${flagImgSrc}" alt="${item.name}">
              <span>${item.name}</span>
          `;
          grid.appendChild(card);
      });
  }

  function filterVchk() {
      const query = document.getElementById('vchkSearchInput').value.toLowerCase();
      const filtered = vchkDataList.filter(item => item.name.toLowerCase().includes(query));
      renderVchk(filtered);
  }
;

!function() {
    var e = -1 !== window.location.search.indexOf("m=1");

    function t(t) {
        if (!t) return "";
        var l = -1 !== t.indexOf("?") ? "&" : "?";
        return t = -1 !== t.indexOf("max-results=") ? t.replace(/max-results=\d+/, "max-results=6") : t + l + "max-results=6", e && -1 === t.indexOf("m=1") && (t += "&m=1"), t
    }
    
    document.querySelectorAll(".nav-menu a").forEach(function(t) {
        var l = t.getAttribute("href");
        if (l && (-1 !== l.indexOf("/search") || l.endsWith("/blog"))) {
            var i = "/search?max-results=6";
            e && (i += "&m=1"), t.setAttribute("href", i)
        }
    });

    let l = document.getElementById("native-newer-link"),
        i = document.getElementById("native-older-link"),
        n = document.getElementById("custom-prev"),
        r = document.getElementById("custom-next"),
        s = document.getElementById("custom-pagination"),
        a = document.querySelectorAll(".post-card-grid").length,
        f = window.location.href,
        d = !1;

    // Fix: এলিমেন্টগুলো (r, n, s) আছে কিনা তা চেক করে কাজ করা
    if (r) {
        if (i && a >= 3) {
            let o = i.getAttribute("href");
            r.setAttribute("href", t(o));
            r.style.display = "inline-block";
            d = !0;
        } else {
            r.style.display = "none";
        }
    }

    if (n) {
        if (-1 === f.indexOf("updated-max")) {
            n.style.display = "none";
        } else if (l) {
            let u = l.getAttribute("href"),
                m = window.location.origin;
            if (u === m + "/" || u === m || "/" === u || -1 !== u.indexOf(m + "/?m=1")) {
                let c = "/search?max-results=6";
                e && (c += "&m=1"), n.setAttribute("href", c)
            } else {
                n.setAttribute("href", t(u));
            }
            n.style.display = "inline-block";
            d = !0;
        } else {
            n.style.display = "none";
        }
    }

    if (d && s) {
        s.style.display = "flex";
    }
}();
;

let selfieSegmentation = null;

// ১. মোডাল ওপেন করার ফাংশন
async function openBgRemoverModal() {
    if (typeof setActiveMode === "function") setActiveMode("mode-bg-remover");
    var modal = document.getElementById("bgRemoverModal");
    if (modal) {
        modal.style.display = "flex";
        document.body.style.overflow = "hidden";
    }
    // ইঞ্জিন আগে থেকে লোড করে রাখা
    if (!selfieSegmentation) {
        selfieSegmentation = new SelfieSegmentation({
            locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`
        });
        selfieSegmentation.setOptions({ modelSelection: 1 }); 
    }
}

// ২. মোডাল ক্লোজ
function closeBgRemoverModal() {
    var modal = document.getElementById("bgRemoverModal");
    if (modal) {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
        document.getElementById("bgResultArea").style.display = "none";
        document.getElementById("bgInput").value = "";
    }
}

// ৩. মেইন প্রসেসিং (Fast & Free)
async function processBgRemoval() {
    let fileInput = document.getElementById("bgInput");
    let file = fileInput.files[0];
    let btn = document.getElementById("bgRemoveBtn");
    let loader = document.getElementById("bgLoader");
    let resultArea = document.getElementById("bgResultArea");
    let resultImg = document.getElementById("bgResultImage");
    let downloadBtn = document.getElementById("bgDownloadLink");

    if (!file) {
        alert("Please select an image!");
        return;
    }

    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing AI...';
    loader.style.display = 'flex';
    resultArea.style.display = "none";

    const inputImg = new Image();
    inputImg.src = URL.createObjectURL(file);

    inputImg.onload = async () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        
        // ছবি অনেক বড় হলে প্রসেসিং স্পিড বাড়ানোর জন্য রিসাইজ করা
        const maxDim = 1080;
        let w = inputImg.width;
        let h = inputImg.height;
        if(w > h && w > maxDim){ h *= maxDim/w; w = maxDim; }
        else if(h > maxDim){ w *= maxDim/h; h = maxDim; }
        
        canvas.width = w;
        canvas.height = h;

        selfieSegmentation.onResults((results) => {
            ctx.save();
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(results.segmentationMask, 0, 0, canvas.width, canvas.height);

            // মাস্কিং লজিক
            ctx.globalCompositeOperation = 'source-in';
            ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
            ctx.restore();

            // রেজাল্ট দেখানো
            const finalData = canvas.toDataURL("image/png");
            resultImg.src = finalData;
            downloadBtn.href = finalData;
            
            resultArea.style.display = 'flex';
            loader.style.display = "none";
            btn.disabled = false;
            btn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> Remove Background';
            resultArea.scrollIntoView({ behavior: "smooth" });
        });

        await selfieSegmentation.send({ image: inputImg });
    };
}

// ইনপুট চেঞ্জ হ্যান্ডলার
document.addEventListener("DOMContentLoaded", function() {
    var input = document.getElementById("bgInput");
    if (input) {
        input.addEventListener("change", function() {
            if (this.files && this.files[0]) {
                document.getElementById("bgFileName").innerText = this.files[0].name;
            }
        });
    }
});
;

let jState = {
    L: { img: null, zoom: 1, rot: 0, straighten: 0, flip: 1, x: 0, y: 0, br: 100, ct: 100, st: 100 },
    R: { img: null, zoom: 1, rot: 0, straighten: 0, flip: 1, x: 0, y: 0, br: 100, ct: 100, st: 100 }
}, jCanvas, jCtx, jActiveSide = null, isJDragging = !1, jStartX, jStartY, jLastMoveTime = 0, hasMovedJ = !1, jInputLock = 0;

// MediaPipe Variable
let jSelfieSegmentation = null;
let jGlobalBG = "#ffffff", jBorderWidth = 0;

async function openJointProModal() {
    if (typeof setActiveMode === "function") setActiveMode("mode-joint-pro");
    document.getElementById("jointProModal").style.display = "flex";
    document.body.style.overflow = "hidden";
    jCanvas = document.getElementById("jointProCanvas");
    jCtx = jCanvas.getContext("2d");
    jCanvas.width = 570;
    jCanvas.height = 450;
    
    // AI ইঞ্জিন আগে থেকে রেডি করা
    initJointAI();
    
    setupJEvents();
    renderJPro();
}

// ১. এআই ইঞ্জিন ইনিশিয়ালাইজ করা (ফ্রি ও আনলিমিটেড)
function initJointAI() {
    if (!jSelfieSegmentation && typeof SelfieSegmentation !== "undefined") {
        jSelfieSegmentation = new SelfieSegmentation({
            locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`,
        });
        jSelfieSegmentation.setOptions({ modelSelection: 1 });
    }
}

function closeJointProModal() {
    document.getElementById("jointProModal").style.display = "none";
    document.body.style.overflow = "auto";
}

function handleJCanvasClick(t) {
    let e = Date.now();
    if (e - jInputLock < 500 || hasMovedJ || isJDragging || e - jLastMoveTime < 300) return;
    let a = jCanvas.getBoundingClientRect(),
        n = t.changedTouches ? t.changedTouches[0].clientX : t.clientX,
        o = (n - a.left) * (jCanvas.width / a.width),
        i = o < jCanvas.width / 2 ? "L" : "R";
    if (null === jState[i].img) {
        jInputLock = e;
        document.getElementById("jInput" + i).click();
    }
}

function renderJPro() {
    if (!jCtx) return;
    jCtx.fillStyle = jGlobalBG;
    jCtx.fillRect(0, 0, jCanvas.width, jCanvas.height);
    drawJSide("L", 0, 285);
    drawJSide("R", 285, 285);
    if (jBorderWidth > 0) {
        jCtx.strokeStyle = "#000000";
        jCtx.lineWidth = 2 * jBorderWidth;
        jCtx.strokeRect(0, 0, jCanvas.width, jCanvas.height);
    }
}

function drawJSide(t, e, a) {
    let n = jState[t];
    if (n.img) {
        jCtx.save();
        jCtx.beginPath();
        jCtx.rect(e, 0, a, jCanvas.height);
        jCtx.clip();
        jCtx.translate(e + a / 2 + n.x, jCanvas.height / 2 + n.y);
        jCtx.rotate((n.rot + n.straighten) * Math.PI / 180);
        jCtx.scale(n.zoom * n.flip, n.zoom);
        jCtx.filter = `brightness(${n.br}%) contrast(${n.ct}%) saturate(${n.st}%)`;
        jCtx.drawImage(n.img, -n.img.width / 2, -n.img.height / 2);
        jCtx.restore();
    }
}

function rotateJoint(t) { jState[t].rot = (jState[t].rot + 90) % 360; renderJPro(); }
function flipJoint(t) { jState[t].flip *= -1; renderJPro(); }

function setupJEvents() {
    let getCoord = t => {
        let e = jCanvas.getBoundingClientRect(),
            a = t.touches && t.touches[0] ? t.touches[0].clientX : t.clientX,
            n = t.touches && t.touches[0] ? t.touches[0].clientY : t.clientY;
        return { x: (a - e.left) * (jCanvas.width / e.width), rawX: a, rawY: n };
    };

    let onStart = e => {
        if ("INPUT" === e.target.tagName || "range" === e.target.type) { isJDragging = !1; return; }
        let a = getCoord(e);
        jActiveSide = a.x < jCanvas.width / 2 ? "L" : "R";
        hasMovedJ = !1;
        if (e.target === jCanvas && jState[jActiveSide].img) {
            isJDragging = !0; jStartX = a.rawX; jStartY = a.rawY;
        }
    };

    let onMove = e => {
        if (!isJDragging) return;
        let a = getCoord(e);
        if (Math.abs(a.rawX - jStartX) > 5 || Math.abs(a.rawY - jStartY) > 5) {
            hasMovedJ = !0; jLastMoveTime = Date.now();
            jState[jActiveSide].x += a.rawX - jStartX;
            jState[jActiveSide].y += a.rawY - jStartY;
            jStartX = a.rawX; jStartY = a.rawY;
            renderJPro();
        }
        if (e.cancelable) e.preventDefault();
    };

    let onEnd = t => {
        if (isJDragging) isJDragging = !1;
        else if (t.target === jCanvas) handleJCanvasClick(t);
        setTimeout(() => { hasMovedJ = !1; }, 150);
    };

    jCanvas.onmousedown = onStart;
    jCanvas.addEventListener("touchstart", onStart, { passive: !1 });
    window.addEventListener("mousemove", onMove, { passive: !1 });
    window.addEventListener("touchmove", onMove, { passive: !1 });
    window.addEventListener("mouseup", onEnd);
    window.addEventListener("touchend", onEnd);

    ["Br", "Ct", "St", "Straighten", "Zoom"].forEach(t => {
        let e = "Straighten" === t ? "straighten" : t.toLowerCase();
        ["L", "R"].forEach(side => {
            let el = document.getElementById("j" + t + side);
            if (el) {
                el.oninput = n => {
                    let val = "Zoom" === t ? parseFloat(n.target.value) : parseInt(n.target.value);
                    jState[side][e] = val;
                    document.getElementById("v-j" + t + side).innerText = val + ("Straighten" === t ? "°" : "Zoom" === t ? "x" : "%");
                    renderJPro();
                };
            }
        });
    });

    document.getElementById("jBorder").oninput = t => {
        jBorderWidth = parseInt(t.target.value);
        document.getElementById("v-jBorder").innerText = jBorderWidth + "px";
        renderJPro();
    };

    document.getElementById("jInputL").onchange = t => loadJImg(t.target.files[0], "L");
    document.getElementById("jInputR").onchange = t => loadJImg(t.target.files[0], "R");
}

function loadJImg(file, side) {
    if (!file) return;
    let reader = new FileReader();
    reader.onload = e => {
        let img = new Image();
        img.onload = () => {
            jState[side].img = img; jState[side].x = 0; jState[side].y = 0;
            document.getElementById("jHint" + side).style.display = "none";
            renderJPro();
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// ২. সংশোধিত ব্যাকগ্রাউন্ড রিমুভাল ফাংশন (MediaPipe Local AI)
async function removeJointBg(side) {
    if (!jState[side].img) {
        alert("Please add photo first!");
        return;
    }

    let btn = document.getElementById("jAiBtn" + side), 
        oldText = btn.innerHTML;

    btn.disabled = true; 
    btn.innerHTML = "<i class='fa-solid fa-spinner fa-spin'></i> AI Processing...";

    if (!jSelfieSegmentation) initJointAI();

    const imgElement = jState[side].img;
    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");

    // প্রসেসিং স্পিডের জন্য ছবি বেশি বড় হলে রিসাইজ করা (Max 1080px)
    const maxDim = 1080;
    let w = imgElement.width;
    let h = imgElement.height;
    if(w > h && w > maxDim){ h *= maxDim/w; w = maxDim; }
    else if(h > maxDim){ w *= maxDim/h; h = maxDim; }
    
    tempCanvas.width = w;
    tempCanvas.height = h;

    jSelfieSegmentation.onResults((results) => {
        tempCtx.save();
        tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
        tempCtx.drawImage(results.segmentationMask, 0, 0, tempCanvas.width, tempCanvas.height);

        tempCtx.globalCompositeOperation = 'source-in';
        tempCtx.drawImage(results.image, 0, 0, tempCanvas.width, tempCanvas.height);
        tempCtx.restore();

        const resultImg = new Image();
        resultImg.onload = () => {
            jState[side].img = resultImg;
            renderJPro();
            btn.disabled = false;
            btn.innerHTML = oldText;
        };
        resultImg.src = tempCanvas.toDataURL("image/png");
    });

    await jSelfieSegmentation.send({ image: imgElement });
}

function downloadJointPro(t) {
    if (!jState.L.img || !jState.R.img) {
        alert("Please add both photos first!");
        return;
    }

    let rows = parseInt(document.getElementById("jRows").value) || 1,
        cols = parseInt(document.getElementById("jCols").value) || 1,
        n = jCanvas.toDataURL("image/jpeg", 0.95);

    if ("jpg" === t) {
        let link = document.createElement("a");
        link.download = "Joint_Photo.jpg";
        link.href = n;
        link.click();
    } else {
        let { jsPDF: i } = window.jspdf,
            pdf = new i("p", "mm", "a4");

        const imgW = 48.26; 
        const imgH = 38.1;  
        const startX = 2;   
        const startY = 3;   
        const gapX = 3;   
        const gapY = 3; 

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                let x = startX + (imgW + gapX) * c;
                let y = startY + (imgH + gapY) * r;
                if (x + imgW <= 208 && y + imgH <= 290) { 
                    pdf.addImage(n, "JPEG", x, y, imgW, imgH);
                }
            }
        }

        if ("print" === t) {
            pdf.autoPrint();
            const blobUrl = pdf.output('bloburl');
            window.open(blobUrl, '_blank');
        } else {
            pdf.save("Joint_Photo_A4.pdf");
        }
    }
}

window.adjustJLayout = function(id, val) {
    let el = document.getElementById(id), 
        n = parseInt(el.value) || 1;
    n += val;
    if (id === "jRows") n = Math.max(1, Math.min(7, n));
    else if (id === "jCols") n = Math.max(1, Math.min(4, n));
    el.value = n;
};

window.setGlobalJBG = function(color) { jGlobalBG = color; renderJPro(); };

function deleteJointImage(t) {
    if (!jState[t].img) {
        alert("No image to delete!");
        return;
    }
    jState[t] = { img: null, zoom: 1, rot: 0, straighten: 0, flip: 1, x: 0, y: 0, br: 100, ct: 100, st: 100 };
    ["Br", "Ct", "St", "Straighten", "Zoom"].forEach(ctrl => {
        let inputEl = document.getElementById("j" + ctrl + t);
        let labelEl = document.getElementById("v-j" + ctrl + t);
        if (inputEl) inputEl.value = (ctrl === "Zoom" ? 1 : ctrl === "Straighten" ? 0 : 100);
        if (labelEl) labelEl.innerText = (ctrl === "Zoom" ? "1.00x" : ctrl === "Straighten" ? "0°" : "100%");
    });
    document.getElementById("jInput" + t).value = "";
    document.getElementById("jHint" + t).style.display = "flex";
    renderJPro();
}
;

let ps4Img = new Image, ps4Canvas, ps4Ctx, ps4CropBox, ps4Loaded = !1, ps4Rotation = 0, ps4IsCropped = !1, ps4PhotoType = "passport", ps4CurrentBG = "transparent", cbX = 0, cbY = 0, cbW = 0, cbH = 0, isResizing = !1, currentHandle = null, isDragging = !1, startMX, startMY;

// MediaPipe AI Variable
let ps4SelfieSegmentation = null;

function getPst4Elements() {
    ps4Canvas || ((ps4Canvas = document.getElementById("ps4Canvas")) && (ps4Ctx = ps4Canvas.getContext("2d", { willReadFrequently: !0 })), ps4CropBox = document.getElementById("ps4CropBox"))
}

function isPhotoReady() {
    return !!ps4Loaded || ("function" == typeof showAlert ? showAlert("Please import a photo first!") : alert("Please import a photo first!"), !1)
}

function openPassportProModal() {
    getPst4Elements();
    "function" == typeof setActiveMode && setActiveMode("mode-passport-pro");
    let t = document.getElementById("ppProModal");
    t && (t.style.display = "flex", document.body.style.overflow = "hidden");
    
    // AI ইঞ্জিন আগে থেকে ইনিশিয়ালাইজ করে রাখা
    initPs4AI();
}

// ১. এআই ইঞ্জিন ইনিশিয়ালাইজ করা (ফ্রি ও আনলিমিটেড)
function initPs4AI() {
    if (!ps4SelfieSegmentation && typeof SelfieSegmentation !== "undefined") {
        ps4SelfieSegmentation = new SelfieSegmentation({
            locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`,
        });
        ps4SelfieSegmentation.setOptions({ modelSelection: 1 });
    }
}

function closePassportProModal() {
    let t = document.getElementById("ppProModal");
    t && (t.style.display = "none"), document.body.style.overflow = "auto"
}

function handleViewportClick(e) {
    ps4Loaded || document.getElementById("ps4FileInput").click()
}

function setFinalType(e, t) {
    t && t.stopPropagation(), ps4PhotoType = e, document.getElementById("ps4SizePicker").style.display = "none", initPs4Canvas(!0)
}

function initPs4Canvas(e = !1) {
    if (ps4Canvas && ps4Img.src) {
        if (ps4Canvas.width = ps4Img.width, ps4Canvas.height = ps4Img.height, renderPs4Editor(), e) {
            let t = "passport" === ps4PhotoType ? 4.5 / 3.5 : 1.25;
            cbH = (cbW = .5 * ps4Canvas.width) * t, cbX = (ps4Canvas.width - cbW) / 2, cbY = (ps4Canvas.height - cbH) / 2
        }
        updateCropBoxUI(), ps4CropBox.style.display = 'flex'
    }
}

document.getElementById("ps4FileInput") && document.getElementById("ps4FileInput").addEventListener("change", function(e) {
    let t = e.target.files[0];
    if (!t) return;
    if (t.size > 10485760) {
        "function" == typeof showAlert && showAlert("File is too large! Please use a photo under 10MB.");
        return
    }
    let i = new FileReader;

    function n() {
        ps4Loaded = !0, ps4Rotation = 0, ps4IsCropped = !1, document.getElementById("ps4Hint").style.display = "none", document.getElementById("ps4Canvas").style.display = 'flex', document.getElementById("ps4SizePicker").style.display = 'flex', document.getElementById("ps4CropBox").style.display = "none", initPs4Canvas(!1)
    }
    i.onload = e => {
        let t = new Image;
        t.onload = () => {
            let e = t.width,
                i = !1;
            if (e < 800 ? (e = 1200, i = !0) : e > 2500 && (e = 2e3, i = !0), i) {
                let l = e / t.width,
                    a = document.createElement("canvas");
                a.width = e, a.height = t.height * l;
                let s = a.getContext("2d", { alpha: !1 });
                s.imageSmoothingEnabled = !0, s.imageSmoothingQuality = "medium", s.drawImage(t, 0, 0, a.width, a.height), (ps4Img = new Image).onload = () => n(), ps4Img.src = a.toDataURL("image/jpeg", .9)
            } else ps4Img = t, n()
        }, t.src = e.target.result
    }, i.readAsDataURL(t)
});

function renderPs4Editor() {
    if (!ps4Loaded) return;
    let t = document.getElementById("p4-br").value,
        e = document.getElementById("p4-ct").value,
        i = document.getElementById("p4-st").value,
        l = document.getElementById("p4-border").value,
        h = document.getElementById("p4-rotation"),
        n = h ? parseInt(h.value) : 0;
    ps4Ctx.clearRect(0, 0, ps4Canvas.width, ps4Canvas.height);
    ps4Ctx.save();
    if ("transparent" !== ps4CurrentBG) {
        ps4Ctx.fillStyle = ps4CurrentBG;
        ps4Ctx.fillRect(0, 0, ps4Canvas.width, ps4Canvas.height)
    }
    ps4Ctx.translate(ps4Canvas.width / 2, ps4Canvas.height / 2);
    ps4Ctx.rotate(n * Math.PI / 180);
    ps4Ctx.filter = `brightness(${t}%) contrast(${e}%) saturate(${i}%)`;
    ps4Ctx.drawImage(ps4Img, -ps4Canvas.width / 2, -ps4Canvas.height / 2, ps4Canvas.width, ps4Canvas.height);
    ps4Ctx.restore();
    if (l > 0) {
        ps4Ctx.filter = "none";
        ps4Ctx.lineWidth = ps4Canvas.width * l / 100;
        ps4Ctx.strokeStyle = "#000000";
        ps4Ctx.strokeRect(0, 0, ps4Canvas.width, ps4Canvas.height)
    }
}

function updateCropBoxUI() {
    let t = ps4Canvas.getBoundingClientRect(),
        e = t.width / ps4Canvas.width;
    ps4CropBox.style.left = cbX * e + "px", ps4CropBox.style.top = cbY * e + "px", ps4CropBox.style.width = cbW * e + "px", ps4CropBox.style.height = cbH * e + "px"
}

function getPos(e) {
    return e.touches && e.touches.length > 0 ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : { x: e.clientX, y: e.clientY }
}

function initResize(e, t) {
    e.cancelable && e.preventDefault(), e.stopPropagation(), isResizing = !0, currentHandle = t;
    let n = getPos(e);
    startMX = n.x, startMY = n.y
}
if (document.getElementById("ps4CropBox")) {
    let e = document.getElementById("ps4CropBox"),
        t = e => {
            if (isResizing) return;
            e.stopPropagation(), isDragging = !0;
            let t = getPos(e);
            startMX = t.x, startMY = t.y
        };
    e.addEventListener("mousedown", t), e.addEventListener("touchstart", t, { passive: !1 })
}

function handleMove(e) {
    if (!ps4Loaded || !isResizing && !isDragging) return;
    let t = ps4Canvas.getBoundingClientRect(),
        n = ps4Canvas.width / t.width,
        o = getPos(e),
        s = (o.x - startMX) * n,
        i = (o.y - startMY) * n;
    if (isResizing) {
        "br" === currentHandle ? cbW += s : "tl" === currentHandle ? (cbX += s, cbW -= s, cbY += s * ("passport" === ps4PhotoType ? 4.5 / 3.5 : 1.25)) : "tr" === currentHandle ? (cbW += s, cbY -= s * ("passport" === ps4PhotoType ? 4.5 / 3.5 : 1.25)) : "bl" === currentHandle && (cbX += s, cbW -= s), cbW = Math.max(40, cbW);
        cbH = cbW * ("passport" === ps4PhotoType ? 4.5 / 3.5 : 1.25)
    } else isDragging && (cbX += s, cbY += i);
    cbX = Math.max(0, Math.min(ps4Canvas.width - cbW, cbX)), cbY = Math.max(0, Math.min(ps4Canvas.height - cbH, cbY)), startMX = o.x, startMY = o.y, updateCropBoxUI(), e.cancelable && e.preventDefault()
}
window.addEventListener("mousemove", handleMove), window.addEventListener("touchmove", handleMove, { passive: !1 }), window.addEventListener("mouseup", () => {
    isResizing = !1, isDragging = !1
}), window.addEventListener("touchend", () => {
    isResizing = !1, isDragging = !1
});

function confirmPs4Crop(e) {
    if (e && e.stopPropagation(), !isPhotoReady()) return;
    if (ps4IsCropped) {
        "function" == typeof showAlert && showAlert("Photo already cropped!");
        return
    }
    let t = document.createElement("canvas");
    t.width = 600, t.height = "passport" === ps4PhotoType ? 770 : 750;
    t.getContext("2d").drawImage(ps4Canvas, Math.floor(cbX), Math.floor(cbY), Math.floor(cbW), Math.floor(cbH), 0, 0, t.width, t.height), (ps4Img = new Image).onload = () => {
        ps4IsCropped = !0;
        let e = document.getElementById("ps4CropBtn");
        e && (e.style.opacity = "0.5", e.style.pointerEvents = "none");
        let t = document.getElementById("p4-rotation");
        t && (t.value = 0, t.disabled = !0, t.style.opacity = "0.5", document.getElementById("v4-rotation").innerText = "0\xb0"), initPs4Canvas(!0), ps4CropBox.style.display = "none"
    }, ps4Img.src = t.toDataURL("image/png")
}

function rotatePs4(e) {
    if (e && e.stopPropagation(), !isPhotoReady() || ps4IsCropped) return;
    let t = document.createElement("canvas"),
        n = t.getContext("2d");
    t.width = ps4Img.height, t.height = ps4Img.width, n.translate(t.width / 2, t.height / 2), n.rotate(Math.PI / 2), n.drawImage(ps4Img, -ps4Img.width / 2, -ps4Img.height / 2), (ps4Img = new Image).onload = () => renderPs4Editor(), ps4Img.src = t.toDataURL("image/png")
}

// ২. সংশোধিত ব্যাকগ্রাউন্ড রিমুভাল ফাংশন (MediaPipe Local AI - Unlimited & Free)
async function runPs4AI() {
    if (!isPhotoReady()) return;
    let e = document.getElementById("ps4AiBtn"),
        t = '<i class="fa-solid fa-wand-magic-sparkles"></i> Remove Background';
    e.disabled = !0, e.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Processing Locally...';

    if (!ps4SelfieSegmentation) initPs4AI();

    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");
    
    // প্রসেসিং এর জন্য ছবির আকার ঠিক করা
    tempCanvas.width = ps4Img.width;
    tempCanvas.height = ps4Img.height;

    ps4SelfieSegmentation.onResults((results) => {
        tempCtx.save();
        tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
        tempCtx.drawImage(results.segmentationMask, 0, 0, tempCanvas.width, tempCanvas.height);

        tempCtx.globalCompositeOperation = 'source-in';
        tempCtx.drawImage(results.image, 0, 0, tempCanvas.width, tempCanvas.height);
        tempCtx.restore();

        const resultImg = new Image();
        resultImg.onload = () => {
            ps4Img = resultImg;
            e.innerHTML = t, e.disabled = !1;
            renderPs4Editor();
        };
        resultImg.src = tempCanvas.toDataURL("image/png");
    });

    await ps4SelfieSegmentation.send({ image: ps4Img });
}

function setPs4BG(e) {
    isPhotoReady() && (ps4CurrentBG = e, renderPs4Editor())
}

async function exportPs4(e) {
    if (!isPhotoReady()) return;
    let t = ps4Canvas.toDataURL("image/png");
    if ("png" === e) {
        let n = document.createElement("a");
        n.download = ps4PhotoType + ".png", n.href = t, n.click()
    } else {
        let { jsPDF: l } = window.jspdf, a = new l("p", "mm", "a4"), r = Math.min(parseInt(document.getElementById("p4-rows").value) || 1, "passport" === ps4PhotoType ? 6 : 10), d = Math.min(parseInt(document.getElementById("p4-cols").value) || 1, "passport" === ps4PhotoType ? 5 : 8), i = "passport" === ps4PhotoType ? 38.1 : 20, s = "passport" === ps4PhotoType ? 48.26 : 25;
        for (let p = 0; p < r; p++)
            for (let o = 0; o < d; o++) {
                let u = 3 + o * (i + 3),
                    m = 2 + p * (s + 3);
                u + i <= 210 && m + s <= 297 && a.addImage(t, "PNG", u, m, i, s)
            }
        a.save(ps4PhotoType + "_Sheet.pdf")
    }
}

function deletePs4(e) {
    e && e.stopPropagation(), ps4Loaded = !1, ps4IsCropped = !1, ps4CurrentBG = "transparent", ps4Img = new Image, ps4Ctx.clearRect(0, 0, ps4Canvas.width, ps4Canvas.height), ps4Canvas.style.display = "none", document.getElementById("ps4Hint").style.display = 'flex', ps4CropBox.style.display = "none", document.getElementById("ps4FileInput").value = "";
    let t = document.getElementById("ps4CropBtn");
    t && (t.style.opacity = "1", t.style.pointerEvents = "auto");
    let n = document.getElementById("p4-rotation");
    n && (n.disabled = !1, n.style.opacity = "1", n.value = 0, document.getElementById("v4-rotation").innerText = "0\xb0"), document.getElementById("p4-br").value = 100, document.getElementById("p4-ct").value = 100, document.getElementById("p4-st").value = 100, document.getElementById("p4-border").value = 0, document.getElementById("v4-br").innerText = "100%", document.getElementById("v4-ct").innerText = "100%", document.getElementById("v4-st").innerText = "100%", document.getElementById("v4-border").innerText = "0"
}

["p4-br", "p4-ct", "p4-st", "p4-border", "p4-rotation"].forEach(e => {
    let t = document.getElementById(e);
    if (!t) return;
    let n = !1,
        l = t.value,
        a = e => {
            if (t.disabled) return;
            let a = t.getBoundingClientRect(),
                r = e.touches ? e.touches[0].clientX : e.clientX,
                d = (t.value - t.min) / (t.max - t.min),
                i = a.left + d * a.width;
            Math.abs(r - i) > 30 ? n = !1 : (n = !0, l = t.value)
        };
    t.addEventListener("mousedown", a), t.addEventListener("touchstart", a, { passive: !0 }), t.addEventListener("input", a => {
        if (t.disabled || !n) {
            t.value = l;
            return
        }
        let r = document.getElementById("v4-" + e.split("-")[1]);
        if (r) {
            let d = "p4-border" === e ? "" : "p4-rotation" === e ? "\xb0" : "%";
            r.innerText = a.target.value + d
        }
        ps4Loaded && renderPs4Editor()
    });
    let r = () => {
        n = !1
    };
    window.addEventListener("mouseup", r), window.addEventListener("touchend", r)
});
;

(function() {
    let currentUI_Lang = 'bn';

    // ১. মোডাল কন্ট্রোল ফাংশন
    window.showDateConverter = function() {
        try { if (typeof setActiveMode === 'function') setActiveMode('mode-date-converter'); } catch(e) {}
        const modal = document.getElementById("dateConverterModal");
        const dateInput = document.getElementById('eng-date-input');
        
        if (modal) {
            modal.style.display = "flex";
            document.body.style.overflow = "hidden";

            // বর্তমান তারিখ (Today's Date) সিলেক্ট করার লজিক
            if (dateInput && !dateInput.value) {
                const today = new Date();
                const yyyy = today.getFullYear();
                const mm = String(today.getMonth() + 1).padStart(2, '0');
                const dd = String(today.getDate()).padStart(2, '0');
                dateInput.value = `${yyyy}-${mm}-${dd}`;
            }

            switchDateLang('bn');
        }
    };

    window.hideDateConverter = function() {
        const modal = document.getElementById("dateConverterModal");
        if (modal) {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
        }
    };

    // ২. ভাষা পরিবর্তন
    window.switchDateLang = function(lang) {
        currentUI_Lang = lang;
        document.getElementById('dc-btn-bn').classList.toggle('active', lang === 'bn');
        document.getElementById('dc-btn-en').classList.toggle('active', lang === 'en');

        const labels = {
            bn: { title: "তারিখ কনভার্টার (অ্যাডভান্সড)", input: "ইংরেজি তারিখ নির্বাচন করুন:", en: "ইংরেজি তারিখ:", bn: "বাংলা তারিখ (বঙ্গাব্দ):", ar: "আরবি তারিখ (হিজরি):" },
            en: { title: "Advanced Date Converter", input: "Select English Date:", en: "English Date:", bn: "Bangla Date (Bengali):", ar: "Arabic Date (Hijri):" }
        };

        const t = labels[lang];
        document.getElementById('dc-ui-title').innerText = t.title;
        document.getElementById('dc-lbl-input').innerText = t.input;
        document.getElementById('dc-res-en-title').innerText = t.en;
        document.getElementById('dc-res-bn-title').innerText = t.bn;
        document.getElementById('dc-res-ar-title').innerText = t.ar;

        if (document.getElementById('eng-date-input').value) processAllDateConversions();
    };

    // ৩. মূল লজিক (৭ মার্চ = ১৭ রমজান = ২২ ফাল্গুন)
    window.processAllDateConversions = function() {
        const input = document.getElementById('eng-date-input').value;
        if (!input) return;

        const date = new Date(input);
        document.getElementById('dc-results').style.display = 'flex';

        const bnNums = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
        const toBn = (n) => n.toString().split('').map(d => bnNums[d] || d).join('');

        // --- English ---
        const enVal = new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
        document.getElementById('res-en-num').innerText = enVal;

        // --- Arabic (Fixed Offset for 17 Ramadan) ---
        const arMonthsBn = ["মহররম", "সফর", "রবিউল আউয়াল", "রবিউস সানি", "জমাদিউল আউয়াল", "জমাদিউস সানি", "রজব", "শাবান", "রমজান", "শাওয়াল", "জিলকদ", "জিলহজ"];
        const arMonthsEn = ["Muharram", "Safar", "Rabi' al-Awwal", "Rabi' al-Thani", "Jumada al-Awwal", "Jumada al-Thani", "Rajab", "Sha'ban", "Ramadan", "Shawwal", "Dhu al-Qi'dah", "Dhu al-Hijjah"];
        
        const arDate = new Date(date.getTime() + (-1 * 24 * 60 * 60 * 1000)); // -1 day offset
        const arFormatter = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn', {day:'numeric', month:'numeric', year:'numeric'});
        const arParts = arFormatter.formatToParts(arDate);
        const hd = parseInt(arParts.find(p => p.type === 'day').value);
        const hm = parseInt(arParts.find(p => p.type === 'month').value);
        const hy = arParts.find(p => p.type === 'year').value;

        if (currentUI_Lang === 'bn') {
            document.getElementById('res-ar-num').innerText = toBn(hd) + "ই " + arMonthsBn[hm - 1] + " " + toBn(hy) + " হিজরি";
        } else {
            document.getElementById('res-ar-num').innerText = hd + " " + arMonthsEn[hm - 1] + " " + hy + " Hijri";
        }

        // --- Bangla (Government Revised Logic) ---
        const bnMonths = ["বৈশাখ", "জ্যৈষ্ঠ", "আষাঢ়", "শ্রাবণ", "ভাদ্র", "আশ্বিন", "কার্তিক", "অগ্রহায়ণ", "পৌষ", "মাঘ", "ফাল্গুন", "চৈত্র"];
        const enBnMonths = ["Boishakh", "Jyaistha", "Asharh", "Srabon", "Bhadra", "Ashwin", "Kartika", "Agrahayana", "Pousha", "Magha", "Falgun", "Chaitra"];
        
        const bnDays = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 29, 30]; 
        let gy = date.getFullYear();
        if ((gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0)) bnDays[10] = 30;

        let bYear = gy - 593;
        let bishakh1 = new Date(gy, 3, 14);
        if (date < bishakh1) {
            bYear--;
            bishakh1 = new Date(gy - 1, 3, 14);
            let py = gy - 1;
            if ((py % 4 === 0 && py % 100 !== 0) || (py % 400 === 0)) bnDays[10] = 30; else bnDays[10] = 29;
        }

        let diff = Math.floor((Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(bishakh1.getFullYear(), bishakh1.getMonth(), bishakh1.getDate())) / 86400000);
        let mi = 0;
        while (diff >= bnDays[mi]) { diff -= bnDays[mi]; mi++; }
        let bd = diff + 1;

        if (currentUI_Lang === 'bn') {
            document.getElementById('res-bn-num').innerText = toBn(bd) + "ই " + bnMonths[mi] + " " + toBn(bYear) + " বঙ্গাব্দ";
        } else {
            document.getElementById('res-bn-num').innerText = bd + " " + enBnMonths[mi] + " " + bYear + " Bangabda";
        }
    };

    window.resetDatePro = function() {
        document.getElementById('eng-date-input').value = '';
        document.getElementById('dc-results').style.display = 'none';
    };

    // --- আপডেট করা কপি লজিক ---
    window.copyDateResult = function(btn) {
        const en = document.getElementById('res-en-num').innerText;
        const bn = document.getElementById('res-bn-num').innerText;
        const ar = document.getElementById('res-ar-num').innerText;
        
        const textToCopy = (currentUI_Lang === 'bn') ? 
            `ইংরেজি: ${en}\nবাংলা: ${bn}\nআরবি: ${ar}` : 
            `English: ${en}\nBangla: ${bn}\nArabic: ${ar}`;

        navigator.clipboard.writeText(textToCopy).then(() => {
            const originalText = btn.innerText;
            const originalBg = btn.style.background;
            
            btn.innerText = (currentUI_Lang === 'bn' ? "কপি হয়েছে!" : "Copied!");
            btn.style.background = "#10b981";

            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.background = originalBg;
            }, 2000);
        }).catch(err => {
            console.error('Copy failed: ', err);
        });
    };

})();
;

const travelData = {
    airline: [
        { name: "Air Astra - Airways Limited", img: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjzFwE1JacbyZYGxfFGlgrAzNHpcHIC3cGStp3sFdzQExU3t_SbY7TAKf_nu-NjAkHsAFnKzOfQ2Eb7EjMfYzNpt1tVARx9KcArP0KTLkgJ18XmszIWPtP72q_qyzD-CUP3aCwU9jgpXAdCc4kHip_WDbbdfJGJrW4TNHGdvuEirE476SmL5YunKaBbyGk/s310/airastra.jpeg", url: "https://airastra.com/" },
        { name: "NovoAir - Flight journey", img: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhmCdx87khpWyigXErtMmgY3pCa0eLX7TujrfpJirNlUWDXLviPS3mBE3WR-O2PTffw35SE9Te5aNV9bMj7oODetlxpPd25xgfs-JMMCjQD_Lj8ZEqsPd-Y_b8FhzNAIzBvMFMlrbeBFZ4YJRx0H9kKwm3n5cA3wHpU-_l5w_oqZJib5jXh6L4v5G_3u6M/s282/novoair.jpeg", url: "https://www.flynovoair.com/" },
        { name: "CheapOair - Flight Tickets", img: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhdBeTFWZoK078de1HgMF6-SUsDaCXWwRCc_X1eMiKinq9RL30OvnESoSdRgwmuF5gOMqYNZ5slqcZfAg1wwAp3hid8lhQxaZ6JbgcvWHXOjy3SHtSE0uGs0Nl-oasjxQNikJ3DDBSeMARhPBnmcoynxZaOf06TTP9hhO_65qzLcC8PrPzPSlL9CK8IVrI/s280/cheapoair.jpeg", url: "https://www.cheapoair.com/" },
        { name: "Bangladesh Biman Airlines", img: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiFBygpOUNHZd6oZF1cELJFQcYZrQyZXqFdQXTg1b1tef2NPW3AxTGB8nAgqcVG25Zx8TU6N7oxE_SBIWl141QVEWsx9XtF2wA5wg9i2MqFs4MQCEEABYZMbsu18MCguaVSIFg6wYtWsIBYKs-KvZF1MQWfQt6zaFcZpkDW5KO8mFoLyxWSCwuXpqkFATo/s301/hsia.jpeg", url: "https://www.hsia.gov.bd/bn/" },
        { name: "OneTravel - Flights & Tickets", img: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjiIp1CXwAMFZnngeZ4cYTnIt7wbH5-1rKzUI-FOChONcdpFu4pC1Hw95cyI7XYTBtHPj75GojeSCRNwAM4m5DHLQuHzlBk0WfMHZkNxfkB18zNaxoXdh6aL0_3aoNESjxKk1QzWVxtaONY5gF3_VV-jcfTpTPKcGgNkVHXEp79Vr-ZEmDtBZErN8AdOF8/s300/onetravel.jpeg", url: "https://www.onetravel.com/" },
        { name: "Trips Insider - Air Ticket", img: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEis30Ww8khsAtOYGvq-sJtGkr2oMs6plzmy30qK2Cg-8haqTeS7ZXghzVQ6QZoaFWTxKlSj7zrC7Pxpa_U9jxThFxj02vu_IaFHqXuWEoXcYBwHuB_XCURdfur9GeNnJBM_WS3bj2wfgj_0HjURUh2QYd20BxTXXzLA8NpXS85sKrCBuIeUrDcWc3ZK7Vs/s299/tripsinsider.jpeg", url: "https://www.tripsinsider.com/flights/" },
        { name: "Flight Fare - Ticket Bangladesh", img: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjMo5RPw8fmeiruDpAFlHSItavRqG7oAwdfaUpoS04i1lN0HGLn_OBoaTW569j2sJjKx_S84G0ym3_0CIjax-BdU7qh-T57lyskttzztWaRke0QhhekclTFZJoR9hJilm_HwMKccnLuDoXL22uQgOTBsHp1usMLxZc3uWhnSbquieDWRG1Me305sOrI27Y/s298/flight-fare.jpeg", url: "https://www.flight-fare.com/" },
        { name: "Shohoz - Air Tickets", img: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh6-YOiojE9oOsZIYy9inW1J0iv3sS8lL5diptKtFW1x2bE2ZV5QlHLV2oBKr4ucXtkg2SHH9k5upQzIm0ZhMkGdXukUUENc5Td_OCP5Ec5H_M43ZskW6pd4F7Ux6Evnzj8e-6M6wJFKwelKEiguIU1QmyZa-dwF6_9X7j87VVJRksTy8W4hKIbD_IPtuQ/s300/shohoz.jpeg", url: "https://www.shohoz.com/air-tickets" },
        { name: "US-Bangla Airlines", img: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjLDIS9PBmqJVLytVi7xNwUUpE1pKXvvRqWDz1uo8WEKQOrXdZFMcqtSxiNfZufUkH5beF3l3GJkc1MrKzq3rA-eGj6QtKEgA2ZMo_GcthwK84SFhHZmCkfyKu41AAAW9Tjxy_Ibfaq3X10S-7TKYK9nlkBCfThSVbmvidm1OPMGKJhBbG6tmqRilN6ZJk/s180/usbair.jpeg", url: "https://usbair.com/" },
        { name: "Biman Bangladesh Airlines", img: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgx2zt7gC9GxQiXxDnk1jjcy225VjMuKVdLpJakdKnafkYwBautVNlZ1XLNX5R1b6e9kHfHh3VV9FE3VtHOp2y5K4TXUfeKz-8OY7mz4uQLchCcE8__WHPIoexLztlNJSNqQ5SKqSdofQL0uX0J2LQndh39hCfdFK9hZrY3iAW-NPnDN-kgPFOR4QUlBps/s208/biman-airlines.jpeg", url: "https://www.biman-airlines.com/" },
        { name: "Buy Tickets BD", img: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjlaUNTVCv_7H0Cqt5O15tbLfy27iBBVTtcpOJ4V_dfmukM1ByTCKg_s8NJ4KmZYJcwfZ5p-tUNkVF7BUg4w5X-BDNEZicNja6OLLwAb-C5ovYFBBvUXas1WEWRTQsrlNqdpJP81DwpPvKgqwrkEXWseOJYQFlGFpvRyeEwLXg6OyBzdnNSJIZdeK2Fiz8/s256/buytickets.jpeg", url: "https://buytickets.com.bd/" },
        { name: "Amy Travel Agency", img: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjtswuB4Rzm-FPOJmoD-q-JfaHMXni3NU2rg6_0VuOsga6ddAP8zCsPMnvB3LaUKL35SCaom4Pg42Po8z8JtI9pVv9nr5Z5c0_9GyQLzhcR3aiGBF93tmycLCHj1M6Nd1yuecPaKWbglLBpn9J6Xn_HlFRgJshcDJzJ_HxW8nWPdDrjz0YLZf4Hy5GY1Hw/s605/amy.jpeg", url: "https://www.amybd.com/" },
        { name: "Firsttrip - Flight Booking", img: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEilY131MwEU9OziE6aO2japzvY0UtXasuJ8oPOeRXa_Em4MKsbXQJAsUGJAfD7DeZuHH_XiyesjbnxdTF2OX3fCvdJnEV-tKm_wq2oZTajp-fYY4pUZZaDECYhcI85loxnO5XKEvuh3Bysw4RWVH9K7gf8Brsg1TBSMFFxQMwwlYnkgr1MYDQhA2uBXxaY/s494/firsttrip.jpeg", url: "https://firsttrip.com/" },
        { name: "GoZayaan Travel", img: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEifWUi0ebKglTSr6lXMXSHmvXP3q62xJ-CvvnDikM5emQVPybzf0fA-nFmKAb4uqf9X4zd5Qux3fxnBNu9hrPxthyphenhyphenXQOI7sc55ejOM5KF7fzxWX_dP0kX80-Ls707TXV-XjWmqOQCcu70vKkjIIUmpaz7u3fmNvPdXBFzmuIVO4tg7frFtd6HmGJGQMETA/s130/gozayaan.jpeg", url: "https://gozayaan.com/" },
        { name: "Airpaz - Traveling", img: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi11IN9cCtfiUcC4VTZ29mGIulxAG4TLWwKIodNcPkmG5P-iNZFejbLECtEKRJF4f-LtsZu3X-4GEDLVhRzwB3RdA3mqssL34kUaMGZC2LlqpmgmwyxaviWZwRXBC0uw-PWImkoDjBskcnk1dfPoAcPC5mY5Gg1RajBZompYAYo82h5NbuBxzHU4KjzM5A/s140/airpaz.png", url: "https://www.airpaz.com/" },
        { name: "ShareTrip - Air Tickets", img: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh0NOdrWQEVXv7y_5zQljA9j21ieRiyjxWlrJaWC5YdoD1JkzePW2HOSg79WEFortmh6sNhpd7SRQGDniDlPb9pyb-GDGOKv0A1YRcXlqopbPHcwVZK0K8Z8h0tQEg2ANFKWjkAeemd7ifYa1kdk1SikwKSKX2jQPEjc0VBE7tv1nusYCeCSpMwV3ZET64/s568/sharetrip.jpeg", url: "https://sharetrip.net/" }
    ],
    bus: [
        { name: "Jatri - Bus Tickets", img: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg2jOMe7fIgGFZQF7rz9B4kGYd71gFVmsUYMDUYVHa2daMP5Y5GHu2mNI_Ns0S-XBiQMf-z0MNZ-sCKGsaEa1eCmh5qIKvq91-7-MVQDikXpAGCHOsQhhT1Yhv00HskGBhLWwcTACKFOxxcjXbVagPrC5IuJpuQTKYG-8DAuO2s3zk37xZOvrvT4hEulVM/s72/jatri.jpeg", url: "https://jatri.co/" },
        { name: "BdTickets", img: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh4rj1LljIDCXWGKxsQq1rshi9PrmhT3-bEIHwELuEF5-XbLhD4aEPTwcM_MngUzcXaWdnylrUzGHjvW8FLINCQdbAb-TUmC7ZEFPZVOO9tUgCOX8Hc-vPFSKZE_kmoJWwNDf2uhwwqnuu2MeKVO27otb7qnSIfuT-JaK_iIeMrDo6Z52yW9Ts6VdjtJqM/s384/bdtickets.jpeg", url: "https://bdtickets.com/" },
        { name: "Shohoz - Bus Tickets", img: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh6-YOiojE9oOsZIYy9inW1J0iv3sS8lL5diptKtFW1x2bE2ZV5QlHLV2oBKr4ucXtkg2SHH9k5upQzIm0ZhMkGdXukUUENc5Td_OCP5Ec5H_M43ZskW6pd4F7Ux6Evnzj8e-6M6wJFKwelKEiguIU1QmyZa-dwF6_9X7j87VVJRksTy8W4hKIbD_IPtuQ/s300/shohoz.jpeg", url: "https://www.shohoz.com/bus-tickets" },
        { name: "Busbd - Tickets Online", img: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgRile9ABFI4-9lV2oLolGu85XXHl5D34FCr7lbD6-5oAd1Nk969fDvBHrutrpiPcQ0P2k4LlzDpctuyOyuAKlZOReDk3L03L0NPKM7HcZjZ-cu8WfAOpGTkNWcBRFpBjCn-QN0bHzQsD3SfNJYKL8qrMzbmjT3ATJwc_VYc746bQSmrwcvSupDQXYKRjI/s118/busbd.jpeg", url: "https://www.busbd.com.bd/" },
        { name: "Green Line – E-ticketing", img: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgre2Shmq2gWKs5sEp-aXh-zlkk-NqbLpBbjRjGCWnsaJMnaqqQZIg5zSLBE-J1cWajtivhZe-06QnMqUaWgnx2y67zTPAdREUoTBvXYqZDMhi4BH-lFmAHj8PrESGL1BHOTZB7IGhIIylgvQREjSPjAP9jh6PCZ1imxx-yiod7hv91dRLwOt_U7Ekt66U/s332/greenlinebd.png", url: "https://greenlinebd.com/" },
        { name: "Hanif Enterprise", img: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi9z7-GH0VJC0GFVfq4PyJ79axGfwf_40h_8LEU-KiMDxaKuYi-tyTUhMQqzU6CHQZvJGnYTyhqcRu_HJ_V7ScAUmE5d003g031dumwyUEH-FlS9nujkNwILxeacMrmIcbFmEdnWV4ABaiCIQ0Er5-K13uBo1g1_GjrbSKJXY-T9y2AXzlDccSsVxa2QEk/s600/hanif.jpeg", url: "https://www.hanifenterprisebd.com/" },
        { name: "S-Alam - Online Bus Ticket", img: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhW4DjoagK_DMcIi_k2EQPETNBQ0HOpXg4MLYtzKirvOtREe12Oj1x4XHaU8peQxutAjWhuiPfjAP_BwqenX6wUthif8xgmHlLAZtHh52cKLpM1w0E7QEqHAHAbXHin-rt-fAQvkIB16x9-91iyvuzvPzr8BeqG3panbQ1QT3RP1efZOKqhnbvu2zbMUYM/s160/s-alambus.jpg", url: "https://s-alambus.com/" },
        { name: "Shyamoli Paribahan", img: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgFOnwIs_g29y-bVAqVSYgxOmucraz7QsXP_z9ZJIUtO7aBbyW_mgnIui7vy_4uUgoUvvW0DfGmRjxcJhtrP92pV8kS7ZK4k9Gw2lF6j2qom8TByf-MQOknIIZ9eYytfNOHlzviFHAhmYd5wPLES136JyMUZev_oxYYQO4RG4WzCS8-v3ZtVO_8RYWqxZc/s400/shyamoliparibahan.jpeg", url: "https://shyamolitickets.com/" },
        { name: "National Travels", img: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh8-U2juN1vbAIzy1GR3jVP6Zan80BX63YJBSL1iZtcITAmuY7ppwovjOOSJz689zKabdQ-cuttwd1n6JNgULuxN4eQTKxuL1p8F8NGGaRdzz7ur9WEygkZ7AwMa0nY0z8lx8bsPwI8TAgZ7rMflnSriyelruPeaVc77OrFcV-8-NoBcg5NRAfwHfIe7-0/s336/nationaltravels.jpeg", url: "https://www.nationaltravels-bd.com/" },
        { name: "Shohagh Paribahan", img: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjOBbOgDcSH_mpk2U7xLzbqjh2by5JLmuLReysuEnDMGkXJU-50OV6HdmG8flwg_gDFIYuIZsvcjUkYy9JskjkG4ZOYtGZs8pARu9WXXy5d2lw-SXA1Z8MdU2XwyZKSELmEg4lGX1i_RQYFyxvY5n7SOS7hkDEfUI65p54rrYYYgPTKcpc5E5mbDOYPJoc/s1366/shohagh.png", url: "https://shohagh.com/" },
        { name: "Chapai Express", img: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhEwO0jSzYF2DQxoHdQuF9Ps1LiDTg0QEpH0l6GXYYE_mkI6ASMYTq_D_TEuhzSzhlZhCDp6J9w-mGaGOxpBaVm54uLI0Ma8nqYHxkaQGAHnD83OxksY-Z9U94hxgGlzceXcfXmXpXsCAtmGPUD7_OcjqK-FwCZLTM-KKfK-vPd5avf5PsP8vTjlOjL2Jk/s211/chapaiexpressbd.jpg", url: "https://chapaiexpressbd.com/" },
        { name: "Grameen Travels", img: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi629AEP8pdiHZ5ucQLNlKVbtb7TfynFIKx8QIIXUTagDLppBp7VIJs4GTvwyJHvLc5DqBDaa8zxYjid-d5o-2YU9mUO9YnnwxRkePVUxgvYdbtlnmXkEac-OINQUBqu7jdBUyOh_72rAutYSeLV69ozyoSLnp2nHGunzV4VnhnudpThKSN-k13ugSzaak/s350/grameentravels.jpg", url: "https://grameentravelsbd.com/" },
        { name: "Ena Transport", img: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjGmlE-en2rk-y5VMqTGBXr1p-efgQgPcoUnsxTs13-1QsCSBRGnOgMKh8A2w6p5HeLX99PEhA4-T_xrMwVkW2HbIiF6A224dX-OJ4DE7uQ_TymTi0-wet-eM-IjosYbmDrDlVzGuntpJNcGXz9aUeEhSZOtFbcnAq03FsYumhGmrCUiRcP27TJaQ5dBZk/s1000/enatransport.jpeg", url: "https://enatransport.com.bd/" },
        { name: "Sonya Enterprise - Ticket", img: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiAdKgCw4HkQ3YQ1nThz_O59FiGX_J-cdE3uf_fDlJmi0zpBogxanMXMK-wIPxIMXrdXq5w7u64kRT1F1T8uExxFP_ny4zlp0ZMImwl0Bq5sNoVEAbOHj7lG_-ebJCdqeTJ6a1LjZCf3SYTRsvEQkZnvmIiGkUNZ7e7RAKp8pYgqa5jehMctWcjfEhK6Ek/s1280/sonyabus.jpeg", url: "https://sonyabus.com/" },
        { name: "Lal Sobuj Paribahan", img: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiuv0VDG5aYMoKca0MORqz-MdT9mZwULfx4mLb-74pStYrAfhhvWlDZ6sstWuvnj-gT9JXAGucUq8VX5JZFDxzyjD5R9mEDkyvvQX8KR2dMr_oywEQrIh9VWMUK7SaXHwmnI7nPcwfN5TbPBBiGYlYj9bj-oTp9_KACZtnYGz3DyIEbgAa7E56BlovYbxc/s350/lalsobujbus.jpeg", url: "https://lalsobujbus.com/" },
        { name: "Sara Express - Bus Ticket", img: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEguqLE2pXxwK3uVxUFUr1iFA9r-odINPYPdCi0MVmPE99DpIrlIIZoXHfPAs8N0u5fgKZcKJUUqc4p03EToc6diZAFBpQNKzABCt5ONjjRwtV7pjZyseDmk62Qr1znFvjX00eMAeBzntIl2SqUbBXIfDxWm-A1rNua4XIYbr4Y2HEOCm8IvLSJNKvmIprk/s826/saraexpress.jpeg", url: "https://www.saraexpress.com/" },
        { name: "Desh Travels", img: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhpjHgzEGNn-phOJnR6jGBWCuWkcglmKSedRohuBuGi39XZUc_5fdZ_nk9f7PbSOm0bbLBgO5sRGBeTExL4oQ0sSfJ-JHl1PdD7pRXRgVhPoJZQE-WH_xk0CvcLa90QMwMJ7GnUUeMhiit9T79Oi41fIPW-quSN3zuIeq4yPAEsSOeluuVVHPJehrJLe4E/s344/deshtravels.jpeg", url: "https://deshtravelsbd.com/" }
    ],
    launch: [
        { name: "Shohoz - Launch Ticket", img: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh6-YOiojE9oOsZIYy9inW1J0iv3sS8lL5diptKtFW1x2bE2ZV5QlHLV2oBKr4ucXtkg2SHH9k5upQzIm0ZhMkGdXukUUENc5Td_OCP5Ec5H_M43ZskW6pd4F7Ux6Evnzj8e-6M6wJFKwelKEiguIU1QmyZa-dwF6_9X7j87VVJRksTy8W4hKIbD_IPtuQ/s300/shohoz.jpeg", url: "https://www.shohoz.com/launch-tickets/" },
        { name: "BdTickets - Launch", img: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh4rj1LljIDCXWGKxsQq1rshi9PrmhT3-bEIHwELuEF5-XbLhD4aEPTwcM_MngUzcXaWdnylrUzGHjvW8FLINCQdbAb-TUmC7ZEFPZVOO9tUgCOX8Hc-vPFSKZE_kmoJWwNDf2uhwwqnuu2MeKVO27otb7qnSIfuT-JaK_iIeMrDo6Z52yW9Ts6VdjtJqM/s384/bdtickets.jpeg", url: "https://bdtickets.com/launch" },
        { name: "Karnafuly Express", img: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjh29xXRVquqMBCDDp3T4Tb8bQLO7xbSEi2Mwh3ONo-4duzqdCGgWAEq-6dznZHG5LEjnBGrHXhjXMHWNXJ9rcUKbU5Ah4vPJriRDRS290Gd9Czm8fEITnKAgmrFFed0bn123EJgzpX3QPhRTGmhySU1AccB4VCTPsqmBfV8Rz0V902NNB0CbLEiftBNEg/s755/karnafulyexpresss.png", url: "https://karnafulyexpress.com.bd/" },
        { name: "Jatri - Launch", img: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg2jOMe7fIgGFZQF7rz9B4kGYd71gFVmsUYMDUYVHa2daMP5Y5GHu2mNI_Ns0S-XBiQMf-z0MNZ-sCKGsaEa1eCmh5qIKvq91-7-MVQDikXpAGCHOsQhhT1Yhv00HskGBhLWwcTACKFOxxcjXbVagPrC5IuJpuQTKYG-8DAuO2s3zk37xZOvrvT4hEulVM/s72/jatri.jpeg", url: "https://jatri.co/" },
        { name: "Asha Jawa Launch", img: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj2tcV07jJJ-3LUvKhu9Of8crlVpsyn5Psk2-gD8AFtBTafJhKRuva0_kqEEdH2f_Cq-Hfqc1DAkPqgWXqn5k99uKfsduNiVNjNxMTCWGY1Si7TasKlYjBmBfdzIjq2-gAM6HSgSrzeyGaMs83sQpZ0weZ8TP4EEbVweRLbNWoATyhvzDcaf5-FGDSp2Cc/s124/ashajawaa.png", url: "http://ashajawa.com/" },
        { name: "BDTIX - Launch Operators", img: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEif7hZGTz4PCSYeD0C_87nsNnuK7K1YBg9IL3jdfEY4ZWWbeVRIbFQBYDvFN_FQajktAFYNikuzRHqpjgv7MX4-ELx2TUZPPE8yZxFE7Wv9sS7J4tPh8V8oM9mmoTPzsbL-Fwwiew6gzGklNyEBZFSUc-sCHz10w-TnAvaV1c9ySsTt1fBDRION4_Lm-Q0/s180/bdtix.jpeg", url: "https://bdtix.com/launch-tickets" },
        { name: "Launch BD - Tickets", img: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjizJ3ElqL6JylcdW4LTevA5WCg1YXXo8rnEP4BtejTevI9mRa6HBmEl6bFz9VqNP99bPge5EUeV1t0TPc_ZgKifFNA2_7M9hWmYKE5MoR9jCK-oiVkfnOn3-5xcQWn_sSNVvvcy-uN4-_qh3x_ISCrNhCF-fnKvBmZBm5Yu42Zfu88MdONalX-2WTnrYU/s214/launchbd.jpeg", url: "https://www.launchbd.com/" },
        { name: "MV Manami - Launch", img: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiZfCbfkdrYrg-aGuaSRbpNmF9XVYdWzMvCT7iwEJM2RO_TvoWMcIfx7R-hZzHnlOaQdtavTiQUw1rHZraFRl6U4e0df2tads6uI34XILBqHYxvp8YcCX_mjQ-0fIA8_bzDKKuuCVkbrOk7TAvzw1iw14O1cv8t25BrOvn59Q16UkWQjK_XAWEZJRoNRTo/s1076/mvmanami.png", url: "https://booking.mvmanami.com/" }
    ],
    train: [
        { name: "Bangladesh Railway", img: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgSUNuH_uSABZQfbFLMOBTHiV86pyIyb3zc-06PSckvlbnek0P6Squ9T3R2cPQA2kh9b9mqaxPhzHC3Yh46LTcQEuyrtdHBrTuaDLwxfKHbtI6XbKDzDB1kvH-uc6LfX94Hb8CvFa5cD7XvkfIzgtGclNgX7WfRr5kvVK0OyNQN6tI5dgAa-I3JhSuKkds/s250/bdrailwayticket.jpeg", url: "https://bdrailwayticket.com/" },
        { name: "Shohoz - Train Tickets", img: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh6-YOiojE9oOsZIYy9inW1J0iv3sS8lL5diptKtFW1x2bE2ZV5QlHLV2oBKr4ucXtkg2SHH9k5upQzIm0ZhMkGdXukUUENc5Td_OCP5Ec5H_M43ZskW6pd4F7Ux6Evnzj8e-6M6wJFKwelKEiguIU1QmyZa-dwF6_9X7j87VVJRksTy8W4hKIbD_IPtuQ/s300/shohoz.jpeg", url: "https://train.shohoz.com/" },
        { name: "Rapid Pass - Metrorail", img: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgBCX1n-0arj87F-JKGO67nEdIn2EYNP6cSa6hbLm5jQJDd3bEpQLeZ8XGaCGlJI4Al2MNSTRAnv12PNjYwwRvUACeSrvVPq8djVmMh-cE5n-8W9X3dA4oIwTZa1_q9FK3bFvumNnLwbmb0yQ5U4q9vDUfctOib2HHoGfJY4_IVHyUdDfYsosHQjhDRElw/s193/rapidpass.jpeg", url: "https://rapidpass.com.bd/" },
        { name: "12Go - International", img: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiNhXZxGNOY2x21KA_I3h8BJvIxZYixoZUgpcnTz80CNGiFUJ-ifAkyWKS5_PGg6y45j3ljBucfSgFjO7_H1yluNPfwes02kk-T35vrC28Tv8ehvMl3BRdW8YVIVzOLHdq5Wfws4o0G8x2kqHME9jkcsiAcsiEVuCJ53I3eYZP1Vk7eUAVXpCtCIfSFIGk/s300/12go.jpeg", url: "https://12go.asia/en/operator/bangladesh-railway" }
    ],
    hotel: [
        { name: "Booking.com - Hotel", img: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgvPNk3TvT0lL4BfXkm-l7iteYJ22HtXrk6GMgyn5gtmBkfjNGgWbxMF6E8ANHVU0GNI5uS5nt4_wTgD8uXc49W5aFLrUQYkMVCJZsTUr4BWmLsNGfWkiqDOPMzCkSgz7shvqhvHpXSmyXiCXkI2NbkulMJF9eY4455gx_VrMBIhfSPIqjWMqfKsoVWyvY/s300/booking.jpeg", url: "https://www.booking.com/" },
        { name: "Agoda.com - Hotel", img: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgLbrGvPslGvcE3u0olRG1t3shIsMmleIhXtPNi6SY-K7iYajlUYirqASrSoG6WB53SEMxAM_7oEa5lymsrlMqZzBfYTGMoE-SAW1WP5QL6B5wMA7IwJzlbw4_hXYOrrJnwKhJSn4ymFjGJsfL6A68UecD9E1s7miWNMFZ3YR_IjqPDx0BF25K5lPtmmXQ/s1660/agoda.jpeg", url: "https://www.agoda.com/" },
        { name: "ShareTrip - Hotel", img: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh0NOdrWQEVXv7y_5zQljA9j21ieRiyjxWlrJaWC5YdoD1JkzePW2HOSg79WEFortmh6sNhpd7SRQGDniDlPb9pyb-GDGOKv0A1YRcXlqopbPHcwVZK0K8Z8h0tQEg2ANFKWjkAeemd7ifYa1kdk1SikwKSKX2jQPEjc0VBE7tv1nusYCeCSpMwV3ZET64/s568/sharetrip.jpeg", url: "https://sharetrip.net/hotel" },
        { name: "BdTickets - Hotel", img: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh4rj1LljIDCXWGKxsQq1rshi9PrmhT3-bEIHwELuEF5-XbLhD4aEPTwcM_MngUzcXaWdnylrUzGHjvW8FLINCQdbAb-TUmC7ZEFPZVOO9tUgCOX8Hc-vPFSKZE_kmoJWwNDf2uhwwqnuu2MeKVO27otb7qnSIfuT-JaK_iIeMrDo6Z52yW9Ts6VdjtJqM/s384/bdtickets.jpeg", url: "https://bdtickets.com/hotel" },
        { name: "Travel Price Drops", img: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjLM7KwbKjxq0SN_QULLz9kJjpx6b_P_8GyxOqh19wMDrswAN-WnT0fOAKpd4ro5iONxZTMsTpqGw04Ii4Fu1BMVqsvHIrYF6TY4s4e_b6sRQGdf2OJsiWJ0T3laa_jXytHHLE3_Bz3oNmIPVd9_DZagk9wkN1KieW5sqrwrtWOaXVszxVqwtmboBQgdc4/s256/travelpricedrops.jpeg", url: "https://travelpricedrops.com/hotels" },
        { name: "Search Hotel Prices", img: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgoIacr8PbawoscDvUZM6d1Gln5d4A9OyJv8zRWvBJievvhvhBS_yB4CWN147W8zXrNFPhELTAiyNjm0YwmTw-GddPA7c4avE-XCAC03niLb0JrSD5jfMaRshM_AOGZJCQFOuFLh7xRYzUouVUFybfGh2QrIpWuLaCAD01LPOjd-sensnKPWET6OCHwhVI/s384/searchhotelprices.jpeg", url: "https://searchhotelprices.com/hotels" },
        { name: "Bangladesh Parjatan", img: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgoskqjqcY12UxVGVHWTESNssefykiXr-zctxbaNng9MaMUutUlJ_4UbzOB90gcTwP3ZMS1G4DlG9yqH1BHfDaFw8S7Z6ieKwiw0XCj1KFoh_iZKDenTCqGIaa8YSboyLk2bokfszCSfk1LRDwTMMIEsQkZoYOhgYAhkY3wQ7mq2xz5_FZOO2d1LzhLGjk/s107/hotels.jpeg", url: "https://hotels.gov.bd/" },
        { name: "BdBooking.com", img: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjQHe13NMMdGw0SVB1ncNI5nMlNW8MXGKpxmSebUOCiUcsZVAiZgcmqZR6w302ZHijTu5cJkvgvA6q2huCbtKnIdWQJ5WEGuHFnX-nVVeyXqwU1K2Pl7fhu-Q4-Mc1Z1-vXTP0XkBtic8B0TRNne7KW68x45Cd11R1FskJ30pkImaznX_yGQPQeGRT-uFQ/s224/bdbooking.png", url: "https://www.bdbooking.com/" },
        { name: "GoZayaan - Hotel", img: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEifWUi0ebKglTSr6lXMXSHmvXP3q62xJ-CvvnDikM5emQVPybzf0fA-nFmKAb4uqf9X4zd5Qux3fxnBNu9hrPxthyphenhyphenXQOI7sc55ejOM5KF7fzxWX_dP0kX80-Ls707TXV-XjWmqOQCcu70vKkjIIUmpaz7u3fmNvPdXBFzmuIVO4tg7frFtd6HmGJGQMETA/s130/gozayaan.jpeg", url: "https://gozayaan.com/?search=hotel" },
        { name: "Cozycozy - BD Hotels", img: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjAKOJ_IrcKlZ0zvIsEmbF2jhxNxJtMOz0rW4no3lh-25FD5wTcN1H7Y0trgCDVCpUXKWnoZL2VHby85hjA2kw37NxBYWYw8ydD7JEhxBLJlJaDiFrUCd-W2_SiauXwZY-Xn8L88j4Z9Z4nD1_3uIPbvn6ZvVC-rTcoSuYv_ZaGKvyqaiJHlWxKVrDOsMM/s182/cozycozy.png", url: "https://www.cozycozy.com/ie/bangladesh-hotels" },
        { name: "Hotels Booking BD", img: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjWd1MrTp-niXRr_JApChVBH3oqOFyz9KKIK2QtN9aQTQ_Gc2awdIksi4YsfHOPZjAzgh4pRwGF4HlfoF7YmkH0JLnBrZ1NJUVnaMfm0Mk0IUvNdC8W6L6_V3YmGZIfsJ2cD-NdnGlUPzSKR56IwGw7bxadOypyu3d1_YBj-Nyqiq9hhgN5rwwA3cdq7l4/s800/hotelsbookingbd.jpeg", url: "https://hotelsbookingbd.com/" },
        { name: "Firsttrip - Hotel", img: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEilY131MwEU9OziE6aO2japzvY0UtXasuJ8oPOeRXa_Em4MKsbXQJAsUGJAfD7DeZuHH_XiyesjbnxdTF2OX3fCvdJnEV-tKm_wq2oZTajp-fYY4pUZZaDECYhcI85loxnO5XKEvuh3Bysw4RWVH9K7gf8Brsg1TBSMFFxQMwwlYnkgr1MYDQhA2uBXxaY/s494/firsttrip.jpeg", url: "https://firsttrip.com/hotel" }
    ]
};

let travelActiveCat = "airline";

function openTravelModal() {
    if (typeof setActiveMode === "function") setActiveMode("mode-travel-booking");
    document.getElementById("travelBookingModal").style.display = "flex";
    document.body.style.overflow = "hidden";
    renderTravelGrid(travelActiveCat);
}

function closeTravelModal() {
    document.getElementById("travelBookingModal").style.display = "none";
    document.body.style.overflow = "auto";
}

function showTravelCat(cat, btn) {
    travelActiveCat = cat;
    document.querySelectorAll(".t-tab").forEach(t => t.classList.remove("active"));
    btn.classList.add("active");
    renderTravelGrid(cat);
}

function renderTravelGrid(cat, search = "") {
    const grid = document.getElementById("travelMasterGrid");
    grid.innerHTML = "";
    
    let list = [];
    if (search) {
        Object.keys(travelData).forEach(k => { list = list.concat(travelData[k]); });
    } else {
        list = travelData[cat];
    }

    const filtered = list.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));

    if (filtered.length === 0) {
        grid.innerHTML = "<div style='grid-column:1/-1; padding:50px; text-align:center; color:#94a3b8;'>No result found!</div>";
        return;
    }

    filtered.forEach(item => {
        const card = document.createElement("div");
        card.className = "travel-item-card";
        card.innerHTML = `
            <div class="travel-img-box"><img src="${item.img}" alt="${item.name}" loading="lazy"/></div>
            <strong>${item.name}</strong>
            <a href="${item.url}" class="travel-go-btn" target="_blank">Book Now</a>
        `;
        grid.appendChild(card);
    });
}

function filterTravel() {
    const val = document.getElementById("travelSearch").value;
    renderTravelGrid(travelActiveCat, val);
}
;



let epCropper = null;

  function openEidPosterModal() {
      setActiveMode('mode-eid-posterr');
      document.getElementById('eidPosterModal').style.display = 'flex';
      resizeEpPreview(); 
  }

  function closeEidPosterModal() {
      document.getElementById('eidPosterModal').style.display = 'none';
      resetEidPoster();
  }

  // Update Data and Templates
  function updateEidPoster() {
      document.getElementById('out-ep-name').innerText = document.getElementById('ep-name').value || 'আপনার নাম';
      document.getElementById('out-ep-title').innerText = document.getElementById('ep-title').value || 'আপনার পদবি';
      document.getElementById('out-ep-address').innerText = document.getElementById('ep-address').value || 'আপনার ঠিকানা';
      document.getElementById('out-ep-msg').innerText = document.getElementById('ep-msg').value || 'সবাইকে পবিত্র ঈদুল ফিতরের শুভেচ্ছা ও অভিনন্দন';
      
      // Update Theme and Layout dynamically
      const poster = document.getElementById('eid-poster-export');
      const theme = document.getElementById('ep-theme').value;
      const layout = document.getElementById('ep-layout').value;
      poster.className = 'ep-poster-export ' + theme + ' ' + layout;
  }

  // Load and Init Crop
  function loadEpPhoto(event) {
      const file = event.target.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = function(e) {
              const image = document.getElementById('ep-crop-image');
              image.src = e.target.result;
              document.getElementById('ep-cropper-modal').style.display = 'flex';
              
              if (epCropper) {
                  epCropper.destroy();
              }
              // Initialize Cropper.js
              epCropper = new Cropper(image, {
                  aspectRatio: 1, // 1:1 Square/Circle crop
                  viewMode: 1,
                  autoCropArea: 1
              });
          }
          reader.readAsDataURL(file);
      }
  }

  // Save Cropped Image
  function saveEpCrop() {
      if (epCropper) {
          const canvas = epCropper.getCroppedCanvas({
              width: 500,
              height: 500
          });
          document.getElementById('out-ep-photo').src = canvas.toDataURL('image/jpeg', 0.95);
          closeEpCrop();
      }
  }

  // Close Cropper Modal
  function closeEpCrop() {
      document.getElementById('ep-cropper-modal').style.display = 'none';
      document.getElementById('ep-photo-in').value = ''; 
      if(epCropper) {
          epCropper.destroy();
          epCropper = null;
      }
  }

  // Responsive Scaling for Mobile Preview
  function resizeEpPreview() {
      const wrapper = document.getElementById('ep-preview-wrapper');
      const poster = document.getElementById('eid-poster-export');
      if(!wrapper || !poster) return;
      
      const wrapperWidth = wrapper.clientWidth;
      if(wrapperWidth < 820) {
          const scale = wrapperWidth / 840; 
          poster.style.transform = `scale(${scale})`;
          wrapper.style.height = `${800 * scale}px`;
      } else {
          poster.style.transform = `scale(1)`;
          wrapper.style.height = `800px`;
      }
  }
  window.addEventListener('resize', resizeEpPreview);

  // High Quality Download using html2canvas
  function downloadEidPoster() {
      const poster = document.getElementById('eid-poster-export');
      const btn = document.getElementById('btn-ep-download');
      
      // Remove transform scale so html2canvas captures full 800x800 res
      poster.style.transform = 'scale(1)';
      
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> প্রসেসিং হচ্ছে...';
      btn.style.opacity = '0.7';
      btn.disabled = true;

      html2canvas(poster, {
          scale: 2, // 1600x1600 output resolution (HD)
          useCORS: true,
          backgroundColor: null
      }).then(canvas => {
          let link = document.createElement('a');
          link.download = 'Eid_Mubarak_Poster.jpg';
          link.href = canvas.toDataURL('image/jpeg', 1.0);
          link.click();
          
          btn.innerHTML = '<i class="fa-solid fa-download"></i> HD ডাউনলোড';
          btn.style.opacity = '1';
          btn.disabled = false;
          resizeEpPreview(); // Restore mobile view
      }).catch(err => {
          console.error("Poster Error: ", err);
          btn.innerHTML = '<i class="fa-solid fa-download"></i> HD ডাউনলোড';
          btn.disabled = false;
          resizeEpPreview();
      });
  }

  function resetEidPoster() {
      document.getElementById('ep-name').value = '';
      document.getElementById('ep-title').value = '';
      document.getElementById('ep-address').value = '';
      document.getElementById('ep-msg').value = 'সবাইকে পবিত্র ঈদুল ফিতরের শুভেচ্ছা ও অভিনন্দন';
      document.getElementById('ep-theme').value = 'theme-blue';
      document.getElementById('ep-layout').value = 'layout-1';
      document.getElementById('out-ep-photo').src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512'><path fill='%2394a3b8' d='M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z'/></svg>";
      updateEidPoster();
  }
;

let isQLibrariesLoaded = false;
  let qLogoData = null; // লোগো ইমেজের জন্য গ্লোবাল ভেরিয়েবল

  // ডিফল্ট কোম্পানি ও শর্তাবলী ডাটা
  const defaultCompanyName = "Your Company Name";
  const defaultCompanyContact = "Mob: 01834030544, 01403178709";
  const defaultCompanyAddress = "Comilla, Chittagong, Bangladesh.";
  const defaultTermsAndConditions = 
    "1. Scope Includes Delivery & Installation of above mentioned items.\n" +
    "2. Any additional work or materials will be charged on actual.\n" +
    "3. Quotation validity 15 days from the date of quote.\n" +
    "4. Installation and delivery will start within 3-days after receiving PO.\n" +
    "5. Payment: 50% Advance and balance after completion.";

  // মোডাল অ্যাক্টিভেশন লজিক
  async function openQuotationMakerModal() {
      document.getElementById('quotationMakerModal').style.display = 'flex';
      setupDefaultQDates();
      loadSavedQuotationSender(); // ১. পূর্বে সেভ করা কোম্পানি প্রোফাইল লোড করবে
      
      // টেবিল খালি থাকলে ১টি নতুন রো যোগ করবে
      const container = document.getElementById('quotationItemsList');
      if (container.children.length === 0) {
          addQuotationItemRow();
      }
      
      await initQuotationMakerLibraries();
  }

  function closeQuotationMakerModal() {
      document.getElementById('quotationMakerModal').style.display = 'none';
      clearQuotationMakerForm();
  }

  // লাইব্রেরি ড্রাইভার
  function loadQScript(url) {
      return new Promise((resolve, reject) => {
          let script = document.createElement('script');
          script.src = url;
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
      });
  }

  // jsPDF ইঞ্জিন চেকার
  async function initQuotationMakerLibraries() {
      if (isQLibrariesLoaded) return;
      const statusEl = document.getElementById('quotationMakerStatus');
      statusEl.innerText = 'Loading PDF engines, please wait...';
      try {
          if (typeof window.jspdf === 'undefined') {
              await loadQScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
          }
          isQLibrariesLoaded = true;
          statusEl.innerText = 'Engines loaded. Ready to build quotation.';
      } catch (err) {
          statusEl.innerText = 'Failed to load PDF engine. Check internet.';
          console.error(err);
      }
  }

  // অটো-সেভ কোম্পানি প্রোফাইল (টেক্সট)
  function saveQuotationSender() {
      localStorage.setItem('q_sender_name', document.getElementById('qSenderName').value.trim());
      localStorage.setItem('q_sender_contact', document.getElementById('qSenderContact').value.trim());
      localStorage.setItem('q_sender_address', document.getElementById('qSenderAddress').value.trim());
  }

  // কোম্পানির লোগো আপলোড ও লোকাল স্টোরেজে সেভ
  function handleQuotationLogo(input) {
      const file = input.files[0];
      if (file) {
          if (!file.type.startsWith('image/')) {
              alert('Please select a valid image file (PNG/JPG) for the logo.');
              input.value = '';
              return;
          }
          const reader = new FileReader();
          reader.onload = function(e) {
              qLogoData = e.target.result;
              document.getElementById('qLogoPreviewText').style.display = 'flex';
              localStorage.setItem('q_logo_data', qLogoData); // লোগো স্থায়ীভাবে সেভ হবে
          };
          reader.readAsDataURL(file);
      }
  }

  // পূর্বে সংরক্ষিত কোম্পানি প্রোফাইল লোড করা
  function loadSavedQuotationSender() {
      const name = localStorage.getItem('q_sender_name');
      const contact = localStorage.getItem('q_sender_contact');
      const address = localStorage.getItem('q_sender_address');
      const logo = localStorage.getItem('q_logo_data');
      const savedTerms = localStorage.getItem('q_terms_data');

      // কোম্পানি তথ্য লোড (না থাকলে ডিফল্ট AL MOTHEER বসাবে)
      document.getElementById('qSenderName').value = name !== null ? name : defaultCompanyName;
      document.getElementById('qSenderContact').value = contact !== null ? contact : defaultCompanyContact;
      document.getElementById('qSenderAddress').value = address !== null ? address : defaultCompanyAddress;
      
      // টার্মস লোড (না থাকলে ইমেজের ডিফল্ট ৫টি টার্মস বসাবে)
      document.getElementById('qTermsText').value = savedTerms !== null ? savedTerms : defaultTermsAndConditions;

      if (logo) {
          qLogoData = logo;
          document.getElementById('qLogoPreviewText').style.display = 'flex';
      }
  }

  // ডেট অটো-ফিল
  function setupDefaultQDates() {
      const today = new Date();
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);

      const todayStr = today.toISOString().split('T')[0];
      const nextWeekStr = nextWeek.toISOString().split('T')[0];

      document.getElementById('qDate').value = todayStr;
      document.getElementById('qDueDate').value = nextWeekStr;
  }

  // ডাইনামিক রো অ্যাড করার ফাংশন
  function addQuotationItemRow() {
      const container = document.getElementById('quotationItemsList');
      const rowId = 'qrow-' + Date.now();
      
      const rowHTML = `
        <div class="q-item-row" id="${rowId}">
          <div class="q-setting-item" style="margin: 0;">
            <input type="text" class="q-item-desc" placeholder="Product Name / Specification" required="required" />
          </div>
          <div class="q-setting-item" style="margin: 0;">
            <input type="number" class="q-item-qty" value="1" min="1" oninput="calculateQuotationTotals()" style="text-align: center;" required="required" />
          </div>
          <div class="q-setting-item" style="margin: 0;">
            <input type="number" class="q-item-price" value="0.000" min="0" step="0.001" oninput="calculateQuotationTotals()" style="text-align: center;" required="required" />
          </div>
          <div class="q-setting-item" style="margin: 0;">
            <input type="number" class="q-item-disc" value="0.000" min="0" step="0.001" oninput="calculateQuotationTotals()" style="text-align: center;" required="required" />
          </div>
          <button onclick="removeQuotationItemRow('${rowId}')" style="background: transparent; border: none; color: #ef4444; font-size: 18px; cursor: pointer; padding: 5px 0;">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      `;
      
      container.insertAdjacentHTML('beforeend', rowHTML);
      calculateQuotationTotals();
  }

  function removeQuotationItemRow(rowId) {
      const row = document.getElementById(rowId);
      if (row) {
          row.remove();
          calculateQuotationTotals();
      }
  }

  // রিয়েল-টাইম ক্যালকুলেটর লজিক
  function calculateQuotationTotals() {
      const rows = document.querySelectorAll('.q-item-row');
      const currency = document.getElementById('qCurrency').value || 'BDT';
      let subtotal = 0;

      rows.forEach(row => {
          const qty = parseFloat(row.querySelector('.q-item-qty').value) || 0;
          const price = parseFloat(row.querySelector('.q-item-price').value) || 0;
          const discount = parseFloat(row.querySelector('.q-item-disc').value) || 0;
          subtotal += ((qty * price) - discount);
      });

      const paid = parseFloat(document.getElementById('qPaid').value) || 0;
      const balanceDue = subtotal - paid;

      document.getElementById('qLiveSubtotalText').innerText = subtotal.toFixed(3) + ' ' + currency;
      document.getElementById('qLiveDueText').innerText = balanceDue.toFixed(3) + ' ' + currency;
  }

  // ইমেজের ডিজাইনের সাথে মিল রেখে কোটেশন জেনারেটর এবং পিডিএফ ডাউনলোড/প্রিন্ট লজিক
  async function startQuotationGeneration(action) {
      const statusEl = document.getElementById('quotationMakerStatus');
      const generateBtn = document.getElementById('qGenerateBtn');
      const printBtn = document.getElementById('qPrintBtn');

      const senderName = document.getElementById('qSenderName').value.trim();
      const clientName = document.getElementById('qClientName').value.trim();
      const qNum = document.getElementById('qNumber').value.trim() || 'ALM0207-202306';

      if (!senderName || !clientName) {
          alert('Please fill in both Company Name and Client/Billing Name.');
          return;
      }

      const rows = document.querySelectorAll('.q-item-row');
      if (rows.length === 0) {
          alert('Please add at least one item to generate a quotation.');
          return;
      }

      statusEl.innerText = 'Assembling official layout...';
      generateBtn.disabled = true;
      printBtn.disabled = true;

      try {
          await initQuotationMakerLibraries();
          const { jsPDF } = window.jspdf;
          
          // স্ট্যান্ডার্ড A4 সাইজ (210 x 297 mm) ডক সেটআপ
          const doc = new jsPDF('p', 'mm', 'a4');
          
          const senderContact = document.getElementById('qSenderContact').value.trim();
          const senderAddress = document.getElementById('qSenderAddress').value.trim();
          const clientLocation = document.getElementById('qClientLocation').value.trim();
          const clientMobile = document.getElementById('qClientMobile').value.trim();
          
          const qDate = document.getElementById('qDate').value;
          const qDueDate = document.getElementById('qDueDate').value;
          const qPayTerm = document.getElementById('qPayTerm').value.trim() || '7 days';
          const qPayMethod = document.getElementById('qPayMethod').value.trim() || 'Cash';
          const qSalesperson = document.getElementById('qSalesperson').value.trim() || '-';
          
          const currency = document.getElementById('qCurrency').value || 'USD';
          const paidAmount = parseFloat(document.getElementById('qPaid').value) || 0;
          const termsText = document.getElementById('qTermsText').value.trim();

          // ১. লগো ড্রয়িং লজিক (আপলোড হয়ে থাকলে ইমেজের মতো বামদিকের উপরে নিখুঁতভাবে বসবে)
          let companyTextX = 15;
          if (qLogoData) {
              doc.addImage(qLogoData, 'JPEG', 15, 15, 20, 20);
              companyTextX = 40; // লোগো থাকলে কোম্পানির নাম ও এড্রেস ডান দিকে সরে যাবে
          }

          // ২. কোম্পানির ডিটেইলস (ডানদিকের উপরে সারিবদ্ধ)
          doc.setTextColor(15, 23, 42); // Deep Slate
          doc.setFont('Helvetica', 'bold');
          doc.setFontSize(13);
          doc.text(senderName, 195, 20, { align: 'right' });
          doc.setFont('Helvetica', 'normal');
          doc.setFontSize(9.5);
          doc.setTextColor(71, 85, 105);
          if (senderAddress) doc.text(senderAddress, 195, 25.5, { align: 'right' });
          if (senderContact) doc.text(senderContact, 195, 31, { align: 'right' });

          // উপরের বর্ডার লাইন
          doc.setDrawColor(200, 200, 200);
          doc.setLineWidth(0.4);
          doc.line(15, 38, 195, 38);

          // ৩. কোটেশন টাইটেল (ইমেজের মতো ফ্রেমড ডিজাইন)
          doc.setTextColor(15, 23, 42);
          doc.setFont('Helvetica', 'bold');
          doc.setFontSize(15);
          doc.text('QUOTATION', 105, 45, { align: 'center' });
          
          // টাইটেলের নিচের বর্ডার লাইন
          doc.line(15, 49, 195, 49);

          // ৪. লেফট কলাম: বিলিং এড্রেস (Billing Address)
          doc.setFontSize(10.5);
          doc.setFont('Helvetica', 'bold');
          doc.text('Billing Address', 15, 56);
          doc.text(clientName, 15, 62);
          doc.setFont('Helvetica', 'normal');
          doc.setTextColor(71, 85, 105);
          if (clientLocation) doc.text(clientLocation, 15, 67);

          // ৫. রাইট কলাম: কোটেশন মেটাডাটা টেবিল (Quotation Metadata)
          let metaY = 56;
          doc.setFontSize(9.5);
          doc.setTextColor(15, 23, 42);

          const drawMetaLine = (label, val) => {
              doc.setFont('Helvetica', 'bold');
              doc.text(label, 120, metaY);
              doc.setFont('Helvetica', 'normal');
              doc.text(val, 160, metaY);
              metaY += 5.5;
          };

          drawMetaLine('Quotation Number:', qNum);
          drawMetaLine('Quotation Date:', qDate);
          drawMetaLine('Due Date:', qDueDate);
          drawMetaLine('Payment Term:', qPayTerm);
          drawMetaLine('Payment Method:', qPayMethod);
          drawMetaLine('Salesperson:', qSalesperson);
          if (clientMobile) drawMetaLine('Customer Mobile:', clientMobile);

          // ৬. আইটেমস টেবিল হেডার (ইমেজের মতো স্পেশাল ৭ কলাম লেআউট)
          const tableStartY = Math.max(metaY + 6, 94);
          doc.setFillColor(241, 245, 249);
          doc.rect(15, tableStartY, 180, 8, 'F');
          
          doc.setFont('Helvetica', 'bold');
          doc.setTextColor(15, 23, 42);
          doc.setFontSize(9);
          
          doc.text('#', 17.5, tableStartY + 5);
          doc.text('Name', 25, tableStartY + 5);
          doc.text('Quantity', 105, tableStartY + 5, { align: 'center' });
          doc.text('Unit price', 125, tableStartY + 5, { align: 'right' });
          doc.text('Discount', 145, tableStartY + 5, { align: 'right' });
          doc.text('Subtotal', 168, tableStartY + 5, { align: 'right' });
          doc.text('Total', 192, tableStartY + 5, { align: 'right' });

          // ৭. আইটেমস লুপ রেন্ডারিং (লাইন ব্রেকিং সহ)
          let currentY = tableStartY + 13;
          let subtotal = 0;
          doc.setFont('Helvetica', 'normal');
          doc.setTextColor(51, 65, 85);

          rows.forEach((row, idx) => {
              const desc = row.querySelector('.q-item-desc').value.trim() || 'Custom Item';
              const qty = parseFloat(row.querySelector('.q-item-qty').value) || 0;
              const price = parseFloat(row.querySelector('.q-item-price').value) || 0;
              const discount = parseFloat(row.querySelector('.q-item-disc').value) || 0;
              
              const itemSubtotal = qty * price;
              const itemTotal = itemSubtotal - discount;
              subtotal += itemTotal;

              // প্রোডাক্টের দীর্ঘ নাম থাকলে তা স্বয়ংক্রিয়ভাবে লাইনে ভেঙে দেবে (Word Wrap)
              const splitName = doc.splitTextToSize(desc, 70);
              const nameLinesCount = splitName.length;
              const rowHeight = nameLinesCount * 5;

              doc.text((idx + 1).toString(), 17.5, currentY);
              doc.text(splitName, 25, currentY);
              doc.text(qty.toString(), 105, currentY, { align: 'center' });
              doc.text(price.toFixed(3), 125, currentY, { align: 'right' });
              doc.text(discount.toFixed(3), 145, currentY, { align: 'right' });
              doc.text(itemSubtotal.toFixed(3), 168, currentY, { align: 'right' });
              doc.text(itemTotal.toFixed(3), 192, currentY, { align: 'right' });

              // টেবিলের ভেতরের পাতলা বর্ডার আঁকবে
              doc.setDrawColor(241, 245, 249);
              doc.line(15, currentY + rowHeight - 2, 195, currentY + rowHeight - 2);

              currentY += rowHeight + 3;
          });

          // টেবিলের সীমানা ও ভার্টিকাল লাইন আঁকবে (ইমেজের ডিজাইনের মতো)
          const tableEndY = currentY - 3;
          doc.setDrawColor(200, 200, 200);
          doc.line(15, tableStartY, 195, tableStartY); // টপ লাইন
          doc.line(15, tableEndY, 195, tableEndY); // বটম লাইন
          
          // ভার্টিকাল লাইন কোঅর্ডিনেটস
          const drawVerticalLine = (x) => doc.line(x, tableStartY, x, tableEndY);
          drawVerticalLine(15);
          drawVerticalLine(22);
          drawVerticalLine(98);
          drawVerticalLine(112);
          drawVerticalLine(132);
          drawVerticalLine(152);
          drawVerticalLine(174);
          drawVerticalLine(195);

          // ৮. ফাইনান্সিয়াল সামারি ও গ্লোয়িং ব্ল্যাক টোটাল ডিউ বার
          let totalY = tableEndY + 8;
          const balanceDue = subtotal - paidAmount;

          doc.setFontSize(10);
          doc.setFont('Helvetica', 'bold');
          doc.setTextColor(15, 23, 42);
          
          doc.text('Subtotal', 150, totalY, { align: 'right' });
          doc.setFont('Helvetica', 'normal');
          doc.text(subtotal.toFixed(3) + ' ' + currency, 192, totalY, { align: 'right' });

          totalY += 6;
          doc.setFont('Helvetica', 'bold');
          doc.text('Total', 150, totalY, { align: 'right' });
          doc.setFont('Helvetica', 'normal');
          doc.text(subtotal.toFixed(3) + ' ' + currency, 192, totalY, { align: 'right' });

          totalY += 6;
          doc.setFont('Helvetica', 'bold');
          doc.text('Paid', 150, totalY, { align: 'right' });
          doc.setFont('Helvetica', 'normal');
          doc.text(paidAmount.toFixed(3) + ' ' + currency, 192, totalY, { align: 'right' });

          totalY += 6;
          doc.setFont('Helvetica', 'bold');
          doc.text('Balance due', 150, totalY, { align: 'right' });
          doc.setFont('Helvetica', 'normal');
          doc.text(balanceDue.toFixed(3) + ' ' + currency, 192, totalY, { align: 'right' });

          // বোল্ড কালো রঙের 'Total Due' বার (হুবহু ইমেজের ডিজাইন)
          totalY += 5;
          doc.setFillColor(15, 23, 42);
          doc.rect(130, totalY, 65, 8, 'F');
          doc.setTextColor(255, 255, 255);
          doc.setFont('Helvetica', 'bold');
          doc.text('Total Due', 150, totalY + 5.5, { align: 'right' });
          doc.text(balanceDue.toFixed(3) + ' ' + currency, 192, totalY + 5.5, { align: 'right' });

          // ৯. শর্তাবলী (Terms & Conditions - বামদিকের নিচে)
          let termsY = tableEndY + 8;
          doc.setTextColor(15, 23, 42);
          doc.setFont('Helvetica', 'bold');
          doc.setFontSize(9);
          
          const termsLines = termsText.split('\n');
          termsLines.forEach(line => {
              if (line.trim() !== '') {
                  // প্রতি লাইনে থাকা শর্তাবলী প্রিন্ট করবে
                  doc.text(line.trim(), 15, termsY);
                  termsY += 4.5;
              }
          });

          // ১০. কোটেশন ফুটার
          doc.setTextColor(15, 23, 42);
          doc.setFont('Helvetica', 'bold');
          doc.setFontSize(11);
          doc.text('Thank you for your business!', 105, 275, { align: 'center' });
          
          doc.setFont('Helvetica', 'normal');
          doc.setFontSize(9);
          doc.setTextColor(148, 163, 184);
          doc.text('Page 1 of 1', 195, 285, { align: 'right' });

          // ডাউনলোড অথবা সরাসরি প্রিন্টিং এক্সিকিউশন
          if (action === 'print') {
              statusEl.innerText = 'Opening print dialog...';
              doc.autoPrint();
              const pdfUrl = doc.output('bloburl');
              const printWindow = window.open(pdfUrl, '_blank');
              if (printWindow) {
                  printWindow.focus();
              }
              statusEl.innerHTML = '<span style="color: #10b981;"><i class="fa-solid fa-circle-check"></i> Print dialog opened!</span>';
          } else {
              statusEl.innerText = 'Saving quotation as PDF...';
              doc.save(`quotation_${qNum.replace('#', '')}.pdf`);
              statusEl.innerHTML = '<span style="color: #10b981;"><i class="fa-solid fa-circle-check"></i> Quotation generated successfully!</span>';
          }

          generateBtn.disabled = false;
          printBtn.disabled = false;

      } catch (err) {
          statusEl.innerText = 'Error generating PDF quotation';
          generateBtn.disabled = false;
          printBtn.disabled = false;
          console.error(err);
      }
  }

  // ফর্ম ক্লিয়ার লজিক (কোম্পানি ডেটা ও ডিফল্ট শর্তাবলী মুছবে না)
  function clearQuotationMakerForm() {
      document.getElementById('qClientName').value = '';
      document.getElementById('qClientLocation').value = '';
      document.getElementById('qClientMobile').value = '';
      document.getElementById('qNumber').value = '';
      document.getElementById('qPaid').value = '0.000';
      document.getElementById('qCurrency').value = 'BDT';
      document.getElementById('qPayTerm').value = '';
      document.getElementById('qPayMethod').value = '';
      document.getElementById('qSalesperson').value = '';

      const container = document.getElementById('quotationItemsList');
      container.innerHTML = '';
      addQuotationItemRow();

      loadSavedQuotationSender(); // কোম্পানির ডেটা রিলোড

      setupDefaultQDates();
      document.getElementById('quotationMakerStatus').innerText = 'Ready to generate';
      document.getElementById('qGenerateBtn').disabled = false;
      document.getElementById('qPrintBtn').disabled = false;
  }
;

let isInvLibrariesLoaded = false;
  let uploadedLogoData = null; // লোগো ইমেজের ডেটা স্টোর করার গ্লোবাল ভেরিয়েবল

  // মোডাল সচল ও অচল করার লজিক
  async function openInvoiceMakerModal() {
      document.getElementById('invoiceMakerModal').style.display = 'flex';
      setupDefaultDates();
      loadSavedSenderDetails(); // ১. কোম্পানির পূর্বে সেভ করা তথ্য লোড করবে
      
      // টেবিল খালি থাকলে অন্তত ১টি ডিফল্ট রো দিয়ে শুরু করবে
      const container = document.getElementById('invoiceItemsList');
      if (container.children.length === 0) {
          addInvoiceItemRow();
      }
      
      await initInvoiceMakerLibraries();
  }

  function closeInvoiceMakerModal() {
      document.getElementById('invoiceMakerModal').style.display = 'none';
      clearInvoiceMakerForm();
  }

  // স্ক্রিপ্ট ড্রাইভার লোডার
  function loadInvoiceScript(url) {
      return new Promise((resolve, reject) => {
          let script = document.createElement('script');
          script.src = url;
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
      });
  }

  // jsPDF লাইব্রেরি চেক ও লোড
  async function initInvoiceMakerLibraries() {
      if (isInvLibrariesLoaded) return;
      const statusEl = document.getElementById('invoiceMakerStatus');
      statusEl.innerText = 'Loading PDF engines, please wait...';
      try {
          if (typeof window.jspdf === 'undefined') {
              await loadInvoiceScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
          }
          isInvLibrariesLoaded = true;
          statusEl.innerText = 'Engines loaded. Ready to build invoice.';
      } catch (err) {
          statusEl.innerText = 'Failed to load PDF engine. Check internet.';
          console.error(err);
      }
  }

  // ২. কোম্পানির টেক্সট ডিটেইলস সেভ করার ফাংশন
  function saveSenderDetails() {
      localStorage.setItem('inv_sender_name', document.getElementById('invSenderName').value.trim());
      localStorage.setItem('inv_sender_contact', document.getElementById('invSenderContact').value.trim());
      localStorage.setItem('inv_sender_address', document.getElementById('invSenderAddress').value.trim());
  }

  // ৩. লোগো ইমেজ আপলোড ও লোকাল স্টোরেজে সেভ করার ফাংশন
  function handleLogoUpload(input) {
      const file = input.files[0];
      if (file) {
          if (!file.type.startsWith('image/')) {
              alert('Please select a valid image file (PNG/JPG) for the logo.');
              input.value = '';
              return;
          }
          const reader = new FileReader();
          reader.onload = function(e) {
              uploadedLogoData = e.target.result;
              document.getElementById('logoPreviewText').style.display = 'flex';
              localStorage.setItem('inv_logo_data', uploadedLogoData); // লোগো স্থায়ীভাবে স্টোরেজে সেভ হবে
          };
          reader.readAsDataURL(file);
      }
  }

  // ৪. পূর্বে সেভ করা কোম্পানির তথ্য লোড করার ফাংশন
  function loadSavedSenderDetails() {
      const name = localStorage.getItem('inv_sender_name');
      const contact = localStorage.getItem('inv_sender_contact');
      const address = localStorage.getItem('inv_sender_address');
      const logo = localStorage.getItem('inv_logo_data');

      if (name) document.getElementById('invSenderName').value = name;
      if (contact) document.getElementById('invSenderContact').value = contact;
      if (address) document.getElementById('invSenderAddress').value = address;
      if (logo) {
          uploadedLogoData = logo;
          document.getElementById('logoPreviewText').style.display = 'flex';
      }
  }

  // আজকের ডেট (Invoice Date) এবং ৭ দিন পরের ডেট (Due Date) স্বয়ংক্রিয় সেটআপ
  function setupDefaultDates() {
      const today = new Date();
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);

      const todayStr = today.toISOString().split('T')[0];
      const nextWeekStr = nextWeek.toISOString().split('T')[0];

      document.getElementById('invDate').value = todayStr;
      document.getElementById('invDueDate').value = nextWeekStr;
  }

  // ডাইনামিক নতুন আইটেম রো (Row) যুক্ত করার লজিক
  function addInvoiceItemRow() {
      const container = document.getElementById('invoiceItemsList');
      const rowId = 'row-' + Date.now();
      
      const rowHTML = `
        <div class="invoice-item-row" id="${rowId}">
          <div class="ip-setting-item" style="margin: 0;">
            <input type="text" class="item-desc" placeholder="Item Name / Description" required="required" />
          </div>
          <div class="ip-setting-item" style="margin: 0;">
            <input type="number" class="item-qty" value="1" min="1" oninput="calculateInvoiceTotals()" style="text-align: center;" required="required" />
          </div>
          <div class="ip-setting-item" style="margin: 0;">
            <input type="number" class="item-price" value="0.00" min="0" step="0.01" oninput="calculateInvoiceTotals()" style="text-align: center;" required="required" />
          </div>
          <button onclick="removeInvoiceItemRow('${rowId}')" style="background: transparent; border: none; color: #ef4444; font-size: 18px; cursor: pointer; padding: 5px 0;">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      `;
      
      container.insertAdjacentHTML('beforeend', rowHTML);
      calculateInvoiceTotals();
  }

  // আইটেম রো মুছে ফেলার লজিক
  function removeInvoiceItemRow(rowId) {
      const row = document.getElementById(rowId);
      if (row) {
          row.remove();
          calculateInvoiceTotals();
      }
  }

  // রিয়েল-টাইম কস্ট ক্যালকুলেশন
  function calculateInvoiceTotals() {
      const rows = document.querySelectorAll('.invoice-item-row');
      const currency = document.getElementById('invCurrency').value || 'BDT';
      let subtotal = 0;

      rows.forEach(row => {
          const qty = parseFloat(row.querySelector('.item-qty').value) || 0;
          const price = parseFloat(row.querySelector('.item-price').value) || 0;
          subtotal += (qty * price);
      });

      const taxPct = parseFloat(document.getElementById('invTax').value) || 0;
      const discPct = parseFloat(document.getElementById('invDiscount').value) || 0;

      const taxAmount = subtotal * (taxPct / 100);
      const discAmount = subtotal * (discPct / 100);
      const grandTotal = subtotal + taxAmount - discAmount;

      document.getElementById('invLiveTotalText').innerText = grandTotal.toFixed(2) + ' ' + currency;
  }

  // ইনভয়েস জেনারেশন ও এ৪ পিডিএফ ডাউনলোড/প্রিন্ট লজিক
  async function startInvoiceGeneration(action) {
      const statusEl = document.getElementById('invoiceMakerStatus');
      const generateBtn = document.getElementById('invGenerateBtn');
      const printBtn = document.getElementById('invPrintBtn');

      // ইনপুট ভ্যালিডেশন
      const senderName = document.getElementById('invSenderName').value.trim();
      const clientName = document.getElementById('invClientName').value.trim();
      const invNum = document.getElementById('invNumber').value.trim() || '#INV-1001';

      if (!senderName || !clientName) {
          alert('Please fill in both Company Name and Client Name.');
          return;
      }

      const rows = document.querySelectorAll('.invoice-item-row');
      if (rows.length === 0) {
          alert('Please add at least one item to generate an invoice.');
          return;
      }

      statusEl.innerText = 'Assembling professional PDF layout...';
      generateBtn.disabled = true;
      printBtn.disabled = true;

      try {
          await initInvoiceMakerLibraries();
          const { jsPDF } = window.jspdf;
          
          // স্ট্যান্ডার্ড A4 সাইজ (210 x 297 mm) ডক
          const doc = new jsPDF('p', 'mm', 'a4');
          
          // ভেরিয়েবল ডাটা সংগ্রহ
          const senderContact = document.getElementById('invSenderContact').value.trim();
          const senderAddress = document.getElementById('invSenderAddress').value.trim();
          const clientContact = document.getElementById('invClientContact').value.trim();
          const clientAddress = document.getElementById('invClientAddress').value.trim();
          const invDate = document.getElementById('invDate').value;
          const invDueDate = document.getElementById('invDueDate').value;
          const currency = document.getElementById('invCurrency').value || 'BDT';
          const taxPct = parseFloat(document.getElementById('invTax').value) || 0;
          const discPct = parseFloat(document.getElementById('invDiscount').value) || 0;

          // ১. হেডার ব্রান্ডিং ও ইনভয়েস টাইটেল
          doc.setTextColor(15, 23, 42); // Deep Slate
          doc.setFont('Helvetica', 'bold');
          doc.setFontSize(22);
          doc.text('INVOICE', 195, 25, { align: 'right' });

          // ২. লগো ড্রয়িং লজিক (আপলোড হয়ে থাকলে বামদিকের উপরে বসবে)
          let companyTextX = 15;
          if (uploadedLogoData) {
              doc.addImage(uploadedLogoData, 'JPEG', 15, 15, 20, 20);
              companyTextX = 40; // লোগো থাকলে কোম্পানির নাম ও এড্রেস ডানে সরে যাবে
          }

          // ৩. সেন্ডার ডিটেইলস (My Company)
          doc.setFontSize(14);
          doc.text(senderName, companyTextX, 24);
          doc.setFont('Helvetica', 'normal');
          doc.setFontSize(9.5);
          doc.setTextColor(71, 85, 105);
          if (senderContact) doc.text(senderContact, companyTextX, 30);
          if (senderAddress) doc.text(senderAddress, companyTextX, 36);

          // হেডার সেপারেটর লাইন
          doc.setDrawColor(226, 232, 240);
          doc.line(15, 43, 195, 43);

          // ৪. ইনভয়েস মেটাডাটা
          doc.setTextColor(15, 23, 42);
          doc.setFont('Helvetica', 'bold');
          doc.text('Invoice No:', 15, 52);
          doc.setFont('Helvetica', 'normal');
          doc.text(invNum, 40, 52);

          doc.setFont('Helvetica', 'bold');
          doc.text('Invoice Date:', 15, 58);
          doc.setFont('Helvetica', 'normal');
          doc.text(invDate, 40, 58);

          doc.setFont('Helvetica', 'bold');
          doc.text('Due Date:', 15, 64);
          doc.setFont('Helvetica', 'normal');
          doc.text(invDueDate, 40, 64);

          // ৫. ক্লায়েন্ট ডিটেইলস (BILL TO)
          doc.setFont('Helvetica', 'bold');
          doc.text('BILL TO:', 115, 52);
          doc.text(clientName, 115, 58);
          doc.setFont('Helvetica', 'normal');
          doc.setTextColor(71, 85, 105);
          if (clientContact) doc.text(clientContact, 115, 64);
          if (clientAddress) doc.text(clientAddress, 115, 70);

          // ६. আইটেমস টেবিল হেডার
          doc.setFillColor(241, 245, 249);
          doc.rect(15, 80, 180, 8, 'F');
          doc.setFont('Helvetica', 'bold');
          doc.setTextColor(15, 23, 42);
          doc.setFontSize(10);
          doc.text('Item Description', 18, 85);
          doc.text('Qty', 120, 85, { align: 'center' });
          doc.text('Unit Price', 150, 85, { align: 'right' });
          doc.text('Total', 192, 85, { align: 'right' });

          // ৭. আইটেমস লুপ রেন্ডারিং
          let currentY = 94;
          let subtotal = 0;

          doc.setFont('Helvetica', 'normal');
          doc.setTextColor(51, 65, 85);

          rows.forEach(row => {
              const desc = row.querySelector('.item-desc').value.trim() || 'Custom Item';
              const qty = parseFloat(row.querySelector('.item-qty').value) || 0;
              const price = parseFloat(row.querySelector('.item-price').value) || 0;
              const itemTotal = qty * price;
              subtotal += itemTotal;

              doc.text(desc, 18, currentY);
              doc.text(qty.toString(), 120, currentY, { align: 'center' });
              doc.text(price.toFixed(2), 150, currentY, { align: 'right' });
              doc.text(itemTotal.toFixed(2), 192, currentY, { align: 'right' });

              doc.setDrawColor(241, 245, 249);
              doc.line(15, currentY + 3, 195, currentY + 3);
              
              currentY += 8;
          });

          // ৮. টোটাল সামারি বক্স রেন্ডার
          currentY += 5;
          const taxAmount = subtotal * (taxPct / 100);
          const discAmount = subtotal * (discPct / 100);
          const grandTotal = subtotal + taxAmount - discAmount;

          doc.setFontSize(10);
          doc.setFont('Helvetica', 'bold');
          doc.text('Subtotal:', 150, currentY, { align: 'right' });
          doc.setFont('Helvetica', 'normal');
          doc.text(subtotal.toFixed(2) + ' ' + currency, 192, currentY, { align: 'right' });

          currentY += 6;
          doc.setFont('Helvetica', 'bold');
          doc.text(`Tax (${taxPct}%):`, 150, currentY, { align: 'right' });
          doc.setFont('Helvetica', 'normal');
          doc.text(taxAmount.toFixed(2) + ' ' + currency, 192, currentY, { align: 'right' });

          currentY += 6;
          doc.setFont('Helvetica', 'bold');
          doc.text(`Discount (${discPct}%):`, 150, currentY, { align: 'right' });
          doc.setFont('Helvetica', 'normal');
          doc.text(discAmount.toFixed(2) + ' ' + currency, 192, currentY, { align: 'right' });

          // গ্র্যান্ড টোটাল ডার্ক প্যানেল
          currentY += 5;
          doc.setFillColor(15, 23, 42);
          doc.rect(110, currentY, 85, 10, 'F');
          
          doc.setTextColor(255, 255, 255);
          doc.setFont('Helvetica', 'bold');
          doc.text('Grand Total:', 145, currentY + 6.5, { align: 'right' });
          doc.text(grandTotal.toFixed(2) + ' ' + currency, 192, currentY + 6.5, { align: 'right' });

          // ৯. ইনভয়েস ফুটার
          doc.setTextColor(148, 163, 184);
          doc.setFont('Helvetica', 'normal');
          doc.setFontSize(9);
          doc.text('Thank you for your business!', 105, 275, { align: 'center' });
          doc.text('If you have any questions, please contact us.', 105, 280, { align: 'center' });

          // ১০. অ্যাকশন এক্সিকিউশন (ডাউনলোড অথবা ডিরেক্ট প্রিন্ট)
          if (action === 'print') {
              statusEl.innerText = 'Opening browser print dialog...';
              doc.autoPrint(); // অটো-প্রিন্ট ইনস্ট্রাকশন এড করবে
              const pdfUrl = doc.output('bloburl'); // ডাইনামিক ব্লব ইউআরএল জেনারেট করবে
              const printWindow = window.open(pdfUrl, '_blank');
              if (printWindow) {
                  printWindow.focus();
              }
              statusEl.innerHTML = '<span style="color: #10b981;"><i class="fa-solid fa-circle-check"></i> Print dialog opened!</span>';
          } else {
              statusEl.innerText = 'Saving invoice as PDF...';
              doc.save(`invoice_${invNum.replace('#', '')}.pdf`);
              statusEl.innerHTML = '<span style="color: #10b981;"><i class="fa-solid fa-circle-check"></i> Invoice generated successfully!</span>';
          }
          
          generateBtn.disabled = false;
          printBtn.disabled = false;

      } catch (err) {
          statusEl.innerText = 'Error generating PDF invoice';
          generateBtn.disabled = false;
          printBtn.disabled = false;
          console.error(err);
      }
  }

  // ৫. স্মার্ট ক্লিয়ার ফর্ম লজিক (কোম্পানির তথ্য ও সেভ করা লোগো মুছবে না)
  function clearInvoiceMakerForm() {
      // ক্লায়েন্ট এবং অন্যান্য পরিবর্তনশীল ডেটা মুছে যাবে [1.1.2]
      document.getElementById('invClientName').value = '';
      document.getElementById('invClientContact').value = '';
      document.getElementById('invClientAddress').value = '';
      document.getElementById('invNumber').value = '';
      document.getElementById('invTax').value = '0';
      document.getElementById('invDiscount').value = '0';
      document.getElementById('invCurrency').value = 'BDT';

      // আইটেম টেবিল সম্পূর্ণ খালি করে রি-ইনিশিয়ালাইজ করবে
      const container = document.getElementById('invoiceItemsList');
      container.innerHTML = '';
      addInvoiceItemRow();

      // কোম্পানির তথ্য রিলোড করবে (মুছে যাওয়া প্রতিরোধ করতে) [1.1.2]
      loadSavedSenderDetails();

      setupDefaultDates();
      document.getElementById('invoiceMakerStatus').innerText = 'Ready to generate';
      document.getElementById('invGenerateBtn').disabled = false;
      document.getElementById('invPrintBtn').disabled = false;
  }
;

let uploadedPcoFile = null;
  let isPcoLibrariesLoaded = false;

  // মোডাল ওপেন ও ক্লোজ করার ফাংশন
  async function openPcoCompressModal() {
      document.getElementById('pcoCompressModal').style.display = 'flex';
      await initPcoLibraries();
  }
  
  function closePcoCompressModal() {
      document.getElementById('pcoCompressModal').style.display = 'none';
      clearPcoCompressTool();
  }

  // লাইব্রেরি ডাইনামিক লোড করার হেল্পার ফাংশন
  function loadPcoScript(url) {
      return new Promise((resolve, reject) => {
          let script = document.createElement('script');
          script.src = url;
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
      });
  }

  // ইঞ্জিন ইনিশিয়ালাইজেশন
  async function initPcoLibraries() {
      if (isPcoLibrariesLoaded) return;
      const statusEl = document.getElementById('pcoCompressStatus');
      statusEl.innerText = 'Loading engines, please wait...';
      try {
          if (typeof pdfjsLib === 'undefined') {
              await loadPcoScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js');
          }
          pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
          
          if (typeof window.jspdf === 'undefined') {
              await loadPcoScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
          }
          isPcoLibrariesLoaded = true;
          statusEl.innerText = 'Engines loaded. Ready to compress.';
      } catch (err) {
          statusEl.innerText = 'Engine load failed. Check internet.';
          console.error(err);
      }
  }

  // ফাইল সাইজ ফর্ম্যাটিং হেল্পার
  function formatPcoFileSize(bytes) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // স্ট্যাটাস বার ক্লিয়ারেন্স
  function clearPcoStatus() {
      if (uploadedPcoFile) {
          document.getElementById('pcoCompressStatus').innerText = 'Ready to compress';
      }
  }

  // ড্র্যাগ অ্যান্ড ড্রপ লজিক সক্রিয়করণ
  const pcoDropZone = document.getElementById('pcoDropZone');
  const pcoInput = document.getElementById('pcoCompressFileInput');

  if (pcoDropZone && pcoInput) {
      pcoDropZone.addEventListener('dragover', (e) => {
          e.preventDefault();
          pcoDropZone.style.borderColor = '#4f46e5';
          pcoDropZone.style.background = '#f5f3ff';
      });

      pcoDropZone.addEventListener('dragleave', () => {
          pcoDropZone.style.borderColor = '';
          pcoDropZone.style.background = '';
      });

      pcoDropZone.addEventListener('drop', (e) => {
          e.preventDefault();
          pcoDropZone.style.borderColor = '';
          pcoDropZone.style.background = '';
          if (e.dataTransfer.files.length > 0) {
              handlePcoFile(e.dataTransfer.files[0]);
          }
      });

      pcoInput.addEventListener('change', (e) => {
          if (e.target.files.length > 0) {
              handlePcoFile(e.target.files[0]);
          }
      });
  }

  // ফাইল সিলেকশন হ্যান্ডেল
  async function handlePcoFile(file) {
      if (file.type !== 'application/pdf') {
          alert('Please upload only a valid PDF (.pdf) file.');
          return;
      }
      uploadedPcoFile = file;
      document.getElementById('pcoCompressFileName').innerText = file.name;
      document.getElementById('pcoCompressStatus').innerText = 'File loaded successfully';

      const metaText = document.getElementById('pcoMetaText');
      metaText.innerHTML = `
        <div style="color: #1e293b; font-weight: 700; margin-bottom: 5px; word-break: break-all;">File Name: ${file.name}</div>
        <div style="color: #4b5563;">Original Size: <strong style="color: #ef4444;">${formatPcoFileSize(file.size)}</strong></div>
        <div id="pcoPageCountText" style="color: #64748b; font-size: 13px; margin-top: 5px;"><i class="fa-solid fa-spinner fa-spin"></i> Reading pages...</div>
      `;

      try {
          await initPcoLibraries();
          const fileReader = new FileReader();
          fileReader.onload = function() {
              const typedarray = new Uint8Array(this.result);
              pdfjsLib.getDocument({ data: typedarray }).promise.then(function(pdf) {
                  const pageText = document.getElementById('pcoPageCountText');
                  if (pageText) {
                      pageText.innerHTML = `<i class="fa-solid fa-file-lines"></i> Total Pages: <strong>${pdf.numPages}</strong>`;
                  }
              });
          };
          fileReader.readAsArrayBuffer(file);
      } catch (err) {
          console.log('Error reading PDF pages');
      }
  }

  // কম্প্রেশন শুরু করার মেইন লজিক
  async function startPcoCompression() {
      if (!uploadedPcoFile) {
          alert('Please upload a PDF file first.');
          return;
      }

      const statusEl = document.getElementById('pcoCompressStatus');
      const compressBtn = document.getElementById('pcoCompressBtn');
      const compLevel = document.getElementById('pcoCompressLevel').value;

      statusEl.innerText = 'Preparing compression engines...';
      compressBtn.disabled = true;

      try {
          await initPcoLibraries();

          const fileReader = new FileReader();
          fileReader.onload = async function() {
              const typedarray = new Uint8Array(this.result);
              
              try {
                  const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
                  const totalPages = pdf.numPages;
                  const { jsPDF } = window.jspdf;
                  let doc = null;
                  
                  // ৬টি ডাইনামিক কম্প্রেশন কোয়ালিটি ও স্কেল ম্যাপিং
                  let currentScale = 1.0;
                  let currentQuality = 0.5;

                  if (compLevel === 'ultra') {
                      currentScale = 2.0;
                      currentQuality = 1.0;
                  } else if (compLevel === 'high') {
                      currentScale = 1.5;
                      currentQuality = 0.85;
                  } else if (compLevel === 'medium_high') {
                      currentScale = 1.2;
                      currentQuality = 0.7;
                  } else if (compLevel === 'medium') {
                      currentScale = 1.0;
                      currentQuality = 0.5;
                  } else if (compLevel === 'medium_low') {
                      currentScale = 0.85;
                      currentQuality = 0.4;
                  } else if (compLevel === 'extreme') {
                      currentScale = 0.65;
                      currentQuality = 0.25;
                  }

                  // প্রতিটি পেজ প্রসেস করবে
                  for (let i = 1; i <= totalPages; i++) {
                      statusEl.innerText = `Compressing Page ${i} of ${totalPages}...`;
                      
                      const page = await pdf.getPage(i);
                      const viewport = page.getViewport({ scale: currentScale });
                      
                      // অফ-স্ক্রিন ক্যানভাস তৈরি
                      const canvas = document.createElement('canvas');
                      const context = canvas.getContext('2d');
                      canvas.height = viewport.height;
                      canvas.width = viewport.width;

                      const renderContext = {
                          canvasContext: context,
                          viewport: viewport
                      };

                      await page.render(renderContext).promise;

                      // জেপিজি কম্প্রেশন রেন্ডার
                      const imgData = canvas.toDataURL('image/jpeg', currentQuality);

                      // নতুন পিডিএফে পেজ যুক্ত করা (px ইউনিট ডাইমেনশন ফিক্স)
                      if (i === 1) {
                          doc = new jsPDF({
                              orientation: viewport.width > viewport.height ? 'l' : 'p',
                              unit: 'px',
                              format: [viewport.width, viewport.height]
                          });
                      } else {
                          doc.addPage([viewport.width, viewport.height], viewport.width > viewport.height ? 'l' : 'p');
                      }
                      
                      doc.addImage(imgData, 'JPEG', 0, 0, viewport.width, viewport.height);
                  }

                  statusEl.innerText = 'Saving compressed file...';
                  
                  // আউটপুট ফাইল জেনারেট করবে
                  const compressedPdfBlob = doc.output('blob');
                  const compressedSize = compressedPdfBlob.size;

                  // ডাউনলোড ট্রিগার
                  const downloadUrl = URL.createObjectURL(compressedPdfBlob);
                  const a = document.createElement('a');
                  a.href = downloadUrl;
                  a.download = `compressed_${uploadedPcoFile.name}`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);

                  statusEl.innerHTML = `<span style="color: #10b981;"><i class="fa-solid fa-circle-check"></i> Success! New Size: ~${formatPcoFileSize(compressedSize)}</span>`;
                  compressBtn.disabled = false;

              } catch (e) {
                  statusEl.innerText = 'Error processing document';
                  compressBtn.disabled = false;
                  console.error(e);
              }
          };
          fileReader.readAsArrayBuffer(uploadedPcoFile);

      } catch (err) {
          statusEl.innerText = 'Failed to load engines';
          compressBtn.disabled = false;
      }
  }

  // রিসেট লজিক
  function clearPcoCompressTool() {
      uploadedPcoFile = null;
      document.getElementById('pcoCompressFileInput').value = '';
      document.getElementById('pcoCompressFileName').innerText = 'Select or Drag PDF File';
      document.getElementById('pcoMetaText').innerText = 'No PDF selected yet.';
      document.getElementById('pcoCompressStatus').innerText = 'Ready to compress';
      document.getElementById('pcoCompressBtn').disabled = false;
  }
;

// মোডাল ওপেন ও ক্লোজ লজিক
  function openWaFormatterModal() {
      document.getElementById('waFormatterModal').style.display = 'flex';
      setupDefaultWaTime();
  }

  function closeWaFormatterModal() {
      document.getElementById('waFormatterModal').style.display = 'none';
      clearWaFormatterForm();
  }

  // হোয়াটসঅ্যাপ চ্যাট বাবলের জন্য রিয়েল-টাইম কাস্টম টাইম সেটাপ
  function setupDefaultWaTime() {
      const now = new Date();
      let hours = now.getHours();
      let minutes = now.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      minutes = minutes < 10 ? '0' + minutes : minutes;
      const strTime = hours + ':' + minutes + ' ' + ampm;
      
      const timeEl = document.getElementById('waFormatterTime');
      if (timeEl) timeEl.innerText = strTime;
  }

  // টুলবার থেকে এডিটর ফরম্যাটিং ইনজেক্ট লজিক (সিলেকশন প্রিজার্ভেশন সহ)
  function insertWaFormat(tag) {
      const textarea = document.getElementById('waFormatterInput');
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const selectedText = text.substring(start, end);
      
      let replacement = '';
      if (tag === 'bold') replacement = `*${selectedText || 'bold text'}*`;
      else if (tag === 'italic') replacement = `_${selectedText || 'italic text'}_`;
      else if (tag === 'strike') replacement = `~${selectedText || 'strikethrough text'}~`;
      else if (tag === 'code') replacement = `\`${selectedText || 'monospace text'}\``;
      else if (tag === 'bullet') replacement = `\n- ${selectedText || 'list item'}`;
      else if (tag === 'number') replacement = `\n1. ${selectedText || 'list item'}`;
      else if (tag === 'quote') replacement = `\n> ${selectedText || 'quoted text'}`;
      else if (tag === 'codeblock') replacement = `\n\`\`\`\n${selectedText || 'code block'}\n\`\`\``;

      textarea.value = text.substring(0, start) + replacement + text.substring(end);
      textarea.focus();
      
      // কার্সার পুনরায় টেক্সট ফোকাসে নিয়ে যাবে
      const selectionOffset = selectedText ? replacement.length : replacement.length - 1;
      textarea.setSelectionRange(start + 1, start + selectionOffset - 1);
      
      updateWaFormatterPreview();
  }

  // লাইভ বাবল প্রিভিউ পার্সার (৮টি আলাদা ক্যাটাগরি সাপোর্ট করবে)
  function updateWaFormatterPreview() {
      const input = document.getElementById('waFormatterInput').value;
      
      // ১. সিকিউরিটির জন্য এইচটিএমএল ট্যাগ এস্কেপিং
      let escaped = input
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
      
      // ২. লাইন-বাই-লাইন ফিচারের জন্য পার্সিং (লিস্ট, কোটেশন)
      let lines = escaped.split('\n');
      let parsedLines = lines.map(line => {
          let trimmed = line.trim();
          
          // ব্লককোট বা উক্তি (শুরুতে '>' থাকলে) [1.1.2]
          if (trimmed.startsWith('&gt;')) {
              return `<blockquote style="border-left: 3px solid #10b981; padding-left: 10px; margin: 5px 0; color: #475569; font-style: italic;">${trimmed.substring(4).trim()}</blockquote>`;
          }
          // বুলেট পয়েন্ট লিস্ট (শুরুতে '-' থাকলে) [1.1.2]
          if (trimmed.startsWith('-')) {
              return `<span style="padding-left: 10px; display: inline-block;">• ${trimmed.substring(1).trim()}</span>`;
          }
          // সংখ্যাযুক্ত লিস্ট (শুরুতে সংখ্যা ও ডট থাকলে, যেমন: 1.) [1.1.2]
          if (/^\d+\./.test(trimmed)) {
              return `<span style="padding-left: 10px; display: inline-block;">${trimmed}</span>`;
          }
          return line;
      });
      
      let processedText = parsedLines.join('\n');
      
      // ৩. ইনলাইন ফরম্যাটিং পার্সিং (বোল্ড, ইটালিক, কোড ব্লক)
      let html = processedText
          .replace(/\*(.*?)\*/g, '<strong>$1</strong>')
          .replace(/_(.*?)_/g, '<em>$1</em>')
          .replace(/~(.*?)~/g, '<del>$1</del>')
          .replace(/```([\s\S]*?)```/g, '<pre style="background: rgba(0,0,0,0.05); padding: 8px; border-radius: 6px; font-family: monospace; white-space: pre-wrap; margin: 5px 0; text-align: left;">$1</pre>')
          .replace(/`(.*?)`/g, '<code>$1</code>')
          .replace(/\n/g, '<br/>');

      const previewContainer = document.getElementById('waFormatterPreview');
      if (html.trim() !== "") {
          previewContainer.innerHTML = html;
      } else {
          previewContainer.innerHTML = '<span style="color: #667781; font-style: italic;">Your formatted message preview will show here...</span>';
      }
  }

  // সরাসরি ইনপুট নম্বর বা ডিরেক্ট হোয়াটসঅ্যাপে মেসেজ পাঠানো
  function sendDirectWaFormatted() {
      const text = document.getElementById('waFormatterInput').value.trim();
      let phone = document.getElementById('waFormatterPhone').value.trim().replace(/\+/g, '').replace(/[\s-]/g, '');

      if (!text) {
          alert('Please write some text to send.');
          return;
      }

      const encodedText = encodeURIComponent(text);
      const waUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encodedText}`;
      window.open(waUrl, '_blank').focus();
  }

  // ক্লিপবোর্ডে কপি করা
  function copyFormattedWaText() {
      const text = document.getElementById('waFormatterInput').value.trim();
      const btn = document.getElementById('waFormatterCopyBtn');
      const statusEl = document.getElementById('waFormatterStatus');

      if (!text) {
          alert('There is no text to copy.');
          return;
      }

      if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(text).then(() => {
              showWaCopySuccess(btn, statusEl);
          }).catch(() => {
              fallbackWaCopy(btn, statusEl, text);
          });
      } else {
          fallbackWaCopy(btn, statusEl, text);
      }
  }

  // ওল্ডার ব্রাউজার ফ্যালব্যাক কপি লজিক
  function fallbackWaCopy(btn, statusEl, text) {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
          document.execCommand('copy');
          showWaCopySuccess(btn, statusEl);
      } catch (err) {
          statusEl.innerText = 'Failed to copy text';
      }
      document.body.removeChild(textArea);
  }

  // কপি বাটন সাকসেস এনিমেশন
  function showWaCopySuccess(btn, statusEl) {
      const originalHTML = '<i class="fa-regular fa-copy"></i> Copy Formatted Text';
      btn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Copied!';
      btn.style.background = '#10b981'; // সাকসেস গ্রিন
      statusEl.innerHTML = '<span style="color: #10b981;"><i class="fa-solid fa-circle-check"></i> Formatted text copied successfully!</span>';

      setTimeout(() => {
          btn.innerHTML = originalHTML;
          btn.style.background = '';
          statusEl.innerText = 'Ready to format & share';
      }, 2000);
  }

  //Form Reset Logic
  function clearWaFormatterForm() {
      document.getElementById('waFormatterInput').value = '';
      document.getElementById('waFormatterPhone').value = '';
      document.getElementById('waFormatterStatus').innerText = 'Ready to format & share';
      updateWaFormatterPreview();
      setupDefaultWaTime();
  }
//# sourceMappingURL=/sm/9ba4044c92c28f9a01ad3b5b22c79f055f44bfbfee0fbd6c04e34daec061f565.map
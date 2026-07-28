/**
 * Combined by jsDelivr.
 * Original files:
 * - /gh/monirkarimbd-web/scanner@main/imgkb.js
 * - /gh/monirkarimbd-web/scanner@main/ppl.js
 * - /gh/monirkarimbd-web/scanner@main/letter.js
 * - /gh/monirkarimbd-web/scanner@main/njpro.js
 * - /gh/monirkarimbd-web/scanner@main/photonda.js
 * - /gh/monirkarimbd-web/scanner@main/studentid.js
 * - /gh/monirkarimbd-web/scanner@main/search.js
 * - /gh/monirkarimbd-web/scanner@main/biodata.js
 * - /gh/monirkarimbd-web/scanner@main/translator-eb.js
 * - /gh/monirkarimbd-web/scanner@main/hwconverter.js
 * - /gh/monirkarimbd-web/scanner@main/multi-Imgpdfff.js
 * - /gh/monirkarimbd-web/scanner@main/psphotosheetj.js
 * - /gh/monirkarimbd-web/scanner@main/signpad.js
 * - /gh/monirkarimbd-web/scanner@main/noticee.js
 * - /gh/monirkarimbd-web/scanner@main/leaflett.js
 * - /gh/monirkarimbd-web/scanner@main/land.js
 * - /gh/monirkarimbd-web/scanner@main/omr.js
 * - /gh/monirkarimbd-web/scanner@main/affidavit.js
 * - /gh/monirkarimbd-web/scanner@main/job.js
 * - /gh/monirkarimbd-web/scanner@main/onseba.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
let compOriginalImg = null;
let compressedResultData = null;

function openCompressorModal() {
    document.getElementById('compressorModal').style.display = 'flex';
    if(typeof setActiveMode === 'function') setActiveMode('mode-compressor');
}

function closeCompressorModal() {
    document.getElementById('compressorModal').style.display = 'none';
    resetCompressor(); // ক্লোজ করার সময় সব ক্লিয়ার হবে
}

// ফাইল হ্যান্ডলার
function handleCompFile(file) {
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
            compOriginalImg = img;
            document.getElementById('comp-orig-preview').src = img.src;
            document.getElementById('orig-size').innerText = "Original: " + (file.size / 1024).toFixed(2) + " KB";
            
            // UI কন্ট্রোল দেখানো
            document.getElementById('comp-upload-area').style.display = 'none';
            document.getElementById('comp-controls').style.display = 'flex';
        };
    };
    reader.readAsDataURL(file);
}

// কমপ্রেশন লজিক (শুধুমাত্র কোয়ালিটি অ্যাডজাস্ট করবে)
async function processCompression() {
    if (!compOriginalImg) return;
    
    const targetKB = parseFloat(document.getElementById('target-kb').value);
    const loader = document.getElementById('comp-loader');
    const preview = document.getElementById('comp-result-preview');
    const resultSizeLabel = document.getElementById('result-size');
    const dlBtn = document.getElementById('btn-comp-dl');

    loader.style.display = 'flex';
    preview.style.display = 'none';

    // অরিজিনাল রেজোলিউশনে ক্যানভাস তৈরি
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = compOriginalImg.width;
    canvas.height = compOriginalImg.height;
    ctx.drawImage(compOriginalImg, 0, 0);

    let quality = 0.92;
    let dataUrl = "";
    let sizeKB = 0;

    // ইটারেটিভ লুপ চালিয়ে সঠিক কেবি খোঁজা (ম্যাক্স ১৫ বার ট্রাই করবে)
    for (let i = 0; i < 15; i++) {
        dataUrl = canvas.toDataURL("image/jpeg", quality);
        // Base64 থেকে আনুমানিক ফাইল সাইজ বের করা
        sizeKB = Math.round((dataUrl.length * 3 / 4) / 1024);
        
        if (sizeKB <= targetKB) break;
        quality -= 0.08; // প্রতিবার ৮% কোয়ালিটি কমবে
        if (quality < 0.1) break;
    }

    // প্রিভিউ আপডেট
    preview.src = dataUrl;
    preview.style.display = 'inline-block';
    loader.style.display = 'none';
    resultSizeLabel.innerText = "Compressed: " + sizeKB + " KB";
    
    // যদি টার্গেট পূরণ না হয় তবে লাল রঙ দেখাবে
    resultSizeLabel.style.color = (sizeKB <= targetKB) ? "#059669" : "#ef4444";
    
    compressedResultData = dataUrl;
    dlBtn.disabled = false;
}

// ডাউনলোড ফাংশন
function downloadCompressedImg() {
    if (!compressedResultData) return;
    const link = document.createElement('a');
    link.href = compressedResultData;
    link.download = "Compressed_by_IDScannerPro.jpg";
    link.click();
}

// ডিলিট/রিসেট ফাংশন
function resetCompressor() {
    document.getElementById('comp-upload-area').style.display = 'flex';
    document.getElementById('comp-controls').style.display = 'none';
    document.getElementById('comp-input').value = "";
    document.getElementById('comp-orig-preview').src = "";
    document.getElementById('comp-result-preview').src = "";
    document.getElementById('btn-comp-dl').disabled = true;
    document.getElementById('result-size').innerText = "Size: 0 KB";
}
;

let gridBaseImg = null;

// আপনার ওয়েবসাইটের ডিফল্ট কাস্টম পপআপ ফাংশন
function triggerAlert(msg) {
    const popup = document.getElementById('customPopup');
    const msgEl = document.getElementById('popupMessage');
    if (popup && msgEl) {
        msgEl.innerText = msg;
        popup.classList.add('active');
    } else {
        alert(msg);
    }
}

function openGridModal() {
    document.getElementById('gridModal').style.display = 'flex';
    if(typeof setActiveMode === 'function') setActiveMode('mode-photo-grid');
}

function closeGridModal() { 
    document.getElementById('gridModal').style.display = 'none'; 
}

// ছবি আপলোড
function handleGridUpload(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            gridBaseImg = e.target.result;
            document.getElementById('grid-count-val').value = 1;
            renderPhotoGrid(true);
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// প্লাস-মাইনাস বাটন লজিক
function changeGridCount(val) {
    if (!gridBaseImg) { 
        triggerAlert("Please upload a photo first!"); 
        return; 
    }
    
    let input = document.getElementById('grid-count-val');
    let container = document.getElementById('photo-grid-render');
    let pageBox = document.getElementById('grid-page-unit');
    let current = parseInt(input.value);
    
    if (val === 1) {
        const sizeData = document.getElementById('grid-photo-size').value.split(',');
        const wPx = parseFloat(sizeData[0]) * 96;
        const hPx = parseFloat(sizeData[1]) * 96;

        const item = document.createElement('div');
        item.className = 'grid-photo-item';
        item.style.width = wPx + "px";
        item.style.height = hPx + "px";
        item.innerHTML = `<img src="${gridBaseImg}" />`;
        
        container.appendChild(item);

        // কাট-অফ চেক: ছবি নিচে কেটে যাচ্ছে কি না
        const containerRect = container.getBoundingClientRect();
        const itemRect = item.getBoundingClientRect();

        if (itemRect.bottom > containerRect.bottom + 2) {
            container.removeChild(item); 
            triggerAlert("Limit Reached! Adding this photo would cut it off at the bottom.");
        } else {
            input.value = current + 1;
        }
    } else {
        if (current > 0) {
            if (container.lastChild) container.removeChild(container.lastChild);
            input.value = current - 1;
        }
    }
}

function renderPhotoGrid(forceAll = false) {
    const container = document.getElementById('photo-grid-render');
    const countInput = document.getElementById('grid-count-val');
    const sizeData = document.getElementById('grid-photo-size').value.split(',');
    
    if (!gridBaseImg) {
        container.innerHTML = `<div style="padding: 100px 0; color: #94a3b8; width:100%; text-align:center; font-weight:700;">Upload a photo to see the layout</div>`;
        return;
    }

    if (forceAll) {
        container.innerHTML = '';
        let count = parseInt(countInput.value);
        const wPx = parseFloat(sizeData[0]) * 96;
        const hPx = parseFloat(sizeData[1]) * 96;
        for (let i = 0; i < count; i++) {
            const item = document.createElement('div');
            item.className = 'grid-photo-item';
            item.style.width = wPx + "px";
            item.style.height = hPx + "px";
            item.innerHTML = `<img src="${gridBaseImg}" />`;
            container.appendChild(item);
        }
    }
}

// আপনার চাহিদা অনুযায়ী: সাইজ পরিবর্তন করলে ১টি ছবি দেখাবে
function resetAndRender() {
    if(gridBaseImg) {
        document.getElementById('grid-count-val').value = 1;
        renderPhotoGrid(true);
    }
}

// আপনার চাহিদা অনুযায়ী: পেপার সাইজ পরিবর্তন করলে ১টি ছবি দেখাবে
function updateGridLayout() {
    const size = document.getElementById('grid-paper-size').value;
    const page = document.getElementById('grid-page-unit');
    const dims = { a4: ["210mm", "297mm"], "4r": ["102mm", "152mm"], legal: ["216mm", "345mm"] };
    
    page.style.width = dims[size][0];
    page.style.height = dims[size][1]; 

    if(gridBaseImg) {
        document.getElementById('grid-count-val').value = 1;
    }
    renderPhotoGrid(true);
}

// ডিরেক্ট প্রিন্ট ফাংশন (১০০% পারফেক্ট আউটপুট)
function printGridContent() {
    const count = parseInt(document.getElementById('grid-count-val').value);
    if (!gridBaseImg || count === 0) {
        triggerAlert("Please upload a photo first!");
        return;
    }
    const content = document.getElementById('photo-grid-render').innerHTML;
    const size = document.getElementById('grid-paper-size').value;
    const dims = { a4: "210mm 297mm", "4r": "102mm 152mm", legal: "216mm 345mm" };
    
    const printWin = window.open('', '_blank');
    printWin.document.write(`
        <html>
            <head>
                <title>Photo_Print_Layout</title>
                <style>
                    @import url('https://fonts.maateen.me/solaiman-lipi/font.css');
                    @page { size: ${dims[size]}; margin: 0; }
                    body { margin: 0; padding: 0; background: #fff; }
                    #wrapper { 
                        width: ${dims[size].split(' ')[0]};
                        height: ${dims[size].split(' ')[1]};
                        display: flex; flex-wrap: wrap; gap: 5px; 
                        justify-content: center; align-content: flex-start;
                        padding: 5px; box-sizing: border-box; overflow: hidden;
                    }
                    .grid-photo-item { border: 1px solid #000 !important; display: flex; box-sizing: border-box; }
                    img { width: 100%; height: 100%; object-fit: cover; }
                </style>
            </head>
            <body><div id="wrapper">${content}</div></body>
        </html>
    `);
    printWin.document.close();
    setTimeout(() => { printWin.print(); printWin.close(); }, 800);
}

function resetGrid() {
    gridBaseImg = null;
    document.getElementById('grid-input').value = "";
    document.getElementById('grid-count-val').value = 0;
    document.getElementById('photo-grid-render').innerHTML = "";
}
;

let ltLang = "en";

// সংখ্যা রূপান্তর ফাংশন (বাংলা তারিখের জন্য)
function convertDigits(text, toLang) {
    if (!text) return "";
    const enDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    let result = text.toString();
    if (toLang === 'bn') {
        enDigits.forEach((en, i) => { result = result.split(en).join(bnDigits[i]); });
    } else {
        bnDigits.forEach((bn, i) => { result = result.split(bn).join(enDigits[i]); });
    }
    return result;
}

// বিস্তারিত এবং দীর্ঘ টেমপ্লেট ডাটাবেজ
const letterTemplates = {
    en: {
        job: `Date: ${new Date().toLocaleDateString('en-GB')}<br><br>
              To,<br>
              The Managing Director / HR Manager,<br>
              [Name of the Organization],<br>
              [Complete Address of the Office].<br><br>
              <b>Subject: Application for the position of [Mention Job Title].</b><br><br>
              Dear Sir/Madam,<br><br>
              I am writing to formally express my keen interest in the [Job Title] position at your esteemed organization, as advertised in [Source of Advertisement]. Having carefully reviewed the job description, I am confident that my educational background, professional experience, and skills align perfectly with the requirements of this role.<br><br>
              I have completed my [Mention Your Degree] from [University Name] and have gained [Number] years of practical experience in [Your Field/Industry]. During my previous tenure at [Previous Organization], I was responsible for [Mention key responsibility], where I successfully demonstrated my ability to [Mention a major achievement]. I possess strong communication skills, a high level of professional integrity, and the ability to work under pressure to meet tight deadlines.<br><br>
              My goal is to contribute my expertise to [Name of Organization] while continuing to develop my professional skills. I am eager to bring my dedication and hardworking nature to your team to help achieve your corporate objectives.<br><br>
              I have attached my detailed Curriculum Vitae (CV) and other necessary documents for your kind consideration. I would welcome the opportunity to discuss my qualifications further in a formal interview.<br><br>
              Thank you for your time and consideration.<br><br>
              Sincerely yours,<br><br>
              (Signature)<br>
              <b>[Your Full Name]</b><br>
              Phone: [Your Mobile Number]<br>
              Email: [Your Email Address]`,
        
        leave: `Date: ${new Date().toLocaleDateString('en-GB')}<br><br>
                To,<br>
                The Principal / Head of Department,<br>
                [Institution/Office Name],<br>
                [Location].<br><br>
                <b>Subject: Application for Leave of Absence due to [Mention Reason].</b><br><br>
                Dear Sir/Madam,<br><br>
                I am writing to respectfully request a leave of absence for [Number] days, starting from [Start Date] to [End Date]. The reason for this request is [Mention reason, e.g., my sister's wedding / sudden illness / personal family matters].<br><br>
                I have ensured that my current responsibilities and pending tasks are properly managed. I will be back in the office/institution on [Return Date] and will resume my duties immediately. I will also be available via email or phone in case of any urgent requirements during my absence.<br><br>
                I kindly request you to grant me this leave and support me during this period. I shall be highly obliged for your kind consideration of my situation.<br><br>
                Yours faithfully,<br><br>
                <b>[Your Name]</b><br>
                [Your Designation/Class/ID]<br>
                Mobile: [Your Number]`,
        
        cover: `Date: ${new Date().toLocaleDateString('en-GB')}<br><br>
                To,<br>
                The Hiring Manager,<br>
                [Company Name],<br>
                [Company Address].<br><br>
                <b>Subject: Cover Letter for the [Position Name] role.</b><br><br>
                Dear Sir/Madam,<br><br>
                I am highly excited to submit my application for the [Position Name] role at [Company Name]. As a professional with [Number] years of experience in [Your Core Skill], I have closely followed your company’s growth and am inspired by your commitment to innovation and quality.<br><br>
                Throughout my career, I have excelled at [Mention a skill, e.g., digital marketing/team management/software development]. My ability to solve complex problems and collaborate effectively with diverse teams makes me a strong fit for your culture. I am particularly drawn to this role because it offers the perfect platform to utilize my expertise in [Specific Skill] to drive tangible results for your organization.<br><br>
                I would be honored to bring my proactive approach and technical proficiency to [Company Name]. Thank you for reviewing my application. I look forward to the possibility of discussing how I can add value to your team.<br><br>
                Best regards,<br><br>
                <b>[Your Name]</b><br>
                LinkedIn: [Your Profile Link]<br>
                Mobile: [Your Number]`
    },
    bn: {
        job: `তারিখ: ${convertDigits(new Date().toLocaleDateString('en-GB'), 'bn')}<br><br>
              বরাবর,<br>
              ব্যবস্থাপক / পরিচালক,<br>
              [প্রতিষ্ঠানের নাম],<br>
              [অফিসের পূর্ণ ঠিকানা]।<br><br>
              <b>বিষয়: [পদের নাম] পদের জন্য আবেদন।</b><br><br>
              মহোদয়,<br><br>
              বিনীত নিবেদন এই যে, গত [তারিখ] তারিখে [পত্রিকার নাম/অনলাইন সোর্স] এ প্রকাশিত বিজ্ঞপ্তির মাধ্যমে জানতে পারলাম যে, আপনার স্বনামধন্য প্রতিষ্ঠানে কিছু সংখ্যক [পদের নাম] নিয়োগ দেওয়া হবে। আমি উক্ত পদের একজন আগ্রহী প্রার্থী হিসেবে আমার প্রয়োজনীয় তথ্যাদি এবং জীবনবৃত্তান্ত আপনার সদয় বিবেচনার জন্য পেশ করছি।<br><br>
              আমি [আপনার শিক্ষাগত যোগ্যতা] সম্পন্ন করেছি এবং আমার [আপনার বিশেষ দক্ষতা/অভিজ্ঞতা] রয়েছে। আমি অত্যন্ত কঠোর পরিশ্রমী, সময়ানুবর্তী এবং যেকোনো প্রতিকূল পরিবেশের সাথে দ্রুত মানিয়ে নিতে সক্ষম। আমার দীর্ঘদিনের অর্জিত অভিজ্ঞতা ও নিষ্ঠা আপনার প্রতিষ্ঠানের ভবিষ্যৎ লক্ষ্য অর্জনে গুরুত্বপূর্ণ ভূমিকা রাখবে বলে আমি বিশ্বাস করি।<br><br>
              আমি আমার পূর্ণাঙ্গ জীবনবৃত্তান্ত (CV) ও প্রয়োজনীয় নথিপত্র এই আবেদনের সাথে সংযুক্ত করেছি। আমার যোগ্যতা যাচাইয়ের জন্য আমাকে একটি সাক্ষাৎকারের সুযোগ দানে আপনার একান্ত মর্জি হয়।<br><br>
              অতএব, মহোদয়ের নিকট বিনীত প্রার্থনা, উপরোক্ত তথ্যাদি বিবেচনা করে আমাকে উক্ত পদে নিয়োগ দানে বাধিত করবেন।<br><br>
              বিনীত নিবেদক,<br><br>
              (স্বাক্ষর)<br>
              <b>[আপনার নাম]</b><br>
              ঠিকানা: [আপনার পূর্ণ ঠিকানা]<br>
              মোবাইল: [আপনার মোবাইল নাম্বার]`,
        
        leave: `তারিখ: ${convertDigits(new Date().toLocaleDateString('en-GB'), 'bn')}<br><br>
                বরাবর,<br>
                প্রধান শিক্ষক / বিভাগীয় প্রধান,<br>
                [শিক্ষা প্রতিষ্ঠান/অফিসের নাম],<br>
                [ঠিকানা]।<br><br>
                <b>বিষয়: [ছুটির কারণ] এর জন্য ছুটির আবেদন।</b><br><br>
                জনাব,<br><br>
                সবিনয় নিবেদন এই যে, আমি আপনার প্রতিষ্ঠানের একজন [আপনার পদবি/শ্রেণি]। আমার [কারণ, যেমন: পারিবারিক অনুষ্ঠান / অসুস্থতা / জরুরি কাজ] এর জন্য আগামী [তারিখ] থেকে [তারিখ] পর্যন্ত মোট [দিন] দিনের ছুটির প্রয়োজন। আমার অনুপস্থিতিকালীন সময়ে আমার উপর অর্পিত দায়িত্বগুলো আমি গুছিয়ে রেখেছি যাতে প্রতিষ্ঠানের কোনো কাজে ব্যাঘাত না ঘটে।<br><br>
                অতএব, মহোদয়ের নিকট আকুল প্রার্থনা এই যে, আমাকে উক্ত দিনগুলোর জন্য ছুটি দানে আপনার একান্ত মর্জি হয়। আমি আপনার এই মহানুভবতার জন্য চিরকৃতজ্ঞ থাকব।<br><br>
                আপনার একান্ত অনুগত,<br><br>
                <b>[আপনার নাম]</b><br>
                পদবি: [আপনার পদবি]<br>
                মোবাইল: [আপনার নাম্বার]`,
        
        cover: `তারিখ: ${convertDigits(new Date().toLocaleDateString('en-GB'), 'bn')}<br><br>
                বরাবর,<br>
                নিয়োগ কর্মকর্তা,<br>
                [প্রতিষ্ঠানের নাম],<br>
                [ঠিকানা]।<br><br>
                <b>বিষয়: [পদের নাম] পদের জন্য কভার লেটার।</b><br><br>
                মহোদয়,<br><br>
                আপনার প্রতিষ্ঠানের [পদের নাম] পদের জন্য প্রকাশিত নিয়োগ বিজ্ঞপ্তিটি আমার দৃষ্টিগোচর হয়েছে। আমি একজন অভিজ্ঞ [আপনার কাজের ক্ষেত্র] পেশাজীবী হিসেবে আপনার প্রতিষ্ঠানের সাথে কাজ করতে অত্যন্ত আগ্রহী। আমি দীর্ঘদিন ধরে আপনার প্রতিষ্ঠানের উন্নয়ন ও অগ্রযাত্রা লক্ষ্য করছি এবং আমি আমার মেধা ও শ্রম দিয়ে আপনার প্রতিষ্ঠানের সাফল্যে অবদান রাখতে চাই।<br><br>
                আমার পেশাগত জীবনে আমি [একটি বিশেষ সাফল্য] অর্জন করেছি এবং আমি বিশ্বাস করি আমার [আপনার বিশেষ দক্ষতা] আপনার প্রতিষ্ঠানের লক্ষ্য অর্জনে সহায়ক হবে। আমি দলের সাথে কাজ করতে পছন্দ করি এবং যেকোনো চ্যালেঞ্জিং কাজ সম্পন্ন করতে আমি আত্মবিশ্বাসী।<br><br>
                আপনার মূল্যবান সময় দেওয়ার জন্য ধন্যবাদ। আমি আশা করছি শীঘ্রই একটি সাক্ষাৎকারের মাধ্যমে আমার যোগ্যতা সবিস্তারে বর্ণনা করার সুযোগ পাব।<br><br>
                ধন্যবাদান্তে,<br><br>
                <b>[আপনার নাম]</b><br>
                মোবাইল: [আপনার নাম্বার]<br>
                ইমেইল: [আপনার ইমেইল]`
    }
};

function openLetterModal() {
    document.getElementById('letterModal').style.display = 'flex';
    if(typeof setActiveMode === 'function') setActiveMode('mode-letter');
    loadTemplate('job'); // ডিফল্ট জব অ্যাপ্লিকেশন লোড
}

function closeLetterModal() { document.getElementById('letterModal').style.display = 'none'; }

function execCmd(command, value = null) { document.execCommand(command, false, value); }

function switchLetterLang(lang) {
    ltLang = lang;
    document.getElementById('lt-en-btn').classList.toggle('active', lang === 'en');
    document.getElementById('lt-bn-btn').classList.toggle('active', lang === 'bn');
    
    const select = document.getElementById('letter-template');
    const tipsBox = document.getElementById('lt-tips-box'); // টিপস বক্সটি ধরা হলো

    if(lang === 'bn') {
        select.options[0].text = "চাকরির আবেদন";
        select.options[1].text = "ছুটির আবেদন";
        select.options[2].text = "সাধারণ কভার লেটার";

        // বাংলা টিপস ইনজেক্ট করা
        tipsBox.innerHTML = `
            <strong><i class='fa-solid fa-circle-info'></i> দরখাস্ত লেখার টিপস:</strong>
            <ul style='margin:0; padding-left:20px; font-size: 13px; font-family: "SolaimanLipi", sans-serif;'>
                <li>যেকোনো টেক্সটের ওপর ক্লিক করে আপনার ব্যক্তিগত তথ্য পরিবর্তন করুন।</li>
                <li>পিডিএফ সেভ করতে: <b>Direct Print</b> বাটনে ক্লিক করুন এবং প্রিন্ট উইন্ডোতে <b>"Save as PDF"</b> সিলেক্ট করুন।</li>
                <li>প্রিন্ট করার আগে <b>তারিখ</b> এবং <b>প্রাপকের ঠিকানা</b> অবশ্যই পুনরায় যাচাই করে নিন।</li>
            </ul>`;
    } else {
        select.options[0].text = "Job Application";
        select.options[1].text = "Leave of Absence";
        select.options[2].text = "General Cover Letter";

        // ইংরেজি টিপস ইনজেক্ট করা
        tipsBox.innerHTML = `
            <strong><i class='fa-solid fa-circle-info'></i> Application Writing Tips:</strong>
            <ul style='margin:0; padding-left:20px; font-size: 12px;'>
                <li>Click on any text to edit and provide your personal information.</li>
                <li>To Save as PDF: Click <b>Direct Print</b> and select <b>"Save as PDF"</b> as the destination.</li>
                <li>Make sure to double-check the <b>Date</b> and <b>Recipient Address</b> before printing.</li>
            </ul>`;
    }
    loadTemplate(select.value);
}

function loadTemplate(type) {
    const editor = document.getElementById('letter-editor');
    editor.innerHTML = letterTemplates[ltLang][type];
}

function updateLetterLayout() {
    const size = document.getElementById('lt-page-size').value;
    const page = document.getElementById('lt-page-unit');
    page.style.width = (size === 'legal') ? "216mm" : "210mm";
    page.style.minHeight = (size === 'legal') ? "345mm" : "297mm";
}

function printLetter() {
    const content = document.getElementById('letter-editor').innerHTML;
    const size = document.getElementById('lt-page-size').value;
    const dim = (size === 'legal') ? '216mm 345mm' : 'A4';
    
    let count = localStorage.getItem('letter_print_count') || 0;
    count = parseInt(count) + 1;
    localStorage.setItem('letter_print_count', count);

    const printWin = window.open('', '_blank');
    printWin.document.write(`
        <html>
            <head>
                <title>Cover_Letter_seba.pro.bd/-${count}</title>
                <style>
                    @import url('https://fonts.maateen.me/solaiman-lipi/font.css');
                    @page { size: ${dim}; margin: 0; }
                    body { font-family: 'SolaimanLipi', Arial; padding: 25mm 20mm; background: #fff; }
                    #editor { text-align: justify; font-size: 17px; line-height: 1.6; color: #000; }
                    b, strong { font-weight: bold; }
                </style>
            </head>
            <body><div id="editor">${content}</div></body>
        </html>
    `);
    printWin.document.close();
    setTimeout(() => { printWin.print(); printWin.close(); }, 500);
}

function resetLetter() {
    loadTemplate(document.getElementById('letter-template').value);
}
;

let njpro_frontImg = null;
let njpro_backImg = null;
let njpro_joinedImg = null; 
let njpro_mode = "h"; // CHANGED: Default "h"
let njpro_side = "";
let njpro_pts = [{x:0, y:0}, {x:0, y:0}, {x:0, y:0}, {x:0, y:0}];
let njpro_rawMat = null;
let njpro_scale = 1;
let njpro_currImg = null;

function njpro_openModal() {
    document.getElementById('njpro_main_modal').style.display = 'flex';
    document.body.style.overflow = 'hidden'; 
    if(typeof setActiveMode === 'function') setActiveMode('mode-nid-joiner');
}

function njpro_closeModal() { 
    document.getElementById('njpro_main_modal').style.display = 'none'; 
    document.body.style.overflow = ''; 
    njpro_cancelCrop();
}

function njpro_drawLines() {
    const canvas = document.getElementById('njpro_select_canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(njpro_currImg, 0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = "#f43f5e";
    ctx.moveTo(njpro_pts[0].x, njpro_pts[0].y);
    ctx.lineTo(njpro_pts[1].x, njpro_pts[1].y);
    ctx.lineTo(njpro_pts[2].x, njpro_pts[2].y);
    ctx.lineTo(njpro_pts[3].x, njpro_pts[3].y);
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = "rgba(244, 63, 94, 0.15)";
    ctx.fill();
}

function njpro_loadPart(input, side) {
    if (input.files && input.files[0]) {
        njpro_side = side;
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target.result;
            img.onload = () => {
                njpro_currImg = img;
                const overlay = document.getElementById('njpro_crop_overlay');
                const canvas = document.getElementById('njpro_select_canvas');
                overlay.style.display = 'flex';
                
                const limitW = 750; 
                const limitH = 500; 
                const viewW = Math.min(window.innerWidth * 0.92, limitW);
                const viewH = Math.min(window.innerHeight * 0.7, limitH);
                
                njpro_scale = Math.min(viewW / img.width, viewH / img.height);
                canvas.width = img.width * njpro_scale;
                canvas.height = img.height * njpro_scale;
                
                const pad = 20; 
                njpro_pts = [
                    {id: 'njpro_pt0', x: pad, y: pad},
                    {id: 'njpro_pt1', x: canvas.width - pad, y: pad},
                    {id: 'njpro_pt2', x: canvas.width - pad, y: canvas.height - pad},
                    {id: 'njpro_pt3', x: pad, y: canvas.height - pad}
                ];
                njpro_pts.forEach(p => {
                    const el = document.getElementById(p.id);
                    el.style.left = p.x + 'px'; el.style.top = p.y + 'px';
                    njpro_initDrag(el, p);
                });
                if(njpro_rawMat) njpro_rawMat.delete();
                njpro_rawMat = cv.imread(img);
                njpro_drawLines();
            };
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function njpro_updateZoom(x, y, clientX, clientY) {
    const glass = document.getElementById('njpro_zoom_glass');
    const zCanvas = document.getElementById('njpro_zoom_canvas');
    const zCtx = zCanvas.getContext('2d');
    
    const boundaryEl = document.getElementById('njpro_select_canvas');
    const boundaryRect = boundaryEl.getBoundingClientRect();
    
    const zoomFactor = 2.5; 
    const glassRect = glass.getBoundingClientRect();
    const glassW = glassRect.width;
    const glassH = glassRect.height;
    
    const srcX = x / njpro_scale;
    const srcY = y / njpro_scale;
    const srcW = zCanvas.width / zoomFactor;
    const srcH = zCanvas.height / zoomFactor;
    
    zCtx.clearRect(0,0, zCanvas.width, zCanvas.height);
    zCtx.drawImage(njpro_currImg, 
        srcX - srcW/2, srcY - srcH/2, srcW, srcH, 
        0, 0, zCanvas.width, zCanvas.height
    );
    
    let posLeft = clientX + 30;
    let posTop = clientY - 30 - glassH;

    if (clientX > boundaryRect.left + (boundaryRect.width / 2)) {
        posLeft = clientX - 30 - glassW;
    }
    if (clientY < boundaryRect.top + glassH + 20) {
         posTop = clientY + 40;
    }

    if (posLeft < boundaryRect.left) posLeft = boundaryRect.left;
    if (posLeft + glassW > boundaryRect.right) posLeft = boundaryRect.right - glassW;
    if (posTop < boundaryRect.top) posTop = boundaryRect.top;
    if (posTop + glassH > boundaryRect.bottom) posTop = boundaryRect.bottom - glassH;

    glass.style.left = posLeft + 'px';
    glass.style.top = posTop + 'px';
}

function njpro_initDrag(el, pObj) {
    const glass = document.getElementById('njpro_zoom_glass');
    const move = (e) => {
        const rect = document.getElementById('njpro_select_canvas').getBoundingClientRect();
        const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
        pObj.x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        pObj.y = Math.max(0, Math.min(clientY - rect.top, rect.height));
        el.style.left = pObj.x + 'px'; el.style.top = pObj.y + 'px';
        njpro_drawLines();
        njpro_updateZoom(pObj.x, pObj.y, clientX, clientY);
    };
    const stop = () => {
        window.removeEventListener('mousemove', move);
        window.removeEventListener('touchmove', move);
        glass.style.display = 'none';
    };
    const start = (e) => {
        if(e.cancelable) e.preventDefault();
        const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
        window.addEventListener('mousemove', move);
        window.addEventListener('touchmove', move);
        window.addEventListener('mouseup', stop);
        window.addEventListener('touchend', stop);
        glass.style.display = 'flex';
        njpro_updateZoom(pObj.x, pObj.y, clientX, clientY);
    };
    el.onmousedown = start;
    el.ontouchstart = start;
}

function njpro_applyCrop() {
    try {
        let dst = new cv.Mat();
        let coords = [];
        njpro_pts.forEach(p => {
            coords.push(p.x / njpro_scale);
            coords.push(p.y / njpro_scale);
        });
        const stdW = 990, stdH = 630;
        let srcCoords = cv.matFromArray(4, 1, cv.CV_32FC2, coords);
        let dstCoords = cv.matFromArray(4, 1, cv.CV_32FC2, [0, 0, stdW, 0, stdW, stdH, 0, stdH]);
        let M = cv.getPerspectiveTransform(srcCoords, dstCoords);
        cv.warpPerspective(njpro_rawMat, dst, M, new cv.Size(stdW, stdH));
        const tempCan = document.createElement('canvas');
        cv.imshow(tempCan, dst);
        const resImg = new Image();
        resImg.src = tempCan.toDataURL('image/jpeg', 0.95);
        resImg.onload = () => {
            if (njpro_side === 'front') {
                njpro_frontImg = resImg;
                document.getElementById('njpro_txt_f_status').innerText = "Front Cropped ✅";
            } else {
                njpro_backImg = resImg;
                document.getElementById('njpro_txt_b_status').innerText = "Back Cropped ✅";
            }
            njpro_cancelCrop();
            njpro_drawJoined();
        };
        dst.delete(); M.delete(); srcCoords.delete(); dstCoords.delete();
    } catch (e) { alert("Please select all 4 corners correctly."); }
}

function njpro_cancelCrop() { document.getElementById('njpro_crop_overlay').style.display = 'none'; }

function njpro_setMode(mode) {
    njpro_mode = mode;
    document.getElementById('njpro_btn_v').classList.toggle('active', mode === 'v');
    document.getElementById('njpro_btn_h').classList.toggle('active', mode === 'h');
    njpro_drawJoined();
}

function njpro_updateBtns() {
    const isReady = (njpro_frontImg !== null && njpro_backImg !== null);
    const btnJpg = document.getElementById('njpro_dl_jpg');
    const btnPdf = document.getElementById('njpro_dl_pdf');
    if(isReady) {
        btnJpg.disabled = false; btnJpg.style.opacity = '1'; btnJpg.style.cursor = 'pointer';
        btnPdf.disabled = false; btnPdf.style.opacity = '1'; btnPdf.style.cursor = 'pointer';
    } else {
        btnJpg.disabled = true; btnJpg.style.opacity = '0.5'; btnJpg.style.cursor = 'not-allowed';
        btnPdf.disabled = true; btnPdf.style.opacity = '0.5'; btnPdf.style.cursor = 'not-allowed';
    }
}

function njpro_drawJoined() {
    njpro_updateBtns();
    if (!njpro_frontImg && !njpro_backImg) return;
    const canvas = document.getElementById('njpro_main_canvas');
    const ctx = canvas.getContext('2d');
    const hasBorder = document.getElementById('njpro_border_chk').checked;
    document.getElementById('njpro_placeholder').style.display = 'none';
    canvas.style.display = 'inline-block';
    if (njpro_frontImg && njpro_backImg) {
        document.getElementById('njpro_magic_controls').style.display = 'flex';
    }
    const stdW = 990, stdH = 630, gap = 30;
    canvas.width = (njpro_mode === 'v') ? stdW + 60 : (stdW * 2) + gap + 60;
    canvas.height = (njpro_mode === 'v') ? (stdH * 2) + gap + 60 : stdH + 60;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    function draw(img, x, y) {
        ctx.drawImage(img, x, y, stdW, stdH);
        if(hasBorder) {
            ctx.strokeStyle = "#000"; ctx.lineWidth = 3; ctx.strokeRect(x, y, stdW, stdH);
        }
    }
    if (njpro_frontImg) draw(njpro_frontImg, 30, 30);
    if (njpro_backImg) {
        if (njpro_mode === 'v') draw(njpro_backImg, 30, stdH + gap + 30);
        else draw(njpro_backImg, stdW + gap + 30, 30);
    }
    if (njpro_frontImg && njpro_backImg) {
        njpro_joinedImg = new Image();
        njpro_joinedImg.src = canvas.toDataURL();
    }
}

function njpro_applyMagic() {
    if (!njpro_joinedImg) return;
    const canvas = document.getElementById('njpro_main_canvas');
    let src = cv.imread(njpro_joinedImg);
    let dst = new cv.Mat();
    cv.cvtColor(src, src, cv.COLOR_RGBA2RGB);
    let lab = new cv.Mat();
    cv.cvtColor(src, lab, cv.COLOR_RGB2Lab);
    let channels = new cv.MatVector();
    cv.split(lab, channels);
    let clahe = new cv.CLAHE(2.0, new cv.Size(8, 8));
    clahe.apply(channels.get(0), channels.get(0));
    cv.merge(channels, lab);
    cv.cvtColor(lab, dst, cv.COLOR_Lab2RGB);
    cv.imshow(canvas, dst);
    src.delete(); dst.delete(); lab.delete(); channels.delete(); clahe.delete();
    document.getElementById('njpro_range_sat').value = 110;
    document.getElementById('njpro_range_ct').value = 120;
    njpro_updateFilters();
}

function njpro_updateFilters() {
    const canvas = document.getElementById('njpro_main_canvas');
    const sat = document.getElementById('njpro_range_sat').value;
    const ct = document.getElementById('njpro_range_ct').value;
    document.getElementById('njpro_val_sat').innerText = sat + "%";
    document.getElementById('njpro_val_ct').innerText = ct + "%";
    canvas.style.filter = `saturate(${sat}%) contrast(${ct}%) brightness(105%)`;
}

function njpro_downloadPDF() {
    if (!njpro_frontImg || !njpro_backImg) { alert("Please crop both Front and Back sides first."); return; }
    const canvas = document.getElementById('njpro_main_canvas');
    if (canvas.style.display === 'none') return;
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tCtx = tempCanvas.getContext('2d');
    tCtx.filter = canvas.style.filter;
    tCtx.drawImage(canvas, 0, 0);
    const imgData = tempCanvas.toDataURL('image/jpeg', 1.0);
    const coreCardPx = 990; 
    const coreCardMm = 3.3 * 25.4; 
    const imgW = (canvas.width / coreCardPx) * coreCardMm;
    const imgH = (canvas.height / canvas.width) * imgW;
    const a4W = 210;
    const xPos = (a4W - imgW) / 2;
    pdf.addImage(imgData, 'JPEG', xPos, 5, imgW, imgH);
    pdf.save(`NID_Joined_A4_${Date.now()}.pdf`);
}

function njpro_downloadJPG() {
    if (!njpro_frontImg || !njpro_backImg) { alert("Please crop both Front and Back sides first."); return; }
    const canvas = document.getElementById('njpro_main_canvas');
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tCtx = tempCanvas.getContext('2d');
    tCtx.filter = canvas.style.filter;
    tCtx.drawImage(canvas, 0, 0);
    const link = document.createElement('a');
    link.download = `Joined_NID_${Date.now()}.jpg`;
    link.href = tempCanvas.toDataURL("image/jpeg", 0.95);
    link.click();
}

function njpro_resetAll() {
    njpro_frontImg = njpro_backImg = null;
    document.getElementById('njpro_front_in').value = "";
    document.getElementById('njpro_back_in').value = "";
    document.getElementById('njpro_txt_f_status').innerText = "Upload Front Side";
    document.getElementById('njpro_txt_b_status').innerText = "Upload Back Side";
    document.getElementById('njpro_main_canvas').style.display = 'none';
    document.getElementById('njpro_magic_controls').style.display = 'none';
    document.getElementById('njpro_placeholder').style.display = 'flex';
    njpro_updateBtns();
}
;

let pndMainImage = null;
let pndCurrentLang = 'en';

function openPndModal() {
    if (typeof setActiveMode === "function") setActiveMode('mode-pnd');
    document.getElementById('pndModal').style.display = 'flex';
}

function closePndModal() {
    document.getElementById('pndModal').style.display = 'none';
}

function setPndLang(lang) {
    pndCurrentLang = lang;
    const modal = document.getElementById('pndModal');
    
    modal.querySelectorAll('.ph-tab').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`pnd-${lang}-btn`).classList.add('active');
    
    const nameInp = document.getElementById('pnd-name');
    const dateInp = document.getElementById('pnd-date');

    if (lang === 'bn') {
        document.getElementById('pnd-main-title').innerHTML = '<i class="fa-solid fa-file-signature"></i> ফটো নাম ও তারিখ এডার';
        document.getElementById('pnd-upload-text').innerText = 'ছবি আপলোড করতে ক্লিক করুন';
        document.getElementById('lbl-pnd-name').innerText = 'পূর্ণ নাম (বাংলায়)';
        document.getElementById('lbl-pnd-date').innerText = 'তারিখ (বাংলায়)';
        document.getElementById('lbl-pnd-line').innerText = 'মাঝখানে লাইন যোগ করুন';
        document.getElementById('pnd-intro-text').innerHTML = 'এখান থেকে ছবিটি ডাউনলোড করে আমাদের <b>পাসপোর্ট ফটো মেকার</b> দিয়ে এ৪ পেপারে সাজিয়ে প্রিন্ট করে নিতে পারবেন।';
        
        nameInp.placeholder = 'মোঃ ফয়জুল করিম';
        dateInp.placeholder = '২৪/০১/২০২৬';
        nameInp.style.fontFamily = "'SolaimanLipi', sans-serif";
        dateInp.style.fontFamily = "'SolaimanLipi', sans-serif";
    } else {
        document.getElementById('pnd-main-title').innerHTML = '<i class="fa-solid fa-file-signature"></i> Photo Name & Date Adder';
        document.getElementById('pnd-upload-text').innerText = 'Click to Upload Photo';
        document.getElementById('lbl-pnd-name').innerText = 'Type Full Name';
        document.getElementById('lbl-pnd-date').innerText = 'Type Date';
        document.getElementById('lbl-pnd-line').innerText = 'Add Separator Line';
        document.getElementById('pnd-intro-text').innerHTML = 'Download your edited photo from here and use our <b>Passport Photo Maker</b> tool to print it on A4 paper.';
        
        nameInp.placeholder = 'MD. Monir Hossain';
        dateInp.placeholder = '24/01/2026';
        nameInp.style.fontFamily = "inherit";
        dateInp.style.fontFamily = "inherit";
    }
    drawPndCanvas();
}

function loadPndImage(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        pndMainImage = new Image();
        pndMainImage.onload = function() {
            // Show preview box only when image is loaded
            document.getElementById('pnd-preview-box-wrapper').style.display = 'flex';
            drawPndCanvas();
        };
        pndMainImage.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function drawPndCanvas() {
    if (!pndMainImage) return;

    const canvas = document.getElementById('pnd-canvas');
    const ctx = canvas.getContext('2d');
    
    const name = document.getElementById('pnd-name').value;
    const date = document.getElementById('pnd-date').value;
    const nameColor = document.getElementById('pnd-name-color').value;
    const dateColor = document.getElementById('pnd-date-color').value;
    const showLine = document.getElementById('pnd-show-line').checked;
    const lineColor = document.getElementById('pnd-line-color').value;
    const fontSize = document.getElementById('pnd-font-size').value;

    canvas.width = pndMainImage.width;
    canvas.height = pndMainImage.height;

    ctx.drawImage(pndMainImage, 0, 0);

    // Footer white box logic (Only if name or date or line is present)
    if (name || date || showLine) {
        const boxHeight = canvas.height * 0.20;
        ctx.fillStyle = "white";
        ctx.fillRect(0, canvas.height - boxHeight, canvas.width, boxHeight);

        ctx.textAlign = "center";
        const fontFam = pndCurrentLang === 'bn' ? 'SolaimanLipi' : 'Arial';
        const responsiveFS = fontSize * (canvas.width / 400);

        // Draw Name
        ctx.fillStyle = nameColor;
        ctx.font = `bold ${responsiveFS}px ${fontFam}`;
        ctx.fillText(name, canvas.width / 2, canvas.height - (boxHeight * 0.62));

        // Draw Line (Separator Line Fix)
        if (showLine) {
            ctx.beginPath();
            ctx.strokeStyle = lineColor;
            // Line width adjusted for image resolution
            ctx.lineWidth = Math.max(1.5, canvas.width / 250); 
            const lineY = canvas.height - (boxHeight * 0.45);
            ctx.moveTo(canvas.width * 0.1, lineY);
            ctx.lineTo(canvas.width * 0.9, lineY);
            ctx.stroke();
            ctx.closePath();
        }

        // Draw Date
        ctx.fillStyle = dateColor;
        ctx.font = `${responsiveFS * 0.85}px ${fontFam}`;
        ctx.fillText(date, canvas.width / 2, canvas.height - (boxHeight * 0.18));
    }
}

function downloadPndImage() {
    if (!pndMainImage) return alert("Please upload a photo first!");
    const canvas = document.getElementById('pnd-canvas');
    const link = document.createElement('a');
    link.download = 'IDScannerPro_Photo.jpg';
    link.href = canvas.toDataURL('image/jpeg', 0.95);
    link.click();
}

function resetPnd() {
    pndMainImage = null;
    document.getElementById('pnd-name').value = '';
    document.getElementById('pnd-date').value = '';
    document.getElementById('pnd-input').value = '';
    document.getElementById('pnd-show-line').checked = false;
    // Hide preview box on reset
    document.getElementById('pnd-preview-box-wrapper').style.display = 'none';
    
    // Clear Canvas
    const canvas = document.getElementById('pnd-canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
;

let idmLogoImg = null;
let idmStudentImg = null;
let idmCurrentLang = 'en';
let idmOrient = 'h'; 

function openIdCardModal() {
    if (typeof setActiveMode === "function") setActiveMode('mode-student-id');
    document.getElementById('idCardModal').style.display = 'flex';
}

function closeIdCardModal() {
    document.getElementById('idCardModal').style.display = 'none';
}

function setIdOrient(mode) {
    idmOrient = mode;
    document.getElementById('idm-h-btn').classList.toggle('active', mode === 'h');
    document.getElementById('idm-v-btn').classList.toggle('active', mode === 'v');
    drawIdCard();
}

function setIdLang(lang) {
    idmCurrentLang = lang;
    const modal = document.getElementById('idCardModal');
    modal.querySelectorAll('.ph-tab').forEach(btn => {
        if(btn.id.includes('en') || btn.id.includes('bn')) btn.classList.remove('active');
    });
    document.getElementById(`idm-${lang}-btn`).classList.add('active');

    const elements = {
        'idm-main-title': lang === 'bn' ? '<i class="fa-solid fa-address-card"></i> স্টুডেন্ট আইডি কার্ড মেকার' : '<i class="fa-solid fa-address-card"></i> Student ID Card Maker',
        'lbl-inst-name': lang === 'bn' ? 'প্রতিষ্ঠানের নাম' : 'Institution Name',
        'txt-up-logo': lang === 'bn' ? 'লোগো আপলোড' : 'Upload Logo',
        'txt-up-photo': lang === 'bn' ? 'ছাত্রের ছবি' : 'Student Photo',
        'lbl-idm-name': lang === 'bn' ? 'ছাত্র/ছাত্রীর নাম' : 'Student Name',
        'lbl-idm-class': lang === 'bn' ? 'শ্রেণী' : 'Class',
        'lbl-idm-roll': lang === 'bn' ? 'রোল নং' : 'Roll No',
        'lbl-idm-father': lang === 'bn' ? 'পিতার নাম' : 'Father\'s Name',
        'lbl-idm-blood': lang === 'bn' ? 'রক্তের গ্রুপ' : 'Blood Group',
        'lbl-idm-phone': lang === 'bn' ? 'ফোন' : 'Phone',
        'lbl-idm-theme': lang === 'bn' ? 'কার্ডের থিম কালার' : 'Card Theme Color',
        'idm-intro-text': lang === 'bn' ? 'প্রফেশনাল আইডি কার্ড তৈরি করুন (৩.৩৭ x ২.১২৫ ইঞ্চি)। এটি স্টুডিও প্রিন্টিংয়ের জন্য উপযুক্ত।' : 'Professional Student ID Card (3.37 x 2.125 in). Ready for studio printing.'
    };

    for (let id in elements) {
        let el = document.getElementById(id);
        if(el) el.innerHTML = elements[id];
    }
    drawIdCard();
}

function loadIdAsset(event, type) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            if (type === 'logo') idmLogoImg = img;
            else idmStudentImg = img;
            document.getElementById('idm-canvas').style.display = 'flex';
            document.getElementById('idm-placeholder').style.display = 'none';
            drawIdCard();
        };
        img.src = e.target.result;
    };
    if(event.target.files[0]) reader.readAsDataURL(event.target.files[0]);
}

function drawIdCard() {
    const canvas = document.getElementById('idm-canvas');
    const ctx = canvas.getContext('2d');
    
    if(idmOrient === 'h') {
        canvas.width = 1012; canvas.height = 638;
    } else {
        canvas.width = 638; canvas.height = 1012;
    }

    const themeColor = document.getElementById('idm-color').value;
    const inst = document.getElementById('idm-inst').value || (idmCurrentLang === 'bn' ? 'প্রতিষ্ঠানের নাম' : 'INSTITUTION NAME');
    const name = document.getElementById('idm-name').value || (idmCurrentLang === 'bn' ? 'ছাত্রের নাম' : 'STUDENT NAME');
    const s_class = document.getElementById('idm-class').value;
    const roll = document.getElementById('idm-roll').value;
    const father = document.getElementById('idm-father').value;
    const blood = document.getElementById('idm-blood').value;
    const phone = document.getElementById('idm-phone').value;

    const fontBN = 'SolaimanLipi';
    const fontEN = 'Arial';
    const activeFont = idmCurrentLang === 'bn' ? fontBN : fontEN;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (idmOrient === 'h') {
        ctx.fillStyle = themeColor; ctx.fillRect(0, 0, canvas.width, 180);
        ctx.fillStyle = "#ffffff"; ctx.textAlign = "center";
        ctx.font = `bold 42px ${activeFont}`; ctx.fillText(inst, canvas.width / 2 + 50, 80);
        ctx.font = `24px ${activeFont}`; ctx.fillText(idmCurrentLang === 'bn' ? 'স্টুডেন্ট আইডি কার্ড' : 'Student ID Card', canvas.width / 2 + 50, 130);
        if (idmLogoImg) ctx.drawImage(idmLogoImg, 40, 30, 120, 120);
        ctx.strokeStyle = themeColor; ctx.lineWidth = 5; ctx.strokeRect(50, 220, 240, 290);
        if (idmStudentImg) ctx.drawImage(idmStudentImg, 55, 225, 230, 280);
        ctx.textAlign = "left"; ctx.fillStyle = themeColor;
        ctx.font = `bold 36px ${activeFont}`; ctx.fillText(name, 330, 260);
        ctx.fillStyle = "#374151"; ctx.font = `26px ${activeFont}`;
        let y = 320;
        const labels = idmCurrentLang === 'bn' ? ['শ্রেণী', 'রোল', 'পিতার নাম', 'রক্ত', 'ফোন'] : ['Class', 'Roll', 'Father', 'Blood', 'Phone'];
        const values = [s_class, roll, father, blood, phone];
        labels.forEach((l, i) => {
            ctx.fillStyle = "#6b7280"; ctx.fillText(l + " :", 330, y);
            ctx.fillStyle = "#111827"; ctx.font = `bold 26px ${activeFont}`;
            ctx.fillText(values[i] || '---', 480, y);
            y += 50;
        });
        ctx.fillStyle = themeColor; ctx.fillRect(0, 600, canvas.width, 38);
    } else {
        ctx.fillStyle = themeColor; ctx.fillRect(0, 0, canvas.width, 220);
        if (idmLogoImg) ctx.drawImage(idmLogoImg, canvas.width/2 - 50, 20, 100, 100);
        ctx.fillStyle = "#ffffff"; ctx.textAlign = "center";
        ctx.font = `bold 35px ${activeFont}`; ctx.fillText(inst, canvas.width / 2, 160);
        ctx.font = `20px ${activeFont}`; ctx.fillText(idmCurrentLang === 'bn' ? 'স্টুডেন্ট আইডি কার্ড' : 'Student ID Card', canvas.width / 2, 195);
        ctx.strokeStyle = themeColor; ctx.lineWidth = 5; ctx.strokeRect(canvas.width/2 - 110, 250, 220, 270);
        if (idmStudentImg) ctx.drawImage(idmStudentImg, canvas.width/2 - 105, 255, 210, 260);
        ctx.fillStyle = themeColor; ctx.font = `bold 34px ${activeFont}`; ctx.fillText(name, canvas.width/2, 580);
        ctx.textAlign = "left"; ctx.font = `24px ${activeFont}`;
        let y = 640;
        const labels = idmCurrentLang === 'bn' ? ['শ্রেণী', 'রোল', 'পিতা', 'রক্ত', 'ফোন'] : ['Class', 'Roll', 'Father', 'Blood', 'Phone'];
        const values = [s_class, roll, father, blood, phone];
        labels.forEach((l, i) => {
            ctx.fillStyle = "#6b7280"; ctx.fillText(l + ":", 100, y);
            ctx.fillStyle = "#111827"; ctx.font = `bold 24px ${activeFont}`; ctx.fillText(values[i] || '---', 220, y);
            y += 55;
        });
        ctx.fillStyle = themeColor; ctx.fillRect(0, canvas.height - 40, canvas.width, 40);
    }
}

function downloadIdCard() {
    const canvas = document.getElementById('idm-canvas');
    if (!idmStudentImg && !idmLogoImg) return alert("Please fill data and upload photo!");
    
    const link = document.createElement('a');
    link.download = 'ID_Card_ScannerPro.jpg';
    
    // এখানে ০.৯৮ এর জায়গায় ১.০ করা হয়েছে ফুল কোয়ালিটির জন্য
    link.href = canvas.toDataURL('image/jpeg', 1.0); 
    link.click();
}

function resetIdCard() {
    idmLogoImg = null; idmStudentImg = null;
    document.querySelectorAll('.idm-inputs-side input').forEach(i => i.value = '');
    document.getElementById('idm-canvas').style.display = 'none';
    document.getElementById('idm-placeholder').style.display = 'flex';
    setIdLang('en'); setIdOrient('h');
}
;

function filterTools() {
    const input = document.getElementById('heroSearch') || document.getElementById('toolSearchInput');
    if (!input) return;
    const filter = input.value.toLowerCase().trim();
    const clearBtn = document.getElementById('clearSearch') || document.getElementById('heroClearSearch');
    const msg = document.getElementById('searchMessage');
    
    const allTools = document.querySelectorAll('.mode-card-btn');
    const allSeparators = document.querySelectorAll('.mode-separator');
    
    let foundCount = 0;

    if (clearBtn) {
        clearBtn.style.display = filter.length > 0 ? 'block' : 'none';
    }

    allTools.forEach(tool => {
        // Save original span text once
        const span = tool.querySelector('span');
        if (span && !tool._origSpanText) {
            tool._origSpanText = span.innerHTML;
        }

        if (filter.length === 0) {
            tool.style.setProperty('display', 'flex', 'important');
            tool.style.removeProperty('border-color');
            tool.style.removeProperty('box-shadow');
            if (span && tool._origSpanText) span.innerHTML = tool._origSpanText;
            return;
        }

        const toolText = tool.innerText.toLowerCase();
        const toolId = tool.id.toLowerCase();
        const dataEn = (tool.getAttribute('data-en') || '').toLowerCase();
        const dataBn = (tool.getAttribute('data-bn') || '').toLowerCase();
        const titleAttr = (tool.getAttribute('title') || '').toLowerCase();

        const match = toolText.includes(filter) || toolId.includes(filter) || dataEn.includes(filter) || dataBn.includes(filter) || titleAttr.includes(filter);

        if (match) {
            tool.style.setProperty('display', 'flex', 'important');
            tool.style.setProperty('border-color', '#f59e0b', 'important');
            tool.style.setProperty('box-shadow', '0 0 15px rgba(245, 158, 11, 0.4)', 'important');
            foundCount++;
            
            // Highlight text if span exists and filter >= 2 chars
            if (span && filter.length >= 2 && tool._origSpanText) {
                try {
                    const reg = new RegExp('(' + filter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
                    span.innerHTML = tool._origSpanText.replace(reg, '<mark style="background:#fef08a;color:#b45309;padding:0 3px;border-radius:4px;font-weight:bold;">$1</mark>');
                } catch(e) {
                    span.innerHTML = tool._origSpanText;
                }
            }
        } else {
            tool.style.setProperty('display', 'none', 'important');
        }
    });

    allSeparators.forEach(sep => {
        if (filter.length > 0) {
            sep.style.setProperty('display', 'none', 'important');
        } else {
            sep.style.setProperty('display', 'flex', 'important');
        }
    });

    if (msg) {
        if (filter.length > 0 && foundCount === 0) {
            msg.style.setProperty('display', 'block', 'important');
        } else {
            msg.style.setProperty('display', 'none', 'important');
        }
    }
}

function resetSearch() {
    const input = document.getElementById('heroSearch') || document.getElementById('toolSearchInput');
    const heroInput = document.getElementById('heroSearch');
    if (input) input.value = "";
    if (heroInput) heroInput.value = "";
    filterTools();
    if (input) input.focus();
}

window.triggerToolFromSearch = function(cardId) {
    const card = document.getElementById(cardId);
    if (card) {
        const sec = document.getElementById('tool-section');
        if (sec) sec.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
            card.click();
        }, 300);
    }
};
;

let bioPhotoBase64 = null;
let bioCurrentLang = 'en';
let bioType = 'job';

function openBiodataModal() {
    document.getElementById('biodataModal').style.display = 'flex';
    updateBioPreview();
}

function closeBiodataModal() {
    document.getElementById('biodataModal').style.display = 'none';
}

function setBioLang(lang) {
    bioCurrentLang = lang;
    document.getElementById('bio-en-btn').classList.toggle('active', lang === 'en');
    document.getElementById('bio-bn-btn').classList.toggle('active', lang === 'bn');
    updateBioPreview();
}

function setBioType(type) {
    bioType = type;
    document.getElementById('type-job-btn').classList.toggle('active', type === 'job');
    document.getElementById('type-marriage-btn').classList.toggle('active', type === 'marriage');
    document.getElementById('marriage-fields').style.display = type === 'marriage' ? 'grid' : 'none';
    document.getElementById('job-exp-group').style.display = type === 'marriage' ? 'none' : 'block';
    updateBioPreview();
}

function loadBioPhoto(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            bioPhotoBase64 = e.target.result;
            updateBioPreview();
        };
        reader.readAsDataURL(file);
    }
}

// ইনপুট ইভেন্ট লিসেনার
const inputIds = ['bio-name', 'bio-father', 'bio-mother', 'bio-dob', 'bio-religion', 'bio-edu', 'bio-exp', 'bio-addr', 'bio-phone', 'bio-email', 'bio-height', 'bio-blood'];
inputIds.forEach(id => {
    document.getElementById(id).addEventListener('input', updateBioPreview);
});

function updateBioPreview() {
    const renderArea = document.getElementById('bio-render-area');
    
    // টাইটেল সেট করা
    const titleObj = {
        job: { en: 'CURRICULUM VITAE', bn: 'জীবনবৃত্তান্ত' },
        marriage: { en: 'BIODATA', bn: 'বায়োডাটা' }
    };
    document.getElementById('pre-title').innerText = titleObj[bioType][bioCurrentLang];
    
    // নাম সেট করা
    document.getElementById('pre-name').innerText = document.getElementById('bio-name').value || (bioCurrentLang === 'bn' ? 'আপনার নাম' : 'YOUR NAME');
    
    // ছবি সেট করা
    if(bioPhotoBase64) {
        document.getElementById('pre-img-box').innerHTML = `<img src="${bioPhotoBase64}" style="width:100%; height:100%; object-fit:cover;">`;
    }

    // ডিটেইলস ডাটা
    const labels = bioCurrentLang === 'bn' ? 
        {f:'পিতার নাম', m:'মাতার নাম', d:'জন্ম তারিখ', r:'ধর্ম', h:'উচ্চতা', b:'রক্তের গ্রুপ', p:'ফোন', e:'ইমেইল'} : 
        {f:"Father's Name", m:"Mother's Name", d:'Date of Birth', r:'Religion', h:'Height', b:'Blood Group', p:'Phone', e:'Email'};

    let detailsHtml = `
        <b>${labels.f}:</b> ${document.getElementById('bio-father').value}<br>
        <b>${labels.m}:</b> ${document.getElementById('bio-mother').value}<br>
        <b>${labels.d}:</b> ${document.getElementById('bio-dob').value}<br>
        <b>${labels.r}:</b> ${document.getElementById('bio-religion').value}<br>
    `;
    
    if(bioType === 'marriage') {
        detailsHtml += `<b>${labels.h}:</b> ${document.getElementById('bio-height').value}<br>`;
        detailsHtml += `<b>${labels.b}:</b> ${document.getElementById('bio-blood').value}<br>`;
    }
    detailsHtml += `<b>${labels.p}:</b> ${document.getElementById('bio-phone').value}<br>`;
    detailsHtml += `<b>${labels.e}:</b> ${document.getElementById('bio-email').value}`;
    document.getElementById('pre-details').innerHTML = detailsHtml;

    // সেকশন ডাটা
    let sectionsHtml = `
        <div style="margin-top:15px; border-top:1px solid #eee; padding-top:10px;">
            <h3 style="font-size:14px; color:#7c3aed; margin-bottom:5px; border-bottom:1px solid #f3f0ff; display:inline-block;">${bioCurrentLang === 'bn' ? 'শিক্ষাগত যোগ্যতা' : 'Education'}</h3>
            <p style="white-space: pre-line; margin:0;">${document.getElementById('bio-edu').value}</p>
        </div>
    `;

    if(bioType === 'job') {
        sectionsHtml += `
            <div style="margin-top:15px;">
                <h3 style="font-size:14px; color:#7c3aed; margin-bottom:5px; border-bottom:1px solid #f3f0ff; display:inline-block;">${bioCurrentLang === 'bn' ? 'অভিজ্ঞতা ও দক্ষতা' : 'Experience & Skills'}</h3>
                <p style="white-space: pre-line; margin:0;">${document.getElementById('bio-exp').value}</p>
            </div>
        `;
    }

    sectionsHtml += `
        <div style="margin-top:15px;">
            <h3 style="font-size:14px; color:#7c3aed; margin-bottom:5px; border-bottom:1px solid #f3f0ff; display:inline-block;">${bioCurrentLang === 'bn' ? 'ঠিকানা' : 'Address'}</h3>
            <p style="white-space: pre-line; margin:0;">${document.getElementById('bio-addr').value}</p>
        </div>
    `;
    document.getElementById('pre-sections').innerHTML = sectionsHtml;
}

// পিডিএফ ডাউনলোড ফাংশন (নিখুঁত করার জন্য আপডেট করা হয়েছে)
async function downloadBiodataPDF() {
    const element = document.getElementById('bio-render-area');
    const btn = document.getElementById('download-btn');
    
    // বাটন সাময়িক পরিবর্তন
    const originalText = btn.innerHTML;
    btn.innerHTML = "Processing...";
    btn.style.opacity = "0.5";

    // পিডিএফ অপশন
    const opt = {
        margin: [10, 10, 10, 10],
        filename: 'Biodata_ScannerPro.pdf',
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { 
            scale: 3, 
            useCORS: true, 
            letterRendering: true,
            scrollX: 0,
            scrollY: 0
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
        // html2pdf রান করা
        await html2pdf().set(opt).from(element).save();
    } catch (error) {
        console.error("PDF Error:", error);
        alert("Could not generate PDF. Please try again.");
    } finally {
        btn.innerHTML = originalText;
        btn.style.opacity = "1";
    }
}

function resetBiodata() {
    // অ্যালার্ট ছাড়াই সরাসরি সব ইনপুট ক্লিয়ার করে দিবে
    inputIds.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.value = '';
    });
    
    bioPhotoBase64 = null;
    document.getElementById('pre-img-box').innerHTML = '<span style="color: #ccc; font-size: 10px;">Photo</span>';
    
    // প্রিভিউ আপডেট করে রিসেট অবস্থা দেখাবে
    updateBioPreview();
}
;

let translationMode = 'en-bn';

function openTranslatorModal() {
    setActiveMode('mode-translator');
    document.getElementById('translatorModal').style.display = 'flex';
}

// ক্লোজ করলে সম্পূর্ণ রিসেট হবে
function closeTranslatorModal() {
    document.getElementById('translatorModal').style.display = 'none';
    resetTranslator(); // রিসেট ফাংশন কল
}

// রিসেট ফাংশন
function resetTranslator() {
    translationMode = 'en-bn';
    document.getElementById('transInput').value = '';
    document.getElementById('transOutput').innerText = 'অনুবাদ এখানে দেখা যাবে...';
    document.getElementById('transInput').placeholder = 'Type English here...';
    
    // মোড লেবেল রিসেট
    const sourceLbl = document.getElementById('label-source');
    const targetLbl = document.getElementById('label-target');
    sourceLbl.innerText = 'ENGLISH';
    sourceLbl.style.color = '#4f46e5';
    targetLbl.innerText = 'BENGALI';
    targetLbl.style.color = '#059669';
    
    // বাটন রিসেট
    document.getElementById('copy-btn-text').innerText = 'Copy';
    document.getElementById('btn-swap').style.transform = 'rotate(0deg)';
}

function swapTranslationMode() {
    const sourceLbl = document.getElementById('label-source');
    const targetLbl = document.getElementById('label-target');
    const inputArea = document.getElementById('transInput');
    const outputArea = document.getElementById('transOutput');
    const swapBtn = document.getElementById('btn-swap');

    swapBtn.style.transform = swapBtn.style.transform === 'rotate(180deg)' ? 'rotate(0deg)' : 'rotate(180deg)';

    if (translationMode === 'en-bn') {
        translationMode = 'bn-en';
        sourceLbl.innerText = 'BENGALI';
        sourceLbl.style.color = '#059669';
        targetLbl.innerText = 'ENGLISH';
        targetLbl.style.color = '#4f46e5';
        inputArea.placeholder = 'এখানে বাংলা লিখুন...';
        outputArea.innerText = 'Translation will appear here...';
    } else {
        translationMode = 'en-bn';
        sourceLbl.innerText = 'ENGLISH';
        sourceLbl.style.color = '#4f46e5';
        targetLbl.innerText = 'BENGALI';
        targetLbl.style.color = '#059669';
        inputArea.placeholder = 'Type English here...';
        outputArea.innerText = 'অনুবাদ এখানে দেখা যাবে...';
    }
    inputArea.value = '';
}

async function processTranslation() {
    const text = document.getElementById('transInput').value.trim();
    const outputDiv = document.getElementById('transOutput');
    const btn = document.getElementById('btnTranslate');

    if (!text) return;

    let sl = 'en', tl = 'bn';
    if (translationMode === 'bn-en') {
        sl = 'bn'; tl = 'en';
    }

    try {
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
        outputDiv.innerHTML = translationMode === 'en-bn' ? "অনুবাদ করা হচ্ছে..." : "Translating...";

        const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(text)}`);
        const data = await response.json();

        let translatedText = "";
        data[0].forEach(item => {
            if (item[0]) translatedText += item[0];
        });

        outputDiv.innerText = translatedText;
    } catch (error) {
        outputDiv.innerHTML = "<span style='color:red;'>Error! Check internet.</span>";
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-bolt"></i> Translate Now';
    }
}

// কপি ফাংশন (অ্যালার্ট ছাড়া টেক্সট চেঞ্জ)
function copyTranslation() {
    const text = document.getElementById('transOutput').innerText;
    const btnText = document.getElementById('copy-btn-text');
    const placeholder = translationMode === 'en-bn' ? "অনুবাদ এখানে দেখা যাবে..." : "Translation will appear here...";

    if (text && text !== placeholder && !text.includes("Processing")) {
        navigator.clipboard.writeText(text).then(() => {
            btnText.innerText = "Copied!"; // টেক্সট পরিবর্তন
            
            // ২ সেকেন্ড পর আবার আগের লেখা ফিরিয়ে আনা
            setTimeout(() => {
                btnText.innerText = "Copy";
            }, 2000);
        });
    }
}
;

function openUnitModal() {
    setActiveMode('mode-unit-conv');
    document.getElementById('unitModal').style.display = 'flex';
}

function closeUnitModal() {
    document.getElementById('unitModal').style.display = 'none';
    resetUnitConverter();
}

// Reset Logic
function resetUnitConverter() {
    document.getElementById('h-feet').value = '';
    document.getElementById('h-inch').value = '';
    document.getElementById('w-kg').value = '';
    document.getElementById('res-cm').innerText = '0.00';
    document.getElementById('res-lbs').innerText = '0.00';
}

// Height Calculation (Feet/Inch to CM)
function calculateHeight() {
    const feet = parseFloat(document.getElementById('h-feet').value) || 0;
    const inch = parseFloat(document.getElementById('h-inch').value) || 0;
    
    // 1 foot = 30.48 cm, 1 inch = 2.54 cm
    const cm = (feet * 30.48) + (inch * 2.54);
    document.getElementById('res-cm').innerText = cm.toFixed(2);
}

// Weight Calculation (KG to Lbs)
function calculateWeight() {
    const kg = parseFloat(document.getElementById('w-kg').value) || 0;
    
    // 1 kg = 2.20462 lbs
    const lbs = kg * 2.20462;
    document.getElementById('res-lbs').innerText = lbs.toFixed(2);
}

// Copy Logic with Text Change (No Alert)
function copyUnitRes(elementId, btn) {
    const text = document.getElementById(elementId).innerText;
    const originalBtnText = btn.innerText;

    if (text && text !== "0.00") {
        navigator.clipboard.writeText(text).then(() => {
            btn.innerText = "Copied!"; // টেক্সট পরিবর্তন
            btn.style.background = "#059669"; // গ্রিন কালার (সফলতা বোঝাতে)

            // ২ সেকেন্ড পর আবার আগের অবস্থায় ফিরে আসবে
            setTimeout(() => {
                btn.innerText = originalBtnText;
                btn.style.background = (elementId === 'res-cm') ? "#0d9488" : "#475569";
            }, 2000);
        });
    }
}
;

let uploadedImages = [];

function openScannerModal() {
setActiveMode('mode-scanner');
    document.getElementById('scannerModal').style.display = 'flex';
}

function openBnConverterModal() {
setActiveMode('mode-bn-converter');
    document.getElementById('bnConverterModal').style.display = 'flex';
}


function openWeddingModal() {
setActiveMode('mode-wedding');
    document.getElementById('weddingModal').style.display = 'flex';
    updateWedCard();
}


function njpro_openModal() {
    setActiveMode('njpro_launcher_btn');
    document.getElementById('njpro_main_modal').style.display = 'flex';
}


function openBiodataModal() {
    setActiveMode('mode-cv-maker');
    document.getElementById('biodataModal').style.display = 'flex';
    updateBioPreview();
}

function openImgPdfModal() {
    setActiveMode('mode-img-pdf');
    document.getElementById('imgPdfModal').style.display = 'flex';
}

function closeImgPdfModal() {
    document.getElementById('imgPdfModal').style.display = 'none';
    resetPdfTool();
}

function resetPdfTool() {
    uploadedImages = [];
    document.getElementById('imgPdfInput').value = '';
    document.getElementById('pdf-preview-container').innerHTML = '';
    document.getElementById('pdf-actions').style.display = 'none';
}

function handleImageUpload(event) {
    const files = event.target.files;
    const previewContainer = document.getElementById('pdf-preview-container');
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) continue;

        const reader = new FileReader();
        reader.onload = function(e) {
            const imgData = e.target.result;
            uploadedImages.push(imgData);

            // প্রিভিউ তৈরি (এখানে &#215; ব্যবহার করা হয়েছে)
            const div = document.createElement('div');
            div.style.position = 'relative';
            div.className = 'img-preview-item';
            div.innerHTML = `
                <img src="${imgData}" style="width: 100%; height: 100px; object-fit: cover; border-radius: 8px; border: 1px solid #e2e8f0;">
                <span onclick="removeImageFromPdf(${uploadedImages.length - 1})" style="position: absolute; top: -5px; right: -5px; background: #ef4444; color: white; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; cursor: pointer; font-weight: bold; border: 2px solid white;">&#215;</span>
            `;
            previewContainer.appendChild(div);
            updatePdfUI();
        };
        reader.readAsDataURL(file);
    }
}

function removeImageFromPdf(index) { // ফাংশনের নাম পরিবর্তন করা হয়েছে
    uploadedImages.splice(index, 1);
    renderPreviews();
    updatePdfUI();
}

function renderPreviews() {
    const previewContainer = document.getElementById('pdf-preview-container');
    previewContainer.innerHTML = '';
    uploadedImages.forEach((img, i) => {
        const div = document.createElement('div');
        div.style.position = 'relative';
        div.innerHTML = `
            <img src="${img}" style="width: 100%; height: 100px; object-fit: cover; border-radius: 8px; border: 1px solid #e2e8f0;">
            <span onclick="removeImageFromPdf(${i})" style="position: absolute; top: -5px; right: -5px; background: #ef4444; color: white; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; cursor: pointer; font-weight: bold; border: 2px solid white;">&#215;</span>
        `;
        previewContainer.appendChild(div);
    });
}

function updatePdfUI() {
    const actions = document.getElementById('pdf-actions');
    const countText = document.getElementById('imgCount');
    actions.style.display = uploadedImages.length > 0 ? 'block' : 'none';
    countText.innerText = `Total: ${uploadedImages.length} Images`;
}

async function generatePDF() {
    if (uploadedImages.length === 0) return;
    const { jsPDF } = window.jspdf;
    const btn = document.getElementById('btnGeneratePdf');
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generating...';

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    for (let i = 0; i < uploadedImages.length; i++) {
        if (i > 0) pdf.addPage();
        const imgProps = pdf.getImageProperties(uploadedImages[i]);
        const ratio = Math.min(pdfWidth / imgProps.width, pdfHeight / imgProps.height);
        const width = imgProps.width * ratio;
        const height = imgProps.height * ratio;
        pdf.addImage(uploadedImages[i], 'JPEG', (pdfWidth - width) / 2, (pdfHeight - height) / 2, width, height);
    }

    pdf.save(`Studio_Hub_${Date.now()}.pdf`);
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-check"></i> Downloaded!';
    setTimeout(() => { btn.innerHTML = '<i class="fa-solid fa-file-export"></i> Download PDF'; }, 2000);
}
;

let psImages = [null, null, null, null, null];

// Real Size in mm
const PP_W = 38.1; // 1.5 inch
const PP_H = 48.26; // 1.9 inch
const ST_W = 22;
const ST_H = 27;
const JP_W = 48.26; // 1.9 inch (Joint Photo Width)
const JP_H = 38.1;  // 1.5 inch (Joint Photo Height)

function openPhotoSheetModal() {
    if(typeof setActiveMode === 'function') setActiveMode('mode-photo-sheet');
    document.getElementById('photoSheetModal').style.display = 'flex';
}

function closePhotoSheetModal() {
    document.getElementById('photoSheetModal').style.display = 'none';
    resetPhotoSheet();
}

function resetPhotoSheet() {
    for(let i=0; i<5; i++) removePsImage(i);
}

function loadPsImage(event, index) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            psImages[index] = e.target.result;
            const idx = index + 1;
            document.getElementById('prev' + idx).src = e.target.result;
            document.getElementById('prev' + idx).style.display = 'flex';
            document.getElementById('plus' + idx).style.display = 'none';
            document.getElementById('delBtn' + idx).style.display = 'flex';
            document.getElementById('psActionBtns').style.display = 'flex';
            updatePsPreview();
        }
        reader.readAsDataURL(file);
    }
}

function removePsImage(index) {
    psImages[index] = null;
    const idx = index + 1;
    document.getElementById('psInput' + idx).value = '';
    document.getElementById('prev' + idx).style.display = 'none';
    document.getElementById('plus' + idx).style.display = 'flex';
    document.getElementById('delBtn' + idx).style.display = 'none';
    
    if(psImages.filter(x => x !== null).length === 0) 
        document.getElementById('psActionBtns').style.display = 'none';
    updatePsPreview();
}

function getDynamicCoords() {
    const margin = 0.53; // 2px Margin
    let currentY = margin;
    const hGap = 2.5; 
    const vGap = 3.5; 
    let coords = [];
    let limitReached = false;

    for (let i = 0; i < 5; i++) {
        const img = psImages[i];
        const layout = document.getElementById('layout' + (i + 1)).value;
        
        if (img && layout !== 'none') {
            if (currentY + PP_H > 296) { limitReached = true; break; }

            if (layout === '5pp') {
                for (let c = 0; c < 5; c++) coords.push({ w: PP_W, h: PP_H, x: margin + (c * (PP_W + hGap)), y: currentY, img: img });
                currentY += (PP_H + vGap);
            } 
            else if (layout === '4jp') {
                for (let c = 0; c < 4; c++) coords.push({ w: JP_W, h: JP_H, x: margin + (c * (JP_W + hGap)), y: currentY, img: img });
                currentY += (JP_H + vGap);
            }
            else if (layout === '8jp') {
                for (let r = 0; r < 2; r++) {
                    if (currentY + JP_H > 296) { limitReached = true; break; }
                    for (let c = 0; c < 4; c++) coords.push({ w: JP_W, h: JP_H, x: margin + (c * (JP_W + hGap)), y: currentY, img: img });
                    currentY += (JP_H + vGap);
                }
            }
            else if (layout === '3pp_3st') {
                for (let c = 0; c < 3; c++) coords.push({ w: PP_W, h: PP_H, x: margin + (c * (PP_W + hGap)), y: currentY, img: img });
                for (let c = 0; c < 3; c++) coords.push({ w: ST_W, h: ST_H, x: margin + (3 * (PP_W + hGap)) + (c * (ST_W + hGap)), y: currentY, img: img });
                currentY += (PP_H + vGap);
            }
            else if (layout === '8st') {
                for (let c = 0; c < 8; c++) coords.push({ w: ST_W, h: ST_H, x: margin + (c * (ST_W + hGap)), y: currentY, img: img });
                currentY += (ST_H + vGap);
            }
            else if (layout === '10pp') {
                for (let r = 0; r < 2; r++) {
                    if (currentY + PP_H > 296) { limitReached = true; break; }
                    for (let c = 0; c < 5; c++) coords.push({ w: PP_W, h: PP_H, x: margin + (c * (PP_W + hGap)), y: currentY, img: img });
                    currentY += (PP_H + vGap);
                }
            }
        }
    }
    return { coords, limitReached };
}

function updatePsPreview() {
    const previewArea = document.getElementById('a4-preview-area');
    const result = getDynamicCoords();
    const coords = result.coords;
    
    document.getElementById('limitWarning').style.display = result.limitReached ? 'block' : 'none';
    document.getElementById('footerNote').style.display = result.limitReached ? 'block' : 'none';

    previewArea.innerHTML = ''; 
    if(coords.length === 0) {
        previewArea.innerHTML = '<p style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #94a3b8; font-size: 12px;">No Image Selected</p>';
        return;
    }

    const scale = previewArea.clientWidth / 210; 
    coords.forEach(p => {
        const div = document.createElement('div');
        div.style.position = 'absolute';
        div.style.width = (p.w * scale) + 'px';
        div.style.height = (p.h * scale) + 'px';
        div.style.left = (p.x * scale) + 'px';
        div.style.top = (p.y * scale) + 'px';
        div.style.backgroundImage = "url(" + p.img + ")";
        div.style.backgroundSize = 'cover';
        div.style.backgroundPosition = 'center';
        if(document.getElementById('psBorder').checked) div.style.border = '0.5px solid #000';
        previewArea.appendChild(div);
    });
}

function directPrintSheet() {
    const { coords } = getDynamicCoords();
    if(coords.length === 0) return;
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><style>@page { margin: 0; size: A4; } body { margin: 0; padding: 0; }</style></head><body>');
    coords.forEach(p => {
        let border = document.getElementById('psBorder').checked ? 'border: 0.1mm solid #ccc;' : '';
        printWindow.document.write(`<div style="position: absolute; left: ${p.x}mm; top: ${p.y}mm; width: ${p.w}mm; height: ${p.h}mm; ${border}"><img src="${p.img}" style="width: 100%; height: 100%; object-fit: cover;"></div>`);
    });
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    setTimeout(() => { printWindow.print(); printWindow.close(); }, 500);
}

async function generatePhotoSheetPDF() {
    const { jsPDF } = window.jspdf;
    const { coords } = getDynamicCoords();
    if(coords.length === 0) return;
    const pdf = new jsPDF('p', 'mm', 'a4');
    coords.forEach(p => {
        pdf.addImage(p.img, 'JPEG', p.x, p.y, p.w, p.h);
        if(document.getElementById('psBorder').checked) {
            pdf.setDrawColor(200, 200, 200); pdf.setLineWidth(0.1); pdf.rect(p.x, p.y, p.w, p.h);
        }
    });
    pdf.save("PhotoSheet_seba.pro.bd.pdf");
}
;

function openSigPadModal() {
    if(typeof setActiveMode === 'function') setActiveMode('mode-sig-pad');
    document.getElementById('sigPadModal').style.display = 'flex';
    initSpCanvas();
}

function closeSigPadModal() {
    document.getElementById('sigPadModal').style.display = 'none';
}

let spCanvas, spCtx;
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let spLang = 'en';

const spLabels = {
    "en": { title: "Digital Signature Pad", clear: "Clear", save: "Save PNG", close: "Close", hint: "Sign inside the box above using your Mouse or Finger", note: "The signature will be saved as a high-quality transparent PNG, perfect for online forms and documents." },
    "bn": { title: "ডিজিটাল সিগনেচার প্যাড", clear: "মুছে ফেলুন", save: "সেভ পিএনজি", close: "বন্ধ করুন", hint: "মাউস বা আঙুল দিয়ে উপরের বক্সের ভেতরে স্বাক্ষর করুন", note: "স্বাক্ষরটি স্বচ্ছ পিএনজি হিসেবে সেভ হবে, যা অনলাইন ফর্ম এবং ডকুমেন্টের জন্য উপযুক্ত।" }
};

function setSpLang(l) {
    spLang = l;
    document.getElementById('sp-en-btn').classList.toggle('active', l === 'en');
    document.getElementById('sp-bn-btn').classList.toggle('active', l === 'bn');
    const m = spLabels[l];
    document.getElementById('sp-title').innerText = m.title;
    document.getElementById('txt-sp-clear').innerText = m.clear;
    document.getElementById('txt-sp-save').innerText = m.save;
    document.getElementById('txt-sp-close').innerText = m.close;
    document.getElementById('sp-hint').innerText = m.hint;
    document.getElementById('sp-note-text').innerText = m.note;
}

function initSpCanvas() {
    spCanvas = document.getElementById('sp-canvas');
    spCtx = spCanvas.getContext('2d');
    
    const wrapper = document.getElementById('sp-canvas-wrapper');
    // Ensure canvas matches wrapper size
    spCanvas.width = wrapper.clientWidth;
    spCanvas.height = 300; 

    spCtx.lineCap = 'round';
    spCtx.lineJoin = 'round';
    updateSpSettings();

    // Mouse Events
    spCanvas.addEventListener('mousedown', startSpDrawing);
    spCanvas.addEventListener('mousemove', drawSpMove);
    window.addEventListener('mouseup', stopSpDrawing);

    // Touch Events (Improved for mobile)
    spCanvas.addEventListener('touchstart', (e) => {
        const rect = spCanvas.getBoundingClientRect();
        const touch = e.touches[0];
        startSpDrawing({ 
            offsetX: touch.clientX - rect.left, 
            offsetY: touch.clientY - rect.top 
        });
        e.preventDefault();
    }, { passive: false });

    spCanvas.addEventListener('touchmove', (e) => {
        const rect = spCanvas.getBoundingClientRect();
        const touch = e.touches[0];
        drawSpMove({ 
            offsetX: touch.clientX - rect.left, 
            offsetY: touch.clientY - rect.top 
        });
        e.preventDefault();
    }, { passive: false });

    spCanvas.addEventListener('touchend', stopSpDrawing);
}

function updateSpSettings() {
    spCtx.strokeStyle = document.getElementById('sp-color').value;
    spCtx.lineWidth = document.getElementById('sp-weight').value;
}

function startSpDrawing(e) {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

function drawSpMove(e) {
    if (!isDrawing) return;
    spCtx.beginPath();
    spCtx.moveTo(lastX, lastY);
    spCtx.lineTo(e.offsetX, e.offsetY);
    spCtx.stroke();
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

function stopSpDrawing() {
    isDrawing = false;
}

function clearSpPad() {
    spCtx.clearRect(0, 0, spCanvas.width, spCanvas.height);
}

// Function to crop the signature (removes extra empty space)
function trimCanvas(canvas) {
    const context = canvas.getContext('2d');
    const imgData = context.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imgData.data;
    let minX = canvas.width, minY = canvas.height, maxX = 0, maxY = 0;

    // Find the boundary of drawn signature
    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            const index = (y * canvas.width + x) * 4;
            const alpha = pixels[index + 3];
            if (alpha > 0) {
                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
                if (y < minY) minY = y;
                if (y > maxY) maxY = y;
            }
        }
    }

    // Check if canvas is empty
    if (maxX < minX || maxY < minY) return null;

    // Add small padding (10px)
    const pad = 10;
    const finalWidth = (maxX - minX) + (pad * 2);
    const finalHeight = (maxY - minY) + (pad * 2);

    const trimmed = document.createElement('canvas');
    trimmed.width = finalWidth;
    trimmed.height = finalHeight;
    const trimmedCtx = trimmed.getContext('2d');

    trimmedCtx.drawImage(canvas, minX, minY, maxX - minX, maxY - minY, pad, pad, maxX - minX, maxY - minY);
    return trimmed;
}

function downloadSpPad() {
    const trimmedCanvas = trimCanvas(spCanvas);
    
    if (!trimmedCanvas) {
        alert(spLang === 'en' ? "Please draw a signature first!" : "অনুগ্রহ করে আগে স্বাক্ষর করুন!");
        return;
    }

    const link = document.createElement('a');
    link.download = 'digital-signature.png';
    link.href = trimmedCanvas.toDataURL('image/png');
    link.click();
}
;

let noticeLang = "bn";

function openNoticeModal() {
    if(typeof setActiveMode === 'function') setActiveMode('mode-notice');
    document.getElementById('noticeModal').style.display = 'flex';
    setNoticeLang('bn'); 
}

function closeNoticeModal() {
    document.getElementById('noticeModal').style.display = 'none';
}

function setNoticeLang(lang) {
    noticeLang = lang;
    document.getElementById('not-bn-btn').classList.toggle('active', lang === 'bn');
    document.getElementById('not-en-btn').classList.toggle('active', lang === 'en');
    
    const labels = {
        bn: {
            mTitle: "Ready Notice Maker Pro",
            inst: "প্রতিষ্ঠানের নাম", addr: "ঠিকানা", ref: "স্মারক নং", date: "তারিখ",
            subj: "নোটিশের বিষয়", body: "নোটিশের বিস্তারিত তথ্য", auth: "কর্তৃপক্ষের নাম ও পদবী",
            phInst: "প্রতিষ্ঠানের নাম লিখুন", phAddr: "অবস্থান/ঠিকানা", phRef: "স্মারক নম্বর",
            phSub: "নোটিশের বিষয় লিখুন", phBody: "এখানে বিস্তারিত লিখুন...", phAuth: "অধ্যক্ষ / পরিচালক",
            btnPrint: "প্রিন্ট করুন (A4)", btnReset: "সব মুছুন",
            defaultTitle: "নোটিশ"
        },
        en: {
            mTitle: "Ready Notice Maker Pro",
            inst: "Institution Name", addr: "Address", ref: "Ref No.", date: "Date",
            subj: "Notice Subject", body: "Notice Body Text", auth: "Authority Name & Title",
            phInst: "Example: ABC High School", phAddr: "Location", phRef: "REF/2024/01",
            phSub: "Ex: Holiday Notice", phBody: "Enter notice description here...", phAuth: "Principal / Manager",
            btnPrint: "Print A4 PDF", btnReset: "Clear All",
            defaultTitle: "NOTICE"
        }
    };

    const l = labels[lang];
    // UI Label Update
    document.getElementById('not-main-title').innerHTML = `<i class='fa-solid fa-bullhorn'/> ${l.mTitle}`;
    document.getElementById('lbl-not-inst').innerText = l.inst;
    document.getElementById('lbl-not-addr').innerText = l.addr;
    document.getElementById('lbl-not-ref').innerText = l.ref;
    document.getElementById('lbl-not-date').innerText = l.date;
    document.getElementById('lbl-not-subject').innerText = l.subj;
    document.getElementById('lbl-not-body').innerText = l.body;
    document.getElementById('lbl-not-auth').innerText = l.auth;
    
    // Placeholder Update
    document.getElementById('not-inst').placeholder = l.phInst;
    document.getElementById('not-addr').placeholder = l.phAddr;
    document.getElementById('not-ref').placeholder = l.phRef;
    document.getElementById('not-subject').placeholder = l.phSub;
    document.getElementById('not-body').placeholder = l.phBody;
    document.getElementById('not-auth').placeholder = l.phAuth;
    
    // Button Update
    document.getElementById('btn-not-print').innerHTML = `<i class='fa-solid fa-print'/> ${l.btnPrint}`;
    document.getElementById('btn-not-reset').innerHTML = `<i class='fa-solid fa-trash-can'/> ${l.btnReset}`;
    
    // Preview Title Update
    document.getElementById('p-title').innerText = l.defaultTitle;
    
    // Date Fix: English click must show English numerals
    document.getElementById('not-date').value = new Date().toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-GB');

    updateNotice();
}

function updateNotice() {
    const isBn = noticeLang === 'bn';
    document.getElementById('p-inst').innerText = document.getElementById('not-inst').value || (isBn ? "প্রতিষ্ঠানের নাম" : "INSTITUTION NAME");
    document.getElementById('p-addr').innerText = document.getElementById('not-addr').value || (isBn ? "এখানে ঠিকানা লিখুন" : "Address Line Here");
    document.getElementById('p-ref').innerText = (isBn ? "স্মারক: " : "Ref: ") + (document.getElementById('not-ref').value || "...");
    document.getElementById('p-date').innerText = (isBn ? "তারিখ: " : "Date: ") + (document.getElementById('not-date').value || "...");
    document.getElementById('p-subject').innerText = (isBn ? "বিষয়: " : "Subject: ") + (document.getElementById('not-subject').value || "...");
    document.getElementById('p-body').innerText = document.getElementById('not-body').value || (isBn ? "নোটিশের বিস্তারিত এখানে লিখুন..." : "Notice content here...");
    document.getElementById('p-auth').innerText = document.getElementById('not-auth').value || (isBn ? "স্বাক্ষর" : "Signature");
}

function printNotice() {
    const content = document.getElementById('a4-notice-preview').innerHTML;
    const win = window.open('', '', 'height=900,width=800');
    win.document.write('<html><head><title>Print Notice</title>');
    win.document.write('<style>@import url("https://fonts.maateen.me/solaiman-lipi/font.css"); @page { size: A4; margin: 20mm; } body{font-family: "SolaimanLipi", Arial, sans-serif; margin:0; padding:0;} #preview-content{display:flex; flex-direction:column; height: 257mm; box-sizing: border-box;} #p-inst{text-align:center; font-size:24px; text-transform: uppercase; margin:0;} #p-addr{text-align:center; margin-bottom:20px; font-size:14px;} #p-body{flex: 1; font-size:16px; line-height:1.6; text-align:justify; margin-bottom:20px;}</style>');
    win.document.write('</head><body>');
    win.document.write(content);
    win.document.write('</body></html>');
    win.document.close();
    setTimeout(() => { win.print(); win.close(); }, 700);
}

function resetNotice() {
    document.querySelectorAll('.notice-inputs input, .notice-inputs textarea').forEach(i => i.value = "");
    setNoticeLang(noticeLang);
}
;

let leafLang = "bn";
let textIsRotated = false;

let sizes = {
    title: 80,
    body: 30,
    footer: 40
};

function openLeafletModal() {
    if(typeof setActiveMode === 'function') setActiveMode('mode-leaflet');
    document.getElementById('leafletModal').style.display = 'flex';
    setLeafLang('bn'); 
}

function closeLeafletModal() {
    document.getElementById('leafletModal').style.display = 'none';
}

function changeSize(section, amount) {
    sizes[section] += amount;
    if(sizes[section] < 10) sizes[section] = 10;
    document.getElementById(section + '-size-val').innerText = sizes[section] + 'px';
    updateLeaflet();
}

function toggleTextRotation() {
    textIsRotated = !textIsRotated;
    const content = document.getElementById('leaflet-content-rotate');
    const page = document.getElementById('a4-portrait-page');
    if (textIsRotated) {
        content.style.transform = "rotate(90deg)";
        content.style.width = page.offsetHeight + "px";
        content.style.height = page.offsetWidth + "px";
    } else {
        content.style.transform = "rotate(0deg)";
        content.style.width = "100%";
        content.style.height = "100%";
    }
    updateLeaflet();
}

const leafletTemplates = {
    bn: {
        // --- টেলিকম ও ডিজিটাল সার্ভিস ---
        'mobile-banking': { title: "ডিজিটাল টেলিকম এন্ড সার্ভিস", body: "বিকাশ • নগদ • রকেট\nএখানে বিশ্বস্ততার সাথে সকল প্রকার\nমোবাইল ব্যাংকিং লেনদেন করা হয়।", footer: "প্রোপ্রাইটর: আব্দুল্লাহ - ০১৭১২-XXXXXX" },
        'recharge': { title: "মোবাইল রিচার্জ পয়েন্ট", body: "জিপি • রবি • বাংলালিংক\nএয়ারটেল • টেলিটক\nসকল সিমের ইন্টারনেট ও মিনিট অফার।", footer: "যোগাযোগ: ০১৮৩৪-XXXXXX" },
        'computer-serv': { title: "কম্পিউটার এন্ড ফটোস্ট্যাট", body: "কম্পোজ • প্রিন্ট • ফটোকপি\nছবি হতে ছবি • স্ক্যান • মেইল\nঅনলাইনে সকল চাকরির আবেদন করা হয়।", footer: "ঠিকানা: মেইন রোড, সখিপুর" },
        'nid-service': { title: "স্মার্ট অনলাইন সেবা কেন্দ্র", body: "এনআইডি কার্ড সংশোধন • জন্ম নিবন্ধন\nপাসপোর্ট আবেদন • টিন সার্টিফিকেট\nসকল অনলাইন ফর্ম নির্ভুলভাবে পূরণ করা হয়।", footer: "পরিচালনায়: ডিজিটাল সেন্টার" },
        'bill-pay': { title: "ইউটিলিটি বিল পে সেন্টার", body: "বিদ্যুৎ বিল • গ্যাস বিল • পানি বিল\nআকাশ ডিটিএইচ রিচার্জ করা হয়।\nসুলভ মূল্যে পল্লী বিদ্যুৎ বিল গ্রহণ করা হয়।", footer: "সকাল ৯টা হতে রাত ১০টা পর্যন্ত" },
        'it-solution': { title: "আইটি সলিউশন এন্ড ল্যাব", body: "সফটওয়্যার ইনস্টল • হার্ডওয়্যার রিপেয়ার\nউইন্ডোজ সেটআপ • নেটওয়ার্ক সেটআপ\nদক্ষ কারিগর দ্বারা মোবাইল সার্ভিসিং করা হয়।", footer: "কল করুন: ০১৫২১-XXXXXX" },
        'banking': { title: "এজেন্ট ব্যাংকিং কেন্দ্র", body: "ইসলামী ব্যাংক • ডাচ বাংলা ব্যাংক\nনতুন অ্যাকাউন্ট খোলা ও টাকা জমা দেওয়া হয়।\nযেকোনো ব্যাংকের টাকা তোলা যায়।", footer: "নির্ভরযোগ্য ব্যাংকিং সেবা" },
        'training': { title: "কম্পিউটার ট্রেনিং সেন্টার", body: "বেসিক অফিস • গ্রাফিক্স ডিজাইন\nফ্রিল্যান্সিং কোর্স • ডিজিটাল মার্কেটিং\nভর্তি চলছে! আসন সংখ্যা সীমিত।", footer: "স্থান: আইটি পার্ক একাডেমি" },
        'travel': { title: "ট্রাভেল এন্ড ট্যুরস গাইড", body: "এয়ার টিকিট • ভিসা প্রসেসিং\nহজ্জ ও ওমরাহ প্যাকেজ বুকিং দেওয়া হয়।\nভারত ও দুবাই ট্যুরিস্ট ভিসা সহায়তা।", footer: "হটলাইন: ০১৯১১-XXXXXX" },
        'photostate': { title: "জরুরি ফটোকপি ও প্রিন্টিং", body: "সাদা-কাল ও রঙিন ফটোকপি\nলেমিনেশন ও বই বাইন্ডিং করা হয়।\nঅফিশিয়াল ডকুমেন্টস প্রিন্ট করা হয়।", footer: "দ্রুত ও পরিচ্ছন্ন সেবা" },
        'admission': { title: "অনলাইন ভর্তি সহায়তা", body: "স্কুল-কলেজ ও ভার্সিটি ভর্তি\nঅনার্স-মাস্টার্স ফর্ম পূরণ\nসকল পরীক্ষার রেজাল্ট প্রদান করা হয়।", footer: "অপারেটর: সাইদুর রহমান" },
        'ticket': { title: "বাস ও ট্রেন টিকিট সেন্টার", body: "এনা • হানিফ • গ্রীন লাইন\nসকল রুটের টিকিট পাওয়া যায়।\nট্রেনের অগ্রিম অনলাইন টিকিট সেবা।", footer: "কল: ০১৬৭৭-XXXXXX" },
        'gift': { title: "টেলিকম এন্ড গিফট শপ", body: "মোবাইল এক্সেসরিজ • গিফট আইটেম\nজন্মদিনের গিফট প্যাক পাওয়া যায়।\nস্টেশনারি ও কসমেটিকস সামগ্রী।", footer: "স্বত্বাধিকারী: মা টেলিকম" },
        'electric': { title: "ইলেক্ট্রিক্যাল সার্ভিসিং", body: "ফ্যান রিপেয়ার • লাইট ফিটিং\nবিল্ডিং ওয়ারিং এর কাজ করা হয়।\nইলেক্ট্রিক মালামাল সুলভ মূল্যে বিক্রয়।", footer: "যোগাযোগ: ০১৭০০-XXXXXX" },
        'cctv-service': { title: "সিসিটিভি ক্যামেরা সলিউশন", body: "ক্যামেরা বিক্রয় ও ইনস্টলেশন\nবাসা ও দোকানের নিরাপত্তা নিশ্চিত করুন।\nঅত্যাধুনিক আইপি ক্যামেরা সেটআপ।", footer: "নিরাপত্তা সবার আগে" },
        'graphic': { title: "ডিজাইন ও কালার প্রিন্ট", body: "ব্যানার • ভিজিটিং কার্ড • লিফলেট\nবিয়ে ও দাওয়াতের কার্ড তৈরি করা হয়।\nপ্রফেশনাল গ্রাফিক্স ডিজাইন সার্ভিস।", footer: "যোগাযোগ: ০১৮০০-XXXXXX" },
        'passport': { title: "পাসপোর্ট ও ভিসা গাইড", body: "নতুন পাসপোর্ট আবেদন সেবা\nপাসপোর্ট রিনিউয়াল সাপোর্ট\nপুলিশ ভেরিফিকেশন ও পরামর্শ।", footer: "ঠিকানা: থানা রোড সংলগ্ন" },
        'solar': { title: "সোলার এন্ড ব্যাটারি হাউস", body: "সোলার প্যানেল • আইপিএস ব্যাটারি\nআইপিএস সার্ভিসিং ও সেলস।\n১ বছরের গ্যারান্টি সহ বিক্রয়।", footer: "কল: ০১৫০০-XXXXXX" },
        'internet': { title: "ব্রডব্যান্ড ইন্টারনেট সংযোগ", body: "নতুন কানেকশন • হাই স্পিড ব্যান্ডউইথ\n৫ এমবিপিএস হতে ১০০ এমবিপিএস।\nনিরবিচ্ছিন্ন ও বাফার মুক্ত ইন্টারনেট।", footer: "আইএসপি প্রোভাইডার" },
        'studio': { title: "ডিজিটাল ফটো স্টুডিও", body: "পাসপোর্ট সাইজ ছবি (৫ মিনিটে)\nছবি এডিটিং ও ব্যাকগ্রাউন্ড পরিবর্তন।\nরঙিন ও হাই কোয়ালিটি ফটো প্রিন্ট।", footer: "ফটোগ্রাফার: রাজিব হাসান" },

        // --- বাসা ভাড়া ও সাধারণ নোটিশ ---
        'to-let': { title: "বাসা ভাড়া", body: "২ রুম, ড্রয়িং, ডাইনিং, কিচেন ও বাথরুমসহ ছিমছাম ফ্ল্যাট ভাড়া দেওয়া হবে।\n(শুধুমাত্র ছোট পরিবার)", footer: "যোগাযোগ: ০১৭১২-৩৪৫৬৭৮" },
        'sublet': { title: "সাবলেট ভাড়া", body: "আগামী মাস থেকে ১টি বড় রুম (সংযুক্ত বাথরুম ও বারান্দাসহ) সাবলেট দেওয়া হবে।\nবিদ্যুৎ ও পানি বিল ফিক্সড।", footer: "যোগাযোগ: ০১৬XXXXXXXX" },
        'shop-rent': { title: "দোকান ভাড়া", body: "বাজারের মেইন রোডে নিচতলায় একটি সুপরিসর দোকান ঘর দীর্ঘ মেয়াদী ভাড়া দেওয়া হবে।", footer: "যোগাযোগ করুন: ০১৯XXXXXXXX" },
        'office-rent': { title: "অফিস ভাড়া", body: "১২০০ স্কয়ার ফিটের একটি সুপরিসর কমার্শিয়াল স্পেস অফিস হিসেবে ভাড়া দেওয়া হবে।", footer: "Call: 017XXXXXXXX" },
        'garage-rent': { title: "গ্যারেজ ভাড়া", body: "একটি প্রাইভেট কার বা বাইক রাখার জন্য নিরাপদ ও সিসিটিভি নিয়ন্ত্রিত গ্যারেজ খালি আছে।", footer: "যোগাযোগ: ০১৭XXXXXXXX" },
        'hostel': { title: "ছাত্রাবাস", body: "ছাত্রদের থাকার জন্য ছিমছাম ও মনোরম পরিবেশে সিট খালি আছে।\n(ওয়াইফাই ও মিল সিস্টেম সুবিধা আছে)", footer: "যোগাযোগ: ০১৫XXXXXXXX" },
        'teacher': { title: "শিক্ষক চাই", body: "অষ্টম ও দশম শ্রেণীর ছাত্রকে পড়ানোর জন্য একজন অভিজ্ঞ গৃহশিক্ষক আবশ্যক।\nবিষয়: গণিত ও বিজ্ঞান।", footer: "মোবাইল: ০১৮৩৪-০৩০৫৪৪" },
        'staff-wanted': { title: "লোক আবশ্যক", body: "দোকান পরিচালনার জন্য ২ জন চটপটে সেলসম্যান আবশ্যক।\nবেতন আলোচনা সাপেক্ষে।", footer: "সাক্ষাৎকার চলছে" },
        'no-parking': { title: "গাড়ি রাখা নিষেধ", body: "এখানে গাড়ি পার্কিং করা সম্পূর্ণ নিষেধ।\nআদেশক্রমে কর্তৃপক্ষ।", footer: "গাড়ি রাখবেন না" },
        'no-entry': { title: "প্রবেশ নিষেধ", body: "অনুমতি ব্যতীত ভিতরে প্রবেশ সম্পূর্ণ নিষেধ।", footer: "কর্তৃপক্ষ" },
        'cctv-alert': { title: "সতর্কবার্তা", body: "আপনি এখন সিসিটিভি ক্যামেরার আওতাধীন আছেন।", footer: "সিসিটিভি ক্যামেরা চলছে" },
        'shoes': { title: "জুতা বাহিরে রাখুন", body: "পবিত্রতা বজায় রাখতে আপনার জুতা অনুগ্রহ করে বাহিরে নির্দিষ্ট স্থানে রাখুন।", footer: "ধন্যবাদ" },
        'discount': { title: "বিরাট মূল্যছাড়", body: "সকল পণ্যের উপর ৫০% পর্যন্ত বিশেষ মূল্যছাড় চলছে! আজই চলে আসুন।", footer: "সীমিত সময়ের জন্য" },
        'danger': { title: "সাবধান!", body: "উচ্চ ভোল্টেজ এলাকা। বৈদ্যুতিক তার স্পর্শ করা বিপদজনক।", footer: "বিপদ এড়ান" },
        'silence': { title: "নীরবতা বজায় রাখুন", body: "হাসপাতাল এলাকা, হর্ন বাজানো নিষেধ।\nঅনুগ্রহ করে নীরবতা বজায় রাখুন।", footer: "ধন্যবাদ" },
        'no-smoking': { title: "ধূমপান নিষেধ", body: "এটি একটি ধূমপান মুক্ত এলাকা। এখানে ধূমপান করা আইনত দণ্ডনীয় অপরাধ।", footer: "ধূমপান ত্যাগ করুন" },
        'house-sale': { title: "বাড়ি বিক্রয়", body: "৩ শতাংশ জমির উপর নির্মিত ২ তলা একটি সুদৃশ্য বাড়ি জরুরি ভিত্তিতে বিক্রয় করা হবে।", footer: "যোগাযোগ: ০১৭১২-XXXXXX" },
        'dog': { title: "কুকুর হতে সাবধান", body: "ভিতরে প্রবেশের আগে সতর্ক হোন। গেটের ভিতরে কুকুর আছে।", footer: "সতর্ক থাকুন" },
        'mask': { title: "জরুরি নির্দেশিকা", body: "মাস্ক ব্যতীত প্রবেশ নিষেধ। আপনার ও আপনার পরিবারের সুরক্ষা নিশ্চিত করুন।", footer: "মাস্ক পরুন" },
        'coaching': { title: "ভর্তি চলছে", body: "নতুন ব্যাচে ৬ষ্ঠ থেকে ১০ম শ্রেণী পর্যন্ত ভর্তি চলছে। স্পেশাল কেয়ার ও সাপ্তাহিক পরীক্ষা।", footer: "স্থান: এ বি সি কোচিং সেন্টার" },
        'arabic': { title: "কুরআন শিক্ষা", body: "সহিহ শুদ্ধভাবে কুরআন শিক্ষার জন্য একজন অভিজ্ঞ হাফেজ সাহেব/শিক্ষক আবশ্যক।", footer: "ফোন: ০১৭১XXXXXXX" },
        'opening': { title: "শুভ উদ্বোধন", body: "আগামী শুক্রবার আমাদের শোরুমের শুভ উদ্বোধন উপলক্ষে সবাইকে আমন্ত্রণ ও স্পেশাল গিফট।", footer: "স্থান: সিটি সেন্টার মার্কেট" },
        'buy-one-get-one': { title: "বিরাট অফার", body: "১টি কিনলে ১টি ফ্রি! সীমিত সময়ের জন্য এই অফারটি সকল পোশাকে প্রযোজ্য।", footer: "আজই ভিজিট করুন" },
        'blood-needed': { title: "রক্তের প্রয়োজন", body: "জরুরি ভিত্তিতে ১ ব্যাগ পজেটিভ (B+) রক্ত প্রয়োজন।\nরোগী: ঢাকা মেডিকেল কলেজে চিকিৎসাধীন।", footer: "যোগাযোগ: ০১৭XXXXXXXX" },
        'lost-found': { title: "হারিয়ে গেছে", body: "একটি কালো রঙের মানিব্যাগ যার ভেতর জরুরি ডকুমেন্টস ছিল তা হারিয়ে গেছে। কেউ পেলে যোগাযোগ করুন।", footer: "পুরস্কার দেওয়া হবে" },
        'milad': { title: "মিলাদ মাহফিল", body: "আগামী ১০ই মে বাদ মাগরিব আমাদের বাসভবনে এক দোয়া ও মিলাদ মাহফিলের আয়োজন করা হয়েছে।", footer: "আমন্ত্রণে: আবুল কাশেম" },
        'wifi': { title: "WiFi পাসওয়ার্ড", body: "এই প্রতিষ্ঠানের ফ্রি ওয়াইফাই ব্যবহার করতে নিচের পাসওয়ার্ডটি দিন।\nPassword: user1234", footer: "ধন্যবাদ - কর্তৃপক্ষ" },
        'garbage': { title: "ময়লা ফেলবেন না", body: "এখানে ময়লা আবর্জনা ফেলা সম্পূর্ণ নিষেধ। আইন ভঙ্গকারীর বিরুদ্ধে ব্যবস্থা নেওয়া হবে।", footer: "আদেশক্রমে: সিটি কর্পোরেশন" },
        'toilet': { title: "টয়লেট", body: "পরিচ্ছন্নতা বজায় রাখুন। ব্যবহারের পর পানি ঢালুন। বাহিরে জুতা রাখুন।", footer: "ধন্যবাদ" },
        'maintenance': { title: "কাজ চলছে", body: "সতর্ক থাকুন! মেরামতের কাজ চলছে। বিকল্প রাস্তা ব্যবহার করুন।", footer: "বিপদ এড়ান" },
        'lift-out': { title: "লিফট বন্ধ", body: "যান্ত্রিক ত্রুটির কারণে লিফট সাময়িকভাবে বন্ধ আছে। সাময়িক অসুবিধার জন্য আমরা দুঃখিত।", footer: "আদেশক্রমে: কর্তৃপক্ষ" },
        'no-mobile': { title: "মোবাইল ব্যবহার নিষেধ", body: "জরুরি প্রয়োজন ব্যতীত এখানে মোবাইল ফোনে কথা বলা সম্পূর্ণ নিষেধ।", footer: "কর্তৃপক্ষ" },
        'clinic': { title: "ফ্রি চেকআপ", body: "আগামী রবিবার সকাল ১০টা থেকে দুপুর ২টা পর্যন্ত বিনামূল্যে ডায়াবেটিস পরীক্ষা করা হবে।", footer: "স্থান: মর্ডান ক্লিনিক" },
        'sale-off': { title: "বিরাট সেল", body: "দোকান ক্লোজিং উপলক্ষে সকল মালামাল উৎপাদন খরচে বিক্রয় করা হচ্ছে।", footer: "স্টক শেষ হওয়ার আগে আসুন" }
    },
    en: {
        // --- Telecom & Digital Services ---
        'mobile-banking': { title: "DIGITAL TELECOM & SERVICE", body: "bKash • Nagad • Rocket\nAll Types of Mobile Banking\nTransactions Done with Trust.", footer: "Proprietor: Abdullah - 01712-XXXXXX" },
        'recharge': { title: "RECHARGE POINT", body: "GP • Robi • Banglalink\nAirtel • Teletalk\nAll SIM Internet & Minute Offers.", footer: "Contact: 01834-XXXXXX" },
        'computer-serv': { title: "COMPUTER & PHOTOSTAT", body: "Compose • Print • Photocopy\nPhoto to Photo • Scan • Email\nAll Online Job Applications Done.", footer: "Address: Main Road, Sakhipur" },
        'nid-service': { title: "SMART ONLINE CENTER", body: "NID Correction • Birth Registration\nPassport Apply • TIN Certificate\nAll Online Forms Filled Accurately.", footer: "Operated by: Digital Center" },
        'bill-pay': { title: "UTILITY BILL PAY POINT", body: "Electricity • Gas • Water Bill\nAkash DTH Recharge Done.\nElectricity Bills Accepted Here.", footer: "9 AM to 10 PM Daily" },
        'it-solution': { title: "IT SOLUTION & LAB", body: "Software Install • Hardware Repair\nWindows Setup • Network Setup\nExpert Mobile & PC Servicing.", footer: "Call: 01521-XXXXXX" },
        'banking': { title: "AGENT BANKING CENTER", body: "Islami Bank • DBBL Agent\nAccount Opening & Cash Deposit.\nCash Withdraw from Any Bank.", footer: "Reliable Banking Services" },
        'training': { title: "COMPUTER TRAINING", body: "Basic Office • Graphics Design\nFreelancing • Digital Marketing\nAdmission Open! Limited Seats.", footer: "Venue: IT Park Academy" },
        'travel': { title: "TRAVEL & TOURS GUIDE", body: "Air Ticket • Visa Processing\nHajj & Umrah Packages Available.\nIndia & Dubai Tourist Visa Support.", footer: "Hotline: 01911-XXXXXX" },
        'photostate': { title: "PHOTOCOPY & PRINTING", body: "B&W & Color Photocopy\nLamination & Book Binding.\nOfficial Document Printing.", footer: "Fast & Clean Services" },
        'admission': { title: "ADMISSION ASSISTANCE", body: "College & Varsity Admission\nHonors & Masters Form Fill-up.\nAll Exam Results Provided.", footer: "Operator: Saidur Rahman" },
        'ticket': { title: "BUS & TRAIN TICKETS", body: "Ena • Hanif • Green Line\nAll Route Tickets Available.\nOnline Advance Booking.", footer: "Call: 01677-XXXXXX" },
        'gift': { title: "TELECOM & GIFT SHOP", body: "Mobile Accessories • Gift Items\nBirthday Gift Packs Available.\nStationery & Cosmetics Items.", footer: "Owner: MA Telecom" },
        'electric': { title: "ELECTRICAL SERVICING", body: "Fan Repair • Light Fitting\nBuilding Wiring Done Here.\nElectric Goods Sales & Service.", footer: "Contact: 01700-XXXXXX" },
        'cctv-service': { title: "CCTV CAMERA SOLUTION", body: "Camera Sales & Installation\nSecure Your Home & Shop.\nModern IP Camera Setup.", footer: "Security First" },
        'graphic': { title: "DESIGN & COLOR PRINT", body: "Banner • Visiting Card • Leaflet\nWedding & Invitation Cards.\nProfessional Graphics Design.", footer: "Contact: 01800-XXXXXX" },
        'passport': { title: "PASSPORT & VISA GUIDE", body: "New Passport Application Service\nPassport Renewal Support\nPolice Verification & Counseling.", footer: "Address: Near Thana Road" },
        'solar': { title: "SOLAR & BATTERY HOUSE", body: "Solar Panel • IPS Battery\nIPS Servicing & Sales.\nSold with 1 Year Warranty.", footer: "Call: 01500-XXXXXX" },
        'internet': { title: "BROADBAND INTERNET", body: "New Connection • High Speed\n5 Mbps to 100 Mbps Plans.\nUninterrupted Buffer-free Internet.", footer: "ISP Provider" },
        'studio': { title: "DIGITAL PHOTO STUDIO", body: "Passport Size Photo (5 Min)\nPhoto Editing & Background Change.\nHigh Quality Photo Prints.", footer: "Photographer: Rajib Hasan" },

        // --- Rentals & Notices ---
        'to-let': { title: "HOUSE FOR RENT", body: "A beautiful flat with 2 rooms, drawing, dining, kitchen, and bathroom will be rented. (Small family only)", footer: "Contact: 01712-345678" },
        'sublet': { title: "SUBLET FOR RENT", body: "1 large room with attached bathroom and balcony will be sublet from next month.", footer: "Contact: 016XXXXXXXX" },
        'shop-rent': { title: "SHOP FOR RENT", body: "A spacious ground floor shop on the main road is available for long-term rent.", footer: "Call: 019XXXXXXXX" },
        'office-rent': { title: "OFFICE RENT", body: "A spacious 1200 sq. ft. commercial space will be rented as an office.", footer: "Call: 017XXXXXXXX" },
        'garage-rent': { title: "GARAGE RENT", body: "Safe and CCTV-monitored parking space available for private cars or bikes.", footer: "Contact: 017XXXXXXXX" },
        'hostel': { title: "HOSTEL SEAT", body: "Seats are available in a clean hostel environment for students. (WiFi & Meal available)", footer: "Call: 015XXXXXXXX" },
        'teacher': { title: "TEACHER WANTED", body: "An experienced tutor is required for a student of Class 8 and 10. Subjects: Math & Science.", footer: "Mobile: 01834-030544" },
        'staff-wanted': { title: "STAFF WANTED", body: "2 smart salesmen are required for shop management. Salary negotiable.", footer: "INTERVIEW ONGOING" },
        'no-parking': { title: "NO PARKING", body: "Parking is strictly prohibited here. By order of the authority.", footer: "DO NOT PARK" },
        'no-entry': { title: "NO ENTRY", body: "Entry without permission is strictly prohibited.", footer: "AUTHORITY" },
        'cctv-alert': { title: "CCTV AREA", body: "You are under CCTV surveillance. Please be careful.", footer: "PROTECTED" },
        'shoes': { title: "SHOES OFF", body: "Please keep your shoes outside in the designated area.", footer: "THANK YOU" },
        'discount': { title: "BIG DISCOUNT", body: "Special discount up to 50% on all products! Visit us today.", footer: "LIMITED TIME" },
        'danger': { title: "DANGER!", body: "High voltage area. Touching electrical wires is dangerous.", footer: "DANGER 440V" },
        'silence': { title: "KEEP SILENCE", body: "Hospital area, blowing horn is prohibited. Please maintain silence.", footer: "SILENCE PLEASE" },
        'no-smoking': { title: "NO SMOKING", body: "This is a smoke-free area. Smoking here is a punishable offense.", footer: "DON'T SMOKE" },
        'house-sale': { title: "HOUSE FOR SALE", body: "A beautiful 2-story house built on 3 decimals of land is for urgent sale.", footer: "Call: 01712-XXXXXX" },
        'dog': { title: "BEWARE OF DOG", body: "Be careful before entering. There is a dog inside the gate.", footer: "WATCH OUT" },
        'mask': { title: "NOTICE", body: "No entry without a mask. Ensure the safety of yourself and your family.", footer: "WEAR A MASK" },
        'coaching': { title: "ADMISSION OPEN", body: "Admission ongoing for Class 6 to 10. Special care and weekly model tests.", footer: "At: ABC Coaching Center" },
        'arabic': { title: "ARABIC TEACHER", body: "An experienced tutor is required for teaching the Holy Quran with Tajweed.", footer: "Call: 017XXXXXXXX" },
        'opening': { title: "GRAND OPENING", body: "Join us for the grand opening of our new showroom. Gifts for first 50 visitors!", footer: "Venue: City Center Market" },
        'buy-one-get-one': { title: "SPECIAL OFFER", body: "Buy 1 Get 1 Free! This offer is valid on all clothing items for a limited time.", footer: "VISIT TODAY" },
        'blood-needed': { title: "BLOOD NEEDED", body: "Emergency 1 bag of B+ blood is needed for a patient at DMCH.", footer: "Contact: 017XXXXXXXX" },
        'lost-found': { title: "LOST ITEM", body: "A black wallet containing important documents was lost. Please contact if found.", footer: "REWARD WILL BE GIVEN" },
        'milad': { title: "Dua & Milad", body: "A Dua and Milad Mahfil has been organized at our residence this Friday after Maghrib.", footer: "Invited by: Abul Kashem" },
        'wifi': { title: "FREE WiFi", body: "To use our free WiFi, please use the following password.\nPassword: user1234", footer: "BY AUTHORITY" },
        'garbage': { title: "NO DUSTBIN", body: "Dumping garbage here is strictly prohibited. Violators will be prosecuted.", footer: "ORDER BY CITY CORP" },
        'toilet': { title: "TOILET", body: "Keep it clean. Use water after use. Leave your shoes outside.", footer: "THANK YOU" },
        'maintenance': { title: "UNDER REPAIR", body: "Work in progress. Please be careful and use the alternative route.", footer: "STAY SAFE" },
        'lift-out': { title: "LIFT OUT OF ORDER", body: "The lift is temporarily out of order due to maintenance. Sorry for the inconvenience.", footer: "BY AUTHORITY" },
        'no-mobile': { title: "NO MOBILE PHONES", body: "Using mobile phones is strictly prohibited here except for emergencies.", footer: "AUTHORITY" },
        'clinic': { title: "FREE CHECKUP", body: "Free diabetes screening will be held next Sunday from 10 AM to 2 PM.", footer: "Venue: Modern Clinic" },
        'sale-off': { title: "CLOSING SALE", body: "Everything must go! All items are being sold at production cost.", footer: "VISIT BEFORE STOCK ENDS" }
    }
};

function setLeafLang(lang) {
    leafLang = lang;
    document.getElementById('leaf-bn-btn').classList.toggle('active', lang === 'bn');
    document.getElementById('leaf-en-btn').classList.toggle('active', lang === 'en');
    
    const ui = {
        bn: { mainTitle: "A4 লিফলেট মেকার", rotate: "লেখা ঘোরান (৯০° ডিগ্রী)", temp: "টেমপ্লেট নির্বাচন করুন", title: "শিরোনাম / হেডলাইন", body: "বিস্তারিত তথ্য", footer: "যোগাযোগ / ফুটার", align: "এলাইনমেন্ট (Alignment)", print: "প্রিন্ট করুন (A4)", reset: "সব মুছুন", c: "মাঝখানে", l: "বামে", r: "ডানে" },
        en: { mainTitle: "A4 Leaflet Maker", rotate: "Rotate Text (90°)", temp: "Select Template", title: "Heading / Title", body: "Details Description", footer: "Contact / Footer", align: "Text Alignment", print: "Print (A4)", reset: "Clear All", c: "Center", l: "Left", r: "Right" }
    }[lang];

    document.getElementById('leaf-ui-main-title').innerHTML = "<i class='fa-solid fa-file-invoice'/> " + ui.mainTitle;
    document.getElementById('lbl-leaf-rotate').innerText = ui.rotate;
    document.getElementById('lbl-leaf-temp').innerText = ui.temp;
    document.getElementById('lbl-leaf-title').innerText = ui.title;
    document.getElementById('lbl-leaf-body').innerText = ui.body;
    document.getElementById('lbl-leaf-footer').innerText = ui.footer;
    document.getElementById('lbl-leaf-align').innerText = ui.align;
    document.getElementById('lbl-leaf-print').innerText = ui.print;
    document.getElementById('lbl-leaf-reset').innerText = ui.reset;
    document.getElementById('opt-center').innerText = ui.c;
    document.getElementById('opt-left').innerText = ui.l;
    document.getElementById('opt-right').innerText = ui.r;

    const select = document.getElementById('leaf-template-select');
    select.innerHTML = "";
    for (let key in leafletTemplates[lang]) {
        let opt = document.createElement('option');
        opt.value = key;
        opt.innerText = leafletTemplates[lang][key].title;
        select.appendChild(opt);
    }
    applyLeafTemplate(select.value);
}

function applyLeafTemplate(key) {
    const data = leafletTemplates[leafLang][key];
    document.getElementById('leaf-title').value = data.title;
    document.getElementById('leaf-body').value = data.body;
    document.getElementById('leaf-footer').value = data.footer;
    updateLeaflet();
}

function updateLeaflet() {
    const align = document.getElementById('leaf-align').value;
    const previewScale = 0.5;

    // শিরোনাম (Title)
    const titleEl = document.getElementById('lp-title');
    titleEl.innerText = document.getElementById('leaf-title').value;
    titleEl.style.fontSize = (sizes.title * previewScale) + "px";
    titleEl.style.color = document.getElementById('leaf-title-clr').value;
    titleEl.style.textAlign = align;

    // বডি (Body)
    const bodyEl = document.getElementById('lp-body');
    bodyEl.innerText = document.getElementById('leaf-body').value;
    bodyEl.style.fontSize = (sizes.body * previewScale) + "px";
    bodyEl.style.color = document.getElementById('leaf-body-clr').value;
    bodyEl.style.textAlign = align;
    // বডি যেহেতু ফ্লেক্সবক্স ব্যবহার করছে, তাই justify-content ও পরিবর্তন করতে হবে
    if(align === 'center') bodyEl.style.justifyContent = 'center';
    else if(align === 'left') bodyEl.style.justifyContent = 'flex-start';
    else if(align === 'right') bodyEl.style.justifyContent = 'flex-end';

    // ফুটার (Footer)
    const footerEl = document.getElementById('lp-footer');
    footerEl.innerText = document.getElementById('leaf-footer').value;
    footerEl.style.fontSize = (sizes.footer * previewScale) + "px";
    footerEl.style.color = document.getElementById('leaf-footer-clr').value;
    footerEl.style.borderTopColor = document.getElementById('leaf-footer-clr').value;
    footerEl.style.textAlign = align;
}

function printLeaflet() {
    const title = document.getElementById('leaf-title').value;
    const body = document.getElementById('leaf-body').value;
    const footer = document.getElementById('leaf-footer').value;
    const align = document.getElementById('leaf-align').value;
    const clrTitle = document.getElementById('leaf-title-clr').value;
    const clrBody = document.getElementById('leaf-body-clr').value;
    const clrFooter = document.getElementById('leaf-footer-clr').value;

    let flexAlign = align === 'center' ? 'center' : (align === 'left' ? 'flex-start' : 'flex-end');

    const win = window.open('', '', 'height=900,width=800');
    let rotationStyle = textIsRotated ? 
        `transform: rotate(90deg); width: 297mm; height: 210mm; position: absolute; top: 50%; left: 50%; margin-top: -105mm; margin-left: -148.5mm;` : 
        `width: 210mm; height: 297mm;`;

    win.document.write('<html><head><title>Print</title>');
    win.document.write('<style>@import url("https://fonts.maateen.me/solaiman-lipi/font.css"); body{margin:0; padding:0; background:#fff;} .a4-page{width:210mm; height:297mm; position:relative; overflow:hidden;} .content-box{'+ rotationStyle +' padding:20mm; box-sizing:border-box; display:flex; flex-direction:column; justify-content:space-between; text-align:' + align + '; font-family:"SolaimanLipi", sans-serif;} #pt{font-size:'+ sizes.title +'px; font-weight:900; line-height:1.1; color:'+ clrTitle +';} #pb{font-size:'+ sizes.body +'px; font-weight:700; flex:1; display:flex; align-items:center; justify-content:'+ flexAlign +'; white-space:pre-wrap; margin:15mm 0; color:'+ clrBody +';} #pf{font-size:'+ sizes.footer +'px; font-weight:900; border-top:6px solid '+ clrFooter +'; padding-top:10mm; color:'+ clrFooter +';}</style>');
    win.document.write('</head><body><div class="a4-page"><div class="content-box">');
    win.document.write('<div id="pt">' + title + '</div>');
    win.document.write('<div id="pb">' + body + '</div>');
    win.document.write('<div id="pf">' + footer + '</div>');
    win.document.write('</div></div></body></html>');
    win.document.close();
    setTimeout(() => { win.print(); }, 500);
}

function resetLeaflet() {
    document.getElementById('leaf-title').value = "";
    document.getElementById('leaf-body').value = "";
    document.getElementById('leaf-footer').value = "";
    updateLeaflet();
}
;

let landLang = 'en';
let landMode = 'rect';

function openLandModal() {
    if(typeof setActiveMode === "function") setActiveMode('mode-land');
    document.getElementById('landModal').style.display = 'flex';
}

function closeLandModal() {
    document.getElementById('landModal').style.display = 'none';
}

function setLandMode(mode) {
    landMode = mode;
    document.getElementById('rect-inputs').style.display = mode === 'rect' ? 'block' : 'none';
    document.getElementById('tri-inputs').style.display = mode === 'tri' ? 'block' : 'none';
    document.getElementById('btn-mode-rect').style.background = mode === 'rect' ? '#059669' : '#64748b';
    document.getElementById('btn-mode-tri').style.background = mode === 'tri' ? '#059669' : '#64748b';
    calculateLand();
}

function setLandLang(lang) {
    landLang = lang;
    document.getElementById('land-en-btn').classList.toggle('active', lang === 'en');
    document.getElementById('land-bn-btn').classList.toggle('active', lang === 'bn');
    
    const d = {
        en: { title:"Land Area Calculator", len:"Average Length (Feet)", wid:"Average Width (Feet)", sa:"Side A", resHead:"Calculated Area:", sqft:"Sq. Feet:", decimal:"Decimal:", katha:"Katha:", bigha:"Bigha:", acre:"Acre:", printBtn:"Print A4 Report", resetBtn:"Reset", info:"Standard: 1 Decimal = 435.6 Sq. Ft" },
        bn: { title:"জমি পরিমাপ ক্যালকুলেটর", len:"গড় দৈর্ঘ্য (ফুট)", wid:"গড় প্রস্থ (ফুট)", sa:"আইল এ", resHead:"জমির মোট পরিমাপ:", sqft:"বর্গফুট:", decimal:"শতাংশ:", katha:"কাঠা:", bigha:"বিঘা:", acre:"একর:", printBtn:"প্রিন্ট রিপোর্ট (A4)", resetBtn:"সব মুছুন", info:"হিসাব: ১ শতাংশ = ৪৩৫.৬ বর্গফুট" }
    };
    const t = d[lang];
    document.getElementById('land-title').innerText = t.title;
    document.getElementById('lbl-len').innerText = t.len;
    document.getElementById('lbl-wid').innerText = t.wid;
    document.getElementById('res-head').innerText = t.resHead;
    document.getElementById('txt-sqft').innerText = t.sqft;
    document.getElementById('txt-decimal').innerText = t.decimal;
    document.getElementById('txt-katha').innerText = t.katha;
    document.getElementById('txt-bigha').innerText = t.bigha;
    document.getElementById('txt-acre').innerText = t.acre;
    document.getElementById('btn-print-text').innerText = t.printBtn;
    document.getElementById('btn-reset-text').innerText = t.resetBtn;
    document.getElementById('land-info').innerText = t.info;
    calculateLand();
}

function calculateLand() {
    let sqft = 0;
    if (landMode === 'rect') {
        sqft = (parseFloat(document.getElementById('land-len').value) || 0) * (parseFloat(document.getElementById('land-wid').value) || 0);
    } else {
        let a = parseFloat(document.getElementById('tri-a').value) || 0, b = parseFloat(document.getElementById('tri-b').value) || 0, c = parseFloat(document.getElementById('tri-c').value) || 0;
        if (a + b > c && a + c > b && b + c > a) {
            let s = (a + b + c) / 2;
            sqft = Math.sqrt(s * (s - a) * (s - b) * (s - c));
        }
    }
    document.getElementById('res-sqft').innerText = sqft.toFixed(2);
    document.getElementById('res-decimal').innerText = (sqft / 435.6).toFixed(2);
    document.getElementById('res-katha').innerText = (sqft / 720).toFixed(2);
    document.getElementById('res-bigha').innerText = (sqft / 435.6 / 33).toFixed(2);
    document.getElementById('res-acre').innerText = (sqft / 435.6 / 100).toFixed(2);
}

function printLandReport() {
    calculateLand();
    const isBn = (landLang === 'bn');
    const sqft = document.getElementById('res-sqft').innerText;
    const decimal = document.getElementById('res-decimal').innerText;
    const katha = document.getElementById('res-katha').innerText;
    const bigha = document.getElementById('res-bigha').innerText;
    const acre = document.getElementById('res-acre').innerText;

    // আইফ্রেম তৈরি
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;

    // সিএসএস এবং এইচটিএমএল একসাথে ইনজেকশন
    const content = `
    <html>
    <head>
        <title>Print Report</title>
        <style>
            @import url('https://fonts.maateen.me/solaiman-lipi/font.css');
            body { margin: 0; padding: 0; background: #fff; font-family: 'SolaimanLipi', Arial, sans-serif; }
            @page { size: A4; margin: 0; }
            .a4-page { width: 210mm; height: 297mm; padding: 20mm; box-sizing: border-box; background: #fff; margin: 0 auto; overflow: hidden; }
            .border-wrap { border: 4px solid #059669; height: 100%; padding: 15mm; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; }
            .header { text-align: center; border-bottom: 2px solid #059669; padding-bottom: 10px; margin-bottom: 30px; }
            .header h1 { margin: 0; font-size: 32px; color: #059669; font-weight: bold; }
            .header p { margin: 5px 0 0; font-size: 15px; color: #555; }
            .title { text-align: center; text-decoration: underline; font-size: 26px; margin-bottom: 40px; color: #000; font-weight: bold; }
            .section-head { background: #f3f4f6; padding: 10px; font-size: 19px; border-left: 6px solid #059669; margin-bottom: 20px; font-weight: bold; }
            table { width: 100%; border-collapse: collapse; font-size: 19px; }
            table td { border: 1px solid #cbd5e1; padding: 15px; color: #000; }
            .res-row { background: #f0fdf4; font-weight: bold; }
            .res-val { font-weight: 900; color: #059669; font-size: 22px; text-align: right; }
            .footer { border-top: 1px solid #eee; padding-top: 15px; font-size: 14px; color: #666; text-align: center; }
        </style>
    </head>
    <body>
        <div class="a4-page">
            <div class="border-wrap">
                <div>
                    <div class="header">
                        <h1>${isBn ? 'ডিজিটাল গেটওয়ে' : 'Digital Seba'}</h1>
                        <p>Professional Digital Studio Solutions | seba.pro.bd</p>
                    </div>
                    <div class="title">${isBn ? 'জমির পরিমাপের রিপোর্ট' : 'Land Measurement Report'}</div>
                    <div class="section-head">${isBn ? 'জমির মোট হিসাব:' : 'Final Calculation Result:'}</div>
                    <table>
                        <tr class="res-row"><td>${isBn ? 'মোট বর্গফুট' : 'Total Sq. Feet'}</td><td class="res-val">${sqft}</td></tr>
                        <tr><td>${isBn ? 'শতাংশ' : 'Decimal'}</td><td style="text-align:right;">${decimal}</td></tr>
                        <tr><td>${isBn ? 'কাঠা' : 'Katha'}</td><td style="text-align:right;">${katha}</td></tr>
                        <tr><td>${isBn ? 'বিঘা' : 'Bigha'}</td><td style="text-align:right;">${bigha}</td></tr>
                        <tr><td>${isBn ? 'একর' : 'Acre'}</td><td style="text-align:right;">${acre}</td></tr>
                    </table>
                </div>
                <div class="footer">
                    ${isBn ? '* হিসাবের নিয়ম: ১ শতাংশ = ৪৩৫.৬ বর্গফুট। এটি একটি কম্পিউটার জেনারেটেড রিপোর্ট।' : '* Standard Calculation: 1 Decimal = 435.6 Sq. Feet. Computer generated report.'}
                </div>
            </div>
        </div>
    </body>
    </html>`;

    doc.open();
    doc.write(content);
    doc.close();

    // লোড হওয়ার পর প্রিন্ট
    iframe.contentWindow.onload = function() {
        iframe.contentWindow.print();
        setTimeout(() => { document.body.removeChild(iframe); }, 1000);
    };
}

function resetLand() {
    document.querySelectorAll('#landModal input').forEach(i => i.value = '');
    calculateLand();
}
;

let currentOmrLang = 'en';

const omrTranslations = {
    en: {
        uiTitle: "OMR Sheet Generator",
        inst: "Institution Name",
        exam: "Exam Title",
        questions: "Total Questions",
        options: "Options",
        printBtn: "Generate & Print OMR",
        placeholder: "Type here...",
        // Print Version Texts
        pName: "Student Name",
        pRoll: "Roll Number / ID",
        pSubject: "Subject",
        pSet: "Set Code",
        pWarning: "* Use Black Ballpoint Pen only. Fill the circles completely. Do not fold this sheet."
    },
    bn: {
        uiTitle: "ওএমআর শিট জেনারেটর",
        inst: "প্রতিষ্ঠানের নাম",
        exam: "পরীক্ষার নাম",
        questions: "মোট প্রশ্ন সংখ্যা",
        options: "অপশন সংখ্যা",
        printBtn: "ওএমআর তৈরি ও প্রিন্ট",
        placeholder: "এখানে লিখুন...",
        // Print Version Texts
        pName: "শিক্ষার্থীর নাম",
        pRoll: "রোল নম্বর / আইডি",
        pSubject: "বিষয়",
        pSet: "সেট কোড",
        pWarning: "* শুধুমাত্র কালো বলপয়েন্ট কলম ব্যবহার করুন। বৃত্তগুলো সম্পূর্ণ ভরাট করুন। এই কাগজটি ভাঁজ করবেন না।"
    }
};

function openOmrModal() {
    document.getElementById('omrModal').style.display = 'flex';
}

function closeOmrModal() {
    document.getElementById('omrModal').style.display = 'none';
}

function setOmrLang(lang) {
    currentOmrLang = lang;
    const t = omrTranslations[lang];
    
    // Update UI Labels
    document.getElementById('omr-ui-title').innerText = t.uiTitle;
    document.getElementById('lbl-omr-inst').innerText = t.inst;
    document.getElementById('lbl-omr-exam').innerText = t.exam;
    document.getElementById('lbl-omr-q').innerText = t.questions;
    document.getElementById('lbl-omr-opt').innerText = t.options;
    document.getElementById('lbl-omr-print').innerText = t.printBtn;
    
    document.getElementById('omr-name').placeholder = t.placeholder;
    document.getElementById('omr-exam').placeholder = t.placeholder;

    // Toggle Button Styles
    document.getElementById('omr-en-btn').classList.toggle('active', lang === 'en');
    document.getElementById('omr-bn-btn').classList.toggle('active', lang === 'bn');
}

function generateAndPrintOMR() {
    const inst = document.getElementById('omr-name').value || (currentOmrLang === 'en' ? "INSTITUTION NAME" : "প্রতিষ্ঠানের নাম");
    const exam = document.getElementById('omr-exam').value || (currentOmrLang === 'en' ? "EXAMINATION TITLE" : "পরীক্ষার নাম");
    const totalQ = parseInt(document.getElementById('omr-q-total').value);
    const totalOpt = parseInt(document.getElementById('omr-opt-total').value);
    const t = omrTranslations[currentOmrLang];
    
    const options = ["A", "B", "C", "D", "E"];
    const optionsBn = ["ক", "খ", "গ", "ঘ", "ঙ"];

    // ১. প্রিন্ট ফরম্যাটের CSS (সুলাইমান লিপি সহ)
    let style = `
    <style>
        @import url('https://fonts.maateen.me/solaiman-lipi/font.css');
        body { font-family: ${currentOmrLang === 'bn' ? "'SolaimanLipi', Arial" : "'Arial'"}, sans-serif; margin: 0; padding: 0; background: #fff; color: #000; }
        .a4-page { width: 210mm; min-height: 297mm; padding: 12mm; margin: auto; box-sizing: border-box; border: 1px solid #eee; position: relative; }
        .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 8px; margin-bottom: 20px; }
        .header h1 { margin: 0; font-size: 24px; text-transform: uppercase; }
        .header p { margin: 5px 0; font-size: 18px; font-weight: bold; }
        
        .student-info-grid { display: flex; gap: 20px; margin-bottom: 25px; border: 1px solid #000; padding: 12px; }
        .fields { flex: 1.5; font-size: 15px; line-height: 2.2; }
        .roll-id-section { flex: 1; border-left: 1px solid #000; padding-left: 15px; text-align: center; }
        .roll-title { font-size: 12px; font-weight: bold; margin-bottom: 8px; text-decoration: underline; }
        .roll-bubbles { display: flex; gap: 3px; justify-content: center; }
        .roll-col { display: flex; flex-direction: column; gap: 3px; }
        .roll-digit { width: 17px; height: 17px; border: 1px solid #000; border-radius: 50%; font-size: 10px; display: flex; align-items: center; justify-content: center; font-weight: bold; }

        .set-codes { margin-bottom: 20px; font-size: 14px; font-weight: bold; display: flex; align-items: center; gap: 10px; }
        .set-box { border: 1.5px solid #000; width: 25px; height: 25px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }

        .omr-body { display: grid; grid-template-columns: repeat(${totalQ > 50 ? 4 : 3}, 1fr); gap: 12px; border-top: 1px solid #000; padding-top: 15px; }
        .q-row { display: flex; align-items: center; margin-bottom: 5px; }
        .q-num { width: 28px; font-weight: bold; font-size: 14px; }
        .bubbles { display: flex; gap: 6px; }
        .bubble { width: 21px; height: 21px; border: 1.5px solid #000; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: bold; }
        
        .footer-note { margin-top: 30px; text-align: center; font-size: 12px; border: 1px solid #000; padding: 8px; border-radius: 5px; }
        @media print { .a4-page { border: none; margin: 0; padding: 10mm; } }
    </style>`;

    // ২. রোল নম্বর এবং ইনফো সেকশন
    let rollHtml = `
    <div class="student-info-grid">
        <div class="fields">
            ${t.pName}: _____________________________________<br>
            ${t.pSubject}: _______________________________________<br>
            ${t.pRoll}: _____________________________________
        </div>
        <div class="roll-id-section">
            <div class="roll-title">${t.pRoll} (0-9)</div>
            <div class="roll-bubbles">`;
    for (let c = 0; c < 6; c++) { 
        rollHtml += `<div class="roll-col">`;
        for (let r = 0; r < 10; r++) {
            rollHtml += `<div class="roll-digit">${r}</div>`;
        }
        rollHtml += `</div>`;
    }
    rollHtml += `</div></div></div>`;

    // ৩. সেট কোড সেকশন
    let setHtml = `
    <div class="set-codes">
        <span>${t.pSet}:</span>
        <div class="set-box">A</div> <div class="set-box">B</div> <div class="set-box">C</div> <div class="set-box">D</div>
    </div>`;

    // ৪. প্রশ্ন গ্রিড জেনারেট করা
    let omrGridHtml = `<div class="omr-body">`;
    for (let i = 1; i <= totalQ; i++) {
        omrGridHtml += `<div class="q-row">
            <div class="q-num">${currentOmrLang === 'bn' ? replaceToBnNum(i) : i}.</div>
            <div class="bubbles">`;
        for (let j = 0; j < totalOpt; j++) {
            omrGridHtml += `<div class="bubble">${currentOmrLang === 'bn' ? optionsBn[j] : options[j]}</div>`;
        }
        omrGridHtml += `</div></div>`;
    }
    omrGridHtml += `</div>`;

    // ৫. সব মিলিয়ে ফাইনাল HTML
    let finalHtml = `
    <html>
    <head>
        <title>OMR Sheet - ${inst}</title>
        ${style}
    </head>
    <body>
        <div class="a4-page">
            <div class="header">
                <h1>${inst}</h1>
                <p>${exam}</p>
            </div>
            ${rollHtml}
            ${setHtml}
            ${omrGridHtml}
            <div class="footer-note">${t.pWarning}</div>
        </div>
    </body>
    </html>`;

    // ৬. প্রিন্ট উইন্ডো প্রোসেস
    const printWin = window.open('', '_blank');
    printWin.document.write(finalHtml);
    printWin.document.close();
    
    printWin.onload = function() {
        printWin.focus();
        printWin.print();
    };
}

// সংখ্যাকে বাংলা করার ফাংশন
function replaceToBnNum(num) {
    const bnNums = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return num.toString().split('').map(d => bnNums[d] || d).join('');
}
;

function openOmrModal() {
setActiveMode('mode-omr');
    document.getElementById('omrModal').style.display = 'flex';
}

let affLang = 'bn';

const affTemplates = {
  bn: {
    nid: { title: 'জাতীয় পরিচয়পত্র সংশোধনের হলফনামা', text: 'আমি, {{name}}, পিতা: {{father}}, মাতা: {{mother}}, ঠিকানা: {{address}}। আমি একজন বাংলাদেশের জন্মসূত্রে স্থায়ী নাগরিক এবং অত্র এলাকার বাসিন্দা। আমি অত্র হলফনামা দ্বারা এই মর্মে শপথপূর্বক ঘোষণা করিতেছি যে, আমার জাতীয় পরিচয়পত্রে আমার তথ্য ভুলবশত {{wrong}} আসিয়াছে। প্রকৃতপক্ষে দাপ্তরিক ও পারিবারিক রেকর্ড অনুযায়ী আমার সঠিক তথ্য হইবে {{correct}}। উক্ত ভুল তথ্য সংশোধন করা আমার জন্য একান্ত আবশ্যক। অত্র হলফনামার মাধ্যমে আমি যথাযথ কর্তৃপক্ষের নিকট এই তথ্য সংশোধনের জোর দাবি জানাইতেছি। আমার এই ঘোষণা জ্ঞানত সত্য এবং সঠিক।' },
    name: { title: 'নাম পরিবর্তনের হলফনামা', text: 'আমি, {{name}}, পিতা: {{father}}, ঠিকানা: {{address}}। এই মর্মে ঘোষণা করিতেছি যে, আমার প্রকৃত ও আইনসম্মত নাম হইল {{correct}}। কিন্তু আমার বিভিন্ন গুরুত্বপূর্ণ কাগজপত্রে এবং পূর্ববর্তী রেকর্ডে অসাবধানতাবশত আমার নাম {{wrong}} লিপিবদ্ধ হইয়াছে। অদ্য হইতে আমি সর্বক্ষেত্রে এবং সকল প্রকার দাপ্তরিক কার্যাদিতে আমার ভুল নামের পরিবর্তে সঠিক নাম {{correct}} ব্যবহার করিব। ইহা ব্যতীত অন্য কোন নাম আমার বলিয়া গণ্য হইবে না। অত্র হলফনামা দ্বারা আমি আমার নাম পরিবর্তনের আইনগত ঘোষণা প্রদান করিলাম।' },
    edu: { title: 'শিক্ষাগত সনদ সংশোধনের হলফনামা', text: 'আমি, {{name}}, পিতা: {{father}}, মাতা: {{mother}}, ঠিকানা: {{address}}। ঘোষণা করিতেছি যে, আমার মাধ্যমিক ও উচ্চ মাধ্যমিক শিক্ষা বোর্ডের সার্টিফিকেট ও অন্যান্য শিক্ষাগত সনদে আমার তথ্য ভুলবশত {{wrong}} লিপিবদ্ধ হইয়াছে। প্রকৃতপক্ষে আমার জন্ম নিবন্ধন ও অন্যান্য সঠিক রেকর্ড অনুযায়ী প্রকৃত তথ্য হইবে {{correct}}। অত্র হলফনামা দ্বারা আমি সংশ্লিষ্ট শিক্ষা বোর্ড ও কর্তৃপক্ষকে আমার সনদে এই তথ্য সংশোধনের জন্য অনুরোধ জানাইতেছি। ইহা সত্য এবং আমার জ্ঞানমতে কোন তথ্য গোপন করা হয় নাই।' },
    dob: { title: 'জন্ম তারিখ সংশোধনের হলফনামা', text: 'আমি, {{name}}, পিতা: {{father}}, ঠিকানা: {{address}}। আমি এই মর্মে শপথপূর্বক ঘোষণা করিতেছি যে, আমার জন্ম নিবন্ধন ও ভোটার তালিকায় আমার জন্ম তারিখ ভুলবশত {{wrong}} মুদ্রিত হইয়াছে। প্রকৃতপক্ষে আমার মেডিকেল সার্টিফিকেট ও পারিবারিক সঠিক তথ্য অনুযায়ী আমার প্রকৃত জন্ম তারিখ হইবে {{correct}}। দাপ্তরিক প্রয়োজনে এই সংশোধন একান্ত জরুরি। আমি ঘোষণা করিতেছি যে, এই হলফনামার বর্ণনা আমার জানামতে সম্পূর্ণ সত্য ও নিখুঁত।' },
    warish: { title: 'ওয়ারিশ বা উত্তরাধিকার সংক্রান্ত হলফনামা', text: 'আমি, {{name}}, পিতা: {{father}}, ঠিকানা: {{address}}। এই মর্মে হলফপূর্বক ঘোষণা করিতেছি যে, আমার নিকটাত্মীয় মরহুম {{wrong}} গত ইংরেজি তারিখ- ............. তারিখে মৃত্যুবরণ করিয়াছেন। মৃত্যুকালে তাঁহার একমাত্র বৈধ ওয়ারিশ বা উত্তরাধিকারীগণ হইলেন {{correct}}। আমরা ব্যতীত তাঁহার আর কোন ওয়ারিশ বা অংশীদার নাই। এই হলফনামা দ্বারা উত্তরাধিকারীগণ যথাযথ পাওনা ও সম্পদ বুঝিয়া লওয়ার আইনগত দাবিদার বলিয়া ঘোষিত হইলাম।' },
    religion: { title: 'ধর্ম পরিবর্তনের হলফনামা', text: 'আমি, {{name}}, পিতা: {{father}}, ঠিকানা: {{address}}। আমি অত্র হলফনামা দ্বারা এই মর্মে ঘোষণা করিতেছি যে, আমি ইতিপূর্বে {{wrong}} ধর্মের অনুসারী ছিলাম। বর্তমানে আমি সজ্ঞানে ও স্বেচ্ছায় ইসলাম ধর্ম গ্রহণ করিয়াছি এবং আমার বর্তমান ধর্ম ইসলাম। ইসলাম ধর্ম গ্রহণপূর্বক আমার বর্তমান নাম রাখিয়াছি {{correct}}। অদ্য হইতে আমি ইসলামের সকল নিয়ম-কানুন মানিয়া চলিব এবং দাপ্তরিক সকল কাজে আমার বর্তমান নাম ও ধর্ম ব্যবহার করিব। ইসলাম ছাড়া অন্য কোন ধর্মের প্রতি আমার আর কোন আনুগত্য নাই।' },
    marriage: { title: 'বিবাহ বা কাবিননামা সংশোধনের হলফনামা', text: 'আমি, {{name}}, পিতা: {{father}}, ঠিকানা: {{address}}। ঘোষণা করিতেছি যে, আমার কাবিননামা বা বিবাহ নিবন্ধনের নথিতে আমার বৈবাহিক তথ্যাদি ভুলবশত {{wrong}} লিপিবদ্ধ হইয়াছে। প্রকৃতপক্ষে শরিয়ত ও প্রচলিত আইন অনুযায়ী সঠিক তথ্য হইবে {{correct}}। অত্র হলফনামা দ্বারা আমি বিবাহের সঠিক নথিপত্র প্রস্তুত করার ঘোষণা প্রদান করিতেছি এবং সংশ্লিষ্ট রেজিস্টারকে তথ্য সংশোধনের জন্য অবহিত করিতেছি।' },
    passport: { title: 'পাসপোর্ট তথ্য সংশোধনের হলফনামা', text: 'আমি, {{name}}, পিতা: {{father}}, ঠিকানা: {{address}}। এই মর্মে হলফপূর্বক ঘোষণা করিতেছি যে, আমার পুরাতন পাসপোর্ট অথবা জন্ম সনদে আমার তথ্য {{wrong}} লিপিবদ্ধ রহিয়াছে। বর্তমানে আমার জাতীয় পরিচয়পত্র (NID) ও আধুনিক রেকর্ড অনুযায়ী আমার সঠিক তথ্য হইবে {{correct}}। আমি আমার নতুন পাসপোর্টে উক্ত সঠিক তথ্য ব্যবহারের ঘোষণা প্রদান করিতেছি এবং পাসপোর্ট অধিদপ্তরকে ইহা সংশোধনের জন্য সবিনয় অনুরোধ করিতেছি।' },
    general: { title: 'সাধারণ বা বিবিধ হলফনামা', text: 'আমি, {{name}}, পিতা: {{father}}, মাতা: {{mother}}, ঠিকানা: {{address}}। আমি এই মর্মে শপথপূর্বক ঘোষণা করিতেছি যে, {{wrong}}। প্রকৃতপক্ষে সঠিক বিষয় হইল {{correct}}। অত্র হলফনামার যাবতীয় বর্ণনা আমার জ্ঞান ও বিশ্বাসমতে সত্য এবং কোন প্রকার তথ্য গোপন করা হয় নাই। দাপ্তরিক যে কোন প্রয়োজনে এই হলফনামা ব্যবহারের আইনগত ঘোষণা প্রদান করিলাম।' }
  },
  en: {
    nid: { title: 'Affidavit for NID Correction', text: 'I, {{name}}, Son/Daughter of {{father}}, Mother: {{mother}}, Address: {{address}}, do hereby solemnly affirm and declare on oath that I am a permanent citizen of Bangladesh. Due to a clerical error, my NID card displays {{wrong}} as my personal information. According to my legal documents and birth certificate, the correct information should be {{correct}}. I declare that this statement is true and correct to the best of my knowledge and I request the concerned authority to update my records accordingly.' },
    name: { title: 'Affidavit for Name Change', text: 'I, {{name}}, Son/Daughter of {{father}}, Address: {{address}}, do hereby solemnly declare that my real and legal name is {{correct}}. However, in some previous documents and official records, my name has been mistakenly mentioned as {{wrong}}. From today onwards, I shall be known by the name {{correct}} for all official, legal, and personal purposes. No other name shall be attributed to me hereafter. This affidavit serves as a legal declaration of my name change.' },
    dob: { title: 'Affidavit for Date of Birth Correction', text: 'I, {{name}}, Son/Daughter of {{father}}, Address: {{address}}, do hereby affirm on oath that in my academic records/NID, my date of birth is recorded as {{wrong}}. Based on my primary birth registration and medical records, my actual and correct date of birth is {{correct}}. This correction is essential for my future administrative and legal needs. I certify that this information is accurate and no facts have been concealed.' },
    edu: { title: 'Affidavit for Educational Certificate Correction', text: 'I, {{name}}, Son/Daughter of {{father}}, Mother: {{mother}}, Address: {{address}}, do hereby declare that in my SSC/HSC certificate, my details have been wrongly printed as {{wrong}}. My actual details as per the National Identity Card and Birth Certificate are {{correct}}. I hereby request the Education Board and concerned authorities to correct my academic certificates based on this legal affidavit.' },
    passport: { title: 'Affidavit for Passport Information Correction', text: 'I, {{name}}, Son/Daughter of {{father}}, Address: {{address}}, solemnly declare that there is a discrepancy in my passport records. My information is currently stated as {{wrong}}. According to my updated NID and legal documents, the correct data should be {{correct}}. I request the Passport Authority to issue my new passport with the rectified information. All statements made here are true and verified by me.' },
    marital: { title: 'Affidavit for Marital Status Declaration', text: 'I, {{name}}, Son/Daughter of {{father}}, Address: {{address}}, do hereby declare my marital status. In certain records, it is wrongly mentioned as {{wrong}}. The actual fact is that I am {{correct}} (Married/Single). I provide this statement as a legal declaration for official documentation and verify that all information provided is genuine.' },
    general: { title: 'General Affidavit', text: 'I, {{name}}, Son/Daughter of {{father}}, Mother: {{mother}}, Address: {{address}}, do hereby solemnly affirm and declare that {{wrong}}. The factual reality of the matter is {{correct}}. This affidavit is executed for legal purposes to be presented before the concerned authorities. I state that the contents of this affidavit are true to the best of my knowledge.' }
  }
};

function adjustAffPreviewScale() {
    const container = document.querySelector('.aff-preview-scroll');
    const wrapper = document.getElementById('aff-wrapper');
    const paper = document.getElementById('aff-editor-box');
    if (!container || !paper) return;
    const containerWidth = container.offsetWidth - 30;
    const paperWidth = 812; 
    if (containerWidth < paperWidth) {
        const scale = containerWidth / paperWidth;
        wrapper.style.transform = `scale(${scale})`;
        const newHeight = paper.offsetHeight * scale;
        container.style.height = (newHeight + 50) + "px";
    } else {
        wrapper.style.transform = 'scale(1)';
        container.style.height = "auto";
    }
}

window.addEventListener('resize', adjustAffPreviewScale);

function openAffidavitModal() {
     setActiveMode('mode-affidavit');
    document.getElementById('affidavitModal').style.display = 'flex';
    setAffLang('bn');
    setTimeout(adjustAffPreviewScale, 300);
}

document.getElementById('aff-body-ui').addEventListener('paste', function(e) {
    e.preventDefault();
    var text = (e.originalEvent || e).clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
});

function closeAffidavitModal() {
    document.getElementById('affidavitModal').style.display = 'none';
}

function setAffLang(lang) {
    affLang = lang;
    document.getElementById('aff-bn-btn').classList.toggle('active', lang === 'bn');
    document.getElementById('aff-en-btn').classList.toggle('active', lang === 'en');
    const isBN = lang === 'bn';
    
    // UI Label Switching
    document.getElementById('aff-main-title').innerHTML = isBN ? "<i class='fa-solid fa-file-contract'/> এফিডেভিট রাইটিং" : "<i class='fa-solid fa-file-contract'/> Affidavit Writing";
    document.getElementById('lbl-aff-temp').innerText = isBN ? 'টেমপ্লেট নির্বাচন করুন' : 'Select Template';
    document.getElementById('lbl-aff-name').innerText = isBN ? 'হলফকারীর নাম' : 'Name of Deponent';
    document.getElementById('lbl-aff-father').innerText = isBN ? 'পিতা/স্বামীর নাম' : 'Father/Husband Name';
    document.getElementById('lbl-aff-mother').innerText = isBN ? 'মাতার নাম' : 'Mother Name';
    document.getElementById('lbl-aff-addr').innerText = isBN ? 'ঠিকানা' : 'Full Address';
    document.getElementById('lbl-aff-wrong').innerText = isBN ? 'ভুল তথ্য (যা আছে)' : 'Incorrect Info';
    document.getElementById('lbl-aff-correct').innerText = isBN ? 'সঠিক তথ্য (যা হবে)' : 'Correct Info';
    document.getElementById('lbl-aff-margin').innerText = isBN ? 'স্ট্যাম্প টপ স্পেস (Inch)' : 'Stamp Top Space (Inch)';
    document.getElementById('lbl-sig-1').innerText = isBN ? 'তদন্তকারী কর্মকর্তা' : 'Attesting Officer';
    document.getElementById('lbl-sig-2').innerText = isBN ? 'হলফকারীর স্বাক্ষর' : 'Deponent Signature';
    document.getElementById('lbl-aff-preview-hint').innerText = isBN ? 'স্ট্যাম্প প্রিভিউ (ইমেজটি প্রিন্টে আসবে না)' : 'STAMP PREVIEW (IMAGE WILL NOT PRINT)';

    // Intro Box Switching
    document.getElementById('aff-intro-box').innerHTML = isBN ? 
        "<b>নির্দেশনা:</b> এটি লিগ্যাল সাইজ (২১৫ মিমি x ৩৪৫ মিম) স্ট্যাম্প পেপারের জন্য তৈরি। প্রিন্ট করার সময় শুধুমাত্র আপনার টাইপ করা লেখাগুলো প্রিন্ট হবে, স্ট্যাম্পের ব্যাকগ্রাউন্ড ইমেজটি প্রিন্ট হবে না।" : 
        "<b>Note:</b> This is designed for Legal Size (215mm x 345mm) stamp paper. Only your typed text will be printed; the stamp background image will not appear in the print.";

    const select = document.getElementById('aff-template-select');
    select.innerHTML = '';
    const data = affTemplates[lang];
    for (let key in data) {
        let opt = document.createElement('option');
        opt.value = key; opt.innerText = data[key].title;
        select.appendChild(opt);
    }
    applyAffTemplate(select.value);
}

function applyAffTemplate(key) {
    window.currentAffKey = key;
    updateAffPreview();
}

function updateAffPreview() {
    const data = affTemplates[affLang][window.currentAffKey];
    document.getElementById('aff-title-ui').innerText = data.title;
    const inputs = {
        name: document.getElementById('aff-name').value || '.......',
        father: document.getElementById('aff-father').value || '.......',
        mother: document.getElementById('aff-mother').value || '.......',
        address: document.getElementById('aff-address').value || '.......',
        wrong: document.getElementById('aff-wrong').value || '.......',
        correct: document.getElementById('aff-correct').value || '.......'
    };
    let body = data.text;
    for (let key in inputs) {
        body = body.replace(new RegExp(`{{${key}}}`, 'g'), `<b style="color:#000">${inputs[key]}</b>`);
    }
    document.getElementById('aff-body-ui').innerHTML = body;
}

function updateAffMargin(val) {
    document.getElementById('aff-top-margin').style.height = val + 'px';
    document.getElementById('aff-margin-val').innerText = (val / 100).toFixed(1) + " Inch";
}

function printAffidavit() {
    const marginHeight = document.getElementById('aff-top-margin').offsetHeight;
    const title = document.getElementById('aff-title-ui').innerText;
    const body = document.getElementById('aff-body-ui').innerHTML;
    const sig1 = document.getElementById('lbl-sig-1').innerText;
    const sig2 = document.getElementById('lbl-sig-2').innerText;

    const printWindow = window.open('', '', 'width=900,height=1000');
    printWindow.document.write(`
        <html>
        <head>
            <title>Print Affidavit</title>
            <link href="https://fonts.maateen.me/solaiman-lipi/font.css" rel="stylesheet">
            <style>
                @page { size: 215mm 345mm; margin: 0; }
                body { margin: 0; padding: 0; background: #fff; -webkit-print-color-adjust: exact; }
                .print-container { width: 215mm; min-height: 345mm; margin: 0 auto; padding: 20mm; font-family: 'SolaimanLipi', Arial, sans-serif; box-sizing: border-box; color: #000; text-align: justify; position: relative; }
                .top-space { height: ${marginHeight}px; }
                .title { text-align: center; text-decoration: underline; font-size: 24px; margin-bottom: 30px; font-weight: bold; }
                .body-content { line-height: 1.8; font-size: 18px; min-height: 500px; word-wrap: break-word; overflow-wrap: break-word; white-space: pre-wrap; width: 100%; }
                .footer { margin-top: 80px; display: flex; justify-content: space-between; align-items: flex-start; font-weight: bold; font-size: 16px; width: 100%; }
                .sig-box { text-align: center; min-width: 150px; }
            </style>
        </head>
        <body>
            <div class="print-container">
                <div class="top-space"></div>
                <div class="title">${title}</div>
                <div class="body-content">${body}</div>
                <div class="footer">
                    <div class="sig-box"><br>________________<br>${sig1}</div>
                    <div class="sig-box"><br>________________<br>${sig2}</div>
                </div>
            </div>
            <script>window.onload = function() { setTimeout(() => { window.print(); window.close(); }, 700); };<\/script>
        </body>
        </html>
    `);
    printWindow.document.close();
}

function resetAffidavit() {
    // Reset all text inputs
    document.querySelectorAll('.aff-inputs input, .aff-inputs textarea').forEach(i => i.value = '');
    // Reset margin slider to default
    const slider = document.getElementById('aff-margin-slider');
    slider.value = 330;
    updateAffMargin(330);
    // Refresh preview
    updateAffPreview();
}


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

const allJobSites = [
  // লোগো ভিত্তিক সাইটগুলো (উপরে থাকবে)
  { name: "All Job Teletalk", type: "img", src: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhMmzAhLqlbjud22fetfPOvRQ6ROSjXkgHg7uTXuV_BvlW1oSdEmkyGYYUsnNvikSeSY7BzH5ikOmWHj8jr0_SDllMqAxQLt5JiBpTQ_fJ2VPkOH95rUIj5dbi8CPmLXOepeJvzxzPxbBBN2HBmEQSEmDvUgXhqgAneeDoPE8ihPVl_kSeFqvq_DHqfQX0/s1600/alljobs.png", link: "https://alljobs.teletalk.com.bd/jobs/government" },
  { name: "All Govt Jobs", type: "img", src: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi13wdz3YAlITHIljo09gZEonJKSIC9WUYB2IwHfTjfKzLut377MIzVbskwqvV4tg_3cvfQxPamc5BYF6LFnj9Xv1KUmcPqMBeEEjaJASPQGRaIowBOuYYSrBlQ9s-tn9VHoM5-TDv7S2ZaICgZIucemGR1Xti-QvAyqMGjhvMTsq9KfMcY168gAf9Yizw/s1600/teletalk1.png", link: "http://vas.teletalk.com.bd/clientLivejobs.php" },
  { name: "Job Notice BD", type: "img", src: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhET3agC6qyu5CUzuLhyphenhyphent5WaNGrhAhwhAFgvMrL314JsdlpMmD44SDyAAta8LwAxGcXJbQfhlBnQj8AeDzqx-xaUdnbKot4vwS8EcK53mnpwPVmJrBLoJi-ZXDJKjuw3o6OcOoEGMUsUwmG8lnV0prtoDOir6s1wQfED3Z9trHGABQRbQ_XM2XXiigyDB4/s1600/jobsnotice.png", link: "https://jobsnoticebd.com/" },
  { name: "Bikroy Jobs", type: "img", src: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhl5CohMYBT8reMf3U5DLJ2JjhORZac0OTTs5NIT1f1J5XgmO73riycS_gHCpfbdaW1UYixJmUAlkfv78YFdHZeZI7HPNOKIJuIfzJ-yxMa0F91Uu8jhQ8beevB9ecuy3pCPFhW3E0L3JKjsamEx0g6iLzOi19TgzCYYHsMgYYAhYpQ_0kTbsWvFMywJYQ/s1600/BikroyJobs.png", link: "https://bikroy.com/bn/jobs" },
  { name: "Bangla Cyber", type: "img", src: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiyMJo4yHuQiy2eLiv9tu-0jt11OppH4D0QdyN9cIGlQABU9JZue0KXmYnkt0YeRX_rwuQifdHMjynzSmrM0kz5bIXfaGA_DngMR1GNuFNIDnomhF3xKnjeu97vBVBdDtshXRt6Dd-pH9iASfYtZEao8WNDas-eA03aPgqlkG2kjKCzSEWJXkGSmdNoxyg/s1600/banglacyber.png", link: "https://www.banglacyber.com/" },
  { name: "Job Alert BD", type: "img", src: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhzsCtmxJENSn1CKo0EGgc-75l7nf9_Z6s33P-MXXj9ZeaL4Cw-D7J3zdbuEkp0AzMmz3v0Cc-vr010-B2yDjrH-e3M2LKrtmWlvZrYv56kadxqw8Aw9uwqzTXy4YpRzaxXxvbm_IotXqXBFQuEYOTzaSdLynffov8fqFcnCo5bBOooQmRNHrfH9NVz02U/s1600/jobss.png", link: "https://jobalertbd.com/" },
  { name: "Shomvob Job", type: "img", src: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhHvnZ7KGIHMXAmISdX4nIu6pTBkAd8kH5lsnWR1krr2QD1D8GXzJZ6C2de1NE6oYfO2DUxOsqVz8ASjlnDrUMZw0DwzsYUplO3bdTNI8fqgEOqHHtx3lPuFmP23og1ELFXf_ADpglcz264ASJkvt_yjIeLh1zM6DN1eHrjCKF1fT_4JzCutlvNBJB-u30/s1600/shomvob.png", link: "https://app.shomvob.co/govtjobs" },
  { name: "BD Jobs", type: "img", src: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgSbY0GqXMZnf5OVgW-qAOTlEaTETP4_2xGgFXbxC8YSF9OBNXxNLiH7CsVjJXTNbr93AanP37iPsbAB9yr4U8iWXUJ2mbxTjWenvVrMS4PmIYnpK_BXMvES9DtbYuslun76wcqO7DZBLnjD0-TSQaZyeqlg0CVJ4sMPCyObGJ8uNkDetZLss0-3g4MDro/s1600/bdjobs.png", link: "https://bdjobs.com/" },
  { name: "Biddabari", type: "img", src: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgr63jHSwgYouSTygCpeiwIBfbRx0sYFbHfzmikU4BAiqUbwC41RZ9okb5PJZo_x0mgbkcN0AjEtztEdltlEKG9Vtuofe41jk7k8mldMI00up8aV4GNiVbDv-3h1mYxijZpnpsDyx0XOZgDNTIM335w5aCmLfinkNpLa3Dl7kbHuFTkJwfchyphenhyphenCTbUn6yCk/s1600/biddabari.png", link: "https://biddabari.com/job-circular" },

  // আইকন ভিত্তিক সাইটগুলো (তার নিচেই থাকবে)
  { name: "Bangladesh Bank", type: "icon", src: "fa-building-columns", link: "https://erecruitment.bb.org.bd/" },
  { name: "BPSC Portal", type: "icon", src: "fa-landmark-dome", link: "http://bpsc.teletalk.com.bd/" },
  { name: "Primary Teacher", type: "icon", src: "fa-school", link: "http://dpe.teletalk.com.bd/" },
  { name: "Army Recruitment", type: "icon", src: "fa-person-military-to-person", link: "https://joinbangladesharmy.army.mil.bd/" },
  { name: "Navy Recruitment", type: "icon", src: "fa-anchor", link: "https://joinnavy.navy.mil.bd/" },
  { name: "Police Jobs", type: "icon", src: "fa-shield-halved", link: "http://police.teletalk.com.bd/" },
  { name: "NGO Jobs", type: "icon", src: "fa-hand-holding-heart", link: "https://bdgovtjob.net/category/ngo-job-circular/" },
  { name: "Jagojobs", type: "icon", src: "fa-magnifying-glass", link: "https://www.jagojobs.com/" },
  { name: "Kormo Jobs", type: "icon", src: "fa-google", link: "https://kormo.org/" },
  { name: "Alo Jobs", type: "icon", src: "fa-newspaper", link: "https://todayinbd.com/" },
  { name: "NTRCA (Teacher Reg)", type: "icon", src: "fa-chalkboard-user", link: "http://ntrca.teletalk.com.bd/" }
];

function openJobModal() {
    // setActiveMode আপনার ওয়েবসাইটের ফাংশন
    if(typeof setActiveMode === "function") setActiveMode('mode-job-finder');
    document.getElementById('jobFinderModal').style.display = 'flex';
    renderAllJobCards();
}

function closeJobModal() {
    document.getElementById('jobFinderModal').style.display = 'none';
}

function renderAllJobCards() {
    const container = document.getElementById("job-master-grid");
    if(!container) return;
    container.innerHTML = "";

    allJobSites.forEach(site => {
        const card = document.createElement("div");
        card.className = "job-card-item";
        
        let mediaHtml = site.type === "img" 
            ? `<img src="${site.src}" alt="${site.name}">` 
            : `<i class="fa-solid ${site.src}"></i>`;

        card.innerHTML = `
            ${mediaHtml}
            <span>${site.name}</span>
            <div class="btn-visit">Visit Site</div>
        `;
        
        card.onclick = () => window.open(site.link, '_blank');
        container.appendChild(card);
    });
}

// আপনার ওয়েবসাইটের কাস্টম পপআপ দেখানোর ফাংশন
function triggerSitePopup(msg) {
    const popup = document.getElementById('customPopup');
    const msgBox = document.getElementById('popupMessage');
    if (popup && msgBox) {
        msgBox.innerText = msg;
        popup.style.display = 'flex';
    } else {
        alert(msg); // ব্যাকআপ যদি আইডি খুঁজে না পায়
    }
}

function searchJobs() {
    const input = document.getElementById('jf-search-input');
    const query = input.value.trim();
    
    // বর্তমান সাল অটোমেটিক পাওয়ার জন্য (Dynamic Year)
    const currentYear = new Date().getFullYear();

    if (query !== "") {
        // গুগলে বর্তমান সালসহ সার্চ করা হবে
        const fullQuery = query + " job circular Bangladesh " + currentYear;
        window.open(`https://www.google.com/search?q=${encodeURIComponent(fullQuery)}`, '_blank');
    } else {
        // সার্চ বক্সে কিছু না থাকলে আপনার ওয়েবসাইটের কাস্টম অ্যালার্ট
        triggerSitePopup("দয়া করে পদের নাম অথবা প্রতিষ্ঠানের নাম লিখে সার্চ দিন।");
    }
}
;

const onlineSebaList = [
  { name: "পল্লী বিদ্যুৎ মিটার আবেদন", logo: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjQ_tNznpArNXHpj5TQSvrb87xdqCykGYPVcCyE-C1H-BR_AC0A2RNS5ohf8nLX_X7fChOQApTR756-8hj3q6VbAxiOc6oiDp7fngx45zR21avmoGYC02ZeFeVoJN09N6glOekHlY8_jvkoI5BxeItU1cq_7nYKKyXOmKjnap0OUGytQXqU6SdHhTwzekg/s1600/polli.png", link: "http://www.rebpbs.com/Default.aspx" },
  { name: "অনলাইন জিডি আবেদন", logo: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhRSS3qpFjoZIOpP4J8Jf7-EPQZpXYltkk_szsU3UlGR6vpQIQl4JnnllVxCnbMOBffD4PiR-qc0jhWAKifWufihyphenhyphenj3EfG1x4Sy4H6qrSR9zoScC7fQIz60vUDwm-PHSttvpzL_NJ0y2frQxrv8VaK2mIbBSrdc794bjWziVRgJZmXEB-aXCB0eQ-AiKps/s1600/gd.png", link: "https://gd.police.gov.bd/Auth/Account/Login" },
  { name: "কলেজ ভর্তি আবেদন", logo: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiPnngv7ZIQXRP5ONFxBVK7K6uaVgDxQJBWeS_fPPqHsAnVLacQQ_-6mbyVGiegoI_Hu4k4U9yMMR3JC-7tC-6ife-UCV1KS5G7xVgtsVOf72iQ6DitjxXhvOGpod3s2MvThuepV9QTB_ohXKtEwyCKtMa7XRe5wQAd7E7aNvXOAGsgHw/s1600/gov.png", link: "https://xiclassadmission.gov.bd" },
  { name: "সকল ভাতার আবেদন", logo: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjJ3pRq4KG_bBUMnIEVkr3tE-rfkQ1qBcKvthP3IDrxtXArD01yA3SO1XO4LF6O6cXkIXxNiWU2-tu4Ym8JnSbrw1EeA8w7csliU8rnAk8vr69qJoCXxf7AORW2sWj3YDRs4YUlrEQp5TiaMKp2-UBZTfn2Bg5_3yiPtImrOHX2-moTAMWrvABJ_GubCsQ/s1600/bhata.png", link: "https://dss.bhata.gov.bd/home" },
  { name: "প্রতিবন্ধী কার্ডের আবেদন", logo: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhIDbHmeCPA_NUHmX_YhdVuglAmU3zo9qYzDmN_uFtCuqQTervhddUhQzhiwErWPf0cmtvRrguLsaCrKky_rkXtqCB6A-kJdRuwewLmvrqH_stsKLO4DxkKy6vaxVFlOmEWHrc0-seSDljVnnqea9Tzhqb84e3N_2S8_42Qm9GvglELS3DVZBQbAmjI8d4/s320/diss.png", link: "https://www.dis.gov.bd/" },
  { name: "এ-চালান", logo: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjHGLXrFesWrziYlo8QycQyyRjrvHpnyZfhQ6z6x4YZbP4Ae88FbbaCkAPALJYSYeT0id9MmjJ1GhQQ-ehZ4Dz-JtuDKAbXtePrfgUDIZn6Tk5Hvsebg1dSU16ES6mTY8Iklyr9fVdPth3XQwTpOoDkGeqDU5rRc2wtx0yD91vBC7J2roaTG4bZFnYLV9k/s1600/a.png", link: "https://training.finance.gov.bd/acs/v2/general/home" },
  { name: "জন্ম নিবন্ধন আবেদন", logo: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhIUcfEleYR4vIsscnivWiU3i_Y9_CAKCQWEa_xgZSlzlOX5-_D0O8wUsjxNBAEekSwraFkQQcaUMPPpb5e49aEqZhWteN1LNjHMJoBFUSD2eUFsBfQMFc11EDrBaUDjYUZtBlnsIxK0SJSgo22DZuOCiANEd9zafKTZD4egaGrm0vGPsx8BJDQ4m4Egpw/s1600/dob.png", link: "https://bdris.gov.bd/" },
  { name: "জন্ম নিবন্ধন যাচাই", logo: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh_YtLcyQqdG8mF1SEK2V0upbcWkDImMFjPFTAnyNxYmGnmw4FYR3ZoApXGsVSFqz2_ed32oGwCJn2dWhra3bEeZhn-Q9KXMBDtnvyXO0Yg8Hi13QJjgTXqyjOYRVzJty-hUK1OA1ijBBqnCJ2w_09pOW3RNToYRow3lcffGWI6yrl2ZAZWaY6UBGTu-Z8/s1600/jonmo.jpeg", link: "https://www.jonmonibondhonjachai.com/" },
  { name: "এন-আইডি কার্ড আবেদন", logo: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj7vxBu4KQfuo5hnjjucdt3lYBLBYiRB1r44uu7hiqab3gebEP35LPij6iN05N6BKzbOT6ES_XyCDWjY45CMeihFotaqhH-Lr8pq_UPAwHgvzkcdwV6HYDi01bWRgb4vE1VTNQ7vKEzOT7yPzLgZbNw6pcQWpfKrzrse8ayVgbqC5ay_40WWGPzSHLJNkk/s1600/ec.png", link: "https://services.nidw.gov.bd/nid-pub/register-account" },
  { name: "এন-আইডি কার্ড ডাউনলোড", logo: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj7vxBu4KQfuo5hnjjucdt3lYBLBYiRB1r44uu7hiqab3gebEP35LPij6iN05N6BKzbOT6ES_XyCDWjY45CMeihFotaqhH-Lr8pq_UPAwHgvzkcdwV6HYDi01bWRgb4vE1VTNQ7vKEzOT7yPzLgZbNw6pcQWpfKrzrse8ayVgbqC5ay_40WWGPzSHLJNkk/s1600/ec.png", link: "https://services.nidw.gov.bd/nid-pub/claim-account" },
  { name: "স্মার্ট এন-আইডি স্ট্যাটাস চেক", logo: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj7vxBu4KQfuo5hnjjucdt3lYBLBYiRB1r44uu7hiqab3gebEP35LPij6iN05N6BKzbOT6ES_XyCDWjY45CMeihFotaqhH-Lr8pq_UPAwHgvzkcdwV6HYDi01bWRgb4vE1VTNQ7vKEzOT7yPzLgZbNw6pcQWpfKrzrse8ayVgbqC5ay_40WWGPzSHLJNkk/s1600/ec.png", link: "https://services.nidw.gov.bd/nid-pub/card-status/" },
  { name: "পুলিশ ক্লিয়ারেন্স আবেদন", logo: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgmtvx1vEtRMHAg5YP6yfhFYDV8Z3nR_TFtyQrz2oSstd06pi7_5bjClmi34uQOzv6ZuRqeOA4Vve5rR7rEItu18u6pf7Ga47ErScBtpbRWttoVibEHtiYhwLrD8_UInznelVqbEUTBaH_sZnKv9YyzgURZVsfrhxjSj_1fclP9Ea1n2JVatAarjK_wyG4/s1600/images.jpeg", link: "https://pcc.police.gov.bd/ords/r/pcc/pcc/home" },
  { name: "টিন সার্টিফিকেট আবেদন", logo: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhXdnYR5c1Do8RDGkOn7Q-t4ibfSfRAteIBLX4SRavOs2czQDItU-3OWQ0-D7R7FA5Nn6nzSXflAucLedNTcCYrI0AGC_OGWwZFhYeuqmG1monQd3sDn4Jk_j2tYN7vqz2uLgkX0fSKqfUs-QFxoSLw3iCB7bLgfQ2BTpVtG55hBJF-pIyKWY7V_RasGLI/s1600/tin.jpg", link: "https://secure.incometax.gov.bd/TINHome" },
  { name: "ড্রাইভিং লাইসেন্স আবেদন", logo: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiEMf32wPXNpG8c15ixXDF-ra9TP1Wudm1NG5u6vQX5BeBN-X9vFJgyLowTFfSmKS28k6PeqqR5FZvHbYV6HBXj7toG_GUob6QklaFzVx9xIzM6CjcO_M5fQm4LV7Uvv2wXWVAgice0y-zB_G_1HZMZ_WcCk6YLLRfvtlrFZag0_R1oSWC-0UqJndRR56A/s1600/brta.png", link: "https://bsp.brta.gov.bd" },
  { name: "টাইফয়েড ভ্যাকসিন আবেদন", logo: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjvHDbfqFrEbczVCCWZ2KdeouLRWcnEfHcL4C5mcyPW-_oJssL4cxPb8LFT4CFMr9htZh8rSI27oVFaPesb3p6zdOEZ7L4uBzaPJZlEhTNQvRVqpCifWp9b0BnhxIYB1riseXz1dXeT4ZxPOu6EYUtCVT8vMgN2S9IPf_Cd4V_7AnDn74-d4rhYuMB6PJ8/s1600/tica.png", link: "https://vaxepi.gov.bd/registration/tcv" },
  { name: "মেনিনজাইটিস ভ্যাকসিন আবেদন", logo: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjvHDbfqFrEbczVCCWZ2KdeouLRWcnEfHcL4C5mcyPW-_oJssL4cxPb8LFT4CFMr9htZh8rSI27oVFaPesb3p6zdOEZ7L4uBzaPJZlEhTNQvRVqpCifWp9b0BnhxIYB1riseXz1dXeT4ZxPOu6EYUtCVT8vMgN2S9IPf_Cd4V_7AnDn74-d4rhYuMB6PJ8/s1600/tica.png", link: "https://vaxepi.gov.bd/registration/meningitis" },
  { name: "এইচপিভি ভ্যাকসিন আবেদন", logo: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjvHDbfqFrEbczVCCWZ2KdeouLRWcnEfHcL4C5mcyPW-_oJssL4cxPb8LFT4CFMr9htZh8rSI27oVFaPesb3p6zdOEZ7L4uBzaPJZlEhTNQvRVqpCifWp9b0BnhxIYB1riseXz1dXeT4ZxPOu6EYUtCVT8vMgN2S9IPf_Cd4V_7AnDn74-d4rhYuMB6PJ8/s1600/tica.png", link: "https://vaxepi.gov.bd/registration/hpv" },
  { name: "এনরোলমেন্ট কার্ড ডাউনলোড", logo: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjUzJO-wJMSaip93MkajMd65T4aojN748IeFFJ_rzsm944Kfsp_NQ398_F7-b-FI0EeDaywSybxWJbUzf05fPRDV0piDTIosaX0DNnFt1ILn1dayCMMGL45tW-y1bhdx4Sbe8zMPj_0gkwFHoSZ3fkYTwycm-4LitOdx7IOiUYSIxxi2PSIXaqUOcSBUvk/s1600/tre.png", link: "https://training.oep.gov.bd/pdo-enrollment-card" },
  { name: "ট্রেনিং সার্টিফিকেট ডাউনলোড", logo: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjUzJO-wJMSaip93MkajMd65T4aojN748IeFFJ_rzsm944Kfsp_NQ398_F7-b-FI0EeDaywSybxWJbUzf05fPRDV0piDTIosaX0DNnFt1ILn1dayCMMGL45tW-y1bhdx4Sbe8zMPj_0gkwFHoSZ3fkYTwycm-4LitOdx7IOiUYSIxxi2PSIXaqUOcSBUvk/s1600/tre.png", link: "https://training.oep.gov.bd/pdo-certificate" },
  { name: "ম্যানপাওয়ার ডাউনলোড", logo: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjUzJO-wJMSaip93MkajMd65T4aojN748IeFFJ_rzsm944Kfsp_NQ398_F7-b-FI0EeDaywSybxWJbUzf05fPRDV0piDTIosaX0DNnFt1ILn1dayCMMGL45tW-y1bhdx4Sbe8zMPj_0gkwFHoSZ3fkYTwycm-4LitOdx7IOiUYSIxxi2PSIXaqUOcSBUvk/s1600/tre.png", link: "https://self.oep.gov.bd/self-clearance/login" },
  { name: "বিএমইটি আবেদন", logo: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjUzJO-wJMSaip93MkajMd65T4aojN748IeFFJ_rzsm944Kfsp_NQ398_F7-b-FI0EeDaywSybxWJbUzf05fPRDV0piDTIosaX0DNnFt1ILn1dayCMMGL45tW-y1bhdx4Sbe8zMPj_0gkwFHoSZ3fkYTwycm-4LitOdx7IOiUYSIxxi2PSIXaqUOcSBUvk/s1600/tre.png", link: "https://employee.oep.gov.bd/employee/login-with-otp" },
  { name: "ই-পাসপোর্ট আবেদন", logo: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh_AQfad2_5iM7I-0OBASm7oQhUU7Y0Rr_eLY3t4weuYxgnnX0adAjSdoUZst1QZhUajfVAznth0P3QsAcfqTDytRnn71n81TG2CGAFoZBEXw1xq7WBxS4hoY3xn18ZNClD8DNTC_q6keBVJaFsJQtpBGLqh0zcufM3h86TnTaJioxEE2X4vs2YL6qxQ6Q/s1600/pass.jpeg", link: "https://epassport.gov.bd/onboarding" },
  { name: "পাসপোর্ট আবেদন চেক", logo: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh_AQfad2_5iM7I-0OBASm7oQhUU7Y0Rr_eLY3t4weuYxgnnX0adAjSdoUZst1QZhUajfVAznth0P3QsAcfqTDytRnn71n81TG2CGAFoZBEXw1xq7WBxS4hoY3xn18ZNClD8DNTC_q6keBVJaFsJQtpBGLqh0zcufM3h86TnTaJioxEE2X4vs2YL6qxQ6Q/s1600/pass.jpeg", link: "https://epassport.gov.bd/authorization/application-status" },
  { name: "জমির খারিজ আবেদন", logo: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiXPLdr2zh11miyPhvU8DAQ_GOPVVd1Hi7Q3Go2t7z_h_Zh9jVHp8PW9ZvM8tUSQauzCjSTsq7PAX2pCKZ93vWniCNFEEgUTZRXR8xP7d1czW3ZAjbnkbm_k-2VjBs6OZmfDLIMws49ujcbWtGV7PdyTa_824bQAvekD6NOpW6dV85YT0_E8XpOjClROrs/s1600/img.png", link: "https://mutation.land.gov.bd/" },
  { name: "ভূমি উন্নয়ন কর প্রদান", logo: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgQPbEEPSG2zQzSlm69zecnUDN-MmmKn63TI9WTtO4q11LV1M6hBkjart0VW6AUQqRiYQ1J0IhB6pOJ6ZIYovzvmltzoXYvgMV47W3TRvGb0MrZVj5AlCxyxL93UzwlEHnGFfY2zAS3VBRBzidA2-ZFvKz2PW3Fe8TRMGfY821pm-lDMNvesOOsf6ARI2Q/s1600/v.webp", link: "https://portal.ldtax.gov.bd/sso" },
  { name: "ভূমি ম্যাপ ও খতিয়ান", logo: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgLmPkgq6LF_0oQXrnP0Ko1rhH824k6c53FhhAMazthbZFcj0qc3LfCUt9LuNyQzauffalsdb491ikMuIpMy6XRS2Je-tjx7fn0Px_JWwWTC0G76pFRkHffJosd0JGq3kdJuMZXkjUHSa4hzHlvUuK3TnONJqYrBGsnucMFcTUzDjEvoYqvhhx4F3pk9XE/s1600/map.webp", link: "https://dlrms.land.gov.bd/" },
  { name: "স্মার্ট নাগরিক ইউনিয়ন", logo: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhtKj6ftyZJ-sGj1rT6yARFq1ajkDDdYVr45Eqqz620s9fW80NZSnnDEjJ5MiTbUWv3I2-X52uOjEwKduJ8qqwsDEr1piGfAG0oCX2k-6p4lU4uiPFYCOqpZonfQos-t3tJnrviH6geuC34gmLcSDdXoItvV-sLuzaY0xlCk5ImHdPLHa1XxtvaIwHOEOY/s1600/01.png", link: "https://smartnagorik.com.bd" },
  { name: "টিসিবি স্মার্ট কার্ড", logo: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh0th-c30M1lhcC71nbm1R6WtwkMC7OIHmXSuZxXKy1auXuCxWDgNuj5dtneWhvnHgr_0gCP_F2xDikqB12vHF-Cu-GQ5p6Ui56g5hccCKtk8b5puGJIKFLTzJOstmaKkOo5xMNSIb-MD0hcFtsTr9RqfzrQXdF72PuV_bo8NuGcL7A79rpFQRYZV13z1o/s1600/tcb.jpeg", link: "https://tcbsheba.com/" },
  
{ name: "আমি প্রবাসী", logo: "https://dnq4a6incipq3.cloudfront.net/website/public/img/logo.png", link: "https://www.amiprobashi.com/" },

{ name: "বোয়েসেল", logo: "https://brms.boesl.gov.bd/assets/images/logo_big.png", link: "https://brms.boesl.gov.bd/" },

{ name: "মাই গভ", logo: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhu8X7x1D2_bz6MmFspi60T9n6ym379tKQDpCpEu-NKDUjJbeoMJUStSMJ-LFQLmCy6SkjRBhdBi848R5NXlpaz_bSXjvUGLA5O_zi_uuIYeG30rH9WgRl_Pz15gw9-wmRZ0wEHkTFBASyF1qSvWhggRNn1Q6LBIy0GDsub-5-uxKHw9zqhFoHz1TAo7eE/s320/mygov.png", link: "https://www.mygov.bd/" },

{ name: "আমার সেবা", logo: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhYjUuEQfS67Ip54bDjq2eCnvfgm0yIw4b1HLeRTPPjnd8sStv0GswWM_7139aSQpB50rQgmVl5agTJ429XzcuCmyTnpMW9m3isFaH31IHyun_7UIQXg7AbNIUmQnqjBZ0yCNP76Du0J9-wrVzGNjanu3oXCPbJNfDGCmaWsRRVzgyCsiOyMIOdc6VEk84/s1600/seba.png", link: "https://e-amarseba.com/" }
];

// গ্রেডিয়েন্ট প্যালেট
const sebaGradients = [
  "linear-gradient(135deg, #ff8a80, #ff5252)",
  "linear-gradient(135deg, #a5d6a7, #66bb6a)",
  "linear-gradient(135deg, #90caf9, #42a5f5)",
  "linear-gradient(135deg, #ffe082, #ffb347)"
];

function openSebaModal() {
    if(typeof setActiveMode === "function") setActiveMode('mode-online-seba');
    document.getElementById('onlineSebaModal').style.display = 'flex';
    renderSebaGrid();
}

function closeSebaModal() {
    document.getElementById('onlineSebaModal').style.display = 'none';
}

function renderSebaGrid() {
    const container = document.getElementById("seba-master-grid");
    container.innerHTML = "";

    onlineSebaList.forEach((seba, index) => {
        const card = document.createElement("div");
        card.className = "seba-card-item";
        card.style.background = sebaGradients[index % sebaGradients.length];
        
        card.innerHTML = `
            <img src="${seba.logo}" alt="${seba.name}">
            <span>${seba.name}</span>
            <div class="btn-seba-visit">ভিজিট করুন</div>
        `;
        
        card.onclick = () => window.open(seba.link, '_blank');
        container.appendChild(card);
    });
}
//# sourceMappingURL=/sm/f0270b33914b5ca2bf644aa48f01bad1b1c3f517173d59895ce78c704c63c622.map
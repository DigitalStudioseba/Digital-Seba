/**
 * Combined by jsDelivr.
 * Original files:
 * - /gh/monirkarimbd-web/scanner@main/qr-pro.js
 * - /gh/monirkarimbd-web/scanner@main/scloud.js
 * - /gh/monirkarimbd-web/scanner@main/aipp1.js
 * - /gh/monirkarimbd-web/scanner@main/pntick.js
 * - /gh/monirkarimbd-web/scanner@main/qr-br.js
 * - /gh/monirkarimbd-web/scanner@main/wedding.js
 * - /gh/monirkarimbd-web/scanner@main/typings.js
 * - /gh/monirkarimbd-web/scanner@main/enhancer.js
 * - /gh/monirkarimbd-web/scanner@main/fav1.js
 * - /gh/monirkarimbd-web/scanner@main/stamp.js
 * - /gh/monirkarimbd-web/scanner@main/xts.js
 * - /gh/monirkarimbd-web/scanner@main/prompta.js
 * - /gh/monirkarimbd-web/scanner@main/receipt.js
 * - /gh/monirkarimbd-web/scanner@main/barcodeg.js
 * - /gh/monirkarimbd-web/scanner@main/tele.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
let currentQrType="url";function openQrModal(){"function"==typeof setActiveMode&&setActiveMode("mode-qr-gen");let e=document.getElementById("qrModal");e?(e.style.display="flex",document.body.style.overflow="hidden",setTimeout(generateAdvancedQR,100)):alert("Modal ID 'qrModal' not found in HTML!")}function closeQrModal(){document.getElementById("qrModal").style.display="none",document.body.style.overflow="auto"}function switchQrType(e,t){currentQrType=e,document.querySelectorAll(".qrg-tab").forEach(e=>e.classList.remove("active")),t.classList.add("active"),document.getElementById("qr-url-group").style.display="url"===e?"block":"none",document.getElementById("qr-text-group").style.display="text"===e?"block":"none",document.getElementById("qr-wifi-group").style.display="wifi"===e?"block":"none",document.getElementById("qr-email-group").style.display="email"===e?"block":"none",generateAdvancedQR()}function generateAdvancedQR(){let e="",t=document.getElementById("qrColorFG").value||"#000000",l=document.getElementById("qrColorBG").value||"#ffffff",r=document.getElementById("socialCardToggle").checked;if("url"===currentQrType)e=document.getElementById("qrInputUrl").value||"http://seba.pro.bd";else if("text"===currentQrType)e=document.getElementById("qrInputText").value||"Hello!";else if("wifi"===currentQrType){let n;e="WIFI:S:"+(document.getElementById("qrWifiName").value||"WiFi")+";T:WPA;P:"+(document.getElementById("qrWifiPass").value||"")+";;"}else if("email"===currentQrType){let o;e="MATMSG:TO:"+(document.getElementById("qrEmailTo").value||"mail@example.com")+";SUB:"+(document.getElementById("qrEmailSub").value||"Hello")+";BODY:;;"}let a=document.getElementById("qrFinalLayout"),d=document.getElementById("socialText");r?(a.style.background=l,a.style.border="4px solid "+t,d.style.display = 'flex',d.style.color=t):(a.style.background="transparent",a.style.border="none",d.style.display="none");let y=document.getElementById("qrcodeCanvas");if(y){y.innerHTML="";try{new QRCode(y,{text:e,width:180,height:180,colorDark:t,colorLight:l,correctLevel:QRCode.CorrectLevel.H})}catch(c){console.error("QR Library Error:",c)}}}function downloadAdvancedQR(){let e=document.getElementById("qrExportWrapper");"undefined"!=typeof html2canvas?html2canvas(e,{backgroundColor:null,scale:3}).then(e=>{let t=document.createElement("a");t.download="Pro_QRCode.png",t.href=e.toDataURL("image/png"),t.click()}):alert("Library html2canvas not loaded!")}function resetQR(){document.querySelectorAll("#qrInputFields input, #qrInputFields textarea").forEach(e=>e.value=""),document.getElementById("qrColorFG").value="#000000",document.getElementById("qrColorBG").value="#ffffff",document.getElementById("socialCardToggle").checked=!1;let e=document.getElementById("tab-url");e&&switchQrType("url",e),generateAdvancedQR(),console.log("QR Generator Reset Successfully!")}
;

const CLIENT_ID = '742363063259-hecd6i38ovt8kv16na4c7qrv21hrpg9k.apps.googleusercontent.com';
  const API_KEY = 'AIzaSyCQDzRhsSN13iIsQ81eXBE-bHMSm-X2BDY'; 
  const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
  const SCOPES = 'https://www.googleapis.com/auth/drive.file';

  let currentCloudMode = 'photo'; 
  let tokenClient, gapiInited = false, gisInited = false;
  let fileToDeleteId = null;
  let elementToRemove = null;

  function triggerAlert(msg) {
    const popup = document.getElementById('customPopup');
    if (popup) {
        document.getElementById('popupMessage').innerText = msg;
        popup.classList.add('active');
    } else { alert(msg); }
  }

  function gapiLoaded() { gapi.load('client', async () => { await gapi.client.init({ apiKey: API_KEY, discoveryDocs: [DISCOVERY_DOC] }); gapiInited = true; checkAuth(); }); }
  function gisLoaded() { tokenClient = google.accounts.oauth2.initTokenClient({ client_id: CLIENT_ID, scope: SCOPES, callback: '' }); gisInited = true; checkAuth(); }
  function checkAuth() { const t = localStorage.getItem('studio_cloud_token'); if(t && gapiInited) { const tk = JSON.parse(t); if(Date.now() < tk.expires_at) { gapi.client.setToken(tk); if(document.getElementById('studioCloudModal').style.display==='flex') showMainUI(); } } }

  function switchCloudMode(mode) {
    currentCloudMode = mode;
    document.getElementById('btn-mode-photo').classList.toggle('active', mode === 'photo');
    document.getElementById('btn-mode-file').classList.toggle('active', mode === 'file');
    document.getElementById('mode-icon-display').className = mode === 'photo' ? 'fa-solid fa-image' : 'fa-solid fa-file-invoice';
    document.getElementById('upload-instruction').innerText = mode === 'photo' ? 'Click to import Photos' : 'Click to import Files';
    document.getElementById('save-mode-text').innerText = mode === 'photo' ? 'Photos' : 'Files';
    document.getElementById('gallery-title').innerHTML = mode === 'photo' ? '<i class="fa-solid fa-images"></i> Photos Database' : '<i class="fa-solid fa-folder-open"></i> Files Database';
    const fi = document.getElementById('st-input-file');
    fi.accept = mode === 'photo' ? 'image/*' : '.pdf,.doc,.docx,.zip,.rar,.txt,.xls,.xlsx,.ppt,.pptx';
    document.getElementById('preview-container').style.display = 'none';
    fi.value = "";
    listCloudFiles();
  }

  function handleAuthClick() {
    tokenClient.callback = (resp) => {
        resp.expires_at = Date.now() + (resp.expires_in * 1000);
        localStorage.setItem('studio_cloud_token', JSON.stringify(resp));
        showMainUI();
    };
    tokenClient.requestAccessToken({prompt: 'consent'});
  }

  function showMainUI() {
    document.getElementById('cloud-auth-section').style.display = 'none';
    document.getElementById('cloud-main-ui').style.display = 'flex';
    initHandlers();
    listCloudFiles();
  }

  function initHandlers() {
    const fi = document.getElementById('st-input-file');
    document.getElementById('drop-zone').onclick = () => fi.click();
    fi.onchange = () => { if(fi.files[0]) handlePreview(fi.files[0]); };
  }

  function handlePreview(file) {
    if (currentCloudMode === 'photo' && !file.type.startsWith('image/')) {
        triggerAlert("Error: Only Photos allowed in Photo Mode!");
        document.getElementById('st-input-file').value = "";
        return;
    }
    if (currentCloudMode === 'file' && file.type.startsWith('image/')) {
        triggerAlert("Error: Photos are not allowed in File Mode!");
        document.getElementById('st-input-file').value = "";
        return;
    }
    const container = document.getElementById('preview-container');
    const img = document.getElementById('preview-img');
    const icon = document.getElementById('preview-file-icon');
    const name = document.getElementById('preview-file-name');
    container.style.display = 'flex';
    name.innerText = file.name;
    if(file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = e => { img.src = e.target.result; img.style.display = 'flex'; icon.style.display = 'none'; };
        reader.readAsDataURL(file);
    } else {
        img.style.display = 'none';
        icon.style.display = 'flex';
        let ext = file.name.split('.').pop().toLowerCase();
        icon.innerHTML = `<i class="fa-solid fa-file-lines"></i>`;
    }
  }

  async function uploadToDrive() {
    const fileInput = document.getElementById('st-input-file');
    const name = document.getElementById('st-name').value.trim();
    const phone = document.getElementById('st-phone').value.trim();
    const address = document.getElementById('st-address').value.trim();
    const loader = document.getElementById('upload-loader');
    const saveBtn = document.getElementById('save-btn');
    if(!fileInput.files[0] || !name) { triggerAlert("Required: Name and File missing!"); return; }
    loader.style.display = 'flex';
    saveBtn.disabled = true;
    const file = fileInput.files[0];
    const metadata = {
        name: `ST_${currentCloudMode.toUpperCase()}_${Date.now()}_${file.name}`,
        mimeType: file.type,
        properties: { 'mode': currentCloudMode, 'custName': name, 'custPhone': phone, 'custAddr': address }
    };
    const formData = new FormData();
    formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    formData.append('file', file);
    try {
        const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
            method: 'POST',
            headers: new Headers({ 'Authorization': 'Bearer ' + gapi.client.getToken().access_token }),
            body: formData
        });
        if(res.ok) {
            triggerAlert("Success: Saved to Cloud!");
            loader.style.display = 'none'; saveBtn.disabled = false;
            document.getElementById('st-name').value = ''; document.getElementById('st-phone').value = ''; document.getElementById('st-address').value = '';
            document.getElementById('preview-container').style.display = 'none'; fileInput.value = "";
            listCloudFiles();
        } else { throw new Error(); }
    } catch (e) { loader.style.display = 'none'; saveBtn.disabled = false; triggerAlert("Error: Upload failed!"); }
  }

  async function listCloudFiles() {
    const gallery = document.getElementById('cloud-gallery');
    gallery.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:20px; color:#4285F4;"><i class="fa-solid fa-spinner fa-spin"></i> Syncing...</div>';
    try {
        const resp = await gapi.client.drive.files.list({
            q: `name contains 'ST_${currentCloudMode.toUpperCase()}_'`,
            fields: 'files(id, name, thumbnailLink, mimeType, properties, webViewLink)',
            orderBy: 'createdTime desc'
        });
        const files = resp.result.files;
        gallery.innerHTML = '';
        if (files && files.length > 0) {
            files.forEach(file => {
                const cName = (file.properties?.custName || "N/A").replace(/'/g, "\\'");
                const cPhone = (file.properties?.custPhone || "N/A").replace(/'/g, "\\'");
                const cAddr = (file.properties?.custAddr || "No Address").replace(/'/g, "\\'");
                const isImg = file.mimeType.startsWith('image/');
                const thumb = file.thumbnailLink || "";
                let displayBox = isImg ? `<img src="${thumb.replace('s220', 's500')}" />` : `<i class="fa-solid fa-file-invoice" style="font-size:35px; color:#94a3b8;"></i>`;
                gallery.innerHTML += `
                    <div class='st-card'>
                        <div class='st-card-img-box' onclick="openPreview('${file.id}', '${isImg}', '${thumb}', '${file.webViewLink}', '${cName}')">
                            ${displayBox}
                        </div>
                        <div class='st-card-info'>
                            <b>${cName}</b>
                            <p><i class="fa-solid fa-phone" style="font-size:9px;"></i> ${cPhone}</p>
                            <p><i class="fa-solid fa-location-dot" style="font-size:9px;"></i> ${cAddr}</p>
                        </div>
                        <div class='st-card-actions'>
                            <button onclick='deleteFile("${file.id}", this)' class='st-btn-action btn-del'><i class="fa-solid fa-trash"></i> Delete</button>
                            <button onclick='downloadFile("${file.id}", "${file.name}")' class='st-btn-action btn-dl'><i class="fa-solid fa-download"></i> Download</button>
                        </div>
                    </div>`;
            });
        } else { gallery.innerHTML = '<p style="grid-column:1/-1; text-align:center; padding:30px; color:#94a3b8;">No records found.</p>'; }
    } catch (e) { gallery.innerHTML = '<p style="color:red; text-align:center; grid-column:1/-1;">Error loading database.</p>'; }
}

  function openPreview(id, isImg, thumb, webLink, name) {
    if (String(isImg) === 'true') {
        const overlay = document.getElementById('studioImgPreview');
        const img = document.getElementById('preview-full-img');
        const caption = document.getElementById('preview-caption');
        if (overlay && img) {
            if (thumb && thumb !== "" && thumb !== "undefined") {
                img.src = thumb.replace('s220', 's1000'); 
                img.style.display = 'flex';
                caption.innerText = name;
                overlay.style.display = 'flex';
            } else { window.open(webLink, '_blank'); }
        }
    } else { window.open(webLink, '_blank'); }
  }

  async function downloadFile(id, name) {
    try {
        const res = await fetch(`https://www.googleapis.com/drive/v3/files/${id}?alt=media`, {
            headers: { 'Authorization': 'Bearer ' + gapi.client.getToken().access_token }
        });
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = name.split('_').pop(); a.click();
    } catch (e) { triggerAlert("Error: Download failed!"); }
  }

  function deleteFile(id, btn) {
    fileToDeleteId = id;
    elementToRemove = btn.closest('.st-card');
    triggerAlert("Are you sure? This record will be deleted forever.");
    const popupBtn = document.querySelector('#customPopup .popup-btn');
    if (popupBtn) popupBtn.onclick = confirmAndExecuteDelete;
  }

  async function confirmAndExecuteDelete() {
    if (fileToDeleteId) {
        try {
            await gapi.client.drive.files.delete({ fileId: fileToDeleteId });
            if (elementToRemove) elementToRemove.remove();
            if (typeof closePopup === 'function') closePopup();
        } catch (e) { triggerAlert("Error: Delete failed!"); } 
        finally {
            fileToDeleteId = null; elementToRemove = null;
            const popupBtn = document.querySelector('#customPopup .popup-btn');
            if (popupBtn && typeof closePopup === 'function') popupBtn.onclick = closePopup;
        }
    }
}

  function openStudioCloudModal() { document.getElementById('studioCloudModal').style.display='flex'; checkAuth(); switchCloudMode('photo'); }
  function closeStudioCloudModal() { document.getElementById('studioCloudModal').style.display='none'; }
  function handleSignoutClick() { 
    google.accounts.oauth2.revoke(gapi.client.getToken().access_token);
    gapi.client.setToken(null); localStorage.removeItem('studio_cloud_token');
    document.getElementById('cloud-auth-section').style.display = 'flex';
    document.getElementById('cloud-main-ui').style.display='none';
  }
  function searchRecords() {
    const q = document.getElementById('st-search').value.toLowerCase();
    document.querySelectorAll('.st-card').forEach(c => { c.style.display = c.innerText.toLowerCase().includes(q) ? 'flex' : 'none'; });
  }
;

const aiPrompts = {
    male: "From any photo of any size or head position, create a passport-style front-facing headshot. The face shape, proportions, and features should not be altered in any way — not even slightly. Just adjust the head position so that the person is looking directly at the camera. Keep the natural face exactly as it is. Lighten the skin evenly all over to keep it realistic. Remove any acne, blemishes, or spots from the skin and maintain natural texture. Remove all shadows, harsh lights, or reflections to ensure even, balanced lighting. Keep the original clothing color but the clothing will look clean and new. Use a white background with no shadows. The photo should be high resolution, with the head occupying 70-80% of the frame, perfectly centered, and vertically aligned. Automatically crop the photo to standard passport size (2x2 inches / 600x600 px).",
    female: "From any photo of any size or head position, create a passport-style front-facing headshot. The face shape, proportions, and features should not be altered in any way — not even slightly. Just adjust the head position so that the person is looking directly at the camera. Keep the natural face exactly as it is. Lighten the skin evenly in all areas to keep it realistic. Remove any acne, blemishes, or spots from the skin and maintain natural texture. Remove all shadows, harsh lights, or reflections to ensure even, balanced lighting. Both ears should be fully visible. Keep the original clothing color but the clothing will be clean new. Use a white background with no shadows. The photo should be high resolution, with the head occupying 70-80% of the frame, perfectly centered, and vertically aligned. Automatically crop the photo to standard passport size (2x2 inches / 600x600 px).",
    hijab: "From any photo of any size or head position, create a passport-style front-facing headshot. The face shape, proportions, and features should not be altered in any way — not even slightly. Just adjust the head position so that the person is looking directly at the camera. Keep the natural face exactly as it is. Lighten the skin evenly all over to keep it realistic. Remove any acne, blemishes, or spots from the skin and maintain natural texture. Remove all shadows, harsh lights, or reflections to ensure even, balanced lighting. Keep the original clothing color but the clothing will look clean and new. Use a white background with no shadows. The photo should be high resolution, with the head occupying 70-80% of the frame, perfectly centered, and vertically aligned. Automatically crop the photo to standard passport size (2x2 inches / 600x600 px)."
};

const aiTranslations = {
    en: {
        title: "AI Passport Photo Lab",
        sub: "Click a card to auto-copy the prompt and open Google AI Studio instantly.",
        demoBtn1: "<i class='fa-solid fa-eye'></i> View Usage Method",
        demoBtn2: "<i class='fa-solid fa-eye'></i> View Demo Photos",
        male: "Male Passport Photo:",
        smale: "To automatically generate a natural passport photo meeting official standards.",
        female: "Female Passport Photo:",
        sfemale: "Creating a passport headshot photo from any photo, ears will be there.",
        hijab: "Hijab Passport Photo:",
        shijab: "Creating passport-perfect facial headshots from any photo wearing a hijab.",
        insHead: "🚀 How to Use & Guidelines:",
        insBody: "1. <b>Login:</b> Access AI Studio with your Google account. Connect your <b>Google Drive</b> if prompted for storage.<br/>" +
                 "2. <b>Select Type:</b> Click a photo category above (Prompt will auto-copy).<br/>" +
                 "3. <b>Paste:</b> In AI Studio, <b>Paste (Ctrl+V)</b> the prompt into the chat box.<br/>" +
                 "4. <b>Settings:</b> On the right sidebar, select <b>Aspect Ratio: 4:5</b>.<br/>" +
                 "5. <b>Upload:</b> Click the <b>'+' or Upload icon</b> below the box to add your photo.<br/>" +
                 "6. <b>Generate:</b> Click the <b>Run</b> button. Wait 15 seconds for your HD passport photo!"
    },
    bn: {
        title: "এআই পাসপোর্ট ফটো ল্যাব",
        sub: "বাটন ক্লিক করলে প্রম্পট অটোমেটিক কপি হয়ে গুগল এআই স্টুডিও ওপেন হবে।",
        demoBtn1: "<i class='fa-solid fa-eye'></i> ব্যবহার পদ্ধতি দেখুন",
        demoBtn2: "<i class='fa-solid fa-eye'></i> ডেমো ফটো দেখুন",
        male: "ছেলেদের পাসপোর্ট ছবি:",
        smale: "স্বয়ংক্রিয়ভাবে প্রাকৃতিক মুখের পাসপোর্ট ছবি তৈরি করা, যা অফিসিয়াল মান পূরণ করে।",
        female: "মেয়েদের পাসপোর্ট ছবি:",
        sfemale: "যেকোনো ছবি থেকে পাসপোর্ট-স্টাইলের নিখুঁত ফেসিয়াল হেডশট তৈরি করা, যেখানে কান দৃশ্যমান থাকবে।",
        hijab: "মেয়েদের হিজাব পাসপোর্ট ছবি:",
        shijab: "হিজাব পড়া যেকোনো ছবি থেকে পাসপোর্ট-স্টাইলের নিখুঁত ফেসিয়াল হেডশট তৈরি করা।",
        insHead: "🚀 ব্যবহার বিধি ও গাইডলাইন:",
        insBody: "১. <b>লগইন:</b> আপনার Google একাউন্ট দিয়ে AI Studio লগইন করুন। স্টোরেজের জন্য <b>Google Drive</b> কানেক্ট করুন।<br/>" +
                 "২. <b>ধরন নির্বাচন:</b> উপরের যেকোনো একটি ছবিতে ক্লিক করুন (প্রম্পট অটো-কপি হবে)।<br/>" +
                 "৩. <b>পেস্ট:</b> AI Studio ওপেন হলে ইনপুট বক্সে প্রম্পটটি <b>Paste (Ctrl+V)</b> করুন।<br/>" +
                 "৪. <b>রেশিও:</b> ডান পাশের সেটিংস থেকে <b>Aspect Ratio: 4:5</b> সিলেক্ট করুন।<br/>" +
                 "৫. <b>আপলোড:</b> ইনপুট বক্সের নিচে <b>Upload</b> আইকনে ক্লিক করে আপনার ছবিটি দিন।<br/>" +
                 "৬. <b>রান:</b> সবশেষে <b>Run</b> বাটনে ক্লিক করুন। মাত্র ১৫ সেকেন্ডে তৈরি হবে এইচডি পাসপোর্ট ছবি।"
    }
};

window.openAiPassportModal = function() {
    if (typeof setActiveMode === "function") setActiveMode("mode-ai-passport");
    document.getElementById("aiPassportModal").style.display = "flex";
    document.body.style.overflow = "hidden";
    switchAiLang("en"); 
};

window.closeAiPassportModal = function() {
    document.getElementById("aiPassportModal").style.display = "none";
    document.body.style.overflow = "auto";
};

window.switchAiLang = function(lang) {
    const modal = document.getElementById("aiPassportModal");
    const tabEn = document.getElementById("ai-tab-en");
    const tabBn = document.getElementById("ai-tab-bn");
    const btnContainer = document.getElementById("demo-btn-container");

    if (lang === "en") {
        tabEn.classList.add("active");
        tabBn.classList.remove("active");
        modal.classList.remove("lang-bn");
    } else {
        tabBn.classList.add("active");
        tabEn.classList.remove("active");
        modal.classList.add("lang-bn");
    }

    const t = aiTranslations[lang];
    document.getElementById("ai-title").innerHTML = '<i class="fa-solid fa-robot"></i> ' + t.title;
    document.getElementById("ai-sub").innerHTML = t.sub;

    // Injecting demo buttons inside the script to ensure they work on GitHub
    btnContainer.innerHTML = `
        <button class="ai-demo-trigger" onclick="window.showAiDemo(1)">${t.demoBtn1}</button>
        <button class="ai-demo-trigger" onclick="window.showAiDemo(2)">${t.demoBtn2}</button>
    `;

    document.getElementById("txt-male").innerText = t.male;
    document.getElementById("sub-male").innerText = t.smale;
    document.getElementById("txt-female").innerText = t.female;
    document.getElementById("sub-female").innerText = t.sfemale;
    document.getElementById("txt-hijab").innerText = t.hijab;
    document.getElementById("sub-hijab").innerText = t.shijab;
    document.getElementById("ins-head").innerText = t.insHead;
    document.getElementById("ins-body").innerHTML = t.insBody;
};

window.processAiPassport = function(type) {
    const promptText = aiPrompts[type];
    const el = document.createElement('textarea');
    el.value = promptText;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    window.open("https://aistudio.google.com/prompts/new_chat?model=gemini-3.1-flash-lite-image", "_blank");
};

window.showAiDemo = function(num) {
    var box = document.getElementById("aiDemoBox" + num);
    if (box) {
        box.style.display = "flex";
        document.body.style.overflow = "hidden";
    }
};

window.hideAiDemo = function(num) {
    var box = document.getElementById("aiDemoBox" + num);
    if (box) {
        box.style.display = "none";
        document.body.style.overflow = "auto";
    }
};


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

window.openBnConverterModal=function(){setActiveMode('mode-bn-converter');document.getElementById("bnConverterModal").style.display="flex",document.body.style.overflow="hidden"},window.closeBnConverterModal=function(){document.getElementById("bnConverterModal").style.display="none",document.body.style.overflow="auto"};let bnTimer;window.processPhonetic=function(){clearTimeout(bnTimer);let e=document.getElementById("bn-input").value,t=document.getElementById("bn-output");if(!e.trim()){t.value="";return}bnTimer=setTimeout(async()=>{try{let n="https://inputtools.google.com/request?itc=bn-t-i0-und&num=1&cp=1&cs=1&ie=utf-8&oe=utf-8&text="+encodeURIComponent(e),l=await fetch(n),o=await l.json();if("SUCCESS"===o[0]){let i="",c=o[1];for(let r=0;r<c.length;r++){let a=c[r][0],s=c[r][1]&&c[r][1].length>0?c[r][1][0]:a;"."===a?i+="।":i+=s}t.value=i}}catch(u){console.error(u)}},250)},window.copyPhonetic=function(e){let t=document.getElementById("bn-output"),n=e.querySelector(".btn-label"),l=e.querySelector("i");if(!t||!t.value)return;let o=n.innerText,i=()=>{n.innerText="Copied!",e.classList.add("success-bg"),l&&(l.className="fa-solid fa-check"),setTimeout(()=>{n.innerText=o,e.classList.remove("success-bg"),l&&(l.className="fa-solid fa-copy")},2e3)};navigator.clipboard&&window.isSecureContext?navigator.clipboard.writeText(t.value).then(i):(t.select(),document.execCommand("copy"),i())},window.clearPhonetic=function(){document.getElementById("bn-input").value="",document.getElementById("bn-output").value="",document.getElementById("bn-input").focus()};
;

function openScannerModal(){document.getElementById("scannerModal").style.display="flex",document.body.style.overflow="hidden",resetScanner()}function closeScannerModal(){document.getElementById("scannerModal").style.display="none",document.body.style.overflow="auto",resetScanner(),hideThemeAlert()}function resetScanner(){let e=document.getElementById("qr-file-input");e&&(e.value="");let t=document.getElementById("scan-output");t&&(t.value=""),document.getElementById("scanner-result-box").style.display="none";let l=document.getElementById("upload-container");l.style.display = 'flex',l.style.opacity="1";let n=document.getElementById("drop-zone");n.innerHTML=`
        <i class='fa-solid fa-cloud-arrow-up' style='font-size: 40px; color: #6366f1; margin-bottom: 15px;'></i>
        <p style='font-weight: 700; color: #1e293b; margin: 0;'>Click to Upload Image</p>
        <p style='font-size: 12px; color: #64748b; margin-top: 5px;'>Supports PNG, JPG, WEBP</p>
    `}async function scanUploadedFile(e){let t=e.target.files[0];if(!t)return;let l=document.getElementById("drop-zone"),n=document.getElementById("upload-container");n.style.opacity="0.7",l.innerHTML="<i class='fa-solid fa-circle-notch fa-spin' style='font-size:40px; color:#6366f1;'></i><p style='margin-top:10px; font-weight:600;'>Scanning... Please wait</p>";let o=new Html5Qrcode("qr-reader-hidden");try{let a=await o.scanFile(t,!0);document.getElementById("scan-output").value=a,document.getElementById("scanner-result-box").style.display = 'flex',n.style.display="none"}catch(s){showThemeAlert("Could not find any QR code or Barcode. Please upload a clear image."),resetScanner()}}function showThemeAlert(e){document.getElementById("theme-alert-msg").innerText=e,document.getElementById("theme-alert-box").style.display = 'flex'}function hideThemeAlert(){document.getElementById("theme-alert-box").style.display="none"}function copyScannerResult(e){let t=document.getElementById("scan-output"),l=document.getElementById("scan-copy-label"),n=e.querySelector("i");t.value&&navigator.clipboard.writeText(t.value).then(()=>{l.innerText="Copied!",e.style.background="#25D366",n&&(n.className="fa-solid fa-check"),setTimeout(()=>{l.innerText="Copy Result",e.style.background="#0f172a",n&&(n.className="fa-solid fa-copy")},2e3)}).catch(e=>{t.select(),document.execCommand("copy")})}
;

let curWedT = 1;

// Language specific texts for static elements and placeholders
const translations = {
    bn: {
        // UI elements
        mainTitle: "বিবাহ স্মরণিকা",
        labelLang: "ভাষা",
        labelReligion: "ধর্ম",
        labelTemplate: "টেমপ্লেট পছন্দ করুন:",
        groomPlaceholder: "বরের নাম",
        bridePlaceholder: "কনের নাম",
        uploadPhoto1: "Upload Photo 1",
        uploadPhoto2: "Upload Photo 2",
        datePlaceholder: "বিবাহ তারিখ",
        venuePlaceholder: "বিবাহ স্থান",
        msgPlaceholder: "স্মরণিকা বার্তা...",
        saveJpg: "JPG সেভ করুন",
        savePdf: "PDF সেভ করুন",

        // Card content
        cardTitle: "বিবাহ স্মরণিকা",
        andSeparator: "ও",
        datePrefix: "বিবাহ তারিখ: ",
        venuePrefix: "বিবাহ স্থান: ",
        
        // Religion specific texts
        islamRel: "বিসমিল্লাহির রহমানির রহিম",
        hinduRel: "ওঁ গণেশায় নমঃ",
        christianRel: "ঈশ্বর প্রেমস্বরূপ",
        buddhistRel: "জগতের সকল প্রাণী সুখী হোক", 
        othersRel: "", 
        
        // Default input values
        groomDefaultVal: "মোঃ ফয়জুল করিম",
        brideDefaultVal: "মোসাঃ কাজল রেখা",
        dateDefaultVal: "১০ই জুন, ২০১২ সাল",
        venueDefaultVal: "ঝাউতলা, চট্টগ্রাম, বাংলাদেশ।",
        msgDefaultVal: "আমাদের বিবাহিত জীবনের সুখ ও সমৃদ্ধির জন্য সকলের কাছে দোয়া প্রার্থী।"
    },
    en: {
        // UI elements
        mainTitle: "Wedding Memento",
        labelLang: "Language",
        labelReligion: "Religion",
        labelTemplate: "Choose Template:",
        groomPlaceholder: "Groom's Name",
        bridePlaceholder: "Bride's Name",
        uploadPhoto1: "Upload Photo 1",
        uploadPhoto2: "Upload Photo 2",
        datePlaceholder: "Wedding Date",
        venuePlaceholder: "Wedding Venue",
        msgPlaceholder: "Memento Message...",
        saveJpg: "SAVE JPG (HD)",
        savePdf: "SAVE PDF (HD)",

        // Card content
        cardTitle: "Wedding Memento",
        andSeparator: "&",
        datePrefix: "Wedding Date: ",
        venuePrefix: "Wedding Venue: ",
        
        // Religion specific texts
        islamRel: "In the name of Allah",
        hinduRel: "Om Ganeshay Namah",
        christianRel: "God is Love",
        buddhistRel: "May all beings be happy",
        othersRel: "", 
        
        // Default input values
        groomDefaultVal: "Md. Monir Hossain",
        brideDefaultVal: "Mst. Kajol Rekha",
        dateDefaultVal: "June 10, 2012",
        venueDefaultVal: "Uttara, Dhaka, Bangladesh.",
        msgDefaultVal: "We seek everyone's prayers for our happy and prosperous married life."
    }
};

function openWeddingModal() {
    document.getElementById('weddingModal').style.display = 'flex';
    updateWedCard();
}

function closeWeddingModal() {
    document.getElementById('weddingModal').style.display = 'none';
    document.getElementById('wdm-lang').value = 'en'; 
    document.getElementById('wdm-rel').value = 'islam'; 
    const t = translations['en'];
    document.getElementById('in-groom').value = t.groomDefaultVal;
    document.getElementById('in-bride').value = t.brideDefaultVal;
    document.getElementById('in-date').value = t.dateDefaultVal;
    document.getElementById('in-venue').value = t.venueDefaultVal;
    document.getElementById('in-msg').value = t.msgDefaultVal;
    document.getElementById('pv-g').src = 'images/monir.jpeg';
    document.getElementById('pv-b').src = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiNymKgEuEk43BCasxhyphenhyphen2WrAlXEuCOkhdPCRPyIglB4H33kt3Z0Myu0QhAlreWCN4icd-om-e0uiWsHt6iRwO6AGaRk29w4uOSvu2_wxdl-c0TKXh7Juj7U5SKbZq4doyg1tryMPrEERazhbMANEuYwPIg8V20bfhmyVPb_QM8kLS0viDqGgvwP0piE05g/s1184/kajol.webp';
    document.getElementById('up-g').value = "";
    document.getElementById('up-b').value = "";
    curWedT = 1;
    document.querySelectorAll('.wdm-t-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('btn-temp-1').classList.add('active');
    document.getElementById('wdm-card-preview').className = 'wdm-t1';
    updateWedCard();
}

function setWedTemp(n, btn) {
    curWedT = n;
    document.querySelectorAll('.wdm-t-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('wdm-card-preview').className = 'wdm-t' + n;
}

function updateWedCard() {
    const lang = document.getElementById('wdm-lang').value;
    const rel = document.getElementById('wdm-rel').value;
    const t = translations[lang];

    document.getElementById('wdm-main-title').innerText = t.mainTitle;
    document.getElementById('label-lang').innerText = t.labelLang;
    document.getElementById('label-religion').innerText = t.labelReligion;
    document.getElementById('label-template').innerText = t.labelTemplate;
    document.getElementById('in-groom').placeholder = t.groomPlaceholder;
    document.getElementById('in-bride').placeholder = t.bridePlaceholder;
    document.getElementById('btn-upload-g').innerText = t.uploadPhoto1;
    document.getElementById('btn-upload-b').innerText = t.uploadPhoto2;
    document.getElementById('in-date').placeholder = t.datePlaceholder;
    document.getElementById('in-venue').placeholder = t.venuePlaceholder;
    document.getElementById('in-msg').placeholder = t.msgPlaceholder;
    
    document.querySelector('.actions button:nth-child(1)').innerText = t.saveJpg;
    document.querySelector('.actions button:nth-child(2)').innerText = t.savePdf;

    let relIcon = '';
    let relText = '';
    switch (rel) {
        case 'islam': relIcon = "☪"; relText = t.islamRel; break;
        case 'hindu': relIcon = "🕉"; relText = t.hinduRel; break;
        case 'christian': relIcon = "✝"; relText = t.christianRel; break;
        case 'buddhist': relIcon = "☸"; relText = t.buddhistRel; break;
        case 'others': relIcon = "❤"; relText = t.othersRel; break;
    }
    document.getElementById('pv-rel-icon').innerText = relIcon;
    document.getElementById('pv-rel-txt').innerText = relText;

    document.getElementById('pv-title').innerText = t.cardTitle;
    document.getElementById('pv-and').innerText = t.andSeparator;
    
    document.getElementById('pv-groom').innerText = document.getElementById('in-groom').value;
    document.getElementById('pv-bride').innerText = document.getElementById('in-bride').value;
    
    // নতুন কোড (ম্যানুয়ালি বসান)
document.getElementById('pv-date').innerHTML = '<b>' + t.datePrefix + '</b>' + document.getElementById('in-date').value;
document.getElementById('pv-venue').innerHTML = '<b>' + t.venuePrefix + '</b>' + document.getElementById('in-venue').value;
    document.getElementById('pv-msg').innerText = document.getElementById('in-msg').value;

    const currentGroomVal = document.getElementById('in-groom').value;
    const currentBrideVal = document.getElementById('in-bride').value;
    const currentMsgVal = document.getElementById('in-msg').value;
    const currentDateVal = document.getElementById('in-date').value;
    const currentVenueVal = document.getElementById('in-venue').value;
    const otherLang = lang === 'en' ? 'bn' : 'en';

    if (currentGroomVal === translations[otherLang].groomDefaultVal) document.getElementById('in-groom').value = t.groomDefaultVal;
    if (currentBrideVal === translations[otherLang].brideDefaultVal) document.getElementById('in-bride').value = t.brideDefaultVal;
    if (currentMsgVal === translations[otherLang].msgDefaultVal) document.getElementById('in-msg').value = t.msgDefaultVal;
    if (currentDateVal === translations[otherLang].dateDefaultVal) document.getElementById('in-date').value = t.dateDefaultVal;
    if (currentVenueVal === translations[otherLang].venueDefaultVal) document.getElementById('in-venue').value = t.venueDefaultVal;
}


function loadWedImg(input, id) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => { document.getElementById(id).src = e.target.result; };
        reader.readAsDataURL(input.files[0]);
    }
}

function saveWedJPG() {
    const card = document.getElementById('wdm-card-preview');
    html2canvas(card, { scale: 4, useCORS: true, logging: false }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'wedding-memento-hd.jpg';
        link.href = canvas.toDataURL('image/jpeg', 1.0);
        link.click();
    });
}

function saveWedPDF() {
    const { jsPDF } = window.jspdf;
    const card = document.getElementById('wdm-card-preview');
    html2canvas(card, { scale: 4, useCORS: true }).then(canvas => {
        const img = canvas.toDataURL('image/jpeg', 1.0);
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfW = pdf.internal.pageSize.getWidth();
        const pdfH = pdf.internal.pageSize.getHeight();
        pdf.addImage(img, 'JPEG', 0, 0, pdfW, pdfH);
        pdf.save('wedding-memento-hd.pdf');
    });
}

document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('wdm-lang').value = 'en';
    updateWedCard(); 
});
;

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

function openWriterModal() {
    var modal = document.getElementById('writerModal');
    if (modal) {
        modal.style.display = 'flex';
        if (typeof setActiveMode === 'function') setActiveMode('mode-writer');
        
        const pagesList = document.getElementById('pages-list');
        if (pagesList.innerHTML.trim() === "") {
            addNewPage();
        }
    }
}

function closeWriterModal() {
    document.getElementById('writerModal').style.display = 'none';
}

function execCmd(command, value = null) {
    document.execCommand(command, false, value);
}

function applyFontSize(size) {
    document.execCommand('fontSize', false, size);
}

function addNewPage() {
    const pagesList = document.getElementById('pages-list');
    const pageDiv = document.createElement('div');
    pageDiv.className = 'page-unit';
    pageDiv.innerHTML = `
        <button class="del-page-icon" onclick="removeThisPage(this)" title="Delete Page" type="button"><i class="fa-solid fa-xmark"></i></button>
        <div contenteditable="true" class="page-body" data-placeholder="Start your writing here in Bengali, English, any language, etc." spellcheck="false"></div>
    `;
    pagesList.appendChild(pageDiv);
    pageDiv.scrollIntoView({ behavior: 'smooth' });
}

function removeThisPage(btn) {
    const pages = document.querySelectorAll('.page-unit');
    if (pages.length > 1) {
        btn.parentElement.remove();
    } else {
        triggerAlert("There must be at least one page.");
    }
}

function clearWriter() {
    document.getElementById('pages-list').innerHTML = "";
    addNewPage();
}

function printWriterContent() {
    const pages = document.querySelectorAll('.page-body');
    let allHtml = "";
    let hasContent = false;
    
    pages.forEach((page) => {
        if(page.innerText.trim() !== "") {
            allHtml += `<div class="p-wrap">${page.innerHTML}</div>`;
            hasContent = true;
        }
    });

    if (!hasContent) {
        triggerAlert("Write something first.");
        return;
    }

    const printWin = window.open('', '_blank');
    printWin.document.write(`
        <html>
            <head>
                <title>A4_Document_Writer</title>
                <style>
                    @import url('https://fonts.maateen.me/solaiman-lipi/font.css');
                    @page { size: A4; margin: 0; }
                    
                    /* গুরুত্বপূর্ণ: কালার এবং আন্ডারলাইন নিশ্চিত করার জন্য */
                    * {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }

                    body { margin: 0; padding: 0; background: #fff; }
                    
                    .p-wrap {
                        width: 210mm; 
                        min-height: 297mm;
                        padding: 20mm; 
                        margin: 0 auto;
                        font-family: 'SolaimanLipi', Arial, sans-serif;
                        font-size: 18px; 
                        line-height: 1.6;
                        color: #000; 
                        box-sizing: border-box;
                        word-wrap: break-word; 
                        text-align: left;
                        page-break-after: always;
                    }

                    /* --- আন্ডারলাইন ফিক্স করার কোড --- */
                    u, [style*="underline"] {
                        text-decoration: underline !important;
                        text-decoration-skip-ink: none !important; /* যুক্তবর্ণের নিচে দাগ কাটবে না */
                        text-underline-offset: 3px !important;    /* দাগটি একটু নিচে নামিয়ে দিবে যাতে স্পষ্ট বোঝা যায় */
                        text-decoration-thickness: 1px !important; /* দাগের পুরুত্ব নিশ্চিত করবে */
                    }

                    .p-wrap:last-child { page-break-after: auto; }
                </style>
            </head>
            <body>
                ${allHtml}
                <script>
                    window.onload = function() {
                        setTimeout(function(){
                            window.print();
                            window.close();
                        }, 500);
                    };
                <\/script>
            </body>
        </html>
    `);
    printWin.document.close();
}
;

let enhancedImgData = null;

function openEnhancerModal() {
    document.getElementById('enhancerModal').style.display = 'flex';
    if (typeof setActiveMode === 'function') setActiveMode('mode-ai-enhancer');
    initEnhancerEvents();
}

function closeEnhancerModal() {
    document.getElementById('enhancerModal').style.display = 'none';
}

function initEnhancerEvents() {
    const input = document.getElementById('enhancer-input');
    input.onchange = function(e) {
        if (e.target.files[0]) processEnhance(e.target.files[0]);
    };

    const slider = document.getElementById('comparison-slider');
    const afterBox = document.getElementById('img-after-box');
    const sliderBtn = document.querySelector('.slider-button');
    const sliderBar = document.querySelector('.slider-bar');

    let isDragging = false;

    const startDragging = (e) => {
        isDragging = true;
        sliderBtn.style.cursor = 'grabbing';
        // সিলেকশন বন্ধ করার জন্য
        if (e.cancelable) e.preventDefault(); 
    };

    const stopDragging = () => {
        isDragging = false;
    };

    const moveSlider = (e) => {
        if (!isDragging) return; 

        // ড্র্যাগ করার সময় নীল সিলেকশন বা স্ক্রল হওয়া বন্ধ করবে
        if (e.cancelable) e.preventDefault();

        let rect = slider.getBoundingClientRect();
        let pageX = (e.touches) ? e.touches[0].pageX : e.pageX;
        let x = pageX - rect.left - window.pageXOffset;

        if (x < 0) x = 0;
        if (x > rect.width) x = rect.width;

        let percent = (x / rect.width) * 100;
        afterBox.style.clipPath = `polygon(0 0, ${percent}% 0, ${percent}% 100%, 0 100%)`;
        afterBox.style.webkitClipPath = `polygon(0 0, ${percent}% 0, ${percent}% 100%, 0 100%)`;
        sliderBtn.style.left = percent + "%";
        sliderBar.style.left = percent + "%";
    };

    // মাউস ইভেন্টস
    sliderBtn.addEventListener('mousedown', startDragging);
    window.addEventListener('mouseup', stopDragging);
    window.addEventListener('mousemove', moveSlider);

    // টাচ ইভেন্টস (মোবাইলের জন্য)
    sliderBtn.addEventListener('touchstart', startDragging, {passive: false});
    window.addEventListener('touchend', stopDragging);
    window.addEventListener('touchmove', moveSlider, {passive: false});
}

/* --- High-Compatibility AI Enhancer Logic --- */
async function processEnhance(file) {
    const uploadBox = document.getElementById('enhancer-upload-box');
    const loader = document.getElementById('enhancer-loader');
    const resultView = document.getElementById('enhancer-result-view');
    
    uploadBox.style.display = 'none';
    loader.style.display = 'flex';

    const reader = new FileReader();
    reader.onload = async (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
            document.getElementById('img-before').src = img.src;
            
            setTimeout(() => {
                let src, dst, final;
                try {
                    // ১. ইমেজ রিড করা
                    src = cv.imread(img);
                    
                    // ২. ইমেজ টাইপ চেক ও নর্মালাইজেশন (এরর এড়াতে এটি সবচেয়ে গুরুত্বপূর্ণ)
                    // যদি ছবিতে ট্রান্সপারেন্সি থাকে তবে তা সরিয়ে ৩-চ্যানেল RGB করা হচ্ছে
                    if (src.channels() === 4) {
                        cv.cvtColor(src, src, cv.COLOR_RGBA2RGB);
                    }
                    
                    dst = new cv.Mat();
                    
                    // 3. Pro Color Enhancement (CLAHE)
                    let lab = new cv.Mat();
                    cv.cvtColor(src, lab, cv.COLOR_RGB2Lab);
                    let labPlanes = new cv.MatVector();
                    cv.split(lab, labPlanes);
                    let clahe = new cv.CLAHE(2.0, new cv.Size(8, 8));
                    let lChannel = labPlanes.get(0);
                    clahe.apply(lChannel, lChannel);
                    cv.merge(labPlanes, lab);
                    cv.cvtColor(lab, dst, cv.COLOR_Lab2RGB);
                    
                    lab.delete(); labPlanes.delete(); clahe.delete(); lChannel.delete();

                    // 4. Pro Sharpening (Unsharp Mask)
                    let blur = new cv.Mat();
                    cv.GaussianBlur(dst, blur, new cv.Size(0, 0), 2.0); 
                    final = new cv.Mat();
                    cv.addWeighted(dst, 1.5, blur, -0.5, 0, final); 
                    blur.delete();

                    // ৬. আউটপুট ক্যানভাসে দেখানো
                    cv.imshow('temp-canvas', final);
                    const enhancedUrl = document.getElementById('temp-canvas').toDataURL('image/jpeg', 0.92);
                    
                    document.getElementById('img-after').src = enhancedUrl;
                    enhancedImgData = enhancedUrl;

                    loader.style.display = 'none';
                    resultView.style.display = 'flex';
                    
                    // মেমোরি ক্লিয়ার (Browser Hang হওয়া রোধ করবে)
                    src.delete(); dst.delete(); final.delete();

                } catch (err) {
                    console.error("OpenCV processing skipped to prevent crash.");
                    // যদি OpenCV সম্পূর্ণ ফেল করে, তবে অরিজিনাল ইমেজটিই আফটার বক্সে দেখাবে
                    document.getElementById('img-after').src = img.src;
                    enhancedImgData = img.src;
                    loader.style.display = 'none';
                    resultView.style.display = 'flex';
                    if(src) src.delete(); if(dst) dst.delete();
                }
            }, 300);
        };
    };
    reader.readAsDataURL(file);
}

function downloadEnhancedImage() {
    if (!enhancedImgData) return;
    const link = document.createElement('a');
    link.href = enhancedImgData;
    link.download = 'Enhanced_by_IDScannerPro.jpg';
    link.click();
    if (typeof triggerAlert === 'function') triggerAlert("Success: Photo saved successfully!");
}

function resetEnhancer() {
    document.getElementById('enhancer-upload-box').style.display = 'flex';
    document.getElementById('enhancer-result-view').style.display = 'none';
    document.getElementById('enhancer-input').value = "";
    document.getElementById('preview-img-container').style.display = 'none';
}
;

document.addEventListener('DOMContentLoaded', function() {
    const favContainer = document.getElementById('fav-container');
    const favSection = document.getElementById('fav-tools-section');
    const favSep = document.getElementById('fav-sep');

    // ১. টুল বাটনগুলোতে স্টারের আইকন যোগ করা (যদি বাটন থাকে)
    document.querySelectorAll('.mode-card-btn').forEach(btn => {
        const toolId = btn.id;
        if (!toolId) return;
        
        // ডুপ্লিকেট স্টার প্রতিরোধ করতে চেক
        if (btn.querySelector('.fav-star-btn')) return;

        const star = document.createElement('i');
        star.className = 'fa-solid fa-star fav-star-btn';
        star.setAttribute('title', 'Add to Favorites');
        star.onclick = function(e) {
            e.stopPropagation();
            toggleFavorite(toolId);
        };
        btn.style.position = 'relative';
        btn.appendChild(star);
    });

    // ২. ফেভারিট লিস্ট রেন্ডার করার ফাংশন
    function renderFavorites() {
        // ফিক্স: যদি favContainer না থাকে (যেমন ব্লগ পেজে), তবে এখানেই থেমে যাও
        if (!favContainer) return;

        const favs = JSON.parse(localStorage.getItem('site_favs')) || [];
        favContainer.innerHTML = '';
        
        document.querySelectorAll('.fav-star-btn').forEach(s => s.classList.remove('is-fav'));

        if (favs.length > 0) {
            if (favSection) favSection.style.display = 'flex';
            if (favSep) favSep.style.display = 'flex';
            
            favs.forEach(id => {
                const originalBtn = document.getElementById(id);
                if (originalBtn) {
                    const starInOriginal = originalBtn.querySelector('.fav-star-btn');
                    if (starInOriginal) starInOriginal.classList.add('is-fav');
                    
                    const clone = originalBtn.cloneNode(true);
                    clone.classList.remove('active');
                    clone.onclick = originalBtn.onclick;
                    
                    const cloneStar = clone.querySelector('.fav-star-btn');
                    if (cloneStar) {
                        cloneStar.onclick = (e) => {
                            e.stopPropagation();
                            toggleFavorite(id);
                        };
                    }
                    favContainer.appendChild(clone);
                }
            });
        } else {
            if (favSection) favSection.style.display = 'none';
            if (favSep) favSep.style.display = 'none';
        }
    }

    // ৩. ফেভারিট টগল করার ফাংশন
    window.toggleFavorite = function(id) {
        let favs = JSON.parse(localStorage.getItem('site_favs')) || [];
        if (favs.includes(id)) {
            favs = favs.filter(item => item !== id);
        } else {
            favs.push(id);
        }
        localStorage.setItem('site_favs', JSON.stringify(favs));
        renderFavorites();
    };

    // প্রথমবার লোড হওয়ার সময় রান করা
    renderFavorites();
});
;

function openStampModal() {
    var modal = document.getElementById('stampModal');
    if (modal) {
        modal.style.display = 'flex';
        if (typeof setActiveMode === 'function') setActiveMode('mode-stamp');
        const list = document.getElementById('stamp-pages-list');
        if (list.innerHTML.trim() === "") addNewStampPage();
    }
}

function closeStampModal() { document.getElementById('stampModal').style.display = 'none'; }

function execCmd(command, value = null) { document.execCommand(command, false, value); }

// সব পাতার মার্জিন একসাথে পরিবর্তন করার ফাংশন
function updateAllStampMargins(val) {
    const allPageBodies = document.querySelectorAll('.stamp-body');
    allPageBodies.forEach(body => {
        body.style.paddingTop = val + 'px';
    });
    document.getElementById('margin-val').innerText = (val/100).toFixed(1) + " Inch";
}

function addNewStampPage() {
    const list = document.getElementById('stamp-pages-list');
    const pageDiv = document.createElement('div');
    pageDiv.className = 'stamp-page-unit';
    
    // বর্তমান স্লাইডারের ভ্যালু নেওয়া
    const currentVal = document.getElementById('stamp-margin-slider').value;
    
    pageDiv.innerHTML = `
        <button class="del-page-icon" onclick="removeThisStampPage(this)" style="position:absolute; top:10px; right:10px; background:#ef4444; color:#fff; border:none; border-radius:50%; width:30px; height:30px; cursor:pointer; z-index:10;"><i class="fa-solid fa-xmark"></i></button>
        <div contenteditable="true" class="stamp-body" style="padding-top: ${currentVal}px" spellcheck="false"></div>
    `;
    list.appendChild(pageDiv);
    pageDiv.scrollIntoView({ behavior: 'smooth' });
}

function removeThisStampPage(btn) {
    const pages = document.querySelectorAll('.stamp-page-unit');
    if (pages.length > 1) {
        btn.parentElement.remove();
    } else {
        if (typeof triggerAlert === 'function') triggerAlert("At least one page is required.");
    }
}

function clearStampWriter() {
    document.getElementById('stamp-pages-list').innerHTML = "";
    addNewStampPage();
}

function printStampContent() {
    const pages = document.querySelectorAll('.stamp-page-unit');
    let allHtml = "";
    const currentMargin = document.getElementById('stamp-margin-slider').value;

    pages.forEach((page) => {
        const content = page.querySelector('.stamp-body').innerHTML;
        // সব পেজের জন্য একই মার্জিন ব্যবহার করা হয়েছে
        allHtml += `<div class="print-page" style="padding-top: ${currentMargin}px">${content}</div>`;
    });

    const printWin = window.open('', '_blank');
    printWin.document.write(`
        <html>
            <head>
                <title>Legal_Document_Print</title>
                <style>
                    @import url('https://fonts.maateen.me/solaiman-lipi/font.css');
                    @page { size: 216mm 345mm; margin: 0; }
                    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                    body { margin: 0; padding: 0; background: #fff; }
                    .print-page {
                        width: 215mm; height: 345mm;
                        padding: 20mm; margin: 0 auto;
                        font-family: 'SolaimanLipi', Arial, sans-serif;
                        font-size: 19px; line-height: 1.8;
                        color: #000; box-sizing: border-box;
                        word-wrap: break-word; text-align: justify;
                        page-break-after: always;
                        background: none !important;
                    }
                    u { text-decoration: underline !important; text-underline-offset: 4px; }
                    b, strong { font-weight: bold !important; }
                </style>
            </head>
            <body>
                ${allHtml}
                <script>
                    window.onload = function() {
                        setTimeout(() => { window.print(); window.close(); }, 500);
                    };
                <\/script>
            </body>
        </html>
    `);
    printWin.document.close();
}
;

function openSheetModal() {
    var modal = document.getElementById('sheetModal');
    if (modal) {
        modal.style.display = 'flex';
        if (typeof setActiveMode === 'function') setActiveMode('mode-sheet');
        setTimeout(initResizers, 100);
    }
}

function closeSheetModal() {
    document.getElementById('sheetModal').style.display = 'none';
}

function execCmd(command, value = null) {
    // জাস্টিফাই ফুল কমান্ডটি টেবিলের জন্য ফিক্সড করা হলো
    if (command === "justifyFull") {
        document.execCommand("justifyFull", false, value);
    } else {
        document.execCommand(command, false, value);
    }
    updateToolbarUI();
}

function autoSerialToggle() {
    const table = document.getElementById('editable-table');
    const rows = table.querySelectorAll('tr');
    const isHidden = rows[0].cells[0].classList.contains('hide-col');

    rows.forEach((row, index) => {
        const cell = row.cells[0];
        if (isHidden) {
            cell.classList.remove('hide-col');
            if (index > 0) cell.innerText = index;
        } else {
            cell.classList.add('hide-col');
        }
    });
}

function updateSheetLayout() {
    const size = document.getElementById('sheet-page-size').value;
    const page = document.getElementById('main-sheet-page');
    page.style.height = "auto"; 
    if (size === 'legal') {
        page.style.width = "216mm";
        page.style.minHeight = "345mm";
    } else {
        page.style.width = "210mm";
        page.style.minHeight = "297mm";
    }
}

function addRow() {
    const tableBody = document.getElementById('table-body');
    const rows = document.querySelectorAll('#editable-table tr');
    const colCount = rows[0].cells.length;
    const isSlHidden = rows[0].cells[0].classList.contains('hide-col');

    const newRow = document.createElement('tr');
    for (let i = 0; i < colCount; i++) {
        const cell = document.createElement('td');
        cell.contentEditable = "true";
        cell.style.fontFamily = "'SolaimanLipi', sans-serif";
        if (i === 0 && isSlHidden) cell.classList.add('hide-col');
        newRow.appendChild(cell);
    }
    tableBody.appendChild(newRow);
    
    if (!isSlHidden) {
        const allRows = document.querySelectorAll('#table-body tr');
        allRows.forEach((r, idx) => { r.cells[0].innerText = idx + 1; });
    }
}

function deleteRow() {
    const rows = document.querySelectorAll('#table-body tr');
    if (rows.length > 1) rows[rows.length - 1].remove();
}

function addColumn() {
    const table = document.getElementById('editable-table');
    const rows = table.querySelectorAll('tr');
    
    rows.forEach((row, index) => {
        const cell = document.createElement(index === 0 ? 'th' : 'td');
        cell.contentEditable = "true";
        cell.style.fontFamily = "'SolaimanLipi', sans-serif";
        
        // এটি নতুন যোগ করা হলো: নিশ্চিত করবে লেখা সবসময় সেন্টারে থাকবে
        cell.style.textAlign = "center"; 
        cell.style.verticalAlign = "middle";

        if (index === 0) {
            cell.innerHTML = "New"; // ডিফল্ট টেক্সট (ঐচ্ছিক)
        }
        
        row.appendChild(cell);
    });
    
    // নতুন কলামের জন্য রিসাইজার হ্যান্ডেল বসানো
    initResizers();
}

function deleteColumn() {
    const table = document.getElementById('editable-table');
    const rows = table.querySelectorAll('tr');
    if (rows[0].cells.length > 1) {
        rows.forEach(row => row.deleteCell(-1));
    }
}

function initResizers() {
    const table = document.getElementById('editable-table');
    const headerRow = table.querySelector('thead tr');
    if(!headerRow) return;
    const cols = headerRow.querySelectorAll('th');
    
    cols.forEach(col => {
        if (!col.querySelector('.resizer')) {
            const resizer = document.createElement('div');
            resizer.className = 'resizer';
            col.appendChild(resizer);
            
            let x = 0;
            let w = 0;
            const onMouseMove = (e) => {
                const dx = e.clientX - x;
                col.style.width = `${w + dx}px`;
            };
            const onMouseUp = () => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            };
            resizer.addEventListener('mousedown', (e) => {
                x = e.clientX;
                const styles = window.getComputedStyle(col);
                w = parseInt(styles.width, 10);
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            });
        }
    });
}

function resetTable() {
    document.querySelector('.sheet-header-box').innerHTML = "";
    document.querySelector('.sheet-sub-header-box').innerHTML = "";
    document.querySelector('.sheet-footer-box').innerHTML = "";
    
    const table = document.getElementById('editable-table');
    table.style.width = "100%"; 
    
    const tableHead = table.querySelector('thead');
    tableHead.innerHTML = `<tr><th class='sl-column' contenteditable='true' style='width: 50px;'>SL</th><th contenteditable='true'>Item Description</th><th contenteditable='true'>Qty</th><th contenteditable='true'>Price</th><th contenteditable='true'>Total</th></tr>`;
    
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = `<tr><td class='sl-column' contenteditable='true'>1</td><td contenteditable='true'></td><td contenteditable='true'></td><td contenteditable='true'></td><td contenteditable='true'></td></tr>`;
    
    document.querySelectorAll('.sl-column').forEach(cell => cell.classList.remove('hide-col'));
    document.getElementById('sheet-page-size').value = "a4";
    updateSheetLayout();
    
    setTimeout(initResizers, 100);
    const scrollArea = document.getElementById('sheet-scroll-area');
    if (scrollArea) scrollArea.scrollTop = 0;
}

// টুলবার UI সিঙ্ক লজিক - আপনার চাহিদা অনুযায়ী আপডেট করা হয়েছে
function updateToolbarUI() {
    // ১. ফন্ট সাইজ ডিটেকশন ও সিঙ্ক
    const fontSize = document.queryCommandValue("fontSize");
    const sizeSelector = document.getElementById('sheet-font-size');
    if (sizeSelector && fontSize) {
        sizeSelector.value = fontSize; 
    }

    // ২. টেক্সট কালার ডিটেকশন ও সিঙ্ক
    const foreColor = document.queryCommandValue("foreColor");
    const fontColorInput = document.getElementById('sheet-font-color');
    if (fontColorInput && foreColor) {
        fontColorInput.value = rgbToHex(foreColor);
    }

    // ৩. হাইলাইট কালার ডিটেকশন ও সিঙ্ক
    const bgColor = document.queryCommandValue("hiliteColor");
    const bgColorInput = document.getElementById('sheet-bg-color');
    if (bgColorInput && bgColor && bgColor !== "rgba(0, 0, 0, 0)" && bgColor !== "transparent") {
        bgColorInput.value = rgbToHex(bgColor);
    }
}

// RGB থেকে HEX রূপান্তর ফাংশন
function rgbToHex(rgb) {
    if (!rgb || rgb.indexOf("rgb") === -1) return rgb.startsWith('#') ? rgb : "#000000";
    const parts = rgb.match(/\d+/g);
    const r = parseInt(parts[0]).toString(16).padStart(2, '0');
    const g = parseInt(parts[1]).toString(16).padStart(2, '0');
    const b = parseInt(parts[2]).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
}

// সিলেকশন চেঞ্জ লিসেনার - এটিই আপনার ম্যাজিক লজিক
document.addEventListener('selectionchange', () => {
    const modal = document.getElementById('sheetModal');
    if (modal && modal.style.display === 'flex') {
        updateToolbarUI();
    }
});

/* --- ডাইনামিক ফাইলনাম সহ প্রিন্ট ফাংশন --- */
function printSheetContent() {
    const header = document.querySelector('.sheet-header-box').innerHTML;
    const subHeader = document.querySelector('.sheet-sub-header-box').innerHTML;
    const tableHtml = document.getElementById('editable-table').outerHTML;
    const footer = document.querySelector('.sheet-footer-box').innerHTML;
    
    const size = document.getElementById('sheet-page-size').value;
    const pageDim = (size === 'legal') ? '216mm 345mm' : 'A4';

    // --- ফাইলনাম কাউন্টার লজিক শুরু ---
    // ব্রাউজারে আগে কোনো নাম্বার সেভ আছে কি না চেক করা, না থাকলে ০ থেকে শুরু
    let currentNum = localStorage.getItem('table_sheet_count') || 0;
    currentNum = parseInt(currentNum) + 1; // নাম্বার ১ বাড়ানো
    localStorage.setItem('table_sheet_count', currentNum); // নতুন নাম্বার সেভ করা

    // আপনার চাহিদা অনুযায়ী ফাইল নাম তৈরি
    const customFileName = `Table-Sheet-www.seba.pro.bd-${currentNum}`;
    // --- ফাইলনাম কাউন্টার লজিক শেষ ---

    const printWin = window.open('', '_blank');
    printWin.document.write(`
        <html>
            <head>
                <!-- এখানে ফাইল নাম সেট করা হলো যা পিডিএফ সেভ করার সময় দেখাবে -->
                <title>${customFileName}</title>
                <style>
                    @import url('https://fonts.maateen.me/solaiman-lipi/font.css');
                    @page { size: ${pageDim}; margin: 15mm; }
                    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                    body { 
                        font-family: 'SolaimanLipi', Arial, sans-serif !important; 
                        background: #fff; margin: 0; padding: 0; text-align: justify;
                    }
                    .p-header { font-size: 24px; font-weight: bold; text-align: center; margin-bottom: 5px; font-family: 'SolaimanLipi' !important; }
                    .p-sub { font-size: 16px; margin-bottom: 20px; text-align: left; font-family: 'SolaimanLipi' !important; }
                    table { width: 100%; border-collapse: collapse; font-family: 'SolaimanLipi' !important; page-break-inside: auto; }
                    tr { page-break-inside: avoid; page-break-after: auto; }
                    thead { display: table-header-group; }
                    th, td { border: 1px solid #000; padding: 8px; text-align: center; font-size: 14px; word-wrap: break-word; }
                    th { background: #f1f5f9 !important; }
                    .p-footer { margin-top: 30px; font-size: 14px; font-family: 'SolaimanLipi' !important; }
                    .hide-col, .resizer { display: none !important; }
                    u { text-decoration: underline !important; text-underline-offset: 3px; }
                </style>
            </head>
            <body>
                <div class="p-header">${header}</div>
                <div class="p-sub">${subHeader}</div>
                ${tableHtml}
                <div class="p-footer">${footer}</div>
                <script>
                    window.onload = function() { 
                        setTimeout(() => { window.print(); window.close(); }, 500); 
                    };
                <\/script>
            </body>
        </html>
    `);
    printWin.document.close();
}
;

let phCurrentLang = "en";
let phCurrentCat = "All";

const promptData = [
    // --- HAIR (চুল) --- 11 Prompts
    { cat_en: "Hair", cat_bn: "চুল", title_en: "Fix Messy Hair", title_bn: "এলোমেলো চুল ঠিক করা", prompt: "Tidy up messy hair, fix flyaways, and make the hairstyle look neat and professional." },
    { cat_en: "Hair", cat_bn: "চুল", title_en: "Add Hair to Bald Head", title_bn: "টাক মাথায় চুল যুক্ত করা", prompt: "Add natural-looking dense hair to the bald head, matching the existing hair texture and color." },
    { cat_en: "Hair", cat_bn: "চুল", title_en: "Black Hair Color", title_bn: "চুলের রঙ কালো করা", prompt: "Change hair color to a natural black." },
    { cat_en: "Hair", cat_bn: "চুল", title_en: "Brown Hair Style", title_bn: "চুলের রঙ খয়েরি করা", prompt: "Change hair color to a professional warm chocolate brown." },
    { cat_en: "Hair", cat_bn: "চুল", title_en: "Remove Hair from Forehead", title_bn: "কপাল থেকে চুল সরানো", prompt: "Remove stray hairs from the forehead, creating a clean and neat hairline." },
    { cat_en: "Hair", cat_bn: "চুল", title_en: "Increase Hair Volume", title_bn: "চুল ঘন করা", prompt: "Add more volume and thickness to the hair naturally without changing the style." },
    { cat_en: "Hair", cat_bn: "চুল", title_en: "Comb Hair Side", title_bn: "চুল এক সাইডে আঁচড়ানো", prompt: "Redesign the hair to be neatly combed and partitioned to the side professionally." },
    { cat_en: "Hair", cat_bn: "চুল", title_en: "Straighten Hair", title_bn: "চুল স্ট্রেট করা", prompt: "Make the curly or wavy hair perfectly straight, smooth and silky." },
    { cat_en: "Hair", cat_bn: "চুল", title_en: "Fix Receding Hairline", title_bn: "সামনের চুল ভরাট করা", prompt: "Lower the hairline and fill in thin spots at the temples for a youthful look." },
    { cat_en: "Hair", cat_bn: "চুল", title_en: "Wet Hair Look", title_bn: "চুল ভেজা ভাব দেওয়া", prompt: "Give the hair a fresh, slightly wet and shiny gelled appearance." },
    { cat_en: "Hair", cat_bn: "চুল", title_en: "Add Buzz Cut", title_bn: "ছোট চুল বা বাজ কাট", prompt: "Change the hairstyle to a very short, clean and professional buzz cut." },

    // --- EYES (চোখ) --- 11 Prompts
    { cat_en: "Eyes", cat_bn: "চোখ", title_en: "Remove Glasses", title_bn: "চশমা সরানো", prompt: "Remove eyeglasses and digitally reconstruct the eyes and surrounding area naturally." },
    { cat_en: "Eyes", cat_bn: "চোখ", title_en: "Remove Red Eyes", title_bn: "চোখের লাল ভাব দূর করা", prompt: "Remove the red-eye effect completely from the photograph." },
    { cat_en: "Eyes", cat_bn: "চোখ", title_en: "Open Eyes Naturally", title_bn: "চোখ খোলা ও স্বাভাবিক করা", prompt: "Ensure both eyes are fully open, bright, and looking directly at the camera. Correct any lazy eye." },
    { cat_en: "Eyes", cat_bn: "চোখ", title_en: "Blue Eye Color", title_bn: "চোখের মণি নীল করা", prompt: "Change the iris color to a realistic deep blue." },
    { cat_en: "Eyes", cat_bn: "চোখ", title_en: "Add Thick Eyebrows", title_bn: "ভ্রু ঘন করা", prompt: "Make the eyebrows look thicker, darker, and more defined." },
    { cat_en: "Eyes", cat_bn: "চোখ", title_en: "Remove Dark Circles", title_bn: "চোখের নিচের কালো দাগ মোছা", prompt: "Smooth the skin under the eyes and remove any dark circles or puffiness." },
    { cat_en: "Eyes", cat_bn: "চোখ", title_en: "Add Eye Makeup", title_bn: "চোখে হালকা মেকআপ দেওয়া", prompt: "Apply subtle eyeliner and mascara to make the eyes look sharp and professional." },
    { cat_en: "Eyes", cat_bn: "চোখ", title_en: "Fix Squinting", title_bn: "চোখ বড় ও উজ্জ্বল করা", prompt: "Correct squinting eyes to look relaxed, wide open, and clearly focused." },
    { cat_en: "Eyes", cat_bn: "চোখ", title_en: "Sharpen Eye Detail", title_bn: "চোখের মণি উজ্জ্বল করা", prompt: "Enhance the details of the iris and catchlight in the eyes for a professional look." },
    { cat_en: "Eyes", cat_bn: "চোখ", title_en: "Remove Crow's Feet", title_bn: "চোখের ধারের বলিরেখা মোছা", prompt: "Remove fine lines and wrinkles around the corners of the eyes." },
    { cat_en: "Eyes", cat_bn: "চোখ", title_en: "Hazel Iris", title_bn: "চোখের মণি হেজেল করা", prompt: "Change eye color to a beautiful and natural hazel brown." },

    // --- BEARD (দাড়ি ও গোঁফ) --- 11 Prompts
    { cat_en: "Beard", cat_bn: "দাড়ি ও গোঁফ", title_en: "Clean Shave", title_bn: "মুখ ক্লিন শেভ করা", prompt: "Make the face completely clean-shaven, remove all facial hair smoothly." },
    { cat_en: "Beard", cat_bn: "দাড়ি ও গোঁফ", title_en: "Add Full Beard", title_bn: "দাড়ি বাড়িয়ে দেওয়া", prompt: "Add a full, thick, well-groomed professional beard to the chin and cheeks." },
    { cat_en: "Beard", cat_bn: "দাড়ি ও গোঁফ", title_en: "Reduce Beard", title_bn: "দাড়ি কমিয়ে দেওয়া", prompt: "Reduce the thick beard to a light, well-groomed stubble." },
    { cat_en: "Beard", cat_bn: "দাড়ি ও গোঁফ", title_en: "Shape Beard Line", title_bn: "দাড়ির লাইন ঠিক করা", prompt: "Trim the edges of the beard for a sharp, clean neck and cheek line." },
    { cat_en: "Beard", cat_bn: "দাড়ি ও গোঁফ", title_en: "Add French Cut", title_bn: "ফ্রেঞ্চ কাট দাড়ি দেওয়া", prompt: "Design a neat and symmetrical French cut beard style." },
    { cat_en: "Beard", cat_bn: "দাড়ি ও গোঁফ", title_en: "Thick Mustache", title_bn: "গোঁফ ঘন করা", prompt: "Make the mustache appear dense, dark, and perfectly styled." },
    { cat_en: "Beard", cat_bn: "দাড়ি ও গোঁফ", title_en: "Remove Mustache Only", title_bn: "শুধুমাত্র গোঁফ কাটা", prompt: "Remove the mustache while keeping the beard as it is." },
    { cat_en: "Beard", cat_bn: "দাড়ি ও গোঁফ", title_en: "Fix Patchy Beard", title_bn: "ফাঁকা দাড়ি ভরাট করা", prompt: "Fill in patchy or thin areas of the beard to make it look uniform and dense." },
    { cat_en: "Beard", cat_bn: "দাড়ি ও গোঁফ", title_en: "Grey to Black Beard", title_bn: "পাকা দাড়ি কালো করা", prompt: "Color all white or grey facial hair to a natural dark black." },
    { cat_en: "Beard", cat_bn: "দাড়ি ও গোঁফ", title_en: "Add Goatee Style", title_bn: "গোটি (Goatee) স্টাইল করা", prompt: "Add a stylish goatee beard while keeping the rest of the face clean." },
    { cat_en: "Beard", cat_bn: "দাড়ি ও গোঁফ", title_en: "Handlebar Mustache", title_bn: "রাজকীয় গোঁফ যুক্ত করা", prompt: "Add a thick handlebar mustache with curled ends for a classic look." },

    // --- TEETH & MOUTH (দাত ও মুখ) --- 10 Prompts
    { cat_en: "Teeth", cat_bn: "দাত", title_en: "Close Mouth", title_bn: "মুখটি বন্ধ ও দাত না দেখা", prompt: "Ensure the mouth is naturally closed, not showing any teeth." },
    { cat_en: "Teeth", cat_bn: "দাত", title_en: "Teeth Whitening", title_bn: "দাত সাদা করা", prompt: "Whiten the teeth naturally and remove any yellow stains." },
    { cat_en: "Teeth", cat_bn: "দাত", title_en: "Gentle Smile", title_bn: "দাত না দেখা ও হালকা হাসি", prompt: "Change the expression to a gentle, closed-mouth smile." },
    { cat_en: "Teeth", cat_bn: "দাত", title_en: "Straighten Teeth", title_bn: "আঁকাবাঁকা দাত সোজা করা", prompt: "Digitally align and straighten the teeth for a perfect smile." },
    { cat_en: "Teeth", cat_bn: "দাত", title_en: "Fix Missing Tooth", title_bn: "ফাঁকা দাত ভরাট করা", prompt: "Fill in gaps between teeth or add a missing tooth naturally." },
    { cat_en: "Teeth", cat_bn: "দাত", title_en: "Natural Expression", title_bn: "মুখ বন্ধ রেখে স্বাভাবিক ছবি", prompt: "Create a neutral facial expression with a closed mouth." },
    { cat_en: "Teeth", cat_bn: "দাত", title_en: "Add Dimples", title_bn: "গালে টোল যুক্ত করা", prompt: "Add subtle, natural-looking dimples to the cheeks when smiling." },
    { cat_en: "Teeth", cat_bn: "দাত", title_en: "Lip Color Correction", title_bn: "ঠোঁটের রঙ স্বাভাবিক করা", prompt: "Correct the lip color to a natural healthy pink or coral tone." },
    { cat_en: "Teeth", cat_bn: "দাত", title_en: "Reduce Lip Swelling", title_bn: "ঠোঁট পাতলা করা", prompt: "Subtly reduce the thickness of the lips for a more balanced facial look." },
    { cat_en: "Teeth", cat_bn: "দাত", title_en: "Fix Chapped Lips", title_bn: "ঠোঁট মসৃণ করা", prompt: "Smooth the texture of the lips to remove dryness and cracks." },

    // --- CLOTHES (পোশাক) --- 11 Prompts
    { cat_en: "Clothes", cat_bn: "পোশাক", title_en: "Clothing is new", title_bn: "পোশাক নতুন করা", prompt: "The clothes will be new and clean." },
    { cat_en: "Clothes", cat_bn: "পোশাক", title_en: "Professional Suit", title_bn: "প্রফেশনাল স্যুট", prompt: "Dress the person in a formal grey business suit." },
    { cat_en: "Clothes", cat_bn: "পোশাক", title_en: "Add Professional Tie", title_bn: "টাই যুক্ত করা", prompt: "Add a professional red silk tie, neatly tied under the collar." },
    { cat_en: "Clothes", cat_bn: "পোশাক", title_en: "Wear Business Suit", title_bn: "স্যুট বা কোট পরানো", prompt: "Dress the person in a professional dark navy blue business suit with a white shirt and a tie." },
    { cat_en: "Clothes", cat_bn: "পোশাক", title_en: "Change to White Shirt", title_bn: "শার্ট পরিয়ে দেওয়া", prompt: "Change the current attire to a formal white collared shirt, fully buttoned." },
    { cat_en: "Clothes", cat_bn: "পোশাক", title_en: "Add Black Blazer", title_bn: "কালো ব্লেজার পরানো", prompt: "Add a well-fitted formal black blazer over the existing shirt." },
    { cat_en: "Clothes", cat_bn: "পোশাক", title_en: "Formal Saree", title_bn: "শাড়ি পরিয়ে দেওয়া", prompt: "Dress the woman in a traditional formal silk saree with elegant drapes." },
    { cat_en: "Clothes", cat_bn: "পোশাক", title_en: "Doctor's Apron", title_bn: "ডাক্তারের অ্যাপ্রন পরানো", prompt: "Dress the person in a professional white doctor's lab coat with a stethoscope." },
    { cat_en: "Clothes", cat_bn: "পোশাক", title_en: "Remove Wrinkles", title_bn: "পোশাকের ভাঁজ কমানো", prompt: "Smooth out all wrinkles and creases from the current clothing for a crisp look." },
    { cat_en: "Clothes", cat_bn: "পোশাক", title_en: "Change Clothes Color", title_bn: "পোশাকের রঙ পরিবর্তন", prompt: "Change the color of the current clothing to a solid formal sky blue." },
    { cat_en: "Clothes", cat_bn: "পোশাক", title_en: "Add Uniform", title_bn: "ইউনিফর্ম পরানো", prompt: "Change the attire to a professional security or pilot uniform with badges." },
    { cat_en: "Clothes", cat_bn: "পোশাক", title_en: "Formal Punjabi", title_bn: "পাঞ্জাবি পরিয়ে দেওয়া", prompt: "Dress the man in an elegant, well-fitted white formal Punjabi." },
    { cat_en: "Clothes", cat_bn: "পোশাক", title_en: "Add Leather Jacket", title_bn: "লেদার জ্যাকেট পরানো", prompt: "Change the current top to a stylish black leather biker jacket." },

    // --- BACKGROUND (ব্যাকগ্রাউন্ড) --- 11 Prompts
    { cat_en: "Background", cat_bn: "ব্যাকগ্রাউন্ড", title_en: "Solid White BG", title_bn: "সাদা ব্যাকগ্রাউন্ড", prompt: "Change background to solid white, clean and professional." },
    { cat_en: "Background", cat_bn: "ব্যাকগ্রাউন্ড", title_en: "Solid Neon Blue BG", title_bn: "নীল ব্যাকগ্রাউন্ড", prompt: "Change background to solid bright Neon Blue." },
    { cat_en: "Background", cat_bn: "ব্যাকগ্রাউন্ড", title_en: "Light Blue BG", title_bn: "হালকা নিল ব্যাকগ্রাউন্ড", prompt: "Change background to a professional light sky blue." },
    { cat_en: "Background", cat_bn: "ব্যাকগ্রাউন্ড", title_en: "Studio Bokeh BG", title_bn: "স্টুডিও ব্লার ব্যাকগ্রাউন্ড", prompt: "Change background to a blurry professional photo studio with bokeh lights." },
    { cat_en: "Background", cat_bn: "ব্যাকগ্রাউন্ড", title_en: "Office Interior", title_bn: "অফিস ব্যাকগ্রাউন্ড", prompt: "Place the subject in a professional blurred corporate office background." },
    { cat_en: "Background", cat_bn: "ব্যাকগ্রাউন্ড", title_en: "Remove People", title_bn: "পিছনের মানুষ সরানো", prompt: "Remove all unnecessary objects and people from the background." },
    { cat_en: "Background", cat_bn: "ব্যাকগ্রাউন্ড", title_en: "Solid Grey BG", title_bn: "ধূসর ব্যাকগ্রাউন্ড", prompt: "Set a neutral and professional solid grey background." },
    { cat_en: "Background", cat_bn: "ব্যাকগ্রাউন্ড", title_en: "Nature Park BG", title_bn: "প্রাকৃতিক ব্যাকগ্রাউন্ড", prompt: "Change the background to a beautiful blurred outdoor park or garden." },
    { cat_en: "Background", cat_bn: "ব্যাকগ্রাউন্ড", title_en: "Graduation Stage", title_bn: "সমাবর্তন ব্যাকগ্রাউন্ড", prompt: "Change the background to a graduation ceremony stage." },
    { cat_en: "Background", cat_bn: "ব্যাকগ্রাউন্ড", title_en: "Transparent BG", title_bn: "স্বচ্ছ বা PNG ব্যাকগ্রাউন্ড", prompt: "Remove background completely and make it transparent PNG." },
    { cat_en: "Background", cat_bn: "ব্যাকগ্রাউন্ড", title_en: "Library Background", title_bn: "লাইব্রেরি ব্যাকগ্রাউন্ড", prompt: "Place the subject in front of a blurred bookshelf-filled library background." },

    // --- HEAD & POSTURE (মাথা ও অবস্থান) --- 10 Prompts
    { cat_en: "Head", cat_bn: "মাথা", title_en: "Straighten Head & Ears", title_bn: "মাথা সোজা ও কান দেখা", prompt: "Straighten the head posture, ensuring both ears are equally visible and symmetrical. Align the head perfectly." },
    { cat_en: "Head", cat_bn: "মাথা", title_en: "Fix Upward Gaze", title_bn: "উপরের দিকে তাকানো ঠিক করা", prompt: "Adjust the head to face directly forward, lowering it from an upward gaze. Subject should look straight into the camera." },
    { cat_en: "Head", cat_bn: "মাথা", title_en: "Fix Downward Gaze", title_bn: "নিচের দিকে তাকানো ঠিক করা", prompt: "Adjust the head to face directly forward, raising it from a downward gaze. Maintain neutral neck position." },
    { cat_en: "Head", cat_bn: "মাথা", title_en: "Tilt Correction", title_bn: "মাথার কাত হওয়া ঠিক করা", prompt: "Correct the slight head tilt to the left or right, ensuring a perfectly vertical head alignment." },
    { cat_en: "Head", cat_bn: "মাথা", title_en: "Symmetrical Shoulders", title_bn: "কাঁধ সমান করা", prompt: "Adjust the posture so that the shoulders are level and symmetrical in the frame." },
    { cat_en: "Head", cat_bn: "মাথা", title_en: "Center Alignment", title_bn: "ছবি মাঝখানে আনা", prompt: "Center the subject perfectly within the frame, ensuring equal margins on left and right." },
    { cat_en: "Head", cat_bn: "মাথা", title_en: "Chin Leveling", title_bn: "চিবুক সোজা করা", prompt: "Adjust the chin height to a neutral position, neither too high nor tucked too low." },
    { cat_en: "Head", cat_bn: "মাথা", title_en: "Fix Looking Away", title_bn: "ক্যামেরার দিকে তাকানো", prompt: "Digitally adjust the eyes and head to look directly into the camera lens." },
    { cat_en: "Head", cat_bn: "মাথা", title_en: "Remove Hairband", title_bn: "হেয়ারব্যান্ড সরানো", prompt: "Remove any visible hairbands or clips and replace them with natural-looking hair." },
    { cat_en: "Head", cat_bn: "মাথা", title_en: "Natural Symmetries", title_bn: "চেহারার ভারসাম্য ঠিক করা", prompt: "Ensure facial features are balanced and symmetrical without looking artificial." },

    // --- FACE & SKIN (মুখ ও ত্বক) --- 11 Prompts
    { cat_en: "Face", cat_bn: "মুখ", title_en: "Remove Acne & Blemishes", title_bn: "ব্রণ বা দাগ মোছা", prompt: "Retouch skin to be smooth and clear, removing all blemishes, acne, and spots. Maintain natural skin texture." },
    { cat_en: "Face", cat_bn: "মুখ", title_en: "Remove Face Oil", title_bn: "মুখের তৈলাক্ত ভাব কমানো", prompt: "Remove oily shine from the face, create a natural matte skin finish." },
    { cat_en: "Face", cat_bn: "মুখ", title_en: "Skin Whitening", title_bn: "ত্বকের রঙ ফর্সা করা", prompt: "Enhance and brighten the skin tone naturally for a glowing and fair appearance." },
    { cat_en: "Face", cat_bn: "মুখ", title_en: "Remove Double Chin", title_bn: "ডাবল চিন কমানো", prompt: "Digitally reduce the double chin and sharpen the jawline naturally." },
    { cat_en: "Face", cat_bn: "মুখ", title_en: "Sharpen Jawline", title_bn: "চোয়ালের গঠন শার্প করা", prompt: "Give the face a more defined and sharp masculine jawline." },
    { cat_en: "Face", cat_bn: "মুখ", title_en: "Slim Face", title_bn: "মুখ চিকন বা স্লিম করা", prompt: "Subtly slim down the cheeks for a more contoured and attractive face look." },
    { cat_en: "Face", cat_bn: "মুখ", title_en: "Add Gentle Smile", title_bn: "হাসি যুক্ত করা", prompt: "Add a natural and warm gentle smile to the current facial expression." },
    { cat_en: "Face", cat_bn: "মুখ", title_en: "Remove Forehead Lines", title_bn: "কপালে ভাঁজ মোছা", prompt: "Smooth out deep forehead wrinkles and expression lines for a fresher look." },
    { cat_en: "Face", cat_bn: "মুখ", title_en: "Soft Skin Texture", title_bn: "ত্বক মসৃণ করা", prompt: "Apply a gentle skin softening effect while preserving the high-end photographic details." },
    { cat_en: "Face", cat_bn: "মুখ", title_en: "Remove Freckles", title_bn: "মেছতা বা তিল সরানো", prompt: "Remove freckles and pigmentation spots from the face naturally." },
    { cat_en: "Face", cat_bn: "মুখ", title_en: "Glowing Skin", title_bn: "ত্বক উজ্জ্বল করা", prompt: "Add a healthy radiance and natural glow to the overall skin tone." },

    // --- RESTORE & COLOR (রিস্টোর) --- 10 Prompts
    { cat_en: "Restore", cat_bn: "রিস্টোর এন্ড কালার", title_en: "Colorize B&W Photo", title_bn: "সাদকালো থেকে রঙিন ছবি", prompt: "Restore this old photograph into a high-resolution colour portrait with accurate skin tones and studio lighting." },
    { cat_en: "Restore", cat_bn: "রিস্টোর এন্ড কালার", title_en: "Fix Blurry Image", title_bn: "ঝাপসা ছবি ক্লিয়ার করা", prompt: "Sharpen the blurry features and enhance clarity using AI upscaling to achieve high-definition quality." },
    { cat_en: "Restore", cat_bn: "রিস্টোর এন্ড কালার", title_en: "Remove Scratches", title_bn: "ছেঁড়া বা ফাটা ছবি ঠিক করা", prompt: "Digitally repair scratches, cracks, and missing parts of the old photo naturally." },
    { cat_en: "Restore", cat_bn: "রিস্টোর এন্ড কালার", title_en: "Denoise Image", title_bn: "ছবির নয়েজ বা দানা কমানো", prompt: "Remove grainy noise and digital artifacts from the low-quality photo while keeping details sharp." },
    { cat_en: "Restore", cat_bn: "রিস্টোর এন্ড কালার", title_en: "Increase Resolution", title_bn: "রেজোলিউশন বাড়ানো", prompt: "Upscale this low-resolution photo to 4K quality with realistic facial reconstructions." },
    { cat_en: "Restore", cat_bn: "রিস্টোর এন্ড কালার", title_en: "Vivid Color Enhance", title_bn: "কালার উজ্জ্বল করা", prompt: "Enhance the saturation and contrast of the photo to make it look vibrant and professionally edited." },
    { cat_en: "Restore", cat_bn: "রিস্টোর এন্ড কালার", title_en: "Remove Yellow Tint", title_bn: "হলুদ ভাব দূর করা", prompt: "Correct the white balance and remove the aged yellow tint from old photographs." },
    { cat_en: "Restore", cat_bn: "রিস্টোর এন্ড কালার", title_en: "Facial Details Boost", title_bn: "মুখের ডিটেইল বাড়ানো", prompt: "Rebuild the eyes, lips, and skin texture details in low-quality portraits using advanced AI." },
    { cat_en: "Restore", cat_bn: "রিস্টোর এন্ড কালার", title_en: "Vintage to Modern", title_bn: "পুরানো ছবি নতুনের মতো করা", prompt: "Modernize this vintage photograph into a clean mirrorless camera-grade portrait." },
    { cat_en: "Restore", cat_bn: "রিস্টোর এন্ড কালার", title_en: "Fix Water Damage", title_bn: "পানির দাগ মোছা", prompt: "Digitally remove water damage stains and mold spots from physical old scans." },

    // --- HIJAB (হিজাব) --- 10 Prompts
    { cat_en: "Hijab", cat_bn: "হিজাব", title_en: "Add Black Hijab", title_bn: "হিজাব পরিয়ে দেওয়া", prompt: "Add a professional and elegant solid black hijab, wrapped neatly around the head and neck." },
    { cat_en: "Hijab", cat_bn: "হিজাব", title_en: "Change Hijab Color", title_bn: "হিজাবের রঙ পরিবর্তন", prompt: "Change the color of the current hijab to white or neutral beige." },
    { cat_en: "Hijab", cat_bn: "হিজাব", title_en: "Tidy up Hijab", title_bn: "হিজাব পরিপাটি করা", prompt: "Make the hijab look smooth and perfectly draped, removing any wrinkles or folds." },
    { cat_en: "Hijab", cat_bn: "হিজাব", title_en: "Add Silk Hijab", title_bn: "সিল্ক হিজাব স্টাইল", prompt: "Change the hijab texture to premium shiny silk with modern elegant styling." },
    { cat_en: "Hijab", cat_bn: "হিজাব", title_en: "Fix Loose Hijab", title_bn: "হিজাব টাইট ও সেট করা", prompt: "Adjust the loose hijab to be perfectly set around the face and jawline." },
    { cat_en: "Hijab", cat_bn: "হিজাব", title_en: "Floral Hijab Style", title_bn: "ফুলের ডিজাইনের হিজাব", prompt: "Change the existing hijab to a beautiful floral printed design." },
    { cat_en: "Hijab", cat_bn: "হিজাব", title_en: "Add Undercap", title_bn: "হিজাবের নিচে ক্যাপ দেওয়া", prompt: "Add a matching undercap visible at the forehead for a more complete hijab look." },
    { cat_en: "Hijab", cat_bn: "হিজাব", title_en: "Match Hijab to Outfit", title_bn: "পোশাকের সাথে হিজাব ম্যাচ করা", prompt: "Change the hijab color and pattern to perfectly match the subject's existing attire." },
    { cat_en: "Hijab", cat_bn: "হিজাব", title_en: "Layered Hijab", title_bn: "লেয়ার্ড হিজাব স্টাইল", prompt: "Redesign the hijab into a sophisticated multi-layered wrap style." },
    { cat_en: "Hijab", cat_bn: "হিজাব", title_en: "Remove Hijab Pins", title_bn: "হিজাবের পিন সরানো", prompt: "Cleanly remove visible pins from the hijab for a more seamless and clean appearance." }
];

function openPromptHub() {
    document.getElementById('promptHubModal').style.display = 'flex';
    if(typeof setActiveMode === 'function') setActiveMode('mode-prompt-hub');
    renderPhCategories();
    renderPrompts();
}

function closePromptHub() { document.getElementById('promptHubModal').style.display = 'none'; }

function switchPhLang(lang) {
    phCurrentLang = lang;
    document.getElementById('ph-btn-en').classList.toggle('active', lang === 'en');
    document.getElementById('ph-btn-bn').classList.toggle('active', lang === 'bn');
    
    // ১. সাবটাইটেল পরিবর্তন
    document.getElementById('ph-subtitle').innerText = lang === 'en' ? "Get professional AI prompts for high-end image editing" : "হাই-এন্ড ইমেজ এডিটিং এর জন্য প্রফেশনাল এআই প্রম্পট কপি করুন";
    
    // ২. সার্চ প্লেসহোল্ডার পরিবর্তন
    document.getElementById('ph-search-input').placeholder = lang === 'en' ? "Search prompt..." : "প্রম্পট সার্চ করুন...";

    // ৩. নিচের টিপস মেসেজ পরিবর্তন (আপনার কাঙ্ক্ষিত অংশ)
    const footerTip = document.getElementById('ph-footer-tip');
    if (lang === 'en') {
        footerTip.innerHTML = `<i class='fa-solid fa-lightbulb'></i> <b>Tip:</b> Copy the prompt and paste it into Google AI Studio or Google Gemini.`;
    } else {
        footerTip.innerHTML = `<i class='fa-solid fa-lightbulb'></i> <b>টিপস:</b> প্রম্পট কপি করে Google AI Studio অথবা Google Gemini -তে পেস্ট করুন।`;
    }
    
    renderPhCategories();
    renderPrompts();
}

function renderPhCategories() {
    const tabsList = document.getElementById('ph-tabs-list');
    const categories = ["All", ...new Set(promptData.map(item => item.cat_en))];
    
    tabsList.innerHTML = categories.map(cat => {
        const catName = (cat === "All") ? (phCurrentLang === "en" ? "All" : "সবগুলো") : (phCurrentLang === "en" ? cat : promptData.find(i => i.cat_en === cat).cat_bn);
        return `<button class="cat-btn ${phCurrentCat === cat ? 'active' : ''}" onclick="setPhCategory('${cat}')">${catName}</button>`;
    }).join('');
}

function setPhCategory(cat) {
    phCurrentCat = cat;
    renderPhCategories();
    renderPrompts();
}

function renderPrompts() {
    const grid = document.getElementById('ph-grid');
    const searchVal = document.getElementById('ph-search-input').value.toLowerCase();
    
    const filtered = promptData.filter(item => {
        const matchesCat = (phCurrentCat === "All" || item.cat_en === phCurrentCat);
        const matchesSearch = item.title_en.toLowerCase().includes(searchVal) || item.title_bn.toLowerCase().includes(searchVal);
        return matchesCat && matchesSearch;
    });

    grid.innerHTML = filtered.map(item => `
        <div class="prompt-card">
            <h4>${phCurrentLang === 'en' ? item.title_en : item.title_bn}</h4>
            <div class="prompt-box">${item.prompt}</div>
            <button class="btn-copy-ph" onclick="copyPhText(this, '${item.prompt.replace(/'/g, "\\'")}')">
                <i class="fa-solid fa-copy"></i> <span>${phCurrentLang === 'en' ? 'Copy Prompt' : 'প্রম্পট কপি করুন'}</span>
            </button>
        </div>
    `).join('');
}

function searchPrompts() { renderPrompts(); }

// বাটন টেক্সট চেঞ্জিং কপি ফাংশন
function copyPhText(btn, text) {
    navigator.clipboard.writeText(text).then(() => {
        const originalContent = btn.innerHTML;
        const copiedText = phCurrentLang === 'en' ? 'Copied!' : 'কপি হয়েছে!';
        
        btn.innerHTML = `<i class="fa-solid fa-check"></i> <span>${copiedText}</span>`;
        btn.classList.add('copied');
        
        setTimeout(() => {
            btn.innerHTML = originalContent;
            btn.classList.remove('copied');
        }, 2000);
    });
}
;

let memoLang = "en";

function openMemoModal() {
    var modal = document.getElementById('memoModal');
    if (modal) {
        modal.style.display = 'flex';
        if (typeof setActiveMode === 'function') setActiveMode('mode-memo');
        loadMemoSettings();
        updateMemoDate();
    }
}

function getTodayDate() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    return `${day}/${month}/${year}`;
}

function updateMemoDate() {
    const dateLabel = document.getElementById('txt-date');
    if (dateLabel && dateLabel.nextSibling) {
        const today = getTodayDate();
        dateLabel.nextSibling.textContent = " " + convertDigits(today, memoLang);
    }
}

function closeMemoModal() { document.getElementById('memoModal').style.display = 'none'; }

const memoTranslations = {
    en: { title: "Cash Memo Pro", save: "Save Info", add: "Add Item", receipt: "Receipt No:", date: "Date:", sl: "SL", desc: "Description", qty: "Qty", rate: "Rate", total: "Total", grand: "Grand Total:", words: "In Words:", sigC: "Customer Signature", sigA: "Authorized Signature", name: "Name:", addr: "Address:", mob1: "Mobile:", termsP: "Terms & Conditions (Optional)" },
    bn: { title: "ক্যাশ মেমো প্রো", save: "তথ্য সেভ করুন", add: "আইটেম যোগ", receipt: "রশিদ নং:", date: "তারিখ:", sl: "ক্রমিঃ", desc: "বিবরণ", qty: "পরিমাণ", rate: "দর", total: "মোট", grand: "সর্বমোট:", words: "কথায়:", sigC: "ক্রেতার স্বাক্ষর", sigA: "বিক্রেতার স্বাক্ষর", name: "নাম:", addr: "ঠিকানা:", mob1: "মোবাইল:", termsP: "শর্তাবলী (ঐচ্ছিক)" }
};

function convertDigits(text, toLang) {
    if (!text) return "";
    const enDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    let res = text.toString();
    if (toLang === 'bn') {
        enDigits.forEach((en, i) => { res = res.split(en).join(bnDigits[i]); });
    } else {
        bnDigits.forEach((bn, i) => { res = res.split(bn).join(enDigits[i]); });
    }
    return res;
}

function handleTableInput(el) {
    if (memoLang === 'bn') {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        const offset = range.startOffset;
        const original = el.innerText;
        const converted = convertDigits(original, 'bn');
        if (original !== converted) {
            el.innerText = converted;
            const newRange = document.createRange();
            const textNode = el.childNodes[0];
            if (textNode) {
                newRange.setStart(textNode, Math.min(offset, textNode.length));
                newRange.collapse(true);
                selection.removeAllRanges();
                selection.addRange(newRange);
            }
        }
    }
    calculateMemoTotal();
}

function switchMemoLang(lang) {
    memoLang = lang;
    const t = memoTranslations[lang];
    document.getElementById('memo-en-btn').classList.toggle('active', lang === 'en');
    document.getElementById('memo-bn-btn').classList.toggle('active', lang === 'bn');
    document.getElementById('memo-tool-title').innerText = t.title;
    document.getElementById('txt-save-settings').innerText = t.save;
    document.getElementById('txt-add-item').innerText = t.add;
    document.getElementById('lbl-name').innerText = t.name;
    document.getElementById('lbl-addr').innerText = t.addr;
    document.getElementById('lbl-mob1').innerText = t.mob1;

    const rLabel = document.getElementById('txt-receipt');
    const dLabel = document.getElementById('txt-date');
    if(rLabel.nextSibling) rLabel.nextSibling.textContent = " " + convertDigits(rLabel.nextSibling.textContent.trim(), lang);
    if(dLabel.nextSibling) dLabel.nextSibling.textContent = " " + convertDigits(dLabel.nextSibling.textContent.trim(), lang);
    rLabel.innerText = t.receipt;
    dLabel.innerText = t.date;

    document.getElementById('txt-sl').innerText = t.sl;
    document.getElementById('txt-desc').innerText = t.desc;
    document.getElementById('txt-qty').innerText = t.qty;
    document.getElementById('txt-rate').innerText = t.rate;
    document.getElementById('txt-total').innerText = t.total;
    document.getElementById('txt-grand').innerText = t.grand;
    document.getElementById('txt-words-label').innerText = t.words;
    document.getElementById('txt-sig-cust').innerText = t.sigC;
    document.getElementById('txt-sig-auth').innerText = t.sigA;
    document.getElementById('txt-terms-placeholder').setAttribute('data-placeholder', t.termsP);

    document.querySelectorAll('#memo-body tr').forEach((row, i) => {
        row.cells[0].innerText = convertDigits(i + 1, lang);
        row.cells[2].innerText = convertDigits(row.cells[2].innerText, lang);
        row.cells[3].innerText = convertDigits(row.cells[3].innerText, lang);
    });
    calculateMemoTotal();
}

function calculateMemoTotal() {
    const rows = document.querySelectorAll('#memo-body tr');
    let grandTotal = 0;
    rows.forEach(row => {
        const qty = parseFloat(convertDigits(row.cells[2].innerText, 'en')) || 0;
        const rate = parseFloat(convertDigits(row.cells[3].innerText, 'en')) || 0;
        const total = qty * rate;
        row.cells[4].innerText = convertDigits(total.toFixed(2), memoLang);
        grandTotal += total;
    });
    document.getElementById('memo-grand-total').innerText = convertDigits(grandTotal.toFixed(2), memoLang);
    document.getElementById('memo-words-display').innerText = numberToWords(grandTotal, memoLang);
}

function numberToWords(amount, lang) {
    const mainAmount = Math.floor(amount);
    const paisaAmount = Math.round((amount - mainAmount) * 100);
    if (amount == 0) return lang === 'en' ? "Zero Taka only." : "শূণ্য টাকা মাত্র।";
    function toEnWords(n) {
        const a = ["", "One ", "Two ", "Three ", "Four ", "Five ", "Six ", "Seven ", "Eight ", "Nine ", "Ten ", "Eleven ", "Twelve ", "Thirteen ", "Fourteen ", "Fifteen ", "Sixteen ", "Seventeen ", "Eighteen ", "Nineteen "];
        const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
        if (n < 20) return a[n];
        if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + a[n % 10] : "");
        if (n < 1000) return toEnWords(Math.floor(n / 100)) + "Hundred " + (n % 100 !== 0 ? "and " + toEnWords(n % 100) : "");
        if (n < 100000) return toEnWords(Math.floor(n / 1000)) + "Thousand " + (n % 1000 !== 0 ? toEnWords(n % 1000) : "");
        if (n < 10000000) return toEnWords(Math.floor(n / 100000)) + "Lakh " + (n % 100000 !== 0 ? toEnWords(n % 100000) : "");
        return "Large Amount";
    }
    const bnNums = ["শূণ্য", "এক", "দুই", "তিন", "চার", "পাঁচ", "ছয়", "সাত", "আট", "নয়", "দশ", "এগারো", "বারো", "তেরো", "চৌদ্দ", "পনেরো", "ষোলো", "সতেরো", "আঠারো", "উনিশ", "বিশ", "একুশ", "বাইশ", "তেইশ", "চব্বিশ", "পঁচিশ", "ছাব্বিশ", "সাতাশ", "আটাশ", "ঊনত্রিশ", "ত্রিশ", "একত্রিশ", "বত্রিশ", "তেত্রিশ", "চৌত্রিশ", "পঁয়ত্রিশ", "ছত্রিশ", "সাঁইত্রিশ", "আটত্রিশ", "ঊনচল্লিশ", "চল্লিশ", "একচল্লিশ", "বিয়াল্লিশ", "তেতাল্লিশ", "চুয়াল্লিশ", "পঁয়তাল্লিশ", "ছেচল্লিশ", "সাতচল্লিশ", "আটচল্লিশ", "ঊনপঞ্চাশ", "পঞ্চাশ", "একান্ন", "বাহান্ন", "তিপ্পান্ন", "চুয়াল্লিশ", "পঞ্চান্ন", "ছাপ্পান্ন", "সাতান্ন", "আটান্ন", "ঊনষাট", "ষাট", "একষট্টি", "বাষট্টি", "তেষট্টি", "চৌষট্টি", "পঁয়ষট্টি", "ছেষট্টি", "সাতষট্টি", "আটষট্টি", "ঊনসত্তর", "সত্তর", "একাত্তর", "বাহাত্তর", "তেয়াত্তর", "চুয়াত্তর", "পঁচাত্তর", "ছেয়াত্তর", "সাতাত্তর", "আটাত্তর", "ঊনআশি", "আশি", "একাশি", "বিরাশি", "তিরাশি", "চুরাশি", "পঁচাশী", "ছেয়াশি", "সাতাশি", "আটাশি", "ঊননব্বই", "নব্বই", "একানব্বই", "বিরানব্বই", "তিরানব্বই", "চুরানব্বই", "পঁচানব্বই", "ছেয়ানব্বই", "সাতানব্বই", "আটানব্বই", "নিরানব্বই"];
    function toBnWords(n) {
        if (n == 0) return "";
        if (n < 100) return bnNums[n] + " ";
        if (n < 1000) return bnNums[Math.floor(n / 100)] + "শত " + toBnWords(n % 100);
        if (n < 100000) return toBnWords(Math.floor(n / 1000)) + "হাজার " + toBnWords(n % 1000);
        if (n < 10000000) return toBnWords(Math.floor(n / 100000)) + "লক্ষ " + toBnWords(n % 100000);
        return toBnWords(Math.floor(n / 10000000)) + "কোটি " + toBnWords(n % 10000000);
    }
    let res = "";
    if (lang === 'en') {
        res = toEnWords(mainAmount) + "Taka ";
        if (paisaAmount > 0) res += "and " + toEnWords(paisaAmount) + " Paisa ";
        res += "Only.";
    } else {
        res = toBnWords(mainAmount) + "টাকা ";
        if (paisaAmount > 0) res += convertDigits(paisaAmount, 'bn') + " পয়সা ";
        res += "মাত্র।";
    }
    return res;
}

function saveMemoSettings() {
    const shopData = {
        name: document.getElementById('set-shop-name').innerHTML,
        addr: document.getElementById('set-shop-addr').innerHTML,
        mob: document.getElementById('set-shop-mob').innerHTML,
        email: document.getElementById('set-shop-email').innerHTML,
        logo: document.getElementById('memo-img').src,
        // নতুন যুক্ত করা হলো শর্তাবলী সেভ করার জন্য
        terms: document.getElementById('txt-terms-placeholder').innerHTML 
    };
    
    // ব্রাউজারে ডাটা সেভ করা হচ্ছে
    localStorage.setItem('memo_shop_data_v3', JSON.stringify(shopData));
    
    if(typeof triggerAlert === 'function') {
        triggerAlert("Shop Info & Terms saved successfully!");
    } else {
        alert("Shop Info & Terms saved successfully!");
    }
}

function loadMemoSettings() {
    const data = JSON.parse(localStorage.getItem('memo_shop_data_v3'));
    if (data) {
        // দোকানের নাম, ঠিকানা, মোবাইল ও ইমেইল লোড
        if(data.name) document.getElementById('set-shop-name').innerHTML = data.name;
        if(data.addr) document.getElementById('set-shop-addr').innerHTML = data.addr;
        if(data.mob) document.getElementById('set-shop-mob').innerHTML = data.mob;
        if(data.email) document.getElementById('set-shop-email').innerHTML = data.email;
        
        // শর্তাবলী (Terms & Conditions) লোড
        if(data.terms) document.getElementById('txt-terms-placeholder').innerHTML = data.terms;
        
        // লোগো লোড
        if(data.logo && data.logo.startsWith('data:image')) {
            document.getElementById('memo-img').src = data.logo;
            document.getElementById('memo-img').style.display = 'flex';
            document.getElementById('txt-logo-hint').style.display = 'none';
        }
    }
}

function addMemoRow() {
    const body = document.getElementById('memo-body');
    const row = document.createElement('tr');
    const sl = body.rows.length + 1;
    row.innerHTML = `<td>${convertDigits(sl, memoLang)}</td><td contenteditable='true' style='text-align:left'></td><td contenteditable='true' oninput='handleTableInput(this)'>${convertDigits(1, memoLang)}</td><td contenteditable='true' oninput='handleTableInput(this)'>${convertDigits(0, memoLang)}</td><td class='row-total'>${convertDigits("0.00", memoLang)}</td><td class='no-print' style='border:none;'><button onclick='removeMemoRow(this)' style='color:red; background:none; border:none; cursor:pointer; font-size:18px;'>&#215;</button></td>`;
    body.appendChild(row);
}

function removeMemoRow(btn) {
    if (document.querySelectorAll('#memo-body tr').length > 1) {
        btn.closest('tr').remove();
        document.querySelectorAll('#memo-body tr').forEach((r, i) => r.cells[0].innerText = convertDigits(i + 1, memoLang));
        calculateMemoTotal();
    }
}

function loadMemoLogo(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.getElementById('memo-img');
            img.src = e.target.result;
            img.style.display = 'flex';
            document.getElementById('txt-logo-hint').style.display = 'none';
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function updateMemoLayout() {
    const size = document.getElementById('memo-page-size').value;
    const page = document.getElementById('memo-page-unit');
    const dims = { a4: ["210mm", "297mm"], legal: ["216mm", "345mm"], a5: ["148mm", "210mm"], letter: ["216mm", "279mm"] };
    page.style.width = dims[size][0];
    page.style.minHeight = dims[size][1];
}

function printMemoContent() {
    const content = document.getElementById('memo-page-unit').innerHTML;
    const size = document.getElementById('memo-page-size').value;
    const dims = { 
        a4: "210mm 297mm", 
        legal: "216mm 345mm", 
        a5: "148mm 210mm", 
        letter: "216mm 279mm" 
    };

    let memoPdfCount = localStorage.getItem('memo_pdf_print_count') || 0;
    memoPdfCount = parseInt(memoPdfCount) + 1;
    localStorage.setItem('memo_pdf_print_count', memoPdfCount);

    const bnCount = convertDigits(memoPdfCount, 'bn'); 
    
    const customFileName = `Cash_Memo-www.seba.pro.bd-${bnCount}`;

    const printWin = window.open('', '_blank');
    printWin.document.write(`
        <html>
            <head>
                <title>${customFileName}</title>
                <style>
                    @import url('https://fonts.maateen.me/solaiman-lipi/font.css');
                    
                    @page { 
                        size: ${dims[size]}; 
                        margin: 15mm 10mm; 
                    }
                    
                    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                    
                    body { 
                        font-family: 'SolaimanLipi', Arial, sans-serif; 
                        padding: 0; margin: 0; background: #fff; 
                    }

                    table { 
                        width: 100%; 
                        border-collapse: collapse; 
                        margin-top: 10px; 
                        border: none !important; 
                        page-break-inside: auto;
                    }
                    
                    thead { display: table-header-group; } 

                    tfoot { display: table-row-group !important; } 
                    
                    tr { page-break-inside: avoid; }

                    th, td { 
                        border: 1px solid #0d9488 !important; 
                        padding: 8px; 
                        text-align: center; 
                    }
                    
                    th { background:#0d9488 !important; color:#fff !important; }

                    .memo-header-top { display: flex; align-items: center; border-bottom: 1px solid #ff3c00; padding-bottom: 10px; margin-bottom: 15px; }
                    .logo-preview img { width: 80px; height: 80px; object-fit: contain; }
                    .shop-info { text-align: center; flex:1; }
                    .shop-info h1 { font-size: 24px; color: #0d9488; margin:0; }
                    .shop-details-row { display: flex; justify-content: center; gap: 8px; margin-top: 5px; }
                    .detail-box { border: 1px dashed #ff6000; padding: 2px 8px; border-radius: 4px; font-size: 12px; }
                    .memo-sub-header { display: flex; justify-content: space-between; color: #000; border-bottom: 1px solid #0d9488; }
                    .memo-customer-container { 
                        border: 1px dashed #0d9488;
                        border-radius: 5px;
                        padding: 10px; 
                        margin-top: 20px !important; 
                        margin-bottom: 15px; 
                    }
                    .cust-info-row-inline { display: flex; gap: 10px; width: 100%; }
                    .cust-field-inline { border-bottom: 1px solid #eee; flex: 1; font-size: 13px; display: flex; gap: 5px; }
                    
                    .signature-row, .in-words-box, .memo-notes {
                        page-break-inside: avoid;
                    }

                    .signature-row { display: flex; justify-content: space-between; margin-top: 50px; }
                    .sig-box { border-top: 1px solid #0d9488;
                        width: 180px;
                        text-align: center;
                        font-size: 13px;
                        padding-top: 5px;
                        font-weight: 700;
                        color: #0d9488;
                    }
                    .in-words-box { margin-top: 20px; font-weight: bold; border-bottom: 1px dashed #0d9488; color: #000; }
                    .memo-notes {
                        margin-top: 35px;
                        font-size: 12px;
                        color: #f00;
                        border-top: 1px dashed #0d9488;
                        padding-top: 10px;
                        outline: none;
                        text-align: center;
                    }
                    .no-print { display:none !important; }
                </style>
            </head>
            <body>
                <div class="sheet-page-unit">${content}</div>
                <script>
                    window.onload = function() {
                        setTimeout(() => { 
                            window.print(); 
                            window.close(); 
                        }, 500);
                    };
                <\/script>
            </body>
        </html>
    `);
    printWin.document.close();
}

function resetMemo() {
    document.getElementById('memo-body').innerHTML = `
        <tr>
            <td class="sl-cell">${convertDigits(1, memoLang)}</td>
            <td contenteditable="true" style="text-align: left;"></td>
            <td contenteditable="true" oninput="handleTableInput(this)">${convertDigits(1, memoLang)}</td>
            <td contenteditable="true" oninput="handleTableInput(this)">${convertDigits(0, memoLang)}</td>
            <td class="row-total">${convertDigits("0.00", memoLang)}</td>
            <td class="no-print" style="border:none;">
                <button onclick="removeMemoRow(this)" style="color:red; background:none; border:none; cursor:pointer; font-size:18px;">&times;</button>
            </td>
        </tr>`;

    document.getElementById('memo-grand-total').innerText = convertDigits("0.00", memoLang);
    document.getElementById('memo-words-display').innerText = memoLang === 'en' ? "Zero Taka only." : "শূণ্য টাকা মাত্র।";

    document.getElementById('txt-cust-name').innerText = "";
    document.getElementById('txt-cust-addr').innerText = "";
    document.getElementById('txt-cust-mob1').innerText = "";

    if (typeof updateMemoDate === 'function') {
        updateMemoDate();
    }
}
;

function openBarcodeModal() {
    document.getElementById('barcodeModal').style.display = 'flex';
    if(typeof setActiveMode === 'function') setActiveMode('mode-barcode');
    generateBarcode(); // শুরুতে একবার জেনারেট করা
}

function closeBarcodeModal() {
    document.getElementById('barcodeModal').style.display = 'none';
}

function generateBarcode() {
    const text = document.getElementById('barcode-text').value;
    const format = document.getElementById('barcode-format').value;
    const width = document.getElementById('bar-width').value;
    const height = document.getElementById('bar-height').value;
    const color = document.getElementById('bar-color').value;
    const background = document.getElementById('bar-bg').value;
    const showText = document.getElementById('show-text').checked;
    const errorMsg = document.getElementById('barcode-error');

    if(!text) return;

    try {
        JsBarcode("#barcode-output", text, {
            format: format,
            width: parseInt(width),
            height: parseInt(height),
            displayValue: showText,
            lineColor: color,
            background: background,
            margin: 10,
            valid: function(valid) {
                if (valid) {
                    errorMsg.style.display = 'none';
                } else {
                    errorMsg.style.display = 'flex';
                }
            }
        });
    } catch (err) {
        errorMsg.style.display = 'flex';
    }
}

function downloadBarcode(type) {
    const svg = document.getElementById('barcode-output');
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    
    const img = new Image();
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(source)));
    
    img.onload = function() {
        canvas.width = img.width + 40;
        canvas.height = img.height + 40;
        
        context.fillStyle = document.getElementById('bar-bg').value;
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 20, 20);
        
        const link = document.createElement('a');
        link.download = `Barcode_${document.getElementById('barcode-text').value}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
        
        // এখানে কোনো triggerAlert বা alert রাখা হয়নি
    };
}

function resetBarcode() {
    // ইনপুটগুলো ডিফল্ট ভ্যালুতে ফিরিয়ে আনা
    document.getElementById('barcode-text').value = "12345678";
    document.getElementById('barcode-format').value = "CODE128";
    document.getElementById('bar-width').value = "2";
    document.getElementById('bar-height').value = "80";
    document.getElementById('bar-color').value = "#000000";
    document.getElementById('bar-bg').value = "#ffffff";
    document.getElementById('show-text').checked = true;
    
    // বারকোড পুনরায় জেনারেট করা
    generateBarcode();
    
    // এখানে কোনো কনফার্মেশন বা এলার্ট দেওয়া হয়নি
}
;

let teleCropper = null;
let teleCurrentMode = "photo";
let teleFinalBlob = null;

function openTeletalkModal() {
    document.getElementById('teletalkModal').style.display = 'flex';
    if(typeof setActiveMode === 'function') setActiveMode('mode-teletalk');
}

/* --- ১. পপ-আপ ক্লোজ করার সাথে রিসেট লজিক ফিক্সড --- */
function closeTeletalkModal() { 
    document.getElementById('teletalkModal').style.display = 'none'; 
    resetTele(); // এখানে রিসেট ফাংশনটি কল করা হয়েছে
}

function handleTeleFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        const cropImg = document.getElementById('tele-crop-image');
        
        if (teleCropper) {
            teleCropper.destroy();
            teleCropper = null;
        }

        cropImg.src = e.target.result;
        
        document.getElementById('tele-upload-area').style.display = 'none';
        document.getElementById('tele-controls').style.display = 'flex';
        document.getElementById('tele-result-area').style.display = 'none';
        
        cropImg.onload = () => {
            teleCropper = new Cropper(cropImg, {
                aspectRatio: (teleCurrentMode === 'photo') ? 1 : (300 / 80),
                viewMode: 1,
                autoCropArea: 1,
                responsive: true,
                zoomOnWheel: false, 
                zoomOnTouch: false,
                toggleDragModeOnDblclick: false
            });
        };
    };
    reader.readAsDataURL(file);
}

function setTelePreset(mode) {
    teleCurrentMode = mode;
    document.querySelectorAll('.preset-card').forEach(card => card.classList.remove('active'));
    
    if(mode === 'photo') {
        document.getElementById('btn-preset-photo').classList.add('active');
    } else {
        document.getElementById('btn-preset-sig').classList.add('active');
    }
    
    if (teleCropper) {
        const ratio = (mode === 'photo') ? 1 : (300 / 80);
        teleCropper.setAspectRatio(ratio);
    }
}

async function processTeleCrop() {
    if (!teleCropper) return;
    
    const targetW = 300;
    const targetH = (teleCurrentMode === 'photo') ? 300 : 80;
    const maxKB = (teleCurrentMode === 'photo') ? 100 : 60;

    const canvas = teleCropper.getCroppedCanvas({
        width: targetW,
        height: targetH,
        fillColor: '#fff',
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high'
    });

    let quality = 0.90;
    let dataUrl = "";
    let finalKB = 0;

    for (let i = 0; i < 15; i++) {
        dataUrl = canvas.toDataURL("image/jpeg", quality);
        finalKB = Math.round((dataUrl.length * 3 / 4) / 1024);
        if (finalKB <= maxKB) break;
        quality -= 0.10;
        if (quality < 0.1) break;
    }

    const preview = document.getElementById('tele-result-preview');
    preview.src = dataUrl;
    teleFinalBlob = dataUrl;

    document.getElementById('tele-result-info').innerText = targetW + " x " + targetH + " Pixels | " + finalKB + " KB";
    document.getElementById('tele-result-area').style.display = 'flex';
    document.getElementById('tele-result-area').scrollIntoView({ behavior: 'smooth' });
}

function downloadTeleImg() {
    if (!teleFinalBlob) return;
    const link = document.createElement('a');
    link.href = teleFinalBlob;
    link.download = "Teletalk_" + teleCurrentMode + ".jpg";
    link.click();
}

/* --- ২. সম্পূর্ণ রিসেট ফাংশন (উন্নত করা হয়েছে) --- */
function resetTele() {
    // ক্রপার বন্ধ করা
    if (teleCropper) {
        teleCropper.destroy();
        teleCropper = null;
    }
    
    // সব ভ্যালু এবং প্রিভিউ ক্লিয়ার করা
    document.getElementById('tele-upload-area').style.display = 'flex';
    document.getElementById('tele-controls').style.display = 'none';
    document.getElementById('tele-result-area').style.display = 'none';
    document.getElementById('tele-input').value = "";
    document.getElementById('tele-crop-image').src = "";
    document.getElementById('tele-result-preview').src = "";
    
    // মোড ডিফল্ট ভাবে ফটোতে ফিরিয়ে আনা
    teleCurrentMode = "photo";
    document.querySelectorAll('.preset-card').forEach(card => card.classList.remove('active'));
    document.getElementById('btn-preset-photo').classList.add('active');
}
//# sourceMappingURL=/sm/c4c9e5429ef57072112abb52736e0ff507a63e65f0f2134bd9a8ca151e4310a0.map
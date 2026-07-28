let bizLogoData="images/Monir.jpeg",currentTemp=1;function openBizCardModal(){setActiveMode("mode-biz-card"),document.getElementById("bizCardModal").style.display="flex",document.body.style.overflow="hidden",updateBizPreview()}function closeBizCardModal(){document.getElementById("bizCardModal").style.display="none",document.body.style.overflow="auto",document.getElementById("bizName").value="MD. Monir Hossain",document.getElementById("bizTitle").value="Graphic Designer",document.getElementById("bizCompany").value="Digital Seba",document.getElementById("bizDesc").value="Professional Digital Studio Solutions",document.getElementById("bizPhone").value="+880 1824 741444",document.getElementById("bizEmail").value="example@mail.com",document.getElementById("bizWeb").value="http://seba.pro.bd",document.getElementById("bizAddress").value="Comilla, Bangladesh",document.getElementById("clrName").value="#1e293b",document.getElementById("clrTitle").value="#4f46e5",document.getElementById("clrCompany").value="#1e293b",document.getElementById("clrDesc").value="#64748b",document.getElementById("clrPhone").value="#64748b",document.getElementById("clrEmail").value="#64748b",document.getElementById("clrWeb").value="#64748b",document.getElementById("clrAddr").value="#64748b",bizLogoData="images/Monir.jpeg",currentTemp=1,document.querySelectorAll(".temp-sel").forEach(e=>e.classList.remove("active")),document.querySelectorAll(".temp-sel")[0].classList.add("active"),document.getElementById("bizLogoInput").value="",updateBizPreview()}function loadBizLogo(e){if(e.files&&e.files[0]){let l=new FileReader;l.onload=e=>{bizLogoData=e.target.result,updateBizPreview()},l.readAsDataURL(e.files[0])}}function setBizTemp(e,l){currentTemp=e,document.querySelectorAll(".temp-sel").forEach(e=>e.classList.remove("active")),l.classList.add("active"),updateBizPreview()}function updateBizPreview(){let e={name:document.getElementById("bizName").value,title:document.getElementById("bizTitle").value,comp:document.getElementById("bizCompany").value,desc:document.getElementById("bizDesc").value,phone:document.getElementById("bizPhone").value,email:document.getElementById("bizEmail").value,web:document.getElementById("bizWeb").value,addr:document.getElementById("bizAddress").value},l={name:document.getElementById("clrName").value,title:document.getElementById("clrTitle").value,comp:document.getElementById("clrCompany").value,desc:document.getElementById("clrDesc").value,phone:document.getElementById("clrPhone").value,email:document.getElementById("clrEmail").value,web:document.getElementById("clrWeb").value,addr:document.getElementById("clrAddr").value},t=document.getElementById("bizCardBody");t.className=`business-card temp-${currentTemp}`;let a=`<div class="logo-pos"><img src="${bizLogoData}" class="card-logo-img"/></div>`;1===currentTemp?t.innerHTML=`${a}
            <div class="card-name" style="color:${l.name}">${e.name}</div>
            <div class="card-title" style="color:${l.title}">${e.title}</div>
            <div class="card-desc" style="color:${l.desc}">${e.desc}</div>
            <div class="card-info">
                <div style="color:${l.phone}"><i class="fa fa-phone"></i> ${e.phone}</div>
                <div style="color:${l.email}"><i class="fa fa-envelope"></i> ${e.email}</div>
                <div style="color:${l.web}"><i class="fa fa-globe"></i> ${e.web}</div>
                <div style="color:${l.addr}"><i class="fa fa-map-marker"></i> ${e.addr}</div>
            </div>`:2===currentTemp?t.innerHTML=`${a}
            <div class="card-name" style="color:${l.name}; border-color:${l.name}">${e.name}</div>
            <div class="card-title" style="color:${l.title}">${e.title}</div>
            <div class="card-info">
                <div style="color:${l.desc}">${e.desc}</div>
                <div style="color:${l.phone}">${e.phone} | ${e.email}</div>
                <div style="color:${l.addr}">${e.addr}</div>
            </div>`:3===currentTemp?t.innerHTML=`<div class="card-name" style="color:${l.name}">${e.name}</div>
            <div class="card-title" style="color:${l.title}">${e.title}</div>
            <div class="card-info">
                <div style="color:${l.desc}">${e.desc}</div>
                <div style="color:${l.phone}">${e.phone} • ${e.email}</div>
                <div style="color:${l.web}">${e.web}</div>
                <div style="color:${l.addr}">${e.addr}</div>
            </div>
            ${a}`:t.innerHTML=`<div style="display:flex; justify-content:space-between;">
                <div>
                    <div class="card-name" style="color:${l.name}">${e.name}</div>
                    <div style="color:${l.title}; font-weight:bold;">${e.title}</div>
                </div>
                <img src="${bizLogoData}" class="card-logo-img"/>
            </div>
            <div class="card-info">
                <div style="color:${l.comp}; font-weight:800; font-size:14px; margin-top:10px;">${e.comp}</div>
                <div style="color:${l.desc}; margin-bottom:10px;">${e.desc}</div>
                <div style="color:${l.phone}">${e.phone}</div>
                <div style="color:${l.email}">${e.email}</div>
            </div>`}function downloadBizCard(e){let l=document.getElementById("bizCardExport");html2canvas(l,{scale:4,useCORS:!0,backgroundColor:null}).then(l=>{if("png"===e){let t=document.createElement("a");t.download="Business_Card.png",t.href=l.toDataURL("image/png"),t.click()}else if("jpg"===e){let a=document.createElement("a");a.download="Business_Card.jpg",a.href=l.toDataURL("image/jpeg",.9),a.click()}else{let{jsPDF:i}=window.jspdf,d=new i("l","mm",[88.9,50.8]);d.addImage(l.toDataURL("image/jpeg",1),"JPEG",0,0,88.9,50.8),d.save("Business_Card.pdf")}})}

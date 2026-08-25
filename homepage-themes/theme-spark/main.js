import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

const CYAN = 0x42d9ff;
const VIOLET = 0x8a5cff;
const CORAL = 0xff5d4d;
const VOID = 0x02030a;
const MOBILE = matchMedia('(max-width: 767px)').matches;
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

const categories = [
  {slug:'software',index:'01',name:'Software',formats:'EXE · MSI · ZIP',note:'Desktop programs, editors, and utility suites kept installable and current.',held:4},
  {slug:'apps',index:'02',name:'Apps',formats:'APK · XAPK',note:'Mobile packages for everyday tools, readers, and offline workflows.',held:3},
  {slug:'drivers',index:'03',name:'Drivers',formats:'EXE · INF · CAB',note:'Hardware support files for printers, graphics, audio, and network devices.',held:3},
  {slug:'windows',index:'04',name:'Windows',formats:'ISO · ESD',note:'Desktop operating system builds, activation helpers, and repair media.',held:2},
  {slug:'android',index:'05',name:'Android',formats:'IMG · ZIP · APK',note:'Firmware, recovery packages, and system resources for Android hardware.',held:2},
  {slug:'books',index:'06',name:'Books',formats:'EPUB · PDF',note:'Reading material, study sets, and reference volumes for long sessions.',held:2},
  {slug:'pdf',index:'07',name:'PDF',formats:'PDF',note:'Forms, manuals, guides, and printable documents ready to open.',held:2},
  {slug:'images',index:'08',name:'Images',formats:'PNG · JPG · SVG',note:'Graphics, textures, icon sets, and picture assets for design work.',held:2},
  {slug:'videos',index:'09',name:'Videos',formats:'MP4 · MKV',note:'Tutorials, walkthroughs, and motion assets stored for direct playback.',held:2},
  {slug:'iso',index:'10',name:'ISO',formats:'ISO · IMG',note:'Bootable disc images for installs, rescue drives, and clean setups.',held:2},
  {slug:'fonts',index:'11',name:'Fonts',formats:'TTF · OTF',note:'Bangla and Latin typefaces, families, and typographic collections.',held:2},
  {slug:'documents',index:'12',name:'Documents',formats:'DOCX · XLSX · PPTX',note:'Templates, spreadsheets, letters, and editable office documents.',held:2},
  {slug:'others',index:'13',name:'Others',formats:'MIXED',note:'Everything that refuses a single shelf but still deserves a place.',held:1}
];

const resources = [
  ['windows-11-installation-media','Windows 11 Installation Media','windows','Windows','ISO','Clean installation image with setup notes for making a bootable USB drive.',true],
  ['windows-10-recovery-image','Windows 10 Recovery Image','windows','Windows','ESD','Repair and refresh media for machines that no longer boot into the desktop.',false],
  ['universal-printer-driver-pack','Universal Printer Driver Pack','drivers','Windows','EXE','Combined driver set covering common office and home printer families.',true],
  ['graphics-driver-archive','Graphics Driver Archive','drivers','Windows','EXE','Older and current display drivers kept for machines that need a stable version.',false],
  ['network-adapter-inf-bundle','Network Adapter INF Bundle','drivers','Windows','INF','Offline network drivers for a fresh install with no internet connection yet.',false],
  ['office-productivity-suite','Office Productivity Suite','software','Windows','MSI','Document, spreadsheet, and presentation tools for daily desk work.',true],
  ['media-player-codec-set','Media Player & Codec Set','software','Windows','EXE','Playback software with the codecs needed for uncommon video containers.',false],
  ['archive-manager','Archive Manager','software','Cross-platform','ZIP','Compression tool for opening, splitting, and repairing large archives.',false],
  ['system-cleanup-toolkit','System Cleanup Toolkit','software','Windows','EXE','Maintenance utilities for storage, startup items, and registry housekeeping.',false],
  ['android-utility-toolkit','Android Utility Toolkit','apps','Android','APK','File manager, converter, and offline reader bundle for handset use.',true],
  ['offline-reader-app','Offline Reader App','apps','Android','APK','Reader for EPUB and PDF collections stored directly on the device.',false],
  ['photo-editor-mobile','Photo Editor for Mobile','apps','Android','XAPK','Layer based editing on Android with export presets for social sizes.',false],
  ['android-firmware-flash-package','Android Firmware Flash Package','android','Android','IMG','Stock firmware images with a written flashing sequence for recovery.',false],
  ['custom-recovery-builds','Custom Recovery Builds','android','Android','ZIP','Recovery environments for backup, restore, and package installation.',false],
  ['bangla-unicode-font-collection','Bangla Unicode Font Collection','fonts','Cross-platform','TTF','Bangla typefaces with full Unicode coverage for documents and design.',true],
  ['latin-display-typefaces','Latin Display Typefaces','fonts','Cross-platform','OTF','Headline and editorial families for posters, decks, and layout work.',false],
  ['academic-reference-library','Academic Reference Library','books','Cross-platform','PDF','Study volumes and reference books organised by subject area.',false],
  ['epub-reading-collection','EPUB Reading Collection','books','Cross-platform','EPUB','Reflowable titles suitable for phones, tablets, and e-ink readers.',false],
  ['hardware-service-manuals','Hardware Service Manuals','pdf','Cross-platform','PDF','Schematics and repair procedures for laptops, printers, and peripherals.',false],
  ['government-form-set','Printable Form Set','pdf','Cross-platform','PDF','Commonly requested forms kept in a print ready, unmodified state.',false],
  ['office-template-pack','Office Template Pack','documents','Cross-platform','DOCX','Letters, invoices, CVs, and report layouts ready to edit and export.',false],
  ['spreadsheet-calculators','Spreadsheet Calculators','documents','Cross-platform','XLSX','Budget, payroll, and stock sheets with formulas already wired up.',false],
  ['icon-and-vector-set','Icon & Vector Set','images','Cross-platform','SVG','Interface icons and vector marks that scale without quality loss.',false],
  ['texture-and-background-pack','Texture & Background Pack','images','Cross-platform','PNG','Paper, grain, and gradient plates for design and print composition.',false],
  ['software-setup-walkthroughs','Software Setup Walkthroughs','videos','Cross-platform','MP4','Recorded installation and configuration steps for the heavier tools.',false],
  ['repair-workshop-recordings','Repair Workshop Recordings','videos','Cross-platform','MKV','Long form hardware sessions kept for offline viewing and study.',false],
  ['rescue-boot-image','Rescue Boot Image','iso','Cross-platform','ISO','Live environment for partition work, data recovery, and diagnostics.',false],
  ['linux-desktop-image','Linux Desktop Image','iso','Linux','ISO','Desktop distribution image for older machines that need a lighter system.',false],
  ['mixed-utility-shelf','Mixed Utility Shelf','others','Cross-platform','MIXED','Configuration files, scripts, and small helpers that belong nowhere else.',false]
].map(([slug,title,category,platform,format,summary,featured]) => ({slug,title,category,categoryName:categories.find(c=>c.slug===category)?.name||'Others',platform,format,summary,featured}));
const featured = resources.filter(r=>r.featured).slice(0,5);

const chapters = [
  {id:'nexus',label:'The Nexus',start:0,end:.159},
  {id:'transit',label:'Data Transit',start:.159,end:.274},
  {id:'orbit',label:'Resource Orbit',start:.274,end:.484},
  {id:'stream',label:'Featured Stream',start:.484,end:.675},
  {id:'discovery',label:'Deep Discovery',start:.675,end:.853},
  {id:'gateway',label:'Open Universe',start:.853,end:1}
];

const state = {
  rawProgress:0, progress:0, velocity:0, pointer:new THREE.Vector2(), pointerSmooth:new THREE.Vector2(),
  chapter:0, hovered:null, focused:null, hoveredResource:null, audio:false, quality:'HIGH',
  cameraFocus:0, fpsFrames:0, fpsTime:performance.now(), lastProgress:0
};

const root = document.getElementById('webgl-root');
const scene = new THREE.Scene();
scene.background = new THREE.Color(VOID);
scene.fog = new THREE.FogExp2(VOID, .014);
const camera = new THREE.PerspectiveCamera(MOBILE?56:46, innerWidth/innerHeight,.1,220);
camera.position.set(0,.4,18);
const renderer = new THREE.WebGLRenderer({antialias:!MOBILE,powerPreference:'high-performance'});
renderer.setSize(innerWidth,innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio,MOBILE?1.25:1.7));
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=.95;
root.appendChild(renderer.domElement);

const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment=pmrem.fromScene(new RoomEnvironment(),.04).texture;
pmrem.dispose();

const cameraPath=new THREE.CatmullRomCurve3([
  new THREE.Vector3(0,.4,18),new THREE.Vector3(0,.2,6),new THREE.Vector3(4.5,1.2,-14),
  new THREE.Vector3(-4.5,-.3,-35),new THREE.Vector3(3.2,1.4,-56),new THREE.Vector3(0,.2,-78),new THREE.Vector3(0,1.2,-101)
],false,'catmullrom',.42);
const lookPath=new THREE.CatmullRomCurve3([
  new THREE.Vector3(0,0,0),new THREE.Vector3(0,0,-9),new THREE.Vector3(0,0,-25),
  new THREE.Vector3(0,0,-47),new THREE.Vector3(0,0,-68),new THREE.Vector3(0,0,-90),new THREE.Vector3(0,0,-112)
],false,'catmullrom',.45);
const currentCamera=camera.position.clone(), currentLook=new THREE.Vector3(0,0,0), focusedPosition=new THREE.Vector3();

function hash(i){return Math.abs(Math.sin(i*91.73)*43758.5453)%1;}
function clamp(v,a=0,b=1){return Math.max(a,Math.min(b,v));}
function smoothstep(a,b,x){const t=clamp((x-a)/(b-a));return t*t*(3-2*t);}
function damp(current,target,lambda,dt){return THREE.MathUtils.lerp(current,target,1-Math.exp(-lambda*dt));}
function categoryPosition(i){const angle=i/categories.length*Math.PI*2-Math.PI*.25,r=i%2===0?8.4:11.2;return new THREE.Vector3(Math.cos(angle)*r,Math.sin(angle*1.7)*4.4,-26+Math.sin(angle)*5.4);}

/* GLSL fluid particle void */
const particleVertex=`uniform float uTime;uniform vec2 uMouse;attribute float aScale;attribute float aPhase;varying float vAlpha;void main(){vec3 p=position;float wave=sin(p.z*.08+uTime*.22+aPhase)*.55;p.x+=wave+sin(p.y*.16+uTime*.13)*.35;p.y+=cos(p.x*.11+uTime*.17+aPhase)*.4;vec4 mv=modelViewMatrix*vec4(p,1.);vec2 projected=mv.xy/max(1.,-mv.z);float cursor=1./(1.+length(projected-uMouse*.16)*9.);mv.xy+=normalize(projected-uMouse*.16+.0001)*cursor*.18;gl_Position=projectionMatrix*mv;gl_PointSize=(2.+aScale*4.+cursor*4.)*(80./max(8.,-mv.z));vAlpha=.18+aScale*.5+cursor*.45;}`;
const particleFragment=`varying float vAlpha;void main(){vec2 p=gl_PointCoord-.5;float d=length(p);float core=smoothstep(.5,0.,d);vec3 cyan=vec3(.16,.82,1.);vec3 violet=vec3(.55,.25,1.);gl_FragColor=vec4(mix(violet,cyan,core),core*vAlpha);}`;
const particleCount=MOBILE?900:2200,particlePositions=new Float32Array(particleCount*3),particleScales=new Float32Array(particleCount),particlePhases=new Float32Array(particleCount);
for(let i=0;i<particleCount;i++){particlePositions[i*3]=(hash(i*2.17)-.5)*52;particlePositions[i*3+1]=(hash(i*3.91)-.5)*28;particlePositions[i*3+2]=12-hash(i*1.73)*135;particleScales[i]=hash(i*6.31);particlePhases[i]=hash(i*8.77)*Math.PI*2;}
const particleGeometry=new THREE.BufferGeometry();particleGeometry.setAttribute('position',new THREE.BufferAttribute(particlePositions,3));particleGeometry.setAttribute('aScale',new THREE.BufferAttribute(particleScales,1));particleGeometry.setAttribute('aPhase',new THREE.BufferAttribute(particlePhases,1));
const particleMaterial=new THREE.ShaderMaterial({vertexShader:particleVertex,fragmentShader:particleFragment,uniforms:{uTime:{value:0},uMouse:{value:new THREE.Vector2()}},transparent:true,depthWrite:false,blending:THREE.AdditiveBlending});
const cosmicField=new THREE.Points(particleGeometry,particleMaterial);cosmicField.frustumCulled=false;scene.add(cosmicField);

/* Instanced signal lanes */
const laneCount=MOBILE?36:78,laneGeometry=new THREE.BoxGeometry(1,1,1),laneMaterial=new THREE.MeshBasicMaterial({color:CYAN,transparent:true,opacity:.28,toneMapped:false}),lanes=new THREE.InstancedMesh(laneGeometry,laneMaterial,laneCount),dummy=new THREE.Object3D();
for(let i=0;i<laneCount;i++){const z=4-hash(i*4.1)*116,side=i%2===0?-1:1;dummy.position.set(side*(7+hash(i)*10),(hash(i*2.9)-.5)*14,z);dummy.rotation.set(hash(i*7.2)*.5,hash(i*5.4)*Math.PI,hash(i*9.3)*.3);dummy.scale.set(.04,.04,2+hash(i*11.2)*8);dummy.updateMatrix();lanes.setMatrixAt(i,dummy.matrix);}lanes.instanceMatrix.needsUpdate=true;scene.add(lanes);

/* Lighting and visible volumetric beams */
scene.add(new THREE.AmbientLight(0x7080bb,.15));
const keyLight=new THREE.DirectionalLight(0xb9ddff,1.8);keyLight.position.set(8,12,10);scene.add(keyLight);
[[CYAN,70,0,1,2],[VIOLET,75,2,2,-27],[CORAL,60,-4,1,-51],[CYAN,90,0,0,-75]].forEach(([color,intensity,x,y,z])=>{const light=new THREE.PointLight(color,intensity,32,2);light.position.set(x,y,z);scene.add(light);});
const beamVertex=`varying vec3 vLocal;void main(){vLocal=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
const beamFragment=`uniform vec3 uColor;uniform float uOpacity;varying vec3 vLocal;void main(){float radial=1.-smoothstep(0.,1.8,length(vLocal.xz));float vertical=smoothstep(-6.,4.,vLocal.y)*(1.-smoothstep(3.,7.,vLocal.y));gl_FragColor=vec4(uColor,radial*vertical*uOpacity);}`;
function addBeam(position,rotation,color){const mat=new THREE.ShaderMaterial({vertexShader:beamVertex,fragmentShader:beamFragment,uniforms:{uColor:{value:new THREE.Color(color)},uOpacity:{value:.18}},transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide});const mesh=new THREE.Mesh(new THREE.ConeGeometry(3.8,18,40,1,true),mat);mesh.position.copy(position);mesh.rotation.set(...rotation);scene.add(mesh);}
addBeam(new THREE.Vector3(-7,6,-23),[.35,0,-.52],CYAN);addBeam(new THREE.Vector3(8,5,-51),[.2,0,.58],VIOLET);

/* Hero nexus */
const nexus=new THREE.Group();scene.add(nexus);
const knot=new THREE.Mesh(new THREE.TorusKnotGeometry(2.2,.5,220,32,2,3),new THREE.MeshPhysicalMaterial({color:0x8eeaff,transmission:.96,thickness:1.6,roughness:.08,metalness:.1,ior:1.35,clearcoat:1,clearcoatRoughness:.08,attenuationColor:new THREE.Color(VIOLET),attenuationDistance:2.5}));nexus.add(knot);
const nexusInner=new THREE.Mesh(new THREE.IcosahedronGeometry(1.5,2),new THREE.MeshStandardMaterial({color:0x050611,emissive:CYAN,emissiveIntensity:3.4,wireframe:true}));nexus.add(nexusInner);
[3.3,4.4,5.5].forEach((radius,i)=>{const ring=new THREE.Mesh(new THREE.TorusGeometry(radius,i===1?.045:.025,8,160),new THREE.MeshBasicMaterial({color:i===1?VIOLET:CYAN,transparent:true,opacity:.75,toneMapped:false}));ring.rotation.set(i*.65,i*.78,i*.3);nexus.add(ring);});

/* Category glass satellites + DOM labels + spring values */
const categoryGroup=new THREE.Group();scene.add(categoryGroup);const categoryMeshes=[];
categories.forEach((category,index)=>{const group=new THREE.Group(),position=categoryPosition(index);group.position.copy(position);group.userData={base:position.clone(),scale:1,scaleVelocity:0,zOffset:0,zVelocity:0,index,category};
 const glass=new THREE.Mesh(new THREE.BoxGeometry(3.6,2.15,.3),new THREE.MeshPhysicalMaterial({color:0x8edfff,transmission:.86,thickness:.9,roughness:.22,metalness:.15,ior:1.3,clearcoat:1,transparent:true,opacity:.82}));glass.userData={kind:'category',category,index,group};group.add(glass);categoryMeshes.push(glass);
 const glow=new THREE.Mesh(new THREE.BoxGeometry(3.72,2.27,.08),new THREE.MeshStandardMaterial({color:0x030510,emissive:index%3===0?CORAL:index%2===0?VIOLET:CYAN,emissiveIntensity:1.1,transparent:true,opacity:.88}));glow.position.z=-.18;group.add(glow);group.userData.glow=glow;
 const label=document.createElement('div');label.className='object-label';label.innerHTML=`<span>${category.index} / ${String(category.held).padStart(2,'0')} FILES</span><strong>${category.name}</strong><small>${category.formats}</small>`;document.body.appendChild(label);group.userData.label=label;categoryGroup.add(group);
});

/* Liquid resource membranes */
const liquidVertex=`uniform float uTime;uniform float uEnergy;varying vec2 vUv;varying float vWave;void main(){vUv=uv;vec3 p=position;float wave=sin(p.x*2.8+uTime)*cos(p.y*3.2-uTime*.7);wave+=sin((p.x+p.y)*5.+uTime*1.4)*.35;p.z+=wave*(.08+uEnergy*.22);vWave=wave;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}`;
const liquidFragment=`uniform vec3 uColor;uniform float uEnergy;varying vec2 vUv;varying float vWave;void main(){float edge=min(min(vUv.x,1.-vUv.x),min(vUv.y,1.-vUv.y));float border=1.-smoothstep(0.,.035,edge);float scan=.12*sin(vUv.y*120.+vWave*3.);vec3 color=uColor*(1.+border*3.5+scan+uEnergy);float alpha=.12+border*.82+abs(vWave)*.05;gl_FragColor=vec4(color,alpha);}`;
const resourceMeshes=[];
featured.forEach((resource,index)=>{const side=index%2===0?-1:1,group=new THREE.Group();group.position.set(side*(4.5+(index%3)),(index%3-1)*2.5,-50-index*2.8);group.rotation.y=side*-.28;group.userData={baseScale:1,scale:1,scaleVelocity:0,baseRotation:group.rotation.y,resource,index};
 const color=index%3===0?CYAN:index%3===1?VIOLET:CORAL,material=new THREE.ShaderMaterial({vertexShader:liquidVertex,fragmentShader:liquidFragment,uniforms:{uTime:{value:0},uEnergy:{value:0},uColor:{value:new THREE.Color(color)}},transparent:true,depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending});
 const mesh=new THREE.Mesh(new THREE.PlaneGeometry(7.2,4.2,56,32),material);mesh.userData={kind:'resource',resource,index,group};group.add(mesh);resourceMeshes.push(mesh);group.userData.material=material;
 const label=document.createElement('div');label.className='object-label resource-label';label.innerHTML=`<span>${String(index+1).padStart(2,'0')} / ${resource.categoryName} / ${resource.format}</span><strong>${resource.title}</strong><p>${resource.summary}</p>`;document.body.appendChild(label);group.userData.label=label;scene.add(group);
});

/* Discovery core */
const searchCore=new THREE.Group();searchCore.position.set(0,0,-74);scene.add(searchCore);
const coreHeart=new THREE.Mesh(new THREE.IcosahedronGeometry(2.1,2),new THREE.MeshPhysicalMaterial({color:0x2ce1ff,transmission:.75,thickness:1.4,roughness:.08,emissive:CYAN,emissiveIntensity:2.2}));searchCore.add(coreHeart);
const coreWire=new THREE.Mesh(new THREE.IcosahedronGeometry(3.78,1),new THREE.MeshBasicMaterial({color:VIOLET,wireframe:true,transparent:true,opacity:.25,toneMapped:false}));searchCore.add(coreWire);
[3.6,4.8,6].forEach((r,i)=>{const ring=new THREE.Mesh(new THREE.TorusGeometry(r,.035,8,128),new THREE.MeshBasicMaterial({color:i===1?VIOLET:CYAN,transparent:true,opacity:.65,toneMapped:false}));ring.rotation.set(i*.8,i*.5,i*.3);searchCore.add(ring);});

/* Final portal */
const portal=new THREE.Group();portal.position.set(0,0,-104);scene.add(portal);
[3.2,4.5,5.8].forEach((r,i)=>{const ring=new THREE.Mesh(new THREE.TorusGeometry(r,.1-i*.02,12,160),new THREE.MeshStandardMaterial({color:0x03040a,emissive:i===1?VIOLET:CYAN,emissiveIntensity:3.2,metalness:.7,roughness:.2}));ring.rotation.set(i*.4,i*.8,i*.7);portal.add(ring);});
const portalDisc=new THREE.Mesh(new THREE.CircleGeometry(3.05,80),new THREE.MeshBasicMaterial({color:0xbaf3ff,transparent:true,opacity:.7,toneMapped:false}));portalDisc.position.z=-.4;portal.add(portalDisc);

/* Postprocessing: Bloom, DOF, Vignette + chromatic lens shader */
const composer=new EffectComposer(renderer);composer.addPass(new RenderPass(scene,camera));
const bloom=new UnrealBloomPass(new THREE.Vector2(innerWidth,innerHeight),1.35,.72,.25);composer.addPass(bloom);
let bokeh=null;if(!MOBILE&&!REDUCED){bokeh=new BokehPass(scene,camera,{focus:18,aperture:.000045,maxblur:.008,width:innerWidth,height:innerHeight});composer.addPass(bokeh);}
const lensShader={uniforms:{tDiffuse:{value:null},resolution:{value:new THREE.Vector2(innerWidth,innerHeight)},amount:{value:REDUCED?0:.00075},vignette:{value:.82}},vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`uniform sampler2D tDiffuse;uniform vec2 resolution;uniform float amount;uniform float vignette;varying vec2 vUv;void main(){vec2 dir=vUv-.5;float d=length(dir);vec2 shift=dir*amount*(.5+d);float r=texture2D(tDiffuse,vUv+shift).r;float g=texture2D(tDiffuse,vUv).g;float b=texture2D(tDiffuse,vUv-shift).b;float vig=smoothstep(.82,.18,d*vignette);float grain=fract(sin(dot(vUv*resolution,vec2(12.9898,78.233)))*43758.5453);vec3 col=vec3(r,g,b)*(vig*.85+.15)+(grain-.5)*.018;gl_FragColor=vec4(col,1.);}`};
const lensPass=new ShaderPass(lensShader);composer.addPass(lensPass);composer.addPass(new OutputPass());

/* DOM projection, panel depth fades and interaction */
const spatialPanels=[
  {el:document.getElementById('panel-nexus'),point:new THREE.Vector3(-5.7,2.1,.2),center:.04,width:.18},
  {el:document.getElementById('panel-transit'),point:new THREE.Vector3(4,1,-13),center:.21,width:.11},
  {el:document.getElementById('panel-orbit'),point:new THREE.Vector3(-5.6,5.3,-25),center:.36,width:.16},
  {el:document.getElementById('panel-stream'),point:new THREE.Vector3(-5.4,5.2,-47),center:.57,width:.14},
  {el:document.getElementById('panel-discovery'),point:new THREE.Vector3(0,-5.2,-73.2),center:.76,width:.14},
  {el:document.getElementById('panel-gateway'),point:new THREE.Vector3(0,0,-103.2),center:.95,width:.12}
];
const projection=new THREE.Vector3();
function projectElement(element,point,opacity,scale=1){projection.copy(point).project(camera);const visible=projection.z>-1&&projection.z<1&&opacity>.008;element.style.opacity=visible?String(opacity):'0';element.style.filter=`blur(${(1-opacity)*8}px)`;element.style.transform=`translate(calc(-50% + ${projection.x*innerWidth*.5}px),calc(-50% + ${-projection.y*innerHeight*.5}px)) scale(${scale})`;}
function updateSpatialDOM(){
 spatialPanels.forEach(({el,point,center,width})=>{const distance=Math.abs(state.progress-center),opacity=clamp(1-distance/width);projectElement(el,point,opacity,.9+opacity*.1);el.style.pointerEvents=opacity>.72?'auto':'none';});
 categoryGroup.children.forEach(group=>{const world=group.getWorldPosition(new THREE.Vector3()),distance=Math.abs(state.progress-.37),opacity=clamp(1-distance/.19);projection.copy(world).project(camera);const onScreen=projection.z>-1&&projection.z<1&&opacity>.05;const label=group.userData.label;label.style.opacity=onScreen?String(opacity):'0';label.style.transform=`translate(${projection.x*innerWidth*.5+innerWidth*.5-label.offsetWidth/2}px,${-projection.y*innerHeight*.5+innerHeight*.5-label.offsetHeight/2}px) scale(${MOBILE?.72:.9})`;});
 featured.forEach((_,index)=>{const group=resourceMeshes[index].userData.group,world=group.getWorldPosition(new THREE.Vector3()),distance=Math.abs(state.progress-.57),opacity=clamp(1-distance/.18);projection.copy(world).project(camera);const label=group.userData.label;label.style.opacity=projection.z>-1&&projection.z<1?String(opacity):'0';label.style.transform=`translate(${projection.x*innerWidth*.5+innerWidth*.5-label.offsetWidth/2}px,${-projection.y*innerHeight*.5+innerHeight*.5-label.offsetHeight/2}px) scale(${MOBILE?.72:.85})`;});
}

/* Raycasting and physically damped hover/focus */
const raycaster=new THREE.Raycaster();
function raycast(){raycaster.setFromCamera(state.pointer,camera);const hits=raycaster.intersectObjects([...categoryMeshes,...resourceMeshes],false);const first=hits[0]?.object||null;const nextCategory=first?.userData.kind==='category'?first.userData.category.slug:null;const nextResource=first?.userData.kind==='resource'?first.userData.resource.slug:null;if(nextCategory!==state.hovered){state.hovered=nextCategory;if(nextCategory){document.body.style.cursor='pointer';playPulse(first.userData.index);}else if(!nextResource)document.body.style.cursor='default';}state.hoveredResource=nextResource;if(nextResource)document.body.style.cursor='pointer';}
function playPulse(index){if(!state.audio)return;try{const Ctx=window.AudioContext||window.webkitAudioContext,ctx=new Ctx(),osc=ctx.createOscillator(),gain=ctx.createGain();osc.type='sine';osc.frequency.value=74+index*4;gain.gain.setValueAtTime(.0001,ctx.currentTime);gain.gain.exponentialRampToValueAtTime(.035,ctx.currentTime+.015);gain.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+.18);osc.connect(gain).connect(ctx.destination);osc.start();osc.stop(ctx.currentTime+.2);osc.onended=()=>ctx.close();}catch{}}
renderer.domElement.addEventListener('pointermove',event=>{state.pointer.x=event.clientX/innerWidth*2-1;state.pointer.y=-(event.clientY/innerHeight*2-1);if(!MOBILE)raycast();});
renderer.domElement.addEventListener('pointerleave',()=>{state.hovered=null;state.hoveredResource=null;document.body.style.cursor='default';});
renderer.domElement.addEventListener('click',()=>{raycast();if(state.hovered){state.focused=state.focused===state.hovered?null:state.hovered;updateFocusHUD();}else if(state.focused){state.focused=null;updateFocusHUD();}});
renderer.domElement.addEventListener('pointerup',event=>{if(!MOBILE)return;state.pointer.x=event.clientX/innerWidth*2-1;state.pointer.y=-(event.clientY/innerHeight*2-1);raycast();if(state.hovered){state.focused=state.focused===state.hovered?null:state.hovered;updateFocusHUD();}});
function updateFocusHUD(){const hud=document.getElementById('focus-hud'),category=categories.find(c=>c.slug===state.focused),lock=document.getElementById('hud-lock');if(!category){hud.hidden=true;lock.hidden=true;return;}hud.hidden=false;lock.hidden=false;document.getElementById('focus-meta').textContent=`${category.index} / CATEGORY LOCKED`;document.getElementById('focus-title').textContent=category.name;document.getElementById('focus-note').textContent=category.note;lock.textContent=`TARGET LOCK / ${category.name.toUpperCase()} / ${category.formats}`;}
document.getElementById('focus-release').addEventListener('click',()=>{state.focused=null;updateFocusHUD();});

/* Search embedded records */
const searchInput=document.getElementById('core-query'),resultsEl=document.getElementById('core-results'),searchStatus=document.getElementById('search-status');
function renderResults(query=''){const term=query.trim().toLowerCase(),found=(term?resources.filter(r=>[r.title,r.category,r.categoryName,r.platform,r.format,r.summary].join(' ').toLowerCase().includes(term)):featured).slice(0,9);resultsEl.innerHTML=found.length?found.slice(0,5).map((r,i)=>`<div><span>${String(i+1).padStart(2,'0')}</span><strong>${r.title}</strong><small>${r.categoryName} / ${r.format}</small></div>`).join(''):'<p>NO SIGNAL FOUND / TRY ANOTHER FORMAT</p>';searchStatus.textContent=`${found.length} MATCH`;searchCore.userData.energy=term?1:0;}
searchInput.addEventListener('input',()=>renderResults(searchInput.value));document.querySelectorAll('.core-prompts button').forEach(button=>button.addEventListener('click',()=>{searchInput.value=button.textContent;renderResults(button.textContent);searchInput.focus();}));renderResults();

/* HUD/navigation */
function goTo(id){document.getElementById(`chapter-${id}`)?.scrollIntoView({behavior:REDUCED?'auto':'smooth',block:'start'});}
document.querySelectorAll('[data-flight]').forEach(button=>button.addEventListener('click',()=>{goTo(button.dataset.flight);closeMenu();}));
const menu=document.getElementById('hud-menu'),navToggle=document.getElementById('nav-toggle');function closeMenu(){menu.classList.remove('hud-menu--open');menu.setAttribute('aria-hidden','true');navToggle.setAttribute('aria-expanded','false');navToggle.textContent='NAV / 06';menu.querySelectorAll('button').forEach(b=>b.tabIndex=-1);}navToggle.addEventListener('click',()=>{const open=!menu.classList.contains('hud-menu--open');menu.classList.toggle('hud-menu--open',open);menu.setAttribute('aria-hidden',String(!open));navToggle.setAttribute('aria-expanded',String(open));navToggle.textContent=open?'CLOSE':'NAV / 06';menu.querySelectorAll('button').forEach(b=>b.tabIndex=open?0:-1);});addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu();});
const audioToggle=document.getElementById('audio-toggle');audioToggle.addEventListener('click',()=>{state.audio=!state.audio;audioToggle.textContent=`AUDIO ${state.audio?'ON':'OFF'}`;if(state.audio)playPulse(0);});

/* Scroll, resize, adaptive DPR */
function updateScroll(){const max=Math.max(document.documentElement.scrollHeight-innerHeight,1);state.rawProgress=clamp(scrollY/max);}
addEventListener('scroll',updateScroll,{passive:true});updateScroll();
function resize(){camera.aspect=innerWidth/innerHeight;camera.fov=innerWidth<768?56:46;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);composer.setSize(innerWidth,innerHeight);lensPass.uniforms.resolution.value.set(innerWidth,innerHeight);}
addEventListener('resize',resize,{passive:true});
function adaptQuality(now){state.fpsFrames++;if(now-state.fpsTime<2500)return;const fps=state.fpsFrames*1000/(now-state.fpsTime);state.fpsFrames=0;state.fpsTime=now;if(fps<38&&state.quality!=='LOW'){state.quality='LOW';renderer.setPixelRatio(.85);bloom.resolution.set(Math.floor(innerWidth*.65),Math.floor(innerHeight*.65));if(bokeh)bokeh.enabled=false;}else if(fps>54&&state.quality==='LOW'){state.quality='MEDIUM';renderer.setPixelRatio(Math.min(devicePixelRatio,MOBILE?1.15:1.4));}document.getElementById('render-quality').textContent=`RENDER / ${state.quality}`;}

/* Main loop */
const clock=new THREE.Clock();
function animate(now){requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.05),time=clock.elapsedTime;state.progress=REDUCED?state.rawProgress:damp(state.progress,state.rawProgress,8,dt);state.velocity=state.progress-state.lastProgress;state.lastProgress=state.progress;state.pointerSmooth.lerp(state.pointer,.06);
 particleMaterial.uniforms.uTime.value=REDUCED?0:time;particleMaterial.uniforms.uMouse.value.copy(state.pointerSmooth);if(!REDUCED){cosmicField.rotation.z=Math.sin(time*.03)*.035;nexus.rotation.y+=dt*.16;nexus.rotation.x=Math.sin(time*.31)*.16;nexusInner.rotation.z-=dt*.28;searchCore.rotation.y+=dt*(searchCore.userData.energy? .7:.18);searchCore.rotation.x+=dt*(searchCore.userData.energy?.26:.08);portal.rotation.z+=dt*.07;}
 const camTarget=cameraPath.getPointAt(state.progress),lookTarget=lookPath.getPointAt(state.progress),forward=lookTarget.clone().sub(camTarget).normalize(),narrow=clamp((1.25-innerWidth/innerHeight)/.8);camTarget.addScaledVector(forward,-narrow*5.5);
 const focusIndex=state.focused?categories.findIndex(c=>c.slug===state.focused):-1;if(focusIndex>=0)focusedPosition.copy(categoryPosition(focusIndex));state.cameraFocus=damp(state.cameraFocus,focusIndex>=0?1:0,3,dt);if(state.cameraFocus>.001){camTarget.lerp(focusedPosition.clone().add(new THREE.Vector3(0,.35,MOBILE?7.5:5.2)),state.cameraFocus);lookTarget.lerp(focusedPosition,state.cameraFocus);}if(!REDUCED){camTarget.x+=state.pointerSmooth.x*.85;camTarget.y+=state.pointerSmooth.y*.48;lookTarget.x-=state.pointerSmooth.x*.28;lookTarget.y-=state.pointerSmooth.y*.16;}currentCamera.lerp(camTarget,1-Math.exp(-3.3*dt));currentLook.lerp(lookTarget,1-Math.exp(-2.8*dt));camera.position.copy(currentCamera);camera.lookAt(currentLook);camera.fov=damp(camera.fov,(MOBILE?56:46)+narrow*7+Math.min(Math.abs(state.velocity)*160,4),5,dt);camera.updateProjectionMatrix();
 categoryGroup.children.forEach(group=>{const {category,base,index,glow}=group.userData,active=state.hovered===category.slug||state.focused===category.slug,targetScale=active?1.16:1,targetZ=active?1.2:0;group.userData.scaleVelocity+=(targetScale-group.userData.scale)*185*dt;group.userData.scaleVelocity*=Math.exp(-19*dt);group.userData.scale+=group.userData.scaleVelocity*dt;group.userData.zVelocity+=(targetZ-group.userData.zOffset)*140*dt;group.userData.zVelocity*=Math.exp(-18*dt);group.userData.zOffset+=group.userData.zVelocity*dt;group.scale.setScalar(group.userData.scale);group.position.set(base.x,base.y+(REDUCED?0:Math.sin(time*.42+index*1.3)*.24),base.z+group.userData.zOffset);if(!REDUCED)group.rotation.y=Math.sin(time*.22+index)*.14;glow.material.emissiveIntensity=damp(glow.material.emissiveIntensity,active?4.2:1.1,7,dt);});
 resourceMeshes.forEach(mesh=>{const group=mesh.userData.group,active=state.hoveredResource===mesh.userData.resource.slug,targetScale=active?1.08:1;group.userData.scaleVelocity+=(targetScale-group.userData.scale)*150*dt;group.userData.scaleVelocity*=Math.exp(-20*dt);group.userData.scale+=group.userData.scaleVelocity*dt;group.scale.setScalar(group.userData.scale);group.rotation.y=damp(group.rotation.y,active?0:group.userData.baseRotation,5,dt);mesh.material.uniforms.uTime.value=REDUCED?0:time;mesh.material.uniforms.uEnergy.value=damp(mesh.material.uniforms.uEnergy.value,active?1:0,6,dt);});
 const coreTarget=searchCore.userData.energy?1.18:1;searchCore.scale.lerp(new THREE.Vector3(coreTarget,coreTarget,coreTarget),1-Math.exp(-4*dt));coreHeart.material.emissiveIntensity=damp(coreHeart.material.emissiveIntensity,searchCore.userData.energy?3.6:2.2,5,dt);
 updateSpatialDOM();const nextChapter=chapters.findIndex(c=>state.rawProgress>=c.start&&state.rawProgress<(c.end+.0001));if(nextChapter!==state.chapter&&nextChapter>=0){state.chapter=nextChapter;document.querySelectorAll('.hud-chapters i,.hud-chapters span').forEach((el,i)=>el.classList.toggle('active',Math.floor(i/2)===state.chapter));document.getElementById('hud-chapter-label').textContent=`${chapters[state.chapter].id==='nexus'?'01':String(state.chapter+1).padStart(2,'0')} / ${chapters[state.chapter].label.toUpperCase()}`;if(state.chapter!==2&&state.focused){state.focused=null;updateFocusHUD();}}
 document.getElementById('hud-progress-fill').style.width=`${Math.max(2,state.progress*100)}%`;document.getElementById('hud-coordinate').textContent=`X ${Math.sin(state.progress*8).toFixed(3)} / Y ${Math.cos(state.progress*5).toFixed(3)} / Z ${(state.progress*-104).toFixed(1)}`;if(bokeh)bokeh.materialBokeh.uniforms.focus.value=damp(bokeh.materialBokeh.uniforms.focus.value,state.focused?6:18,3,dt);adaptQuality(now);composer.render();}

/* Boot and start */
requestAnimationFrame(()=>{document.getElementById('boot-label').textContent='NEXUS ONLINE';setTimeout(()=>document.getElementById('boot-screen').classList.add('boot-screen--ready'),650);});
resize();animate(performance.now());

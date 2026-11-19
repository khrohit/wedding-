window.addEventListener('load',()=>document.getElementById('loader').classList.add('hide'));

// Live countdown — update the wedding date here.
const weddingDate=new Date('December 20, 2026 18:00:00').getTime();
function updateCountdown(){const d=Math.max(0,weddingDate-Date.now());const v={days:Math.floor(d/86400000),hours:Math.floor(d%86400000/3600000),minutes:Math.floor(d%3600000/60000),seconds:Math.floor(d%60000/1000)};Object.entries(v).forEach(([k,n])=>document.getElementById(k).textContent=String(n).padStart(k==='days'?3:2,'0'))}
updateCountdown();setInterval(updateCountdown,1000);

// Reveal sections when they enter the viewport.
const revealObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');revealObserver.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));

// Mobile navigation.
const menuButton=document.querySelector('.menu-toggle'),navMenu=document.querySelector('.nav-links');
menuButton.addEventListener('click',()=>navMenu.classList.toggle('open'));
navMenu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>navMenu.classList.remove('open')));

// Scroll progress bar.
const progressBar=document.getElementById('progress-bar');let scrollQueued=false;
window.addEventListener('scroll',()=>{if(!scrollQueued){requestAnimationFrame(()=>{const max=document.documentElement.scrollHeight-innerHeight;progressBar.style.transform=`scaleX(${max>0?scrollY/max:0})`;scrollQueued=false});scrollQueued=true}},{passive:true});

// Gentle scroll-linked parallax on story and venue photography.
if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
 const frames=document.querySelectorAll('.parallax-frame');let parallaxQueued=false;
 function parallax(){frames.forEach(frame=>{const r=frame.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;const p=(r.top+r.height/2-innerHeight/2)/(innerHeight/2);const img=frame.querySelector('img');if(img)img.style.transform=`translate3d(0,${Math.max(-1,Math.min(1,p))*-13}px,0) scale(1.035)`});parallaxQueued=false}
 addEventListener('scroll',()=>{if(!parallaxQueued){requestAnimationFrame(parallax);parallaxQueued=true}},{passive:true});parallax();
}

// Three.js: softly falling petals, floating leaves and a subtle botanical 3D drift.
(function botanicalScene(){
 const canvas=document.getElementById('petal-canvas');
 if(!canvas||!window.THREE||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 let renderer,scene,camera,petals=[],frameId;
 try{
  renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));
  renderer.setClearColor(0x000000,0);
  scene=new THREE.Scene();camera=new THREE.PerspectiveCamera(42,1,.1,100);camera.position.z=13;
  scene.add(new THREE.AmbientLight(0xffffff,1.1));
  const light=new THREE.PointLight(0xf2e6c9,1.8,40);light.position.set(-4,5,8);scene.add(light);
  const petalMat=new THREE.MeshStandardMaterial({color:0xe8dfc9,roughness:.7,metalness:.02,side:THREE.DoubleSide,transparent:true,opacity:.82});
  const leafMat=new THREE.MeshStandardMaterial({color:0xb5c0a5,roughness:.8,side:THREE.DoubleSide,transparent:true,opacity:.65});
  const petalGeo=new THREE.SphereGeometry(.16,10,8);petalGeo.scale(.65,1.5,.12);
  const leafGeo=new THREE.SphereGeometry(.13,10,8);leafGeo.scale(.5,1.9,.1);
  const total=window.innerWidth<650?28:54;
  for(let i=0;i<total;i++){
   const isLeaf=i%3===0;
   const mesh=new THREE.Mesh(isLeaf?leafGeo:petalGeo,isLeaf?leafMat:petalMat);
   mesh.position.set((Math.random()-.5)*17,(Math.random()-.5)*11,(Math.random()-.5)*5-1);
   mesh.rotation.set(Math.random()*Math.PI,Math.random()*Math.PI,Math.random()*Math.PI);
   mesh.userData={speed:.35+Math.random()*.65,sway:Math.random()*Math.PI*2,spin:(Math.random()-.5)*.7,baseX:mesh.position.x};
   scene.add(mesh);petals.push(mesh);
  }
  function resize(){const w=canvas.clientWidth||innerWidth,h=canvas.clientHeight||innerHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}
  resize();addEventListener('resize',resize,{passive:true});
  let pointerX=0,pointerY=0;
  addEventListener('pointermove',e=>{pointerX=(e.clientX/innerWidth-.5)*.45;pointerY=(e.clientY/innerHeight-.5)*.25},{passive:true});
  const clock=new THREE.Clock();
  function animate(){
   frameId=requestAnimationFrame(animate);const t=clock.getElapsedTime();
   scene.rotation.y+=(pointerX-scene.rotation.y)*.012;scene.rotation.x+=(-pointerY-scene.rotation.x)*.012;
   petals.forEach(p=>{
    const u=p.userData;p.position.y-=u.speed*.009;p.position.x=u.baseX+Math.sin(t*.5+u.sway)*.28;
    p.rotation.x+=.0015*u.speed;p.rotation.y+=.002*u.speed;p.rotation.z+=u.spin*.002;
    if(p.position.y< -6.5){p.position.y=6.5;p.position.x=(Math.random()-.5)*17;u.baseX=p.position.x}
   });
   renderer.render(scene,camera);
  }
  animate();addEventListener('pagehide',()=>cancelAnimationFrame(frameId),{once:true});
 }catch(e){canvas.style.display='none'}
})();

// Demo RSVP: wire this form to a server/API to persist submissions.
document.getElementById('rsvp-form').addEventListener('submit',e=>{e.preventDefault();const name=new FormData(e.currentTarget).get('name');document.getElementById('rsvp-note').textContent=`Thank you, ${name}! Your demo response has been received.`;e.currentTarget.reset()});

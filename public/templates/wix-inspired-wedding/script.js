
// Lightweight Three.js 3D wedding rings in the hero.
(function initWedding3D(){
  const canvas = document.getElementById('wedding-3d');
  if (!canvas || !window.THREE || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let renderer, scene, camera, rings = [], particles, frame;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha:true, antialias:true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
    renderer.setClearColor(0x000000, 0);
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(38, 1, .1, 100);
    camera.position.set(0, 0, 11);

    scene.add(new THREE.AmbientLight(0xffffff, 1.15));
    const key = new THREE.PointLight(0xffe2a6, 2.3, 30);
    key.position.set(-3, 4, 7); scene.add(key);
    const fill = new THREE.PointLight(0xffffff, 1.2, 30);
    fill.position.set(4, -2, 5); scene.add(fill);

    const gold = new THREE.MeshStandardMaterial({color:0xd9b875, metalness:.88, roughness:.2});
    const champagne = new THREE.MeshStandardMaterial({color:0xf0dfb8, metalness:.92, roughness:.16});
    const ringA = new THREE.Mesh(new THREE.TorusGeometry(1.12,.105,24,100), gold);
    const ringB = new THREE.Mesh(new THREE.TorusGeometry(1.12,.105,24,100), champagne);
    ringA.position.set(-.62,.05,0); ringB.position.set(.62,.05,-.25);
    ringA.rotation.set(.75,.35,-.45); ringB.rotation.set(.75,-.35,.45);
    scene.add(ringA,ringB); rings=[ringA,ringB];

    // Fine, softly glowing points add depth without competing with the invitation.
    const count=180, positions=new Float32Array(count*3);
    for(let i=0;i<count;i++){
      positions[i*3]=(Math.random()-.5)*13;
      positions[i*3+1]=(Math.random()-.5)*8;
      positions[i*3+2]=(Math.random()-.5)*5-1;
    }
    const geometry=new THREE.BufferGeometry();
    geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));
    const material=new THREE.PointsMaterial({color:0xe8d3a8,size:.025,transparent:true,opacity:.7});
    particles=new THREE.Points(geometry,material);scene.add(particles);

    function resize(){
      const w=canvas.clientWidth||window.innerWidth, h=canvas.clientHeight||window.innerHeight;
      renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();
    }
    resize();window.addEventListener('resize',resize,{passive:true});
    let pointerX=0,pointerY=0;
    window.addEventListener('pointermove',e=>{
      pointerX=(e.clientX/window.innerWidth-.5)*.18;
      pointerY=(e.clientY/window.innerHeight-.5)*.12;
    },{passive:true});
    const clock=new THREE.Clock();
    function animate(){
      frame=requestAnimationFrame(animate);
      const t=clock.getElapsedTime();
      rings[0].rotation.y=.35+Math.sin(t*.38)*.22;
      rings[1].rotation.y=-.35+Math.sin(t*.38+1)*.22;
      rings[0].rotation.z=-.45+Math.sin(t*.28)*.08;
      rings[1].rotation.z=.45-Math.sin(t*.28)*.08;
      rings[0].position.y=.05+Math.sin(t*.7)*.08;
      rings[1].position.y=.05+Math.sin(t*.7+1)*.08;
      scene.rotation.y+=(pointerX-scene.rotation.y)*.025;
      scene.rotation.x+=(-pointerY-scene.rotation.x)*.025;
      particles.rotation.y=t*.012;particles.rotation.x=Math.sin(t*.08)*.035;
      renderer.render(scene,camera);
    }
    animate();
    window.addEventListener('pagehide',()=>cancelAnimationFrame(frame),{once:true});
  } catch(err) {
    // Keep the page usable if WebGL is unavailable.
    canvas.style.display='none';
  }
})();

window.addEventListener('load',()=>document.getElementById('preloader').classList.add('done'));
const weddingDate=new Date('December 20, 2026 18:00:00').getTime();
function tick(){let d=Math.max(0,weddingDate-Date.now());const vals={days:Math.floor(d/86400000),hours:Math.floor(d%86400000/3600000),minutes:Math.floor(d%3600000/60000),seconds:Math.floor(d%60000/1000)};for(const [k,v] of Object.entries(vals))document.getElementById(k).textContent=String(v).padStart(k==='days'?3:2,'0')}
tick();setInterval(tick,1000);
const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
const toggle=document.querySelector('.nav-toggle'),menu=document.querySelector('.nav-menu');
toggle.addEventListener('click',()=>menu.classList.toggle('open'));
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>menu.classList.remove('open')));
document.getElementById('rsvp-form').addEventListener('submit',e=>{e.preventDefault();const name=new FormData(e.currentTarget).get('name');document.getElementById('rsvp-message').textContent=`Thank you, ${name}! This is a demo confirmation. Connect the form to your backend to store RSVPs.`;e.currentTarget.reset()});
const stage = document.querySelector(".stage");
const hint = document.querySelector("#scene-hint");

const observer = new IntersectionObserver(([entry]) => {
  if (!entry.isIntersecting) return;
  observer.disconnect();
  start().catch(() => {
    hint.textContent = "Pick a sign to explore";
  });
});
observer.observe(stage);

async function start() {
  const THREE = await import("https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js");
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 60);
  const target = new THREE.Vector3(0, 1.8, 0);

  function material(color, glow = false) {
    return glow
      ? new THREE.MeshBasicMaterial({ color })
      : new THREE.MeshStandardMaterial({ color, roughness: 0.55 });
  }

  function box(width, height, depth, x, y, z, color, glow) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material(color, glow));
    mesh.position.set(x, y, z);
    scene.add(mesh);
    return mesh;
  }

  function light(color, power, x, y, z) {
    const lamp = new THREE.PointLight(color, power, 12, 2);
    lamp.position.set(x, y, z);
    scene.add(lamp);
  }

  function label(text, color, x, y, z, width, height) {
    const canvas = document.createElement("canvas");
    canvas.width = 768;
    canvas.height = 160;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#141022";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = color;
    ctx.lineWidth = 12;
    ctx.strokeRect(15, 15, 738, 130);
    ctx.shadowColor = color;
    ctx.shadowBlur = 18;
    ctx.fillStyle = color;
    ctx.font = "bold 78px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, 384, 82);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), new THREE.MeshBasicMaterial({ map: texture }));
    mesh.position.set(x, y, z);
    scene.add(mesh);
  }

  scene.add(new THREE.HemisphereLight(0xc4aaff, 0x251b42, 1.9));
  light(0xf72fc4, 80, -3, 3.3, 4);
  light(0x22dfff, 70, 4, 3.5, 1);
  light(0x895dff, 40, 1, 4, -3);

  box(25, 0.15, 25, 0, -0.11, 0, 0x161126);
  box(5.2, 0.17, 3.8, 0.4, 0.02, 0, 0x372942);
  box(5.1, 0.03, 0.04, 0.4, 0.12, 1.88, 0xe858da, true);
  box(3.4, 2.8, 2.25, 0.85, 1.52, 0, 0x262038);
  box(3.65, 0.18, 2.48, 0.85, 2.97, 0, 0x51446b);
  box(3.63, 0.035, 0.05, 0.85, 2.99, 1.25, 0x62eaff, true);
  box(3.25, 0.58, 0.18, 0.85, 2.78, 1.24, 0x4c285a);
  label("ERIC / ARCADE", "#ff91e6", 0.85, 2.79, 1.342, 3.17, 0.55);
  const awning = box(3.6, 0.11, 0.82, 0.85, 2.37, 1.5, 0x533894);
  awning.rotation.x = 0.19;
  box(3.6, 0.035, 0.045, 0.85, 2.29, 1.9, 0xf874d9, true);
  box(2.85, 1.16, 0.07, 0.85, 1.54, 1.14, 0x130e23);
  box(2.98, 0.15, 0.47, 0.85, 0.96, 1.28, 0x503356);
  box(2.95, 0.045, 0.04, 0.85, 0.91, 1.525, 0x49dcfa, true);
  for (const [x, color] of [[0, 0x2fc8fa], [0.85, 0xef74cf], [1.7, 0xfcc775]]) {
    box(0.65, 0.81, 0.23, x, 1.42, 1.24, 0x3b2f59);
    box(0.48, 0.34, 0.04, x, 1.59, 1.38, color, true);
    box(0.4, 0.04, 0.05, x, 1.31, 1.38, color, true);
  }
  box(0.07, 0.8, 0.07, 1.9, 3.43, -0.25, 0x716284);
  box(0.5, 0.04, 0.05, 1.9, 3.8, -0.25, 0x58e5ff, true);
  box(0.09, 2.8, 0.12, -1.9, 1.51, 1.42, 0x5a4774);
  box(0.6, 0.12, 0.45, -1.9, 0.18, 1.42, 0x372943);
  box(0.72, 0.08, 0.08, -1.9, 2.85, 1.42, 0x625178);
  const lantern = new THREE.Mesh(new THREE.SphereGeometry(0.15, 20, 12), material(0xffe1fc, true));
  lantern.position.set(-2.24, 2.68, 1.42);
  scene.add(lantern);
  light(0xf766dc, 9, -2.24, 2.68, 1.42);

  const links = [...stage.querySelectorAll(".signpost a")];
  const signPositions = [2.28, 1.76, 1.24].map((y) => new THREE.Vector3(-1.9, y, 1.6));
  const projected = new THREE.Vector3();
  let angle = 0.43;
  let drag;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.domElement.setAttribute("aria-hidden", "true");

  function draw() {
    const width = stage.clientWidth;
    const height = stage.clientHeight;
    camera.aspect = width / height;
    const radius = Math.max(9.5, 10.8 / camera.aspect);
    camera.position.set(Math.sin(angle) * radius, 4.1, Math.cos(angle) * radius);
    camera.lookAt(target);
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
    const signTops = signPositions.map((point) => (1 - projected.copy(point).project(camera).y) * height / 2);
    signPositions.forEach((point, index) => {
      projected.copy(point).project(camera);
      const x = (projected.x + 1) * width / 2;
      const halfLink = links[index].offsetWidth / 2 + 4;
      links[index].style.left = Math.max(halfLink, Math.min(width - halfLink, x)) + "px";
      const offset = (index - 1) * Math.max(46, (signTops[2] - signTops[0]) / 2);
      links[index].style.top = (signTops[1] + offset) + "px";
    });
  }

  function resize() {
    renderer.setSize(stage.clientWidth, stage.clientHeight, false);
    draw();
  }

  renderer.domElement.addEventListener("pointerdown", (event) => {
    if (!event.isPrimary || event.button !== 0) return;
    drag = { id: event.pointerId, x: event.clientX, angle };
    renderer.domElement.setPointerCapture(event.pointerId);
  });
  renderer.domElement.addEventListener("pointermove", (event) => {
    if (event.pointerId !== drag?.id) return;
    angle = Math.max(-0.58, Math.min(0.86, drag.angle + (drag.x - event.clientX) * 0.008));
    draw();
  });
  renderer.domElement.addEventListener("lostpointercapture", () => { drag = undefined; });
  stage.prepend(renderer.domElement);
  stage.classList.add("is-3d");
  new ResizeObserver(resize).observe(stage);
  resize();
  hint.textContent = "Drag to look around • Pick a sign to explore";
}

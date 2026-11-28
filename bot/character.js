import * as T from './three.module.js';

export function mountCharacter(host) {
  const shadow = host.shadowRoot;
  const stage = shadow.querySelector('.holo-stage');
  const orb = stage.querySelector('.launcher-glow');
  const launcher = orb.querySelector('.launcher');
  const dialog = shadow.querySelector('dialog');
  const sceneBox = document.createElement('div');
  sceneBox.className = 'anna-character';
  sceneBox.setAttribute('role', 'img');
  sceneBox.setAttribute('aria-label', 'Объёмная фигурка помощницы Анакам');
  const renderer = new T.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.45;
  sceneBox.append(renderer.domElement);

  const css = document.createElement('style');
  css.textContent =`
    :host([data-character-preview]) .holo-stage {
      grid-template-columns: minmax(0, 1.3fr) minmax(0, .9fr);
      gap: clamp(24px, 4vw, 70px);
    }
    :host([data-character-preview]) .holo-stage::after {display:none}
    .anna-pair {display:grid; grid-template-columns:minmax(0, .74fr) minmax(0, 1fr);
      align-items:center; width:100%}
    .anna-character {width:100%; aspect-ratio: .61; position:relative;
      background:radial-gradient(ellipse at 50% 80%, #25677b45, transparent 65%)}
    .anna-character canvas {display:block; width:100%; height:100%}
    :host([data-layout="home"][data-character-preview]) .launcher-glow {
      width:100%; height:auto; aspect-ratio:1; container-type:inline-size}
    @media(max-width: 850px) {
      :host([data-character-preview]) .holo-stage {grid-template-columns:minmax(0,1fr)}
      .anna-pair {max-width:540px}
    }
    .anna-pair .launcher {transition: box-shadow .22s, border-color .22s}
    .anna-pair .launcher[data-inviting] {border-color:#a5ffef; box-shadow:inset 0 0 32px #69ffe940, 0 0 30px #46f3e86a}
    .anna-pair .launcher[data-inviting]::after {inset:3%; background:radial-gradient(circle at var(--shine-x, 50%) var(--shine-y, 50%), #8cfff860, transparent 48%)}
    .anna-pair .launcher[data-inviting] .launcher-cta {color:#e1fff8; text-shadow:0 0 10px #66ffce}
    @media(prefers-reduced-motion: reduce) {.anna-pair .launcher {transition:none}}
    :host([data-character-preview]) .launcher:focus-visible {
      outline-offset:-5px;
    }
  `;
  const pair = document.createElement('div');
  pair.className = 'anna-pair';
  orb.before(pair);
  pair.append(sceneBox, orb);
  shadow.append(css);
  host.dataset.characterPreview = '';
  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(31, 1, .1, 30);
  camera.position.set(.12, 1.82, 7.65);
  camera.lookAt(.12, 1.62, 0);
  scene.add(new T.HemisphereLight(0xd5f4ff, 0x5b3a63, 2.15));
  for (const [color, intensity, position] of [
    [0xffe7d3, 3.2, [3, 5, 5]],
    [0x38ffde, 4.4, [-3, 2, -2]],
    [0x688aff, 3.3, [3, 3, -3]],
  ]) {
    const light = new T.DirectionalLight(color, intensity);
    light.position.set(...position);
    scene.add(light);
  }
  const { figure, head, shoulder, elbow, finger } = makeFigure();
  scene.add(figure);

  const platform = new T.Mesh(new T.CylinderGeometry(.76, .8, .05, 64), material(0x133141, .55));
  platform.position.y = -.02;
  scene.add(platform);
  const rim = new T.Mesh(new T.TorusGeometry(.75, .011, 10, 68), new T.MeshBasicMaterial({ color: 0x69ffe1 }));
  rim.rotation.x = Math.PI / 2;
  rim.position.y = .01;
  scene.add(rim);

  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let visible = false;
  let frame = 0;
  let yaw = 0;
  let pitch = 0;
  let nod = -Infinity;
  let previous = 0;
  let hovering = launcher.matches(':hover') && matchMedia('(any-hover: hover)').matches;
  let pointing = 0;
  const render = (time) => {
    frame = 0;
    if (!visible) return;
    const step = 1 - Math.exp(-Math.min(time - previous, 48) / 105);
    previous = time;
    const sinceNod = (time - nod) / 650;
    const greeting = sinceNod < 1 ? Math.sin(sinceNod * Math.PI) * .25 : 0;
    const inviting = !dialog.open && (hovering || launcher.matches(':focus-visible'));
    launcher.toggleAttribute('data-inviting', inviting);
    const targetPointing = inviting ? 1 : 0;
    pointing = T.MathUtils.lerp(pointing, targetPointing, motion.matches ? 1 : step);
    shoulder.rotation.z = .16 + pointing * 1.26;
    elbow.rotation.z = .33 * pointing;
    finger.scale.y = .025 + pointing * .056;
    finger.position.y = -.35 - pointing * .039;
    const targetYaw = motion.matches ? 0 : inviting ? .4 : yaw;
    const targetPitch = motion.matches ? 0 : (inviting ? .10 : pitch) + greeting;
    head.rotation.y = T.MathUtils.lerp(head.rotation.y, targetYaw, step);
    head.rotation.x = T.MathUtils.lerp(head.rotation.x, targetPitch, step);
    figure.rotation.y = .09 + head.rotation.y * .19;
    renderer.render(scene, camera);
    if ((!motion.matches && greeting > 0) || Math.abs(pointing - targetPointing) > .001 ||
        Math.abs(head.rotation.y - targetYaw) + Math.abs(head.rotation.x - targetPitch) > .001) wake();
  };
  function wake() {
    if (!frame && visible) {
      if (!previous) previous = performance.now() - 16;
      frame = requestAnimationFrame(render);
    }
  }
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (!visible) previous = 0;
    wake();
  }).observe(sceneBox);
  new ResizeObserver(([entry]) => {
    const { width, height } = entry.contentRect;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    wake();
  }).observe(sceneBox);
  stage.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch') return;
    const bounds = sceneBox.getBoundingClientRect();
    yaw = T.MathUtils.clamp((event.clientX - bounds.left - bounds.width / 2) / 420, -.36, .42);
    pitch = T.MathUtils.clamp((event.clientY - bounds.top - bounds.height * .25) / 750, -.16, .22);
    wake();
  });
  stage.addEventListener('pointerleave', () => {
    yaw = pitch = 0;
    wake();
  });
  launcher.addEventListener('pointerenter', event => {
    if (event.pointerType === 'touch') return;
    hovering = true;
    wake();
  });
  launcher.addEventListener('pointermove', event => {
    if (!hovering || motion.matches) return;
    const bounds = launcher.getBoundingClientRect();
    launcher.style.setProperty('--shine-x', ((event.clientX - bounds.left) / bounds.width * 100) + '%');
    launcher.style.setProperty('--shine-y', ((event.clientY - bounds.top) / bounds.height * 100) + '%');
  });
  launcher.addEventListener('pointerleave', () => {
    hovering = false;
    wake();
  });
  launcher.addEventListener('focus', wake);
  launcher.addEventListener('blur', wake);
  dialog.addEventListener('close', wake);
  launcher.addEventListener('click', () => {
    nod = performance.now();
    wake();
  });
  motion.addEventListener('change', wake);

}

function material(color, metalness = 0, roughness = .38) {
  return new T.MeshStandardMaterial({ color, metalness, roughness });
}

function makeFigure() {
  const figure = new T.Group();
  const head = new T.Group();
  const skin = material(0xd89170);
  const hair = material(0x251828, .16);
  const hairGlint = material(0x58324a, .28);
  const jacket = material(0x163a47, .35);
  const trousers = material(0x172530, .16);
  const sole = material(0x273746, .35);
  const teal = new T.MeshStandardMaterial({color:0x6beee4, emissive:0x166a69});
  const white = material(0xffeddf);
  const iris = material(0x428382);
  const dark = material(0x211622);
  const lip = material(0x8d423d);
  const ball = new T.SphereGeometry(1, 32, 24);

  function oval(parent, mat, position, size, roll = 0) {
    const part = new T.Mesh(ball, mat);
    part.position.set(...position);
    part.scale.set(...size);
    part.rotation.z = roll;
    parent.add(part);
    return part;
  }
  function line(parent, mat, points, radius) {
    const curve = new T.CatmullRomCurve3(points.map(point => new T.Vector3(...point)));
    const mesh = new T.Mesh(new T.TubeGeometry(curve, 22, radius, 8, false), mat);
    parent.add(mesh);
  }

  for (const sign of [-1, 1]) {
    const x = sign * .17;
    oval(figure, trousers, [x, .62, 0], [.153, .65, .15], sign * .044);
    oval(figure, sole, [x, .13, .12], [.16, .125, .26]);
    line(figure, teal, [[x - .10,.105,.315], [x,.10,.36], [x + .10,.105,.315]], .01);
  }
  oval(figure, trousers, [0, 1.2, 0], [.34, .23, .205]);
  oval(figure, jacket, [0, 1.62, 0], [.405, .51, .235]);
  oval(figure, dark, [0, 1.85, .18], [.14, .19, .075]);
  line(figure, teal, [[-.09,1.93,.222], [0,1.82,.253], [.015,1.26,.18]], .012);
  oval(figure, jacket, [-.385, 1.62, -.005], [.131, .35, .138], -.22);
  oval(figure, jacket, [-.46, 1.28, .021], [.109, .255, .11], -.17);
  oval(figure, skin, [-.493, 1.08, .036], [.075, .108, .075], -.13);
  oval(figure, teal, [-.47, 1.16, .033], [.102, .025, .111]);

  // Pivot the sleeve at the shoulder and elbow so the hand follows the gesture.
  const shoulder = new T.Group();
  shoulder.position.set(.345, 1.92, 0);
  figure.add(shoulder);
  oval(shoulder, jacket, [0, -.24, 0], [.131, .36, .138]);
  const elbow = new T.Group();
  elbow.position.set(0, -.48, .018);
  shoulder.add(elbow);
  oval(elbow, jacket, [0, -.105, 0], [.109, .21, .11]);
  oval(elbow, teal, [0, -.24, 0], [.101, .025, .111]);
  oval(elbow, skin, [0, -.304, 0], [.073, .077, .063]);
  const finger = oval(elbow, skin, [.032, -.35, .015], [.025, .025, .026]);
  oval(figure, skin, [0, 2.03, .025], [.146,.19,.13]);
  head.position.set(0, 2.10, 0);
  figure.add(head);
  oval(head, hair, [0,.54,-.145], [.50,.58,.385]);
  oval(head, skin, [0,.44,.063], [.399,.464,.326]);
  for (const sign of [-1, 1]) {
    const x = sign * .375;
    oval(head, skin, [x,.425,.064], [.062,.105,.075]);
    oval(head, teal, [sign * .405,.356,.129], [.026,.037,.022]);
    oval(head, hair, [sign * .397,.55,-.04], [.126,.47,.199], sign * .08);
    oval(head, hair, [sign * .386,.245,-.11], [.135,.34,.184], sign * .11);
    const eyeX = sign * .156;
    oval(head, dark, [eyeX,.49,.343], [.108,.071,.033], sign * .075);
    oval(head, white, [eyeX,.482,.367], [.091,.055,.024], sign * .075);
    oval(head, iris, [eyeX,.485,.388], [.038,.048,.015]);
    oval(head, dark, [eyeX,.485,.401], [.020,.027,.009]);
    oval(head, white, [eyeX-.01,.501,.41], [.011,.013,.006]);
    line(head, hair, [[eyeX-.079,.587,.336],[eyeX,.606,.364],[eyeX+.074,.585,.347]], .014);
  }
  oval(head, skin, [0,.384,.389], [.065,.084,.057]);
  line(head, lip, [[-.087,.268,.342],[0,.249,.368],[.085,.272,.346]], .012);
  oval(head, hair, [-.18,.798,.127], [.34,.201,.285], .40);
  oval(head, hair, [.218,.751,.146], [.235,.17,.232], -.52);
  line(head, hairGlint, [[-.366,.674,.24],[-.281,.822,.35],[-.065,.929,.28],[.078,.929,.199]], .017);
  line(head, hairGlint, [[.157,.908,.20],[.337,.804,.28],[.447,.619,.137],[.443,.345,.079]], .014);
  return { figure, head, shoulder, elbow, finger };
}

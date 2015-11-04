/* globals THREE, ClusterFactory */

// @todo Implement timeSpeedFunction

(function(rootScope) {

  'use strict';

  var scene;
  var camera;
  var renderer;
  var lights;
  var time;

  var mouseX = 0;
  var mouseY = 0;

  var windowHalfX = window.innerWidth / 2;
  var windowHalfY = window.innerHeight / 2;

  var app = rootScope.getKLU5TER();
  var orbit;

  app.opacityAdd = 0.3;
  app.isManualMode = true;
  app.isDebug = false;

  app.cluster = {
    config: {
      segments: 8,
      levels: 5,
      circles: 3,
      segmentsSpacing: 0.96,
      levelsSpacing: 1.2,
      height: 10,
      radius: 10
    }
  };

  app.ringOptions = {
    x: 0,
    y: 0,
    z: 0,
    segments: 8,
    innerRadius: 9,
    outerRadius: 10,
    phiSegments: 3,
    thetaStart: 0,
    thetaLength: Math.PI * 2
  };

  app.cameraSettings = {
    FOV: 95,
    antialias: !app.isDebug,
    position: {
      z: 28
    }
  };

  app.controls = {
    level: {
      val: 0.1
    },
    segment: {
      val: 2.7
    },
    circle: {
      val: 4
    }
  };

  app.initializeControls();

  app.materialFactory = new MaterialFactory(app);
  app.materialFactory.init();

  initScene();
  initOrbit();
  initLights();

  app.scene = scene;
  app.camera = camera;
  app.renderer = renderer;
  app.lights = lights;

  app.clusterFactory = new ClusterFactory(app);
  var clusterAxis = app.clusterFactory.createCluster(app.cluster.config);

  app.animator = new KlusterAnimator();
  app.animator.startAnimator();

  scene.add(app.factories.cube.getCube(0, 0, 0, 1, 1, 1));
  scene.add(app.factories.cube.getCube(0, 0, 10, 1, 1, 1));
  scene.add(app.factories.cube.getCube(0, 10, 0, 1, 1, 1));
  scene.add(app.factories.cube.getCube(10, 0, 0, 1, 1, 1));
  // textFactory(app);

  function initScene() {
    // scene
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 250, 1400);

    if (app.isDebug) {
      scene.add(new THREE.AxisHelper(30));
    }
    // scene.add(new THREE.GridHelper(100,10));

    // camera
    camera = new THREE.PerspectiveCamera(app.cameraSettings.FOV, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.x = app.cameraSettings.position.z;

    // renderer
    renderer = new THREE.WebGLRenderer({
      antialias: app.cameraSettings.antialias
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(scene.fog.color);
    renderer.setPixelRatio(window.devicePixelRatio);

    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('touchstart', onDocumentTouchStart, false);
    document.addEventListener('touchmove', onDocumentTouchMove, false);

    document.body.appendChild(renderer.domElement);
  }

  function initOrbit() {
    orbit = new THREE.OrbitControls(camera, renderer.domElement);
    orbit.enableZoom = true;
    // orbit.autoRotate = true;
    // orbit.autoRotate: = true;

    // orbit.enableDamping = true;
    // orbit.dampingFactor = 0.25;
    // orbit.enableZoom = false;
  }

  function initLights() {
    var ambientLight = new THREE.AmbientLight(0x000000);
    scene.add(ambientLight);

    lights = [];
    lights[0] = new THREE.PointLight(0xffffff, 1, 0);
    lights[1] = new THREE.PointLight(0xffffff, 1, 0);
    lights[2] = new THREE.PointLight(0xffffff, 1, 0);
    lights[0].position.set(0, 200, 0);
    lights[1].position.set(100, 200, 100);
    lights[2].position.set(-100, -200, -100);

    scene.add(lights[0]);
    scene.add(lights[1]);
    scene.add(lights[2]);
  }

  function onDocumentMouseMove(event) {
    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;
    // tracePos();
  }

  function onDocumentTouchStart(event) {
    if (event.touches.length > 1) {
      event.preventDefault();
      mouseX = event.touches[0].pageX - windowHalfX;
      mouseY = event.touches[0].pageY - windowHalfY;
    }
  }

  function onDocumentTouchMove(event) {
    if (event.touches.length == 1) {
      event.preventDefault();
      mouseX = event.touches[0].pageX - windowHalfX;
      mouseY = event.touches[0].pageY - windowHalfY;
    }
  }

  function render() {
    requestAnimationFrame(render);
    orbit.update();
    time = Date.now() * 0.001;
    clusterAxis.onRender();

    // var dX = ( mouseX - camera.position.x ) * 1;
    var dY = (-mouseY - 200 - camera.position.y) * 1;
    // camera.position.x += dX;
    // camera.position.y += dY;

    camera.lookAt( scene.position );
    // camera.lookAt( cluster.position );

    // console.log(orbit);

    TWEEN.update();
    renderer.render(scene, camera);
  }

  function tracePos() {
    console.log(
      JSON.stringify(clusterAxis.rotation),
      JSON.stringify(clusterAxis.position),
      JSON.stringify(camera.position)
    );

    // clusterAxis.rotation.x += 0.0005;// + speed;
    // clusterAxis.rotation.x = (10 / app.controls.level.val) * (Math.PI / 4) + rotationX;
    // clusterAxis.rotation.y = (10 / app.controls.segment.val) * (Math.PI / 4) + rotationY;
    // clusterAxis.rotation.z = rotationZ;

    // ring3.rotation.x = rotationX + speed;
    // ring3.rotation.y = rotationY + rand;

    // ring2.rotation.x = rotationY;
    // ring2.rotation.y = rotationX + speed + rand;
  }

  render();

})(this);

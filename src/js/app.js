/* globals THREE, TWEEN, ClusterFactory, MaterialFactory, KlusterAnimator, console */

/**
 * Kluster main application
 * @todo Dynamic (Text) Labels. 
 * @todo Dynamic Chunks. May generate chunks only located to some rotation angle or length.
 * @todo Cubic Model. More illustrative
 * @todo Invisible Circle(s)
 * @todo Variable segment length
 * @todo Percentage-based length of the segment
 * @todo Pie chart-alike
 * @todo Level can have its subdivisions
 * @todo Each metrioc can be subdivided
 */

(function(rootScope) {

  'use strict';

  var app = rootScope.getKLU5TER();

  app.opacityAdd = 0.3;
  app.isManualMode = true;
  app.changeStateOnMouseOver = false;
  app.isDebug = false;

  app.clusterConfig = {
    levels: 2,
    segments: 40,
    circles: 5,
    segmentsSpacing: 0.96,
    levelsSpacing: 1.2,
    height: 10,
    radius: 10
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
      val: app.clusterConfig.levels
    },
    segment: {
      val: app.clusterConfig.segments
    },
    circle: {
      val: app.clusterConfig.circles
    }
  };

  var scene;
  var camera;
  var renderer;
  var lights;
  var time;

  var mouseX = 0;
  var mouseY = 0;

  var windowHalfX = window.innerWidth / 2;
  var windowHalfY = window.innerHeight / 2;

  var orbit;

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
  var clusterAxis = app.clusterFactory.createCluster(app.clusterConfig);

  app.animator = new KlusterAnimator();
  app.animator.startAnimator();

  var hcWidth = 0.33;
  scene.add(app.factories.cube.getCube(0, 0, 0, hcWidth, hcWidth, hcWidth, 0xffffff));
  scene.add(app.factories.cube.getCube(20, 0, 0, hcWidth, hcWidth, hcWidth, 0xff0000));
  scene.add(app.factories.cube.getCube(0, 20, 0, hcWidth, hcWidth, hcWidth, 0x00ff00));
  scene.add(app.factories.cube.getCube(0, 0, 20, hcWidth, hcWidth, hcWidth, 0x0000ff));
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
    // var dY = (-mouseY - 200 - camera.position.y) * 1;
    // camera.position.x += dX;
    // camera.position.y += dY;

    camera.lookAt(scene.position);
    // camera.lookAt( cluster.position );

    TWEEN.update();
    renderer.render(scene, camera);
  }

  function tracePos() {
    var str = JSON.stringify(clusterAxis.rotation, ['_x', '_y', '_z']) + ', ' + JSON.stringify(clusterAxis.position) + ', ' + JSON.stringify(camera.position);
    str = str.replace(/"/g, '');
    console.log(str);
  }

  app.tracePos = tracePos;

  render();

})(this);
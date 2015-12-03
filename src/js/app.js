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

  // Screensaver mode 
  app.autoPlayIsOn = false;
  app.opacityAdd = 0.2;
  app.isManualMode = false;
  app.changeStateOnMouseOver = false;
  app.mouseSelectionIsOn = false;
  app.isDebug = false;

  // Kluster Looks like this
  app.clusterOptions = {
    levels: 7,
    segments: 16,
    circles: 3,
    segmentsSpacing: 0.98,
    levelsSpacing: 1.03,
    ringSpacing: 0.98,
    // segmentsSpacing: 0.96,
    // levelsSpacing: 1,
    // ringSpacing: 0.96,
    height: 30,
    radius: 30,
    extrudePathBiasX: 1,
    extrudePathBiasY: 1
  };

  app.cameraSettings = {
    FOV: 75,
    antialias: !app.isDebug,
    position: {
      z: 28
    }
  };

  app.controls = {
    level: {
      val: app.clusterOptions.levels
    },
    segment: {
      val: app.clusterOptions.segments
    },
    circle: {
      val: app.clusterOptions.circles
    }
  };

  var scene;
  var camera;
  var renderer;
  var lights;

  var mouseX = 0;
  var mouseY = 0;

  var windowHalfX = window.innerWidth / 2;
  var windowHalfY = window.innerHeight / 2;

  var orbit;

  var klusterModel = new app.KlusterModel();
  app.klusterModel = klusterModel;  

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

  app.textFactory = textFactory(app);
  app.mouseControl = mouseControl(app);

  app.clusterFactory = new ClusterFactory(app);

  var clusterAxis = app.clusterFactory.createCluster(app.clusterOptions);
  app.scene.add(clusterAxis);

  app.animator = new KlusterAnimator();
  app.animator.startAnimator();

  var hcWidth = app.isDebug ? 0.99 : 0.33;
  scene.add(app.factories.cube.getCube(0, 0, 0, hcWidth, hcWidth, hcWidth, 0xffffff));
  scene.add(app.factories.cube.getCube(20, 0, 0, hcWidth, hcWidth, hcWidth, 0xff0000));
  scene.add(app.factories.cube.getCube(0, 20, 0, hcWidth, hcWidth, hcWidth, 0x00ff00));
  scene.add(app.factories.cube.getCube(0, 0, 20, hcWidth, hcWidth, hcWidth, 0x0000ff));
 
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

    TWEEN.update();

    clusterAxis.onRender();

    camera.lookAt(scene.position);

    if ( app.autoPlayIsOn === true ) {
      // it used to tweal slightly scenee rotation, may be still helpful
      var dX = ( mouseX - camera.position.x ) * 1;
      var dY = (-mouseY - 200 - camera.position.y) * 1;
      scene.rotation.x += dX / 100000;
      scene.rotation.y += dY / 100000;
      scene.rotation.z -= dX / 200000;
    }

    // app.mouseControl.onRender( [app.clusterAxis], false);

    renderer.render(scene, camera);
  }

  /**
   * @todo trace / save additionally 
    - cluster options:
      - levels
      - segments
      - circles
    - hilite state
    - materials config
   */
  function tracePos() {
    var delim = '  ';
    var clusterAxisPosition = 'clusterAxisPosition: ' + JSON.stringify(clusterAxis.position, null, delim);
    var clusterAxisRotation = 'clusterAxisRotation: ' + JSON.stringify(clusterAxis.rotation, ['_x', '_y', '_z'], delim);
    var cameraPosition = 'cameraPosition: ' + JSON.stringify(camera.position, null, delim);
    var clusterOptions = 'clusterOptions: ' + JSON.stringify(app.clusterOptions, null, delim);

    // levelMin=1, levelMax=5.17, thetaMin=5.89, thetaMax=6.27, innerRadius=0, outerRadius=10.42
    var str = '{' + clusterAxisPosition + ', ' + clusterAxisRotation + ', ' + cameraPosition + ', ' + clusterOptions + '}';
    // remove double qoutes, because on next step this string is going back to JS code
    str = str.replace(/"/g, '');
    console.log(str);
  }

  app.tracePos = tracePos;

  render();

})(this);
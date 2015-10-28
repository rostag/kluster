// main.js

/* globals THREE */

'use strict';

(function( rootScope ) {

	var scene;
	var camera;
	var renderer;
	var lights;

	var stepIncrease = 0;
	var stepIncreaseStep = 0.01;
	var rotationSpeedX = 0.01 + stepIncrease;
	var rotationSpeedY = 0.001 + stepIncrease;

	var gui;

	var time;

	var ring;

	var app = rootScope.getGlClusterApp();

	initScene();
	initOrbit();
	initLights();

	ring = ringFactory(app);
	scene.add(ring);

	scene.add(app.factories.cube.getCube());
	// textFactory(app);

	app.scene = scene;
	app.camera = camera;
	app.renderer = renderer;
	app.lights = lights;

	function initScene() {
		// gui = new dat.GUI();

		// scene 
		scene = new THREE.Scene();
		scene.fog = new THREE.Fog(0x000000, 250, 1400);

		// camera
		camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 50);
		camera.position.z = 20;

		// renderer
		renderer = new THREE.WebGLRenderer({
			antialias: true
		});

		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setClearColor(scene.fog.color);
		renderer.setPixelRatio(window.devicePixelRatio);

		document.body.appendChild(renderer.domElement);
	}

	function initOrbit() {
		var orbit = new THREE.OrbitControls(camera, renderer.domElement);
		orbit.enableZoom = true;
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

	function render() {
		requestAnimationFrame(render);

		time = Date.now() * 0.001;

		// console.log(time, ring);

		ring.rotation.x += rotationSpeedX;
		ring.rotation.y += rotationSpeedY;

		renderer.render(scene, camera);

		stepIncrease += stepIncreaseStep;
	}	

	render();

})( this );
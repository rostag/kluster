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

	var ringOptions = {
		radius: 10,
		x: 0,
		y: 0,
		z: 0,
		segments: 16,
		radius: 10,
		inner: 0.05
	};

	var ringFactory = new RingFactory(app);
	ring = ringFactory.createRing(ringOptions);

	scene.add( ring );

	// ringOptions.z = 10;

	var ring2 = ringFactory.createRing( ringOptions );

	scene.add(ring2);

	// scene.add(app.factories.cube.getCube());
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
		camera = new THREE.PerspectiveCamera(130, window.innerWidth / window.innerHeight, 0.1, 50);
		camera.position.z = 0.1;

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

	var speed = 0.0007;

	function render() {
		requestAnimationFrame(render);

		time = Date.now() * 0.001;

		speed += 0.00001;

		var rand = Math.random() * 0.001;

		// console.log(time, ring);

		ring.rotation.x += rotationSpeedX + speed;
		ring.rotation.y += rotationSpeedY + rand;

		ring2.rotation.x += rotationSpeedY;
		ring2.rotation.y -= rotationSpeedX + speed + rand;

		// ring2.rotation.x += rotationSpeedX;
		// ring2.rotation.y -= rotationSpeedY * 2;

		renderer.render(scene, camera);

		stepIncrease += stepIncreaseStep;
	}	

	render();

})( this );
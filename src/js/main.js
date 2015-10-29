// main.js

/* globals THREE */

'use strict';

(function(rootScope) {

	var scene;
	var camera;
	var renderer;
	var lights;

	var gui;
	var time;

	var app = rootScope.getGlClusterApp();

	initScene();
	initOrbit();
	initLights();

	app.scene = scene;
	app.camera = camera;
	app.renderer = renderer;
	app.lights = lights;

	var clusterFactory = new ClusterFactory(app);
	var cluster = clusterFactory.createCluster( {segments: 10, levels: 10, circles: 3});

	scene.add(cluster);

	// scene.add(app.factories.cube.getCube());
	// textFactory(app);

	function initScene() {

		// gui = new dat.GUI();

		// scene 
		scene = new THREE.Scene();
		scene.fog = new THREE.Fog(0x000000, 250, 1400);

		// camera
		camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 50);
		camera.position.z = 18;

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

		cluster.onRender();
		renderer.render(scene, camera);
	}

	render();

})(this);
/* globals THREE, ClusterFactory */

'use strict';

(function(rootScope) {

	var scene;
	var camera;
	var renderer;
	var lights;

	var time;

	var app = rootScope.getGlClusterApp();

	app.cluster = {
		config: {
			height: 10,
			radius: 10,
			segments: 5,
			levels: 5,
			circles: 3
		}
	};

	app.ringOptions = {
		x: 0,
		y: 0,
		z: 0,
		segments: 40,
		radius: 10,
		inner: 9
	};

	app.cameraSettings = {
		FOV: 75,
		position: {
			z: 10
		}
	};

	app.phongMaterial = new THREE.MeshPhongMaterial({
		color: 0x156289,
		emissive: 0x072534,
		side: THREE.DoubleSide,
		shading: THREE.FlatShading,
		transparent: true,
		opacity: 0.3
	});	

	app.phongCylinderMaterial = new THREE.MeshPhongMaterial({
		color: 0x159269,
		emissive: 0x074524,
		side: THREE.DoubleSide,
		shading: THREE.FlatShading,
		transparent: true,
		opacity: 0.2
	});

	app.lineMaterial = new THREE.LineBasicMaterial({
		color: 0xffffff,
		transparent: true,
		opacity: 0.08
	});

	app.mainLineMaterial = new THREE.LineBasicMaterial({
		color: 0xffffff,
		transparent: true,
		opacity: 0.01
	});

	app.material = new THREE.MeshBasicMaterial({
		color: 0x62989cf
	});


	initScene();
	initOrbit();
	initLights();

	app.scene = scene;
	app.camera = camera;
	app.renderer = renderer;
	app.lights = lights;

	var clusterFactory = new ClusterFactory(app);
	var cluster = clusterFactory.createCluster(app.cluster.config);

	scene.add(cluster);

	// scene.add(app.factories.cube.getCube());
	// textFactory(app);

	function initScene() {
		// scene 
		scene = new THREE.Scene();
		scene.fog = new THREE.Fog(0x000000, 250, 1400);

		// camera
		camera = new THREE.PerspectiveCamera(app.cameraSettings.FOV, window.innerWidth / window.innerHeight, 0.1, 1000);
		camera.position.x = app.cameraSettings.position.z;

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
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
			radius: 20,
			segments: 15,
			segmentsSpacing: 0.9,
			levels: 5,
			levelsSpacing: 1.1,
			circles: 3
		}
	};

	app.ringOptions = {
		x: 0,
		y: 0,
		z: 0,
		segments: 36,
		innerRadius: 9,
		outerRadius: 10,
		phiSegments: 3,
		thetaStart: 0,
		thetaLength: Math.PI * 2
	};

	app.cameraSettings = {
		FOV: 75,
		antialias: true,
		position: {
			z: 3
		}
	};

	new MaterialFactory( app );

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
			antialias: app.cameraSettings.antialias
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
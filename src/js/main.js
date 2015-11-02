/* globals THREE, ClusterFactory */

// @todo Implement timeSpeedFunction

'use strict';

(function(rootScope) {

	var scene;
	var camera;
	var renderer;
	var lights;
	var time;

	var mouseX = 0, mouseY = 0,

	windowHalfX = window.innerWidth / 2,
	windowHalfY = window.innerHeight / 2;

	var app = rootScope.getKLU5TER();

	app.opacityAdd = 0.8;

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
		antialias: true,
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
	var cluster = app.clusterFactory.createCluster(app.cluster.config);
	app.clusterAxis = cluster;

	app.animator = new KlusterAnimator();
	app.animator.start();

	// scene.add(app.factories.cube.getCube());
	// textFactory(app);

	function initScene() {
		// scene 
		scene = new THREE.Scene();
		scene.fog = new THREE.Fog(0x000000, 250, 1400);

		scene.add(new THREE.AxisHelper(30));
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

		document.addEventListener( 'mousemove', onDocumentMouseMove, false );
		document.addEventListener( 'touchstart', onDocumentTouchStart, false );
		document.addEventListener( 'touchmove', onDocumentTouchMove, false );

		document.body.appendChild(renderer.domElement);
	}

	var orbit;

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

	}

	function onDocumentTouchStart( event ) {
		if ( event.touches.length > 1 ) {
			event.preventDefault();

			mouseX = event.touches[ 0 ].pageX - windowHalfX;
			mouseY = event.touches[ 0 ].pageY - windowHalfY;
		}
	}

	function onDocumentTouchMove( event ) {
		if ( event.touches.length == 1 ) {
			event.preventDefault();

			mouseX = event.touches[ 0 ].pageX - windowHalfX;
			mouseY = event.touches[ 0 ].pageY - windowHalfY;
		}
	}
	
	function render() {
		requestAnimationFrame(render);

		orbit.update();

		time = Date.now() * 0.001;

		cluster.onRender();
		
		// var dX = ( mouseX - camera.position.x ) * 1;
		var dY = ( - mouseY - 200 - camera.position.y ) * 1;
		// camera.position.x += dX;
		// camera.position.y += dY;
		// camera.lookAt( scene.position );
		// camera.lookAt( cluster.position );
		
		// console.log(orbit);

		TWEEN.update();

		renderer.render( scene, camera );
	}

	render();

})(this);

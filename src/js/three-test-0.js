/* globals THREE */

'use strict';

function ringFactory() {

	var options = {};

	var cube;
	var ring;

	var stepIncrease = 0;

	var rotationSpeedX = 0.01 + stepIncrease;
	var rotationSpeedY = 0.001 + stepIncrease;

	var scene;
	var camera;
	var renderer;
	var lights;
	var gui;

	var time;

	start();

	function start() {

		initScene();
		initOrbit();
		initLights();
		// createCube();
		createRing();

		// var text = 'time:' + time;
		// // TextGeometry wrapper
		// var text3d = new THREE.TextGeometry( text, options );
		// // Complete manner
		// var textShapes = THREE.FontUtils.generateShapes( text, options );
		// console.log(textShapes);
		// var text3d = new THREE.ExtrudeGeometry( textShapes, options );

		render();
	}

	function initScene(argument) {
		// gui = new dat.GUI();

		// scene 
		scene = new THREE.Scene();

		// camera
		camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 50);
		camera.position.z = 20;

		// renderer
		renderer = new THREE.WebGLRenderer({
			antialias: true
		});
		renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(renderer.domElement);
	}

	function createCube() {
		var geometry = new THREE.BoxGeometry(1, 2, 3);
		var material = new THREE.MeshBasicMaterial({
			color: 0x00ff00
		});
		cube = new THREE.Mesh(geometry, material);
		scene.add(cube);
	}


	function createRing() {
		var geometry = new THREE.RingGeometry(1, 5, 32);
		var material = new THREE.MeshBasicMaterial({
			color: 0xffff00,
			side: THREE.DoubleSide
		});
		var phongMaterial = new THREE.MeshPhongMaterial({
				color: 0x156289,
				emissive: 0x072534,
				side: THREE.DoubleSide,
				shading: THREE.FlatShading
			});

		var lineBasicMaterial =	new THREE.LineBasicMaterial({
				color: 0xffffff,
				transparent: true,
				opacity: 0.5
			});

		ring = new THREE.Mesh(geometry, phongMaterial);

		ring.add(new THREE.LineSegments(
		 	geometry,lineBasicMaterial
		));

		scene.add(ring);
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

		ring.rotation.x += rotationSpeedX;
		ring.rotation.y += rotationSpeedY;

		renderer.render(scene, camera);

		stepIncrease += 0.01;
	}
}
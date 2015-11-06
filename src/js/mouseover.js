/* globals THREE */

(function mouseControl(app) {

	'use strict';

	var scene = app.scene;

	var camera = app.camera;

	// standard global variables
	var keyboard = new THREE.KeyboardState();

	// custom global variables
	var cube;
	var projector, mouse = {
			x: 0,
			y: 0
		},
		INTERSECTED;

	////////////
	// CUSTOM //
	////////////
	var cubeGeometry = new THREE.CubeGeometry(50, 50, 50);
	var cubeMaterial = new THREE.MeshBasicMaterial({
		color: 0x000088
	});
	cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
	cube.position.set(0, 26, 0);
	scene.add(cube);

	// initialize object to perform world/screen calculations
	projector = new THREE.Projector();

	// when the mouse moves, call the given function
	document.addEventListener('mousemove', onDocumentMouseMove, false);

	this.onRenderUpdate = onRenderUpdate;

	function onRenderUpdate() {
		// find intersections

		// create a Ray with origin at the mouse position
		//   and direction into the scene (camera direction)
		var vector = new THREE.Vector3(mouse.x, mouse.y, 1);
		projector.unprojectVector(vector, camera);
		var ray = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());

		// create an array containing all objects in the scene with which the ray intersects
		var intersects = ray.intersectObjects(scene.children);

		// INTERSECTED = the object in the scene currently closest to the camera 
		//		and intersected by the Ray projected from the mouse position 	

		// if there is one (or more) intersections
		if (intersects.length > 0) {
			// if the closest object intersected is not the currently stored intersection object
			if (intersects[0].object != INTERSECTED) {
				// restore previous intersection object (if it exists) to its original color
				if (INTERSECTED)
					INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
				// store reference to closest object as current intersection object
				INTERSECTED = intersects[0].object;
				// store color of closest object (for later restoration)
				INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
				// set a new color for closest object
				INTERSECTED.material.color.setHex(0xffff00);
			}
		} else // there are no intersections
		{
			// restore previous intersection object (if it exists) to its original color
			if (INTERSECTED)
				INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
			// remove previous intersection object reference
			//     by setting current intersection object to 'nothing'
			INTERSECTED = null;
		}


		if (keyboard.pressed('z')) {
			// do something
		}

		// controls.update();
		// stats.update();
	}

	function onDocumentMouseMove(event) {
		// the following line would stop any other event handler from firing
		// (such as the mouse's TrackballControls)
		// event.preventDefault();

		// update the mouse variable
		mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
	}

})();
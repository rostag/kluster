/* globals THREE */

function mouseControl(app) {

	'use strict';

	// standard global variables
	var scene = app.scene;

	var instance = {};

	var camera = app.camera;
	var renderer = app.renderer;

	// custom global variables
	var INTERSECTED;

	// when the mouse moves, call the given function
	document.addEventListener('mousemove', onDocumentMouseMove, false);

	var raycaster = new THREE.Raycaster(); // create once

	var mouse = new THREE.Vector2(); // create once

	instance.checkIntersection = testIntersection;

	function testIntersection(objects, recursiveFlag) {

		if (!app.mouseSelectionIsOn) {
			return;
		}

		raycaster.setFromCamera(mouse, camera);

		var intersects = raycaster.intersectObjects(objects, recursiveFlag);

		// console.log('intercected: ', intersects);

		// // INTERSECTED = the object in the scene currently closest to the camera 
		// and intersected by the Ray projected from the mouse position 	

		// if there is one (or more) intersections
		if (intersects.length > 0) {
			// if the closest object intersected is not the currently stored intersection object
			if (intersects[0].object != INTERSECTED) {
				// restore previous intersection object (if it exists) to its original color
				if (INTERSECTED) {
					// INTERSECTED.dePreSelect();
					// INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
					INTERSECTED.material = INTERSECTED.currentMaterial;

					INTERSECTED.scale.set(INTERSECTED.currentScaleX, INTERSECTED.currentScaleY, INTERSECTED.currentScaleZ);

				}
				// store reference to closest object as current intersection object
				INTERSECTED = intersects[0].object;
				// store color of closest object (for later restoration)
				// INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
				INTERSECTED.currentMaterial = INTERSECTED.material;
				// set a new color for closest object

				// INTERSECTED.preSelect();

				// var shaderMaterial = new THREE.ShaderMaterial({

				// 	uniforms: {
				// 		time: {
				// 			type: 'f',
				// 			value: 1.0
				// 		},
				// 		resolution: {
				// 			type: 'v2',
				// 			value: new THREE.Vector2()
				// 		}
				// 	},
				// 	attributes: {
				// 		vertexOpacity: {
				// 			type: 'f',
				// 			value: []
				// 		}
				// 	},
				// 	vertexShader: document.getElementById('vertexShader').textContent,
				// 	fragmentShader: document.getElementById('fragmentShader').textContent

				// });

				// INTERSECTED.material = shaderMaterial;


				INTERSECTED.currentScaleX = INTERSECTED.scale.x;
				INTERSECTED.currentScaleY = INTERSECTED.scale.y;
				INTERSECTED.currentScaleZ = INTERSECTED.scale.z;
				// INTERSECTED.material.color.setHex(0xffffff);
				INTERSECTED.material = app.cylCircleHiliter;

				app.updateChunkInfo(INTERSECTED);

				// INTERSECTED.scale.set(1.1, 1.1, 1.1);

			}
		} else // there are no intersections
		{
			// restore previous intersection object (if it exists) to its original color
			if (INTERSECTED) {
				// INTERSECTED.dePreSelect();

				// INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
				INTERSECTED.material = INTERSECTED.currentMaterial
				INTERSECTED.scale.set(INTERSECTED.currentScaleX, INTERSECTED.currentScaleY, INTERSECTED.currentScaleZ);
			}
			// remove previous intersection object reference
			//     by setting current intersection object to 'nothing'
			INTERSECTED = null;
		}
	}

	function onDocumentMouseMove(event) {

		if (!app.mouseSelectionIsOn) {
			return;
		}
		mouse.x = (event.clientX / renderer.domElement.width) * 2 - 1;
		mouse.y = -(event.clientY / renderer.domElement.height) * 2 + 1;
	}

	return instance;

}
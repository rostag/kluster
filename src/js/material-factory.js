/* global THREE */

'use strict';

function MaterialFactory (app) {

	app.phongMaterial = new THREE.MeshPhongMaterial({
		color: 0x156289,
		emissive: 0x072534,
		side: THREE.DoubleSide,
		shading: THREE.FlatShading,
		transparent: true,
		opacity: 0.08
	});	

	// Cluster Circle Line Style
	app.ringLineMaterial = new THREE.LineBasicMaterial({
		color: 0xcccccc,
		transparent: true,
		opacity: 0.01
	});

	// Cluster Circle Styles
	app.cylCircleCore = new THREE.MeshPhongMaterial({
		color: 0x254299,
		emissive: 0x173584,
		side: THREE.DoubleSide,
		shading: THREE.FlatShading,
		transparent: true,
		opacity: 0.07
	});	

	app.cylCircleMid = new THREE.MeshPhongMaterial({
		color: 0x952229,
		emissive: 0x771504,
		side: THREE.DoubleSide,
		shading: THREE.FlatShading,
		transparent: true,
		opacity: 0.05
	});	

	app.cylCircleOut = new THREE.MeshPhongMaterial({
		color: 0xa59229,
		emissive: 0x877504,
		side: THREE.DoubleSide,
		shading: THREE.FlatShading,
		transparent: true,
		opacity: 0.02
	});	

	app.phongCylinderMaterial = new THREE.MeshPhongMaterial({
		color: 0x159269,
		emissive: 0x074524,
		side: THREE.DoubleSide,
		// shading: THREE.FlatShading,
		transparent: true,
		opacity: 0.2
	});

	app.lineMaterial = new THREE.LineBasicMaterial({
		color: 0xffffff,
		transparent: true,
		opacity: 0.1
	});

	app.mainLineMaterial = new THREE.LineBasicMaterial({
		color: 0xffffff,
		transparent: true,
		opacity: 0.1
	});

	app.material = new THREE.MeshBasicMaterial({
		color: 0x62989cf
	});

}
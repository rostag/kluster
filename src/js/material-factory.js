/* global THREE */

function MaterialFactory(app) {

	'use strict';

	this.init = function() {
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
		// Hiliter
		app.cylCircleHiliter = new THREE.MeshPhongMaterial({
			color: 0xffffde,
			emissive: 0xffccf0,
			side: THREE.DoubleSide,
			shading: THREE.FlatShading,
			transparent: true,
			opacity: 0.5
		});

		// Cluster Core Circle
		app.cylCircleCore = new THREE.MeshPhongMaterial({
			color: 0x254299,
			emissive: 0x173584,
			side: THREE.DoubleSide,
			shading: THREE.FlatShading,
			transparent: true,
			opacity: 0.08 + parseFloat(app.opacityAdd)
		});

		app.cylCircleMid = new THREE.MeshPhongMaterial({
			color: 0x952229,
			emissive: 0x771504,
			side: THREE.DoubleSide,
			shading: THREE.FlatShading,
			transparent: true,
			opacity: 0.07 + parseFloat(app.opacityAdd)
		});

		// console.log(' init --- opacityAdd', app.opacityAdd);

		app.cylCircleOut = new THREE.MeshPhongMaterial({
			color: 0xa59229,
			emissive: 0x877504,
			side: THREE.DoubleSide,
			shading: THREE.FlatShading,
			transparent: true,
			opacity: 0.06 + parseFloat(app.opacityAdd)
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

		app.nullMaterial = new THREE.MeshBasicMaterial({
			color: 0x62989cf,
			transparent: true,
			opacity: 0
		});
	};
}

/* globals THREE */

'use strict';

function ringFactory(app) {

	var ring;

	createRing();

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
	}

	return ring;
}
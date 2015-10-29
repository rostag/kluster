/* globals THREE */

'use strict';

function RingFactory(app) {

	var self = this;

	this.createRing = function(options) {

		var geometry = new THREE.RingGeometry(options.inner, options.radius, options.segments);

		var phongMaterial = new THREE.MeshPhongMaterial({
			color: 0x156289,
			emissive: 0x072534,
			side: THREE.DoubleSide,
			shading: THREE.FlatShading
		});

		var lineBasicMaterial = new THREE.LineBasicMaterial({
			color: 0xffffff,
			transparent: true,
			opacity: 0.5
		});

		var ring = new THREE.Mesh(geometry, phongMaterial);

		ring.position.set(options.x, options.y, options.z);
		
		// ring2.position.set(options.x, options.y + 10, options.z + 10);

		ring.add(new THREE.LineSegments(
			geometry, lineBasicMaterial
		));

		return ring;
	}

	this.render = function () {
		// ring.position.set();
	}
}
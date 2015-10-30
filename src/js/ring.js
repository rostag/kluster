/* globals THREE */

'use strict';

function RingFactory(app) {

	this.createRing = function(options) {
		var geometry = new THREE.RingGeometry(options.inner, options.radius, options.segments);
		var ring = new THREE.Mesh(geometry, app.phongMaterial);

		ring.position.set(options.x, options.y, options.z);

		ring.add(new THREE.LineSegments(
			geometry, app.mainLineMaterial
		));

		return ring;
	};
}
/* globals THREE */

'use strict';

function RingFactory(app) {

	// RingGeometry(innerRadius, outerRadius, thetaSegments, phiSegments, thetaStart, thetaLength)

	// innerRadius — Default is 0, but it doesn't work right when innerRadius is set to 0.
	// outerRadius — Default is 50. 
	// thetaSegments — Number of segments. A higher number means the ring will be more round. Minimum is 3. Default is 8. 
	// phiSegments — Minimum is 1. Default is 8.
	// thetaStart — Starting angle. Default is 0. 
	// thetaLength — Central angle. Default is Math.PI * 2.

	this.createRing = function(options) {
		var geometry = new THREE.RingGeometry(options.innerRadius, options.outerRadius, options.segments, options.phiSegments, options.thetaStart, options.thetaLength);
		var ring = new THREE.Mesh(geometry, app.phongMaterial);

		ring.position.set(options.x, options.y, options.z);

		ring.add(new THREE.LineSegments(
			geometry, app.mainLineMaterial
		));

		return ring;
	};
}
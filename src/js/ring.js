/* globals THREE */

function RingFactory(app) {

	'use strict';

	this.createRing = function(givenOptions) {

		// Default options
		var defaultOptions = {
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

		// applied it there's no given options
		var options = givenOptions || defaultOptions;

		// RingGeometry(innerRadius, outerRadius, thetaSegments, phiSegments, thetaStart, thetaLength)
		// innerRadius — Default is 0, but it doesn't work right when innerRadius is set to 0.
		// outerRadius — Default is 50.
		// thetaSegments — Number of segments. A higher number means the ring will be more round. Minimum is 3. Default is 8.
		// phiSegments — Minimum is 1. Default is 8.
		// thetaStart — Starting angle. Default is 0.
		// thetaLength — Central angle. Default is Math.PI * 2.
		var geometry = new THREE.RingGeometry(options.innerRadius, options.outerRadius, options.segments, options.phiSegments, options.thetaStart, options.thetaLength);

		var material = options.material || app.phongMaterial;

		var ring = new THREE.Mesh(geometry, material);

		ring.position.set(options.x, options.y, options.z);

		ring.add(new THREE.LineSegments(
			geometry, app.ringLineMaterial
		));

		return ring;
	};
}
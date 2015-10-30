/* globals THREE */

'use strict';

function ClusterFactory(app) {

	var self = this;

	var rings = [];

	var clusterAxis;

	var rotationSpeedX = 0.01;
	var rotationSpeedY = 0.001;

	var speed = 0.0007;

	var ringFactory;
	var ring;
	var ring3;
	var ring2;

	// radiusTop — Radius of the cylinder at the top. Default is 20.
	// radiusBottom — Radius of the cylinder at the bottom. Default is 20.
	// height — Height of the cylinder. Default is 100.
	// radiusSegments — Number of segmented faces around the circumference of the cylinder. Default is 8
	// heightSegments — Number of rows of faces along the height of the cylinder. Default is 1.
	// openEnded — A Boolean indicating whether the ends of the cylinder are open or capped. Default is false, meaning capped.
	// thetaStart — Start angle for first segment, default = 0 (three o'clock position).
	// thetaLength — The central angle, often called theta, of the circular sector. The default is 2*Pi, which makes for a complete cylinder.
	this.getCyl = function(level, segment, circle, radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded, thetaStart, thetaLength) {
		var cylGeom = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded, thetaStart, thetaLength);
		var cyl = new THREE.Mesh(cylGeom, app.phongCylinderMaterial);
		cyl.add(new THREE.LineSegments(
			cylGeom, app.lineMaterial
		));
		cyl.translateY(level * 1.2);
		// cyls[i] = ring;
		return cyl;
	};

	this.createCluster = function(options) {
		
		var geometry = new THREE.CylinderGeometry(0.001, 0.001, options.height, 8);
		
		clusterAxis = new THREE.Mesh(geometry, app.lineMaterial);

		ringFactory = new RingFactory(app);

		var levelheight = (options.height / options.levels);

		var level;
		var segment;
		var circle;

		for (level = 0; level < options.levels; level++) {
			// for (segment = 0; segment < options.segments; segment++) {
				// for (circle = 0; circle < options.circles; circle++) {
					// ring = ringFactory.createRing(ringOptions);
					// ring.rotation.x = Math.PI / 2;
					// ring.translateZ(i * levelheight);
					// ring.scale.setX( i * (options.height / options.levels) / 10);
					// rings[i] = ring;

					// clusterAxis.add(ring);
					clusterAxis.add(this.getCyl(level * levelheight, segment, circle, options.radius, options.radius, levelheight, 62, 1, false));
				// }
			// }
		}

		ring3 = ringFactory.createRing(app.ringOptions);
		ring2 = ringFactory.createRing(app.ringOptions);
		ring3.scale.set(0.5, 0.5, 0.5);
		ring2.scale.set(0.5, 0.5, 0.5);

		clusterAxis.add(ring3);
		clusterAxis.add(ring2);

		clusterAxis.onRender = function() {

			clusterAxis.rotation.x -= 0.001 + speed;
			clusterAxis.rotation.y += 0.001 - speed;
			clusterAxis.rotation.z += 0.002 + speed;

			// console.log(time, ring);

			speed += 0.00001;

			var rand = Math.random() * 0.001;

			ring3.rotation.x += rotationSpeedX + speed;
			ring3.rotation.y += rotationSpeedY + rand;

			ring2.rotation.x += rotationSpeedY;
			ring2.rotation.y -= rotationSpeedX + speed + rand;
		};

		return clusterAxis;
	};

}
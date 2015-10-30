/* globals THREE */

'use strict';

function ClusterFactory(app) {

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
	this.getCyl = function(level, segment, circle, radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded) {

		var segmentLength = (Math.PI * 2) / radiusSegments;
		var tStart = segment * segmentLength;
		var tLength = segmentLength * app.cluster.config.segmentsSpacing;

		// console.log('tStart = ', tStart, 'tLength = ', tLength, radiusSegments);
		var cylGeom = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded, tStart, tLength);

		var cyl = new THREE.Mesh(cylGeom, app.phongCylinderMaterial);
		cyl.add(new THREE.LineSegments(
			cylGeom, app.lineMaterial
		));
		cyl.translateY(level * app.cluster.config.levelsSpacing);
		// cyls[i] = ring;

		return cyl;
	};

	this.getChunk = function(level, segment, circle, innerRadius, outerRadius, height, radiusSegments, heightSegments) {

		var segmentLength = (Math.PI * 2) / radiusSegments;
		var tStart = segment * segmentLength;
		var tLength = segmentLength * app.cluster.config.segmentsSpacing;

		var radiusStep = outerRadius / app.cluster.config.circles;

		var cylMaterial = app.cylCircleCore;

		if (circle === 1) {
			cylMaterial = app.cylCircleMid;
		} else if (circle === 2) {
			cylMaterial = app.cylCircleOut;
		}

		var ring = ringFactory.createRing({
			x: 0,
			y: 0,
			z: 0,
			innerRadius: circle * radiusStep,
			outerRadius: circle * radiusStep + radiusStep * 0.9,
			segments: 8,
			phiSegments: 100,
			thetaStart: tStart,
			thetaLength: tLength,
			// app.cylCircleCore : cylCircleCore : cylCircleCore
			material: cylMaterial
		});

		ring.translateZ(level * app.cluster.config.levelsSpacing);

		return ring;
	};

	this.createCluster = function(options) {

		var geometry = new THREE.CylinderGeometry(0.0001, 0.0001, options.height, 8);

		clusterAxis = new THREE.Mesh(geometry, app.lineMaterial);

		ringFactory = new RingFactory(app);

		var levelheight = (options.height / options.levels);

		var level;
		var segment;
		var circle;

		for (level = 0; level < options.levels; level++) {
			for (segment = 0; segment < options.segments; segment++) {
				for (circle = 0; circle < options.circles; circle++) {
					// clusterAxis.add(this.getCyl(level * levelheight, segment, circle, options.radius, options.radius, levelheight, options.segments, 1, false));
					clusterAxis.add(this.getChunk(level * levelheight, segment, circle, app.ringOptions.innerRadius, app.ringOptions.outerRadius, levelheight, options.segments, 1));
				}
			}
		}

		ring3 = ringFactory.createRing(app.ringOptions);
		ring2 = ringFactory.createRing(app.ringOptions);
		// ring3.scale.set(0.5, 0.5, 0.5);
		// ring2.scale.set(0.5, 0.5, 0.5);

		clusterAxis.add(ring3);
		clusterAxis.add(ring2);

		clusterAxis.rotation.x = Math.PI / 2;
		clusterAxis.rotation.y = -Math.PI / 2;

		clusterAxis.onRender = function() {

			clusterAxis.rotation.x += 0.0005;// + speed;
			clusterAxis.rotation.y += 0.001; // - speed;
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
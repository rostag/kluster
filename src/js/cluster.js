/* globals THREE */

'use strict';

function ClusterFactory(app) {

	var clusterAxis;

	var rotationX = 0.01;
	var rotationY = 0.01;
	var rotationZ = 0.01;

	var rotationSpeedX = 0.0001;
	var rotationSpeedY = 0.0002;
	var rotationSpeedZ = 0.0003;
	var speed = 0.0007;

	var ringFactory;
	var ring;
	var ring3;
	var ring2;
	var chunks = [];

	this.rebuildCluster = function() {
		this.deleteCluster();
		app.materialFactory.init();
		this.createCluster(app.cluster.config);
	};

	/**
	 * @todo
	 */
	function highlightKlusters(levels, segments, circles) {
		console.log('highlightKlusters: ', levels, segments, circles);
	}

	this.getChunk = function(level, segment, circle, innerRadius, outerRadius, levelheight, radiusSegments, heightSegments) {

		var segmentLength = (Math.PI * 2) / radiusSegments;
		var tStart = segment * segmentLength;
		var tLength = segmentLength * app.cluster.config.segmentsSpacing;

		var radiusStep = outerRadius / app.cluster.config.circles;

		var cylMaterial = app.cylCircleCore;
		if (circle % 2) {
			cylMaterial = app.cylCircleMid;
		} else if (circle % 3) {
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

		var radiusAvg = ((circle * radiusStep) * 2 + radiusStep * 0.9) / 2;
		var thetaAvg = tStart + tLength / 2;

		var xx = Math.sin(thetaAvg) * radiusAvg; // + THREE.Math.random16() / 4;
		var yy = Math.cos(thetaAvg) * radiusAvg; // + THREE.Math.random16() / 4;

		ring.translateZ(level * app.cluster.config.levelsSpacing);

		// //////////////////////////////////////////////////

		var closedSpline = new THREE.CatmullRomCurve3([
			new THREE.Vector3(xx, yy, level),
			new THREE.Vector3(xx, yy, level + levelheight / app.cluster.config.levelsSpacing)
		]);

		var extrudeSettings = {
			steps: 1,
			bevelEnabled: false,
			extrudePath: closedSpline
		};

		var pts = [],
			count = 14;

		// for (var i = 0; i < count; i++) {
		// 	var l = 0.08 * (circle * 5 + 1);
		// 	var a = 2 * i / count * Math.PI;
		// 	pts.push(new THREE.Vector2(Math.cos(a) * l, Math.sin(a) * l));
		// }

		// inner radius, outer radius
		var innerRadius = circle * radiusStep;
		var outerRadius = circle * radiusStep + radiusStep * 0.9;

		pts.push(new THREE.Vector2(Math.sin(tStart) * innerRadius, Math.cos(tStart) * innerRadius));
		pts.push(new THREE.Vector2(Math.sin(tStart) * outerRadius, Math.cos(tStart) * outerRadius));
		pts.push(new THREE.Vector2(Math.sin(tStart + tLength) * outerRadius, Math.cos(tStart + tLength) * outerRadius));
		pts.push(new THREE.Vector2(Math.sin(tStart + tLength) * innerRadius, Math.cos(tStart + tLength) * innerRadius));

		var shape = new THREE.Shape(pts);
		var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
		var mesh = new THREE.Mesh(geometry, cylMaterial);

		return mesh;
	};

	this.deleteCluster = function(options) {
		// chunk
		var chunk;

		// clusterAxis.add(chunk);
		for (var c = 0; c < chunks.length; c++) {
			chunk = chunks[c];
			clusterAxis.remove(chunk);
		}

		// ring3 = ringFactory.createRing(app.ringOptions);
		// ring2 = ringFactory.createRing(app.ringOptions);

		clusterAxis.remove(ring3);
		clusterAxis.remove(ring2);

		// clusterAxis = new THREE.Mesh(geometry, app.lineMaterial);
		app.scene.remove(clusterAxis);
	};

	this.createCluster = function(options) {

		var geometry = new THREE.CylinderGeometry(0.1, 0.1, options.height, 8);
		clusterAxis = new THREE.Mesh(geometry, app.lineMaterial);

		ringFactory = new RingFactory(app);

		var levelheight = (options.height / options.levels);

		var level;
		var segment;
		var circle;

		var chunk;

		for (level = 0; level < options.levels; level++) {
			for (segment = 0; segment < options.segments; segment++) {
				for (circle = 0; circle < options.circles; circle++) {
					// clusterAxis.add(this.getCyl(level * levelheight, segment, circle, options.radius, options.radius, levelheight, options.segments, 1, false));
					chunk = this.getChunk(level * levelheight, segment, circle, app.ringOptions.innerRadius, app.ringOptions.outerRadius, levelheight, options.segments, 1);
					clusterAxis.add(chunk);
					chunks.push[chunk];
				}
			}
		}

		ring3 = ringFactory.createRing(app.ringOptions);
		ring2 = ringFactory.createRing(app.ringOptions);
		// ring3.scale.set(0.5, 0.5, 0.5);
		// ring2.scale.set(0.5, 0.5, 0.5);

		clusterAxis.add(ring3);
		clusterAxis.add(ring2);

		// //////////////////////////////////////////////////

		var material = new THREE.LineBasicMaterial({
			color: 0x0000ff
		});

		clusterAxis.rotation.x = Math.PI / 2;
		// clusterAxis.rotation.y = -Math.PI / 2;
		// clusterAxis.rotation.z = -Math.PI / 2;

		clusterAxis.translateZ(	-options.height );

		clusterAxis.onRender = function() {

			speed += 0.00001;

			var rand = Math.random() * 0.001;

			// rotationX += rotationSpeedX + app.speedX * speed;
			// rotationY += rotationSpeedY + rand;
			// 
			// rotationZ += rotationSpeedZ + app.speedY * speed;
			// rotationZ += rotationSpeedZ + speed;

			// clusterAxis.rotation.x += 0.0005;// + speed;
			// clusterAxis.rotation.x = (10 / app.controls.level.val) * (Math.PI / 4) + rotationX;
			// clusterAxis.rotation.y = (10 / app.controls.segment.val) * (Math.PI / 4) + rotationY;
			// clusterAxis.rotation.z = rotationZ;

			ring3.rotation.x = rotationX + speed;
			ring3.rotation.y = rotationY + rand;

			ring2.rotation.x = rotationY;
			ring2.rotation.y = rotationX + speed + rand;
		};

		app.scene.add(clusterAxis);

		return clusterAxis;

	};
}
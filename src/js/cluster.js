/* globals THREE, console */

'use strict';

function ClusterFactory(app) {

	var self = this;

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
	var hiliters = [];

	this.rebuildCluster = function() {
		this.deleteCluster();
		app.materialFactory.init();
		this.createCluster(app.cluster.config);
	};

	// highlightKlusters( {levels: [1,5], segments:[1], circles: [1,1]});

	/**
	 * @todo
	 */
	function highlightChunk(options) {
		console.log('highlightChunk: ', options);

		var hiliterChunk = getChunk(options.level, options.segment, options.circle, app.cylCircleHiliter);

		clusterAxis.add(hiliterChunk);

		hiliters.push[hiliterChunk];
	}

	function getChunk(level, segment, circle, givenMaterial, expandFactor) {

		var e = expandFactor || 0;

		var innerRadius = app.ringOptions.innerRadius;
		var outerRadius = app.ringOptions.outerRadius;

		var lvl = level * self.options.levelheight;

		var segmentLength = (Math.PI * 2) / self.options.segments;

		var tStart = segment * segmentLength;
		var tLength = segmentLength * app.cluster.config.segmentsSpacing;

		var radiusStep = outerRadius / app.cluster.config.circles;

		var cylMaterial = app.cylCircleCore;
		if (circle % 2) {
			cylMaterial = app.cylCircleMid;
		} else if (circle % 3) {
			cylMaterial = app.cylCircleOut;
		}

		// if material is given, use it
		cylMaterial = givenMaterial || cylMaterial;

		var radiusAvg = ((circle * radiusStep) * 2 + radiusStep * 0.9) / 2;
		var thetaAvg = tStart + tLength / 2;

		var xx = Math.sin(thetaAvg) * radiusAvg; // + THREE.Math.random16() / 4;
		var yy = Math.cos(thetaAvg) * radiusAvg; // + THREE.Math.random16() / 4;

		// //////////////////////////////////////////////////

		var closedSpline = new THREE.CatmullRomCurve3([
			new THREE.Vector3(xx, yy, lvl),
			new THREE.Vector3(xx, yy, lvl + self.options.levelheight / app.cluster.config.levelsSpacing)
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

		// pts.push(new THREE.Vector2(Math.sin(tStart) * innerRadius, Math.cos(tStart) * innerRadius));
		// pts.push(new THREE.Vector2(Math.sin(tStart) * outerRadius, Math.cos(tStart) * outerRadius));
		// pts.push(new THREE.Vector2(Math.sin(tStart + tLength) * outerRadius, Math.cos(tStart + tLength) * outerRadius));
		// pts.push(new THREE.Vector2(Math.sin(tStart + tLength) * innerRadius, Math.cos(tStart + tLength) * innerRadius));

		pts.push(new THREE.Vector2(Math.sin(tStart) * innerRadius + e, Math.cos(tStart) * innerRadius + e));
		pts.push(new THREE.Vector2(Math.sin(tStart) * outerRadius + e, Math.cos(tStart) * outerRadius + e));
		pts.push(new THREE.Vector2(Math.sin(tStart + tLength) * outerRadius + e, Math.cos(tStart + tLength) * outerRadius + e));
		pts.push(new THREE.Vector2(Math.sin(tStart + tLength) * innerRadius + e, Math.cos(tStart + tLength) * innerRadius + e));

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

		clusterAxis.remove(ring3);
		clusterAxis.remove(ring2);

		// clusterAxis = new THREE.Mesh(geometry, app.lineMaterial);
		app.scene.remove(clusterAxis);
	};

	this.createCluster = function(options) {

		var geometry = new THREE.CylinderGeometry(0.1, 0.1, options.height, 8);
		clusterAxis = new THREE.Mesh(geometry, app.lineMaterial);

		ringFactory = new RingFactory(app);

		self.options = options;
		self.options.levelheight = (options.height / options.levels);

		var level;
		var segment;
		var circle;

		var chunk;

		for (level = 0; level < options.levels; level++) {
			for (segment = 0; segment < options.segments; segment++) {
				for (circle = 0; circle < options.circles; circle++) {
					chunk = getChunk(level, segment, circle);
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

		clusterAxis.translateZ(-options.height);

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

		// Hiliters
		highlightChunk({
			level: 1,
			segment: 2,
			circle: 2
		});

		app.scene.add(clusterAxis);

		return clusterAxis;

	};
}
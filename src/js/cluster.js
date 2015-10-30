/* globals THREE */

'use strict';

function ClusterFactory(app) {

	var clusterAxis;

	var rotationX = 0.01;
	var rotationY = 0.01;
	var rotationZ = 0.01;

	var rotationSpeedX = 0.01;
	var rotationSpeedY = 0.001;
	var rotationSpeedZ = 0.001;
	var speed = 0.0007;

	var ringFactory;
	var ring;
	var ring3;
	var ring2;
	var chunks = [];

	function highlightKlusters(levels, segments, circles) {
		console.log('highlightKlusters: ', levels, segments, circles);
	}

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


		// This object extrudes an 2D shape to an 3D geometry.
		// var e = THREE.ExtrudeGeometry(ring, { amount: 10 });
		// shapes — Shape or an array of shapes. 
		// options — Object that can contain the following parameters.
		// curveSegments — int. number of points on the curves
		// steps — int. number of points used for subdividing segements of extrude spline
		// amount — int. Depth to extrude the shape
		// bevelEnabled — bool. turn on bevel
		// bevelThickness — float. how deep into the original shape bevel goes
		// bevelSize — float. how far from shape outline is bevel
		// bevelSegments — int. number of bevel layers
		// extrudePath — THREE.CurvePath. 3d spline path to extrude shape along. (creates Frames if (frames aren't defined)
		// frames — THREE.TubeGeometry.FrenetFrames. containing arrays of tangents, normals, binormals
		// material — int. material index for front and back faces
		// extrudeMaterial — int. material index for extrusion and beveled faces
		// uvGenerator — Object. object that provides UV generator functions

		return ring;
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

		var geometry = new THREE.CylinderGeometry(0.0001, 0.0001, options.height, 8);

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

		// //////////////////////////////////////////////////

		var closedSpline = new THREE.SplineCurve3([
			new THREE.Vector3(0, 0, 4)
		]);

		var extrudeSettings = {
			steps: 32,
			bevelEnabled: false,
			extrudePath: closedSpline
		};

		var pts = [],
			count = 4;

		for (var i = 0; i < count; i++) {
			var l = 1;
			var a = 2 * i / count * Math.PI;
			pts.push(new THREE.Vector2(Math.cos(a) * l, Math.sin(a) * l));
		}

		var shape = new THREE.Shape(pts);

		var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

		var material = new THREE.MeshLambertMaterial({
			color: 0xb00000,
			wireframe: false
		});

		var mesh = new THREE.Mesh(geometry, material);
		clusterAxis.add(mesh);
		// //////////////////////////////////////////////////


		clusterAxis.rotation.x = Math.PI / 2;
		clusterAxis.rotation.y = -Math.PI / 2;

		clusterAxis.onRender = function() {

			speed += 0.00001;

			var rand = Math.random() * 0.001;

			rotationX += rotationSpeedX;
			rotationY += rotationSpeedY + rand;
			rotationZ += rotationSpeedZ;

			// clusterAxis.rotation.x += 0.0005;// + speed;
			clusterAxis.rotation.x = (10 / app.controls.level.val) * (Math.PI / 4) + rotationX;
			clusterAxis.rotation.y = (10 / app.controls.segment.val) * (Math.PI / 4) + rotationY;
			clusterAxis.rotation.z = (10 / app.controls.circle.val) * (Math.PI / 4) + rotationZ;

			ring3.rotation.x = rotationX + speed;
			ring3.rotation.y = rotationY + rand;

			ring2.rotation.x = rotationY;
			ring2.rotation.y = rotationX + speed + rand;
		};

		return clusterAxis;
	};
}
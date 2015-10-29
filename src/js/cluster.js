/* globals THREE */

'use strict';

function ClusterFactory(app) {

	var self = this;

	var rings = [];

	var cylinder;

	var ringOptions = {
		x: 0,
		y: 0,
		z: 0,
		segments: 16,
		radius: 10,
		inner: 0.05
	};

	var stepIncrease = 0;
	var stepIncreaseStep = 0.01;

	var rotationSpeedX = 0.01 + stepIncrease;
	var rotationSpeedY = 0.001 + stepIncrease;

	var speed = 0.0007;

	var ring3;
	var ring2;

	this.createCluster = function(options) {

		var geometry = new THREE.CylinderGeometry(0.1, 0.1, 20, 32);
		var material = new THREE.MeshBasicMaterial({
			color: 0x12389af
		});
		cylinder = new THREE.Mesh(geometry, material);

		var ring;
		var ringFactory = new RingFactory(app);

		for (var i = 0; i < options.levels; i++) {
			ring = ringFactory.createRing(ringOptions);
			ring.rotation.x = Math.PI / 2;
			ring.translateZ(1 * i);
			rings[i] = ring;

			cylinder.add(ring);
		}

		ring3 = ringFactory.createRing(ringOptions);
		ring2 = ringFactory.createRing(ringOptions);
		ring3.scale.set(0.5, 0.5, 0.5);
		ring2.scale.set(0.5, 0.5, 0.5);

		cylinder.add(ring3);
		cylinder.add(ring2);

		var clusterConfig = null;

		// (new THREE.LineSegments(
		// 	geometry, phongMaterial
		// ));

		cylinder.onRender = function() {
			cylinder.rotation.x -= 0.005;

			// console.log(time, ring);

			speed += 0.00001;

			var rand = Math.random() * 0.001;

			ring3.rotation.x += rotationSpeedX + speed;
			ring3.rotation.y += rotationSpeedY + rand;

			ring2.rotation.x += rotationSpeedY;
			ring2.rotation.y -= rotationSpeedX + speed + rand;
		};

		return cylinder;
	};

}
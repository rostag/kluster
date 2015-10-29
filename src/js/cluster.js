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

	var rotationSpeedX = 0.01;
	var rotationSpeedY = 0.001;

	var speed = 0.0007;

	var ringFactory;
	var ring;
	var ring3;
	var ring2;

	var material = new THREE.MeshBasicMaterial({
		color: 0x62989cf
	});
	
	this.createCluster = function(options) {

		var geometry = new THREE.CylinderGeometry(0.1, 0.1, options.height, 32);

		cylinder = new THREE.Mesh(geometry, material);
		
		ringFactory = new RingFactory(app);

		for (var i = 0; i < options.levels; i++) {
			ring = ringFactory.createRing(ringOptions);
			ring.rotation.x = Math.PI / 2;
			ring.translateZ( i * (options.height / options.levels));
			ring.scale.setX( i * (options.height / options.levels) / 10);
			rings[i] = ring;

			cylinder.add(ring);
		}

		ring3 = ringFactory.createRing(ringOptions);
		ring2 = ringFactory.createRing(ringOptions);
		ring3.scale.set(0.5, 0.5, 0.5);
		ring2.scale.set(0.5, 0.5, 0.5);

		cylinder.add(ring3);
		cylinder.add(ring2);

		cylinder.onRender = function() {

			cylinder.rotation.x -= 0.001 + speed;
			cylinder.rotation.z += 0.002 + speed;

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
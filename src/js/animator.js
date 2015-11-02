/* globals console, KLU5TER */

'use strict';

function KlusterAnimator() {

	var self = this;

	var app = KLU5TER;

	// var camera = app.camera;
	// p = { x, y, z, theta, phi, psi };
	function setClusterPosition(p) {
		var o = app.clusterAxis;
		new TWEEN.Tween(o.position).to({
				x: p.x,
				y: p.y,
				z: p.z
			}, 2000)
			.easing(TWEEN.Easing.Elastic.Out).start();

		new TWEEN.Tween(o.rotation).to({
				x: p.theta,
				y: p.phi,
				z: p.psi
			}, 2000)
			.easing(TWEEN.Easing.Elastic.Out).start();
	}

	function randomClusterPosition() {
		setClusterPosition({
			x: Math.random() * 8 - 4,
			y: Math.random() * 8 - 4,
			z: Math.random() * 8 - 4,
			theta: Math.random() * 2 * Math.PI,
			phi: Math.random() * 2 * Math.PI,
			psi: Math.random() * 2 * Math.PI
		});
	}

	var states = [{
		id: 1,
		time: 500,
		name: 'State 1',
		handler: function() {
			console.log('state1');

			// app.camera.translateY(5);

			randomClusterPosition();

			var camera = app.camera;

			var selectedObject = app.clusterAxis;

			// var tween = new TWEEN.Tween(camera.position).to({
			// 	x: selectedObject.position.x,
			// 	y: selectedObject.position.y,
			// 	z: 1
			// }).easing(TWEEN.Easing.Linear.None).onUpdate(function() {
			// 	camera.lookAt(camera.target);
			// }).onComplete(function() {
			// 	camera.lookAt(selectedObject.position);
			// }).start();

			// var tween = new TWEEN.Tween(camera.target).to({
			// 	x: selectedObject.position.x,
			// 	y: selectedObject.position.y,
			// 	z: 0
			// }).easing(TWEEN.Easing.Linear.None).onUpdate(function() {}).onComplete(function() {
			// 	camera.lookAt(selectedObject.position);
			// }).start();

		}
	}, {
		id: 2,
		time: 1500,
		name: 'State 2',
		handler: function() {
			console.log('state2');
			randomClusterPosition();
			// app.camera.translateY(10);
		}
	}, {
		id: 3,
		time: 2500,
		name: 'State 3',
		handler: function() {
			console.log('state3');
			randomClusterPosition();
			// app.camera.translateY(15);
			// app.camera.translateZ( 0 );
		}
	}];

	this.start = function() {
		var state;

		for (var s = 0; s < states.length; s++) {
			state = states[s];
			console.log(state.name, state.time);

			setTimeout(state.handler, state.time);
		}

	};
}
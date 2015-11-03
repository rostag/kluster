/* globals console, KLU5TER */

'use strict';

function KlusterAnimator() {

	var self = this;

	var app = KLU5TER;

	var camera = app.camera;

	var easingFunc = TWEEN.Easing.Elastic.Out;
	easingFunc = TWEEN.Easing.Circular.Out;
	easingFunc = TWEEN.Easing.Linear.None;

	// p = { x, y, z, theta, phi, psi };
	function setClusterPosition(p) {
		var o = app.clusterAxis;
		new TWEEN.Tween(o.position).to({
				x: p.x,
				y: p.y,
				z: p.z
			}, 2000)
			.easing(easingFunc).start();

		new TWEEN.Tween(o.rotation).to({
				x: p.theta,
				y: p.phi,
				z: p.psi
			}, 2000)
			.easing(easingFunc).start();
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

	var clusterPos = {
		x: 0,
		y: 0,
		z: 0,
		theta: Math.PI,
		phi: 0,
		psi: 0
	}

	var states = [{
		id: 1,
		time: 1000,
		name: 'State 1',
		handler: function() {
			clusterPos.y = 0;
			clusterPos.x += 10;
			setClusterPosition(clusterPos);
			// app.camera.translateY(5);
			// randomClusterPosition();
		}
	}, {
		id: 2,
		time: 1000,
		name: 'State 2',
		handler: function() {
			clusterPos.y = 5;
			clusterPos.theta -= Math.PI / 2;
			setClusterPosition(clusterPos);
		}
	}, {
		id: 3,
		time: 1000,
		name: 'State 3',
		handler: function() {
			clusterPos.y = 10;
			clusterPos.x -= 10;
			setClusterPosition(clusterPos);
		}
	}, {
		id: 4,
		time: 1000,
		name: 'State 4',
		handler: function() {
			clusterPos.y = 5;
			clusterPos.theta += Math.PI / 2;
			setClusterPosition(clusterPos);
		}
	}];

	this.start = function() {
		var state;

		return;

		var s = 0;

		state = states[s];

		function nextState() {

			setTimeout(function() {

				state = states[s];

				console.log(state.name, state.time);

				state.handler();

				s++;

				s = s >= states.length ? 0 : s;

				nextState();

			}, state.time);
		}

		nextState();

	};

}
/* globals console, KLU5TER */

function KlusterAnimator() {

	'use strict';

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
	};

	var animationSequence = ['1', '2', '3', '4', '6', 'STATE_STOP_ANIMATION'];

	var states = {
		'1': {
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
	}, '2': {
		id: 2,
		time: 1000,
		name: 'State 2',
		handler: function() {
			clusterPos.y = 5;
			clusterPos.theta -= Math.PI / 2;
			setClusterPosition(clusterPos);
		}
	}, '3': {
		id: 3,
		time: 1000,
		name: 'State 3',
		handler: function() {
			clusterPos.y = 10;
			clusterPos.x -= 10;
			setClusterPosition(clusterPos);
		}
	}, '4': {
		id: 4,
		time: 1000,
		name: 'State 4',
		handler: function() {
			clusterPos.y = 5;
			clusterPos.theta += Math.PI / 2;
			setClusterPosition(clusterPos);
		}
	}, 'STATE_STOP_ANIMATION': {
		id: 4,
		time: 1000,
		name: 'State 5 - Stop Animation',
		handler: function() {
			app.isManualMode = true;
		}
	}
};

	this.getStateById = function ( stateId ) {
		var state = states[stateId];
		return state;
	};

	this.setState = function (stateId) {
		var state = self.getStateById(stateId);

		if ( !state ) {
			console.log('A: State not found: ', stateId );
			return;
		}
		console.log('A: Go to State: ', state.name, state.time);
		state.handler();
	};

	this.startAnimator = function() {
		var s = 0;
		var stateId = animationSequence[s];
		var state = self.getStateById( stateId );

		self.setState(stateId);

		function nextState() {
			if ( app.isManualMode ) {
				return;
			}

			setTimeout(function() {
				stateId = animationSequence[s];
				self.getStateById( stateId );
				self.setState( stateId );
				s = s >= states.length ? 0 : ++s;
				nextState();
			}, state.time);
		}
		nextState();
	};
}

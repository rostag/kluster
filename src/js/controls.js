'use strict';

(function(rootScope) {

	var app = rootScope.KLU5TER;

	var iLevel = document.getElementById('input-level');
	var iSegment = document.getElementById('input-segment');
	var iCircle = document.getElementById('input-circle');
	var stateSelector = document.querySelectorAll('[data-state-selector] a');

	console.log(stateSelector);

	for (var l = 0; l < stateSelector.length; l++ ) {
		var link = stateSelector[l];
			console.log('' + l + '. StateSelector=' + link);
			link.addEventListener('click', function (event) {
				console.log('l:', link);
				console.log('click:', event);
			});
	}

	// stateSelector.forEach( function (link) {
	// });

	app.speedX = 0;
	app.speedY = 0;
	app.curMouseX = 0;
	app.curMouseY = 0;
	app.prevMouseX = 0;
	app.prevMouseY = 0;

	app.addControl = function(path, label, initialValue, min, max, step) {
		// app.controls.path.val = initialValue;
		app[path] = initialValue;
		var cc = document.getElementById('cControls');
		var inputRange = document.createElement('input');
		var inputLabel = document.createElement('label');
		inputRange.setAttribute('type', 'range');
		inputRange.setAttribute('min', min || 0);
		inputRange.setAttribute('max', max || 10);
		inputRange.setAttribute('step', step || 0.0001);
		inputRange.addEventListener('input', function(event) {
			var val = event.target.value;
			app[path] = val;

			// console.log(val	);
			app.clusterFactory.rebuildCluster();
		});
		inputLabel.setAttribute('for', path);
		inputLabel.innerHTML = label;
		// <p><input type="range" id="input-circle" min="1" max="10" step="0.0001" />
		// <label for="input-circle">Circle</label></p>
		cc.appendChild(inputRange);
		cc.appendChild(inputLabel);
		// console.log('add control:', path, initialValue, inputRange, label );
	};

	app.initializeControls = function() {
		iLevel.value = app.controls.level.val;
		iSegment.value = app.controls.segment.val;
		iCircle.value = app.controls.circle.val;
	};

	app.addControl('opacityAdd', 'Opacity', 0.1, 0.1, 1, 0.1);

	iLevel.addEventListener('input', function() {
		// console.log( iLevel.value );
		// app.controls.level.val = iLevel.value;
		app.cluster.config.levels = Math.ceil(iLevel.value);
		app.clusterFactory.rebuildCluster();
	});

	iSegment.addEventListener('input', function() {
		// console.log( iSegment.value );
		// app.controls.segment.val = iSegment.value;
		app.cluster.config.segments = Math.ceil(iSegment.value);
		app.clusterFactory.rebuildCluster();
	});

	iCircle.addEventListener('input', function() {
		// app.controls.circle.val = iCircle.value;
		app.cluster.config.circles = Math.ceil(iCircle.value);
		app.clusterFactory.rebuildCluster();
	});

	document.addEventListener('mousemove', function(event) {
		app.prevMouseX = app.curMouseX;
		app.prevMouseY = app.curMouseY;
		app.curMouseX = event.clientX;
		app.curMouseY = event.clientY;
		app.speedX = app.prevMouseX - app.curMouseX;
		app.speedY = app.prevMouseY - app.curMouseY;

		// console.log(app.speedX, app.speedY);
	});

})(this);

'use strict';

(function(rootScope) {

	var app = rootScope.KLU5TER;

	var iLevel = document.getElementById('input-level');
	var iSegment = document.getElementById('input-segment');
	var iCircle = document.getElementById('input-circle');

	app.speedX = 0;
	app.speedY = 0;
	app.curMouseX = 0;
	app.curMouseY = 0;
	app.prevMouseX = 0;
	app.prevMouseY = 0;

	app.initializeControls = function() {
		iLevel.value = app.controls.level.val;
		iCircle.value = app.controls.circle.val;
		iSegment.value = app.controls.segment.val;
	};

	iLevel.addEventListener('input', function() {
		// console.log( iLevel.value );

		app.controls.level.val = iLevel.value;
		// app.clusterFactory.deleteCluster();
		// app.clusterFactory.createCluster(app.cluster.config);
	});

	iSegment.addEventListener('input', function() {
		// console.log( iSegment.value );
		app.controls.segment.val = iSegment.value;
	});

	iCircle.addEventListener('input', function() {
		app.controls.circle.val = iCircle.value;
	});

	document.addEventListener('mousemove', function (event) {
		app.prevMouseX = app.curMouseX;
		app.prevMouseY = app.curMouseY;
		app.curMouseX = event.clientX;
		app.curMouseY = event.clientY;
		app.speedX = app.prevMouseX - app.curMouseX;
		app.speedY = app.prevMouseY - app.curMouseY;

		// console.log(app.speedX, app.speedY);
	});

})(this);
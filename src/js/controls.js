'use strict';

(function(rootScope) {

	var app = rootScope.KLU5TER;

	var iLevel = document.getElementById('input-level');
	var iSegment = document.getElementById('input-segment');
	var iCircle = document.getElementById('input-circle');

	app.initializeControls = function() {
		iLevel.value = app.controls.level.val;
		iCircle.value = app.controls.circle.val;
		iSegment.value = app.controls.segment.val;
	}

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

})(this);
'use strict';

(function ( rootScope ) {
	
	var app = KLU5TER;
	
	var iLevel = document.getElementById('input-level');
	var iSegment = document.getElementById('input-segment');
	var iCircle = document.getElementById('input-circle');

	iLevel.addEventListener('input', function (event) {
		// console.log( iLevel.value );

		app.controls.level.val = iLevel.value;
		// app.clusterFactory.deleteCluster();
		// app.clusterFactory.createCluster(app.cluster.config);
	})

	iSegment.addEventListener('input', function (event) {
		// console.log( iSegment.value );
		app.controls.segment.val = iSegment.value;
	})

	iCircle.addEventListener('input', function (event) {
		app.controls.circle.val = iCircle.value;
	})

})(this);

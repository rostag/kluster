/* globals THREE */

(function ( rootScope ) {

	'use strict';

	var mesh;

	var app = rootScope.getKLU5TER();

	app.factories.cube.getCube = createMesh;


	function createMesh() {
		var geometry = new THREE.BoxGeometry(1, 2, 3);
		var material = new THREE.MeshBasicMaterial({
			color: 0x00ff00
		});
		mesh = new THREE.Mesh(geometry, material);

		return mesh;
	}

	// console.log(app.factories.cube.getCube);

})( this );

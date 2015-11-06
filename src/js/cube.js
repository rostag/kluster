/* globals THREE */

(function(rootScope) {

	'use strict';

	var mesh;

	var app = rootScope.getKLU5TER();

	app.factories.cube.getCube = createMesh;

	function createMesh(x, y, z, w, h, d, clr, material) {
		
		var geometry = new THREE.BoxGeometry(w, h, d);

		var mat = material || new THREE.MeshBasicMaterial({
			color: clr || 0x62989cf,
			transparent: true,
			opacity: 0.4
		});

		mesh = new THREE.Mesh(geometry, mat);

		// Add Lines
		// mesh.add(new THREE.LineSegments(
		// 	geometry, app.cubeLineMaterial
		// ));		

		mesh.position.x = x;

		mesh.position.y = y;

		mesh.position.z = z;

		return mesh;
	}

})(this);
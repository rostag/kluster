/* globals THREE */

(function ( rootScope ) {

	'use strict';

	var mesh;

	var app = rootScope.getKLU5TER();

	app.factories.cube.getCube = createMesh;

	function createMesh(x,y,z,w,h,d, clr) {
		var geometry = new THREE.BoxGeometry(w,h,d);

		mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
			color: clr || 0x62989cf
		}));

		mesh.position.x = x;
		mesh.position.y = y;
		mesh.position.z = z;

		// mesh.material.color.setHex(clr);

		return mesh;
	}

	// console.log(app.factories.cube.getCube);

})( this );

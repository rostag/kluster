'use strict';
(function(rootScope) {

	rootScope.getGlClusterApp = function() {

		rootScope.glClusterApp = rootScope.glClusterApp || {
			name: 'cluster',
			version: '0.1',
			options: {},
			scene: null,
			camera: null,
			renderer: null,
			lights: null,
			factories: {
				cube: {}
			}
		};
		return rootScope.glClusterApp;
	};
})(this);
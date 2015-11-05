(function(rootScope) {
	'use strict';

	rootScope.getKLU5TER = function() {
		rootScope.KLU5TER = rootScope.KLU5TER || {
			name: 'KLU5TER',
			version: '0.1',
			options: {},
			factories: {
				cube: {}
			}
		};
		return rootScope.KLU5TER;
	};

})(this);
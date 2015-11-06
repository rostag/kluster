/* gloabals console */

(function(rootScope) {
	'use strict';


	// Product Development
	// Industrial
	// Big Data Analytics,
	// Internet of Things // IoT
	// Retail
	// UX/UI

	// .Net
	// AT testing
	// Automation
	// C / C++
	// embedded
	// Java
	// UI / UX / Frontend
	// Usability


	var app = rootScope.getKLU5TER();

	app.KlusterModel = KlusterModel;

	function KlusterModel() {

		var self = this;

		self.levels = getCollection(Chunk, ['Industrial', 'Internet of Things', 'Big Data Analytics', 'Retail', 'PR', 'UI/UX', 'Product Development']);
		self.segments = getCollection(Chunk, ['.Net', 'Java', 'C/C++', 'NetDuino', 'Front-End', 'Usability', 'JavaScript', '3D Print', 'Automation', 'Embedded', 'HTML', 'CSS']);
		self.circles = getCollection(Chunk, ['Core', 'Mid-Term', 'Far Goals']);

		// console.log('Cluster Model: ', self.levels, self.segments, self.circles);

		self.getInfoByMetrics = function(o) {
			return {
				level: self.levels[o.level],
				segment: self.segments[o.segment],
				circle: self.circles[o.circle]
			}
		};
	}

	function getCollection(modelConstructor, valuesArray) {
		for (var i = 0; i < valuesArray.length; i++) {
			valuesArray[i] = new Chunk(valuesArray[i]);
		}
		return valuesArray;
	}

	function Chunk(name) {
		this.name = name;
	}

})(this);
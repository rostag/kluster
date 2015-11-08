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

		self.levels = ['Industrial', 'Internet of Things', 'Big Data Analytics', 'Retail', 'PR', 'UI/UX', 'Product Development'];
		self.segments = ['.Net', 'Java', 'C/C++', 'NetDuino', 'Front-End', 'Usability', 'JavaScript', '3D Print', 'Automation', 'Embedded', 'HTML', 'CSS'];
		self.circles = ['Core', 'Mid-Term', 'Far Goals'];

		self.l = getCollection(Chunk, self.levels.concat());
		self.s = getCollection(Chunk, self.segments.concat());
		self.c = getCollection(Chunk, self.circles.concat());

		// console.log('Cluster Model: ', self.l, self.s, self.c);

		// getHTML();
		var s =
			['<ul><li>', [
					self.levels.join('</li><li class="levels-list">'),
					self.segments.join('</li><li class="segments-list">'),
					self.circles.join('</li><li class="circles-list">')
				].join('</li></ul>\n<ul><li>'),
				'</li></ul>'
			].join('\n');

		console.log('getHTML: ' + s);

		self.getInfoByMetrics = function(o) {
			return {
				level: self.l[o.level],
				segment: self.s[o.segment],
				circle: self.c[o.circle]
			};
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

	// function getHTML () {
	// 	var s = [
	// 	'<ul><li>',
	// 	self.l.join('</li><li>'),
	// 	'</li></ul>'
	// 	]
	// 	console.log('getHTML: ', + s);
	// 	return s;

	// }

})(this);
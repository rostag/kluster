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

		self.levels = [new Level('Industrial'), new Level('Internet of Things'), new Level('Big Data Analytics'), new Level('Retail'), new Level('PR'), new Level('UI/UX'), new Level('Product Development')];
		self.segments = [new Segment('.Net'), new Segment('Java'), new Segment('C/C++'), new Segment('NetDuino'), new Segment('Front-End'), new Segment('Usability'), new Segment('JavaScript'), new Segment('3D Print'), 
		new Segment('Automation'), new Segment('Embedded'), new Segment('HTML'), new Segment('CSS')];
		self.circles = [new Circle('Core'), new Circle('Mid-Term'), new Circle('Far Goals')];

		console.log('Cluster Model: ', self.levels, self.segments, self.circles);
	}

	function Level(name) {
		this.name = name;
	}

	function Circle(name) {
		this.name = name;
	}

	function Segment(name) {
		this.name = name;
	}

})(this);
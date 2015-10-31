'use strict';

function KlusterAnimator() {

	var self = this;

	var app = KLU5TER;

	var timeOut;

	this.start = function() {
		timeOut = setTimeout(function() {
			app.controls.level.val += 0.1;

			console.log(app.controls.level.val);
		}, 100);
	};
}
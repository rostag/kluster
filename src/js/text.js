/* globals THREE */

/**
 * Renders Text Sprites
 * Code is based on the nice example of view-source:http://stemkoski.github.io/Three.js/Sprite-Text-Labels.html
 *
 * @todo @fixme - Move to updated sprite usage accordng to http://stackoverflow.com/questions/20601102/three-spritealignment-showing-up-as-undefined: 
 * 
 * SpriteMaterial.alignment and SpriteMaterial.useScreenCoordinates have been removed from Threejs. See the release history: https://github.com/mrdoob/three.js/releases.
 * Sprites are now rendered in the scene just like any other object.
 * If you want to create a heads-up display (HUD), the work-around is to overlay a second scene of sprites, rendered with an orthographic camera.
 * See http://threejs.org/examples/webgl_sprites.html for an example of how to do that. 
 * three.js r.64
 * 
 * Additional reading: https://github.com/mrdoob/three.js/issues/1321
 */

function textFactory(app) {

	'use strict';

	var scene = app.scene;

	var clusterAxis = app.clusterAxis;

	app.getSpriteForMesh = getSpriteForMesh;

	var defaultPosition = {
		x: 0,
		y: -10,
		z: -60
	};
	var defaultTextParameters = {
		fontface: 'Arial',
		fontsize: 32,
		borderColor: {
			r: 100,
			g: 100,
			b: 100,
			a: 1.0
		},
		backgroundColor: {
			r: 255,
			g: 255,
			b: 255,
			a: 1
		},
		borderThickness: 1
	};

	app.chunkInfoSprite = getSpriteForMesh(app.scene, 'cluster', null, defaultPosition);

	/**
	 * @param textParamaters Object like defaultTextParameters above
	 */
	function getSpriteForMesh(mesh, text, textParamaters, position) {

		return null;

		var textParent = scene;
		// var textParent = scene;
		var spritey = makeTextSprite(text, textParamaters || defaultTextParameters);
		var pos = position || defaultPosition;
		spritey.position.set(pos.x, pos.y, pos.z);
		textParent.add(spritey);
		return spritey;
	}

	function makeTextSprite(message, parameters) {
		if (parameters === undefined) parameters = {};

		var fontface = parameters.hasOwnProperty('fontface') ?
			parameters.fontface : 'Arial';

		var fontsize = parameters.hasOwnProperty('fontsize') ?
			parameters.fontsize : 18;

		var borderThickness = parameters.hasOwnProperty('borderThickness') ?
			parameters.borderThickness : 4;

		var borderColor = parameters.hasOwnProperty('borderColor') ?
			parameters.borderColor : {
				r: 0,
				g: 0,
				b: 0,
				a: 1.0
			};

		var backgroundColor = parameters.hasOwnProperty('backgroundColor') ?
			parameters.backgroundColor : {
				r: 255,
				g: 255,
				b: 255,
				a: 1.0
			};

		var canvas = document.createElement('canvas');
		var context = canvas.getContext('2d');
		context.font = 'Bold ' + fontsize + 'px ' + fontface;

		// get size data (height depends only on font size)
		var metrics = context.measureText(message);
		var textWidth = metrics.width;

		// background color
		context.fillStyle = 'rgba(' + backgroundColor.r + ',' + backgroundColor.g + ',' + backgroundColor.b + ',' + backgroundColor.a + ')';
		// border color
		context.strokeStyle = 'rgba(' + borderColor.r + ',' + borderColor.g + ',' + borderColor.b + ',' + borderColor.a + ')';

		context.lineWidth = borderThickness;
		roundRect(context, borderThickness / 2, borderThickness / 2, textWidth + borderThickness, fontsize * 1.4 + borderThickness, 6);
		// 1.4 is extra height factor for text below baseline: g,j,p,q.

		// text color
		context.fillStyle = 'rgba(0, 0, 0, 1.0)';

		context.fillText(message, borderThickness, fontsize + borderThickness);

		// canvas contents will be used for a texture
		var texture = new THREE.Texture(canvas);
		texture.needsUpdate = true;

		var spriteMaterial = new THREE.SpriteMaterial({
			map: texture
		});
		var sprite = new THREE.Sprite(spriteMaterial);
		sprite.scale.set(100, 50, 1);
		return sprite;
	}

	app.updateChunkInfo = function ( chunk ) { 
		// REMOVE OLD
		var textParent = scene;
		textParent.remove(app.chunkInfoSprite);

		// GET NEW
		var text =  'c: ' + chunk.level + ':' + chunk.segment + ':' + chunk.circle;

		// app.chunkInfoSprite = getSpriteForMesh(app.scene, text, null, defaultPosition);

		var i = app.klusterModel.getInfoByMetrics( {level: chunk.level, segment: chunk.segment, circle: chunk.circle });

		if ( !i || !i.level ) {
			return;
		}

		var l = i.level ? i.level.name : '';
		var s = i.segment ? i.segment.name : '';
		var c = i.circle ? i.circle.name : '';

		text = '<h2>Domain:<br/>&nbsp;&nbsp;' + l + '</h2>' +
		'<h2>Technology: <br/>&nbsp;&nbsp;' + s + '</h2>' +
		'<h2>Stage: <br/>&nbsp;&nbsp;' + c + '</h2>';

		app.chunkInfoDiv.innerHTML = text;
	}

	// function for drawing rounded rectangles
	function roundRect(ctx, x, y, w, h, r) {
		ctx.beginPath();
		ctx.moveTo(x + r, y);
		ctx.lineTo(x + w - r, y);
		ctx.quadraticCurveTo(x + w, y, x + w, y + r);
		ctx.lineTo(x + w, y + h - r);
		ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
		ctx.lineTo(x + r, y + h);
		ctx.quadraticCurveTo(x, y + h, x, y + h - r);
		ctx.lineTo(x, y + r);
		ctx.quadraticCurveTo(x, y, x + r, y);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
	}

	return this;

}
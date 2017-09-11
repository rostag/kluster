/* globals console */

/**
 * UI for controlling the model.
 * @todo Add 'No rebuild' checkbox bo prevent rebuilds when state changes.
 */

(function(rootScope) {

  'use strict';

  var app = rootScope.getKLU5TER();

  var iLevel = document.getElementById('input-level');
  var iSegment = document.getElementById('input-segment');
  var iCircle = document.getElementById('input-circle');
  var metricSelector = document.getElementById('metricSelector');
  var stateSelector = document.querySelectorAll('[data-state-selector] a');

  var chunkInfo = document.getElementById('chunkInfo');

  app.speedX = 0;
  app.speedY = 0;
  app.curMouseX = 0;
  app.curMouseY = 0;
  app.prevMouseX = 0;
  app.prevMouseY = 0;

  app.chunkInfoDiv = chunkInfo;

  function onStateLinkClick(event) {
    var stateId = event && event.target && event.target.attributes && event.target.attributes['data-state'] && event.target.attributes['data-state'].value;
    app.animator.setState(stateId);
  }

  /**
   * Creates new Range Input with given parameters and links it to any handler
   */
  app.addControl = function(label, initialValue, min, max, step, path, handler) {
    // app.controls.path.val = initialValue;
    app[path] = initialValue;
    var cc = document.getElementById('dynControls');
    var inputRange = document.createElement('input');
    var inputLabel = document.createElement('label');
    inputRange.setAttribute('type', 'range');
    inputRange.setAttribute('min', min || 0);
    inputRange.setAttribute('max', max || 10);
    inputRange.setAttribute('step', step || 0.0001);
    inputRange.addEventListener('input', handler || function(event) {
      var val = event.target.value;
      app[path] = val;
      app.clusterFactory.rebuildCluster();
    });
    inputLabel.setAttribute('for', path);
    inputLabel.innerHTML = label;
    cc.appendChild(inputRange);
    cc.appendChild(inputLabel);
  };

  app.initializeControls = function() {
    iLevel.value = app.controls.level.val;
    iSegment.value = app.controls.segment.val;
    iCircle.value = app.controls.circle.val;
  };

  // app.addControl('Opacity', 0.1, 0.1, 1, 0.1, 'opacityAdd');
  app.addControl('Extrude Bias', 0, 0, 5, 0.01, 'extrudePathBiasX', function(event) {
    app.clusterOptions.extrudePathBiasX = app.clusterOptions.extrudePathBiasY = event.target.value;
    app.clusterFactory.rebuildCluster();
  });

  metricSelector.innerHTML = app.klusterModel.getHTML();

  // setup state links
  for (var l = 0; l < stateSelector.length; l++) {
    var link = stateSelector[l];
    link.addEventListener('click', onStateLinkClick);
    if (app.changeStateOnMouseOver) {
      link.addEventListener('mouseover', onStateLinkClick);
    }
  }

  iLevel.addEventListener('input', function() {
    // console.log( iLevel.value );
    app.controls.level.val = iLevel.value;
    app.clusterOptions.levels = Math.ceil(iLevel.value);
    app.clusterFactory.rebuildCluster();
  });

  iSegment.addEventListener('input', function() {
    // console.log( iSegment.value );
    app.controls.segment.val = iSegment.value;
    app.clusterOptions.segments = Math.ceil(iSegment.value);
    app.clusterFactory.rebuildCluster();
  });

  iCircle.addEventListener('input', function() {
    app.controls.circle.val = iCircle.value;
    app.clusterOptions.circles = Math.ceil(iCircle.value);
    app.clusterFactory.rebuildCluster();
  });

  document.addEventListener('mousemove', function(event) {
    app.prevMouseX = app.curMouseX;
    app.prevMouseY = app.curMouseY;
    app.curMouseX = event.clientX;
    app.curMouseY = event.clientY;
    app.speedX = app.prevMouseX - app.curMouseX;
    app.speedY = app.prevMouseY - app.curMouseY;

    // console.log(app.speedX, app.speedY);
  });

})(this);
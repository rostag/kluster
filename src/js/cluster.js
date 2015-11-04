/* globals THREE, console */

function ClusterFactory(app) {

  'use strict';

  var self = this;

  var clusterAxis;

  var rotationX = 0.01;
  var rotationY = 0.01;
  var rotationZ = 0.01;

  var rotationSpeedX = 0.0001;
  var rotationSpeedY = 0.0002;
  var rotationSpeedZ = 0.0003;
  var speed = 0.0007;

  var ringFactory;
  var ring;
  var ring3;
  var ring2;
  var chunks = [];
  var hiliters = [];

  this.rebuildCluster = function() {
    this.deleteCluster();
    app.materialFactory.init();
    this.createCluster(app.cluster.config);
  };

  /**
   * @todo Implement re-using of chunks
   */
  self.uhniliteChunk = function(options) {
    if (!options.unhiliteChunks) {
      return;
    }

    while (hiliters.length) {
      var hilitedChunk = hiliters.pop();
      clusterAxis.remove(hilitedChunk);
    }
  };

  /**
   * Highlights a chunk of Kluster
   * @param options Object in the form of { level: levelId, segment: segmentId; circle: circleId }
   * @todo
   */
  self.hiliteChunk = function(options) {
    self.uhniliteChunk( options );
    var hilitedChunk = getChunk(options.level, options.segment, options.circle, app.cylCircleHiliter);
    clusterAxis.add(hilitedChunk);
    hiliters.push(hilitedChunk);
  };

  function getChunk(level, segment, circle, givenMaterial, expandFactor) {
    // Level
    var lvl = level * self.options.levelheight;

    // Segment
    var segmentLength = (Math.PI * 2) / self.options.segments;
    var thetaMin = segment * segmentLength;
    var tLength = segmentLength * app.cluster.config.segmentsSpacing;
    var thetaMax = thetaMin + tLength;

    // Radius
    var innerRadius = app.ringOptions.innerRadius;
    var outerRadius = app.ringOptions.outerRadius;

    var radiusAvg = (outerRadius + innerRadius) / 2;
    var radiusStep = radiusAvg / app.cluster.config.circles;

    // Material
    var cylMaterial = app.cylCircleCore;
    if (circle % 2) {
      cylMaterial = app.cylCircleMid;
    } else if (circle % 3) {
      cylMaterial = app.cylCircleOut;
    }

    // if material is given, use it
    cylMaterial = givenMaterial || cylMaterial;

    var radius = ((circle * radiusStep) * 2 + radiusStep * 0.9) / 2;
    var thetaAvg = (thetaMin + thetaMax) / 2;

    //
    // create exrude from spline and path
    //
    function getKlusterMesh() {

      var xx = Math.sin(thetaAvg) * radius; // + THREE.Math.random16() / 4;
      var yy = Math.cos(thetaAvg) * radius; // + THREE.Math.random16() / 4;

      var closedSpline = new THREE.CatmullRomCurve3([
        new THREE.Vector3(xx, yy, lvl),
        new THREE.Vector3(xx, yy, lvl + self.options.levelheight / app.cluster.config.levelsSpacing)
      ]);

      var extrudeSettings = {
        steps: 1,
        bevelEnabled: false,
        extrudePath: closedSpline
      };

      // Draw by points
      var e = expandFactor || 0;

      var iRadius = circle * radiusStep;
      var oRadius = circle * radiusStep + radiusStep * 0.9;

      var pts = [
        new THREE.Vector2(Math.sin(thetaMin) * iRadius + e, Math.cos(thetaMin) * iRadius + e),
        new THREE.Vector2(Math.sin(thetaMin) * oRadius + e, Math.cos(thetaMin) * oRadius + e),
        new THREE.Vector2(Math.sin(thetaMax) * oRadius + e, Math.cos(thetaMax) * oRadius + e),
        new THREE.Vector2(Math.sin(thetaMax) * iRadius + e, Math.cos(thetaMax) * iRadius + e)
      ];

      var shape = new THREE.Shape(pts);

      var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

      var mesh = new THREE.Mesh(geometry, cylMaterial);

      // mesh.rotation. = Math.PI / 4;

      return mesh;
    }

    var mesh = getKlusterMesh();

    return mesh;
  }

  this.deleteCluster = function(options) {
    // chunk
    var chunk;

    // clusterAxis.add(chunk);
    for (var c = 0; c < chunks.length; c++) {
      chunk = chunks[c];
      clusterAxis.remove(chunk);
    }

    // clusterAxis.remove(ring3);
    // clusterAxis.remove(ring2);

    // clusterAxis = new THREE.Mesh(geometry, app.lineMaterial);
    app.scene.remove(clusterAxis);
  };

  this.createCluster = function(options) {
    var geometry = new THREE.CylinderGeometry(0.0001, 0.0001, options.height, 8);
    clusterAxis = new THREE.Mesh(geometry, app.lineMaterial);

    ringFactory = new RingFactory(app);

    self.options = options;
    self.options.levelheight = (options.height / options.levels);

    var level;
    var segment;
    var circle;

    var chunk;

    for (level = 0; level < options.levels; level++) {
      for (segment = 0; segment < options.segments; segment++) {
        for (circle = 0; circle < options.circles; circle++) {
          chunk = getChunk(level, segment, circle);
          clusterAxis.add(chunk);
          chunks.push(chunk);
        }
      }
    }

    // ring3 = ringFactory.createRing(app.ringOptions);
    // ring2 = ringFactory.createRing(app.ringOptions);
    // ring3.scale.set(0.5, 0.5, 0.5);
    // ring2.scale.set(0.5, 0.5, 0.5);

    // clusterAxis.add(ring3);
    // clusterAxis.add(ring2);

    clusterAxis.translateZ(-options.height);

    clusterAxis.onRender = function() {

      speed += 0.00001;

      var rand = Math.random() * 0.001;

      // rotationX += rotationSpeedX + app.speedX * speed;
      // rotationY += rotationSpeedY + rand;
      //
      // rotationZ += rotationSpeedZ + app.speedY * speed;
      // rotationZ += rotationSpeedZ + speed;

      // clusterAxis.rotation.x += 0.0005;// + speed;
      // clusterAxis.rotation.x = (10 / app.controls.level.val) * (Math.PI / 4) + rotationX;
      // clusterAxis.rotation.y = (10 / app.controls.segment.val) * (Math.PI / 4) + rotationY;
      // clusterAxis.rotation.z = rotationZ;

      // ring3.rotation.x = rotationX + speed;
      // ring3.rotation.y = rotationY + rand;

      // ring2.rotation.x = rotationY;
      // ring2.rotation.y = rotationX + speed + rand;
    };

    // Hiliters
    self.hiliteChunk({
      level: 1,
      segment: 2,
      circle: 2
    });

    app.scene.add(clusterAxis);

    app.clusterAxis = clusterAxis;

    return clusterAxis;

  };
}

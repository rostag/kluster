/* globals RingFactory, THREE, console */
function ClusterFactory(app) {

  'use strict';

  var self = this;

  var clusterAxis;

  // var rotationX = 0.01;
  // var rotationY = 0.01;
  // var rotationZ = 0.01;

  // var rotationSpeedX = 0.0001;
  // var rotationSpeedY = 0.0002;
  // var rotationSpeedZ = 0.0003;
  var speed = 0.0007;

  var ringFactory;
  var levelPointer;
  var chunks = [];
  var hiliters = [];

  this.checkIfRebuildIsNeeded = function() {
    if (app.rebuildIsNeeded === true) {
      app.rebuildIsNeeded = false;
      self.rebuildCluster();
    }
  };

  this.rebuildCluster = function() {
    this.deleteCluster();
    // app.materialFactory.init();
    this.createCluster(self.options);
  };

  /**
   * @todo Implement re-using of chunks
   */
  self.unhiliteChunk = function(options) {
    if (!options.removeOld) return;
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
    self.unhiliteChunk(options);
    var hilitedChunk = getChunk(options.level, options.segment, options.circle, app.cylCircleHiliter);
    clusterAxis.add(hilitedChunk);
    hiliters.push(hilitedChunk);
  };

  /**
   * Generates one chunk of the kluster based on its level, segment, circle, and given material properties.
   *
   * @param level The level in the kluster
   * @param segment The segment in the kluster
   * @param circle The circle in the kluster   
   * @param givenMaterial Material to use instead of the default one 
   * @param expandFactor To increase a bit in size (wip)
   */
  function getChunk(level, segment, circle, givenMaterial, expandFactor) {
    // Level
    var levelHeight = self.options.height / self.options.levels;
    var levelMin = levelHeight * (level + 0.5) * self.options.levelsSpacing;
    var levelMax = levelHeight * (level + 1.5);

    // Segment
    var segmentLength = (Math.PI * 2) / self.options.segments;
    var thetaMin = segment * segmentLength;
    var thetaMax = thetaMin + segmentLength / self.options.segmentsSpacing;

    // Radius
    var ringWidth = self.options.radius / self.options.circles;
    var innerRadius = circle * ringWidth;
    var outerRadius = circle * ringWidth + ringWidth / self.options.ringSpacing;

    var radiusAvg = (outerRadius + innerRadius) / 2;

    // Material
    var cylMaterial = app.cylCircleCore;
    if (circle % 2) {
      cylMaterial = app.cylCircleMid;
    } else if (circle % 3) {
      cylMaterial = app.cylCircleOut;
    }

    // if material is given, use it
    cylMaterial = givenMaterial || cylMaterial;

    var radius = radiusAvg; //((circle * ringWidth) * 2 + ringWidth * 0.9) / 2;
    var thetaAvg = (thetaMin + thetaMax) / 2;

    var xx = Math.sin(thetaAvg) * radius; // + THREE.Math.random16() / 4;
    var yy = Math.cos(thetaAvg) * radius; // + THREE.Math.random16() / 4;

    var e = expandFactor || 0;

    function traceChunk() {
      var td = '; ';
      var dec = 1;
      var r = function(num) {
        return Math.round(num * 100) / 100;
      };

      console.log(
        'level=' + r(level, dec) +
        td + 'levelHeight=' + r(levelHeight, dec) +
        td + 'levelMin=' + r(levelMin, dec) +
        td + 'levelMax=' + r(levelMax, dec) +
        '\nsegment=' + r(segment, dec) +
        td + 'segmentLength=' + r(segmentLength, dec) +
        td + 'thetaMin=' + r(thetaMin, dec) +
        td + 'thetaMax=' + r(thetaMax, dec) +
        '\ncircle=' + r(circle, dec) +
        td + 'ringWidth=' + r(ringWidth, dec) +
        td + 'innerRadius=' + r(innerRadius, dec) +
        td + 'outerRadius=' + r(outerRadius, dec)
      );

      app.tracePos && app.tracePos();
    }

    function getCubicMesh() {
      // traceChunk();
      var cube = app.factories.cube.getCube(xx, yy, levelMin, 0.5, 0.5, levelHeight, cylMaterial.color.getHex(), cylMaterial);
      return cube;
    }

    // create exrude from spline and path
    function getKlusterMesh() {

      var extrudeSettings = {
        steps: 1,
        bevelEnabled: false,
        extrudePath: new THREE.CatmullRomCurve3([
          new THREE.Vector3(self.options.extrudePathBiasX, self.options.extrudePathBiasY, levelMin),
          new THREE.Vector3(self.options.extrudePathBiasX, self.options.extrudePathBiasY, levelMax)
          // new THREE.Vector3(0, 0, levelMin), new THREE.Vector3(0, 0, levelMax)
        ])
      };

      // Draw by points
      var pts = [
        new THREE.Vector2(Math.sin(thetaMin) * innerRadius + e, Math.cos(thetaMin) * innerRadius + e),
        new THREE.Vector2(Math.sin(thetaMin) * outerRadius + e, Math.cos(thetaMin) * outerRadius + e),
        new THREE.Vector2(Math.sin(thetaMax) * outerRadius + e, Math.cos(thetaMax) * outerRadius + e),
        new THREE.Vector2(Math.sin(thetaMax) * innerRadius + e, Math.cos(thetaMax) * innerRadius + e)
      ];

      var shape = new THREE.Shape(pts);
      var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      var mesh = new THREE.Mesh(geometry, cylMaterial);

      // cosshape.rotation.y = Math.PI / 4;

      mesh.level = level;
      mesh.segment = segment;
      mesh.circle = circle;

      return mesh;
    }

    var mesh = getKlusterMesh();
    // var mesh = getCubicMesh();

    return mesh;
  }

  this.deleteCluster = function() {
    // chunk
    var chunk;

    self.unhiliteChunk({
      removeOld: true
    });

    // clusterAxis.add(chunk);
    for (var c = 0; c < chunks.length; c++) {
      chunk = chunks[c];
      clusterAxis.remove(chunk);
    }

    clusterAxis.remove(levelPointer);

    // app.scene.remove(clusterAxis);
  };

  this.createCluster = function(options) {
    // Reuse existing if possible
    clusterAxis = clusterAxis || app.factories.cube.getCube(0, 0, options.height, 0.1, 0.1, options.height, 0xffffff);
    ringFactory = new RingFactory(app);

    self.options = options;

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

    // ring is a level pointer
    // @todo @p1 include in animation setup
    levelPointer = ringFactory.createRing();
    levelPointer.scale.set(1, 1, 1);
    clusterAxis.add(levelPointer);

    clusterAxis.onRender = function() {
      speed += 0.00001;
      // var rand = Math.random() * 0.001;

      // rotationX += rotationSpeedX + app.speedX * speed;
      // rotationY += rotationSpeedY + rand;
      // rotationZ += rotationSpeedZ + app.speedY * speed;
      // rotationZ += rotationSpeedZ + speed;

      // clusterAxis.rotation.x += 0.0005 + speed;
      // clusterAxis.rotation.z = rotationZ;

      app.mouseControl.checkIntersection(chunks, false);
    };

    app.clusterAxis = clusterAxis;

    return clusterAxis;

  };
}
/* globals RingFactory, THREE, console */

function ClusterFactory(app) {

  'use strict';

  var self = this;

  var clusterAxis;

  var rotationX = 0.01;
  var rotationY = 0.01;
  // var rotationZ = 0.01;

  // var rotationSpeedX = 0.0001;
  // var rotationSpeedY = 0.0002;
  // var rotationSpeedZ = 0.0003;
  var speed = 0.0007;

  var ringFactory;
  var levelPointer;
  var chunks = [];
  var hiliters = [];

  this.rebuildCluster = function() {
    this.deleteCluster();
    app.materialFactory.init();
    this.createCluster(app.clusterOptions);
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
    var levelMin = level;
    var levelMax = level + self.options.levelheight / app.clusterOptions.levelsSpacing;
    var levelHeight = self.options.levelheight / app.clusterOptions.levelsSpacing;

    // Segment
    var segmentLength = (Math.PI * 2) / self.options.segments;
    var thetaMin = segment * segmentLength;
    var tLength = segmentLength * app.clusterOptions.segmentsSpacing;
    var thetaMax = thetaMin + tLength;

    // Radius
    // FIXME
    var ringWidth = self.options.radius / self.options.circles;
    var innerRadius = circle * ringWidth;
    var outerRadius = circle * ringWidth + ringWidth / self.options.ringSpacing;

    var radiusAvg = (outerRadius + innerRadius) / 2;
    var radiusStep = radiusAvg / app.clusterOptions.circles;

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

    var xx = Math.sin(thetaAvg) * radius; // + THREE.Math.random16() / 4;
    var yy = Math.cos(thetaAvg) * radius; // + THREE.Math.random16() / 4;

    function traceChunk() {
      var dec = 1;
      var r = (num) => Math.round(num * 100) / 100;

      console.log(
        'levelMin=' + r(levelMin, dec) +
        ', levelMax=' + r(levelMax, dec) +
        ', thetaMin=' + r(thetaMin, dec) +
        ', thetaMax=' + r(thetaMax, dec) +
        ', innerRadius=' + r(innerRadius, dec) +
        ', outerRadius=' + r(outerRadius, dec)
      );
    }

    function getCubicMesh() {
      traceChunk();
      var cube = app.factories.cube.getCube(xx, yy, levelMin, 0.5, 0.5, levelHeight, cylMaterial.color.getHex());
      return cube;
    }

    // create exrude from spline and path
    function getKlusterMesh() {
      var closedSpline = new THREE.CatmullRomCurve3([
        new THREE.Vector3(xx, yy, levelMin),
        new THREE.Vector3(xx, yy, levelMax)
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

    // ring is a level pointer
    // @todo @p1 include in animation setup
    levelPointer = ringFactory.createRing();
    levelPointer.scale.set(0.5, 0.5, 0.5);
    clusterAxis.add(levelPointer);

    clusterAxis.translateZ(-options.height);

    clusterAxis.onRender = function() {
      speed += 0.00001;
      var rand = Math.random() * 0.001;

      // rotationX += rotationSpeedX + app.speedX * speed;
      // rotationY += rotationSpeedY + rand;
      // rotationZ += rotationSpeedZ + app.speedY * speed;
      // rotationZ += rotationSpeedZ + speed;

      // clusterAxis.rotation.x += 0.0005;// + speed;
      // clusterAxis.rotation.z = rotationZ;

      levelPointer.rotation.x = rotationX + speed;
      levelPointer.rotation.y = rotationY + rand;
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
/* globals console, KLU5TER */

function KlusterAnimator() {

  'use strict';

  var self = this;

  var app = KLU5TER;

  var camera = app.camera;

  var easingFunc = TWEEN.Easing.Elastic.Out;
  easingFunc = TWEEN.Easing.Circular.Out;
  easingFunc = TWEEN.Easing.Linear.None;

  // Cluster Position and Camera Position Also
  var clusterPos = {
    position: {
      x: 0,
      y: 0,
      z: 0
    },
    rotation: {
      theta: Math.PI,
      phi: 0,
      psi: 0
    },
    camera: {
      x: 28,
      y: 0,
      z: 0,
      fov: app.cameraSettings.FOV
    }
  };

  // This is the sequence of state id's for animated mode:
  var animationSequence = ['1', '2', '3', '4', '6', 'STATE_STOP_ANIMATION'];

  function getRandomPos() {
    var k = 1;

    var mrfs = THREE.Math.randFloatSpread;
    clusterPos.position.y = mrfs(20 * k);
    clusterPos.position.x = mrfs(20 * k);
    clusterPos.position.z = mrfs(20 * k);

    // clusterPos.rotation.theta = mrfs(Math.PI * k);
    // clusterPos.rotation.phi = mrfs(Math.PI * k);
    // clusterPos.rotation.psi = mrfs(Math.PI * k);

    clusterPos.camera.y = THREE.Math.randFloat(2, 40) * k;
    clusterPos.camera.x = THREE.Math.randFloat(2, 30) * k;
    clusterPos.camera.z = THREE.Math.randFloat(0, 30) * k;
    clusterPos.camera.fov = mrfs(10 * k);
    // clusterPos.camera.theta = 0;
    // clusterPos.camera.phi = Math.PI / 2;
    // clusterPos.camera.psi = 0;
  }

  var states = {
    '1': {
      id: 1,
      time: 1000,
      name: 'State 1',
      handler: function() {
        clusterPos.position.y = -10;
        clusterPos.position.x = 20;

        clusterPos.position.z = 2;

        clusterPos.rotation.theta = 0;
        clusterPos.rotation.phi = Math.PI / 2;
        clusterPos.rotation.psi = 0;

        clusterPos.camera.y = 0;
        clusterPos.camera.x = 28;
        clusterPos.camera.z = 0;
        clusterPos.camera.fov = app.cameraSettings.FOV;
        // clusterPos.camera.theta = 0;
        // clusterPos.camera.phi = Math.PI / 2;
        // clusterPos.camera.psi = 0;

        tweenCluster(clusterPos);
        // randomClusterPosition();
      }
    },
    '2': {
      id: 2,
      time: 1000,
      name: 'State 2',
      handler: function() {
        clusterPos.position.z = 5;

        clusterPos.camera.x = 38;
        //clusterPos.camera.fov = 75;

        tweenCluster(clusterPos);

        app.clusterFactory.hiliteChunk({
          level: 0,
          segment: 0,
          circle: 0,
          unhiliteChunks: true
        });
      }
    },
    '3': {
      id: 3,
      time: 1000,
      name: 'State 3',
      handler: function() {
        clusterPos.position.z = 10;
        clusterPos.camera.x = 48;

        getRandomPos();
        tweenCluster(clusterPos);

        app.clusterFactory.hiliteChunk({
          level: 2,
          segment: 2,
          circle: 2,
          unhiliteChunks: true
        });

      }
    },
    '4': {
      id: 4,
      time: 1000,
      name: 'State 4',
      handler: function() {
        clusterPos.position.y = 5;
        clusterPos.camera.x = 28;
        // clusterPos.rotation.theta += Math.PI / 2;
        tweenCluster(clusterPos);
        app.clusterFactory.hiliteChunk({
          level: 1,
          segment: 1,
          circle: 1,
          unhiliteChunks: true
        });

      }
    },
    'STATE_STOP_ANIMATION': {
      id: 4,
      time: 1000,
      name: 'State 5 - Stop Animation',
      handler: function() {
        app.isManualMode = true;

      }
    }
  };

  /**
   * Properties Tween
   * @param o Object to tween.
   * @param prop Property to tween.
   * @param newValue Value van be position-like object or plain value like fov = 75
   */
  function tweenObjProp(o, prop, newValue) {
    var op = o[prop];

    // by default, we tween complex position-like object of x, y, and z
    var tweenParams = {
      x: newValue.x,
      y: newValue.y,
      z: newValue.z
    };

    // but also can tween simple params like camera.fov
    if (typeof op === 'number') {
      tweenParams = newValue;
      console.log('plain:', tweenParams, op);
    }

    console.log('tween params:', tweenParams, op);

    new TWEEN.Tween(op).to(tweenParams, 200).easing(easingFunc).start();
  }

  /**
   * @param position Object with properties { x, y, z, theta, phi, psi }
   */
  function tweenCluster(position) {
    tweenObjProp(app.clusterAxis, 'position', position.position);
    tweenObjProp(app.clusterAxis, 'rotation', position.rotation);
    tweenObjProp( app.camera, 'position', position.camera);
    // @todo work it out: tweenObjProp( app.camera, 'fov', position.camera.fov);
  }

  function randomClusterPosition() {
    tweenCluster({
      x: Math.random() * 8 - 4,
      y: Math.random() * 8 - 4,
      z: Math.random() * 8 - 4,
      theta: Math.random() * 2 * Math.PI,
      phi: Math.random() * 2 * Math.PI,
      psi: Math.random() * 2 * Math.PI
    });
  }

  this.getStateById = function(stateId) {
    var state = states[stateId];
    return state;
  };

  this.setState = function(stateId) {
    var state = self.getStateById(stateId);

    if (!state) {
      console.log('A: State not found: ', stateId);
      return;
    }
    console.log('A: Go to State: ', state.name, state.time);
    state.handler();
  };

  this.startAnimator = function() {
    var s = 0;
    var stateId = animationSequence[s];
    var state = self.getStateById(stateId);

    self.setState(stateId);

    function nextState() {
      if (app.isManualMode) {
        return;
      }

      setTimeout(function() {
        stateId = animationSequence[s];
        self.getStateById(stateId);
        self.setState(stateId);
        s = s >= states.length ? 0 : ++s;
        nextState();
      }, state.time);
    }
    nextState();
  };
}

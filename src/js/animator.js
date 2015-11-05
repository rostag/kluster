/* globals console, KLU5TER, THREE, TWEEN, KlusterAnimator */

/**
 * Animates the Kluster and Camera
 * @todo: implement idle cycle
 * @todo: implement rings, sectors and levels animation
 * @todo Implement timeSpeedFunction
 */

function KlusterAnimator() {

  'use strict';

  var self = this;

  var app = KLU5TER;

  // var camera = app.camera;

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
      x: Math.PI,
      y: 0,
      z: 0
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

  function getRandomChunk() {
    var mr = THREE.Math.randInt;
    var chunk = {
      level: mr(0, app.clusterOptions.levels - 1),
      segment: mr(0, app.clusterOptions.segments - 1),
      circle: mr(0, app.clusterOptions.circles - 1)
    };
    // console.log('random chunk:', chunk);
    return chunk;
  }

  function getRandomPos() {
    var k = 1;

    var mrfs = THREE.Math.randFloatSpread;
    clusterPos.position.x = mrfs(20 * k);
    clusterPos.position.y = mrfs(20 * k);
    clusterPos.position.z = mrfs(20 * k);

    clusterPos.rotation.x = mrfs(Math.PI * k);
    clusterPos.rotation.y = mrfs(Math.PI * k);
    clusterPos.rotation.z = mrfs(Math.PI * k);

    clusterPos.camera.x = THREE.Math.randFloat(2, 15) * k;
    clusterPos.camera.y = THREE.Math.randFloat(2, 25) * k;
    clusterPos.camera.z = THREE.Math.randFloat(0, 10) * k;
  }

  var states = {
    '1': {
      time: 1000,
      name: 'State 1',
      handler: function() {
        clusterPos.position.y = 0;
        clusterPos.position.x = 0;
        clusterPos.position.z = 0;

        clusterPos.rotation.x = 0;
        clusterPos.rotation.y = 0;
        clusterPos.rotation.z = 0;

        clusterPos.camera.y = 22;
        clusterPos.camera.x = 2;
        clusterPos.camera.z = 0;

        setPosFromPosMap('Ring Debugger');

        // clusterPos.camera.fov = app.cameraSettings.FOV;

        tweenCluster(clusterPos);
      }
    },
    '2': {
      name: 'State 2',
      handler: function() {

        clusterPos.position.y = 10;
        clusterPos.rotation.x = Math.PI / 2;
        clusterPos.camera.y = 28;

        tweenCluster(clusterPos);

        var rChunk = getRandomChunk();
        rChunk.removeOld = true;
        app.clusterFactory.hiliteChunk(rChunk);
      }
    },
    '3': {
      handler: function() {
        // TWEAK it to get the best result
        setPosFromPosMap('Initial Two');

        tweenCluster(clusterPos);
      }
    },
    '4': {
      time: 1000,
      name: 'State 4',
      handler: function() {
        setPosFromPosMap('4');
        tweenCluster(clusterPos);

        app.clusterFactory.hiliteChunk({
          level: 1,
          segment: 3,
          circle: 1,
          removeOld: true
        });

      }
    },
    '5': {
      time: 1000,
      name: 'State 5',
      handler: function() {
        setPosFromPosMap('5');
        tweenCluster(clusterPos);
      }
    },
    '6': {
      handler: function() {
        setPosFromPosMap('6');
        tweenCluster(clusterPos);
      }
    },
    'RING_DEBUGGER': {
      // CHUNKS random array creation:
      handler: function() {
        setPosFromPosMap('Ring Debugger');
        tweenCluster(clusterPos);
      }
    },
    '8': {
      handler: function() {
        setPosFromPosMap('8');
        tweenCluster(clusterPos);
      }
    },
    'RANDOMIZE': {
      name: 'State RANDOMIZE',
      handler: function() {
        getRandomPos();
        tweenCluster(clusterPos);
      }
    },
    'STATE_HILITE': {
      // CHUNKS random array creation:
      handler: function() {
        setPosFromPosMap('Overloaded');
        tweenCluster(clusterPos);
        hiliteChunks();
      }
    },
    'STATE_STOP_ANIMATION': {
      id: 4,
      time: 1000,
      name: 'State 5 - Stop Animation',
      handler: function() {
        app.isManualMode = true;
        app.tracePos();
      }
    },
    'STATE_SCREEN_SAVE': {
      name: 'State of Going to screen saver mode',
      handler: function() {
        app.autoPlayIsOn = !app.autoPlayIsOn;
        console.log('app.autoPlayIsOn =', app.autoPlayIsOn);
        app.isManualMode = true;
      }
    },
    'STATE_PREV': {
      name: 'State Prev',
      handler: function() {
        app.isManualMode = true;
        getPrevState();
      }
    },
    'STATE_NEXT': {
      name: 'State Next',
      handler: function() {
        app.isManualMode = true;
        getNextState();
      }
    }
  };

  function hiliteChunks() {
    app.clusterFactory.unhiliteChunk({
      removeOld: true
    });
    var rChunk;
    var i = 0;
    while (i < 40) {
      rChunk = getRandomChunk();
      rChunk.removeOld = false;
      app.clusterFactory.hiliteChunk(rChunk);
      i++;
    }
  }
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

    // console.log('tween params:', tweenParams, op);

    new TWEEN.Tween(op).to(tweenParams, 200).easing(easingFunc).start();
  }

  /**
   * @param position Object with properties { x, y, z }
   */
  function tweenCluster(position) {
    tweenObjProp(app.clusterAxis, 'position', position.position);
    tweenObjProp(app.clusterAxis, 'rotation', position.rotation);
    tweenObjProp(app.camera, 'position', position.camera);
    // @todo work it out: tweenObjProp( app.camera, 'fov', position.camera.fov);
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
    // console.log('A: Go to State: ', state.name, state.time);
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

  var step = 0;

  function getPrevState() {
    step--;
    var stateId = animationSequence[step];
    self.getStateById(stateId);
    self.setState(stateId);
    step = step >= states.length ? 0 : step;
  }

  function getNextState() {
    step++;
    var stateId = animationSequence[step];
    self.getStateById(stateId);
    self.setState(stateId);
    step = step < 1 ? states.length : step;
  }

  function setPosFromPosMap(posId) {
    var p = posMap[posId];

    clusterPos.position.x = p.clusterAxisPosition.x;
    clusterPos.position.y = p.clusterAxisPosition.y;
    clusterPos.position.z = p.clusterAxisPosition.z;

    clusterPos.rotation.x = p.clusterAxisRotation._x;
    clusterPos.rotation.y = p.clusterAxisRotation._y;
    clusterPos.rotation.z = p.clusterAxisRotation._z;

    clusterPos.camera.x = p.cameraPosition.x;
    clusterPos.camera.y = p.cameraPosition.y;
    clusterPos.camera.z = p.cameraPosition.z;

    clusterPos.camera.fov = app.cameraSettings.FOV;

    // @todo debug rebuild...
    // We can also rebuild cluster in each separate state 
    // which makes it even more crazy :-)
    if (p.clusterOptions) {
      // console.log('rebuildIsNeeded : ', p.clusterOptions);
      for (var prop in p.clusterOptions) {
        if ( app.clusterOptions[prop] !== p.clusterOptions[prop] ){
          app.clusterOptions[prop] = p.clusterOptions[prop]
          app.rebuildIsNeeded = true;
        }
      }
      app.clusterFactory.checkIfRebuildIsNeeded();
    }
  }

  var posMap = {
    '4': {
      clusterAxisPosition: {
        x: 6,
        y: 0,
        z: 6
      },
      clusterAxisRotation: {
        _x: 1.5707963267948966,
        _y: 0,
        _z: 0
      },
      cameraPosition: {
        x: -0.06005512073072366,
        y: -7.432246638646143,
        z: 2.9594092797053992
      }
    },
    '5': {
      clusterAxisPosition: {
        x: 6,
        y: 0,
        z: 6
      },
      clusterAxisRotation: {
        _x: 1.5707963267948966,
        _y: 0,
        _z: 0
      },
      cameraPosition: {
        x: 5.924207462789089,
        y: -1.7707740057674255,
        z: -5.076231412998507
      }
    },
    '6i': {
      clusterAxisPosition: {
        x: 6,
        y: 0,
        z: 6
      },
      clusterAxisRotation: {
        _x: 0,
        _y: 1.5707963267948966,
        _z: 0
      },
      cameraPosition: {
        x: 6.95129248126769,
        y: -0.8778824404155695,
        z: 3.86119868184483
      }
    },
    '6s': {
      clusterAxisPosition: {
        x: 1.5707963267948966,
        y: 0,
        z: 0
      },
      clusterAxisRotation: {
        _x: 1.5707963267948966,
        _y: 0,
        _z: 0
      },
      cameraPosition: {
        x: -0.060055120730723645,
        y: -7.432246638646141,
        z: 2.9594092797053984
      }
    },
    // othographic:
    '6': {
      clusterAxisPosition: {
        x: 0,
        y: 0,
        z: 0
      },
      clusterAxisRotation: {
        _x: 0,
        _y: 0,
        _z: 0
      },
      cameraPosition: {
        x: 17.403784587301185,
        y: -0.12254841677667727,
        z: -14.008167078637566
      }
    },
    '8': {
      clusterAxisPosition: {
        x: 0,
        y: 0,
        z: 0
      },
      clusterAxisRotation: {
        _x: 0,
        _y: 0,
        _z: 0
      },
      cameraPosition: {
        x: 0.8672603877122337,
        y: 0.09869212668477238,
        z: 13.895276416525217
      }
    },
    'Initial One': {
      clusterAxisPosition: {
        x: 0,
        y: 0,
        z: 0
      },
      clusterAxisRotation: {
        _x: 0,
        _y: 0,
        _z: 0
      },
      cameraPosition: {
        x: 0.2705519085581147,
        y: 2.9760709941392562,
        z: 1.6566526440945126e-17
      }
    },
    'Initial Two': {
      clusterAxisPosition: {
        x: 0,
        y: 0,
        z: 0
      },
      clusterAxisRotation: {
        _x: 0,
        _y: 0,
        _z: 0
      },
      cameraPosition: {
        x: 7.616083989998293,
        y: -0.5361002156843375,
        z: 11.321729010548237
      },
      clusterOptions: {
        levels: 7,
        segments: 11,
        circles: 7,
        segmentsSpacing: 0.96,
        levelsSpacing: 1.3,
        ringSpacing: 0.96,
        height: 10,
        radius: 10
      }
    },
    'Ring Debugger': {
      clusterAxisPosition: {
        x: 0,
        y: 10,
        z: 0
      },
      clusterAxisRotation: {
        _x: 1.5707963267948966,
        _y: 0,
        _z: 0
      },
      cameraPosition: {
        x: -1.735643158085054e-7,
        y: -13.922664522547741,
        z: 0.00001392158263048721
      },
      clusterOptions: {
        levels: 1,
        segments: 7,
        circles: 2,
        segmentsSpacing: 0.96,
        levelsSpacing: 1.3,
        ringSpacing: 0.96,
        height: 10,
        radius: 10
      }
    },
    'Overloaded': {
      clusterAxisPosition: {
        x: 0,
        y: 0,
        z: 0
      },
      clusterAxisRotation: {
        _x: 0,
        _y: 0,
        _z: 0
      },
      cameraPosition: {
        x: 2.643754331703072,
        y: -0.48247358349057407,
        z: 9.45864986354379
      },
      clusterOptions: {
        levels: 7,
        segments: 14,
        circles: 7,
        segmentsSpacing: 0.96,
        levelsSpacing: 1.3,
        ringSpacing: 0.96,
        height: 10,
        radius: 10
      }
    },
    'Overloaded2': {
      clusterAxisPosition: {
        x: 0,
        y: 0,
        z: 0
      },
      clusterAxisRotation: {
        _x: 0,
        _y: 0,
        _z: 0
      },
      cameraPosition: {
        x: 2.643754331703072,
        y: -0.48247358349057407,
        z: 9.45864986354379
      },
      clusterOptions: {
        levels: 7,
        segments: 14,
        circles: 7,
        segmentsSpacing: 0.96,
        levelsSpacing: 1.3,
        ringSpacing: 0.96,
        height: 10,
        radius: 10
      }
    }
    // Center ortho vision:
    // {_x:1.5707963267948966,_y:0,_z:0,_order:XYZ} {x:0,y:10,z:0} {x:-0.2709624330095889,y:13.080082406522363,z:9.082308234026366}

  };
}
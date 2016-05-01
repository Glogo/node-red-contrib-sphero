var sphero = require('sphero');

var connections = {};
var uuids = {};

module.exports = function(RED) {
  RED.nodes.registerType('sphero-connection', handler);

  function handler(config) {
  	RED.nodes.createNode(this, config);
    var node = this;

    // Skip for disabled connections
    if(config.disabled) {
      node.log('Droid disabled. To enable: open Node-RED menu -> Configuration nodes -> double click on your node and untick "disabled"');
      node.disabled = true;
      return;
    }

    node.ollie = config.ollie;

    if(!config.uuid) {
      node.error('No UUID specified');
      return;

    } else {
      // Convert uuid to lowercase
      config.uuid = config.uuid.toLowerCase();
    }

    // Check if already connected to sphero (f.e. flow was redeployed)
    var con = connections[config.uuid];
    if(con) {
      node.sphero = con;

      // Give chance to sphero node to register callback
      setTimeout(function() {
        node.log('Already connected to: ' + config.uuid);
        callOnConnect(node.sphero.onConnectListeners);
      }, 500);

    } else {
      // Prevent connecting multiple times to same droid (f.e. two identical config nodes - sphero bug - thx)
      if(uuids[config.uuid]) {
        node.error('Detected multiple connection attempts to: ' + config.uuid);
        node.error('Some nodes may not be able to connect. Please remove duplicate connection configurations or disable them');
        return;

      } else {
        uuids[config.uuid] = true;
      }

      node.sphero = sphero(config.uuid);
      node.sphero.onConnectListeners = [];
      node.sphero.addOnConnectListener = function(cb) {
        node.sphero.onConnectListeners.push(cb);
      };
      node.sphero.removeOnConnectListener = function(cb) {
        var index = node.sphero.onConnectListeners.indexOf(cb);
        if(index !== -1) {
          node.sphero.onConnectListeners.splice(index, 1);
        }
      };

      node.log('Connecting to: ' + config.uuid);

      node.sphero.connect(function() {
        connections[config.uuid] = node.sphero;
        node.log('Connected to: ' + config.uuid);
        node.sphero.color('green');
        callOnConnect(node.sphero.onConnectListeners);
      });
    }

    function callOnConnect(onConnectListeners) {
       for(var i=0; i<onConnectListeners.length; i++) {
         onConnectListeners[i]();
       }
    };

    // this.on('close', function() {
    //   if(config.uuid) {
    //     connections[config.uuid].disconnect();
    //     delete connections[config.uuid];
    //   }
    // });
  }
}


var currentDirection = 0;
var directionStep = 45;
var maxSpeed = 120;
var currentSpeed = 0;
var state = 0;

var timer;

module.exports = function (RED) {
	RED.nodes.registerType('sphero', handler);

	function handler(config) {
		RED.nodes.createNode(this, config);

		var node = this;
		var spheroConnection = RED.nodes.getNode(config.connection);

		if(spheroConnection && spheroConnection.disabled) {
			disabled();
		}

		if(!spheroConnection || !spheroConnection.sphero) {
			node.error('Could not connect to sphero');
			return;

		} else {
			node.sphero = spheroConnection.sphero;
		}

		node.action = config.action;
		node.color = config.color;

		disconnected();
		node.sphero.addOnConnectListener(onConnect);

		function onConnect() {
			// node.log('I did connect :)');
			connected();

			node.on('input', function(msg) {
				// Just forward message and invoke action
				node.send(msg);

				// Add timer to stop device after 0.5 second. Timer will be cancelled and re-initialized with every new action
				if (timer) {
					clearTimeout(timer);
				}

				timer = setTimeout(function() {
					stop();
				}, 500);

				function stop() {
					node.sphero.roll(0, currentDirection, 2);
					currentSpeed = 0;
				}

				/**
				 * Add / edit actions here
				 */
				if(node.action === 'random-color') {
					node.sphero.randomColor();

				} else if(node.action === 'set-color') {
					node.sphero.color(node.color);

				} else if (node.action === 'move-forward') {
					node.sphero.roll(maxSpeed, currentDirection);
					currentSpeed = maxSpeed;

				} else if (node.action === 'move-backward') {
					currentSpeed = maxSpeed;
					doTurn(180);

				} else if (node.action === 'stop') {
					node.sphero.roll(0, currentDirection, 0);
					currentSpeed = 0;

				} else if (node.action === 'turn-left') {
					doTurn(-directionStep);

				} else if (node.action === 'turn-right') {
					doTurn(directionStep);
				}

				function doTurn(step) {
					// Circular clamp in interval <0;360)
					currentDirection = (currentDirection + step) % 360;
					if(currentDirection < 0) {
						currentDirection =  Math.abs(360 + currentDirection);
					}
					// node.log(currentDirection);
					node.sphero.roll(currentSpeed, currentDirection);
				}

				// \ actions
			});
		}

		node.on('close', function() {
			node.sphero.removeOnConnectListener(onConnect);
		});

		function connected() {
      node.status({
        fill: 'green',
        shape: 'dot',
        text: 'connected'
      });
    }

    function disconnected() {
      node.status({
        fill: 'red',
        shape: 'ring',
        text: 'disconnected'
      });
    }

		function disabled() {
      node.status({
        fill: 'yellow',
        shape: 'dot',
        text: 'disabled'
      });
    }

	}
}

# node-red-contrib-sphero
A [Node-RED](https://github.com/orbotix/sphero.js) node capable of establishing connection with Sphero droid and sending commands to it

## Prerequisites
This Node connects using bluetooth to your Sphero droid. Therefore it is required to install some dependencies in your system prior to installing this Node.
Refer to [sphero](https://github.com/orbotix/sphero.js) and [noble](https://github.com/sandeepmistry/noble) for more information

## Install
Run the following command in your Node-RED user directory - typically `~/.node-red`
```
npm i node-red-contrib-sphero
```
Or install it globally
```
sudo npm i -g node-red-contrib-sphero
```

### Example
Simple flow with inject nodes to make droid change color randomly, move, turn around and stop

**Note:** when adding or changing droid connection (UUID) it is required to restart Node-RED

```
[{"id":"3c6f9067.5aed3","type":"sphero-connection","z":"1bc8013.5b95eff","name":"BB8","uuid":"aa:97:fb:ef:72:de","ollie":false,"disabled":false},{"id":"a477ec6.1f4481","type":"sphero","z":"1bc8013.5b95eff","connection":"3c6f9067.5aed3","action":"random-color","color":"blue","x":455.5,"y":142,"wires":[[]]}]
```

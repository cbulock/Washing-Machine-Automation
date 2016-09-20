#!/usr/bin/env nodejs

var greenBean = require("green-bean");
var mqtt = require('mqtt');

require('events').EventEmitter.prototype._maxListeners = 100;

var host = 'mqtt';
var mqtt_client = mqtt.connect( 'mqtt://' + host );

var machineStatus = {
	0:	'Idle',
	1:	'Standby',
	2:	'Run',
	3:	'Pause',
	4:	'End of cycle',
	5:	'DSM delay run',
	6:	'Delay run',
	7:	'Delay pause',
	8:	'Drain timeout',
	128:	'Clean speak'
}

var machineSubStatus = {
	0:	'Not applicable',
	1:	'Fill',
	2:	'Soak',
	3:	'Wash',
	4:	'Rinse',
	5:	'Spin',
	6:	'Drain',
	7:	'Extra spin',
	8:	'Extra rinse',
	9:	'Tumble',
	10:	'Load size detection',
	128:	'Drying',
	129:	'Mist steam',
	130:	'Cool down',
	131:	'Extended tumble',
	132:	'Damp',
	133:	'Air fluff'
}

greenBean.connect("laundry", function(laundry) {

    laundry.machineStatus.subscribe(function (value) {
        console.log("machine status changed:", value);
	mqtt_client.publish('home/washer/status', machineStatus[value], {retain: true, qos: 1});
    });

    laundry.machineSubCycle.subscribe(function (value) {
        console.log("machine sub-cycle changed:", value);
	mqtt_client.publish('home/washer/cycle', machineSubStatus[value], {retain: true, qos: 1});
    });

    laundry.timeRemainingInSeconds.subscribe(function (value) {
        console.log("time remaining changed:", value);
	mqtt_client.publish('home/washer/time_remaining', value.toString(), {retain: true});
    });
});

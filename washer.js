var greenBean = require("green-bean");
var http = require('http');

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
	var postData = JSON.stringify({
		"state" : machineStatus[value],
		"attributes": {
			"friendly_name": "Status"
		}
	});
	var req = http.request(
		{
			host: 'ha',
			port: '8123',
			path: '/api/states/sensor.washing_machine',
			method: 'POST',
			headers: {
			 	'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': postData.length,
				'x-ha-access': 'PASSWORD'
			}
		}
	);

	req.write(postData);
	req.end();
    });

    laundry.machineSubCycle.subscribe(function (value) {
        console.log("machine sub-cycle changed:", value);
        var postData = JSON.stringify({
                "state" : machineSubStatus[value],
		"attributes": {
	                "friendly_name": "Cycle"
		}
        });
        var req = http.request(
                {
                        host: 'ha',
                        port: '8123',
                        path: '/api/states/sensor.washing_machine_cycle',
                        method: 'POST',
                        headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                                'Content-Length': postData.length,
                                'x-ha-access': 'PASSWORD'
                        }
                }
        );

        req.write(postData);
        req.end();

    });

    laundry.timeRemainingInSeconds.subscribe(function (value) {
        console.log("time remaining changed:", value);
        var postData = JSON.stringify({
                "state" : value,
		"attributes": {
                	"friendly_name": "Time Remaining",
			"unit_of_measurement": "seconds"
		}
        });
        var req = http.request(
                {
                        host: 'ha',
                        port: '8123',
                        path: '/api/states/sensor.washing_machine_time',
                        method: 'POST',
                        headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                                'Content-Length': postData.length,
                                'x-ha-access': 'PASSWORD'
                        }
                }
        );

        req.write(postData);
        req.end();

    });
});

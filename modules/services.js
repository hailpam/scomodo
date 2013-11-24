
// Factory
scomodo.factory('initializeDashboard', function() {
	// initializing the state
	return {
		init: function() {
			// TODO : to be defined by services call
			var events = new Events();
			// devices
			var random = Math.floor((Math.random()*10)+1);
			for(var i = 1; i <= random; i++) {
				var event = new Event("dev"+i, "Device "+i, new Date(), "This event contains device information", "Outcome: OK");
				events.addDevicesInfo(event);	
			}
			// warnings
			var random = Math.floor((Math.random()*10)+1);
			for(var i = 1; i <= random; i++) {
				var event = new Event("warn"+i, "Warning "+i, new Date(), "This is an alert raised by Souliss cloud", "Outcome: be careful!");
				events.addWarningsInfo(event);	
			}
			// errors
			var random = Math.floor((Math.random()*10)+1);
			for(var i = 1; i <= random; i++) {
				var event = new Event("err"+i, "Error "+i, new Date(), "This is an error raised by Souliss cloud", "Outcome: have a look!");
				events.addErrorsInfo(event);	
			}
			// errors
			var random = Math.floor((Math.random()*10)+1);
			for(var i = 1; i <= random; i++) {
				var event = new Event("ops"+i, "Operation "+i, new Date(), "This is an operation done against the Souliss cloud", "Outcome: OK");
				events.addInteractionsInfo(event);	
			}
			// sources
			var random = Math.floor((Math.random()*10)+1);
			for(var i = 1; i <= random; i++) {
				var event = new Event("src"+i, "Source "+i, new Date(), "This is a source of data from Souliss cloud", "Outcome: "+i);
				events.addSourcesInfo(event);	
			}
			// activities
			var random = Math.floor((Math.random()*10)+1);
			for(var i = 1; i <= random; i++) {
				var event = new Event("act"+i, "Activity "+i, new Date(), "This is an activity registered in the Souliss cloud", "Activity: "+i);
				events.addActivitiesInfo(event);	
			}
			// transactions
			var random = Math.floor((Math.random()*10)+1);
			for(var i = 1; i <= random; i++) {
				var outcome = ((i%2 == 0)?"OK":"KO");
				var event = new Event("trn"+i, "CMD", new Date(), "This is a local interaction/transaction performed against the Souliss cloud", outcome);
				events.addTransactionsInfo(event);	
			}
			// latencies
			var random = Math.floor((Math.random()*100)+1);
			for(var i = 1; i <= random; i++) {
				var value = Math.floor((Math.random()*10)+1);
				var latency = new Latency(value);
				value = Math.floor((Math.random()*100000)+1);
				var time = parseInt(latency.timestamp.getTime());
				time -= value;
				latency.timestamp = new Date(time);
				events.addLatency(latency);	
			}
			// sources
			var random = Math.floor((Math.random()*10)+1);
			var labels = ['Lights', 'Air Conditioners', 'Gates', 'Actuators', 'Refrigerator',
							'Hi-Fis', 'Players', 'PCs', 'TV', 'Owen'];
			for(var i = 1; i <= random; i++) {
				var percentage = Math.floor((Math.random()*100)+1);
				var source = new TrafficSource(labels[i], percentage);
				events.addSource(source);	
			}
			// return created events
			return events;
		}
	};
});

scomodo.factory('buildTopology', function() {
	// initializing the state
	return {
		init: function() {
			// generate the topology
			// build an area
			var area = new Area("area01", "Mark's appartment", "Residential Home, composed of 4 rooms, a garden and a garage", AreaType.HOUSE, geoLoc);
			// generate random geo location
			var lat = new Point(0.0, 40.8450, 0.0);
			var lng = new Point(14.2583, 0.0, 0.0);
			var geoLoc = new GeoLocation(lat, lng);
			// build a random number of environments
			var cntr = 0;
			var nrEnvironments = Math.floor((Math.random()*10)+1);
			for(var i = 0; i < nrEnvironments; i++) {
				var increment = Math.floor((Math.random()*0.01));
				var lat = new Point(0.0, 40.8450+increment, 0.0);
				var lng = new Point(14.2583+increment, 0.0, 0.0);
				var geoLoc = new GeoLocation(lat, lng);
				var environment = new Environment("env"+i, "Mark's Room #"+i, 0, EnvironmentType.ROOM, geoLoc);
				// build a random number of devices
				var nrDevices = Math.floor((Math.random()*10)+1);
				for(var j = 0; j < nrDevices; j++) {
					var status = Math.floor((Math.random()*100)+1);
					var health = Math.floor((Math.random()*100)+1);
					var device = new Device("dev"+(cntr+j), "Light device in the room", DeviceType.LIGHT, geoLoc, status, health, "hier");
					environment.addDevice(device);
					cntr += 1;
				}
				area.addEnvironment(environment);
			}
			// return the so built area	
			return area;
		}
	};
});

// factory
scomodo.factory('retrieveScenes', function() {
	//
	return {
		init: function() {
			// TODO : service call to retrieve stored data
			// generate fake scenes
			var scenes = new Scenes("scns1", "Test Scenes", "Souliss", "Souliss");
			var nrScenes = Math.floor((Math.random()*10)+1);
			for(var i = 0; i < nrScenes; i++) {
				var scene = new Scene("sce"+i, "Fake Scene"+i, "This is a fake scene, for testing purposes", 1, 2);
				var nrDevicesSetup = Math.floor((Math.random()*10)+1);
				for(var j = 0; j < nrDevicesSetup; j++) {
					var deviceState = Math.floor((Math.random()*100)+1);
					var sceneDevSetup = new SceneDeviceSetup('dev'+j, deviceState);	
					scene.addSceneSetup(sceneDevSetup);
				}
				scenes.addScene(scene);
			}
			//
			return scenes;	
		}
	};
});

// Services -------------------------------------------------------------------
scomodo.service('connectToSuliss', function(){
	
});

scomodo.service('disconnectFromSouliss', function(){
	
});

scomodo.service('forwardCommand', function(){
	
});

scomodo.service('retrieveUpdates', function(){
	
});

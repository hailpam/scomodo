/***
 * SCOMODO Project
 * 
 * Domain definition (by Data Items)
 * 
 * @author Paolo Maresca <plo.maresca@gmail.com>
 */

// ####################
// # Geo Location Data
// ####################

/**
 * Generic Point: x, y and z axis
 * @constructor
 */
function Point(x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;
}

/**
 * Generate a string version of this Object
 * @return {string} A string version that can be interpreted
 */
Point.prototype.toString = function() {
	/* String marshalling */
	return "{ \"x\":"+this.x+", \"y\":"+this.y+", \"z\":"+this.z+" }"
}

/**
 * Generate an object from a string representation
 * @param {string} A string representation
 * @return {Object} An Object instance
 */
Point.prototype.fromString = function(strPoint) {
	/* Object unmarshalling */
	if(typeof strPoint === 'string')
		var tmp = JSON.parse(strPoint);
	else
		var tmp = strPoint;
	var point = new Point(tmp['x'], tmp['y'], tmp['z']);
	return point;
}

/**
 * It allows to garbage collect this instance
 */
Point.prototype.dispose = function() {
	/* Disposing this Object instance */
	this.x = null;
	this.y = null;
	this.z = null;
}

/**
 * Geo Location: absolute referencing by GPS
 * @constructor
 */
function GeoLocation(latitude, longitude) {
	this.latitude = latitude;
	this.longitude = longitude;
}

/**
 * Generate a string version of this Object
 * @return {string} A string version that can be interpreted
 */
GeoLocation.prototype.toString = function() {
	/* String marshalling */
	return "{ \"latitude\":"+this.latitude.toString()+", \"longitude\":"+this.longitude.toString()+" }"
}

/**
 * Generate an object from a string representation
 * @param {string} A string representation
 * @return {Object} An Object instance
 */
GeoLocation.prototype.fromString = function(strGeoLoc) {
	/* Object unmarshalling */
	if(typeof strGeoLoc === 'string')
		var tmp = JSON.parse(strGeoLoc);
	else
		var tmp = strGeoLoc;
	var lat = tmp['latitude'];
	var lng = tmp['longitude'];
	var geoLocation = new GeoLocation(new Point(lat.x, lat.y, lat.z), 
										new Point(lng.x, lng.y, lng.z));
	return geoLocation;
}

/**
 * It allows to garbage collect this instance
 */
GeoLocation.prototype.dispose = function() {
	/* Disposing this Object instance */
	this.latitude = null;
	this.longitude = null;
}


// ####################
// # Scenes Definition
// ####################

/**
 * It abstracts a specific device configuration to be used by a Scene
 * @constructor
 * @param {string} Device unique identifier
 * @param {number} Device status defined by an integer number
 */
function SceneDeviceSetup(deviceId, status) {
	this.deviceId = deviceId;
	this.status = status;
}

/**
 * Generate a string version of this Object
 * @return {string} A string version that can be interpreted
 */
SceneDeviceSetup.prototype.toString = function() {
	/* String marshalling */
	return "{ \"deviceId\":\""+this.deviceId+"\", \"status\":"+this.status+" }"
}

/**
 * Generate an object from a string representation
 * @param {string} A string representation
 * @return {Object} An Object instance
 */
SceneDeviceSetup.prototype.fromString = function(strSceneSetup) {
	/* Object unmarshalling */
	var tmp = JSON.parse(strSceneSetup);
	var sceneDeviceSetup = new SceneDeviceSetup(tmp['deviceId'], tmp['status']);
	return sceneDeviceSetup;
}

/**
 * It allows to garbage collect this instance
 */
SceneDeviceSetup.prototype.dispose = function() {
	/* Disposing this Object instance */
	this.deviceId = null;
	this.status = null;
}

/**
 * It abstracts a Scene: a custom setup involving a well-defined set of devices
 * @constructor
 * 
 */
function Scene(identifier, label, description, areaId, environmentId) {
	// it's unique identifier
	this.identifier = identifier;
	// it's a label
	this.label = label;
	// it's a description
	this.description = description;
	// external reference to the Area
	this.areaId = areaId;
	// external reference to the Environment
	this.environmentId = environmentId;
	// list of settings, @private
	this.__listOfSettings = [];
}

/**
 * Add a device setting to the scene setup
 * @param {Object} A device setup to be added
 * @setter
 */
Scene.prototype.addSceneSetup = function(setup) {
	this.__listOfSettings.push(setup);
}

/**
 * Retrieve all setting associated to this Scene
 * @getter
 */
Scene.prototype.getSceneSettings = function() {
	return this.__listOfSettings;
}

/**
 * Generate a string version of this Object
 * @return {string} A string version that can be interpreted
 */
Scene.prototype.toString = function() {
	var strListOfSettings = "[";
	for(var i = 0; i < this.__listOfSettings.length; i++) {
		if(i > 0) 
			strListOfSettings += ", ";
		strListOfSettings += this.__listOfSettings[i].toString();
	}
	strListOfSettings += "]";
	/* String marshalling */
	return "{ \"identifier\":\""+this.identifier+"\", \"label\":\""+this.label+"\""
			+", \"description\":\""+this.description+"\""+", \"areaId\":"+this.areaId
			+", \"environmentId\":"+this.environmentId+", \"listOfSettings\": "+strListOfSettings+" }"
}

/**
 * Generate an object from a string representation
 * @param {string} A string representation
 * @return {Object} An Object instance
 */
Scene.prototype.fromString = function(strSceneSetup) {
	/* Object unmarshalling */
	if(typeof strSceneSetup === 'string')
		var tmp = JSON.parse(strSceneSetup);
	else
		var tmp = strSceneSetup;
	var scene = new Scene(tmp['identifier'], tmp['label'], tmp['description'],
										tmp['areaId'], tmp['environmentId']);
	var settings = tmp['listOfSettings'];
	if(settings == undefined)
		var settings = tmp['__listOfSettings'];
	for(var i = 0; i < settings.length; i++) {
		scene.addSceneSetup(new SceneDeviceSetup(settings[i].deviceId, settings[i].status));		
	}
	return scene;
}

/**
 * It allows to garbage collect this instance
 */
Scene.prototype.dispose = function() {
	/* Disposing this Object instance */
	this.identifier = null;
	this.label = null;
	this.description = null;
	this.areaId = null;
	this.environmentId = null;
	this.__listOfSettings = null;
}

/**
 * It embraces a list of scenes defined for a final user
 * @constructor
 */
function Scenes(identifier, label, description, userId) {
	this.identifier = identifier;
	this.label = label;
	this.description = description;
	this.userId = userId;
	this.__listOfScenes = [];
}

/**
 * Add a scene setup to the list of User's defined ones
 * @param {Object} A scene setup
 * @setter
 */
Scenes.prototype.addScene = function(scene) {
	this.__listOfScenes.push(scene);
}

/**
 * Retrieve the User's defined list of scenes
 * @getter
 */
Scenes.prototype.getListedScenes = function() {
	return this.__listOfScenes;
} 

/**
 * Generate a string version of this Object
 * @return {string} A string version that can be interpreted
 */
Scenes.prototype.toString = function() {
	var strListScenes = "[";
	for(var i = 0; i < this.__listOfScenes.length; i++) {
		if(i > 0)
			strListScenes += ", ";
		strListScenes += this.__listOfScenes[i].toString();
	}
	strListScenes += "]";
	/* String marshalling */
	return "{ \"identifier\":\""+this.identifier+"\", \"label\":\""+this.label+"\""
			+", \"description\":\""+this.description+"\""+", \"userId\":\""+this.userId+"\""
			+", \"listOfScenes\": "+strListScenes+" }"
}

/**
 * Generate an object from a string representation
 * @param {string} A string representation
 * @return {Object} An Object instance
 */
Scenes.prototype.fromString = function(strScenes) {
	/* Object unmarshalling */
	var tmp = JSON.parse(strScenes);
	var scenes = new Scenes(tmp['identifier'], tmp['label'], tmp['description'],
										tmp['userId']);
	var settings = tmp['listOfScenes'];
	for(var i = 0; i < settings.length; i++) {
		scenes.addScene(new Scene("", "", "", 0, 0).fromString(settings[i]));		
	}
	return scenes;
}

/**
 * It allows to garbage collect this instance
 */
Scenes.prototype.dispose = function() {
	/* Disposing this Object instance */
	this.identifier = null;
	this.label = null;
	this.description = null;
	this.userId = null;
	this.__listOfScenes = null;
}


// ######################
// # Programs definition : TODO
// ######################

/**
 * It defines a behaviour that must be implemented 
 * priodically
 * @constructor
 */
function Program() {
	// unique reference to the Area
	this.areaId = "";
	// unique identifier for this program
	this.identifier = "";
	// program's label
	this.label = "";
	// program's description
	this.description = "";
	// start validity date
	this.startValidity = "";
	// end validity date
	this.endValidity = "";
	// indicate whether or not the program is active
	this.active = false;
	// contain the scenes
	this.__scenes = [];
}

/**
 * Add a new Scene to the current Program
 * @setter
 */
Program.prototype.addScene = function(scene) {
	this.__scenes.push(scene);
}

/**
 * Retrieve the scenes defined for the current Program
 * @getter
 * @return {Array} An array of Scenes
 */
Program.prototype.getScenes = function() {
	return this.__scenes;
}

/**
 * Stringify the current instance
 * @setter
 * @return {string} A string representation of the current instance
 */
Program.prototype.toString = function() {
	/* marshalling */
	return JSON.stringify(this);
}

/**
 * Build a Program objest instance from a string representation
 * @param {string} A string representation of the current Program
 * @return {Object} A Program object instance
 */
Program.prototype.fromString = function(strProgram) {
	/* unmarshalling */
	if(typeof strProgram === 'string')
		var tmp = JSON.parse(strProgram);
	else
		var tmp = strProgram;
	var program = new Program();
	program.areaId = tmp['areaId'];
	program.identifier = tmp['identifier'];
	program.label = tmp['label'];
	program.description = tmp['description'];
	program.startValidity = tmp['startValidity'];
	program.endValidity = tmp['endValidity'];
	program.active = tmp['active'];
	var tmpScenes = tmp['__scenes'];
	for(var i = 0; i < tmpScenes.length; i++) {
		program.addScene(new Scene("", "", "", 1, 2).fromString(tmpScenes[i]));
	}
	return program;
}


/**
 * Encapsulate a List of Programs
 * @constructor 
 */
function Programs() {
	// user identifier: for who is defined?
	this.userId = "";
	// set of programs unique identifier
	this.identifier = "";
	// label
	this.label = "";
	// list of programs 
	this.__listOfPrograms = [];
}

/**
 * Add a Program to the list of Prgrams
 * @setter
 */
Programs.prototype.addProgram = function(program) {
	this.__listOfPrograms.push(program);
}

/**
 * Retrieve the list of Programs
 * @getter
 * @return {Array} A list of Programs 
 */
Programs.prototype.getPrograms = function(program) {
	return this.__listOfPrograms;
}

/**
 * Stringify the current instance
 * @return {string} A string representation of the current instance
 */
Programs.prototype.toString = function() {
	/* marshalling */
	return JSON.stringify(this);
}

/**
 * Deserialize an object instance from a string
 * @param {string} A string representation of a Programs object instance
 * @return {Object} A Programs object instance
 */
Programs.prototype.fromString = function(strPrograms) {
	/* unmarshalling */
	if(typeof strPrograms === 'string')
		var tmp = JSON.parse(strPrograms);
	else
		var tmp = strPrograms;
	var programs = new Programs();
	programs.userId = tmp['userId'];
	programs.identifier = tmp['identifier'];
	programs.label = tmp['label'];
	var tmpListOfPrograms = tmp['__listOfPrograms'];
	for(var i = 0; i < tmpListOfPrograms.length; i++) {
		programs.addProgram(new Program().fromString(tmpListOfPrograms[i]));
	}
	return programs;
}


// ###########################################
// # Area, Environment and Device definitions
// ###########################################

/**
 * Defining the Device Type as Enumeration
 * @enum 
 */
var DeviceType = {
	LIGHT: "LIGHT",
	ACTUATOR: "ACTUATOR",
	RECEIVER: "RECEIVER", 
	TRANSMITTER: "TRANSMITTER"
}

/**
 * Defining the Environment Type as Enumeration
 * @enum 
 */
var EnvironmentType = {
	ROOM: "ROOM",
	GARAGE: "GARAGE",
	GARDEN: "GARDEN",
	ROOF: "ROOF"
}

/**
 * Defining the Area Rype as Enumeration
 * @enum 
 */
var AreaType = {
	HOUSE: "HOUSE",
	OFFICE: "OFFICE",
	WAREHOUSE: "WAREHOUSE"
}

/**
 * It defines a device that can be managed
 * @constructor
 */
function Device(identifier, label, type, geoLocation, state, health, lastUpdate) {
	// device unique identifier
	this.identifier = identifier;
	// a convenience label
	this.label = label;
	// enumerative value defining univoquely the type
	this.type = type;
	// GPS location
	this.geoLocation = geoLocation;
	// device proper status
	this.state = state;
	// device health
	this.health = health;
	// last state update
	this.lastUpdate = lastUpdate;
}

/**
 * Generate a string version of this Object
 * @return {string} A string version that can be interpreted
 */
Device.prototype.toString = function() {
	/* marshalling */
	return "{ \"identifier\":\""+this.identifier+"\", \"label\":\""+this.label+"\""+", \"type\":\""+this.type+"\""
			+", \"geoLocation\":"+this.geoLocation.toString()+""+", \"state\":\""+this.state+"\""
			+", \"health\": \""+this.health+"\" "+", \"lastUpdate\": \""+this.lastUpdate+"\" }"
}

/**
 * Generate an object from a string representation
 * @param {string} A string representation
 * @return {Object} An Object instance
 */
Device.prototype.fromString = function(strDevice) {
	/* unmarshalling */
	if(typeof strDevice === 'string')
		var tmp = JSON.parse(strDevice);
	else
		var tmp = strDevice;
	var device = new Device(tmp['identifier'], tmp['label'], tmp['type'], 
							new GeoLocation(null, null).fromString(tmp['geoLocation']),
							tmp['state'], tmp['health'], tmp['lastUpdate']);
	return device;
}

/**
 * It allows to garbage collect this instance
 */
Device.prototype.dispose = function() {
	/* disposing this instance */
	this.identifier = null;
	this.label = null;
	this.type = null;
	this.geolocation = null;
	this.state = null;
	this.health = null;
	this.lastUpdate = nulls;
}


/**
 * It defines the environment which, in turn, contains severl different devices
 * @constructor
 */
function Environment(identifier, label, floor, type, geoLocation) {
	this.identifier = identifier;
	this.label = label;
	this.floor = floor;
	this.type = type;
	this.geoLocation = geoLocation;
	this.__devices = [];
}

/**
 * Add a device
 * @param {Object} An already defined device
 */
Environment.prototype.addDevice = function(device) {
	this.__devices.push(device);
}

/**
 * Retrieve the list of registered devices
 */
Environment.prototype.getDevices = function() {
	return this.__devices;
}

/**
 * Marshalling this instance
 */
Environment.prototype.toString = function() {
	var strDevices = "[ ";
	for(var i = 0; i < this.__devices.length; i++) {
		if(i > 0)
			strDevices += ", "
		strDevices += this.__devices[i].toString();
	}
	strDevices += " ]";
	/* marshalling */
	return "{ \"identifier\":\""+this.identifier+"\", \"label\":\""+this.label+"\""+", \"floor\":"+this.floor
			+", \"type\":\""+this.type+"\", \"geoLocation\":"+this.geoLocation.toString()+""
			+", \"devices\": "+strDevices+" }"
}

/**
 * Unmarshalling an instance
 * @param {string} A string representation of an Environment Object
 */
Environment.prototype.fromString = function(strEnv) {
	/* unmarshalling */
	if(typeof strEnv === 'string') 
		var tmp = JSON.parse(strEnv);
	else
		var tmp = strEnv;
	var tmpDevices = tmp['devices'];
	var environment = new Environment(tmp['identifier'], tmp['label'], tmp['floor'],
										tmp['type'], new GeoLocation(null, null).fromString(tmp['geoLocation']));
	for(var i = 0; i < tmpDevices.length; i++) {
		device = new Device("","",DeviceType.ACTUATOR,null, 0,0 ,"");
		environment.addDevice(device.fromString(tmpDevices[i]));
	}
	
	return environment;
}

/**
 * Disposing this instance
 */
Environment.prototype.dispose = function() {
	this.identifier = null;
	this.label = null;
	this.floor = null;
	this.type = null;
	this.geoLocation = null;
	this.__devices = null;
}

/**
 * It defines an area containing several different environments
 * @constructor
 */
function Area(identifier, label, description, type, geoLocation) {
	this.identifier = identifier;
	this.label = label;
	this.description = description;
	this.type = type;
	this.geoLocation = geoLocation;
	this.__environments = [];
}

/**
 * Add an environment to the list of contained ones
 * @param {Object} An environement instance
 * @setter
 */
Area.prototype.addEnvironment = function(environment) {
	this.__environments.push(environment);
}

/**
 * Retrieve the list of contained environments
 * @return {Array} An array of environments
 * @getter
 */
Area.prototype.getEnvironments = function() {
	return this.__environments;
}

/**
 * Marshallin an instance into a string
 */
Area.prototype.toString = function() {
	var strEnvs = "[ ";
	for(var i = 0; i < this.__environments.length; i++) {
		if(i > 0)
			strEnvs += ", ";
		strEnvs += this.__environments[i].toString();
	}
	strEnvs += " ]";
	/* marshalling */
	return "{ \"identifier\":\""+this.identifier+"\", \"label\":\""+this.label+"\""+", \"description\":\""+this.description+"\""
			+", \"type\":\""+this.type+"\", \"geoLocation\":"+this.geoLocation.toString()
			+", \"environments\": "+strEnvs+" }"
}

/**
 * Unmarshalling a string into an object instance
 */
Area.prototype.fromString = function(strArea) {
	/* unmarshalling */
	if(typeof strArea === 'string') 
		var tmp = JSON.parse(strArea);
	else
		var tmp = strArea;
	var tmpEnvs = tmp['environments'];
	var area = new Area(tmp['identifier'], tmp['label'], tmp['description'],
						tmp['type'], new GeoLocation(null, null).fromString(tmp['geoLocation']));
	for(var i = 0; i < tmpEnvs.length; i++) {
		area.addEnvironment(new Environment(null, null, null, null, null).fromString(tmpEnvs[i]));
	}
	return area;
}

/**
 * Set this instance as disposable
 */
Area.prototype.dispose = function() {
	this.identifier = null;
	this.label = null;
	this.description = null;
	this.type = null;
	this.geoLocation = null;
	this.__environments = null;
}


// ############
// # Settings 
// ############

/**
 * Defining System's Settings
 * @constructor
 */
function SystemSettings() {
	// polling frequency intended in Hz
	this.polling = 10; 
	// whether or not programs should be taken into consideration
	this.enablePrograms = false;
}

/**
 * Serialize a System Settings object to a String
 * 
 * @return {string} A string representation of this instance
 */
SystemSettings.prototype.toString = function() {
	/*stringify/serialize*/
	return JSON.stringify(this);
}

/**
 * Deserialize a System Settings object from a String
 * 
 * @param {string} A string representation of an object instance
 * @return {Object} A deserialized object instance (from a string) 
 */
SystemSettings.prototype.fromString = function(strSysSettings) {
	/*unstringify/deserialize*/
	return JSON.parse(strSysSettings);
}

/**
 * Defining Gateway's Settings
 * @constructor
 */
function GatewaySettings() {
	// remote Gateway's IP address
	this.ipAddress = "";
	// remote Gateway's Port
	this.ipPort = 0;
	// remote Gateway's Alias (DNS resolution)
	this.hostAlias = "";
	// remote Gateway number of attempts to get a connection
	this.nrOfAttempts = 3;
}

/**
 * Serialize this instance in a String
 * 
 * @return {string} A string serialized representation
 */
GatewaySettings.prototype.toString = function() {
	/*stringify/serialization*/
	return JSON.stringify(this);
}

/**
 * Deserialize and object instance from a String
 * 
 * @return {Object} A deserialized object instance
 */
GatewaySettings.prototype.fromString = function(stGatSettings) {
	/*unstringify/deserialization*/
	return JSON.parse(stGatSettings);
}


// ############################
// # System Status Definition
// ############################

/**
 * It abstracts a Latency measure
 * @constructor
 */
function Latency(value) {
	this.timestamp = new Date();
	this.value = value;
}

Latency.prototype.toString = function() {
	/* Stringifying */
	return "{ \"timestamp\": \""+this.timestamp.toGMTString()+"\", \"value\": "+this.value+" }";
}

/**
 * It abstracts a recent Activity
 * @constructor
 */
function Activity(type, description) {
	this.timestamp = new Date();
	this.type = type;
	this.description = description;
}

Activity.prototype.toString = function() {
	/* Stringifying */
	return "{ \"timestamp\": \""+this.timestamp.toGMTString()+"\", \"type\": \""+this.type
				+"\", \"description\": \""+this.description+"\" }";
}

/**
 * It abstracs a Transaction
 * @constructor
 */
function Transaction(nr, outcome) {
	this.date = new Date().toDateString();
	this.time = new Date().toTimeString();
	this.nr = nr;
	this.outcome = outcome;
}

Transaction.prototype.toString = function() {
	/* Stringifying */
	return "{ \"nr\": "+this.nr+", \"date\": \""+this.date+
				"\", \"time\": \""+this.time+"\", \"outcome\": \""+this.outcome+"\" }"
}

/**
 * It abstracts a Traffic source 
 * @constructor
 */
function TrafficSource(id, percentage) {
	this.id = id; 
	this.percentage = percentage;
}

TrafficSource.prototype.toString = function() {
	/* Stringifying */ 
	return "{ \"id\": \""+this.id+"\", \"percentage\": "+this.percentage+" }"
}

/**
 * It collects System Information, in particular status information
 * @constructor
 */
function SystemStatus() {
	// whether or not is connected
	this.connected = false;
	// ping based, in ms
	this.averageLatency = 0;
	// nr of measurements
	this.latencyMeasurements = 0;
	// an aggregated view of all latencies experienced (to be updated on request-basis)
	this.__latencies = [];
	// an aggregated view of all recent activities
	this.__recentActivities = [];
	// recent commands forwarded (since the beginning of this session)
	this.__recentTransactions = [];
	// from/to the traffic is relevated
	this.__trafficSources = [];	
}

SystemStatus.prototype.addActivity =  function(activity) {
	/* Setter */
	this.__recentActivities.push(activity);
}

SystemStatus.prototype.addTransaction =  function(transaction) {
	/* Setter */
	this.__recentTransactions.push(transaction);
}

SystemStatus.prototype.addTrafficSource =  function(trafficSource) {
	/* Setter */
	this.__trafficSources.push(trafficSource);	
}

SystemStatus.prototype.addLatency =  function(latency) {
	/* Setter */
	this.__latencies.push(latency);
}

SystemStatus.prototype.getActivities =  function() {
	/* Getter */
	return this.__recentActivities;
}

SystemStatus.prototype.getTransactions =  function() {
	/* Getter */
	return this.__recentTransactions;
}

SystemStatus.prototype.getTrafficSources =  function() {
	/* Getter */
	return this.__trafficSources;
}

SystemStatus.prototype.getLatencies =  function() {
	/* Getter */
	return this.__latencies;
}

SystemStatus.prototype.toString = function() {
	/* Stringifying */
	return JSON.stringify(this);
}

SystemStatus.prototype.fromString = function(strSysSettings) {
	/* unstringifying, not umarshalling */
	// TODO : deserialize objects, like Latency, and so on
	return JSON.parse(strSysSettings);
}


// ##########################
// # Dashboard Summary Event
// ##########################

/**
 * Define a Dashboard event
 * 
 * @param {String} identifier
 * @param {String} label
 * @param {Date} timestamp
 * @param {String} description
 * @param {String} other
 */
function Event(identifier, label, timestamp, description, other) {
	this.identifier = identifier;
	this.label = label;
	this.timestamp = timestamp;
	this.description = description;
	this.other = other;
}

/**
 * Serialize an Event as a String 
 * 
 * @return {Object} A string representation of this Event
 */
Event.prototype.toString = function() {
	return JSON.stringify(this);
}

/**
 * Deserialize an Event from a string
 * 
 * @param {String} A serialized representation of an Event
 * @return {Object} Deserialized Event
 */
Event.prototype.fromString = function(strEvent) {
	var tmp = JSON.parse(strEvent);
	var event = new Event("", "", new Date(), "", "");
	event.identifier = tmp['identifier'];
	event.label = tmp['label'];
	event.timestamp = tmp['timestamp'];
	event.description = tmp['description'];
	event.other = tmp['other'];
	return event;
}

/**
 * Define a container for all the events tracked by the dashboard
 * 
 */
function Events() {
	this.__devicesInfo = [];
	this.__warningsInfo = [];
	this.__errorsInfo = [];
	this.__interactionsInfo = [];
	this.__sourcesInfo = [];
	this.__activitiesInfo = [];
	this.__transactionsInfo = [];
	this.__latencies = [];
	this.__sources = [];
}

/**
 * Add a Device Info Event
 * 
 * @param {Object} event An Event containing a device info
 */
Events.prototype.addDevicesInfo = function(event) {
	this.__devicesInfo.push(event);
}

/**
 * Remove an amount of oldest Device Info Events 
 * 
 * @param {Number} howMany The number of events to discard
 */
Events.prototype.deleteDevicesInfo = function(howMany) {
	for(var i = 0; i < howMany; i++) {
		this.__devicesInfo.splice(i, 1);
	}
}

/**
 * Retrieve the full list of events
 * 
 * @return {Object} A list of this kind of events
 */
Events.prototype.retrieveDevicesInfo = function() {
	return this.__devicesInfo;
}

/**
 * Return the actual number of devices info stored
 * 
 * @return {Number} Actual number of info stored
 */
Events.prototype.nrOfDevicesInfo = function() {
	return this.__devicesInfo.length;
}

/**
 * Add a Warning Info Event
 * 
 * @param {Object} event An Event containing a wanning info
 */
Events.prototype.addWarningsInfo = function(event) {
	this.__warningsInfo.push(event);
}

/**
 * Remove an amount of oldest Warning Info Events 
 * 
 * @param {Number} howMany The number of events to discard
 */
Events.prototype.deleteWarningsInfo = function(howMany) {
	for(var i = 0; i < howMany; i++) {
		this.__warningsInfo.splice(i, 1);
	}
}

/**
 * Retrieve the full list of events
 * 
 * @return {Object} A list of this kind of events
 */
Events.prototype.retrieveWarningsInfo = function() {
	return this.__warningsInfo;
}

/**
 * Return the actual number of warning info stored
 * 
 * @return {Number} Actual number of info stored
 */
Events.prototype.nrOfWarningsInfo = function() {
	return this.__warningsInfo.length;
}

/**
 * Add a Error Info Event
 * 
 * @param {Object} event An Event containing an error info
 */
Events.prototype.addErrorsInfo = function(event) {
	this.__errorsInfo.push(event);
}

/**
 * Remove an amount of oldest Errors Info Events 
 * 
 * @param {Number} howMany The number of events to discard
 */
Events.prototype.deleteErrorsInfo = function(howMany) {
	for(var i = 0; i < howMany; i++) {
		this.__errorsInfo.splice(i, 1);
	}
}

/**
 * Retrieve the full list of events
 * 
 * @return {Object} A list of this kind of events
 */
Events.prototype.retrieveErrorsInfo = function() {
	return this.__errorsInfo;
}

/**
 * Return the actual number of error info stored
 * 
 * @return {Number} Actual number of info stored
 */
Events.prototype.nrOfErrorsInfo = function() {
	return this.__errorsInfo.length;
}

/**
 * Add an Interaction Info Event
 * 
 * @param {Object} event An Event containing an interaction info
 */
Events.prototype.addInteractionsInfo = function(event) {
	this.__interactionsInfo.push(event);
}

/**
 * Remove an amount of oldest Interactions Info Events 
 * 
 * @param {Number} howMany The number of events to discard
 */
Events.prototype.deleteInteractionsInfo = function(howMany) {
	for(var i = 0; i < howMany; i++) {
		this.__interactionsInfo.splice(i, 1);
	}
}

/**
 * Retrieve the full list of events
 * 
 * @return {Object} A list of this kind of events
 */
Events.prototype.retrieveInteractionsInfo = function() {
	return this.__interactionsInfo;
}

/**
 * Return the actual number of interaction info stored
 * 
 * @return {Number} Actual number of info stored
 */
Events.prototype.nrOfInteractionsInfo = function() {
	return this.__interactionsInfo.length;
}

/**
 * Add a Source Info Event
 * 
 * @param {Object} event An Event containing a source info
 */
Events.prototype.addSourcesInfo = function(event) {
	this.__sourcesInfo.push(event);
}

/**
 * Remove an amount of oldest Source Info Events 
 * 
 * @param {Number} howMany The number of events to discard
 */
Events.prototype.deleteSourcesInfo = function(howMany) {
	for(var i = 0; i < howMany; i++) {
		this.__sourcesInfo.splice(i, 1);
	}
}

/**
 * Retrieve the full list of events
 * 
 * @return {Object} A list of this kind of events
 */
Events.prototype.retrieveSourcesInfo = function() {
	return this.__sourcesInfo;
}

/**
 * Return the actual number of source info stored
 * 
 * @return {Number} Actual number of info stored
 */
Events.prototype.nrOfSourcesInfo = function() {
	return this.__sourcesInfo.length;
}

/**
 * Add a Activity Info Event
 * 
 * @param {Object} event An Event containing an activity info
 */
Events.prototype.addActivitiesInfo = function(event) {
	this.__activitiesInfo.push(event);
}

/**
 * Remove an amount of oldest Activity Info Events 
 * 
 * @param {Number} howMany The number of events to discard
 */
Events.prototype.deleteActivitiesInfo = function(howMany) {
	for(var i = 0; i < howMany; i++) {
		this.__activitiesInfo.splice(i, 1);
	}
}

/**
 * Retrieve the full list of events
 * 
 * @return {Object} A list of this kind of events
 */
Events.prototype.retrieveActvitiesInfo = function() {
	return this.__activitiesInfo;
}

/**
 * Return the actual number of activity info stored
 * 
 * @return {Number} Actual number of info stored
 */
Events.prototype.nrOfActivitiesInfo = function() {
	return this.__activitiesInfo.length;
}

/**
 * Add a Transaction Info Event
 * 
 * @param {Object} event An Event containing a transaction info
 */
Events.prototype.addTransactionsInfo = function(event) {
	this.__transactionsInfo.push(event);
}

/**
 * Remove an amount of oldest Transaction Info Events 
 * 
 * @param {Number} howMany The number of events to discard
 */
Events.prototype.deleteTransactionsInfo = function(howMany) {
	for(var i = 0; i < howMany; i++) {
		this.__transactionsInfo.splice(i, 1);
	}
}

/**
 * Retrieve the full list of events
 * 
 * @return {Object} A list of this kind of events
 */
Events.prototype.retrieveTransactionsInfo = function() {
	return this.__transactionsInfo;
}

/**
 * Return the actual number of transaction info stored
 * 
 * @return {Number} Actual number of info stored
 */
Events.prototype.nrOfTransactionsInfo = function() {
	return this.__transactionsInfo.length;
}

/**
 * Add a Latency Event
 * 
 * @param {Object} event An Event containing a latency
 */
Events.prototype.addLatency = function(event) {
	this.__latencies.push(event);
}

/**
 * Remove an amount of oldest Latency Events 
 * 
 * @param {Number} howMany The number of events to discard
 */
Events.prototype.deleteLatencies = function(howMany) {
	for(var i = 0; i < howMany; i++) {
		this.__latencies.splice(i, 1);
	}
}

/**
 * Retrieve the full list of events
 * 
 * @return {Object} A list of this kind of events
 */
Events.prototype.retrieveLatencies = function() {
	return this.__latencies;
}

/**
 * Return the actual number of latency event stored
 * 
 * @return {Number} Actual number of events stored
 */
Events.prototype.nrOfLatencies = function() {
	return this.__latencies.length;
}

/**
 * Add a Source Event
 * 
 * @param {Object} event An Event containing a source event
 */
Events.prototype.addSource = function(event) {
	this.__sources.push(event);
}

/**
 * Remove an amount of oldest Source Events 
 * 
 * @param {Number} howMany The number of events to discard
 */
Events.prototype.deleteSources = function(howMany) {
	for(var i = 0; i < howMany; i++) {
		this.__sources.splice(i, 1);
	}
}

/**
 * Retrieve the full list of events
 * 
 * @return {Object} A list of this kind of events
 */
Events.prototype.retrieveSources = function() {
	return this.__sources;
}

/**
 * Return the actual number of surce events stored
 * 
 * @return {Number} Actual number of events stored
 */
Events.prototype.nrOfSources = function() {
	return this.__sources.length;
}

/**
 * Transform stored latencies in a specific format for Charts 
 * 
 * @return {Object} Latencies' specific representation
 */
Events.prototype.latenciesToChartData = function() {
	var data = [];
	for(var i = 0; i < this.__latencies.length; i++) {
		var latency = {timestamp: '', value: 0.0}; 
		latency.timestamp = '';
		latency.timestamp += this.__latencies[i].timestamp.getFullYear();
		latency.timestamp += '-';
		latency.timestamp += (parseInt(this.__latencies[i].timestamp.getMonth())+1);
		latency.timestamp += '-';
		latency.timestamp += this.__latencies[i].timestamp.getDate();
		latency.timestamp += ' ';
		latency.timestamp += this.__latencies[i].timestamp.getHours();
		latency.timestamp += ':';
		latency.timestamp += this.__latencies[i].timestamp.getMinutes();
		latency.timestamp += ':';
		latency.timestamp += this.__latencies[i].timestamp.getSeconds();
		latency.value = this.__latencies[i].value;
		data.push(latency);
	}
	return data;
}

/**
 * Transform stored sources of data in a specific format for Charts
 * 
 * @return {Object} Sources' specific representation
 */
Events.prototype.sourcesToChartData = function() {
	var data = [];
	// resolve data sources as many devices
	for(var i = 0; i < this.__sources.length; i++) {
		var source = {label: '', value: 0};
		source.label = this.__sources[i].id;
		source.value = this.__sources[i].percentage;
		data.push(source);
	}
	return data;
}


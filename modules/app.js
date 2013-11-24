/**
 * SCOMODO (Souliss COntrol and MOnitoring DashbOard) Dashboard Web Application.
 * 
 * @author   Paolo Maresca <plo.maresca@gmail.com>
 * @version  1.0
 * 
 */

// defining SCOMODO Application
var scomodo = angular.module('scomodo', ['ui.bootstrap']);

// setting Routes
scomodo.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/home/:loggedUser', {
		controller: 'HomeController',
		templateUrl: 'home/home.tpl.html'		
	}).when('/cloud/:loggedUser',{
		controller: 'CloudController',
		templateUrl: 'cloud/cloud.tpl.html'	
	}).when('/scenes/:loggedUser', {
		controller: 'ScenesController',
		templateUrl: 'scenes/scenes.tpl.html'
	}).when('/programs/:loggedUser', {
		controller: 'ProgramsController',
		templateUrl: 'programs/programs.tpl.html'
	}).when('/details/:type', {
		controller: 'DetailsController',
		templateUrl: 'details/details.tpl.html'
	}).when('/device/:devId&:envId', {
		controller: 'DeviceController',
		templateUrl: 'device/device.tpl.html'
	}).when('/scene', {
		controller: 'SceneController',
		templateUrl: 'scene/scene.tpl.html'
	}).when('/scene/:sceneId', {
		controller: 'SceneController',
		templateUrl: 'scene/scene.tpl.html'
	}).otherwise({redirectTo: '/home/:loggedUser'});
}]);

// running the Main Method and working with the Root Scope
scomodo.run(function($rootScope) {
	
	$rootScope.today = new Date();
	$rootScope.dateTime = new Date();
	// retrieving settings
	$rootScope.isDebugMode = Settings.debug;
	$rootScope.logLevel = Settings.log;
	$rootScope.appName = Settings.appName;
	$rootScope.appVersion = Settings.appVersion;
	$rootScope.newUsername = Settings.appUser;
	// preparing the notification board
	$rootScope.notificationsNr = 0;
	$rootScope.notifications = [];
	// dashboard events
	$rootScope.events = new Events();
	// dashboard events
	$rootScope.topology = null;
	// dashboard initialized
	$rootScope.inited = false;
	// dashboard initialized
	$rootScope.connected = false;
	// registered scenes
	$rootScope.scenes = [];
});

// Main controller
scomodo.controller('MainController', ['$scope', function($scope) {
	// alerts array
	$scope.alerts = [];
	// connection
	$scope.conStatus = false;
	// breadcrumb
	$scope.navPath = [{class: "active", icon: "fa fa-tachometer", name: "Dashboard"}];
	
	$scope.updateBreadcrumb = function(section) {
		if(section == "dashboard") {
			$scope.navPath[0].class = "active";
			$scope.navPath.pop();
		}else {
			$scope.navPath[0].class = "";
			if($scope.navPath.length > 1) $scope.navPath.pop(); 
			if(section == "cloud") 
				$scope.navPath.push({class: "active", icon: "fa fa-cloud", name: "Cloud of Things"});
			else if	(section == "scenes")
				$scope.navPath.push({class: "active", icon: "fa fa-lightbulb-o", name: "Scenes"});
			else if (section == "programs")
				$scope.navPath.push({class: "active", icon: "fa fa-cogs", name: "Programs"});
			else if (section == "details")
				$scope.navPath.push({class: "active", icon: "fa fa-list-alt", name: "Details"});
		}
	}
}]);

// Navigation controller
scomodo.controller('NavController', ['$scope', '$rootScope', 'buildTopology', function($scope, $rootScope, buildTopology) {
	
	
	$scope.clearNotifications = function() {
		$scope.notificationsNr = 0;
		$scope.notifications = [];
	};
	
	$scope.connect = function() {
		if($scope.conStatus == true) {
			$scope.alerts.push({type: 'error', msg: "Connection already estabilished to Souliss Network."});
			$scope.notifications.push({timestamp: new Date(), message: "Error: Connection already Estabilished."});
		}else {
			$scope.conStatus = true;
			$rootScope.connected = true;
		// TODO: call service to connect to Souliss
		$rootScope.topology = buildTopology.init();
		$scope.alerts.push({type: 'success', msg: "Connection successfully estabilished to Souliss Network!"});
		$scope.notifications.push({timestamp: new Date(), message: "Connection Estabilished!"});	
		}
		$scope.notificationsNr = $scope.notifications.length;
	};
	
	$scope.disconnect = function() {
		if($scope.conStatus == false) {
			$scope.alerts.push({type: 'error', msg: "Already disconnected successfully from Souliss Network."});
			$scope.notifications.push({timestamp: new Date(), message: "Error: Already Disconnected."});
		}else {
			$scope.conStatus = false;
			$rootScope.connected = false;
		// TODO: call service to disconnect from Souliss
		$scope.alerts.push({type: 'warning', msg: "Disconnected successfully from Souliss Network!"});
		$scope.notifications.push({timestamp: new Date(), message: "Connection Released!"});	
		}
		$scope.notificationsNr = $scope.notifications.length;
	};
	
}]);

// Page controller
scomodo.controller('PageController', ['$scope', '$timeout', function($scope, $timeout) {
	$scope.dateTime = new Date();
	
	var updateDateTime = function() {
		$scope.dateTime = new Date();
	};
	
	var timer = setInterval(function() {
		$scope.$apply(updateDateTime);
	}, 1000);
	
	$scope.addAlert = function() {
		$scope.alerts.push({type: 'success', msg: "Another alert!"});
	};
	
	$scope.closeAlert = function(index) {
	   $scope.alerts.splice(index, 1);
	};
}]);


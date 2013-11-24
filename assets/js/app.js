/**
 * @author Paolo Maresca
 */

// defining the application
scomodo = angular.module('scomodo', ['ui.bootstrap']);

// setting routes
scomodo.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/home/:loggedUser', {
		controller: 'HomeController',
		templateUrl: 'home/home.tpl.html'		
	}).when('/about/:loggedUser', {
		controller: 'AboutController',
		templateUrl: 'about/about.tpl.html'
	}).when('/cloud/:loggedUser',{
		controller: 'HomeController',
		templateUrl: 'cloud/cloud.tpl.html'	
	}).otherwise({redirectTo: '/'});
}]);

// running the main method and working with the Root Scope
scomodo.run(function($rootScope) {
	$rootScope.today = new Date();
	$rootScope.dateTime = new Date();
	$rootScope.appName = 'SCOMODO Dashboard'
	$rootScope.newUsername = '';
	$rootScope.notificationsNr = 0;
	$rootScope.notifications = [];
});

// defining a Parent Controller (it works with inheritance)
scomodo.controller("PlayerController", ['$scope', function($scope) {
	$scope.dateTime = new Date();
	
	var updateDateTime = function() {
		$scope.dateTime = new Date();
	};
	
	var timer = setInterval(function() {
		$scope.$apply(updateDateTime);
	}, 1000);
	
}]);

// defining a Child Controller (it inherits parents' attributes)
scomodo.controller("RelatedController",['$scope', function($scope) {
	
	$scope.count = 0;
	
	$scope.add = function(amount) {
		$scope.count += amount;
	};
	
	$scope.remove = function() {
		$scope.count -= 1;
	};
	
}]);

// testing AJAX calls: remember to inject in your controlle the service $http, as $scope
scomodo.controller("RequestController", ['$scope', '$http', function($scope, $http) {
	$scope.results = "Uninitialized";
	
	$scope.retrieve = function() {
		$http({
			method: 'JSONP',
			url: 'http://api.openbeerdatabase.com/v1/beers.json?callback=JSON_CALLBACK'
		}).success(function(data, status, headers, config) {
			$scope.results = data;
		}).error(function(data, status, headers, config) {
			alert("status:"+status+", error:"+data);
		});
	};
}]);

// defining a service (which is consistently maintained across the routings)
// angular.module('scomodo.services', []).factory(
	// 'gitHubService', ['$http', function($http) {
// 	
	// var doRequest = function(username, path) {
		// $http({
			// method: 'JSONP',
			// url: 'https://api.github.com/users/' + username + '/' + path + '?callback=JSON_CALLBACK'
		// });
	// }
// 	
	// return {
		// events: function(username) {return doRequest(username, 'events');},
	// };
// 		
// }]);

// define a specific controller using that service (the binding is done agains the controller)
scomodo.controller('ServiceController', ['$scope', '$http', function($scope, $http) {
	
	$scope.retEvents = "Nothing";
	$scope.path = "jtelnetserver";
	
	$scope.gitHubEvents = function(username) {
		$http({
			method: 'JSONP',
			url: 'https://api.github.com/users/' + username + '/jtelnetserver?callback=JSON_CALLBACK'
		}).success(function(data, status, heades, config) {
			$scope.retEvents = data;
		}).error(function(data, status, heades, config) {
			alert("status:"+status+", error:"+data);
		});
	};
	
}]);


// working with routes
scomodo.controller('HomeController', ['$scope', '$routeParams', function($scope, $routeParams) {
	$scope.loggedUser = $routeParams.loggedUser;
}]);


// working with routes
scomodo.controller('AboutController', ['$scope', '$routeParams', function($scope, $routeParams) {
	$scope.loggedUser = $routeParams.loggedUser;
}]);


// working with routes
scomodo.controller('ViewController', ['$scope', function($scope) {
	
}]);

// working with alerts
scomodo.controller('AlertsController', ['$scope', function($scope) {
	$scope.alerts = [];
	
	$scope.addAlert = function() {
		$scope.alerts.push({type: 'success', msg: "Another alert!"});
	};
	
	$scope.closeAlert = function(index) {
	   $scope.alerts.splice(index, 1);
	};
}]);


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
		}
	}
}]);

// Navigation controller
scomodo.controller('NavController', ['$scope', function($scope) {
	
	
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
		// TODO: call service to connect to Souliss
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


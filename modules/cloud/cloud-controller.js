
// Cloud Page Controller
scomodo.controller('CloudController', ['$scope', '$rootScope','$routeParams', function($scope, $rootScope, $routeParams) {
	if(!$rootScope.connected) {
		$scope.detailInfo = "Please, Connect to Souliss! Once connected, the following panel lets you have a structured view of connected devices in the Souliss' network";
		$scope.detailFooter = "Once connected: Hierarchical presentation of the Souliss' network";
		$scope.areaLabel = "";
		$scope.environments = [];
		// 
		$scope.devices = 0;
		return;
	}
	// 
	$scope.loggedUser = $routeParams.loggedUser;
	//
	$scope.detailInfo = "The following panel lets you have a structured view of connected devices in the Souliss' network";
	$scope.detailFooter = "Hierarchical presentation of the Souliss' network";
	//
	topology = $rootScope.topology;
	//
	$scope.areaLabel = topology.label;
	$scope.environments = [];
	var cntr = 0;
	for(var i = 0; i < topology.getEnvironments().length; i++) {
		var label = topology.getEnvironments()[i].label;
		var devices = topology.getEnvironments()[i].getDevices();
		var tmp = [];
		for(var j = 0; j< devices.length; j++) {
			tmp.push({id: devices[j].identifier, type: devices[j].type, label: devices[j].label, status: devices[j].state});
			cntr += 1;
		}
		var environment = { id: topology.getEnvironments()[i].identifier, name: label, shown: false, devices: tmp, size: devices.length };
		$scope.environments.push(environment);
	}
	// 
	$scope.devices = cntr;
	
	$scope.toggle = function(env) {
		for(var i = 0; i < $scope.environments.length; i++) 
			if($scope.environments[i].name == env)
				$scope.environments[i].shown = !$scope.environments[i].shown;
	}
}]);

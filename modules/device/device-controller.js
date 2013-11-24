
// Details Controller
scomodo.controller('DeviceController', ['$scope', '$rootScope', '$routeParams', function($scope, $rootScope, $routeParams) {
	// retrieving Device and Environment Id
	$scope.deviceId = $routeParams.devId;
	$scope.environmentId = $routeParams.envId;
	$scope.detailInfo = "The set of panels herebelow allows you to take the full control of your device: interact with it!";
	// retrieving device and environment
	area = $rootScope.topology;
	environments = area.getEnvironments();
	for(var i = 0; i < environments.length; i++) {
		if(environments[i].identifier == $routeParams.envId) {
			$scope.env = environments[i];
			devices = environments[i].getDevices();
			for(j = 0; j < devices.length; j++) {
				if(devices[j].identifier == $routeParams.devId) {
					$scope.dev = devices[i];		
				}
			} 
		}
	}
	// charting the status
	data = [
		{label: "Current Status", value: parseInt($scope.dev.state)},
	    {label: "Still available", value: parseInt(100 - $scope.dev.state)}
	]
	var deviceStatus = Morris.Donut({
	  element: 'deviceStatus',
	  data: data,
	});
	//
	$scope.onOff = false;
	if($scope.dev.state > 0) {
		$scope.devStatus = "active/working";
		$scope.onOff = true;
	} else {
		$scope.devStatus = "disabled/waiting";
	}
	
	$scope.toggle = function() {
		$scope.onOff = !$scope.onOff;
		console.log($scope.onOff);
		if($scope.onOff) 
			$scope.devStatus = "active/working";
		else
			$scope.devStatus = "disabled/waiting";
	};
	
	$scope.increment = function() {
		$scope.dev.state += 1;
		// repaint the chart
		data = [
			{label: "Current Status", value: parseInt($scope.dev.state)},
		    {label: "Still available", value: parseInt(100 - $scope.dev.state)}
		]
		Morris.Donut({
		  element: 'deviceStatus',
		  data: data,
		});
		}
	
	$scope.decrement = function() {
		$scope.dev.state -= 1;
		// repaint the chart
		data = [
			{label: "Current Status", value: parseInt($scope.dev.state)},
		    {label: "Still available", value: parseInt(100 - $scope.dev.state)}
		]
		Morris.Donut({
		  element: 'deviceStatus',
		  data: data,
		});
	}
	
	$scope.modeAuto = function() {
		// depend on device
		$scope.dev.state = 50;
		data = [
			{label: "Current Status", value: parseInt($scope.dev.state)},
		    {label: "Still available", value: parseInt(100 - $scope.dev.state)}
		]
		Morris.Donut({
		  element: 'deviceStatus',
		  data: data,
		});
	}
	
}]);
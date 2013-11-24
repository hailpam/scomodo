
// Home Page Controller
scomodo.controller('HomeController', ['$scope', '$rootScope', '$routeParams', 'initializeDashboard', function($scope, $rootScope, $routeParams, initializeDashboard) {
	// retrieving the type from route params
	$scope.detailType = $routeParams.type;
	// initialising data from Factory
	if(!$rootScope.inited) {
		$rootScope.events = initializeDashboard.init();
		$rootScope.inited = true;
	}
	// setting up the scope
	$scope.devices = $rootScope.events.nrOfDevicesInfo();
	$scope.warnings = $rootScope.events.nrOfWarningsInfo();
	$scope.errors = $rootScope.events.nrOfErrorsInfo();
	$scope.operations = $rootScope.events.nrOfInteractionsInfo();
	$scope.activities = $rootScope.events.retrieveActvitiesInfo();
	$scope.showActivities = (($scope.activities.length > 0)?true:false);
	$scope.transactions = $rootScope.events.retrieveTransactionsInfo();
	$scope.showTransactions = (($scope.transactions.length > 0)?true:false);
	
	// charting latencies
	var latencies = new Morris.Area({
	  element: 'pingLatency',
	  data: $rootScope.events.latenciesToChartData(),
	  xkey: 'timestamp',
	  ykeys: ['value'],
	  labels: ['Latency [ms]']
	});
	
	// charting traffic sources
	Morris.Donut({
	  element: 'trafficSources',
	  data: $rootScope.events.sourcesToChartData(),
	});
	
	// to update the chart
	var updateLatencyChart = function() {
		// chart every second
		var random = Math.floor((Math.random()*10)+1);
		var latency = new Latency(random);
		$rootScope.events.addLatency(latency);
		// charting latencies
		latencies.setData($rootScope.events.latenciesToChartData());
	};
	
	var timer = setInterval(function() {
		$scope.$apply(updateLatencyChart);
	}, Settings.resTimePollPeriod);
	
}]);

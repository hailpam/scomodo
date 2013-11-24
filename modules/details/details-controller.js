
// Details Controller
scomodo.controller('DetailsController', ['$scope', '$routeParams', function($scope, $routeParams) {
	// temp variables
	var type = "";
	var cardinality = 0;
	var info = "";
	var footer = "";
	var details = [];
	// interpreting
	if($routeParams.type == "devices") {
		 type = "Connected Devices";
		 cardinality = $scope.events.nrOfDevicesInfo();
		 info = "The following panel provides the most relevant informations about the Souliss' Cloud connected devices";
		 footer = "Devices related info displayed";
		 details = $scope.events.retrieveDevicesInfo();
	} else if($routeParams.type == "warnings") {
		type = "Warnings";
		cardinality = $scope.events.nrOfWarningsInfo();
		info = "The following panel provides the most relevant warning(s) from the Souliss' Cloud";
		footer = "Warnings related info displayed";
		details = $scope.events.retrieveWarningsInfo();
	} else if($routeParams.type == "errors") {
		type = "Errors";
		cardinality = $scope.events.nrOfErrorsInfo();
		info = "The following panel provides the most relevant error(s) from the Souliss' Cloud";
		footer = "Errors related info displayed";
		details = $scope.events.retrieveErrorsInfo();
	} else if($routeParams.type == "operations") {
		type = "Successful Operations";
		cardinality = $scope.events.nrOfInteractionsInfo();
		info = "The following panel provides the most relevant interaction(s) from the Souliss' Cloud";
		footer = "Operations related info displayed";
		details = $scope.events.retrieveInteractionsInfo();
	} else if($routeParams.type == "activities") {
		type = "Recent Activities";
		cardinality = $scope.events.nrOfActivitiesInfo();
		info = "The following panel provides the most relevant activity(ies) registered in the Souliss' Cloud";
		footer = "Activities related info displayed";
		details = $scope.events.retrieveActvitiesInfo();
	} else if($routeParams.type == "sources") {
		type = "Traffic Sources";
		cardinality = $scope.events.nrOfSourcesInfo();
		info = "The following panel provides the most relevant information about traffic sources of the Souliss' Cloud";
		footer = "Traffic Sources related info displayed";
		details = $scope.events.retrieveSourcesInfo();
	} else if($routeParams.type == "transactions") {
		type = "Latest Transactions";
		cardinality = $scope.events.nrOfTransactionsInfo();
		info = "The following panel provides the most relevant transaction(s) accomplished towards the Souliss' Cloud";
		footer = "Transactions related info displayed";
		details = $scope.events.retrieveTransactionsInfo();
	}
	$scope.detailType = type;
	$scope.detailNr = cardinality;
	$scope.detailInfo = info;
	$scope.detailFooter = footer;
	$scope.details = details;
	$scope.showDetails = ((details.length > 0)?true:false);
}]);
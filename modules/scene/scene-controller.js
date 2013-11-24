
// Scene Controller
scomodo.controller('SceneController', ['$scope', '$rootScope', '$location', '$routeParams', function($scope, $rootScope, $location,$routeParams) {
	//
	var sceneId = $routeParams.sceneId;
	if(sceneId)
		alert(sceneId); 
	// 
	$scope.detailInfo = "In this section you can Create (from scratch) or Edit your Scene according to your needs: a Scene consists in a set of automated commands to be forwarded against your Souliss network"
	$scope.detailFooter = "Define your needs in terms of automated multiple/aggregated commands";
	
	//
	$scope.areaLabel = "Test Area";
	//
	$scope.envLabels = [{id: "env1", label: "Mark's Room"}, 
						{id: "env1", label: "Mark's Kitchen"}, 
						{id: "env1", label: "Mark's Garage"}];
	//
	$scope.envLabel = "N/A";
	$scope.devLabel = "";
	$scope.devLabels = [];
	//
	$scope.selectedEnv = [];
	$scope.selectedDev = [];
	//
	$scope.isAreaSelected = false;
	//
	$scope.sceneLabel = "";
	$scope.sceneDesc = "";
	
	
	$scope.toggleArea = function() {
		$scope.isAreaSelected = !$scope.isAreaSelected;
	};
	
	$scope.selectEnvironment = function(env) {
		$scope.envLabel = env.label;
		$scope.selectedEnv.push(env);		
		//
		var nrDevices = Math.floor((Math.random()*10)+1);
		for(var i = 0; i < nrDevices; i++) {
			$scope.devLabels.push({ id: "dev"+i, label: "Test Device #"+i });		
		}
	};
	
	$scope.selectDevice = function(dev) {
		$scope.devLabel = dev.label;
		$scope.devStatus = 0;
		// $scope.selectedDev.push({id: dev.id, status: $scope.devStatus});		
		//
	};
	
	$scope.addDevSetup = function(label, status) {
		$scope.selectedDev.push({id: label, status: status});		
		//
	};
	
	$scope.removeDevSetup = function(dev) {
		for(var i = 0; i < $scope.selectedDev.length; i++) {
			if($scope.selectedDev[i].id == dev.id) {
				 $scope.selectedDev.splice(i, 1);
			}
		}
	};
	
	$scope.saveScene = function() {
		//
		var scene = new Scene("scn100", $scope.sceneLabel, $scope.sceneDescr, 100, 200);
		//
		for(var i = 0; i < $scope.selectedDev.length; i++) {
			var sceneDeviceSetup = new SceneDeviceSetup($scope.selectedDev[i].id, $scope.selectedDev[i].status);
			scene.addSceneSetup(sceneDeviceSetup);
		}
		// save in the root context
		$rootScope.scenes.addScene(scene);
	}
	
}]);
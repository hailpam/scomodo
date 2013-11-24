
// Scenes Controller
scomodo.controller('ScenesController', ['$scope', '$rootScope', '$routeParams', '$location', 'retrieveScenes', function($scope, $rootScope, $routeParams, $location, retrieveScenes) {
	// TODO : to be implemented
	$scope.detailInfo = "In this section you can define your scenes as a combination of one or mode devices from several environment"
	$scope.detailFooter = "Take the control of your scenes";
	
	var scenes = [];
	if($rootScope.scenes.length == 0) {
		scenes = retrieveScenes.init();
		$rootScope.scenes = scenes;
	}else {
		scenes = $rootScope.scenes;
	}
	
	$scope.scenes = [];
	for(var i = 0; i < scenes.getListedScenes().length; i++) {
		// 
		$scope.scenes.push({ selected: false, triggered: false, status: 0, id: scenes.getListedScenes()[i].identifier, scene:  scenes.getListedScenes()[i], devices: scenes.getListedScenes()[i].getSceneSettings().length});
	}
	
	$scope.toggle = function(sceneId) {
		//
		for(var i = 0; i < $scope.scenes.length; i++) {
			if($scope.scenes[i].id == sceneId) {
				$scope.scenes[i].selected = !$scope.scenes[i].selected;
			}
		}
	};
	
	$scope.create = function() {
		$location.path("/scene");
	};
	
	$scope.edit = function(sceneId) {
		$location.path("/scene/env1");
	};
	
	$scope.delete = function() {
		// TODO : call a service to remove
		// 
		for(var i = 0; i < $scope.scenes.length; i++) {
			if($scope.scenes[i].selected) {
				$scope.scenes.splice(i, 1);
				//$scope.scenes[i] = null;
			}
		}
	};
	
	$scope.trigger = function() {
		// TODO : call the service
		// 
		for(var i = 0; i < $scope.scenes.length; i++) {
			if($scope.scenes[i].selected) {
				$scope.scenes[i].status = 100;
			}
		}
	};
	
}]);
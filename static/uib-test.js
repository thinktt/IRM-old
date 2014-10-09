var app = angular.module("app", ['ui.bootstrap']);

app.controller('BootUITester', function($scope, $modal){
	var modalInstance = $modal.open({
      templateUrl: 'myModalContent.html',
      controller: 'ModalInstanceCtrl',
      size: 'sm',
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });
    
});

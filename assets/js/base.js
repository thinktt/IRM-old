console.log('Howdy');

var app = angular.module('app', []);

app.controller('BaseCtrl',  function ($scope, $http){
  
	io.socket.get('/incident', function (data) {
		$scope.data = data; 
		$scope.$apply();
	});

	io.socket.on('incident', function (event){
		if(event.verb === 'created') {
			$scope.data = event.data;
			$scope.$apply();
		}
	});

  // $http.get('/incident').then(function (res) {
  // 	scope.data = res.data;
  // }).catch(function (err) {
  // 	console.log('could not get incident');
  // });

  $scope.thing = {'one': 'hi'};
});



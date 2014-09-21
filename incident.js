
//..............Configure the App.............................

var app = angular.module("app", ["xeditable", "ngRoute"]);

app.run(function(editableOptions, editableThemes) {
  editableThemes.bs3.inputClass = 'input-sm';
  editableThemes.bs3.buttonsClass = 'btn-sm';
  editableOptions.theme = 'bs3';
});


app.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
			when('/report', {
				templateUrl: 'new-report-view.html',
				controller: 'Ctrl'
			}).
			when('/open', {
				templateUrl: 'current-view.html',
				controller: 'CurrentCtrl'
			}).
			when('/view', {
				templateUrl: 'report-view.html',
				controller: 'Ctrl'
			}).
			when('/incident', {
				templateUrl: 'incident-view.html',
				controller: 'Ctrl'
			}).
			otherwise({
				redirectTo: '/report'
			});
	}]);







//......................App Controllers.............................

app.controller('NavCtrl', function($scope,  $location){
	$scope.isActive = function (viewLocation) { 
		return viewLocation === $location.path();
	};
});


app.controller('CurrentCtrl', function($scope, $location){
	
	$scope.incidents = incidents; 

	$scope.setFocus = function(index) {
		incidentOfFocus = incidents[index];
		indexOfFocus = index;
	};

});

app.controller('Ctrl', function($scope, $location) {
	
	$scope.incident = incidentOfFocus; 


	$scope.leaders = [
		 {name: 'Tobias'},
		 {name: 'Cynthia'} ,
		 {name: 'Lauren'} ,
		 {name: 'Ryan'} ,
		 {name: 'Jeremiah'},
		 {name: 'John'},
		 {name: 'Nne'}
	];

	$scope.incedentTypes = [
		'Absent', 
		'Tardy', 
		'Approachability', 
		'Dress Code'
	];

	$scope.incidentStatusTypes = [
		'Pending Review',
		'Unexcused',
		'Excused'
	];

	$scope.labs = [
		{
			name: 'SCC', 
			stations: ['Print Room', 'Info', 'Resource']
		},
		{
			name: 'BLOC', 
			stations: ['Print Room','Help Desk', 'ZACH']
		},
		{
			name: 'WCL', 
			stations: ['Print Room', 'Help Desk']
		},
	];

	 

	$scope.registerStationSelecter = function(stationSelecter) {
		$scope.stationSelecter = stationSelecter;
	};

	$scope.updateLabStations = function(selectedLab) {
		var i; 
		for(i =0; i < $scope.labs.length; i++){
			if(selectedLab === $scope.labs[i].name ) {
				$scope.labStations = $scope.labs[i].stations;
			} 
		}
	};

	$scope.registerMeetingSelecter = function (meetingSelecter) {
		$scope.meetingSelecter = meetingSelecter; 
	};

	$scope.clearMeetingSelecter = function() {
		$scope.meetingSelecter.$data = ''; 
	};

	$scope.setMeetingPending = function() {
		if($scope.incident.meetingDate === '') {
			$scope.incident.meetingDate = 'Pending';
		} 
	};

	$scope.addComment = function() {
		var comment = {
			by: 'Tobias',
			timeStamp: moment(new Date()).unix(),
			date: moment(new Date()).format('YYYY-MM-DD'),
			time: moment(new Date()).format('HH:mm'),
			subject: '',
			body: '',
			new: true 
		};

		$scope.incident.comments.push(comment); 
	};

	$scope.clearNewStatus = function(index){
		$scope.incident.comments[index].new = false;
	};

	//this function is called on cancel. If it finds
	//that the comment is a new comment it deletes it
	$scope.checkForNew = function(index){
		if($scope.incident.comments[index].new) {
			if(confirm('Do you want to delete this comment?')) {
				$scope.incident.comments.splice(index,1);
			} else {
				$scope.incident.comments[index].new = false;
			}
		}
	};


	$scope.deleteComment = function(index){
		if(confirm('Do you want to delete this comment?')) {
			$scope.incident.comments.splice(index,1);
		} 
	};

	$scope.reFormat = function(unixTime) {
		return moment.unix(unixTime).format('MM-DD-YYYY h:mm a');	
	};

	$scope.makeTimeStamp = function(date, time) {
		return moment(date + ' ' + time).unix();	
	};

	$scope.deleteIncident = function(index){
		if(confirm('Do you want to delete this incident?')) {
			incidents.splice(index,1);
			incidentOfFocus = {isDeleted: true};
			$location.path( "/open" );
		} 
	};


});


app.filter('toStandardTime', function() {
  var toStandardTime;
  
  toStandardTime = function(milTime) {
	var out, milTmRegex, hours24, hours, amPm, minutes; 
	milTmRegex = /^[0-9]{2}:[0-9]{2}$/; 
	
	if (milTmRegex.test(milTime)) {
		hours24 = parseInt(milTime.slice(0,2));
		hours = ((hours24 + 11) % 12) + 1;
		amPm = hours24 > 11 ? ' PM' : ' AM';
		minutes = milTime.slice(3,5);
		
		return hours + ':' + minutes + amPm;

	  } else {
		return miltime; 
	}
 };

 return toStandardTime; 
});


//..............Global Access.................
//these should be inplemented differently eventually, probably registered as services
var incidentOfFocus = {
		reportedBy: "Tobias",
		userID: "thinktt",
		date: '2014-09-07',
		time: '15:00',
		studentWorker: "Joey",
		schedulerID: 652,
		fromLab: 'BLOC',
		lab: 'BLOC', //SCC, Pool, WCL
		station: 'Help Desk', 
		shiftStart: '15:00',
		shiftArrive: '16:00',
		type: 'Absent', //Tardy, Absent
		openStatus: 'Open', //Open, Closed
		sentEmail: 'no', //no, yes
		called: 'no', //no, yes
		reason: 'Missed the bus',
		summary: '',
		comments: comments,
		emailLogs: [],
		status: 'Unexcused', //Unexcused, Excused
		meetingDate: 'Pending', //if not pending date goes here
	}; 




//............Functions for Development......................
function createIncident() {
	
	var incident = {
		reportedBy: "Tobias",
		userID: "thinktt",
		date: '2014-09-07',
		time: '15:00',
		studentWorker: "Bob",
		schedulerID: 652,
		fromLab: 'BLOC',
		lab: 'BLOC', //SCC, Pool, WCL
		station: 'Help Desk', 
		shiftStart: '15:00',
		shiftArrive: '16:00',
		type: 'Absent', //Tardy, Absent
		openStatus: 'Open', //Open, Closed
		sentEmail: 'no', //no, yes
		called: 'no', //no, yes
		reason: 'Missed the bus',
		summary: '',
		comments: [],
		emailLogs: [],
		status: 'Unexcused', //Unexcused, Excused
		meetingDate: 'Pending', //if not pending date goes here
	};

	return incident;
}


var incidents = [],  
	comments = [],
	indexOfFocus, i;



for(i=0; i<3; i++) {
	incidents[i] = createIncident(); 
}









/*
function creatComment() {
	
	var comment = {
		by: 'Tobias',
		date: '2014-09-07',
		time: '15:00',
		subject: 'Initial Comment',
		body: 'He showed up 20 minutes late. He said he missed the bus. He called when he was on his way.',
		new: false
	};

	return comment;
}

*/

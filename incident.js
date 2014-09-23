
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
				controller: 'NewReportCtrl'
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


app.controller('NewReportCtrl', function($scope,  $location, incidentManager){
	var incidentTypes, incidentStatusTypes, labs;

	$scope.incident = incidentManager.newIncident;
	$scope.leaders = incidentManager.leaders; 

	$scope.incedentTypes = [
		{value: 'Tardy', label: 'Tardy (5 min or more'}, 
		{value: 'Absent', label:'Absent (15 min or more)'}, 
		{value: 'Approachability', label: 'Approachability'}, 
		{value: 'Dress Code', label: 'Dress Code'}
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
		}
	];

	//when the incdient lab changes this keeps the station list updated
	$scope.updateLabStations = function(selectedLab) {
		var i; 
		for(i =0; i < $scope.labs.length; i++){
			if(selectedLab === $scope.labs[i].name ) {
				$scope.labStations = $scope.labs[i].stations;
				$scope.incident.station = $scope.labStations[0];
			} 
		}
	};

	$scope.findName = function(ID) {
		var name = incidentManager.searchNameByID(ID);
		//if the search came back with something
		if(name) {
			$scope.incident.studentWorker = name; 
		} else {
			$scope.incident.studentWorker = '';
		}
	};


	$scope.submit = function(incidentToOpen) {

		//$scope.incident.shiftArrive = 'pending';

		//initialize all time data for first comment and who it is by
		$scope.incident.comments[0].date = 
			(moment(new Date()).format('YYYY-MM-DD'));
		$scope.incident.comments[0].time = 
			(moment(new Date()).format('HH:mm'));
		$scope.incident.comments[0].timeStamp = moment(new Date()).unix();
		$scope.incident.comments[0].by = $scope.incident.reportedBy; 
		
		incidentManager.openIncident(incidentToOpen);
		incidentManager.makeNewIncident();
		$scope.incident = incidentManager.newIncident; 
	};

	//when controller starts match the lab stations to the intial lab 
	$scope.updateLabStations($scope.incident.lab); 	

});


app.controller('CurrentCtrl', function($scope, $location, incidentManager){

	$scope.incidents = incidentManager.incidents; 

	$scope.setFocus = function(index) {
		incidentManager.incidentOfFocus = $scope.incidents[index];
		incidentManager.indexOfFocus = index;
	};

});



app.controller('Ctrl', function($scope, $location, incidentManager) {
	
	$scope.incident = incidentManager.incidentOfFocus; 


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
			incidentManager.incidents.splice(index,1);
			incidentManager.incidentOfFocus = {isDeleted: true};
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


//..............Services.................
app.service('incidentManager', function() {

	var incidents= [], 
		 incidentOfFocus, indexOfFocus, i,
		 createIncident, getIncidents, getFocus;


	createIncident = function() {
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
			arrivalStatus: 'pending',
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
	};


	/*//load in a few dummy incidents 
	for(i=0; i<3; i++) {
		incidents[i] = createIncident(); 
	}*/

	this.leaders = [
		 {name: 'Tobias'},
		 {name: 'Cynthia'} ,
		 {name: 'Lauren'} ,
		 {name: 'Ryan'} ,
		 {name: 'Jeremiah'},
		 {name: 'John'},
		 {name: 'Nne'}
	];

	this.incidents = incidents; 
	this.indexOfFocus = 0; 
	this.incidentOfFocus = incidents[0];


	this.makeNewIncident = function() {
		var incident, comment;

		comment = {
			by: 'Tobias',
			date: '15:00',
			time: '15:00',
			subject: 'Initial Comment',
			body: '',
			new: false
		};

	 	incident = {
			reportedBy: "Tobias",
			userID: "thinktt",
			date: (moment(new Date()).format('YYYY-MM-DD')),
			time: (moment(new Date()).format('HH:mm')),
			studentWorker: "",
			schedulerID: '',
			fromLab: 'BLOC',
			fullID: '', //fromLab-schedulerID
			lab: 'BLOC', //SCC, Pool, WCL
			station: 'Help Desk', 
			shiftStart: (moment(new Date()).format('HH:00')),
			shiftArrive: (moment(new Date()).format('HH:30')),
			arrivalStatus: 'pending',
			type: 'Absent', //Tardy, Absent
			openStatus: 'Open', //Open, Closed
			sentEmail: 'no', //no, yes
			called: 'no', //no, yes
			reason: '',
			summary: '',
			comments: [],
			emailLogs: [],
			status: 'Unexcused', //Unexcused, Excused
			meetingDate: 'Pending', //if not pending date goes here
		};

		incident.comments.push(comment); 
		this.newIncident  = incident;
	};

	//initialize the new incident object
	this.makeNewIncident();

	this.openIncident = function(incident) {
		this.incidents.push(incident);
	};

	this.searchNameByID = function (ID) {
		var IDRegex = /^[0-9]{3}$/, i;
		if (IDRegex.test(ID)) {
			for(i=0; i<incidents.length; i++) {
				if(incidents[i].schedulerID === ID) {
					return incidents[i].studentWorker;
				}
			}
		}
	}; 

	getIncidents = function() {
		return incidents;
	};

	getFocus = function() {
		return {
			incident: incidentOfFocus,
			index: indexOfFocus
		};
	};


});



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
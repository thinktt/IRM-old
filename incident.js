
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
				templateUrl: 'views/new-report-view.html',
				controller: 'NewReportCtrl'
			}).
			when('/open', {
				templateUrl: 'views/current-view.html',
				controller: 'CurrentCtrl'
			}).
			when('/view', {
				templateUrl: 'views/report-view.html',
				controller: 'ReportCtrl'
			}).
			when('/incident', {
				templateUrl: 'views/incident-view.html',
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

app.controller('NewReportCtrl', 
	function($scope,  $location, $timeout, incidentManager){
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

		$scope.fromLabs = [
			{name: 'SCC'},
			{name: 'BLOC'},
			{name: 'WCL'},
			{name: 'POOL'}
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


		$scope.submit = function() {
			var date, time; 

			//check if form is valid
			if($scope.newIncidentForm.$invalid) {
				$scope.invalidSubmit=true;
				return;
			} 

			date = $scope.incident.date;
			time = $scope.incident.shiftStart;

			$scope.incident.timeStamp = 
				moment(date +' '+ time,'YYYY-MM-DD HH:mm').unix();
			
			$scope.incident.fullID = 
				$scope.incident.fromLab + '-' + $scope.incident.schedulerID;

			if($scope.incident.reason === '') {
				$scope.incident.reason = 'No reason given';
			}

			if($scope.incident.arrivalStatus === 'pending') {
				$scope.incident.shiftArrive = 'Pending';
			} else if ($scope.incident.arrivalStatus === 'missed') {
				$scope.incident.shiftArrive = 'Missed shift';
			}



			//initialize all time data for first comment and who it is by
			$scope.incident.comments[0].date = 
				(moment(new Date()).format('YYYY-MM-DD'));
			$scope.incident.comments[0].time = 
				(moment(new Date()).format('HH:mm'));
			$scope.incident.comments[0].timeStamp = moment(new Date()).unix();
			$scope.incident.comments[0].by = $scope.incident.reportedBy; 
			
			//add incident to open incidents and clear (really make a new)
			//incident for the new report view
			incidentManager.openIncident($scope.incident);
			incidentManager.makeNewIncident();
			$scope.incident = incidentManager.newIncident;
			
			//clear the invalid submit flag and add a 
			//five second sucess submit flag
			$scope.validSubmit = true;
			$scope.invalidSubmit = false;
			$timeout(function(){$scope.validSubmit = false;}, 5000); 
		};


		//when controller starts match the lab stations to the intial lab 
		$scope.updateLabStations($scope.incident.lab); 	

	});


app.controller('CurrentCtrl', function($scope, $location, incidentManager){

	$scope.incidents = incidentManager.incidents; 

	$scope.setFocus = function(incident) {
		incidentManager.incidentOfFocus = incident;
		incidentManager.indexOfFocus = $scope.incidents.indexOf(incident);
	};

});

app.controller('ReportCtrl', function($scope,  $location, incidentManager) {
	$scope.incidents = incidentManager.incidents; 
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

	$scope.updateFullID = function() {
		$scope.incident.fullID = 
			$scope.incident.fromLab + '-' + $scope.incident.schedulerID;
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

	$scope.deleteIncident = function(incident){
		var index = incidentManager.incidents.indexOf(incident);
		if(confirm('Do you want to delete this incident?')) {
			incidentManager.incidents.splice(index,1);
			incidentManager.incidentOfFocus = {isDeleted: true};
			$location.path( "/open" );
		} 
	};

	$scope.submitIncident = function(incident) {
		incident.openStatus = 'Submitted';
		$location.path("/open");
	};

});


app.filter('toStandardTime', function() {
	var toStandardTime;
  
	toStandardTime = function(milTime) {
		var milTmRegex = /^[0-9]{2}:[0-9]{2}$/; 
		if (milTmRegex.test(milTime)) {
			return  moment(milTime, 'HH:mm').format('h:mm A');
		  } else {
			return milTime; 
		}
	};

	return toStandardTime; 
});


//..............Services.................
app.service('incidentManager', function() {

	var incidentOfFocus, indexOfFocus, i,
		 createIncident, getIncidents, getFocus;
	
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
	this.incidentOfFocus = {isDeleted: true};


	this.makeNewIncident = function() {
		var incident, comment;

		comment = {
			by: 'Tobias',
			date: '15:00',
			time: '15:00',
			timeStamp: '',
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
			station: 'Print Room', 
			shiftStart: (moment(new Date()).format('HH:00')),
			shiftArrive: (moment(new Date()).format('HH:30')),
			arrivalStatus: 'pending', //missed, pending
			type: 'Absent', //Tardy, Absent
			openStatus: 'Open', //Open, Closed
			sentEmail: 'no', //no, yes
			called: 'no', //no, yes
			reason: '',
			summary: '',
			comments: [],
			emailLogs: [],
			status: 'Pending Review', //Pending Review, Unexcused, Excused
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

	//sorts the incidents by fullID and returns the sorted incidents 
	//(an array of arrays)
	this.sortIncidents = function(incidents) {
		var incidentsToSort = [],
		    incidentsBeingSorted = [],
		    incidentsSorted = [],
		    incidentGroup = [],
		    i, j, sortID;

		//make a copy of incidents array containing same actual objects
		for(i=0; i<incidents.length; i++) {
			incidentsToSort.push(incidents[i]);
		}


		while(incidentsToSort.length !== 0) {
			incidentsBeingSorted = incidentsToSort;
			incidentsToSort = [];
			sortID = incidentsBeingSorted[0].fullID;

			for(i=0; i<incidentsBeingSorted.length; i++) {
				if(incidentsBeingSorted[i].fullID === sortID) {
					incidentGroup.push(incidentsBeingSorted[i]);
				} else {
					incidentsToSort.push(incidentsBeingSorted[i]);
				}
			}
			incidentsSorted.push(incidentGroup);
			incidentGroup = [];
		}

		return incidentsSorted;
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


//............Pollyfill.....................
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(obj, start) {
         for (var i = (start || 0), j = this.length; i < j; i++) {
             if (this[i] === obj) { return i; }
         }
         return -1;
    };
}




//..........Temp Global Dev Stuff.................
var incidents = []; 

var createIncident = function(name, ID) {
		var incident = {
			reportedBy: "Tobias",
			userID: "thinktt",
			date: (moment(new Date()).format('YYYY-MM-DD')),
			time: (moment(new Date()).format('HH:mm')),
			studentWorker: name,
			schedulerID: ID,
			fromLab: 'BLOC',
			fullID: 'Bloc-' + ID, //fromLab-schedulerID
			lab: 'BLOC', //SCC, Pool, WCL
			station: 'Print Room', 
			shiftStart: (moment(new Date()).format('HH:00')),
			shiftArrive: (moment(new Date()).format('HH:30')),
			arrivalStatus: 'pending', //missed, pending
			type: 'Absent', //Tardy, Absent
			openStatus: 'Submitted', //Open, Submitted
			sentEmail: 'no', //no, yes
			called: 'no', //no, yes
			reason: 'none',
			summary: '',
			comments: [],
			emailLogs: [],
			status: 'Pending Review', //Pending Review, Unexcused, Excused
			meetingDate: 'Pending', //if not pending date goes here
		};

		return incident;
	};


	var i, j; 
	//load in a few dummy incidents 
	for(i=0; i<3; i++) {
		for(j=0; j<5; j++) {
			incidents.push(createIncident('Name'+i, i));
		} 
	}


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
 


function createIncident() {
	
	var incident = 
	{
		reportedBy: "Tobias",
		userID: "thinktt",
		date: (new Date()),
		
		studentWorker: "",
		schedulerID: null,
		lab: 'Blocker', //SCC, Pool, WCL
		
		shiftStart: (new Date()),
		shiftArrive: (new Date()),
		type: '', //Tardy, Absent
		status: 'Open', //Open, Closed
		sentEmail: 'no', //no, yes
		called: 'no', //no, yes
		reason: '',
		summary: '',
		comments: [],
		emailLogs: [],
		excusedStatus: 'Unexcused', //Unexcused, Excused
	};

	return incident;
}


var incident = {
	reportedBy: "Tobias",
	userID: "thinktt",
	date: (new Date()),
	
	studentWorker: "Joe",
	schedulerID: 652,
	lab: 'Blocker', //SCC, Pool, WCL
	
	shiftStart: (new Date()),
	shiftArrive: (new Date()),
	type: 'Absent', //Tardy, Absent
	status: 'Open', //Open, Closed
	sentEmail: 'no', //no, yes
	called: 'no', //no, yes
	reason: 'Missed the bus',
	summary: '',
	comments: [],
	emailLogs: [],
	excusedStatus: 'Unexcused', //Unexcused, Excused
};


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

var comments = [];
var i =0;

/*for(i=0; i<3; i++) {
	comments[i] = creatComment(); 
}*/


var app = angular.module("app", ["xeditable"]);

app.run(function(editableOptions, editableThemes) {
  editableThemes.bs3.inputClass = 'input-sm';
  editableThemes.bs3.buttonsClass = 'btn-sm';
  editableOptions.theme = 'bs3';
});

app.controller('Ctrl', function($scope) {
	var getLabStations; 
	
	$scope.incident = {
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
		comments: comments,
		emailLogs: [],
		status: 'Unexcused', //Unexcused, Excused
		meetingDate: 'Pending', //if not pending date goes here
	};

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
			date: '2014-09-07',
			time: '15:00',
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
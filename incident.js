
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
	
	studentWorker: "Bob",
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
		date: (new Date()),
		subject: 'Initial Comment',
		body: 'He showed up 20 minutes late. He said he missed the bus. He called when he was on his way.' 
	};

	return comment;
}

var comments = [];
var i =0;

for(i=0; i<10; i++) {
	comments[i] = creatComment(); 
}


var app = angular.module("app", ["xeditable"]);

app.run(function(editableOptions, editableThemes) {
  editableThemes.bs3.inputClass = 'input-sm';
  editableThemes.bs3.buttonsClass = 'btn-sm';
  //editableOptions.theme = 'bs3';
});

app.controller('Ctrl', function($scope) {
	
	$scope.incident = {
		reportedBy: "Tobias",
		userID: "thinktt",
		date: (new Date()),

		studentWorker: "Bob",
		schedulerID: 652,
		lab: 'BLOC', //SCC, Pool, WCL
		station: 'Help Desk', 
		shiftStart: (new Date()),
		shiftArrive: (new Date()),
		type: 'Absent', //Tardy, Absent
		openStatus: 'Open', //Open, Closed
		sentEmail: 'no', //no, yes
		called: 'no', //no, yes
		reason: 'Missed the bus',
		summary: '',
		comments: comments,
		emailLogs: [],
		status: 'Unexcused', //Unexcused, Excused
		meeting: 'Pending', //if not pending date goes here
	};

});
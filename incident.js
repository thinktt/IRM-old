
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



var fs = require('fs');
var moment = require('./js/moment');

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
comments.push(creatComment()); 


var createIncident = function(name, ID) {
		ID = '00' + ID;
		var incident = {
			reportedBy: "Tobias",
			userID: "thinktt",
			date: (moment(new Date()).format('YYYY-MM-DD')),
			time: (moment(new Date()).format('HH:mm')),
			studentWorker: name,
			schedulerID: ID,
			fromLab: 'BLOC',
			fullID: 'BLOC-' + ID, //fromLab-schedulerID
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


var parseText = function(textToParse, incident) {
	var textArray, i, textIsValid,
		validTexts = [ 
			'Person Reporting',
			'Your E-Mail Address',
			'Subject',
			'Date of Incident',
			'Scheduler Station',
			'Employee\'s Name',
			'Which Lab does the worker belong to?',
			'Scheduler ID#',
			'Attendance Issue',
			'Dress Code Issue',
			'Approachability',
			'Incident Details',
			'Additional Notes' 
		]; 

	incident.comments.push({});	

	try {
		textArray = textToParse.split('\n'); 
	} catch(err) {
	  return; 
	}
	
	//remove the return chars
	for(i=0; i < textArray.length; i++) {
		textArray[i] = textArray[i].slice(0,-1);
	}


	//validate the textToParse matches the incident email format
	//checks every other line of first 24 lines agains validTexts
	for(i=0; i < 23; i=i+2) {
		if(textArray[i] === validTexts[(i/2)]) {
			textIsValid = true;
		} else {
			textIsValid = false;
			break; 
		}
	}


	//pull out all the datas 
	if(textIsValid) {
		incident.reportedBy = textArray[1];
		incident.email = textArray[3];
		incident.date  = textArray[7].substr(0,12);
		incident.shiftStart = textArray[7].substr(13,8);
		incident.station = textArray[9];
		incident.studentWorker = textArray[11];
		incident.fromLab = textArray[13];
		incident.schedulerID = textArray[15];
		incident.type =   /Absent|Tardy/.exec(textArray[17])[0];
		
		//take all remaining texts and create the comment
		incident.comments[0].body =  '';
		for(i=23; i < textArray.length; i++) {
			incident.comments[0].body =  
				incident.comments[0].body + textArray[i] + '\n';
		}

		//change dates and times to correct inicdent formats 
		incident.date = 
			moment(incident.date, 'MMM DD YYYY').format('YYYY-MM-DD;');
		incident.shiftStart = 
			moment(incident.shiftStart, 'H:mm A').format('HH:mm');

		//replace long lab names with short lab names
		incident.fromLab = 
			incident.fromLab.replace('Blocker', 'BLOC');
		incident.fromLab = 
			incident.fromLab.replace('West Campus Library', 'WCL');

		//fill in some comment details
		incident.comments[0].by = incident.reportedBy;
		incident.comments[0].date = incident.date;
		incident.comments[0].time = incident.shiftStart;

		incident.fullID = incident.fromLab + '-' + incident.schedulerID; 


	} else {
		return;
	}

	return incident; 
};



var incident = createIncident('Joe', '656'); 
var textToParse = fs.readFileSync('testing.txt', 'utf8');

incidentParsed = parseText(textToParse, incident); 

if(incident) {
	console.log(incidentParsed);
} else {
	console.log('Could not parse');
}



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


var incident = createIncident();
//console.log(incident);


$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};


$('form').submit(function() {
    console.log($('form').serializeObject());
    return false;
});




/*
$(function() {
    $('form').submit(function() {
        console.log($('form').serializeObject());
        return false;
    });
});


console.log(incident.shiftStart);
console.log(incident.date); 
console.log(incident.date.getDate());

person reporing
userId
Date-Time of report

student worker
station
time shift started
time of arrival
type of incident
status is inicident open still
did they send an email
did they contact SL beforehand
reason for incident
comments
is it excused
*/
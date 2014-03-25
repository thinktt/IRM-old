//test edit
var $messageBox = $("#messageBox textarea");
var $outputBox = $("#outputBox textarea"); 


var logOutput = function(output) {
	$outputBox.val($outputBox.val() + output +'\n');
};


$("#mainButton").click(function(event) {

	var incidentEmail = $messageBox.val(); 
	var incidentArray =[];
	var incident = {}; //incdint obj 

	incidentArray = incidentEmail.split('\n'); 

	incident.date  = incidentArray[7].substr(0,12);
	incident.time = incidentArray[7].substr(13,8);
	incident.station = incidentArray[9];
	incident.type =   /Absent|Tardy/.exec(incidentArray[17]);
	incident.notes =  incidentArray[23];
	
	console.log(incident);

	logOutput(incident.type);
	logOutput(incident.date);
	logOutput(incident.time);
	logOutput(incident.station);
	logOutput(incident.notes + '\n');

	


	//console.log(incidentArray);


	//$outputBox.text($messageBox.val());
	//$messageBox.val("I am now your text! Dominate YOU!");
		
});






/*
$( document ).ready(function() {

 
});
*/

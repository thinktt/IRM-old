//<tr ng-repeat="incident in incidentsSorted[2] | orderBy:'timeStamp' |filter:{openStatus:'Submitted'}"> 

var incidents = []; 

var createIncident = function(name, ID) {
		var incident = {
			studentWorker: name,
			schedulerID: ID,
			fullID: 'BLOC-' + ID, //fromLab-schedulerID
			status: "Unexcused"
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


var sortIncidents = function(incidents) {
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

var buildReportSummaries = function(incidentsSorted) {
	var reportSummaries = [], 
		i, j, pending, excused, unexcused;
	
	for(i=0; i<incidentsSorted.length; i++) {
		pending = 0; 
		unexcused = 0; 
		excused = 0;
		for(j=0; j<incidentsSorted[i].length; j++) {
			switch(incidentsSorted[i][j].status){
				case 'Pending Review':
					pending++;
					break;
				case 'Unexcused' :
					unexcused++;
					break;
				case 'Excused' :
					excused++;
					break;
			}
		}

		reportSummaries[i] = {
			ID: incidentsSorted[i][0].schedulerID,
			FullID: incidentsSorted[i][0].fullID,
			Name: incidentsSorted[i][0].studentWorker,
			incidentTotal: incidentsSorted[i].length,
			pending: pending,
			unexcused: unexcused,
			excused: excused,
			incidents: incidentsSorted[i]
		};
	}
	return reportSummaries;
};

var incidentsSorted = sortIncidents(incidents); 
var reportSummaries = buildReportSummaries(incidentsSorted);


for(i=0; i<reportSummaries.length; i++) {
	console.log(reportSummaries[i]);
	console.log();
}

/*



//console.log(arrayOfArrays);


var array1 = [{one:'one'}],
	array2 = [{two:'two'}],
	array3 = [{three:'three'}],
	arrayOfArrays = [];

arrayOfArrays.push(array1);
arrayOfArrays.push(array2);
arrayOfArrays.push(array3);
for(i=0; i<array2.length-2; i++) {
	console.log(array2.splice(i,1)[0]);
}

*/
//console.log(array2);
//console.log(myArray);
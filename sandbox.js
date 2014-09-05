var globie = 10; 

function say667() {
    // Local variable that ends up within closure
    var num = 666;
    
    var sayAlert = function() { 
    	console.log(num + ' ' + globie);
    	num++;  
    	globie++; 
    }
    
    return sayAlert;
}


var a = say667();
var b = say667(); 
a(); 
a(); 
a(); 
a(); 
b(); 
a();
b(); 

console.log(globie);  








/*
var a = 'global variable'; 


function foo() {
    var a = 'private variable';
    
    function bar() {
        console.log(a);
    }

    return bar; 
}



console.log(foo()); 

var callAlert = foo();

console.log(a); 
callAlert(); 


var my2DArray = [];

for (var i = 0; i < 5; i++) {
	my2DArray.push([1,2]);
}

console.log(my2DArray[0][1]); 





var name = 'Brady';
var name; 
console.log(name); 


var myAlerts = [];

for (var i = 0; i < 5; i++) {
    myAlerts.push(
        function inner() {
            console.log(i);
        }
    );
}

myAlerts[0](); // 5
myAlerts[1](); // 5
myAlerts[2](); // 5
myAlerts[3](); // 5
myAlerts[4](); // 5s



function howdy(greeting) {
	
	console.log(inner);

	function inner() {
		//bobby
	}


	console.log(inner);
	console.log(typeof inner2);
	console.log(typeof a);  

	var inner = function() {
		//brad
	} 


	var inner2 = function() {};
	var greeting; 
	var a = 10; 

	console.log(greeting); 

	greeting = 'Howdy Y\'all';
	console.log(greeting);  
}



howdy('Yo!'); 
console.log(typeof howdy); 


//console.log(hello); 


/*
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


$( document ).ready(function() {

 
});
*/

var moment = require('./js/moment'),
	theTime = '15:02',
	theDate = '2014-09-07',
	dateTime = theDate + ' ' + theTime,
	unixTime;



unixTime = moment(new Date()).unix();

//console.log(unixTime); 
//console.log(moment.unix(unixTime).format('dddd, MMMM Do YYYY, h:mma'));

unixTime = new Date(dateTime).getTime();

console.log(unixTime);
console.log(new Date());



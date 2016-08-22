const http = require('http');
const Q = require('q');
const dateFormat = require('dateformat');
const timezoner = require('timezoner');
const fs = require('fs');

let api_keys = fs.readFileSync(__dirname + '/auth/api_keys.txt', 'utf8');
let google_api_key = api_keys.substring(0, api_keys.indexOf("\n"));;
let api_key_expr = api_keys.substring(api_keys.indexOf("\n")+1, api_keys.length);;

const current_colleges = [
	// {name: "Rutgers", id: 5101717, coord:{lon:-74.45182,lat:40.486221}},
	{name: "UIUC", id: 4914570, coord:{lon:-88.207268, lat:40.110592}},
	{name: "UC Berkley", id: 5327684, coord:{lon:-122.272751, lat:37.87159}},
	{name: "U Pittsburgh", id: 5206379, coord:{lon:-79.995888, lat:40.44062}},
	// {name: "U Maryland", id: 4351977, coord:{lon:-76.93692, lat:38.980671}},
	// {name: "Bentley University", id: 4954380, coord:{lon:-71.235611, lat:42.376492}},
	// {name: "TCNJ", id: 5097751, coord:{lon:-74.799881, lat:40.269829}},
	// {name: "NJIT", id: 5097751, coord:{lon:-74.799881, lat:40.269829}},
	{name: "Cornell", id: 5115926, coord:{lon:-76.478554, lat:42.439522}},
	// {name: "RPI", id: 5141502, coord:{lon:-73.691788, lat:42.728409}},
	// {name: "John Hopkins", id: 4347800, coord:{lon:-76.636627,lat:39.233158}},
	{name: "Georgia Tech", id: 4180439, coord:{lon:-84.387978, lat:33.749001}},
	// {name: "NYU", id: 5128581, coord:{lon:-74.005966, lat:40.714272}},
	// {name: "U Michigan", id: 4984247, coord:{lon:-83.740883, lat:42.277561}},
	{name: "Ohio State", id: 4509177, coord:{lon:-82.998787, lat:39.961182}},
	{name: "William and Mary", id: 4793846, coord:{lon:-76.707458, lat:37.270699}},
	{name: "American", id: 4140963, coord:{lon:-77.036369, lat:38.895111}},
	// {name: "MIT", id: 4931972, coord:{lon:-71.105614, lat:42.375099}},
	// {name: "Dartmouth", id: 5087168, coord:{lon:-72.289543, lat:43.70229}},
	// {name: "Princeton", id: 5102922, coord:{lon:-74.65905, lat:40.348721}},
	// {name: "U Chicago", id: 4887492, coord:{lon:-87.779221, lat:41.70142}},
	{name: "Vanderbilt", id: 4644585, coord:{lon:-86.784439, lat:36.16589}}
	//{name: "Northeastern", id:4930956, coord:{lon:-71.059769, lat:42.358429}}

];

function getCollegeData(colleges){
	let deffered = Q.defer();
	let counter = 0;
	for(let x = 0; x < colleges.length; x++){
		let promise = getCityData(colleges[x].id, x);
		promise.then(function(time){
			colleges[time.index].sunset = time.sunset;
			let pos = colleges[time.index].coord;
			return getTimeZoneOffset(pos, time.index);
		}).then(function(offset){
			colleges[offset.index].offset = offset.offset; 
		}).then(function(){
			if(counter == colleges.length-1){
				deffered.resolve(colleges);
			} else{
				counter++;
			}
		}).done();
	}
	return deffered.promise;
}

function getCityData(city_id, index){
	let deffered = Q.defer();

	var options = {
    	host: 'api.openweathermap.org',
    	path: '/data/2.5/weather?id=' + city_id + api_key_expr,
  	};

  callback = function(response) {
    let str = '';

    response.on('data', function(chunk) {
      str += chunk;
    });

    response.on('end', function() {
      let parsedEventData = JSON.parse(str);
      let return_obj = {
      	sunset: parsedEventData.sys.sunset,
      	index: index
      };
      deffered.resolve(return_obj);
    });
  };

  http.request(options, callback).end();
  return deffered.promise;
}

function getTimeZoneOffset(pos, index){
	let deffered = Q.defer();

	timezoner.getTimeZone(pos.lat, pos.lon, 
		function(err, data){
			if(err){
				console.log(err);
			} else{
				deffered.resolve({
					offset: (data.rawOffset + data.dstOffset)/3600,
					index: index
				});
			}
		},
		{language: 'en', key: google_api_key}
	)

	return deffered.promise;
}

function composeMessage(colleges){
	let now = new Date(Date.now());
	let message = "Sunsets for " +  dateFormat(now, "dddd, mmmm dS, yyyy \n");

	for(let x = 0; x < colleges.length; x++){
		let sunset = new Date(colleges[x].sunset * 1000);
		let offset = colleges[x].offset;
		sunset = new Date(sunset.getFullYear(), sunset.getMonth(), sunset.getDate(), sunset.getUTCHours() + offset, sunset.getMinutes());
		let curr_line = colleges[x].name + ": " + format_time(sunset) + "\n";
		message += curr_line;
	}
	return message;
}

function format_time(date_obj) {
  // formats a javascript Date object into a 12h AM/PM time string
  var hour = date_obj.getHours();
  var minute = date_obj.getMinutes();
  var amPM = (hour > 11) ? "pm" : "am";
  if(hour > 12) {
    hour -= 12;
  } else if(hour == 0) {
    hour = "12";
  }
  if(minute < 10) {
    minute = "0" + minute;
  }
  return hour + ":" + minute + amPM;
}

function getSunsets(colleges){
	let promise = getCollegeData(colleges);
	promise.then(function(college_sunsets){
		let credits = fs.readFileSync(__dirname + '/auth/credits.txt');
		let sunset_message = composeMessage(college_sunsets) + "\n" + credits;
		fs.writeFileSync('sunsets.txt', sunset_message);
	}).done();
}

getSunsets(current_colleges);
console.log("DID THIS");






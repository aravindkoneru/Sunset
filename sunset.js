const http = require('http');
const Q = require('q');
const dateFormat = require('dateformat');
const timezoner = require('timezoner');
const fs = require('fs');

let api_keys = JSON.parse(fs.readFileSync(__dirname + '/auth/server_data.json', 'utf8'));
let google_api_key = api_keys.google_api;
let api_key_expr = "&APPID=" + api_keys.weather_api;
let credits = api_keys.credits;

const current_colleges = [
	{name: "Home", id: 5102940, coord:{lon:-74.619881, lat:40.317329}, f_start_date: new Date(2016, 0, 1), f_end_date: new Date(2020, 0, 1)},
	{name: "🚭 Rutgers 🚭", id: 5101717, coord:{lon:-74.45182,lat:40.486221}, f_start_date: new Date(2016, 8, 6), f_end_date: new Date(2016, 11, 23), s_start_date: new Date(2017, 0, 17), s_end_date: new Date(2017, 4, 10)},
	{name: "UIUC", id: 4914570, coord:{lon:-88.207268, lat:40.110592}, f_start_date: new Date(2016, 7, 22), f_end_date: new Date(2016, 11, 15), s_start_date: new Date(2017, 0, 17), s_end_date: new Date(2017, 4, 9)},
	{name: "UC Berkley", id: 5327684, coord:{lon:-122.272751, lat:37.87159}, f_start_date: new Date(2016, 7, 24), f_end_date: new Date(2016, 11, 16), s_start_date: new Date(2017, 0, 17), s_end_date: new Date(2017, 4, 12)},
	{name: "U Pittsburgh", id: 5206379, coord:{lon:-79.995888, lat:40.44062}, f_start_date: new Date(2016, 7, 29), f_end_date: new Date(2016, 11, 18), s_start_date: new Date(2017, 0, 4), s_end_date: new Date(2017, 3, 29)},
	{name: "U Maryland", id: 4351977, coord:{lon:-76.93692, lat:38.980671}, f_start_date: new Date(2016, 7, 29), f_end_date: new Date(2016, 11, 20), s_start_date: new Date(2017, 0, 25), s_end_date: new Date(2017, 4, 30)},
	{name: "Bentley University", id: 4954380, coord:{lon:-71.235611, lat:42.376492}, f_start_date: new Date(2016, 7, 29), f_end_date: new Date(2016, 11, 24), s_start_date: new Date(2017, 0, 17), s_end_date: new Date(2017, 4, 9)},
	{name: "TCNJ", id: 5097751, coord:{lon:-74.799881, lat:40.269829}, f_start_date: new Date(2016, )}, //fuck tcnj
	{name: "NJIT", id: 5097751, coord:{lon:-74.799881, lat:40.269829}, f_start_date: new Date(2016, 8, 6), f_end_date: new Date(2016, 11, 22), s_start_date: new Date(2017, 0, 17), s_end_date: new Date(2016, 4, 11)},
	{name: "Cornell", id: 5115926, coord:{lon:-76.478554, lat:42.439522}, f_start_date: new Date(2016, 7, 23), f_end_date: new Date(2016, 11, 15), s_start_date: new Date(2017, 0, 25), s_end_date: new Date(2017, 4, 23)},
	{name: "RPI", id: 5141502, coord:{lon:-73.691788, lat:42.728409}, f_start_date: new Date(2016, 7, 31), f_end_date: new Date(2016, 11, 21), s_start_date: new Date(2017, 0, 17), s_end_date: new Date(2017, 4, 12)},
	{name: "John Hopkins", id: 4347800, coord:{lon:-76.636627,lat:39.233158}, f_start_date: new Date(2016, 8, 1), f_end_date: new Date(2016, 11, 23), s_start_date: new Date(2017, 0, 30), s_end_date: new Date(2017, 4, 18)},
	{name: "🌴 Georgia Tech 🌴", id: 4180439, coord:{lon:-84.387978, lat:33.749001}, f_start_date: new Date(2016, 7, 22), f_end_date: new Date(2016, 11, 15)},//doesn't have spring dates
	{name: "💵 NYU 💵", id: 5128581, coord:{lon:-74.005966, lat:40.714272}, f_start_date: new Date(2016, 8, 6), f_end_date: new Date(2016, 11, 24), s_start_date: new Date(2017, 0, 23), s_end_date: new Date(2017, 4, 16)},
	{name: "U Michigan", id: 4984247, coord:{lon:-83.740883, lat:42.277561}, f_start_date: new Date(2016, 8, 6), f_end_date: new Date(2016, 11, 22), s_start_date: new Date(2017, 0, 4), s_end_date: new Date(2017, 3, 27)},
	{name: "😉 Ohio State 😉", id: 4509177, coord:{lon:-82.998787, lat:39.961182}, f_start_date: new Date(2016, 7, 23), f_end_date: new Date(2016, 11, 15), s_start_date: new Date(2017, 0, 9), s_end_date: new Date(2017, 4, 2)},
	{name: "🐵 William and Mary 🐵", id: 4793846, coord:{lon:-76.707458, lat:37.270699}, f_start_date: new Date(2016, 7 ,23), f_end_date: new Date(2016, 11, 14), s_start_date: new Date(2017, 0, 18), s_end_date: new Date(2017, 4, 10)},
	{name: "🙏 American 🙏", id: 4140963, coord:{lon:-77.036369, lat:38.895111}, f_start_date: new Date(2016, 7, 29), f_end_date: new Date(2016, 11, 19), s_start_date: new Date(2017, 0, 17), s_end_date: new Date(2017, 4, 9)},
	{name: "MIT", id: 4931972, coord:{lon:-71.105614, lat:42.375099}, f_start_date: new Date(2016, 8, 7), f_end_date: new Date(2016, 11, 22), s_start_date: new Date(2017, 1, 7), s_end_date: new Date(2017, 4, 26)},
	{name: "🍻 Dartmouth 🍻", id: 5087168, coord:{lon:-72.289543, lat:43.70229}, f_start_date: new Date(2016, 8, 12), f_end_date: new Date(2016, 10, 23), w_start_date: new Date(2017, 0, 4), w_end_date: new Date(2017, 2, 8), s_start_date: new Date(2017, 2, 27), s_end_date: new Date(2017, 5, 5)},
	{name: "Princeton", id: 5102922, coord:{lon:-74.65905, lat:40.348721}, f_start_date: new Date(2016, 8, 14), f_end_date: new Date(2016, 11, 16), s_start_date: new Date(2017, 0, 8), s_end_date: new Date(2017, 4, 27)}, //fuck princeton
	{name: "🔫 U Chicago 🔫", id: 4887492, coord:{lon:-87.779221, lat:41.70142}, f_start_date: new Date(2016, 8, 26), f_end_date: new Date(2016, 11, 10), s_start_date: new Date(2017, 0, 3), s_end_date: new Date(2017, 5, 10)}, //fuck u chicago
	{name: "💩 Vanderbilt 💩", id: 4644585, coord:{lon:-86.784439, lat:36.16589}, f_start_date: new Date(2016, 7, 24), f_end_date: new Date(2016, 11, 17), s_start_date: new Date(2017, 0, 9), s_end_date: new Date(2017, 4, 4)},
	{name: "Northeastern", id:4930956, coord:{lon:-71.059769, lat:42.358429}, f_start_date: new Date(2016, 8, 7), f_end_date: new Date(2016, 11, 18), s_start_date: new Date(2017, 0, 9), s_end_date: new Date(2017, 3, 28)}
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
	let earliest = colleges[0].sunset;

	for(let x = 0; x < colleges.length; x++){
		if(colleges[x].sunset < earliest){
			earliest = colleges[x].sunset;
		}

		let sunset = new Date(colleges[x].sunset * 1000);
		let offset = colleges[x].offset;
		sunset = new Date(sunset.getFullYear(), sunset.getMonth(), sunset.getDate(), sunset.getUTCHours() + offset, sunset.getMinutes());
		colleges[x].sunset = sunset;
		let curr_line = colleges[x].name + ": " + format_time(sunset) + "\n";
		message += curr_line;
	}
	return {
		message: message,
		toPrint: earliest
	}
}

function format_time(date_obj) {
	var hour = date_obj.getHours() - 12;
	var minute = date_obj.getMinutes();

	if(minute < 10) {
		minute = "0" + minute;
	}

	return hour + ":" + minute + "pm";
}

function getSunsets(colleges){
	let promise = getCollegeData(colleges);
	promise.then(function(college_sunsets){
		let final_info = composeMessage(college_sunsets);
		let sunset_message = final_info.message + "\n" + credits + "\n🌇 ";
		fs.writeFileSync('sunsets.txt', sunset_message);
	}).done();
}


function collegesInSession(unfiltered_colleges){
	let filtered = [];
	let now = new Date(Date.now());

	for(let x = 0; x < unfiltered_colleges.length; x++){
		let f_start_date = unfiltered_colleges[x].f_start_date;
		let f_end_date = unfiltered_colleges[x].f_end_date;

		if(f_start_date <= now && now <= f_end_date){
			filtered.push(unfiltered_colleges[x]);
			continue;
		}

		let s_start_date = unfiltered_colleges[x].s_start_date;
		let s_end_date = unfiltered_colleges[x].s_end_date;

		if(s_start_date <= now && now <= s_end){
			filtered.push(unfiltered_colleges[x]);
			continue;
		}
	}

	return filtered;
}

let in_session = collegesInSession(current_colleges);
getSunsets(in_session);
// console.log("DID THIS");
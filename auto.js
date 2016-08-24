const login = require("facebook-chat-api");
const fs = require('fs');
const group_id = 1021030684592995;

function sendMessageWithLogin(email, password, chat_id, sunsets){
	login({email: email, password: password}, function callback (err, api) {
	    if(err) return console.error(err);

	    //store appstate for future use
	    fs.writeFileSync(__dirname + '/auth/appstate.json', JSON.stringify(api.getAppState()));

	    let message = {body: sunsets};
	    //chat_id = api.getCurrentUserID();
	    api.sendMessage(message, chat_id);
	});
}

function sendMessageWithAppstate(chat_id, sunsets){
	login({appState: JSON.parse(fs.readFileSync(__dirname + '/auth/appstate.json', 'utf8'))}, function callback (err, api) {
	    if(err) return console.error(err);

	    let message = {body: sunsets};
	    //chat_id = api.getCurrentUserID();
	    api.sendMessage(message, chat_id);
	});
}

function readSunsets(){
	let sunsets = fs.readFileSync('sunsets.txt', 'utf8');
	return sunsets;
}

function init(chat_id){
	let appstate = fs.readFileSync(__dirname + '/auth/appstate.json', 'utf8');
	let now = new Date(Date.now());
	let expire = appstate[0].expires;
	let sunset = readSunsets();

	appstate = JSON.parse(appstate);
	expire = Date.parse(expire);

	if(now > expire){
		console.log('sending with login credentials');
		let login_info = fs.readFileSync(__dirname + '/auth/server_data.json', 'utf8');
		sendMessageWithLogin(login_info.facebook_username, login_info.facebook_password, chat_id, sunset);
	} else{
		console.log('sending with app state');
		console.log(sunset);
		sendMessageWithAppstate(chat_id, sunset);
	}

	fs.unlinkSync('sunsets.txt');
}

init(group_id);




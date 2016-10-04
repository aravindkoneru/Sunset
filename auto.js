const login = require("facebook-chat-api");
const fs = require('fs');
const group_id = 1021030684592995;

function sendMessageWithLogin(email, password, chat_id, sunsets){
	login({email: email, password: password}, function callback (err, api) {
	    if(err) return console.error(err);

	    //store appstate for future use
	    fs.writeFileSync(__dirname + '/auth/appstate.json', JSON.stringify(api.getAppState()));

	    let message = {body: sunsets,
			   attachment: fs.createReadStream(__dirname + "/meme_of_day.jpg")};
	    //chat_id = api.getCurrentUserID();
	    api.sendMessage(message, chat_id);

	    deleteTempFiles();
	});
}

function sendMessageWithAppstate(chat_id, sunsets){
	login({appState: JSON.parse(fs.readFileSync(__dirname + '/auth/appstate.json', 'utf8'))}, function callback (err, api) {
	    if(err) return console.error(err);

	    let message = {body: sunsets,
	    			   attachment: fs.createReadStream(__dirname + "/meme_of_day.jpg")};
	    //chat_id = api.getCurrentUserID();
	    api.sendMessage(message, chat_id);

	    deleteTempFiles();
	});
}

function deleteTempFiles(){
	fs.unlinkSync('pasta_of_the_day.txt');
	fs.unlinkSync('sunsets.txt');
	fs.unlinkSync('meme_of_day.jpg');
}

function readSunsets(){
	let sunsets = fs.readFileSync('sunsets.txt', 'utf8');
	return sunsets;
}

function readCopyPasta(){
	let pasta = fs.readFileSync('pasta_of_the_day.txt');
	return pasta;
}

function init(chat_id){
	console.log('in init');
	let appstate = fs.readFileSync(__dirname + '/auth/appstate.json', 'utf8');
	let now = new Date(Date.now());
	let expire = appstate[0].expires;
	let sunset = readSunsets();
	let pasta = readCopyPasta();
	let message = sunset + "\nCopy Pasta of the Day:\n" + pasta + "\nMeme of the Day:";

	appstate = JSON.parse(appstate);
	expire = Date.parse(expire);

	if(now > expire){
		console.log('sending with login credentials');
		console.log(message);
		let login_info = JSON.parse(fs.readFileSync(__dirname + '/auth/server_data.json', 'utf8'));
		sendMessageWithLogin(login_info.facebook_username, login_info.facebook_password, chat_id, message);
	} else{
		console.log('sending with app state');
		console.log(message);
		sendMessageWithAppstate(chat_id, message);
	}
}

init(group_id);




Sunset Bot
---

Sunset is a facebook messenger bot that automatically retrieves and prints a the sunsets for a list of colleges as well as the top copypasta of the day from [/r/copypasta](reddit.com/r/copypasta). 

Set Up
---

Request [Google Maps Api Key](https://console.developers.google.com/apis/dashboard)

Request [open weather map api key](http://openweathermap.org)

Create a JSON file named `auth.json` that looks like the following: 

```
{
	"google_api": "KEY HERE",
	"weather_api": "KEY HERE",
	"facebook_username": "username",
	"facebook_password", "password",
	"credits": "some string"
}
```

Put `auth.json` in a folder name `auth`

Automation
---

`cron` on Linux and `launchd` on macOS. 




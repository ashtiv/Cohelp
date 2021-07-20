const express = require('express')
const app = express()
app.use(express.static('public'));
var path = require('path');
const port = process.env.PORT || 3000;
const QuickChart = require('quickchart-js');
const myChart = new QuickChart();
const request = require('request');
app.use(express.urlencoded({ extended: true }));
const options = {
  method: 'GET',
  url: 'https://www.mohfw.gov.in/data/datanew.json',
};

app.get('/states', (req, res) => {
    request(options, function (error, response, body) {
	if (error) throw new Error(error);
	const mm=JSON.parse(body);
	res.render("states.ejs",{mm:mm});
});
})
app.get('/india', (req, res) => {
    request(options, function (error, response, body) {
	if (error) throw new Error(error);
	const mm=JSON.parse(body);
	const tot=parseInt(mm[36].cured)+parseInt(mm[36].death)+parseInt(mm[36].active);
	const cup=(parseInt(mm[36].cured*100)/tot).toPrecision(4);
	const dep=(parseInt(mm[36].death*100)/tot).toPrecision(4);
	const acp=(parseInt(mm[36].active*100)/tot).toPrecision(4);
	myChart.setConfig({
	  "type": "outlabeledPie",
	  "data": {
	    "labels": ["Cured "+cup+"%", "Deceased "+dep+"%", "Active "+acp+"%"],
	    "datasets": [{
	        "backgroundColor": ["green", "red", "orange"],
	        "borderWidth":0,
	        "data": [mm[36].cured, mm[36].death, mm[36].active]
	    }]
	  },
	  "options": {
	    "plugins": {
	      "legend": false,
	      "outlabels": {
	        "text": "%l",
	        "color": "white",
	        "stretch": 35,
	        "font": {
	          "resizable": true,
	          "minSize": 12,
	          "maxSize": 18
	        }
	      }
	    }
	  }
	})
	.setBackgroundColor('#050A18');
	const chart=myChart.getUrl();
	res.render("india.ejs",{mm:mm[36],chart:chart});
});
})
app.get('/vaccine', (req, res) => {
   	res.render("vacci.ejs");
})
app.get('/', (req, res) => {
   	res.render("home.ejs");
})
app.get('/bmi', (req, res) => {
   	res.redirect('https://ashtiv.github.io/bmi/bmi.html');
})
app.post('/pinsearch', (req, res) => {
	let citypin=req.body.pin;
	let today = new Date();
	let date =today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
	// console.log(date);
	// console.log(req.body.pin);
	// 274203&date=09-07-2021
	let uu='https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode='+citypin+'&date='+date;
	// console.log(uu);
	const option2 = {
	  method: 'GET',
	  url: uu,
	};
    request(option2, function (error, response, body) {
 	if (error) throw new Error(error);
 	const mm1=JSON.parse(body);
 	console.log(uu);
 	const mm=mm1.centers;
 	res.render("vacpinresult.ejs",{mm:mm});
 	// res.render("vacsearch.ejs");
    });
})
app.get('/publicadvice', (req, res) => {
   	res.render('publicad.ejs');
})
app.get('/vacinfo', (req, res) => {
   	res.render('vacinfo.ejs');
})
app.listen(port, () => console.log(`App listening on port ${port}!`))
// <!-- Run this in nodejs: nodemon index.js -->
// <!-- Then load the page localhost:3000 and localhost:3000/all.html -->

const express = require('express');
const Datastore = require('nedb');
const fetch = require('node-fetch');  // v2, v3 reqires ESM
// import fetch from 'node-fetch';  // requires a module
require('dotenv').config();

// console.log(process.env);
// const {
//     t
// } = require('xstate');

const app = express();
app.listen(3000, () => console.log('Listening at 3000'));
app.use(express.static('public'));
app.use(express.json({
    limit: '1mb'
}));
// const database = [];
const database = new Datastore('database.db');
database.loadDatabase();
// database.insert({ name: 'Rosenblitt', status: '🌈'})
// database.insert({ name: 'Jonathan', status: '🚆'})

app.get('/api', (request, response) => {
    database.find({}, (err, data) => {
        if (err) {
            response.end();
            return;
        }
        response.json(data);
    })
    // response.json({ test: 123 });
})



app.post('/api', (request, response) => {
    console.log('I got a request!');
    // console.log(request.body);
    const data = request.body;
    const timestamp = Date.now();
    data.timestamp = timestamp;
    // database.push(data);
    database.insert(data);
    // console.log(database);
    response.json(data);
    // response.json({
    //     status: 'success',
    //     timestamp: timestamp,
    //     latitude: request.body.lat,
    //     longitude: request.body.lon,
    //     mood: request.body.mood
    // });
});

app.get('/weather/:latlon', async (request, response) => {
    console.log(request.params);
    const latlon = request.params.latlon.split(',');
    console.log(latlon);
    const lat = latlon[0];
    const lon = latlon[1];
    console.log(lat, lon);
    // const api_key = 'ec9d344fe79962a17be4d1797f1e9648';
    const api_key = process.env.API_KEY;
    const weather_url=`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=&units=imperial&appid=${api_key}`;
    const weather_response = await fetch(weather_url);
    const weather_data = await weather_response.json();
    // console.log(weather_data);
    // response.json(weather_data);

    const aq_url=`https://docs.openaq.org/v2/latest?coordinates=${lat},${lon}`;
    const aq_response = await fetch(aq_url);
    const aq_data = await aq_response.json();
    // console.log(aq_data);
    const data = {
        weather: weather_data,
        air_quality: aq_data
    };

    response.json(data);
});
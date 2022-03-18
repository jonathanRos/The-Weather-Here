// Making a map and tiles
const mymap = L.map('checkinMap').setView([0, 0], 2);
const attribution = 
    '&copy; <a href="https://www.openstreetmap.org//copyright">OpenStreetMap</a> contributors';
const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tiles = L.tileLayer(tileUrl, { attribution });
tiles.addTo(mymap);


// Geo Locate
// let lat, lon;
if ('geolocation' in navigator) {
    console.log('geolocation available');
    // console.log(navigator.userAgentData.brands);
    navigator.geolocation.getCurrentPosition(async position => {
        let lat, lon, weather, air;
        try {
            lat = position.coords.latitude;
            lon = position.coords.longitude;
            // console.log(lat, lon);
            document.getElementById('latitude').textContent = lat.toFixed(2);
            document.getElementById('longitude').textContent = lon.toFixed(2);
            console.log(position.coords);
            // const api_url=`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=&units=imperial&appid=ec9d344fe79962a17be4d1797f1e9648`;
            const api_url = `weather/${lat},${lon}`;
            // const api_url = '/weather';
            const response = await fetch(api_url);
            const json = await response.json();
            // console.log(json);
            weather = json.weather;
            // console.log(json.air_quality);
            air = json.air_quality.results[0].measurements[0];

            document.getElementById('summary').textContent = weather.current.weather[0].description;
            document.getElementById('temperature').textContent = weather.current.temp;
    
            document.getElementById('aq_parameter').textContent = air.parameter;
            document.getElementById('aq_value').textContent = air.value;
            document.getElementById('aq_units').textContent = air.unit;
            document.getElementById('aq_date').textContent = air.lastUpdated;
    
            // const data = { lat, lon, weather, air };
            // const options = {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify(data)
            // };
            // const db_reponse = await fetch('/api', options);
            // const db_json = await db_reponse.json();
            // console.log(db_json);
        } catch (error) {
            // console.log('something went wrong');
            console.error(error);
            air = { value: -1};
            document.getElementById('aq_value').textContent = 'NO READING';
        }
        const data = { lat, lon, weather, air };
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
        const db_reponse = await fetch('/api', options);
        const db_json = await db_reponse.json();

    });

} else {
    console.log('geolocation not available');
}



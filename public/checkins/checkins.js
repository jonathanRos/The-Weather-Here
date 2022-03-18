// Making a map and tiles
const mymap = L.map('checkinMap').setView([0, 0], 2);
const attribution = 
    '&copy; <a href="https://www.openstreetmap.org//copyright">OpenStreetMap</a> contributors';
const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tiles = L.tileLayer(tileUrl, { attribution });
tiles.addTo(mymap);

getData();
async function getData() {
    const response = await fetch('/api');
    const data = await response.json();

    for (item of data) {
        const marker = L.marker([item.lat, item.lon]).addTo(mymap)
        // console.log(item);
        const weather = item.weather.current.weather[0];
        // console.log(weather);
        let txt = `The weather here at latitude ${item.lat}&deg;, 
            longitude ${item.lon}&deg; is ${weather.description} with a temperature of 
            ${item.weather.current.temp}&deg; F.`;

        if ( item.air.value < 0 ) {
            txt += '  No air quality reading.'

        } else {}
            txt += ` The concentration of particulate 
            matter (${item.air.parameter}) is ${item.air.value} ${item.air.unit} 
            last read on ${item.air.lastUpdated}.`;

        marker.bindPopup(txt);

        // const root = document.createElement('p');
        // const geo = document.createElement('div');
        // const date = document.createElement('div');

        // geo.textContent = `${item.lat}°, ${item.lon}°`;
        // const dateString = new Date(item.timestamp).toLocaleString();
        // date.textContent = dateString;

        // root.append(geo, date);
        // document.body.append(root);
    }

    console.log(data);
}

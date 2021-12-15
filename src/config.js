var uri = '/api/'

if (window.location.hostname === 'localhost') {
    //uri = 'http://localhost:9096/';
    uri = 'https://iot2.pavoucek.net/api/';
}

export const API = uri

export const INFLUXDB_URI = 'https://iot2.pavoucek.net/influxdb/'

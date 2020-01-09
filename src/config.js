var uri = '/api/'

if (window.location.hostname === 'localhost') {
    //uri = 'http://localhost:9096/';
    uri = 'https://iot2.pavoucek.net/api/';
}

export const API = uri

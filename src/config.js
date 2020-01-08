var uri = '/api/'

if (window.location.hostname === 'localhost') {
    uri = 'http://localhost:9096/';
}

export const API = uri

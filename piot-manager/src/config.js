var uri = '/api/'
// if process package exists (running in node js)
if (typeof process === 'object') {
    uri = process.env.PIOT_API ? process.env.PIOT_API  : 'http://localhost:9096/';
}

export const API = uri

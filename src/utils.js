import {token} from './stores'
import {API} from './config'

export async function gql(request) {

    let token_value = null;

    let unsubscribe = token.subscribe((value) => { token_value = value});
    unsubscribe();

    let response = await fetch(
        API + 'query',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token_value,
            },
            body: JSON.stringify(request)
        })

    if (response.status !== 200) {
        throw response;
    }

    let data = await response.json();

    if (data.errors) {
        throw data.errors;
    }

    return data.data;
}

function zeroPad(num, size) {

    // convert number to string
    var s = num + "";

    // pad as many zeros as necessary
    while (s.length < size) s = "0" + s;

    return s;
}

export function formatDate(timeStamp) {

    if (timeStamp == 0) {
        return '-';
    }

    var d = new Date();
    d.setTime(timeStamp * 1000)
    //return d.toUTCString();
    return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} ${zeroPad(d.getHours(), 2)}:${zeroPad(d.getMinutes(), 2)}:${zeroPad(d.getSeconds(), 2)}`
}

export function formatTimeSince(timeStamp) {

    if (timeStamp == 0) {
        return '-';
    }

    var date = new Date();
    date.setTime(timeStamp * 1000)

    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
        return interval + " years";
    }

    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + " months";
    }

    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + " days";
    }

    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " hours";
    }

    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + " minutes";
    }

    return Math.floor(seconds) + " seconds";
}

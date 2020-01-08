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

export function formatDate(timeStamp) {

    if (timeStamp == 0) {
        return '-';
    }

    var d = new Date();
    d.setTime(timeStamp * 1000)
    //return d.toUTCString();
    return `${d.getFullYear()}/${d.getMonth()}/${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`
}


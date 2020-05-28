import {profile, token} from './stores'
import {gql} from './utils';

function store_profile(p) {

    // get active org index
    p.org_ix = null;
    for (let ix = 0; ix < p.orgs.length; ix++) {
        if (p.orgs[ix].id === p.org_id) {
            p.org_ix = ix;
            break;
        }
    }
    profile.set(p);
}

export async function fetch_user_profile() {

    let token_value = null;
    let unsubscribe = token.subscribe((value) => { token_value = value});
    unsubscribe();

    if (token_value) {

        let data = await gql({query: "{userProfile {is_admin, email, org_id, orgs {id, name, influxdb, influxdb_username, influxdb_password}}}"});

        store_profile(data.userProfile);
    }
}

export async function set_active_org(org_id) {

    let token_value = null;
    let unsubscribe = token.subscribe((value) => { token_value = value});
    unsubscribe();

    if (token_value) {
        let data = await gql({query: `mutation {updateUserProfile(profile: {org_id: "${org_id}"}) {is_admin, email, org_id, orgs {id, name}}}`});

        store_profile(data.updateUserProfile);
    }
}

export async function thing_delete(id) {

    let token_value = null;
    let unsubscribe = token.subscribe((value) => { token_value = value});
    unsubscribe();

    if (token_value) {
        let data = await gql({query: `mutation {deleteThing(id: "${id}")}`});
    } else {
        console.log('api:request to delete thing %s ignored due to missing token value', id, token)
    }
}

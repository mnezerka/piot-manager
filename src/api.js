import {profile, token} from './stores'
import {gql} from './utils';

function store_profile(p) {

    console.log('storing profile data', p);

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

    console.log('request to fetch user profile');

    if (token_value) {

        console.log('fetching user profile');

        let data = await gql({query: "{userProfile {is_admin, email, org_id, orgs {id, name}}}"});

        console.log('have profile');

        store_profile(data.userProfile);
    }
}

export async function set_active_org(org_id) {

    let token_value = null;
    let unsubscribe = token.subscribe((value) => { token_value = value});
    unsubscribe();

    console.log('request to set active org');

    if (token_value) {
        let data = await gql({query: `mutation {updateUserProfile(profile: {org_id: "${org_id}"}) {is_admin, email, org_id, orgs {id, name}}}`});

        console.log('have profile');

        store_profile(data.updateUserProfile);
    }
}


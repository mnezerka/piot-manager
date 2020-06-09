import Home from './pages/Home.svelte'
import NotFound from './pages/NotFound.svelte'
import Orgs from './pages/Orgs.svelte'
import Org from './pages/Org.svelte'
import OrgAdd from './pages/OrgAdd.svelte'
import Users from './pages/Users.svelte'
import User from './pages/User.svelte'
import UserAdd from './pages/UserAdd.svelte'
import Things from './pages/Things.svelte'
import ThingsAdmin from './pages/ThingsAdmin.svelte'
import Thing from './pages/Thing.svelte'
import ThingAdd from './pages/ThingAdd.svelte'
import Map from './pages/Map.svelte'
import Login from './pages/Login.svelte'
import Signout from './pages/Signout.svelte'

let routes = {
    '/': Home,
    '/orgs': Orgs,
    '/org/:id': Org,
    '/org-add': OrgAdd,
    '/users': Users,
    '/user/:id': User,
    '/user-add': UserAdd,
    '/things': Things,
    '/thingsadmin': ThingsAdmin,
    '/thing/:id': Thing,
    '/thing-add': ThingAdd,
    '/map': Map,
    '/login': Login,
    '/signout': Signout,

    // Catch-all, must be last
    '*': NotFound,
}

export default routes

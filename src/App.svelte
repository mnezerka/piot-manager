<script>
    import Router from 'svelte-spa-router';
    import {push, link} from 'svelte-spa-router';
    import routes from './routes.js';
    import Navbar from './components/Navbar.svelte';
    import {token, authenticated} from './stores.js'
    import {onMount} from 'svelte';
    import {gql} from './utils';
    import {set_active_org, fetch_user_profile} from './api';

    var authenticating = true;

    onMount(async () => {

        // verify that user token is valid - download user profile
        if ($token) {

            try {
                await fetch_user_profile()
                $authenticated = true;
            } catch(error) {
                error = 'Request failed (' + error + ')';
            }
        }
        authenticating = false;
    })

    async function on_org_change(org_id) {
        console.log('app - on org change', org_id);

        try {
            await set_active_org(org_id);
            push("/");
        } catch(error) {
            error = 'Request failed (' + error + ')';
        }

    }

</script>

{#if authenticating}
    <span>Authenticating</span>
{:else}
    <Navbar on_org_change={on_org_change}/>
    <Router {routes}/>
{/if}

<!--<main class="piot-main">
    <div class="container">
        {#if authenticating}
        <span>Authenticating</span>
        {:else}
        <Router {routes}/>
        {/if}
    </div>
</main> -->

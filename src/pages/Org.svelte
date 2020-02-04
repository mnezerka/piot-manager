<script>
    import {token, authenticated} from '../stores.js'
    import {push} from 'svelte-spa-router'
    import {gql} from '../utils.js';
    import {onMount} from 'svelte';
    import ErrorBar from '../components/ErrorBar.svelte';
    import TableButtonDelete from '../components/TableButtonDelete.svelte';

    export var params;

    let name = '';
    let description = '';
    let influxdb = '';
    let mqtt_username = '';
    let mqtt_password = '';
    let org = null;
    let error = null;
    let fetching = false;
    let success = null;

    onMount(() => {
        if (!$authenticated) { push("/login"); }
        fetchOrg()
    })

    async function fetchOrg() {
        if (!params.id) {
            error = 'No organization specified';
            return
        }

        fetching = true;
        error = null

        try {
            let data = await gql({query: `
                {
                    org(id: "${params.id}") {
                        id,
                        name,
                        description,
                        created,
                        users {id, email},
                        influxdb,
                        mqtt_username,
                        mqtt_password
                    }
                }`
            });
            org = data.org;
            name = org.name;
            description = org.description;
            influxdb = org.influxdb;
            mqtt_username = org.mqtt_username;
            mqtt_password = org.mqtt_password;
        } catch (e) {
            error = e;
        }
        fetching = false;
    }

    async function updateOrg()
    {
        if (name.length === 0) {
            error = 'No name specified'
            return
        }

        fetching = true;
        error = null;
        success = false;

        try {
            let data = await gql({query: `
                    mutation {
                        updateOrg(org: {
                            id: "${params.id}",
                            name: "${name}",
                            description: "${description}",
                            influxdb: "${influxdb}",
                            mqtt_username: "${mqtt_username}",
                            mqtt_password: "${mqtt_password}"
                         }) {id}
                    }`});

            success = 'Organization successfully updated'
        } catch(e) {
            error = e;
        }
        fetching = false;
    }

    async function removeUser(e) {

        if (!e.detail.value || e.detail.value.length === 0) {
            error = 'No user specified'
            return
        }

        fetching = true;
        error = null;
        success = false;

        try {
            let data = await gql({query: `mutation {removeOrgUser(orgId: "${params.id}", userId: "${e.detail.value}")}`});
            success = 'User successfully removed from organization'
        } catch(e) {
            error = e;
        }
        fetching = false;

        await fetchOrg()
    }

</script>

<style>
form { width: 24rem;}
h2 { margin-top: 2rem; }
.delete-button { text-align: right; }
</style>

<h1 class="title">Organization</h1>

<ErrorBar error={error}/>

{#if success}<div class="notification is-success has-text-centered">{success}</div>{/if}

{#if org}

<form on:submit|preventDefault={updateOrg}>

    <div class="field">
        <label class="label">Name</label>
        <p class="control">
            <input bind:value={name} class="input {name.length === 0 && "is-danger"}" placeholder="Organization name">
        </p>
    </div>

    <div class="field">
        <label class="label">Description</label>
        <p class="control">
            <textarea bind:value={description} class="textarea" placeholder="Organization description"/>
        </p>
    </div>

    <div class="field">
        <label class="label">Influx database name (optional)</label>
        <p class="control">
            <input bind:value={influxdb} class="input">
        </p>
    </div>

    <div class="field">
        <label class="label">MQTT user name (optional)</label>
        <p class="control">
            <input bind:value={mqtt_username} class="input">
        </p>
    </div>

    <div class="field">
        <label class="label">MQTT password (optional)</label>
        <p class="control">
            <input bind:value={mqtt_password} class="input">
        </p>
    </div>

    <div class="field">
        <p class="control">
            <button class="button is-success">Update</button>
        </p>
    </div>

</form>

<h2 class="subtitle">Users</h2>

<table class="table is-fullwidth">
    <thead>
        <tr>
            <th>Email</th>
            <th></th>
        </tr>
    </thead>
    <tbody>
        {#each org.users as user}
        <tr>
            <td>{user.email}</td>
            <td class="delete-button">
                <TableButtonDelete value={user.id} on:click={removeUser} />
            </td>
        </tr>
        {/each}
    </tbody>
</table>

{/if}

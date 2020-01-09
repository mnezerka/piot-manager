<script>
    import {token, authenticated} from '../stores.js'
    import {push} from 'svelte-spa-router'
    import {gql} from '../utils.js';
    import {onMount} from 'svelte';
    import ErrorBar from '../components/ErrorBar.svelte';
    import TableButtonDelete from '../components/TableButtonDelete.svelte';

    export var params;

    let alias = '';
    let thing = null;
    let error = null;
    let fetching = false;
    let success = null;
    let orgs = [];
    let orgsAssigned = [];
    let orgAdd = '';
    let orgId = null;
    let enabled = null;
    let storeInfluxDb = null;

    onMount(() => {
        if (!$authenticated) { push("/login"); }
        fetchThing();
    })

    async function fetchThing() {
        if (!params.id) {
            error = 'No thing specified';
            return
        }

        fetching = true;
        error = null

        try {
            let data = await gql({query: `{thing(id: "${params.id}") {id, name, type, alias, enabled, org {id}, sensor {class, measurement_topic, store_influxdb}} orgs {id, name}}`});
            thing = data.thing;
            alias = thing.alias;
            orgId = thing.org ? thing.org.id : "";
            orgs = data.orgs;
            enabled = thing.enabled;
            storeInfluxDb = thing.sensor ? thing.sensor.store_influxdb: null;

            //orgsAssigned = user.orgs.map(o => o.id);
        } catch (e) {
            error = e;
        }
        fetching = false;
    }

    async function updateThing()
    {
        fetching = true;
        error = null;
        success = false;

        console.log(enabled);

        try {
            let orgIdStr = orgId === "" ? "null" : `"${orgId}"`
            let data = await gql({query: `mutation {updateThing(thing: {id: "${params.id}", alias: "${alias}", orgId: ${orgIdStr}, enabled: ${enabled}}) {id}}`});
            success = 'Thing successfully updated'
        } catch(e) {
            error = e;
        }
        fetching = false;
    }

    async function updateThingSensorData()
    {
        fetching = true;
        error = null;
        success = false;

        try {
            let data = await gql({query: `mutation {updateThingSensorData(data: {id: "${params.id}", store_influxdb: ${storeInfluxDb}}) {id}}`});
            success = 'Thing sensor data successfully updated'
        } catch(e) {
            error = e;
        }
        fetching = false;
    }

    async function orgSet()
    {
        console.log('set org');
    }

</script>

<style>
form { width: 24rem;}
h2 { margin-top: 2rem; }
.delete-button { text-align: right; }
</style>

<h1 class="title">Thing</h1>

<ErrorBar error={error}/>

{#if success}<div class="notification is-success has-text-centered">{success}</div>{/if}

{#if thing}

<form on:submit|preventDefault={updateThing}>

    <div class="field">
        <label class="label">Name</label>
        <p>{thing.name}</p>
    </div>

    <div class="field">
        <label class="label">Unique Id</label>
        <p>{thing.id}</p>
    </div>

    <div class="field">
        <label class="label">Type</label>
        <p>{thing.type}</p>
    </div>

    <div class="field">
        <label class="label">Alias</label>
        <p class="control">
            <input bind:value={alias} class="input" placeholder="Thing alias">
        </p>
    </div>

    <div class="field">
        <label class="label">Organization</label>
        <div class="control">
            <div class="select">
                <select bind:value={orgId}>
                    <option value="">---</option>
                    {#each orgs as org}
                    <option value="{org.id}">{org.name}</option>
                    {/each}
                </select>
            </div>
        </div>
    </div>

    <div class="field">
        <label class="label">Enabled</label>
        <div class="control">
            <div class="select">
                <select bind:value={enabled}>
                    <option value="{true}">Yes</option>
                    <option value="{false}">No</option>
                </select>
            </div>
        </div>
    </div>


    <div class="field">
        <p class="control">
            <button class="button is-success">Update</button>
        </p>
    </div>

</form>

    {#if thing.type == "sensor" && thing.sensor}
        <h1 class="subtitle">Sensor Data</h1>
        <form on:submit|preventDefault={updateThingSensorData}>

            <div class="field">
                <label class="label">Class</label>
                <p>{thing.sensor.class}</p>
            </div>

            <div class="field">
                <label class="label">MQTT Measurement Topic</label>
                <p>{thing.sensor.measurement_topic}</p>
            </div>

            <div class="field">
                <label class="label">Store to InfluxDB</label>
                <div class="control">
                    <div class="select">
                        <select bind:value={storeInfluxDb}>
                            <option value="{true}">Yes</option>
                            <option value="{false}">No</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="field">
                <p class="control">
                    <button class="button is-success">Update</button>
                </p>
            </div>



        </form>

    {/if}


{/if}

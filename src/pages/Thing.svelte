<script>
    import {token, authenticated} from '../stores.js'
    import {push} from 'svelte-spa-router'
    import {gql, formatDate} from '../utils.js';
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
    let name = null;
    let piotId = null;
    let enabled = null;
    let storeInfluxDb = null;
    let sensorClass = null;
    let sensorMeasurementTopic = null;
    let sensorMeasurementValue = null;

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
            let data = await gql({query: `{thing(id: "${params.id}") {id, piot_id, name, created, type, alias, enabled, org {id, name}, sensor {value, class, measurement_topic, measurement_value, store_influxdb}} orgs {id, name}}`});
            thing = data.thing;
            alias = thing.alias;
            orgId = thing.org ? thing.org.id : "";
            orgs = data.orgs;
            name = thing.name;
            piotId = thing.piot_id;
            enabled = thing.enabled;
            storeInfluxDb = thing.sensor ? thing.sensor.store_influxdb : null;
            sensorClass = thing.sensor ? thing.sensor.class : null;
            sensorMeasurementTopic = thing.sensor ? thing.sensor.measurement_topic: null;
            sensorMeasurementValue = thing.sensor ? thing.sensor.measurement_value: null;

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

        try {
            let orgIdStr = orgId === "" ? "null" : `"${orgId}"`
            let data = await gql({query: `mutation {
                updateThing(
                    thing: {
                        id: "${params.id}",
                        piotId: "${piotId}",
                        name: "${name}",
                        alias: "${alias}",
                        orgId: ${orgIdStr},
                        enabled: ${enabled}
                    }
                ) {id}
            }`});
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
            let data = await gql({query: `mutation {
                updateThingSensorData(
                    data: {
                        id: "${params.id}",
                        class: "${sensorClass}",
                        store_influxdb: ${storeInfluxDb},
                        measurement_topic: "${sensorMeasurementTopic}",
                        measurement_value: "${sensorMeasurementValue}"
                    }
                ) {id}
            }`});
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
        <p class="control">
            <input bind:value={name} class="input" placeholder="Thing unique name">
        </p>
    </div>

    <div class="field">
        <label class="label">PIOT Id</label>
        <p class="control">
            <input bind:value={piotId} class="input" placeholder="Optional value for PIOT device identification">
        </p>
    </div>

    <div class="field">
        <label class="label">Unique Id</label>
        <p>{thing.id}</p>
    </div>

    <div class="field">
        <label class="label">Created</label>
        <p>{formatDate(thing.created)}</p>
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
                <label class="label">Value</label>
                <p>{thing.sensor.value}</p>
            </div>

            <div class="field">
                <label class="label">Class</label>
                <div class="control is-expanded">
                    <div class="select is-fullwidth">
                        <select bind:value={sensorClass}>
                            <option value=""></option>
                            <option value="temperature">Temperature</option>
                            <option value="humidity">Humidity</option>
                            <option value="pressure">Pressure</option>
                        </select>
                    </div>
                </div>
           </div>

            <label class="label">MQTT Measurement Topic</label>
            <div class="field has-addons">
                <p class="control">
                    <a class="button is-static">org/{thing.org ? thing.org.name : "?"}/</a>
                </p>
                <p class="control">
                    <input bind:value={sensorMeasurementTopic} class="input" placeholder="Measurement topic">
                </p>
            </div>

            <div class="field">
                <label class="label">MQTT Measurement Value</label>
                <p class="control">
                    <input bind:value={sensorMeasurementValue} class="input" placeholder="Measurement value template">
                </p>
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

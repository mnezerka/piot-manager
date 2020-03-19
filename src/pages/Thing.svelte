<script>
    import {token, authenticated} from '../stores.js'
    import {push} from 'svelte-spa-router'
    import {gql, formatDate} from '../utils.js';
    import {onMount} from 'svelte';
    import ErrorBar from '../components/ErrorBar.svelte';
    import TableButtonDelete from '../components/TableButtonDelete.svelte';
    import Tabs from '../components/Tabs.svelte';
    import ThingGeneralForm from '../components/ThingGeneralForm.svelte';
    import ThingMqttForm from '../components/ThingMqttForm.svelte';
    import ThingLocationForm from '../components/ThingLocationForm.svelte';
    import ThingStorageForm from '../components/ThingStorageForm.svelte';
    import ThingSensorForm from '../components/ThingSensorForm.svelte';
    import ThingSwitchForm from '../components/ThingSwitchForm.svelte';
    import SmartTitle from '../components/SmartTitle.svelte';

    export var params;

    let thing = null;
    let error = null;
    let fetching = false;
    let success = null;
    let orgs = [];

    const tabs = [
        {id: 'general', label: 'General'},
        {id: 'storage', label: 'Storage'},
        {id: 'location', label: 'Location'},
        {id: 'mqtt', label: 'MQTT'},
        {id: 'sensor', label: 'Sensor'},
        {id: 'switch', label: 'Switch'},
    ]
    let tab = 'general';

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
            let data = await gql({query: `{
                thing(id: "${params.id}") {
                    id,
                    piot_id,
                    name,
                    created,
                    type,
                    alias,
                    enabled,
                    org {id, name},
                    availability_topic,
                    telemetry_topic,
                    telemetry,
                    store_influxdb,
                    store_mysqldb,
                    store_mysqldb_interval,
                    last_seen_interval,
                    sensor {value, class, measurement_topic, measurement_value},
                    switch {state, state_topic, state_on, state_off, command_topic, command_on, command_off},
                    location_mqtt_topic,
                    location_mqtt_lat_value,
                    location_mqtt_lng_value,
                    location_mqtt_sat_value,
                    location_mqtt_ts_value,
                    location_lat,
                    location_lng,
                    location_sat,
                    location_ts,
                    location_tracking
                }
                orgs {id, name}
            }`});
            thing = data.thing;
            orgs = data.orgs;

        } catch (e) {
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
                        class: "${thing.sensor.class}",
                        measurement_topic: "${thing.sensor.measurement_topic}",
                        measurement_value: "${thing.sensor.measurement_value}"
                    }
                ) {id}
            }`});
            success = 'Thing sensor data successfully updated'
        } catch(e) {
            error = e;
        }
        fetching = false;
    }

    async function updateThingSwitchData()
    {
        fetching = true;
        error = null;
        success = false;

        try {
            let data = await gql({query: `mutation {
                updateThingSwitchData(
                    data: {
                        id: "${params.id}",
                        state_topic: "${thing.switch.state_topic}",
                        state_on: "${thing.switch.state_on}",
                        state_off: "${thing.switch.state_off}",
                        command_topic: "${thing.switch.command_topic}",
                        command_on: "${thing.switch.command_on}",
                        command_off: "${thing.switch.command_off}"
                    }
                ) {id}
            }`});
            success = 'Thing switch data successfully updated'
        } catch(e) {
            error = e;
        }
        fetching = false;
    }

    function onTabChange(new_tab) {
        tab = new_tab;
    }

    async function updateThingData(thingData) {
        console.log("update thing data", thingData);

        fetching = true;
        error = null;
        success = false;

        try {
            thing.org.id = thing.org.id === "" ? "null" : thing.org.id
            let data = await gql({query: `mutation {
                updateThing(
                    thing: {
                        id: "${params.id}",
                        piotId: "${thing.piot_id}",
                        name: "${thing.name}",
                        type: "${thing.type}",
                        alias: "${thing.alias}",
                        orgId: "${thing.org.id}",
                        enabled: ${thing.enabled},
                        last_seen_interval: ${thing.last_seen_interval},
                        availability_topic: "${thing.availability_topic}",
                        telemetry_topic: "${thing.telemetry_topic}",
                        store_influxdb: ${thing.store_influxdb},
                        store_mysqldb: ${thing.store_mysqldb},
                        store_mysqldb_interval: ${thing.store_mysqldb_interval}
                        location_lat: ${thing.location_lat},
                        location_lng: ${thing.location_lng},
                        location_tracking: ${thing.location_tracking},
                        location_mqtt_topic: "${thing.location_mqtt_topic}",
                        location_mqtt_lat_value: "${thing.location_mqtt_lat_value}",
                        location_mqtt_lng_value: "${thing.location_mqtt_lng_value}",
                        location_mqtt_sat_value: "${thing.location_mqtt_sat_value}",
                        location_mqtt_ts_value: "${thing.location_mqtt_ts_value}",
                    }
                ) {id}
            }`});
            success = 'Thing successfully updated'
        } catch(e) {
            error = e;
        }
        fetching = false;
    }

</script>

<style>
form { width: 24rem;}
h2 { margin-top: 2rem; }
.delete-button { text-align: right; }
</style>

<SmartTitle title="Thing" subTitle={success}/>

<ErrorBar error={error}/>


{#if thing}

    <Tabs tabs={tabs} active={tab} onChange={onTabChange}/>

    {#if tab === 'general'}
        <ThingGeneralForm thing={thing} orgs={orgs} onSubmit={updateThingData} />
    {/if}

    {#if tab === 'mqtt'}
        <ThingMqttForm thing={thing} onSubmit={updateThingData} />
    {/if}

    {#if tab === 'location'}
        <ThingLocationForm thing={thing} onSubmit={updateThingData} />
    {/if}

    {#if tab === 'storage'}
        <ThingStorageForm thing={thing} onSubmit={updateThingData} />
    {/if}

    {#if tab === 'sensor'}
        <ThingSensorForm thing={thing} onSubmit={updateThingSensorData} />
    {/if}

    {#if tab === 'switch'}
        <ThingSwitchForm thing={thing} onSubmit={updateThingSwitchData} />
    {/if}

{/if}

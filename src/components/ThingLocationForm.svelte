<script>
    import {formatDate} from '../utils.js';

    export var thing;
    export var onSubmit;

    function onFormSubmit() {
        if (onSubmit) {
            onSubmit(thing)
        }
    }
</script>

{#if thing}


<!-- svelte-ignore a11y-missing-attribute -->
<form on:submit|preventDefault={onFormSubmit}>

    <label class="label">Location</label>
    <div class="field">
        Lat: {thing.location_lat}, Lng: {thing.location_lng}, Satelites: {thing.location_sat}
    </div>

    <label class="label">Latitude</label>
    <div class="field">
        <p class="control">
            <input bind:value={thing.location_lat} class="input">
        </p>
    </div>

    <label class="label">Longitude</label>
    <div class="field">
        <p class="control">
            <input bind:value={thing.location_lng} class="input">
        </p>
    </div>

    <div class="field">
        <label class="label">Tracking (Influx database)</label>
        <div class="control">
            <div class="select">
                <select bind:value={thing.location_tracking}>
                    <option value="{true}">Yes</option>
                    <option value="{false}">No</option>
                </select>
            </div>
        </div>
    </div>

    <div class="field">
        <label class="label">Location Updated</label>
        <p>{formatDate(thing.location_ts)}</p>
    </div>

    <h3>MQTT</h3>

    <label class="label">MQTT Location Topic</label>
    <div class="field has-addons">
        <p class="control">
            <a class="button is-static">org/{thing.org ? thing.org.name : "?"}/</a>
        </p>
        <p class="control">
            <input bind:value={thing.location_mqtt_topic} class="input">
        </p>
    </div>

    <div class="field">
        <label class="label">MQTT Location Latitude Value</label>
        <p class="control">
            <input bind:value={thing.location_mqtt_lat_value} class="input">
        </p>
    </div>

    <div class="field">
        <label class="label">MQTT Location Longitude Value</label>
        <p class="control">
            <input bind:value={thing.location_mqtt_lng_value} class="input">
        </p>
    </div>

    <div class="field">
        <label class="label">MQTT Location Satelites Value</label>
        <p class="control">
            <input bind:value={thing.location_mqtt_sat_value} class="input">
        </p>
    </div>

    <div class="field">
        <label class="label">MQTT Location Timestamp Value</label>
        <p class="control">
            <input bind:value={thing.location_mqtt_ts_value} class="input">
        </p>
    </div>


    <div class="field">
        <p class="control">
            <button class="button is-success">Update</button>
        </p>
    </div>

</form>

{/if}

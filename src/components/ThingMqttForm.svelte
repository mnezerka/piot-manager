<script>
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

    <label class="label">MQTT Availability Topic</label>
    <div class="field has-addons">
        <p class="control">
            <a class="button is-static">org/{thing.org ? thing.org.name : "?"}/</a>
        </p>
        <p class="control">
            <input bind:value={thing.availability_topic} class="input">
        </p>
    </div>

    <label class="label">MQTT Telemetry Topic</label>
    <div class="field has-addons">
        <p class="control">
            <a class="button is-static">org/{thing.org ? thing.org.name : "?"}/</a>
        </p>
        <p class="control">
            <input bind:value={thing.telemetry_topic} class="input">
        </p>
    </div>

    <div class="field">
        <label class="label">Telemetry</label>
        <p>{thing.telemetry}</p>
    </div>

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

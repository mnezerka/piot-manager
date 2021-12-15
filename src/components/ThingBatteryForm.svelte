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

    <div class="field">
        <label class="label">Tracking (Influx database)</label>
        <div class="control">
            <div class="select">
                <select bind:value={thing.battery_level_tracking}>
                    <option value="{true}">Yes</option>
                    <option value="{false}">No</option>
                </select>
            </div>
        </div>
    </div>

    <h3>MQTT</h3>

    <label class="label">MQTT Battery Topic</label>
    <div class="field has-addons">
        <p class="control">
            <a class="button is-static">org/{thing.org ? thing.org.name : "?"}/</a>
        </p>
        <p class="control">
            <input bind:value={thing.battery_mqtt_topic} class="input">
        </p>
    </div>

    <div class="field">
        <label class="label">Battery Level Value</label>
        <p class="control">
            <input bind:value={thing.battery_mqtt_level_value} class="input">
        </p>
    </div>

    <div class="field">
        <p class="control">
            <button class="button is-success">Update</button>
        </p>
    </div>

</form>

{/if}

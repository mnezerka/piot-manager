<script>
    export var thing;
    export var onSubmit;

    function onFormSubmit() {
        if (onSubmit) {
            onSubmit(thing)
        }
    }
</script>

{#if thing && thing.type == "sensor" && thing.sensor}

<form on:submit|preventDefault={onFormSubmit}>

    <div class="field">
        <label class="label">Value</label>
        <p>{thing.sensor.value}</p>
    </div>

    <div class="field">
        <label class="label">Class</label>
        <div class="control is-expanded">
            <div class="select is-fullwidth">
                <select bind:value={thing.sensor.class}>
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
            <!-- svelte-ignore a11y-missing-attribute -->
            <a class="button is-static">org/{thing.org ? thing.org.name : "?"}/</a>
        </p>
        <p class="control">
            <input bind:value={thing.sensor.measurement_topic} class="input">
        </p>
    </div>

    <div class="field">
        <label class="label">MQTT Measurement Value</label>
        <p class="control">
            <input bind:value={thing.sensor.measurement_value} class="input">
        </p>
    </div>

    <div class="field">
        <p class="control">
            <button class="button is-success">Update</button>
        </p>
    </div>

</form>

{/if}

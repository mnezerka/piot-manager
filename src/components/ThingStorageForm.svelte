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

<form on:submit|preventDefault={onFormSubmit}>

    <div class="field">
        <label class="label">Store to Influx database</label>
        <div class="control">
            <div class="select">
                <select bind:value={thing.store_influxdb}>
                    <option value="{true}">Yes</option>
                    <option value="{false}">No</option>
                </select>
            </div>
        </div>
    </div>

    <div class="field">
        <label class="label">Store to Mysql database</label>
        <div class="control">
            <div class="select">
                <select bind:value={thing.store_mysqldb}>
                    <option value="{true}">Yes</option>
                    <option value="{false}">No</option>
                </select>
            </div>
        </div>
    </div>

    <div class="field">
        <label class="label">Mysql database interval (in seconds)</label>
        <p class="control">
            <input bind:value={thing.store_mysqldb_interval} class="input">
        </p>
    </div>

    <div class="field">
        <p class="control">
            <button class="button is-success">Update</button>
        </p>
    </div>

</form>

{/if}

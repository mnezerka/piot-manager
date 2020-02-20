<script>
    export var thing;
    export var onSubmit;

    function onFormSubmit() {
        if (onSubmit) {
            onSubmit(thing)
        }
    }
</script>

{#if thing && thing.type == "switch" && thing.switch}

<form on:submit|preventDefault={onFormSubmit}>

    <div class="field">
        <label class="label">State</label>
        <p>{thing.switch.state ? "ON" : "OFF"}</p>
    </div>

    <label class="label">MQTT State Topic</label>
    <div class="field has-addons">
        <p class="control">
            <a class="button is-static">org/{thing.org ? thing.org.name : "?"}/</a>
        </p>
        <p class="control">
            <input bind:value={thing.switch.state_topic} class="input">
        </p>
    </div>

    <div class="field">
        <label class="label">State Value ON</label>
        <p class="control">
            <input bind:value={thing.switch.state_on} class="input">
        </p>
    </div>

    <div class="field">
        <label class="label">State Value OFF</label>
        <p class="control">
            <input bind:value={thing.switch.state_off} class="input">
        </p>
    </div>

    <label class="label">MQTT Command Topic</label>
    <div class="field has-addons">
        <p class="control">
            <a class="button is-static">org/{thing.org ? thing.org.name : "?"}/</a>
        </p>
        <p class="control">
            <input bind:value={thing.switch.command_topic} class="input">
        </p>
    </div>

    <div class="field">
        <label class="label">Command Value ON</label>
        <p class="control">
            <input bind:value={thing.switch.command_on} class="input">
        </p>
    </div>

    <div class="field">
        <label class="label">Command Value OFF</label>
        <p class="control">
            <input bind:value={thing.switch.command_off} class="input">
        </p>
    </div>

    <div class="field">
        <p class="control">
            <button class="button is-success">Update</button>
        </p>
    </div>

</form>

{/if}

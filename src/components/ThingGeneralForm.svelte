<script>
    import {formatDate} from '../utils.js';

    export var thing;
    export var orgs;
    export var onSubmit;

    if (!thing.org) {
        thing.org = {
            id: ""
        }
    }

    function onFormSubmit() {
        if (onSubmit) {
            onSubmit(thing)
        }
    }


</script>

{#if thing}

<form on:submit|preventDefault={onFormSubmit}>

    <div class="field">
        <label class="label">Name</label>
        <p class="control">
            <input bind:value={thing.name} class="input" placeholder="Thing unique name">
        </p>
    </div>

    <div class="field">
        <label class="label">PIOT Id</label>
        <p class="control">
            <input bind:value={thing.piot_id} class="input" placeholder="Optional value for PIOT device identification">
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
        <div class="control is-expanded">
            <div class="select is-fullwidth">
                <select bind:value={thing.type}>
                    <option value="device">Device</option>
                    <option value="sensor">Sensor</option>
                    <option value="switch">Switch</option>
                </select>
            </div>
        </div>
   </div>

    <div class="field">
        <label class="label">Alias</label>
        <p class="control">
            <input bind:value={thing.alias} class="input" placeholder="Thing alias">
        </p>
    </div>

    <div class="field">
        <label class="label">Organization</label>
        <div class="control">
            <div class="select">
                <select bind:value={thing.org.id}>
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
                <select bind:value={thing.enabled}>
                    <option value="{true}">Yes</option>
                    <option value="{false}">No</option>
                </select>
            </div>
        </div>
    </div>

    <div class="field">
        <label class="label">Availability interval (in seconds)</label>
        <p class="control">
            <input bind:value={thing.last_seen_interval} class="input">
        </p>
    </div>

    <div class="field">
        <p class="control">
            <button class="button is-success">Update</button>
        </p>
    </div>

</form>

{/if}

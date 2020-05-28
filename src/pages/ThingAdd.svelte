<script>
    import {token, authenticated} from '../stores.js'
    import {push} from 'svelte-spa-router'
    import {gql} from '../utils.js';
    import {onMount} from 'svelte';

    let name = '';
    let thingType = 'device';
    let error = null;
    let fetching = false;
    let success = null;

    onMount(() => {
        if (!$authenticated) { push("/login"); }
    })

    async function handleSubmit()
    {
        if (name.length === 0) {
            error = 'No name specified'
            return
        }

        fetching = true;
        error = false;
        success = false;

        try {
            let data = await gql({query: `mutation {createThing(name: "${name}", type: "${thingType}") {name}}`});
            success = 'Thing successfully created'
        } catch(e) {
            if (e instanceof Array) {
                e = e.map((err) => err.message).join(', ');
            }
            error = 'Request failed (' + e + ')';
        }

        fetching = false;
    }
</script>

<style>
form { width: 24rem;}
</style>

<div class="container content">

<h1 class="title">Add Thing</h1>

{#if error}<div class="notification is-danger has-text-centered">{error}</div>{/if}
{#if success}<div class="notification is-success has-text-centered">{success}</div>{/if}

<form on:submit|preventDefault={handleSubmit}>

    <div class="field">
        <p class="control">
            <input bind:value={name} class="input {name.length === 0 && "is-danger"}" placeholder="Thing name">
        </p>
    </div>

    <div class="field">
        <div class="control is-expanded">
            <div class="select is-fullwidth">
                <select bind:value={thingType}>
                    <option value="device">Device</option>
                    <option value="sensor">Sensor</option>
                    <option value="switch">Switch</option>
                </select>
            </div>
        </div>
   </div>

    <div class="field">
        <p class="control">
            <button class="button is-success">Create</button>
        </p>
    </div>

</form>

</div>

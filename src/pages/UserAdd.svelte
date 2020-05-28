<script>
    import {token, authenticated} from '../stores.js'
    import {push} from 'svelte-spa-router'
    import {gql} from '../utils.js';
    import {onMount} from 'svelte';

    let email = '';
    let password = '';
    let description = '';
    let error = null;
    let fetching = false;
    let success = null;

    onMount(() => {
        if (!$authenticated) { push("/login"); }
    })

    async function handleSubmit()
    {
        if (email.length === 0) {
            error = 'No email specified'
            return
        }

        fetching = true;
        error = false;
        success = false;

        try {
            let data = await gql({query: `mutation {createUser(email: "${email}", password: "${password}") {email}}`});
            success = 'User successfully created'
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

<h1 class="title">Add User</h1>

{#if error}<div class="notification is-danger has-text-centered">{error}</div>{/if}
{#if success}<div class="notification is-success has-text-centered">{success}</div>{/if}

<form on:submit|preventDefault={handleSubmit}>

    <div class="field">
        <p class="control">
            <input bind:value={email} class="input {email.length === 0 && "is-danger"}" placeholder="Email">
        </p>
    </div>

    <div class="field">
        <p class="control">
            <input bind:value={password} class="input {password.length === 0 && "is-danger"}" placeholder="Password">
        </p>
    </div>


    <div class="field">
        <p class="control">
            <button class="button is-success">Create</button>
        </p>
    </div>

</form>

</div>

<script>
    import {onMount} from 'svelte';
    import {push} from 'svelte-spa-router'
    import {authenticated, token} from '../stores'
    import UserList from '../components/UserList.svelte';
    import {gql} from '../utils.js';

    let error = null;
    let users = null;
    let fetching = false;

    onMount(() => {
        if (!$authenticated) { push("/login"); }
        fetchUsers();
    })

    async function fetchUsers()
    {
        fetching = true;
        error = false;
        users = null;

        try {
            let data = await gql({query: "{users {id, email, created}}"});
            users = data.users;
        } catch(error) {
            error = 'Request failed (' + error + ')';
        }

        fetching = false;

    }

    function onAdd() {
        push('/user-add');
    }

</script>

<div class="container content">

<h1 class="title">Users</h1>

{#if fetching}
    <progress class="progress is-small is-primary" max="100">15%</progress>
{:else}
    {#if error}
        <div class="notification is-danger">
            {error}
        </div>
    {:else}
        <UserList users={users}/>
        <button class="button" on:click={onAdd}>Add</button>
    {/if}
{/if}

</div>

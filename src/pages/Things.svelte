<script>
    import {onMount} from 'svelte';
    import {authenticated, token} from '../stores'
    import {push} from 'svelte-spa-router'
    import {gql} from '../utils.js';
    import ThingList from '../components/ThingList.svelte';
    import ErrorBar from '../components/ErrorBar.svelte';

    let error = null;
    let things = null;
    let fetching = false;

    onMount(() => {
        if (!$authenticated) { push("/login"); }
        fetchThings();
    })

    async function fetchThings()
    {
        fetching = true;
        error = false;

        try {
            let data = await gql({query: `{things {
                id, name, alias, type, enabled, created, last_seen, last_seen_interval,
                store_mysqldb, store_influxdb, battery_level, battery_level_tracking,
                parent {id, name},
                org {name},
                sensor {class, value, unit}}}
                `});
            things = data.things;
        } catch(err) {
            error = err
        }

        fetching = false;
    }

    function onAdd() {
        push('/thing-add');
    }

</script>

<div class="container content">

<h1 class="title">Things</h1>

{#if fetching}
    <progress class="progress is-small is-primary" max="100">15%</progress>
{:else}
    {#if error}
        <div class="notification is-danger">
            <ErrorBar title="Things request failed" error={error}/>
        </div>
    {:else}
        <ThingList things={things}/>
        <button class="button" on:click={onAdd}>Add</button>
    {/if}
{/if}

</div>

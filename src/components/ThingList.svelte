<script>
    import {link} from 'svelte-spa-router'
    import {formatDate, formatTimeSince} from '../utils'
    import SensorIcon from './SensorIcon.svelte';
    import DeviceIcon from './DeviceIcon.svelte';

    export var things = null;
</script>

{#if things}
<table class="table">
    <thead>
        <tr>
            <th>Name</th>
            <th>Parent</th>
            <th>Alias</th>
            <th>Type</th>
            <th>Last Seen</th>
            <th>Value</th>
            <th>Enabled</th>
            <th>Organization</th>
        </tr>
    </thead>
    <tbody>
        {#each things as thing}
        <tr>
            <td><a href="/thing/{thing.id}" use:link>{thing.name}</a></td>
            <td>
                {#if thing.parent}
                    <a href="/thing/{thing.parent.id}" use:link>{thing.parent.name}</a>
                {:else}
                    -
                {/if}
            </td>
            <td>{thing.alias}</td>
            <td>
                {#if thing.type == "sensor" && thing.sensor}
                    <SensorIcon sensorClass={thing.sensor.class}/>
                {:else}
                    <DeviceIcon />
                {/if}
            </td>
            <td>{formatTimeSince(thing.last_seen)}</td>

            <td>
                {#if thing.type == "sensor" && thing.sensor}
                    {thing.sensor.value}
                {:else}
                    -
                {/if}
            </td>


            <td>
            {#if thing.enabled}
                <span class="icon has-text-success"><i class="fas fa-check-square"></i></span>
            {:else}
                <span class="icon has-text-danger"><i class="fas fa-ban"></i></span>
            {/if}
            </td>
            <td>{#if thing.org}{thing.org.name}{/if}</td>
        </tr>
        {/each}
    </tbody>

</table>
{/if}

<script>
    import {link} from 'svelte-spa-router'
    import {formatTimeSince, formatThingType} from '../utils'
    import StatusEnabled from './StatusEnabled.svelte';

    export var things = null;

    let now = Math.floor(Date.now() / 1000)

    if (things) {
        things = things.filter(t => {
            t.last_seen_status = "";
            if (t.last_seen_interval > 0) {
                if (now - t.last_seen > t.last_seen_interval) {
                    t.last_seen_status = "unavailable";
                } else {
                    t.last_seen_status = "available";
                }
            }
            return t;
        });
    }
</script>

<style>
.unavailable {
    background-color: #ffeeee;
}

.nowrap {
    white-space: nowrap;
}

.unavailable .lastseen {
    color: #ff0000;
}

.available .lastseen {
    color: #009900;
}

</style>

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
            <th>Mysql</th>
            <th>Influx</th>
            <th>Bat</th>
        </tr>
    </thead>
    <tbody>
        {#each things as thing}
        <tr class:unavailable={thing.last_seen_status === "unavailable"} class:available={thing.last_seen_status === "available"}>
            <td><a href="/thing/{thing.id}" use:link>{thing.name}</a></td>

            <td>
                {#if thing.parent}
                    <a href="/thing/{thing.parent.id}" use:link>{thing.parent.name}</a>
                {:else}
                    -
                {/if}
            </td>

            <td class="nowrap">{thing.alias}</td>

            <td>{formatThingType(thing)}</td>
            <td class="lastseen nowrap">{formatTimeSince(thing.last_seen)}</td>

            <td>
                {#if thing.type == "sensor" && thing.sensor}
                    {thing.sensor.value}
                {:else}
                    -
                {/if}
            </td>

            <td><StatusEnabled enabled={thing.enabled}/></td>

            <td>{#if thing.org}{thing.org.name}{/if}</td>

            <td><StatusEnabled enabled={thing.store_mysqldb}/></td>
            <td><StatusEnabled enabled={thing.store_influxdb}/></td>

            <td>
                {#if thing.battery_level_tracking}
                {thing.battery_level}%
                {:else}
                -
                {/if}
            </td>
        </tr>
        {/each}
    </tbody>

</table>
{/if}

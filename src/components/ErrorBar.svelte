<script>
    export let error = null;
    export let title = null;
</script>

{#if error}
    <div class="notification is-danger">

    {#if title }<div><b>{title}</b></div>{/if}

    {#if error instanceof Array}
        {#each error as e}
            {e.message}<br/>
        {/each}
    {:else}
        {typeof(error)}
    {/if}
    </div>
{/if}

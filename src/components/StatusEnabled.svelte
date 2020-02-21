<script>
    export var enabled = false;
</script>

{#if enabled}
    <span class="icon has-text-success"><i class="fas fa-check"></i></span>
{:else}
    <span>-</span>
{/if}

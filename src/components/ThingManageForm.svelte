<script>
    export var thing;
    export var onDelete;

    function onDeleteSubmit() {
        if (onDelete) {
            onDelete(thing)
        }
    }
</script>

{#if thing}

<!-- svelte-ignore a11y-missing-attribute -->
<form on:submit|preventDefault={onDeleteSubmit}>
    <p>Following action permanently removes thing from the system. Be careful!</p>
    <div class="field">
        <p class="control">
            <button class="button is-danger">Delete Thing</button>
        </p>
    </div>
</form>

{/if}

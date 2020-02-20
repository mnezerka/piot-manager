<script>
    export var tabs = null;
    export var active = null;
    export var onChange = null;

    function onSelectItem(id) {
        if (onChange) {
            onChange(id);
        }
    }
</script>

{#if tabs}
<div class="tabs">
    <ul>
    {#each tabs as tab}
        <li class="{tab.id === active ? "is-active" : ""}" on:click|preventDefault={() => onSelectItem(tab.id)}><a>{tab.label}</a></li>
    {/each}
  </ul>
</div>
{/if}

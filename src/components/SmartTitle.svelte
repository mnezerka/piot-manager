<script>
    export var title = null;
    export var subTitle= null;
</script>

<style>
h1 span {
    font-size: 12pt;
    color: gray;
    margin-left: 10px;
}
</style>

<h1 class="title">{title}{#if subTitle}<span>{subTitle}</span>{/if}</h1>

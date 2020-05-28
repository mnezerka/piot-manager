<script>
    export var active = false;
    export var title = '';
    export var message = '';
    export var onYes = () => {}
    export var onNo = () => {}
</script>

<div class="modal {active ? 'is-active' : ''}">
  <div class="modal-background"></div>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">{title}</p>
      <button class="delete" aria-label="close" on:click={onNo}></button>
    </header>
    <section class="modal-card-body">
        {message}
    </section>
    <footer class="modal-card-foot">
      <button class="button is-success" on:click={onNo}>No</button>
      <button class="button" on:click={onYes}>Yes</button>
    </footer>
  </div>
</div>


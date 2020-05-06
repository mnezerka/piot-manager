<script>
    import {profile, token, authenticated} from '../stores.js'
    import {link, push} from 'svelte-spa-router'

    localStorage.removeItem('token');
    $token = null;
    $authenticated = false;
    $profile = null;
</script>

<div class="content">
You were signed out. You can <a href="/login" use:link>login again</a>.

</div>

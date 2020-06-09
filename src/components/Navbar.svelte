<script>
    import {profile, authenticated} from '../stores'
    import {link} from 'svelte-spa-router'

    export var on_org_change = null;

    document.addEventListener('DOMContentLoaded', () => {

        // Get all "navbar-burger" elements
        const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

        // Check if there are any navbar burgers
        if ($navbarBurgers.length > 0) {

            // Add a click event on each of them
            $navbarBurgers.forEach( el => {
                el.addEventListener('click', () => {

                    // Get the target from the "data-target" attribute
                    const target = el.dataset.target;
                    const $target = document.getElementById(target);

                    // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
                    el.classList.toggle('is-active');
                    $target.classList.toggle('is-active');

                });
            });
        }
    });

    function onOrgChange(org_id) {
        console.log('org change', org_id);
        on_org_change && on_org_change(org_id);
    }

</script>

<nav class="navbar is-dark" role="navigation" aria-label="main navigation">

    <div class="navbar-brand">
        <a class="navbar-item" href="/" use:link>
        PIOT Manager
        </a>

        <!-- svelte-ignore a11y-missing-attribute -->
        <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarMainMenu">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
        </a>
    </div>

    <div id="navbarMainMenu" class="navbar-menu">
        <div class="navbar-start">
            {#if $profile}
                {#if $profile.is_admin}
            <a class="navbar-item has-text-primary" href="/orgs" use:link>Organizations</a>
            <a class="navbar-item has-text-primary" href="/users" use:link>Users</a>
            <a class="navbar-item has-text-primary" href="/thingsadmin" use:link>Things Admin</a>
                {/if}
            <a class="navbar-item" href="/things" use:link>Things</a>
            <a class="navbar-item" href="/map" use:link>Map</a>
            {/if}
        </div>

        <div class="navbar-end">

            {#if $profile && $profile.orgs.length > 1}
                <div class="navbar-item has-dropdown is-hoverable">
                    <a class="navbar-link">
                        {$profile.orgs[$profile.org_ix].name}
                    </a>

                    <div class="navbar-dropdown is-right">
                        {#each $profile.orgs as org}
                            {#if org.id !== $profile.orgs[$profile.org_ix].id}
                                <a class="navbar-item" on:click|preventDefault={() => onOrgChange(org.id)}>{org.name}</a>
                            {/if}
                        {/each}
                    </div>
                </div>
            {/if}


            <div class="navbar-item has-dropdown is-hoverable">
                <a class="navbar-link">
                    {#if $authenticated && $profile}{$profile.email}{:else}Anonymous{/if}
                </a>
                <div class="navbar-dropdown is-right">
                    {#if $authenticated}
                    <a class="navbar-item" href="/signout" use:link>Sign out</a>
                    {:else}
                    <a class="navbar-item" href="/login" use:link>Log in</a>
                    {/if}
                </div>
            </div>

        </div>

    </div>

</nav>

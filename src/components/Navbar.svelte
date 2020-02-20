<script>
    import {authenticated} from '../stores.js'
    import {link} from 'svelte-spa-router'
    import {profile} from '../stores'

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

</script>

<nav class="navbar is-dark" role="navigation" aria-label="main navigation">

    <div class="navbar-brand">
        <a class="navbar-item" href="/" use:link>
        PIOT Manager
        </a>

        <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarMainMenu">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
        </a>
    </div>

    <div id="navbarMainMenu" class="navbar-menu">
        <div class="navbar-start">
            {#if $authenticated}
            <a class="navbar-item" href="/orgs" use:link>Organizations</a>
            <a class="navbar-item" href="/users" use:link>Users</a>
            <a class="navbar-item" href="/things" use:link>Things</a>
            {/if}
        </div>

        <div class="navbar-end">
            <div class="navbar-item">
                <div class="buttons">
                    {#if $authenticated}
                    <a href="/signout" use:link class="button is-light">Sign out {#if $profile}{$profile.email}{/if}</a>
                    {:else}
                    <a href="/login" use:link class="button is-light">Log in</a>
                    {/if}
                </div>
            </div>
        </div>

    </div>

</nav>

<script lang="ts">
    import { goto } from "@roxi/routify";
    import { darkmode } from "../../utils/stores/theme";
    import { User } from "sveltefire";
    import firebase from "firebase/app";
</script>

<section id="Header" class="px-2 py-2 bg-green-300 md:py-24">
    <div class="row">
        <div class="column">
            <h1>pages/_components/Header.svelte</h1>
        </div>
        <div class="user">
            <div class="column">
                <User let:user>
                    <div
                        class="flex items-center justify-center gap-2 mr-2 cursor-pointer"
                        on:click={$goto("/profile")}
                    >
                        {#if user.photoURL !== null}
                            <img
                                src={user.photoURL}
                                alt="{user.displayName}-{user.email}"
                                title={user.displayName}
                                class="w-24 h-24 rounded-full"
                            />
                        {:else if user.isAnonymous === true}
                            <img
                                src="https://placekitten.com/200/200"
                                alt="Anonymous"
                                class="w-24 h-24 rounded-full"
                            />
                        {:else}
                            <img
                                src="https://placekitten.com/200/200"
                                alt="{user.displayName}-{user.email}"
                                title={user.displayName}
                                class="w-24 h-24 rounded-full"
                            />
                        {/if}
                    </div>
                    <br />
                    <div slot="signed-out" class="items-end">
                        <a
                            class="inline-flex items-end gap-2 px-3 py-1 mx-2 mt-4 text-base bg-gray-100 border-0 rounded shadow focus:outline-none hover:bg-gray-200 lg:mt-0 dark:bg-gray-700"
                            href="/auth/login/"
                        >
                            <i class="fas fa-sign-in-alt" /> Sign In
                        </a>
                    </div>
                    <div>
                        <a
                            class="inline-flex items-end gap-2 px-3 py-1 mx-2 mt-4 text-base bg-gray-100 border-0 rounded shadow focus:outline-none hover:bg-gray-200 lg:mt-0 dark:bg-gray-700"
                            href="/auth/logout"
                            on:click|preventDefault={() => {
                                firebase.auth().signOut();
                            }}
                        >
                            <i class="fas fa-sign-out-alt" /> Sign Out
                        </a>
                    </div>
                    <br />
                    <div
                        class="inline-flex items-center gap-2 px-3 py-1 mx-2 mt-4 text-base bg-gray-100 border-0 rounded shadow focus:outline-none hover:bg-gray-200 lg:mt-0 dark:bg-gray-700"
                        on:click={() => {
                            $darkmode = !$darkmode;
                        }}
                    >
                        {#if $darkmode}
                            <i class="fas fa-moon" />
                        {:else}
                            <i class="fas fa-sun" />
                        {/if}
                        {$darkmode ? "Dark" : "Light"}
                    </div>
                </User>
            </div>
        </div>
    </div>
</section>

<style>
    .row {
        border: solid 0px #000;
        display: flex;
        justify-content: space-between;
    }
    .user {
        width: 200px;
        border: solid 0px;
    }
</style>

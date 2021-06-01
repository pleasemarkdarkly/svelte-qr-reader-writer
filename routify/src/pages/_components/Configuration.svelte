<script lang="ts">
    import { configuration } from "../../utils/stores/configuration";
    import { onMount } from "svelte";

    let checked = false;
    let checked_count = 0;

    const action = (node, params) => {
        console.log("action-created", node, params);
        console.log(`node innerHTML only => `, node.innerHTML);
        checked_count++;
        $configuration.checkbox_clicked = checked_count;
        return {
            destroy() {
                console.log("action-destroyed");
            },
        };
    };

    $: {
        $configuration;
    }
</script>

<section id="Configuration" class="px-2 py-2 bg-blue-200 md:py-24">
    <div>
        <h1>pages/_components/Configuration.svelte</h1>
        <br />
        <i>This component manages the application global configuration store.</i            
        ><br />
        <p>This is where you add site settings to follow a user.</p>        
        <p>configuration store:{JSON.stringify($configuration)}</p>
        <br />
    </div>
    <div>
        <input type="checkbox" bind:checked />
        {#if checked}
            <div use:action={42}>
                You toggled the checkbox {$configuration.checkbox_clicked} times
            </div>
        {/if}
        <br />
    </div>
    <div>
        <br />
        <p>This is an example of how to use Firebase access and collection reading.</p>
        <a href="/scratchy">Firebase Component</a>
        <br />
    </div>
</section>

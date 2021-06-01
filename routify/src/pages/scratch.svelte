<script lang="ts">
    import { onMount, createEventDispatcher } from "svelte";
    import { User } from "sveltefire";
    const dispatch = createEventDispatcher();

    let form: { [k: string]: any } = {};
    let pageNotifications = "";

    const handler = () => {
        console.log(`form handler, bound value => ${form.textField}`);
        dispatch("handleButton", form);
        pageNotifications = "handleButton dispatched";
    };

    onMount(async () => {});

    $: {
        pageNotifications;
        form;
    }
</script>

<div
    id="pages-scratch.svelte"
    class="px-1 py-1 bg-yellow-100 border-grey-200 md:py-10"
>
    <div>
        <h1>pages/scratch.svelte</h1>
    </div>
    <br />
    <b>form properties:</b>
    <p>keys:{JSON.stringify(Object.keys(form))}, raw:{JSON.stringify(form)}</p>
    {#if pageNotifications.length}notifications:<i>{pageNotifications}</i>{/if}
    <br />
    <br />
    <form>
        <div>
            <span>Input value:</span>
            <input
                type="text"
                bind:value={form.textField}
                placeholder="write something here..."
            />
            <User persist={sessionStorage} let:user>
                <button type="submit" on:click|preventDefault={handler}
                    >Add</button
                >
                <button type="reset">Reset</button>
                <div slot="signed-out">
                    <span>You'll need to login to perform any activities.</span>
                </div>
            </User>
        </div>
    </form>
    <br />
    <slot />
    <br />
</div>

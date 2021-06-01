<script>
    import { setContext } from "svelte";
    import { writable } from "svelte/store";
    import Child from "./Child.svelte";

    const store = writable(0);
    const x = {
        subscribe: store.subscribe,
        increment: () => store.update((x) => x + 1),
    };
    setContext("data", x);
</script>

<div style="display:flex; flex-direction:row">
    <div style="margin-right:2rem">
        <h2>Parent</h2>
        <button on:click={x.increment}> Increment X </button>

        <p>X value: {$x}</p>
    </div>

    <div style="margin-right:2rem"><Child /></div>
    <div><Child /></div>
</div>

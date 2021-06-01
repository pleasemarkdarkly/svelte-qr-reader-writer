<script>
    import { onMount, createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    let partial = "",
        applicationCommand = "",
        additional = "";

    const handleKeydown = (event) => {
        if (event.key === "Enter") {
            console.log(`[Enter] ${partial}`);
            applicationCommand = partial;
            partial = "";
            additional = "";
        } else if (event.key === "Meta") {
            additional = "Meta key pressed";
        } else {
            partial += event.key;
            additional = "";
        }
    };

    $: {
        partial, applicationCommand;
    }
</script>

<svelte:window on:keydown={handleKeydown} />

<div
    id="KeyPressHandler.svelte"
    class="px-1 py-1 bg-red-300 border-grey-200 md:py-10"
>
    <div>
        <h1>pages/_components/KeyPressHandler.svelte</h1>
        <p>
            This component captures all key presses and 'enter' events to
            process page keyboard bindings.
        </p>
        <br />
        <p>partial keypress: {partial}</p>
        <p>command (enter): {applicationCommand}</p>
        <i>{additional}</i>
    </div>
</div>

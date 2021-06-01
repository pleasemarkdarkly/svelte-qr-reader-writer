<script>
    import { onMount, onDestroy, createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    export let src;
    export let libraryExpectedObject;
    let script;

    onMount(async () => {
        if (
            libraryExpectedObject &&
            window &&
            typeof window[libraryExpectedObject] !== "undefined"
        ) {
            console.log(
                `LibLoader verifying requested object is not undefined:${typeof window[
                    libraryExpectedObject
                ]}`,
                window[libraryExpectedObject]
            );
            return dispatch("loaded");
        }
        
        script.addEventListener("load", () => {
            console.log(`LibLoader successfully loaded ${libraryExpectedObject} from ${src}`);            
            dispatch("loaded");
        });
        
        script.addEventListener("error", (event) => {
            console.error(
                `LibLoader encountered an error loading ${src}`,
                event
            );
            dispatch("error");
        });
    });

    onDestroy(async()=> {
            
    });

</script>

<svelte:head><script bind:this={script} {src}></script></svelte:head>

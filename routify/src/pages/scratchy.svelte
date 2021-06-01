<script lang="ts">
    import { onMount, createEventDispatcher } from "svelte";
    import { fireapp, auth } from "../firebase/fireapp";
    const dispatch = createEventDispatcher();
    import Scratch from "./scratch.svelte";
    import { Collection, User } from "sveltefire";
    import { user } from "../utils/stores/firebase";
    import KeyPressHandler from './_components/KeyPressHandler.svelte';

    const appName = fireapp.app().name;
    let timestamp: Date;
    let eventMessage = "";
    let firebaseResponse = "";

    const insertTodo = async (form: any) => {
        let userId = await auth.currentUser.getIdToken();
        timestamp = new Date();
        let payload = {
            user: userId,
            data: form,
            timestamp: timestamp,
        };
        try {
            fireapp.firestore().collection("todos").doc().set(payload);
            dispatch("refreshCollection");
        } catch (e) {
            console.error(e);
        }
    };

    const formHandler = async (event: CustomEvent) => {
        console.warn(`formHandler should be disabled`);
        console.log(
            `formHandler keys => ${JSON.stringify(Object.keys(event.detail))}`
        );
        console.log(
            `formHandler known prop => ${JSON.stringify(
                event.detail.textField
            )}`
        );
    };

    const buttonHandler = async (event: CustomEvent) => {
        console.log(
            `buttonHandler keys => ${JSON.stringify(Object.keys(event.detail))}`
        );
        console.log(
            `buttonHandler known property => ${JSON.stringify(
                event.detail.textField
            )}`
        );
        await insertTodo(event.detail.textField);
    };
    
    const pageSize = 10;
    const field = "timestamp";
    let query = (ref) => ref.orderBy(field).limit(pageSize);
    const reload = () => {
        try {
            query = (ref) => ref.orderBy(field).limit(pageSize);
        } catch (e) {
            console.error(e);
        }
    };
    
    const nextPage = (last) => {
        try {
            query = (ref) =>
                ref.orderBy(field).startAfter(last[field]).limit(pageSize);
        } catch (e) {
            console.error(e);
        }
    };
    const prevPage = (first) => {
        try {
            query = (ref) =>
                ref
                    .orderBy(field)
                    .endBefore(first[field])
                    .limitToLast(pageSize);
        } catch (e) {
            console.error(e);
        }
    };

    $: {
        eventMessage;
    }
</script>

<div
    id="pages-scratch.svelte"
    class="px-1 py-1 bg-pink-100 border-grey-200 md:py-10"
>
<h1>pages/scratchy.svelte</h1>
<KeyPressHandler />
<br />
    <p>
        event message:{JSON.stringify(eventMessage)}
        <br />
        firebase message/error:{JSON.stringify(firebaseResponse)}
    </p>
    <br />
    <h3>Firebase Ready {appName}</h3>    
    <br />
    <User let:user>
        <Collection path={"todos"} {query} let:data let:last let:first>            
            <span class="spinner" slot="loading">Loading data...</span>
            {#if data.length === 0}
                <p>Last query did not return any results, reload to start over.</p>
                <br />
                <button on:click={() => reload()}>🖖 Reload</button>
            {:else}
            {#each data as todo, index}
                <div class="tooltip">
                    {index}. {todo.data}
                    <span class="tooltiptext">{todo.user.slice(0, 15)}</span>
                </div>
                <br />
            {/each}
            {#if data.length !== 0}                
                    <button on:click={() => prevPage(first)}>👈 Prev</button>
                    <button on:click={() => nextPage(last)}>👉 Next</button>                
            {/if}
            {/if}
            <br />
        </Collection>

        <br />
        <Scratch on:validateForm={formHandler} on:handleButton={buttonHandler}>
            <i>I'm information which wants to be slotted.</i>
        </Scratch>
        {#if user.displayName}
            <sup>{user.displayName}</sup>
        {:else if user.isAnonymous}
            <sup>Anonymous</sup>
        {:else}
            <sup>Login if you want to party</sup>
        {/if}
        <br />
    </User>
<br>
</div>

<style>
    .tooltip {
        position: relative;
        display: inline-block;
        border-bottom: 1px dotted black;
    }

    .tooltip .tooltiptext {
        visibility: hidden;
        width: 150px;
        color: white;
        background-color: black;
        text-align: center;
        border-radius: 6px;
        padding: 5px 0;
        /* Position the tooltip */
        position: absolute;
        z-index: 1;
    }

    .tooltip:hover .tooltiptext {
        visibility: visible;
    }
</style>

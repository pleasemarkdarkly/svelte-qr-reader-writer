<script lang="ts">
    let form: { [k: string]: any } = {};
    const handler = () => {};

    $: {
        form;
    }
</script>

<div>
    <b>form properties:</b>
    <p>keys:{JSON.stringify(Object.keys(form))}, raw:{JSON.stringify(form)}</p>
    <br />
    <br />
    <form>
        <input type="text" bind:value={form.qrencode} />
        <button on:click|preventDefault={handler}>Submit</button>
    </form>
    <br />
</div>

<style>
</style>

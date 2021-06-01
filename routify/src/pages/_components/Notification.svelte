<script lang="ts">
    import { onMount } from "svelte";
    import { getRandomInt } from "../../utils";

    import { getNotificationsContext } from "svelte-notifications";
    const { addNotification } = getNotificationsContext();

    const notify = (text: string) => {
        addNotification({
            text: text,
            type: "warning",
            position: "bottom-right",
            removeAfter: getRandomInt(3000)
        });
    };

    const submit = ({ detail: values }) => {
        console.log(`Form component submitted =>`);
        console.log(values);
    };

</script>

<section id="Notification" class="px-2 py-2 bg-white-200 md:py-24">
    <div>
        <h1>pages/_components/Notification.svelte</h1>
    </div>
    <div>
        <button
            on:click={() => {
                notify("Notification Example");
            }}>Trigger Notification</button
        >
    </div>
</section>

<style>
</style>

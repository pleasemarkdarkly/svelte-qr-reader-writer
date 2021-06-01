<script lang="ts">
    import "./utils/stores/theme";
    import TailwindCss from "./TailwindCss.svelte";
    import { Router } from "@roxi/routify";
    import { routes } from "../.routify/routes";
    // import Serviceworker from "./Serviceworker.svelte";
    import Notifications from "svelte-notifications";
    import { FirebaseApp } from "sveltefire";
    import firebase from "firebase/app";
    import "firebase/auth";
    import "firebase/firestore";
    import { exampleConfig } from "./firebase/config";
    firebase.initializeApp(exampleConfig);

</script>

<Notifications>
    <div class="application">
        <section id="App" class="px-2 py-2 border-red-700 bg-grey-50 md:py-24">
            <div><h1>pages/App.svelte</h1></div>
            <FirebaseApp {firebase}>
                <TailwindCss />
                <Router {routes} />
            </FirebaseApp>
        </section>
    </div>
</Notifications>

<!--- <Serviceworker /> -->
<style global>
    .application {
        margin: 0px;
    }
    .btn {
        @apply shadow;
        @apply rounded-md;
        @apply px-4;
        @apply py-2;
        @apply flex;
        @apply justify-center;
        @apply items-center;
    }

    html.dark-mode {
        filter: invert(100%);
        background: white;
    }

    html.dark-mode img,
    html.dark-mode svg,
    html.dark-mode video,
    html.dark-mode canvas {
        filter: invert(100%);
    }

</style>

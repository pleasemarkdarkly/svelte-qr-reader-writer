<script lang="ts">
    import { metatags } from "@roxi/routify";
    import ForkMe from "./_components/ForkMe.svelte";
    import Configuration from "./_components/Configuration.svelte";
    import Hero from "./_components/Hero.svelte";
    import Contract from "./_components/Notification.svelte";
    import ScratchPad from "./_components/ScratchPad.svelte";
    import About from "./_components/About.svelte";    
    import { detectOS, platforms } from "../utils/system";
    import KeyPressHandler from "./_components/KeyPressHandler.svelte";
    import { ready } from "@roxi/routify";

    metatags.title = "My Routify app";
    metatags.description = "Description coming soon...";

    const supportedPlatforms = () => {
        const os = detectOS();
        if (platforms.includes(os)) {
            console.log(
                `Platform ${os} likely is fully supported by this app.`
            );
        } else {
            console.error(
                `Platform ${os} may not be fully supported by this app.`
            );
        }
    };

    $ready();
</script>

<section
    id="pages-index"
    class="px-1 py-1 bg-indigo-100 border-grey-200 md:py-10"
>
    <div>
        <h1>pages/index.svelte</h1>
        <br />
        <a href="/examples/landing">External Landing Page Tailwind/Tailblocks Example</a><br />
        <a href="/examples">Additional Tailwind Example Components</a><br />
        <a href="/t-rex">Chrome T-Rex Game for 404</a><br />
        <br>
        <i>Plaform: {detectOS()}</i><br />
        <br />
        <KeyPressHandler />
    </div>

    <ForkMe />
    <Configuration />
    <Contract />
    <ScratchPad />
    <Hero />
    <About />    
</section>

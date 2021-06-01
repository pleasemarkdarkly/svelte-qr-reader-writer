<script>
    import Header from "./_components/Header.svelte";
    import Footer from "./_components/Footer.svelte";
    
</script>

<!-- routify:options preload="proximity" -->

<Header />
<main>
 <slot />
</main>
<Footer />


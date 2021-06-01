<script>
    import { onDestroy, onMount } from "svelte";
    import "./t-rex-runner.js";

    $$props;
    let runner;
    onMount(() => {
        runner = new Runner(".interstitial-wrapper");
        console.log(runner);
        document.onkeydown = function (evt) {
            evt = evt || window.event;
            if (evt.keyCode == 32) {
                var box = document.getElementById("messageBox");
                box.style.visibility = "hidden";
            }
        };
    });

    onDestroy(() => {
        runner = {};
    });
</script>

<!-- svelte-ignore a11y-media-has-caption -->
<svelte:head>
    <link rel="stylesheet" href="/t-rex-runner/index.css" />
    <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet"> 
</svelte:head>

<section>
  <div id="messageBox" class="sendmessage">
    <h1 style="text-align: center;font-family: 'Open Sans', sans-serif;">
      Press Space to start
    </h1>
    <div class="niokbutton" onclick="okbuttonsend()" />
  </div>
  <div id="main-frame-error" class="interstitial-wrapper">
    <div id="main-content">
      <div class="icon icon-offline" alt="" />
    </div>
    <div id="offline-resources" style="display: none;">
      <img
        id="offline-resources-1x"
        alt=""
        src="/t-rex-runner/assets/default_100_percent/100-offline-sprite.png"
      />
      <img
        id="offline-resources-2x"
        alt=""
        src="/t-rex-runner/assets/default_200_percent/200-offline-sprite.png"
      />
    </div>
  </div>
</section>

<style>
    section {
        max-width: 1000px;
        margin: 0 auto;
    }
</style>

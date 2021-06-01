<script>
    import { LIB_QRCODE } from "../../utils/libraries";
    import LibLoader from "./LibLoader.svelte";
    import { onDestroy } from 'svelte';
    import { fade } from "svelte/transition";

    export let qrCodeValue = "3J34Z9chznGt98y1sGwwg59GT2cjCWjhqd";
    export let qrSquareSize = 200;

    let qrCode;

    const onLoaded = () => {
        qrCode = new QRCode(document.getElementById("qrcode"), {
            text: qrCodeValue,
            width: qrSquareSize,
            height: qrSquareSize,
            colorDark: "#000000",
            colorLight: "#ffffff00",
            correctLevel: QRCode.CorrectLevel.H,
        });
    };

    const makeQRCode = () => {
        qrCode.makeCode(qrCodeValue);
    };

    const clearQRCode = () => {
        qrCodeValue = "";
        qrCode.clear();
        qrCode.makeCode("");
    };

    onDestroy(async () => {
       qrCode = {}; 
    });

    $: {
        qrCodeValue;
        qrSquareSize;
    }
</script>

<LibLoader
    src={LIB_QRCODE}
    libraryExpectedObject="QRCode"
    on:loaded={onLoaded}
/>

<section id="" class="px-2 py-2 bg-pink-100 md:py-24">
    <div><h1>Component QRCode.svelte</h1></div>
    <br />
    <form>        
        <label for="qrCodeValue">QRCode data to encode</label>
        <textarea id="qrCodeValue" type="textarea" bind:value={qrCodeValue} />
        <br />
        <button on:click|preventDefault={makeQRCode}>Generate</button>
        <button on:click|preventDefault={clearQRCode}>Clear</button>
    </form>
    <br />
    <div transition:fade id="qrcode" />
    <p transition:fade>{qrCodeValue}</p>
</section>

<style>
    textarea {
        width: 350px;
        height: 50px;
    }
    #qrcode {
        width: 200px;
        height: 200px;
        margin-top: 15px;
    }
</style>

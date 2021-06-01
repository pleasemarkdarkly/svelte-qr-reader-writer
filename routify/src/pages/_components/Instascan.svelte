<script lang="ts">
    import { onDestroy } from "svelte";
    import LibLoader from "./LibLoader.svelte";
    import { LIBRARIES } from "../../utils/stores/libraries";
    import { fade } from "svelte/transition";
    
    let URL_INSTASCAN;    
    const unsubscribe = LIBRARIES.subscribe((value) => (URL_INSTASCAN = value.LIB_INSTASCAN));
        
    let properties: { [k: string]: any } = {};
    let instascanner;

    const onLoaded = async () => {
        properties.qrCodeValue = "";
        instascanner = new Instascan.Scanner({
            video: document.getElementById("preview"),
            backgroundScan: false,
            scanPeriod: 5,
            mirror: false,
        });
        instascanner.addListener("scan", (content) => {
            properties.qrCodeValue = content;
        });
        Instascan.Camera.getCameras()
            .then(function (cameras) {
                if (cameras.length > 0) {
                    console.log(`Instascan found ${cameras.length} cameras.`);
                    properties.numScanners = cameras.length;
                    instascanner.start(cameras[0]);
                    properties.cameraId = cameras[0].id;
                    properties.cameraName = cameras[0].name;
                } else {
                    console.error("No cameras found.");
                    alert("No cameras found.");
                }
            })
            .catch(function (e) {
                console.error(e);
                alert(e);
            });
    };

    onDestroy(async () => {
        unsubscribe();
        instascanner.stop().then(() => {
            console.log(`${properties.cameraName} disabled.`);
        });
        instascanner = {};
        properties = {};
    });

</script>

<LibLoader
    src={URL_INSTASCAN}
    libraryExpectedObject="Instascan"
    on:loaded={onLoaded}
/>

<section id="qrcode-scanner" class="px-2 py-2 bg-pink-100 md:py-24">
    <div>
        <h1>pages/_components/Instascan.svelte</h1>
    </div>
    {#if properties.numScanners == 1}
        <p>
            Found {properties.numScanners} camera. {properties.cameraName} ({properties.cameraId})
        </p>
    {:else if properties.numScanners > 1}
        <p>
            Found {properties.numScanners} camera. {properties.cameraName} ({properties.cameraId})
        </p>
    {:else}
        <p>No cameras were found.</p>
    {/if}
    <br />
    {#if properties.qrCodeValue !== ""}
        <p transition:fade={{ duration: 2000 }}>
            QRCode:{properties.qrCodeValue}
        </p>
        <br />
    {/if}
    <div class="mb-5 btn-group btn-group-toggle" data-toggle="buttons">
        <label class="btn btn-primary active">
            <input
                type="radio"
                name="options"
                value="1"
                autocomplete="off"
                checked
            /> Front Camera
        </label>
        {#if properties.numScanners > 1}
            <label class="btn btn-secondary">
                <input
                    type="radio"
                    name="options"
                    value="2"
                    autocomplete="off"
                />
                Back Camera
            </label>
        {/if}
    </div>
    <br />
    <!-- svelte-ignore a11y-media-has-caption -->
    <video id="preview" />
</section>

<style>
    #preview {
        width: 500px;
        height: 500px;
        margin: 0px auto;
    }
</style>

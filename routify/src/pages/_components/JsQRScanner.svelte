<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import LibLoader from "./LibLoader.svelte";
    import { LIBRARIES } from "../../utils/stores/libraries";
    import { detectOS } from "../../utils/system";
    import { getNotificationsContext } from "svelte-notifications";
    import { fade } from "svelte/transition";
    const { addNotification } = getNotificationsContext();

    let URL_JSQRSCANNER;
    const unsubscribe = LIBRARIES.subscribe(
        value => (URL_JSQRSCANNER = value.LIB_JSQRSCANNER)
    );

    const enum notification_location {
        "top-left",
        "top-center",
        "top-right",
        "bottom-left",
        "bottom-center",
        "bottom-right"
    }

    const enum notification_type {
        "success",
        "warning",
        "danger"
    }

    let jbScanner;
    let scannerParentElement;
    let scannedTextMemo;
    let scannedTextMemoHist;
    let scannedTextLast = "";
    let scannerTextToggle = "Disable Scanner";
    const protocol_error_message =
        "Your web browser must have JavaScript enabled in order for this application to display correctly.";
    const protocol_error_message_short =
        "QRCode component requires a secure connection (https).";

    const notify = (text: string) => {
        addNotification({
            text: "👋" + " " + text,
            type: "danger",
            position: "bottom-center",
            removeAfter: 3000
        });
    };

    const checkSecureConnection = () => {
        if (location.protocol !== "https:") {
            // @ts-ignore
            document.getElementById("secure-connection-message").style =
                "display: block";
        }
    };

    // location.protocol !== "https:" ? notify(protocol_error_message_short) : null;

    const onLoaded = () => {
        // jbScanner = new JsQRScanner(onQRCodeScanned);
        // @ts-ignore
        jbScanner = new JsQRScanner(onQRCodeScanned, provideVideo);
        jbScanner.setSnapImageMaxSize(300);
        scannerParentElement = document.getElementById("scanner");
        if (scannerParentElement) jbScanner.appendTo(scannerParentElement);
    };

    onMount(async () => {
        // checkSecureConnection();
    });

    onDestroy(async () => {
        unsubscribe;
        jbScanner = {};
        scannerParentElement = {};
        scannedTextMemo = {};
        scannedTextMemoHist = {};
        scannedTextLast = "";
        scannerTextToggle = "";
    });

    const provideVideo = () => {
        let n = navigator;
        if (n.mediaDevices && n.mediaDevices.getUserMedia) {
            return n.mediaDevices.getUserMedia({
                video: { facingMode: "environment" },
                audio: false
            });
        }
        return Promise.reject("Your browser does not support getUserMedia");
    };

    const provideVideoQQ = () => {
        return navigator.mediaDevices
            .enumerateDevices()
            .then(function(devices) {
                let exCameras = [];
                devices.forEach(function(device) {
                    if (device.kind === "videoinput")
                        exCameras.push(device.deviceId);
                });
                return Promise.resolve(exCameras);
            })
            .then(function(ids) {
                if (ids.length === 0)
                    return Promise.reject("Could not find a webcam");
                return navigator.mediaDevices.getUserMedia({
                    //this way QQ browser opens the rear camera
                    video: {
                        // @ts-ignore
                        optional: [
                            { sourceId: ids.length === 1 ? ids[0] : ids[1] }
                        ]
                    }
                });
            });
    };

    const onQRCodeScanned = scannedText => {
        scannedTextMemo = document.getElementById("scannedTextMemo");
        if (scannedTextMemo) {
            scannedTextMemo.value = scannedText;
            scannedTextLast = scannedText;
            scannedTextMemoHist = document.getElementById(
                "scannedTextMemoHist"
            );
            // addNotification({text: scannedText,type: "success",position: "top-center",removeAfter: 3000,});
        }
        if (scannedTextMemo && scannedTextMemoHist)
            scannedTextMemoHist.value =
                scannedTextMemoHist.value + "\n" + scannedText;
    };

    const toggleQRCodeScanning = () => {
        jbScanner.isActive()
            ? jbScanner.stopScanning()
            : jbScanner.resumeScanning();
        jbScanner.isActive()
            ? (scannerTextToggle = "Disable Scanner")
            : (scannerTextToggle = "Enable Scanner");

        jbScanner.isActive()
            ? addNotification({
                  text: "Scanner is Enabled",
                  type: "danger",
                  position: "top-center",
                  removeAfter: 3000
              })
            : null;
    };

    const errorHandler = e => {
        console.error(`JsQRScanner.svelte error handler:${e}`);
    };

    $: {
        scannedTextLast;
    }

</script>

<LibLoader
    src={URL_JSQRSCANNER}
    libraryExpectedObject="Scanner"
    on:loaded={onLoaded}
    on:error={errorHandler}
/>

<svelte:head>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</svelte:head>

<noscript>
    <div class="row-element-set error_message">
        {protocol_error_message}
    </div>
</noscript>
<div
    class="row-element-set error_message"
    id="secure-connection-message"
    style="display: none;"
    hidden
>
    You may need to serve this page over a secure connection (https) to run
    JavascriptQRScanner correctly.
</div>

<section id="" class="px-2 py-2 bg-pink-100 md:py-24">
    <div><h1>Component JsQRScanner.svelte</h1></div>
    <p transition:fade={{ duration: 2000 }}>{scannedTextLast}</p>
    <br />
    <h1>JsQRScanner Example ({detectOS()})</h1>
    <div class="row-element-set row-element-set-QRScanner">
        <div class="row-element">
            <div class="FlexPanel detailsPanel QRScannerShort">
                <div class="FlexPanel shortInfoPanel">
                    <p>
                        To access the QR-Code generator for Token Addresses,
                        click on the profile icon likely a random cat picture.
                    </p>
                    <div class="gwt-HTML">Point the webcam at a QR code.</div>
                    <i
                        >QRCode scanner does not record videos, only looks for
                        QRcodes.</i
                    >
                    <p />
                </div>
            </div>

            <br />
            <div class="row-element">
                <div class="qrscanner" id="scanner" />
            </div>
            <div class="row-element">
                <div class="form-field form-field-memo">
                    <div class="form-field-caption-panel">
                        <div class="gwt-Label form-field-caption">
                            Scanned text
                        </div>
                    </div>
                    <div class="FlexPanel form-field-input-panel">
                        <textarea
                            id="scannedTextMemo"
                            class="textInput form-memo form-field-input textInput-readonly"
                            rows="3"
                            readonly
                        />
                    </div>
                </div>
                <div class="form-field form-field-memo">
                    <div class="form-field-caption-panel">
                        <div class="gwt-Label form-field-caption">
                            Scanned text history
                        </div>
                    </div>
                    <div class="FlexPanel form-field-input-panel">
                        <textarea
                            id="scannedTextMemoHist"
                            class="textInput form-memo form-field-input textInput-readonly"
                            value=""
                            rows="6"
                            readonly
                        />
                    </div>
                </div>
            </div>
            <div class="row-element">
                <button on:click={toggleQRCodeScanning}>
                    {scannerTextToggle}
                </button>
            </div>
            <br />
        </div>
    </div>
</section>

<style>
    .qrscanner {
        max-width: 95%;
        max-height: 75%;
    }

    .row-element-set {
        display: flex;
        flex-direction: column;
    }

    .row-element {
        padding: 0.2em 0em;
    }

    .row-element-set-QRScanner {
        max-width: 50em;
        display: flex;
        flex-direction: column;
    }

    .form-field-caption {
        font-weight: bold;
    }

    .form-field-input {
        width: 100%;
    }

    .error_message {
        color: red;
        background-color: white;
        border: 1px solid red;
        padding: 4px;
        font-family: sans-serif;
    }

</style>

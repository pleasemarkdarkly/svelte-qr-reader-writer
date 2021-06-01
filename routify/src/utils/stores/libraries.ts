import { writable } from "svelte/store";

export const BASE_URL = `https://example-4f999.web.app`;
export const LIBRARIES = writable({
    LIB_QRCODE: BASE_URL + `/` + `utils/qrcode.min.js`,
    LIB_INSTASCAN: BASE_URL + `/` + `utils/instascan.min.js`,
    LIB_JSQRSCANNER: BASE_URL + `/` + `utils/JsQRScanner/jsqrscanner.nocache.js`
});

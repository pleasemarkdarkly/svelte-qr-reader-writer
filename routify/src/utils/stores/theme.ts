import { writable } from "svelte/store";
export const darkmode = writable(false);
darkmode.subscribe(dark => { document.documentElement.classList[dark ? 'add' : 'remove']("dark-mode") });

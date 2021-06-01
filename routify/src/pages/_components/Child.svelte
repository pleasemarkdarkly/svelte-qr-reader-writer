<script>
	import Grandchild from './Grandchild.svelte';
	import { getContext, setContext } from 'svelte';
	import { writable } from 'svelte/store';
	const x = getContext('data');
	const y = writable(0);
	setContext('y', y);
</script>

<div>
	<h2>Child</h2>
	<button on:click={x.increment}>
	  Increment X
	</button>
	<p>X value: {$x}</p>
	<p>This child y: {$y}</p>
</div>

<Grandchild />

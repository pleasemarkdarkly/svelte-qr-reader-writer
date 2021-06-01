<script>
	import { getContext } from 'svelte';
	const x = getContext('data');
	const y = getContext('y');
</script>

<div>
	<h3>Grandchild</h3>
	<div><button on:click={x.increment}>
	  Increment X
	</button></div>

	<div><button on:click={() => $y = $y + 1}>
	  Increment Y
	</button></div>
	<p>X value: {$x}</p>
  <p>Y value: {$y}</p>
</div>

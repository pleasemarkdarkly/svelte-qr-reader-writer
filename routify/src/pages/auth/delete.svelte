<script lang="ts">
	import firebase from "firebase/app";
	import { goto } from "@roxi/routify";
	import { onMount } from "svelte";

	onMount(() => {
		if (firebase.auth().currentUser) {
			firebase
				.auth()
				.currentUser.delete()
				.then(() => {
					$goto("/auth/register");
				});
		}
	});
</script>

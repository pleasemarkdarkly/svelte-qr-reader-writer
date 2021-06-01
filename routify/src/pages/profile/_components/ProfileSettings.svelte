<script lang="ts">
    import firebase from "firebase/app";
    const user = firebase?.auth()?.currentUser;
    let isAnon: boolean = false;
</script>

<section id="ProfileSettings" class="px-2 py-2 bg-pink-200 md:py-24">
    <div>
        <h1>pages/profile/_components/ProfileSettings.svelte</h1>
        <br />
        {#each user.providerData as profile}
            <p>{profile.providerId}, {profile.uid}</p>
            <p>{profile.displayName} ({profile.email})</p>
            <p>{profile.photoURL}</p>
        {/each}
        <br />
        {#if user.isAnonymous}
            <h3>Anonymous user ({user.uid})</h3>
            <i>Convert anonymous user to permanent account.</i>
        {/if}
    </div>
</section>

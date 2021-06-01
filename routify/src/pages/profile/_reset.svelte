<script>
    import { goto } from "@roxi/routify";
    import { User } from "sveltefire";
    import ProfileNav from "./_components/ProfileNav.svelte";
    import ProfileSetting from "./_components/ProfileSettings.svelte";
    import ProfileSearch from "./_components/ProfileSearch.svelte";
    import ProfileFooter from "./_components/ProfileFooter.svelte";
    import firebase from "firebase/app";
</script>

<User
    on:user={() => {
        if (!firebase?.auth()?.currentUser) {
            $goto("/");
        }
    }}
>
    <section id="profile-reset" class="px-1 py-1 bg-white-100 md:py-10">
        <div><h1>pages/profile/_reset.svelte</h1></div>
        
        <ProfileNav />
        <ProfileSearch />
        <main><slot /></main>
        <ProfileSetting />
        <ProfileFooter />
    </section>

    <div slot="signed-out">Loading...</div>
</User>

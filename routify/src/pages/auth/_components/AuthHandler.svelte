<script lang="ts">
    import firebase from "firebase/app";
    import { googleProvider, githubProvider, auth } from "../../../firebase/fireapp";
    import { fade } from "svelte/transition";
    import Login from "../../../views/auth/Login.svelte";
    import Register from "../../../views/auth/Register.svelte";
    export let action: "login" | "register" = "register";
    import { createEventDispatcher } from "svelte";
    export let dispatch = createEventDispatcher();
    export let isAuthenticated = false;
    export let err: string | null = null;
    let notSureIfAuthenticated = true;

    $: console.log(
        "Checking if user is authenticated...",
        !!notSureIfAuthenticated
    );

    auth.onAuthStateChanged((user) => {
        notSureIfAuthenticated = false;
        isAuthenticated = !!user;
        if (isAuthenticated) {
            dispatch("auth");
        } else dispatch("logout");
    });

    function login(event: CustomEvent) {
        const { email, password } = event.detail;
        if (!email || !password) {
            err = "Fill out all fields!";
            return;
        }
        err = "";
        auth.signInWithEmailAndPassword(email, password)
            .then(() => {
                dispatch("done");
                dispatch("auth");
            })
            .catch((e) => {
                err = `(${e.code}) ${e.message}`;
            });
    }

    function register(event: CustomEvent) {
        const { name, email, password, confirmPassword } = event.detail;
        console.error(name, email, password, confirmPassword);
        if (!name || !email || !password || !confirmPassword) {
            err = "Fill out all fields!";
            return;
        }
        if (password !== confirmPassword) {
            err = "Passwords don't match!";
            return;
        }
        err = "";
        auth.createUserWithEmailAndPassword(email, password)
            .then(() => {
                dispatch("done");
                dispatch("auth");
            })
            .catch((e) => {
                err = `(${e.code}) ${e.message}`;
            });
    }

    function logout() {
        if (auth.currentUser) {
            auth.signOut()
                .then(() => {
                    dispatch("done");
                    dispatch("logout");
                })
                .catch((e) => {
                    throw new Error(e);
                });
        }
    }
    function signInWithGoogle() {
        console.log("Login with Google");
        auth.signInWithRedirect(googleProvider);
    }
    function signInWithGithub() {
        console.log("Login with Github");
        auth.signInWithRedirect(githubProvider);
    }
    const signInWithAnon = () => {
        firebase
            .auth()
            .signInAnonymously()
            .then(() => {
                console.log(`Anonymously signed in`);
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(`${errorCode}, ${errorMessage}`);
            });
    };
</script>

{#if notSureIfAuthenticated}
    <section>
        <p>Checking user is logged in...</p>
    </section>
{:else if isAuthenticated}
    <p class="">Logged in</p>
    <p>
        <button class="" style="width: 100%" on:click={logout}>Log out</button>
    </p>
{:else}
    <form in:fade>
        <section class="">
            <div>
                <div>
                    {#if err}
                        {console.error(err)}
                    {/if}
                </div>
                <div class="flex items-center justify-center py-4">
                    {#if action === "login"}
                        <Login
                            on:github={signInWithGithub}
                            on:google={signInWithGoogle}
                            on:anon={signInWithAnon}
                            on:submit={login}
                        />
                    {:else}
                        <Register
                            on:github={signInWithGithub}
                            on:google={signInWithGoogle}
                            on:anon={signInWithAnon}
                            on:submit={register}
                        />
                    {/if}
                </div>
            </div>
        </section>
    </form>
{/if}

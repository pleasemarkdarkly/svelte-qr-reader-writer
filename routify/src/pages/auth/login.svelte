<script>
    import firebase from "firebase/app";
    import { goto } from "@roxi/routify";
    import { User } from "sveltefire";
    const surpriseBanner = ["../../svgs/icons/tyrannosaurus.svg"],
        surpriseUser = [
            "../../svgs/icons/user.svg",
            "../../svgs/icons/apple.svg",
            "../../svgs/icons/bananas.svg",
            "../../svgs/icons/lemon.svg",
            "../../svgs/icons/strawberry.svg",
            "../../svgs/icons/avocado.svg",
        ];
    let userSignInData = {};
    let randomPicker = (array) => {
        return array[Math.floor(Math.random() * array.length)];
    };
</script>

<User persist={sessionStorage}
    on:user={() => {
        if (firebase && firebase?.auth()?.currentUser) {
            $goto("/");
        }
    }}
>
    <section
        class="flex items-center justify-center p-2 mb-16 md:p-16 dark:text-white dark:bg-gray-800"
        slot="signed-out"
    >
        <div
            class="relative flex flex-col w-full gap-8 p-8 bg-gray-300 shadow dark:bg-gray-900 rounded-xl md:w-auto"
        >
            <picture class="flex items-center justify-center">
                <img src={randomPicker(surpriseBanner)} alt="" class="w-32" />
            </picture>
            <div class="grid grid-cols-1 gap-2 md:grid-cols-3">
                <div
                    class="flex items-center justify-center text-sm font-bold text-gray-600 md:col-span-3 row dark:text-gray-100"
                >
                    Sign in with
                </div>
                <button
                    class="row-start-2 bg-white btn dark:text-black"
                    on:click={() => {
                        firebase
                            .auth()
                            .signInWithPopup(
                                new firebase.auth.GoogleAuthProvider()
                            );
                    }}
                    ><img
                        src="../../svgs/icons/google.svg"
                        alt=""
                        class="w-5 mr-1"
                    /> Google</button
                >
                <button
                    class="bg-white btn dark:text-black"
                    on:click={() => {
                        firebase
                            .auth()
                            .signInWithPopup(
                                new firebase.auth.GithubAuthProvider()
                            );
                    }}
                >
                    <img
                        src="../../svgs/icons/github.svg"
                        alt=""
                        class="w-5 mr-1"
                    />Github</button
                >
                <button
                    class="bg-white btn dark:text-black"
                    on:click={() => {
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
                    }}
                >
                    <img
                        src={randomPicker(surpriseUser)}
                        alt=""
                        class="w-5 mr-1"
                    />
                    Anonymous</button
                >
            </div>
            <hr />
            <form
                on:submit|preventDefault={() => {
                    if (!userSignInData.email || !userSignInData.password) {
                        return;
                    }
                    firebase
                        .auth()
                        .signInWithEmailAndPassword(
                            userSignInData.email,
                            userSignInData.password
                        )
                        .then(() => {})
                        .catch((e) => {
                            return e;
                        });
                }}
                class="flex flex-col gap-4"
            >
                <div class="w-full">
                    <label
                        class="block mb-2 text-xs font-bold text-gray-700 uppercase dark:text-gray-100"
                        for="login-email"
                    >
                        Email
                    </label>
                    <input
                        id="login-email"
                        type="email"
                        class="w-full p-3 text-sm text-gray-700 placeholder-gray-400 transition-all duration-150 ease-linear bg-white rounded shadow focus:outline-none focus:shadow-outline"
                        placeholder="Email"
                        bind:value={userSignInData.email}
                    />
                </div>
                <div class="w-full">
                    <label
                        class="block mb-2 text-xs font-bold text-gray-700 uppercase dark:text-gray-100"
                        for="login-password"
                    >
                        Password
                    </label>
                    <input
                        id="login-password"
                        type="password"
                        class="w-full p-3 text-sm text-gray-700 placeholder-gray-400 transition-all duration-150 ease-linear bg-white rounded shadow focus:outline-none focus:shadow-outline"
                        placeholder="Password"
                        bind:value={userSignInData.password}
                    />
                </div>
                <div>
                    <label
                        class="inline-flex items-center cursor-pointer dark:text-gray-100"
                    >
                        <input
                            id="customCheckLogin"
                            type="checkbox"
                            class="w-5 h-5 ml-1 text-gray-800 transition-all duration-150 ease-linear form-checkbox"
                            bind:value={userSignInData.remember}
                        />
                        <span
                            class="ml-2 text-sm font-semibold text-gray-700 dark:text-gray-100"
                        >
                            Remember me
                        </span>
                    </label>
                </div>
                <button class="text-white bg-gray-700 btn"> Sign In </button>
            </form>
            <a href="/auth/reset" class="absolute mt-8 top-full -left-1"
                >Forgot Password?</a
            >
            <a href="/auth/register" class="absolute mt-8 top-full -right-1"
                >Create New Account?</a
            >
        </div>
    </section>
</User>

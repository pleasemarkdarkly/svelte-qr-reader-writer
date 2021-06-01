<script>
    import firebase from "firebase/app";
    import { User } from "sveltefire";
    import { goto } from "@roxi/routify";
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
        if (firebase.auth().currentUser) {
            $goto("/");
        }
    }}
>
    <section
        class="flex items-center justify-center p-16 mb-16 dark:text-white dark:bg-gray-800"
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
                    class="bg-white btn dark:text-black"
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
                                console.log(`Anonymously signing in`);
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
                on:submit|preventDefault={async () => {
                    const {
                        name,
                        email,
                        password,
                        confirmPassword,
                    } = userSignInData;
                    if (!name || !email || !password || !confirmPassword) {
                        return;
                    }
                    if (password !== confirmPassword) {
                        return;
                    }
                    await firebase
                        .auth()
                        .createUserWithEmailAndPassword(email, password)
                        .then(async (credentials) => {
                            await credentials.user
                                .updateProfile({
                                    displayName: name,
                                })
                                .catch((er) => {
                                    console.log(er);
                                });
                        })
                        .catch((er) => {
                            console.log(er);
                        });
                }}
                class="flex flex-col gap-4"
            >
                <div class="w-full">
                    <label
                        class="block mb-2 text-xs font-bold text-gray-700 uppercase dark:text-gray-100"
                        for="grid-name"
                    >
                        Name
                    </label>
                    <input
                        id="grid-name"
                        type="text"
                        class="w-full px-3 py-3 text-sm text-gray-700 placeholder-gray-400 transition-all duration-150 ease-linear bg-white rounded shadow focus:outline-none focus:shadow-outline"
                        placeholder="Name"
                        bind:value={userSignInData.name}
                    />
                </div>
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
                <div class="w-full">
                    <label
                        class="block mb-2 text-xs font-bold text-gray-700 uppercase dark:text-gray-100"
                        for="grid-password"
                    >
                        Confirm Password
                    </label>
                    <input
                        id="grid-password"
                        type="password"
                        class="w-full px-3 py-3 text-sm text-gray-700 placeholder-gray-400 transition-all duration-150 ease-linear bg-white rounded shadow focus:outline-none focus:shadow-outline"
                        placeholder="Password"
                        bind:value={userSignInData.confirmPassword}
                    />
                </div>
                <div>
                    <label class="inline-flex items-center cursor-pointer">
                        <input
                            id="customCheckLogin"
                            type="checkbox"
                            class="w-5 h-5 ml-1 text-gray-800 transition-all duration-150 ease-linear form-checkbox"
                            bind:checked={userSignInData.agree}
                        />
                        <span
                            class="ml-2 text-sm font-semibold text-gray-700 dark:text-gray-100"
                        >
                            I agree with the
                            <a
                                href="/auth/privacy"
                                target="_blank"
                                class="text-red-500 dark:text-red-600"
                            >
                                Privacy Policy
                            </a>
                        </span>
                    </label>
                </div>
                <button class="text-white bg-gray-700 btn"> Sign In </button>
            </form>
            <a href="/auth/login" class="absolute mt-8 top-full -right-1"
                >Already have an account?</a
            >
        </div>
    </section>
</User>

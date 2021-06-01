<script>
    import Icon from "svelte-awesome";
    import { language } from "svelte-awesome/icons";
    const github = "../../svgs/icons/github.svg";
    const google = "../../svgs/icons/google.svg";
    const surprise_banner = ["../../svgs/icons/tyrannosaurus.svg"];
    const random_banner = Math.floor(Math.random() * surprise_banner.length);
    const banner = surprise_banner[random_banner];
    const surprise_user = [
        "../../svgs/icons/user.svg",
        "../../svgs/icons/apple.svg",
        "../../svgs/icons/bananas.svg",
        "../../svgs/icons/lemon.svg",
        "../../svgs/icons/strawberry.svg",
        "../../svgs/icons/avocado.svg",
    ];
    const random_user = Math.floor(Math.random() * surprise_user.length);
    const user = surprise_user[random_user];
    import { createEventDispatcher } from "svelte";

    let name,
        email,
        password,
        confirmPassword,
        agree = false;

    const dispatch = createEventDispatcher();

    function submitForm(event) {
        if (agree) {
            if (name && email && password && confirmPassword) {
                dispatch("submit", { name, email, password, confirmPassword });
            } else {
                alert("The form must be completed before you can submit.");
            }
        } else {
            alert("You must checkbox that you agree with the Privacy Policy");
        }
    }
</script>

<div class="container h-full px-4 mx-auto">
    <div class="flex items-center content-center justify-center h-screen">
        <div class="px-4 w-max sm:10/12 md:8/12 lg:w-5/12">
            <div
                class="relative flex flex-col w-full min-w-0 mb-6 break-words bg-gray-300 border-0 rounded-lg shadow-lg"
            >
                <div class="py-4 rounded-t">
                    <img
                        src={banner}
                        alt="Login Banner"
                        class="w-full mx-auto"
                        style="max-width: 40%;"
                    />
                </div>
                <div class="px-6 py-6 mb-0 rounded-t">
                    <div class="mb-3 text-center">
                        <h6 class="text-sm font-bold text-gray-600">
                            Sign up with
                        </h6>
                    </div>
                    <div class="text-center btn-wrapper">
                        <button
                            class="inline-flex items-center px-4 py-2 mb-1 mr-2 text-xs font-bold text-gray-800 uppercase transition-all duration-150 ease-linear bg-white rounded shadow outline-none active:bg-gray-100 focus:outline-none hover:shadow-md"
                            type="button"
                        >
                            <img alt="..." class="w-5 mr-1" src={github} />
                            Github
                        </button>
                        <button
                            class="inline-flex items-center px-4 py-2 mb-1 mr-1 text-xs font-bold text-gray-800 uppercase transition-all duration-150 ease-linear bg-white rounded shadow outline-none active:bg-gray-100 focus:outline-none hover:shadow-md"
                            type="button"
                        >
                            <img alt="..." class="w-5 mr-1" src={google} />
                            Google
                        </button>
                        <button
                            class="inline-flex items-center px-4 py-2 mb-1 mr-1 text-xs font-bold text-gray-800 uppercase transition-all duration-150 ease-linear bg-white rounded shadow outline-none active:bg-gray-100 focus:outline-none hover:shadow-md"
                            type="button"
                        >
                            <img alt="..." class="w-5 mr-1" src={user} />
                            Anon
                        </button>
                    </div>
                    <hr class="mt-6 border-gray-400 border-b-1" />
                </div>
                <div class="flex-auto px-4 py-10 pt-0 lg:px-10">
                    <div class="mb-3 font-bold text-center text-gray-500">
                        <small>Or sign up with credentials</small>
                    </div>
                    <form on:submit|preventDefault={submitForm}>
                        <div class="relative w-full mb-3">
                            <label
                                class="block mb-2 text-xs font-bold text-gray-700 uppercase"
                                for="grid-name"
                            >
                                Name
                            </label>
                            <input
                                id="grid-name"
                                type="text"
                                class="w-full px-3 py-3 text-sm text-gray-700 placeholder-gray-400 transition-all duration-150 ease-linear bg-white rounded shadow focus:outline-none focus:shadow-outline"
                                placeholder="Name"
                                bind:value={name}
                            />
                        </div>

                        <div class="relative w-full mb-3">
                            <label
                                class="block mb-2 text-xs font-bold text-gray-700 uppercase"
                                for="grid-email"
                            >
                                Email
                            </label>
                            <input
                                id="grid-email"
                                type="email"
                                class="w-full px-3 py-3 text-sm text-gray-700 placeholder-gray-400 transition-all duration-150 ease-linear bg-white rounded shadow focus:outline-none focus:shadow-outline"
                                placeholder="Email"
                                bind:value={email}
                            />
                        </div>

                        <div class="relative w-full mb-3">
                            <label
                                class="block mb-2 text-xs font-bold text-gray-700 uppercase"
                                for="grid-password"
                            >
                                Password
                            </label>
                            <input
                                id="grid-password"
                                type="password"
                                class="w-full px-3 py-3 text-sm text-gray-700 placeholder-gray-400 transition-all duration-150 ease-linear bg-white rounded shadow focus:outline-none focus:shadow-outline"
                                placeholder="Password"
                                bind:value={password}
                            />
                        </div>

                        <div class="relative w-full mb-3">
                            <label
                                class="block mb-2 text-xs font-bold text-gray-700 uppercase"
                                for="grid-password"
                            >
                                Confirm Password
                            </label>
                            <input
                                id="grid-password"
                                type="password"
                                class="w-full px-3 py-3 text-sm text-gray-700 placeholder-gray-400 transition-all duration-150 ease-linear bg-white rounded shadow focus:outline-none focus:shadow-outline"
                                placeholder="Password"
                                bind:value={confirmPassword}
                            />
                        </div>

                        <div>
                            <label
                                class="inline-flex items-center cursor-pointer"
                            >
                                <input
                                    id="customCheckLogin"
                                    type="checkbox"
                                    class="w-5 h-5 ml-1 text-gray-800 transition-all duration-150 ease-linear form-checkbox"
                                    bind:checked={agree}
                                />
                                <span
                                    class="ml-2 text-sm font-semibold text-gray-700"
                                >
                                    I agree with the
                                    <a
                                        href="/auth/privacy"
                                        target="_blank"
                                        on:click={(e) => e.preventDefault()}
                                        class="text-red-500"
                                    >
                                        Privacy Policy
                                    </a>
                                </span>
                            </label>
                        </div>

                        <div class="mt-6 text-center">
                            <button
                                class="w-full px-6 py-3 mb-1 mr-1 text-sm font-bold text-white uppercase transition-all duration-150 ease-linear bg-gray-900 rounded shadow outline-none active:bg-gray-700 hover:shadow-lg focus:outline-none"
                                type="submit"
                            >
                                Create Account
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <div class="relative flex flex-wrap mt-6">
                <div class="w-1/2" />
                <div class="w-1/2 text-right">
                    <a href="/auth/login" class="text-gray-900">
                        <small>Already have an account?</small>
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>

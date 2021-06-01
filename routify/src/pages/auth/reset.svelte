<script lang="ts">
    import firebase from "firebase/app";
    import { goto } from "@roxi/routify";
    import { User } from "sveltefire";
    import {
        VALID_EMAIL_INPUT_STYLING,
        INVALID_EMAIL_INPUT_STYLING,
        RESET_EMAIL_INSTRUCTIONS,
    } from "../../constants";
    import { validateEmail } from "../../utils";

    const surpriseBanner = ["../../svgs/icons/tyrannosaurus.svg"];
    const randomPicker = (array) => {
        return array[Math.floor(Math.random() * array.length)];
    };

    let emailStyling = VALID_EMAIL_INPUT_STYLING;
    let instructions = ``;
    let reminderEmail = ``;

    const resetUserAccount = (reminderEmail: string) => {
        console.log(`resetUserAccount => ${reminderEmail}`);
        if (validateEmail(reminderEmail)) {
            console.log(`Check Firestore for user account with email.`);
        } else {
            alert(`Unable to submit form due to malformed email address.`);
        }
    };
    $: {
        reminderEmail;
        validateEmail(reminderEmail)
            ? (emailStyling = VALID_EMAIL_INPUT_STYLING)
            : (emailStyling = INVALID_EMAIL_INPUT_STYLING);
        validateEmail(reminderEmail)
            ? (instructions = RESET_EMAIL_INSTRUCTIONS)
            : (instructions =
                  RESET_EMAIL_INSTRUCTIONS +
                  "<br>" +
                  "Please verify you are submitting a valid email address.");
    }
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
            <div>
                <picture class="flex items-center justify-center">
                    <img
                        src={randomPicker(surpriseBanner)}
                        alt={randomPicker(surpriseBanner)}
                        class="w-32"
                    />
                </picture>
                <br />
                <hr />
                <br />
                <p>
                    {@html instructions}
                </p>
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
                    class={emailStyling}
                    placeholder="Email"
                    bind:value={reminderEmail}
                />
            </div>
            <button
                class="text-white bg-gray-700 btn"
                on:click={() => {
                    resetUserAccount(reminderEmail);
                }}
            >
                Reset Account
            </button>
        </div>
    </section>
</User>

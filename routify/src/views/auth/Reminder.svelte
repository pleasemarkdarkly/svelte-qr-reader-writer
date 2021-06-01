<script>
    const surprise_banner = ["../../svgs/icons/tyrannosaurus.svg"];
    const random_banner = Math.floor(Math.random() * surprise_banner.length);
    const banner = surprise_banner[random_banner];
</script>

<div class="container h-full px-4 mx-auto">
    <div class="flex items-center justify-center h-screen">
        <div class="px-4 w-50 lg:w-4/12">
            <div
                class="relative flex flex-col w-full min-w-0 mb-6 break-words bg-gray-300 border-0 rounded-lg shadow-lg"
            >
                <div class="px-6 py-6 mb-2 rounded-t">
                    <img src={banner} alt="Logo" height="500" width="500" />
                </div>
                <div class="flex-auto px-4 py-10 pt-0 lg:px-10">
                    <div class="mb-3 font-bold text-center text-gray-500">
                        <small
                            >Please enter the email address you believe is
                            associated with your account.</small
                        >
                    </div>
                    <form>
                        <div class="relative w-full mb-3">
                            <label
                                class="block mb-2 text-xs font-bold text-gray-700 uppercase"
                                for="grid-email"
                            />
                            <input
                                id="grid-email"
                                type="email"
                                class="w-full px-3 py-3 text-sm text-gray-700 placeholder-gray-400 transition-all duration-150 ease-linear bg-white rounded shadow focus:outline-none focus:shadow-outline"
                                placeholder="Email"
                            />
                        </div>
                        <div class="mt-6 text-center">
                            <button
                                class="w-full px-6 py-3 mb-1 mr-1 text-sm font-bold text-white uppercase transition-all duration-150 ease-linear bg-gray-900 rounded shadow outline-none active:bg-gray-700 hover:shadow-lg focus:outline-none"
                                type="button"
                            >
                                Send Reminder Email
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <div class="relative flex flex-wrap mt-6">
                <div class="w-1/2" />
                <div class="w-1/2 text-right">
                    <a href="./register" class="text-gray-300">
                        <small>Create new account</small>
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>

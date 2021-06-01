![Firebase](https://github.com/buildkite/emojis/raw/master/img-buildkite-64/firebase.png) 
# Infinitely Scalable Robo-dialer
## Firebase, Cloud Functions powered Twilio, SendGrid, and Slack Marketing Serverless Application
My clients/friends needed to automate how they communicated with their extensive customer list via various channels including SMS, MMS, email, and automated voice phone calls.  Additionally, if a customer responded, this was to be handled via the same IVR and SMS system. Obviously this has significant potential for already widespread and offensive behavior - the reason I thought deeply before making this repo public. However, while developing this, I wished I had such a reference. This repo is not turn-key, thus I believe the barrier for abuse is not that high for an individual how can navigate through this repo, its just a bit more convenient. That said, the repo compiles [helloWorld](https://us-central1-example-4f999.cloudfunctions.net/helloWorld) both functions and hosting, the [later](https://example-4f999.web.app/) is currently under-development.

The system sets up an IVR, SMS menu, and questionnaire with mp3 resources for voicemail, menu, and forwarding numbers to bridge transfers requested by the recipient. External calling is scheduled via the tasks, inbound voice and sms is handled by the Twilio/Express endpoints. A Slack workspace/channel is used with slash commands to respond to users while inbound MMS are forwarded to an email. Individuals are presented first via voice, sms the ability to OptOut of future contact. Given the system is Serverless on Firebase/Cloud Functions, monthly invocations even with tens-thousands of inbound and outbound calls has yet to break $6, as well as SMS, MMS, Voice via Twilio is as cheap as they come.

The system is broken into the following parts:
* Twilio endpoints for voice/SMS
* Sendgrid endpoints
* Slack endpoints
* task scheduling and management
* configuration properties
* utils

# Introduction
Not represented here is the import logic or the criteria on who to call, sms, or email. However, this is entirely your domain - creating tasks for phone, SMS< email activities. The meat and potatoes of the system is in the `express server` folder and its `routes`, its here the Twilio, Sendgrid, Slack webhooks are implemented and handled. Just about any permutation of use via the phone and email is represented. Including using pre-recorded files and dynamic text to speech scripts. Scenarios such as the system calling out (auto-dialing), people calling in (IVR), bridge calls, forwarding MMS to email, texting a request to be called, are all implemented in some form.  Perhaps un-intuitively the process of having the system connect two people to a call or bridging, the system first calls one party, if a human responds, then calls the other party and finalizes the bridge. Parameters used in this code were found to work the best across a wide range of numbers/individuals, although you can fine-tune the detection algorithm. The machine-detection does take on average 3-5 seconds, in practice, hardly noticeable.  Among the laundry-list of features and cases, updates from the system can be configured to propagate to a Slack Channel, along with the forwarding of SMS/MMS incoming messages and responding Slack slash commands. 

In the `auto-dialer`, also called, `questionnaire` mode, the IVR system is configurable on how to react to the machine-detection responses including leaving a voicemail, bridge the call to a ready attendant or operator, or start a specific line of questions.   By way of a bullet list, here are a number of other features which were implemented to get this system working:

* auto-dialer machine detection
* automated voicemails
* call bridging
* endpoint for Twilio voice webhook/errors
* endpoint for Twilio sms webhook/errors
* endpoint for Sendgrid event webhook /errors/events
* future datetime and load balancing of future scheduled tasks
* business hours computation with holidays
* task / scheduler for discrete tasks
* MMS auto-forwarded to Slack Channel and designate email
* SMS forwarded to Slack Channel/Channels by topic
* /sms Slack slash command to respond to sms
* Twilio IVR handles both recordings and text to speech
* helper functions speaking numbers and dates
* optOut IVR and SMS menu system
* consolidated IVR script

## Environment Variables, API Keys, Helper Scripts
The first order of business is to update the function folder's `.env.production` and `set-env.sh` with all your API keys. In `scripts` a copy of this `set-env.sh` script is provided. In short loading your production, staging Firebase config, API keys via the `set-env.sh` will ready you to easily run a simple command to export into the development environment or set up with `firebase functions:config:set` and auto generate the .`runtimeconfig.json`.  `kill_ports.sh` - As the name suggests, provides you with a list of ports which are in use and the ability to kill the process that is holding on to them. Useful for misbehaving hot reloaders. 

The following API/Accounts are required:
* Slack webhook, oauth, bot, and channels `express\routes\slack`
* Slack slash command to respond to SMS
* Twilio SID, Secret, number, Firebase webhook voice /sms
* Sendgrid API, Secret, MMS template id

### Logging
A Winston abstraction can be found in `utils`. However significant use of firebase `functions.logger.info` in conjunction with the `cli run-logs.sh` was predominately what I used. Where useful, the helper `addEntryByCategory` logged and grouped data in the `configuration` collection. Additionally, a `debug` Slack channel was used for certain specific use cases. All of the aforementioned methods are commented out throughout the code in lieu of actual comments.

### Utility function helpers
The following helper functions are included:
* datetime computation, working hours/holidays
* cron constants
* numbers to be spoken
* fetch/isomorphic helpers
* hashing functions
* phone number manipulation
* email manipulation, domain testing
* storage bucket import, export
* collection property settings
* timestamp property settings
* global configuration settings
* console logging with colors
* random emojis
* object typeOf
* object/empty property removal

### Additional TODOs
A number of other libraries require sanitization which would certainly help round out this repo, including, the scheduling/task processing folders. Not all of the IVR incoming or questionnaire scripts are consolidated in the `scripts.ts` file.  Consolidated script was convenient for sharing with the voice actress. Currently, I am developing a front-end to this application so that all of the settings can be managed and marketing SMS messages can be authored, scheduled, and managed, among other tasks.

## DISCLAIMER
You may not use this software or code to harass or engage in any illegal scamming campaign or mass phone marketing campaign. The entire reason this code was not released earlier was specifically the concern of the potential for this software's abuse versus the teachable moments or lessons included. That said, this system has entirely been pulled of any API keys and detailed instructions on how to operate, and I think anyone able to understand the repo has the capability to implement such a system. This repo is not turn-key. 

## Acknowledgements
The tutorials for Twilio, Sendgrid, while not perfect, helped. The online Microsoft Typescript documentation was important, and the W3School. However watching [https://fireship.io/](Fireship.io's YouTube channel) taught me the most and was where learned a great deal from Jeff Delaney. While his videos make programming look deceptively easy, they went a pretty long way to conveying the point. I think the task scheduler originally came from him. It may have even been related to some robo-calling tutorial he took down. Anyway, his content is super great so I highly recommend you sign up for his _uber_ affordable paywall of tutorials.  

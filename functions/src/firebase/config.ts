import * as functions from 'firebase-functions';

export const MAUTIC_HOST = functions.config()?.mautic.host;
export const MAUTIC_USERNAME = functions.config()?.mautic.username;
export const MAUTIC_PASSWORD = functions.config()?.mautic.password;
export const SENDGRID_API_KEY = functions.config()?.sendgrid.api_key;
export const SENDGRID_TEMPLATE_ID_EX_MMS = functions.config()?.sendgrid.templateid_ex_mms;
export const TWILIO_ACCOUNT_SID = functions.config()?.twilio.account_sid;
export const TWILIO_AUTH_TOKEN = functions.config()?.twilio.auth_token;
export const TWILIO_NUMBER_ONE = functions.config()?.twilio.number_one;
export const SLACK_OAUTH_TOKEN = functions.config()?.slack.oauth_token;
export const SLACK_SOCKET_TOKEN = functions.config()?.slack.socket_token;
export const PUSHOVER_USER = functions.config()?.pushover.user;
export const PUSHOVER_TOKEN = functions.config()?.pushover.token;
export const FORWARDING_NUMBER_ONE = functions.config()?.forwarding.number_one;
export const FORWARDING_NUMBER_TWO= functions.config()?.forwarding.number_two;
export const TWILIO_VOICE = 'alice';
export const TWILIO_VOICE_COUNTRY = 'en-GB';

export const VOICEMAIL_FULL =
  'https://firebasestorage.googleapis.com/v0/b/example.appspot.com/' +
  'o/audio%2Fivr-number-removed.mp3?alt=media&token=4fb09ed6-f1d3-4f3d-807f-13b8bab1cae1'
export const EXTERNAL_VOICEMAIL_PART_ONE =
  'https://firebasestorage.googleapis.com/v0/b/example.appspot.com/' +
  'o/audio%2Fivr-number-removed.mp3?alt=media&token=4fb09ed6-f1d3-4f3d-807f-13b8bab1cae1'
export const EXTERNAL_VOICEMAIL_PART_TWO =
  'https://firebasestorage.googleapis.com/v0/b/example.appspot.com/' +
  'o/audio%2Fivr-number-removed.mp3?alt=media&token=4fb09ed6-f1d3-4f3d-807f-13b8bab1cae1'
export const IVR_MENU =
  'https://firebasestorage.googleapis.com/v0/b/example.appspot.com/' +
  'o/audio%2Fivr-number-removed.mp3?alt=media&token=4fb09ed6-f1d3-4f3d-807f-13b8bab1cae1'
export const OPTOUT_QUESTIONNAIRE_MENU =
  'https://firebasestorage.googleapis.com/v0/b/example.appspot.com/' +
  'o/audio%2Fivr-number-removed.mp3?alt=media&token=4fb09ed6-f1d3-4f3d-807f-13b8bab1cae1'
export const QUESTIONNAIRE_MENU =
  'https://firebasestorage.googleapis.com/v0/b/example.appspot.com/' +
  'o/audio%2Fivr-number-removed.mp3?alt=media&token=4fb09ed6-f1d3-4f3d-807f-13b8bab1cae1'
export const OPTOUT_PRESS_NINE =
  'https://firebasestorage.googleapis.com/v0/b/example.appspot.com/' +
  'o/audio%2Fivr-number-removed.mp3?alt=media&token=4fb09ed6-f1d3-4f3d-807f-13b8bab1cae1'
export const OPTOUT_APOLOGY =
  'https://firebasestorage.googleapis.com/v0/b/example.appspot.com/' +
  'o/audio%2Fivr-number-removed.mp3?alt=media&token=4fb09ed6-f1d3-4f3d-807f-13b8bab1cae1'
export const OPTOUT_REMOVED_NUMBER_CONFIRMATION =
  'https://firebasestorage.googleapis.com/v0/b/example.appspot.com/' +
  'o/audio%2Fivr-number-removed.mp3?alt=media&token=4fb09ed6-f1d3-4f3d-807f-13b8bab1cae1'

export const DEVELOPER_PHONE = '+1';
export const WA_AREA_CODES = ['206', '425', '253', '360', '509', '564'];
export const SLACK_NOTIFICATIONS = false;
export const VERBOSE = true;

/**
 * A random, non-empty string used as a default document id in Firestore
 * that is designed to not produce any matches when you do
 * firestore.collection('PATH').doc(FB_DEFAULT_ID)
 */
export const FB_DEFAULT_ID =
  'cb5d0a377e853a3159bf034cdbc84c47676b11a51349f0606e32e45005867871627562fd63678f5f6ed550e59743e0e10bce747ae7';

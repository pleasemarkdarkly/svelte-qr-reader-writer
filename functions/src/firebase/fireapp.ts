import * as fs from 'fs';
import * as path from 'path';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { BLANK, FgRed as Rd, FgGreen as G, Reset as R, Underscore as _, } from '../utils';

export const NODE_ENV = process.env?.NODE_ENV || 'development';
export const FIREBASE_CONFIG = process.env?.FIREBASE_CONFIG;
export const GCLOUD_PROJECT = process.env?.GCLOUD_PROJECT || process.env?.GCP_PROJECT;
export const FUNCTIONS_EMULATOR = process.env?.FUNCTIONS_EMULATOR;

export let FIREBASE_ENDPOINT = BLANK;
export let FIRESTORE_EMULATOR_HOST = BLANK;
// @ts-ignore
export let FIREBASE_ADMIN_SDK = BLANK;
export let FIREBASE_KEYPATH = BLANK;
export let FIREBASE_DB_PATH = BLANK;
export let FIREBASE_STORAGE = BLANK;

if (NODE_ENV === 'development') {
  FIREBASE_KEYPATH = './keys/example.json'; // service account
  FIREBASE_DB_PATH = 'https://example.firebaseio.com';
  FIREBASE_STORAGE = 'gs://example.appspot.com';
  FIREBASE_ENDPOINT = 'https://us-central1-example.cloudfunctions.net/twilio';
  FIRESTORE_EMULATOR_HOST = process.env?.FIRESTORE_EMULATOR_HOST || 'localhost:8888';
} else if (NODE_ENV === 'production') {
  FIREBASE_ADMIN_SDK = './keys/example.json'; // admin-sdk
  FIREBASE_KEYPATH = './keys/example-firebase-adminsdk.json'
  FIREBASE_DB_PATH = 'https://example.firebaseio.com';
  FIREBASE_STORAGE = 'gs://example.appspot.com';
  FIREBASE_ENDPOINT = 'https://us-central1-example.cloudfunctions.net/twilio';
} else {
  functions.logger.error(`NODE_ENV was undefined:${NODE_ENV}`);
}

const cert = JSON.parse(fs.readFileSync(path.resolve(FIREBASE_KEYPATH), { encoding: 'utf8' }));
export const fireapp = admin.initializeApp({
  credential: admin.credential.cert(cert),
  databaseURL: FIREBASE_DB_PATH,
  storageBucket: FIREBASE_STORAGE,
});

const NL = '\n';
if (!process.env.FUNCTIONS_EMULATOR && NODE_ENV === 'development') {
  if (NODE_ENV) process.stdout.write(`🔥 ${_}NODE_ENV:${NODE_ENV}${R} ${NL}`);
  if (FIREBASE_ENDPOINT) process.stdout.write(`🔥 ENDPOINT:${FIREBASE_ENDPOINT} ${NL}`);
  if (FIREBASE_KEYPATH) process.stdout.write(`🔥 KEYPATH:${FIREBASE_KEYPATH} ${NL}`);
  if (FIREBASE_DB_PATH) process.stdout.write(`🔥 DB:${FIREBASE_DB_PATH} ${NL}`);
  if (FIREBASE_STORAGE) process.stdout.write(`🔥 STORAGE=${FIREBASE_STORAGE} ${NL}`);
  if (FUNCTIONS_EMULATOR) process.stdout.write(`🔥 EMULATOR:${FIRESTORE_EMULATOR_HOST} ${NL}`);
  if (GCLOUD_PROJECT !== undefined) process.stdout.write(`🔥 ${Rd}GCLOUD:${GCLOUD_PROJECT}${R} ${NL}`);
  if (FIREBASE_CONFIG) process.stdout.write(`🔥 ${G}CONFIG:${FIREBASE_CONFIG}${R} ${NL}`);
} else if (NODE_ENV === 'production') { }

if (process.env.FUNCTIONS_EMULATOR) { process.stdout.write(`${process.env}`); }

export const PUBSUB_TOPIC = 'projects/example/topics/messages';
export const url_endpoint = FIREBASE_ENDPOINT;
export const firebase = admin;
export const firebaseTimestamp = admin.firestore.Timestamp;
export const auth = fireapp.auth();
export const db = fireapp.firestore();
export const storage = firebase.storage().bucket(FIREBASE_STORAGE);

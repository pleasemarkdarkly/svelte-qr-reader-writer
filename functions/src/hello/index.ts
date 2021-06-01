import * as functions from 'firebase-functions';

export const helloWorld = functions.https.onRequest((req, res) => {
  res.status(200).send(`<!doctype html>
    <head>
      <title>Hello World</title>
    </head>
    <body>
      Hello World from Firebase Cloud Functions.
    </body>
  </html>`);
});
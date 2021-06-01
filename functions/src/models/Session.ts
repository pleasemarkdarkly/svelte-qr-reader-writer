import * as admin from 'firebase-admin';
export interface Session {
  fromDate: admin.firestore.Timestamp;
  toDate: admin.firestore.Timestamp;
  finishedAt: admin.firestore.Timestamp | null;
}

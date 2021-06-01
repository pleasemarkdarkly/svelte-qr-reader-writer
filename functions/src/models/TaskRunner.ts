import * as admin from 'firebase-admin';

export const Status: 'scheduled' | 'complete' | 'error' | 'unassigned' = 'unassigned';
export interface Workers {
  [key: string]: (options: any) => Promise<any>;
}
export interface TaskRunner {
  worker: string;
  owner: admin.firestore.DocumentReference;
  performAt: admin.firestore.Timestamp;
  status: string;
  options: {};
}

export interface TaskOptions {
  lastName: string;
  firstName: string;
  city: string;
  county: string,
};

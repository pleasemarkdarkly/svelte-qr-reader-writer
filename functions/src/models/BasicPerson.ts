import * as admin from 'firebase-admin';

export interface BasicPerson {
  firstName: string;
  lastName: string;
  fullName: string;
  key: boolean;
  cos: {
    id: string;
    roles: string[];
    ref: admin.firestore.DocumentReference;
  }[];
}

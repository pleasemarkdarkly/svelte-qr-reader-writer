import 'firebase/firebase-firestore';
export interface Contract {
    id: string;
    nKeys: string[];
    title: string;
    completed: boolean;
    description: string;
    createdAt: Date;
    modifiedOn: Date;
};
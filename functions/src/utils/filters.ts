import * as functions from 'firebase-functions';
import { firebase } from '../firebase/fireapp';

export const smsOptout = async (collection: string = 'conversations',
    documentId: string = 'twilio_optout', data?: string) => {
    try {
        let number: string;
        if (data === undefined) number = '+1-234-567-8910';
        else if (data.length === 12 || data[0] !== '+') {
            number = '+1' + data.toString();
        } else number = data.toString();
        const mobiles = firebase.firestore.FieldValue.arrayUnion(number);
        functions.logger.info(`⚡ Initializing (/${collection}/${documentId}/)`);
        const smsOptOutRef = await firebase
            .firestore()
            .collection(collection)
            .doc(documentId)
        await smsOptOutRef.set(
            { mobiles, accessedOn: new Date() }, { merge: true },
        );
    }
    catch (error) {
        functions.logger.error(error);
        return error;
    }
};

/*
export const invalidDomain = async (collection: string = 'configuration',
    documentId: string = 'invalid_email_domains', data?: string) => {
    try {
        const docRef = await firebase
            .firestore()
            .collection(collection)
            .doc(documentId)
            .get()
        if (!docRef.exists) {
            functions.logger.info(
                `⚡ Initializing (/${collection}/${documentId}/)`);
            await firebase
                .firestore()
                .collection(collection)
                .doc(documentId)
                .set(
                    {
                        ...invalid_email_domains,
                        accessedOn: new Date(),
                    }, { merge: true },
                );
        } else if (data !== undefined) {
            const domain = extractDomain(data);
            functions.logger.info(
                `Amending (/${collection}/${documentId}/${domain})`);
            await firebase
                .firestore()
                .collection(collection)
                .doc(documentId)
                .set(
                    {
                        domains: firebase
                            .firestore
                            .FieldValue
                            .arrayUnion(domain), accessedOn: new Date(),
                    }, { merge: true },
                );
        }
    }
    catch (e) {
        functions.logger.error(e);
        return e;
    }
};
*/

export const initializeFilters = async () => {
    await smsOptout('configuration', 'twilio_optout');
};

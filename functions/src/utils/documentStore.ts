import * as moment from 'moment';
import * as functions from 'firebase-functions';
import { firebase, fireapp } from '../firebase';
import { order } from '../utils';

const VERBOSE = false;

export const addEntryByCategory = async (
    collection: string,
    documentId: string,
    category: string,
    entry: string) => {
    try {
        const element = firebase
            .firestore
            .FieldValue
            .arrayUnion(entry);
        const success = await fireapp
            .firestore()
            .collection(collection)
            .doc(documentId)
            .set(
                { [category]: element, accessedOn: new Date(), },
                { merge: true },
            );
        if (success) return success;
        else {
            VERBOSE && functions.logger.warn(`${entry} has been added to ' +
            '"${collection}/${documentId}/${category}/${entry}"`);
            return false;
        }
    } catch (e) {
        functions.logger.error(e); return {
            timestamp: category,
            collection: collection,
            document: documentId,
            entry: entry,
            error: e
        };
    }
};

export const addEntryByTimestamp = async (
    collection: string,
    documentId: string,
    entry: string,
    timestamp: string = moment().format('YYYYMMDD-hhmmss'),
) => {
    try {
        const element = firebase
            .firestore
            .FieldValue
            .arrayUnion(entry);
        const success = await fireapp
            .firestore()
            .collection(collection)
            .doc(documentId)
            .set(
                { [timestamp]: element, accessedOn: new Date(), },
                { merge: true },
            );
        if (success) return success;
        else {
            VERBOSE && functions.logger.warn(`${entry} has been added to ' +
            '"${collection}/${documentId}/${timestamp}/${entry}"`);
            return false;
        }
    } catch (e) {
        functions.logger.error(e); return {
            timestamp: timestamp,
            collection: collection,
            document: documentId,
            entry: entry,
            error: e
        };
    }
};

export const isEntryPresent = async (
    collection: string,
    documentId: string,
    entry: string) => {
    try {
        const snapshot = await fireapp
            .firestore()
            .collection(collection)
            .doc(documentId)
            .get();
        const dateSortedEntries: any[] = [];
        if (snapshot.exists) {
            dateSortedEntries.push(snapshot.data());
            const keys = Array.from(Object.keys(dateSortedEntries[0]))
                .filter((v, i, a) => { return v !== 'accessedOn' }).sort().reverse();
            VERBOSE && functions.logger.info(`isEntryPresent(keys): ${keys}`);
            // eslint-disable-next-line @typescript-eslint/prefer-for-of
            for (let i = 0; i < keys.length; i++) {
                const entries = Array.from(dateSortedEntries[0][keys[i]]).sort();
                VERBOSE && functions.logger.info(`Searching: ${JSON.stringify(entry)} ` +
                    `in ${JSON.stringify(dateSortedEntries[0][keys[i]])}`);
                if (entries.includes(entry)) return true;
                if (typeof entries === 'object') {
                    const strEntry = JSON.stringify(order(entry));
                    if (JSON.stringify(order(dateSortedEntries[0][keys[i]])) === strEntry) return true;
                }
            }
            return false;
        }
    } catch (e) {
        functions.logger.error(e); return undefined;
    }
    return undefined;
};

export const removeFirstEntry = async (
    collection: string,
    documentId: string,
    entry: string) => {
    try {
        const snapshot = await fireapp
            .firestore()
            .collection(collection)
            .doc(documentId)
            .get();
        const dateSortedEntries: any[] = [];
        if (snapshot.exists) {
            dateSortedEntries.push(snapshot.data());
            let entries, success;
            const keys = Array.from(Object.keys(dateSortedEntries[0]))
                .filter((v, i, a) => { return v !== 'accessedOn' }).sort(); // sorted date from oldest => newest            
            // eslint-disable-next-line @typescript-eslint/prefer-for-of
            for (let i = 0; i < keys.length; i++) {
                entries = Array.from(dateSortedEntries[0][keys[i]]); // entries, numbers emails etc
                if (entries.includes(entry)) {
                    const element = firebase
                        .firestore
                        .FieldValue
                        .arrayRemove(entry);
                    success = await fireapp
                        .firestore()
                        .collection(collection)
                        .doc(documentId)
                        .set(
                            { [keys[i]]: element, accessedOn: new Date() },
                            { merge: true },
                        );
                    await removeEmptyTimestamps(collection, documentId);
                    return success;
                }
            }
            return false;
        }
    } catch (e) { functions.logger.error(e); return e; }
    return undefined;
};

export const removeLastEntry = async (
    collection: string,
    documentId: string,
    entry: string) => {
    try {
        const snapshot = await fireapp
            .firestore()
            .collection(collection)
            .doc(documentId)
            .get();
        const dateSortedEntries: any[] = [];
        if (snapshot.exists) {
            dateSortedEntries.push(snapshot.data());
            let entries, success;
            const keys = Array.from(Object.keys(dateSortedEntries[0]))
                .filter((v, i, a) => { return v !== 'accessedOn' }).sort().reverse();
            // eslint-disable-next-line @typescript-eslint/prefer-for-of
            for (let i = 0; i < keys.length; i++) {
                entries = Array.from(dateSortedEntries[0][keys[i]]); // entries, numbers emails etc
                if (entries.includes(entry)) {
                    const element = firebase
                        .firestore
                        .FieldValue
                        .arrayRemove(entry);
                    success = await fireapp
                        .firestore()
                        .collection(collection)
                        .doc(documentId)
                        .set(
                            { [keys[i]]: element, accessedOn: new Date() },
                            { merge: true },
                        );
                    await removeEmptyTimestamps(collection, documentId);
                    return success;
                }
            }
            return false;
        }
    } catch (e) { functions.logger.error(e); return e; }
};

export const removeEmptyTimestamps = async (
    collection: string,
    documentId: string) => {
    try {
        const snapshot = await fireapp
            .firestore()
            .collection(collection)
            .doc(documentId)
            .get();
        const dateSortedEntries: any[] = [];
        if (snapshot.exists) {
            dateSortedEntries.push(snapshot.data());
            const keys = Array.from(Object.keys(dateSortedEntries[0]))
                .filter((v, i, a) => { return v !== 'accessedOn' }).sort();
            for (let i = 0; i < keys.length; i++) {
                const entries = Array.from(dateSortedEntries[0][keys[i]]);
                if (entries.length === 0) {
                    const success = await fireapp
                        .firestore()
                        .collection(collection)
                        .doc(documentId)
                        .set({
                            [keys[i]]: firebase.firestore.FieldValue.delete(),
                            accessedOn: new Date(),
                        }, { merge: true });
                    if (i === keys.length && success) return success;
                }
            }
            return false;
        }
    } catch (e) { functions.logger.error(e); return e; }
};

export const removeEveryEntry = async (
    collection: string,
    documentId: string,
    entry: string) => {
    try {
        const snapshot = await fireapp
            .firestore()
            .collection(collection)
            .doc(documentId)
            .get();
        const dateSortedEntries: any[] = [];
        if (snapshot.exists) {
            dateSortedEntries.push(snapshot.data());
            let found = false;
            let entries;
            const keys = Array.from(Object.keys(dateSortedEntries[0]))
                .filter((v, i, a) => { return v !== 'accessedOn' }).sort().reverse();
            // eslint-disable-next-line @typescript-eslint/prefer-for-of
            for (let i = 0; i < keys.length; i++) {
                entries = Array.from(dateSortedEntries[0][keys[i]]);
                if (entries.includes(entry)) {
                    found = true;
                    const element = firebase
                        .firestore
                        .FieldValue
                        .arrayRemove(entry);
                    await fireapp
                        .firestore()
                        .collection(collection)
                        .doc(documentId)
                        .set(
                            { [keys[i]]: element, accessedOn: new Date() },
                            { merge: true },
                        );
                    if (entries.length === 1)
                        await fireapp
                            .firestore()
                            .collection(collection)
                            .doc(documentId)
                            .set(
                                {
                                    [keys[i]]: firebase.firestore.FieldValue.delete(),
                                    accessedOn: new Date(),
                                },
                                { merge: true },
                            );
                }
            }
            await removeEmptyTimestamps(collection, documentId);
            if (found) return true;
            return false;
        }
    } catch (e) { functions.logger.error(e); return e; }
};

export const countEntries = async (
    collection: string,
    documentId: string,
    entry: string) => {
    try {
        const snapshot = await fireapp
            .firestore()
            .collection(collection)
            .doc(documentId)
            .get();
        const dateSortedEntries: any[] = [];
        const count: any[] = [];
        if (snapshot.exists) {
            dateSortedEntries.push(snapshot.data());
            const keys = Array.from(Object.keys(dateSortedEntries[0]))
                .filter((v, i, a) => { return v !== 'accessedOn' }).sort();
            // eslint-disable-next-line @typescript-eslint/prefer-for-of
            for (let i = 0; i < keys.length; i++) {
                const entries = Array.from(dateSortedEntries[0][keys[i]]);
                const search = entries.filter((v, i, a) => { return v === entry });
                if (search.length > 0) count.push({ [keys[i]]: search.length });
            }
            return count;
        }
    } catch (e) { functions.logger.error(e); return e; }
    return undefined;
};

export const getDocument = async (
    collection: string,
    documentId: string
) => {
    try {
        const docRef = await fireapp
            .firestore()
            .collection(collection)
            .doc(documentId)
            .get();
        const snapshot: any[] = [];
        const timelinePhoneMap: Map<string, string[]> = new Map();
        if (docRef.exists) {
            snapshot.push(docRef.data());
            const keys = Array.from(Object.keys(snapshot[0]))
                .filter((v, i, a) => { return v !== 'accessedOn' }).sort();
            // eslint-disable-next-line @typescript-eslint/prefer-for-of
            for (let i = 0; i < keys.length; i++) {
                const ary: any[] = [];
                snapshot[0][keys[i]].map(i => ary.push(i));
                timelinePhoneMap.set(keys[i], ary);
            }
        }
        return timelinePhoneMap;
    } catch (e) { functions.logger.error(e); return e; }
    return undefined;
};

export const listEntryByTimestamps = async (
    collection: string,
    documentId: string,
    entry: string) => {
    try {
        const snapshot = await fireapp
            .firestore()
            .collection(collection)
            .doc(documentId)
            .get();
        const dateSortedEntries: any[] = [];
        const matchedDates: any[] = [];
        const entries: Map<string, string[]> = new Map();
        if (snapshot.exists) {
            dateSortedEntries.push(snapshot.data());
            const keys = Array.from(Object.keys(dateSortedEntries[0]))
                .filter((v, i, a) => { return v !== 'accessedOn' }).sort();
            const unique = new Set();
            // eslint-disable-next-line @typescript-eslint/prefer-for-of
            for (let i = 0; i < keys.length; i++)
                dateSortedEntries[0][keys[i]].map(i => unique.add(i));
            const uniqueArray = Array.from(unique).filter((v, i, a) => { return v === entry });
            // eslint-disable-next-line @typescript-eslint/prefer-for-of
            for (let j = 0; j < uniqueArray.length; j++) {
                // eslint-disable-next-line @typescript-eslint/prefer-for-of
                for (let i = 0; i < keys.length; i++) {
                    if (Array.from(dateSortedEntries[0][keys[i]]).includes(uniqueArray[j]))
                        matchedDates.push([keys[i]]);
                }
                entries.set(String(uniqueArray[j]), matchedDates);
            }
            return entries;
        }
    } catch (e) { functions.logger.error(e); return e; }
    return undefined;
};

export const listAllEntriesByTimestamp = async (
    collection: string,
    documentId: string,
    entry?: string) => {
    try {
        const snapshot = await fireapp
            .firestore()
            .collection(collection)
            .doc(documentId)
            .get();
        const dateSortedEntries: any[] = [];
        const matchedDates: any[] = [];
        const entries: Map<string, string[]> = new Map();
        if (snapshot.exists) {
            dateSortedEntries.push(snapshot.data());
            const keys = Array.from(Object.keys(dateSortedEntries[0]))
                .filter((v, i, a) => { return v !== 'accessedOn' }).sort();
            const unique = new Set();
            // eslint-disable-next-line @typescript-eslint/prefer-for-of
            for (let i = 0; i < keys.length; i++)
                dateSortedEntries[0][keys[i]].map(i => unique.add(i));
            const uniqueArray = Array.from(unique);
            // eslint-disable-next-line @typescript-eslint/prefer-for-of
            for (let j = 0; j < uniqueArray.length; j++) {
                // eslint-disable-next-line @typescript-eslint/prefer-for-of
                for (let i = 0; i < keys.length; i++) {
                    if (Array.from(dateSortedEntries[0][keys[i]]).sort().includes(uniqueArray[j]))
                        matchedDates.push([keys[i]]);
                }
                entries.set(String(uniqueArray[j]), [...new Set(matchedDates)]);
            }
            return entries;
        }
    } catch (e) { functions.logger.error(e); return e; }
    return undefined;
};

export const countTotalEntries = async (
    collection: string,
    documentId: string) => {
    try {
        const snapshot = await fireapp
            .firestore()
            .collection(collection)
            .doc(documentId)
            .get();
        const dateSortedEntries: any[] = [];
        const count: any[] = [];
        if (snapshot.exists) {
            dateSortedEntries.push(snapshot.data());
            const keys = Array.from(Object.keys(dateSortedEntries[0]))
                .filter((v, i, a) => { return v !== 'accessedOn' }).sort();
            // eslint-disable-next-line @typescript-eslint/prefer-for-of
            for (let i = 0; i < keys.length; i++) {
                const entries = Array.from(dateSortedEntries[0][keys[i]]);
                count.push({ [keys[i]]: entries.length });
            }
            return count;
        }
    } catch (e) { functions.logger.error(e); return e; }
    return undefined;
};

export const elapseTime = (ts: Date, thresh: number = 10) => {
    const elasped: { [x: string]: any } = {};
    elasped.start = moment(ts, 'YYYYMMDD-hhmmss');
    elasped.end = moment(new Date());
    // eslint-disable-next-line import/namespace
    elasped.duration = moment.duration(elasped.end.diff(elasped.start))
    const minutes = Math.floor(elasped.duration.minutes());
    const seconds = Math.floor(elasped.duration.seconds());
    const thresh_seconds = Math.floor(thresh * 60);
    elasped.total_seconds = seconds + (60 * minutes);
    elasped.total_difference = thresh_seconds - elasped.total_seconds;
    return elasped;
};

export const isTimeExpired = (ts: Date, thresh: number = 10) => {
    const elasped = elapseTime(ts, thresh);
    const thresh_seconds = Math.floor(thresh * 60);
    if (elasped.total_seconds > thresh_seconds) {
        VERBOSE && functions.logger.info(`Expired by ${Math.abs(elasped.total_seconds).toFixed(0)}(s) ` +
            `or ${Math.abs(elasped.total_seconds / 60).toFixed(2)}(m).`);
        VERBOSE && functions.logger.info(`User time expired threshold set to ${thresh * 60}(s)/${thresh}(m).`);
        VERBOSE && functions.logger.info(`Elapsed time starting at ` +
            `${moment(elasped.end, 'YYYYMMDD-hhmmss').format('YYYYMMDD-hhmmss')} until ` +
            `${moment(elasped.start, 'YYYYMMDD-hhmmss').format('YYYYMMDD-hhmmss')}` +
            ` a total of ${Math.abs(elasped.total_difference).toFixed(0)}(s) ` +
            `or ${Math.abs(elasped.total_difference / 60).toFixed(2)}(m).`);
        VERBOSE && functions.logger.info(`Time represented as 'YYYYMMDD-hhmmss'.`)
        VERBOSE && functions.logger.info(`Time increments are abbreviated with s/m (seconds/minutes).`);
        return true;
    } else {
        VERBOSE && functions.logger.info(`Within ${thresh * 60} secs by ${elasped.difference} secs.`);
        return false;
    }
}

export const isPhoneWithinTimeWindow = async (
    fb: { collection: string, document: string },
    phone: string,
    active_window: number = 10,
    timestamp?: Date,
) => {
    const report: { [x: string]: any } = {};
    report.ptm = await listAllEntriesByTimestamp(fb.collection, fb.document);
    report.phone = phone;
    report.timestamp = timestamp;
    report.active_window = active_window;

    for (let k of report.ptm.keys()) {
        if (k === report.phone) {
            const t = [...report.ptm.get(k)];
            const l = t[t.length - 1];
            functions.logger.info(`${k} most recently timestamp is ${l}`);
            if (Array.isArray(l) && report.timestamp < moment(l[0], 'YYYYMMDD-hhmmss').toDate())
                report.timestamp = moment(l[0], 'YYYYMMDD-hhmmss').toDate();
        }
    }

    if (report.timestamp) report.expired = isTimeExpired(report.timestamp, report.active_window);
    if (report.expired) functions.logger.info(`${report.phone} was last logged at ${report.timestamp}.`);
}

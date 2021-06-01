import * as fetchOriginal from 'isomorphic-fetch';
// @ts-ignore
import * as fetchRetry from 'fetch-retry';
export default fetchRetry(fetchOriginal) as any;
export const fetch = fetchRetry(fetchOriginal) as any;

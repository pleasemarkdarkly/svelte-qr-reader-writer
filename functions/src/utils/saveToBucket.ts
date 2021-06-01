import { promises as fs } from 'fs';
import * as functions from 'firebase-functions';
import { storage } from '../firebase/fireapp';
import { BLANK, MB, sizeInBytes, randomAlphanumeric } from '../utils';

export const displayFileSize = async (filename: string, data: any) => {
  const sizeOfResult = sizeInBytes(JSON.stringify(data));
  console.log(`${filename}, ${sizeOfResult} bytes, ${(sizeOfResult / MB).toPrecision(4)}% MB`);
};

const VERBOSE = false;

export const saveFileToBucketDebug = async (filename: string, data: any) => {
  try {
    const _data = JSON.stringify(data);
    let _filename = `${randomAlphanumeric(8)}`;
    if (filename !== BLANK) _filename = filename;
    const file = storage.file(_filename);
    const result = file.save(_data).then(async (res: any) => {
      // console.log(`Saved ${filename}, ${file.publicUrl()}\n`);
      await displayFileSize(filename, data);
    });
    VERBOSE && process.stdout.write(`\n 💊 (debug-mode) printing what was written to storage...)`);
    const newfile = await storage.file(`${filename}`).download();
    const medialink = await storage.file(`${filename}`).publicUrl();
    const buffToJson = JSON.parse(newfile.toString());
    VERBOSE && functions.logger.info(`${filename}, ${await displayFileSize(filename, newfile)} ${medialink} ==> ${JSON.stringify(buffToJson)}\n`,);
    return result;
  } catch (e) {
    functions.logger.error(`${e}`);
    return e;
  }
};

export const saveFileToBucket = async (filename: string, data: any) => {
  try {
    let _filename = `${randomAlphanumeric(8)}`;
    if (filename !== undefined) _filename = filename;
    const file = storage.file(_filename);
    const result = file.save(JSON.stringify(data)).then((res: any) => {
      VERBOSE && functions.logger.info(`${filename}, ${file.publicUrl()}\n`);
    });
    await displayFileSize(_filename, data);
    return result;
  } catch (e) {
    functions.logger.error(`${e}`);
    return e;
  }
};

export const downloadFileFromBucket = async (filename: string) => {
  if (filename === undefined) return;
  try {
    const buff = await storage.file(filename).download();
    const buffToJson = JSON.parse(buff.toString());
    await fs.writeFile(filename, JSON.stringify(buffToJson), 'utf-8');
    VERBOSE && functions.logger.info(`${filename} ==> ${JSON.stringify(buffToJson)}`);
  } catch (error) {
    functions.logger.error(`${error}`);
  }
};

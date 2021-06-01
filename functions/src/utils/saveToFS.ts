import * as fs from 'fs';
import * as path from 'path';

export const saveToFilesystem = (input: any, directory: string, filename: string) => {
  try {
    if (!fs.existsSync(directory)) fs.mkdirSync(directory);
    console.info(`Saving => ${JSON.stringify(input)} to ${directory}`);
    const filePath = path.resolve(`${directory}`, `${filename}`);
    const data = typeof input !== 'string' ? JSON.stringify(input) : input;
    fs.appendFileSync(filePath, data);
    return data;
  } catch (error) {
    console.error(`Saving ${filename} to ${directory}, Error:${error}`);
    return error;
  }
};

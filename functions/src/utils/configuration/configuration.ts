import * as functions from 'firebase-functions';
import * as moment from 'moment';
import * as path from 'path';
import { promises as fsp, existsSync, mkdirSync, statSync, readdirSync } from 'fs';
import Bottleneck from 'bottleneck';
import { BLANK, MB, sizeInBytes, makeTime, errorFn, domainFormat } from '..';
import { FIREBASE_STORAGE, firebase, fireapp, storage } from '../../firebase/fireapp';
import { SLACK_CHANNEL, SlackInstrument } from '../../slack';

const PROCESS_EXIT_SUCCESS = 1;

const collection = 'configuration';
const properties = 'properties';
const bucket_folders = ['accounts', 'logs'];

const removeProperty = (object, key) => {
  const { [key]: deletedKey, ...otherKeys } = object;
  return otherKeys;
};

export const uploadtoFirestoreBucket = async (
  filename: string, data) => {
  const sizeOfResult = sizeInBytes(JSON.stringify(data)).toString().slice(-4);
  try {
    if (sizeOfResult === 4)
      throw `Provided data of ${filename} appears to be empty`;
    const fileData = JSON.stringify(data);
    const file = storage.file(filename);
    return file.save(fileData).then((res: any) => {
      functions.logger.info(`Uploaded => ${filename} ` +
        `(${sizeOfResult} b/${(sizeOfResult / MB).toFixed(4)}% MB) ` +
        `=> 🔥 ${FIREBASE_STORAGE}`);
      return res;
    });
  } catch (e) {
    errorFn(e);
    functions.logger.error(e);
    return e;
  }
};

export class Configuration {
  private static default_document_keys = { document_keys: ['properties'] };
  public static default_configuration = {
    ...Configuration.default_document_keys,
    rate: {
      limiters: {
        apicalls: {
          seconds: 86400,
          rate: 13824, // 16 per 100 secs
          type: 'quota',
        },
        dailyread: {
          seconds: 86400,
          rate: 4320000, // 5000 per 100 secs
          type: 'quota',
        },
        dailywrite: {
          seconds: 86400,
          rate: 68800, // 80 per 100 secs
          type: 'quota',
        },
      },
    },
    functions: {
      max_duration: 540,
      min_duration: 60,
    },
  };

  public static Initialize = async () => {
    try {
      const success = await fireapp
        .firestore()
        .collection(collection)
        .doc(properties)
        .set(
          {
            ...Configuration.default_configuration,
            accessedOn: new Date(),
          },
          { merge: true },
        );

      if (success) return success;
    } catch (error) {
      functions.logger.error(error);
      return error;
    }
  };

  public static Update = async configuration => {
    try {
      if (configuration === undefined) return null;
      const success = await fireapp
        .firestore()
        .collection(collection)
        .doc(properties)
        .set(
          {
            ...configuration,
            accessedOn: new Date(),
          },
          { merge: true },
        );
      if (success) return success;
    } catch (error) {
      functions.logger.error(error);
      return error;
    }
  };

  public static Get = async () => {
    try {
      const config = await fireapp
        .firestore()
        .collection(collection)
        .doc(properties)
        .get();
      if (config.exists) return config.data();
      return undefined;
    } catch (error) {
      functions.logger.error(error);
      return error;
    }
  };

  public static Set = async keyValue => {
    try {
      const success = await fireapp
        .firestore()
        .collection(collection)
        .doc(properties)
        .set(
          {
            ...keyValue,
            accessedOn: new Date(),
          },
          { merge: true },
        );
      if (success) return success;
    } catch (error) {
      functions.logger.error(error);
      return error;
    }
  };

  public static RemoveProperty = async (property: string) => {
    try {
      const config = await Configuration.Get();
      if (config === undefined) return null;
      if (Object.keys(config).includes(property)) {
        const clone = removeProperty(config, property);
        let success = await fireapp
          .firestore()
          .collection(collection)
          .doc(properties)
          .delete();
        success = await fireapp
          .firestore()
          .collection(collection)
          .doc(properties)
          .set({
            ...clone,
            accessedOn: new Date(),
          });
        if (success) return success;
      } else {
        functions.logger.warn(`Configuration RemoveProperty could not find ${property} to remove.`);
        return null;
      }
    } catch (error) {
      functions.logger.error(error);
      return error;
    }
  };

  public static getDocuments = async () => {
    try {
      const config = await Configuration.Get();
      if (config !== undefined && config.hasOwnProperty('document_keys')) {
        return config.document_keys;
      }
      return null;
    } catch (e) {
      functions.logger.info(e);
      return e;
    }
  };

  public static getDocument = async (documentId: string) => {
    try {
      const config = await fireapp
        .firestore()
        .collection('configuration')
        .doc(documentId)
        .get();
      if (config.exists) return config.data();
      return null;
    } catch (e) {
      functions.logger.error(e);
      return e;
    }
  };

  public static addDocument = async (document: string, data?) => {
    try {
      const config = await Configuration.Get();
      if (config) {
        const documents = firebase
          .firestore
          .FieldValue
          .arrayUnion(document);
        let success = await Configuration.Set({ document_keys: documents });
        if (success) {
          if (data === undefined) return success;
          success = await fireapp
            .firestore()
            .collection('configuration')
            .doc(document)
            .set({ ...data, accessedOn: new Date() }, { merge: true });
        }
        if (success) return success;
      } else {
        return null;
      }
    } catch (error) {
      functions.logger.error(error);
      return error;
    }
  };

  public static Document = async (documentId: string, data) => {
    try {
      const newContent = await Configuration.getDocument(documentId);
      if (newContent === null) {
        const contents = {
          data: [data],
        };
        await Configuration.addDocument(documentId, contents);
      } else {
        newContent.data.push(data);
        await Configuration.updateDocument('skiptraces', newContent);
      }
    } catch (e) {
      functions.logger.error(e);
      return e;
    }
  };

  public static updateDocument = async (documentId: string, data) => {
    try {
      if (await Configuration.getDocument(documentId)) {
        const merge = firebase.firestore.FieldValue.arrayUnion(data);
        const success = await fireapp
          .firestore()
          .collection('configuration')
          .doc(documentId)
          .set(
            {
              merge,
              accessedOn: new Date(),
            },
            { merge: true },
          );
        if (success) return success;
      } else {
        return null;
      }
    } catch (error) {
      functions.logger.error(error);
      return error;
    }
  };

  public static exportConfigurations = async () => {
    try {
      functions.logger.info(`🦉 Application Bucket Connected => 🔥 ${FIREBASE_STORAGE}`);
      const exportPath = `configuration/${moment().format('YYYYMMDD')}`;
      const backup = await fireapp
        .firestore()
        .collection('configuration')
        .get();
      const backup_documents = new Map();
      if (!backup.empty) {
        backup.forEach(async qsd => {
          backup_documents.set(qsd.id, qsd.data());
          const data = JSON.stringify(qsd.data());
          const fileRef = await storage.file(exportPath + '/' + qsd.id + '.json');
          await fileRef.save(data);
          const sizeOfResult = sizeInBytes(JSON.stringify(data)).toFixed(4);
          functions.logger.info(
            `Sucessfully exported => ` +
            `${exportPath}/${qsd.id} ` +
            `${sizeOfResult} bytes/${(sizeOfResult / MB).toFixed(4)}(%)MB`,
          );
        });
      }
    } catch (e) {
      functions.logger.error(e);
      return e;
    }
  };


  public static export = async () => {
    try {
      functions.logger.info(`🦉 Application Bucket Connected => 🔥 ${FIREBASE_STORAGE}`);
      const config = await Configuration.Get();
      if (config) {
        functions.logger.info(`Configuration Documents to Backup (🔑):`, config.document_keys);
        if (config.document_keys.length <= 0) throw Error(`Configuration export document keys error.`);
        const documents = config.document_keys;
        const exportPath = collection;
        documents.forEach(async d => {
          const backup = await fireapp
            .firestore()
            .collection(collection)
            .doc(d)
            .get();
          if (backup) {
            const data = JSON.stringify(backup.data());
            const fileRef = await storage.file(exportPath + '/' + d + '.json');
            await fileRef.save(data);
            const sizeOfResult = sizeInBytes(JSON.stringify(data)).toFixed(4);

            functions.logger.info(
              `Sucessfully exported => ` +
              `${exportPath}/${d} ` +
              `${sizeOfResult} bytes/${(sizeOfResult / MB).toFixed(4)}(%)MB`,
            );

          } else {
            functions.logger.warn(`Configuration export backup for document:${d} encountered an error.`);
          }
        });
      }
    } catch (e) {
      functions.logger.error(e);
      return e;
    }
  };

  public static export_config_collection = async () => {
    try {
      functions.logger.info(`🦉 Application Bucket Connected => 🔥 ${FIREBASE_STORAGE}`);
      const config = await Configuration.Get();
      if (config) {
        functions.logger.info(`Configuration Documents to Backup (🔑):`, config.document_keys);
        if (config.document_keys.length <= 0) throw Error(`Configuration export document keys error.`);
        const documents = config.document_keys;
        const exportPath = collection;
        documents.forEach(async d => {
          const backup = await fireapp
            .firestore()
            .collection(collection)
            .doc(d)
            .get();
          if (backup) {
            const data = JSON.stringify(backup.data());
            const fileRef = await storage.file(exportPath + '/' + d + '.json');
            await fileRef.save(data);
            const sizeOfResult = sizeInBytes(JSON.stringify(data)).toFixed(4);

            functions.logger.info(
              `Sucessfully exported => ` +
              `${exportPath}/${d} ` +
              `${sizeOfResult} bytes/${(sizeOfResult / MB).toFixed(4)}(%)MB`,
            );

          } else {
            functions.logger.warn(`Configuration export backup for document:${d} encountered an error.`);
          }
        });
      }
    } catch (e) {
      functions.logger.error(e);
      return e;
    }
  };

  public static import = async (importPath: string = 'configuration'): Promise<any> => {
    try {
      const [files] = await storage.getFiles();
      let filename: string;
      const mediaLinks: { filename: string; url: string }[] = [];

      files.forEach(file => {
        filename = file.name;
        if (filename.indexOf('.json') !== -1 && filename.indexOf(`${importPath}/`) !== -1)
          mediaLinks.push({ filename, url: file.metadata.mediaLink });
      });

      const estimatedTime = ((86400 / 68800) * mediaLinks.length).toFixed(4);
      const estimatedTimeMinutes = (((86400 / 68800) * mediaLinks.length) / 60).toFixed(4);

      const limiter = new Bottleneck({
        maxConcurrent: 1,
        minTime: 1255, // => 86400/68800 = 1.255813
      });

      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let i = 0; i < mediaLinks.length; i++) {
        const buff = await storage.file(mediaLinks[i].filename).download();
        const buffToJson = buff.toString();
        const file = JSON.parse(buffToJson);
        const sizeOfResult = sizeInBytes(JSON.stringify(file)).toString().slice(-4);
        const docId = mediaLinks[i].filename.replace(`${importPath}/`, BLANK).replace('.json', BLANK).trim();
        if (docId !== undefined) {
          await limiter.schedule(async () => {
            try {
              const writeResult = await fireapp
                .firestore()
                .collection('configuration')
                .doc(docId)
                .set(file, {
                  merge: true,
                });
              functions.logger.info(
                `🦉 Application Bucket Connected => 🔥 ${FIREBASE_STORAGE}` +
                `Ingesting approx. ${mediaLinks.length} files into 🔥 Firestore Application Configuration. ` +
                `Est. time adj. for rate-limiting ~${estimatedTime} secs./ ~${estimatedTimeMinutes} mins.`
              );
              functions.logger.info(
                `Sucessfully restored =>` +
                `${importPath}/${docId} ` +
                `${sizeOfResult} bytes/${(sizeOfResult / MB).toFixed(4)}%MB`,
              );
              return writeResult;
            } catch (error) {
              functions.logger.error(error);
              return error;
            }
          });
        }
      }
    } catch (e) {
      functions.logger.error(e);
      return e;
    }
  };

  public static hasRecentConfiguration = async (importPath: string = 'configuration'): Promise<any> => {
    let rsTime, fsTime;
    try {
      const [files] = await storage.getFiles();
      let filename: string;
      const mediaLinks: { filename: string; url: string }[] = [];
      files.forEach(file => {
        filename = file.name;
        if (!bucket_folders.includes(filename)) {
          if (filename.indexOf('.json') !== -1 && filename.indexOf(`${importPath}/`) !== -1) {
            mediaLinks.push({ filename, url: file.metadata.mediaLink });
          }
        }
      });

      const estimatedTime = ((86400 / 68800) * mediaLinks.length).toFixed(4);
      const estimatedTimeMinutes = (((86400 / 68800) * mediaLinks.length) / 60).toFixed(4);

      functions.logger.info(
        `Downloading approx. ${mediaLinks.length} files from ${FIREBASE_STORAGE} to 🔥 Firestore App Configuration. ` +
        `(Est. time adj. for rate-limiting ~${estimatedTime} secs./ ~${estimatedTimeMinutes} mins.)`,
      );

      if (mediaLinks.length !== null) {
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < mediaLinks.length; i++) {
          const buff = await storage.file(mediaLinks[i].filename).download();
          const buffToJson = buff.toString();
          const file = JSON.parse(buffToJson);
          const sizeOfResult = sizeInBytes(JSON.stringify(file)).toString().slice(-4);
          const docId = mediaLinks[i].filename.replace(`${importPath}/`, BLANK).replace('.json', BLANK).trim();

          if (docId !== undefined) {
            if (docId === 'properties') {
              if (file.hasOwnProperty('accessedOn')) {
                const { _seconds, _nanoseconds } = file.accessedOn;
                rsTime = makeTime({ _seconds, _nanoseconds });
                functions.logger.info(
                  `💾 Checking the date of the Restored Configuration => ` +
                  `${importPath}/${docId} ` +
                  `${rsTime} ` +
                  `${sizeOfResult} bytes/${(sizeOfResult / MB).toFixed(4)}%MB`,
                );
              }
            }
          }
        }
      }
    } catch (e) {
      if (e.message.includes('undefined')) {
        functions.logger.error(`Configuration has not been backed up to storage. (Error:${e})`);
      }
      await Configuration.export();
    }

    try {
      const config = await Configuration.Get();
      if (config !== undefined) {
        if (config.hasOwnProperty('accessedOn')) {
          const { _seconds, _nanoseconds } = config.accessedOn;
          fsTime = makeTime({ _seconds, _nanoseconds });
          functions.logger.info(`🔥 Checking the date of the Firestore 'property.accessedOn'  => `, fsTime);
        }
      }
    } catch (e) {
      if (e.message.includes('undefined')) {
        functions.logger.error(`Configuration collection does not exist.`);
        // functions.logger.error(e);
      }
    };

    fsTime - rsTime
      ? functions.logger.info(`🔥 has the latest timestamp.`)
      : functions.logger.info(`${FIREBASE_STORAGE} has the latest timestamp.`);
    return {
      bucket: rsTime,
      firestore: fsTime,
    };
  };

  public static DownloadConfiguration = async () => {
    try {
      const mediaLinks: { filename: string; url: string }[] = [];
      let filename: string;
      const [files] = await storage.getFiles();
      files.forEach(file => {
        filename = file.name;
        if (filename.indexOf('configuration') !== -1) {
          process.stdout.write(`${filename}\n`);
          mediaLinks.push({ filename, url: file.metadata.mediaLink });
        }
      });

      for (const data of Object.values(mediaLinks)) {
        functions.logger.info(`${data.filename} to be downloaded from bucket...`);
        const buff = await storage.file(data.filename).download();
        const buffToJson = buff.toString();
        try {
          const file = JSON.parse(buffToJson);
          filename = data.filename.trim();
          const directory = filename.slice(0, filename.indexOf('/'));
          functions.logger.info(`Directory:${directory} will be created if it doesn't already exist.`);
          if (!(await existsSync(directory))) mkdirSync(directory);
          functions.logger.info(
            `Total files to be ${mediaLinks.length} downloaded` +
            `...estimated ingest time ${mediaLinks.length / 60} minutes. ` +
            `Downloading....${filename} to ${directory}.`
          );
          if (file) {
            // eslint-disable-next-line no-void
            void (await fsp.writeFile(filename, buffToJson, 'utf8'));
          }
        } catch (e) {
          return e;
        }
      }
      return;
    } catch (error) {
      functions.logger.error(`${`🤮  ${error}`}`);
      return error;
    }
  };

  public static UploadConfiguration = async () => {
    let filePath: string;
    const directoryPath = path.join('configuration');
    functions.logger.info(`🦄 Scanning directory:${directoryPath} for application files...`);
    try {
      const files = await readdirSync(directoryPath);
      const EXT = '.json';
      const configurationFiles = files.filter(function (file) {
        return path.extname(file).toLowerCase() === EXT;
      });

      functions.logger.info(
        `🦄 Directory:${directoryPath} found ${configurationFiles.length} files. ` +
        `Uploading application configuration.`,
      );

      for (const file of configurationFiles) {
        filePath = path.resolve(directoryPath, file);
        const fileSize = await statSync(filePath, { bigint: true }).size;
        functions.logger.info(
          `🦄 Directory:${directoryPath} found ${configurationFiles.length} files. ` +
          `Uploading application configuration.  ` +
          `📓 Reading ${file}/${filePath} (${fileSize} bytes)  `
        );
        const fileData = JSON.parse(await fsp.readFile(filePath, { encoding: 'utf8' }));
        await uploadtoFirestoreBucket('/configuration-backup/' + file, fileData);
      }
      process.exit(PROCESS_EXIT_SUCCESS);
    } catch (e) {
      functions.logger.info(`🤮 💩 Possible Error with ${directoryPath}, Error:${e}`);
      return e;
    }
  };
}

export const SetupAppConfiguration = async () => {
  const notify = new SlackInstrument(`🛠  Setting up Application Configuration`);
  functions.logger.info(`🛠  Setting up Application Configuration`);
  try {
    // await Configuration.Initialize();
    const configuration = await Configuration.Get();
    if (configuration) {
      if (configuration.hasOwnProperty('accessedOn') &&
        configuration.hasOwnProperty('document_keys')) {
        functions.logger.info(`Configuration properties (🔑):`);
        console.info(Object.keys(configuration));
        await notify.add(`${Object.keys(configuration)}`);
        console.info(configuration);
        await notify.add(`${configuration}`);
        await notify.send(SLACK_CHANNEL.DEBUG);
      }
    }
  } catch (e) {
    functions.logger.error(e);
    await notify.send(SLACK_CHANNEL.DEBUG, `SetupAppConfiguration encountered an error.`);
  }
  // await TestManipulatingConfigurationDocument();
};

const config_documents = [
  'properties',
  'twilio_webhook_errors',
  'invalid_email_domains',
  'sendgrid_errors',
  'sendgrid_filter',
  'sendgrid_open',
];

export const conversation_documents = [
  'twilio',
  'twilio_optout',
  'sendgrid_filter',
  'sendgrid_webhook_events',
];

export const SetupDocuments = async () => {
  try {
    config_documents.forEach(async d => {
      await Configuration.addDocument(d, '');
    });
  } catch (e) {
    functions.logger.error(e);
    return e;
  }
};

const invalid_email_domains = [];

export const TestManipulatingConfigurationDocument = async () => {
  try {
    functions.logger.info(`Example Adding/Removing Application Document`);
    await Configuration.addDocument('invalid_email_domains', invalid_email_domains);
    const document = await Configuration.getDocument('invalid_email_domains');
    document.domains.push(`hottttmail.com`);
    document.domains.forEach(d => {
      if (domainFormat.test(d)) {
        process.stdout.write(`[X] `);
      } else {
        process.stdout.write(`[ ] `);
      }
      process.stdout.write(`${d}\n`);
    });
    await Configuration.updateDocument('invalid_email_domains', document);
    console.log(document.domains);
    await Configuration.export();
  } catch (e) {
    functions.logger.error(e);
    return e;
  }
};

export const createDirectories = pathname => {
  const __dirname = path.resolve();
  // eslint-disable-next-line no-param-reassign
  pathname = pathname.replace(/^\.*\/|\/?[^\/]+\.[a-z]+|\/$/g, '');
  // Remove leading directory markers, and remove ending /file-name.extension
  try {
    mkdirSync(path.resolve(__dirname, pathname));
  } catch (e) {
    functions.logger.error(e);
    return e;
  }
};

export const TestDownloadUploadConfiguration = async () => {
  await Configuration.DownloadConfiguration();
  // await Configuration.UploadConfiguration();
};

// eslint-disable-next-line no-void
void (async () => {
  // await Configuration.Initialize();
  const configuration = await Configuration.Get();
  if (!configuration) {
    await SetupAppConfiguration();
  } else {
    const timestamp = await Configuration.hasRecentConfiguration();
    timestamp.bucket - timestamp.firestore
      ? functions.logger.info(`🔥 Firestore Config has the most recent timestamp`)
      : functions.logger.info(`Firestore Storage Config has the most recent timestamp.`);
  }
  await SetupDocuments();
  // await initializeFilters();
  // await TestManipulatingConfigurationDocument();
  // await Configuration.export();
  // await TestDownloadUploadConfiguration();
  // await evaluateIngestConfiguration();
});

void (async () => { await Configuration.exportConfigurations(); });
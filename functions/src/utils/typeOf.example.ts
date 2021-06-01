import * as moment from 'moment';
import * as functions from 'firebase-functions';
import { type } from './system';

const VERBOSE = true;

export const useCall = (object: Object) => {
    return Object.prototype.toString.call(object).split(' ')[1].replace(/]/, '').toLowerCase();
}

export const typeOfExamples = () => {
    process.stdout.write('\n');
    console.log(`typeof null (typeof doesn't work)=> ${typeof null}`);
    console.log(`Object.prototype.toString.call... null => ` +
        `${Object.prototype.toString.call(null).split(' ')[1].replace(/]/, '').toLowerCase()}`);
    process.stdout.write('\n');
    console.log(`Object.prototype.toString.call...undefined => ` +
        `${Object.prototype.toString.call(undefined).split(' ')[1].replace(/]/, '').toLowerCase()}`);
    console.log(`typeof undefined => ${typeof undefined}`);
    process.stdout.write('\n');
    console.log(`typeof [] => ${type([])}`);
    console.log(`typeof {} => ${type({})}`);
    // console.log(`typeof function(){} => ${type(function () { })}`);
    console.log(`typeof 123 => ${type(12345)}`);
    // console.log(`typeof new Number(123) => ${type(new Number(12345))}`);
    console.log(`typeof /some_regex/ => ${type(/some_regex/)}`);
    console.log(`typeof Symbol => ${type(Symbol('Symbolic'))}`);
    process.stdout.write('\n');
};

export const exampleUsage = () => {
    VERBOSE && functions.logger.info(`Examples of functions/use of typeOf`);

    typeOfExamples();

    const functionPromise = () => new Promise((resolve, reject) => setTimeout(() => resolve({}), 1000));
    const functionAsync = async () => ({});

    VERBOSE && console.log('functionPromise', Object.prototype.toString.call(functionPromise))
    VERBOSE && console.log('functionAsync', Object.prototype.toString.call(functionAsync))
    VERBOSE && console.log(`${Object.prototype.toString.call(null).split(' ')[1].replace(/]/, '').toLowerCase()}`);
};

(async () => {

    const thisFileName = __filename.split('/')[__filename.split('/').length - 1];
    functions.logger.info(`${moment().format('YYYYMMDD-hhmmssSS')} ${thisFileName}...`);

});
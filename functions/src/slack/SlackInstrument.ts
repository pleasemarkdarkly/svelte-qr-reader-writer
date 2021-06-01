import * as functions from 'firebase-functions';
import Bottleneck from 'bottleneck';
import { BLANK, SPACE } from '../utils/index';
import { SLACK_CHANNEL, SendSlackMessage } from '.';

const DEBUG_OUTPUT = 'functions';
const DEFAULT_WRITE_RATE = 900;
export class SlackInstrument {
  // blackout_hours = [1, 2, 3, 4, 5, 6, 19, 20, 21, 22, 23, 24];
  blackout_hours = [1, 2];
  start;
  end;
  message: string;

  constructor(name: string) {
    this.start = new Date().getTime();
    this.message = `[${name}] `;
    process.stdout.write(`${this.message}\n`);
  };

  public add = async (msg: string) => {
    this.message = this.message + msg + SPACE + '|' + SPACE;
  };

  public send = async (channel: SLACK_CHANNEL, msg?: string) => {
    const now = new Date();
    this.end = now.getTime();
    const duration = this.end - this.start;
    if (msg !== undefined) this.message += msg + SPACE + '|';
    // eslint-disable-next-line max-len
    this.message += ` start (${this.start.toString().slice(-4)}ms) - end: (${this.end
      .toString()
      .slice(-4)}ms) => completed in ${duration.toString().slice(-4)} ms`;
    this.message += ` (${this.message.length} chars)`;
    this.message = this.message.replace('00:00:00 GMT+0000 (Coordinated Universal Time)', '');
    if (this.blackout_hours.includes(now.getHours())) {
      functions.logger.info(`Blackout hours enabled, disabling sending to Slack.`);
      functions.logger.info(this.message);
    } else {
      functions.logger.info(`Blackout hours disabled, sending instrument data to Slack.`);
      const limiter = new Bottleneck({ maxConcurrent: 1, minTime: DEFAULT_WRITE_RATE });
      await limiter.schedule(async () => {
        await SendSlackMessage(channel, this.message);
      });
    }
  };

  public alert = async (title: string = BLANK, body: string = BLANK) => {
    let t: string = title ?? BLANK;
    let m: string = body ?? BLANK;
    title === undefined || title.length === 0 ? (t = 'Alert') : (t = title);
    body === undefined || body.length === 0 ? (m = this.message) : (m = body + ' (' + this.message + ')');
    m += ` (${this.message.length} characters)`;
    if (DEBUG_OUTPUT === 'functions') functions.logger.warn(t);
    if (DEBUG_OUTPUT === 'functions') functions.logger.warn(m);
  };
};

export = pushover_notifications;
declare class pushover_notifications {
  constructor(opts: any);
  errors(d: any, res: any): void;
  send(obj: any, fn: any): void;
  updateSounds(): void;
}

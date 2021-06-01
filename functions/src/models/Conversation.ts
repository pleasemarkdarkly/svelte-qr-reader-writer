export interface Message {
  address: string;
  personId: string;
  inboundOrOutbound: 'inbound' | 'outbound';
  smsOrEmail: 'email' | 'sms';
  raw?: any;
  content?: string;
  date: Date;
  humanParseNeeded: boolean;
  afinn?: number;
  protocolResponse: any;
};

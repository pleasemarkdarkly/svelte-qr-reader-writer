export interface TwilioResponse {
    'from': string,
    'to': string,
    'body': string,
    'sid': string,
    'dateSent': string,
    'dateCreated': string,
    'errorCode': string,
    'messagingServiceSid': string,
    'numSegments': string,
    'direction': string,
    'dateUpdated': string,
    'price': string,
    'errorMessage': string,
    'uri': string,
    'accountSid': string,
    'numMedia': string,
    'status': string,
    'priceUnit': string,
    'apiVersion': string,
    'subresourceUris': string,
};

// https://www.twilio.com/docs/usage/troubleshooting/debugging-event-webhooks
export interface TwilioError {
    'ParentAccountSid'?: string,
    'Payload'?: {
        'resource_sid'?: string,
        'service_sid'?: string,
        'error_code'?: string,
    },
    'Level'?: string,
    'Timestamp'?: Date,
    'PayloadType'?: string,
    'AccountSid'?: string,
    'Sid'?: string,    
    'to'?: string,
};

export interface TwilioStatus {
    'status': string,
    'code': string,
    'moreInfo': string,
};

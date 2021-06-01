
export interface SendgridEvent {
    attempt: string;
    email: string;
    event: string;
    ip: string;
    response: string;
    sg_event_id: string;
    sg_message_id: string;
    sg_template_id: string;
    sg_template_name: string;
    'smtp-id': string;
    timestamp: string;
    tls: string;
};

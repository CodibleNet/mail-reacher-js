import { MailReacher, type MailReacherOptions, type MailReacherRecipient, type SendEmailInput } from '@mail-reacher/sdk';

export interface MailReacherTransportOptions extends MailReacherOptions {}

export interface NodemailerMailOptions {
  to?: AddressLike;
  cc?: AddressLike;
  bcc?: AddressLike;
  from?: AddressLike;
  replyTo?: AddressLike;
  subject?: string;
  html?: string | Buffer;
  text?: string | Buffer;
  headers?: Record<string, string>;
}

export interface NodemailerTransportCallback {
  (error: Error | null, info?: { envelope: unknown; messageId: string | number }): void;
}

type AddressLike = string | string[] | { address?: string; name?: string } | Array<string | { address?: string; name?: string }>;

export function mailReacherTransport(options: MailReacherTransportOptions) {
  const client = new MailReacher(options);

  return {
    name: 'MailReacher',
    version: '0.1.0',
    async send(mail: { data: NodemailerMailOptions }, callback: NodemailerTransportCallback): Promise<void> {
      try {
        const payload = toSendEmailInput(mail.data);
        const response = await client.emails.send(payload);

        callback(null, {
          envelope: {
            from: payload.from,
            to: payload.to,
          },
          messageId: response.data.id,
        });
      } catch (error) {
        callback(error instanceof Error ? error : new Error(String(error)));
      }
    },
  };
}

function toSendEmailInput(mail: NodemailerMailOptions): SendEmailInput {
  const to = normalizeAddress(mail.to);

  if (!to) {
    throw new Error('Nodemailer message is missing a recipient. Set the `to` field.');
  }

  const input: SendEmailInput = { to };
  const cc = normalizeAddressList(mail.cc);
  const bcc = normalizeAddressList(mail.bcc);
  const from = firstAddress(mail.from);
  const replyTo = firstAddress(mail.replyTo);
  const html = bufferToString(mail.html);
  const text = bufferToString(mail.text);

  if (cc) {
    input.cc = cc;
  }

  if (bcc) {
    input.bcc = bcc;
  }

  if (from) {
    input.from = from;
  }

  if (replyTo) {
    input.replyTo = replyTo;
  }

  if (mail.subject) {
    input.subject = mail.subject;
  }

  if (html) {
    input.html = html;
  }

  if (text) {
    input.text = text;
  }

  if (mail.headers) {
    input.metadata = mail.headers;
  }

  return input;
}

function normalizeAddress(value: AddressLike | undefined): MailReacherRecipient | MailReacherRecipient[] | undefined {
  const recipients = normalizeAddressList(value);

  if (!recipients) {
    return undefined;
  }

  if (recipients.length === 1) {
    return recipients[0] as MailReacherRecipient;
  }

  return recipients;
}

function normalizeAddressList(value: AddressLike | undefined): MailReacherRecipient[] | undefined {
  if (!value) {
    return undefined;
  }

  const values = Array.isArray(value) ? value : [value];

  return values.map((address) => {
    if (typeof address === 'string') {
      return address;
    }

    return address.name
      ? { email: address.address ?? '', name: address.name }
      : { email: address.address ?? '' };
  });
}

function firstAddress(value: AddressLike | undefined): string | undefined {
  const normalized = normalizeAddressList(value)?.[0];

  if (!normalized) {
    return undefined;
  }

  return typeof normalized === 'string' ? normalized : normalized.email;
}

function bufferToString(value: string | Buffer | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  return Buffer.isBuffer(value) ? value.toString('utf8') : value;
}

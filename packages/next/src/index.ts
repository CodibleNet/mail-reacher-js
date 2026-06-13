import { MailReacher, type MailReacherOptions, type SendEmailInput } from '@mail-reacher/sdk';

export type NextMailReacherOptions = Partial<MailReacherOptions> & {
  apiKey?: string;
};

export interface NextMailReacher {
  client: MailReacher;
  sendEmail: (input: SendEmailInput) => Promise<unknown>;
  sendTemplate: (input: SendTemplateInput) => Promise<unknown>;
}

export type SendTemplateInput = Omit<SendEmailInput, 'html' | 'templateId'> & {
  templateId: string | number;
};

export function createMailReacher(options: NextMailReacherOptions = {}): NextMailReacher {
  assertServerOnly();

  const client = new MailReacher({
    ...options,
    apiKey: options.apiKey ?? readEnvApiKey(),
  });

  return {
    client,
    sendEmail: (input) => client.emails.send(input),
    sendTemplate: (input) => client.emails.send(input),
  };
}

function readEnvApiKey(): string {
  const apiKey = process.env.MAILREACHER_API_KEY;

  if (!apiKey) {
    throw new Error('Missing MAILREACHER_API_KEY. Add it to your server environment.');
  }

  return apiKey;
}

function assertServerOnly(): void {
  if (typeof window !== 'undefined') {
    throw new Error('@mail-reacher/next must only be used server-side. Do not expose MAILREACHER_API_KEY to the browser.');
  }
}

import { MailReacher, type MailReacherOptions, type SendEmailInput } from '@mail-reacher/sdk';

export type TanStackStartMailReacherOptions = Partial<MailReacherOptions> & {
  apiKey?: string;
};

export function createMailReacher(options: TanStackStartMailReacherOptions = {}) {
  const client = new MailReacher({
    ...options,
    apiKey: options.apiKey ?? readEnvApiKey(),
  });

  return {
    client,
    sendEmail: (input: SendEmailInput) => client.emails.send(input),
    sendTemplate: (input: Omit<SendEmailInput, 'html' | 'templateId'> & { templateId: string | number }) => client.emails.send(input),
  };
}

function readEnvApiKey(): string {
  const apiKey = process.env.MAILREACHER_API_KEY;

  if (!apiKey) {
    throw new Error('Missing MAILREACHER_API_KEY. Add it to your server environment.');
  }

  return apiKey;
}

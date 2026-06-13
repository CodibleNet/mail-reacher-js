export type MailReacherRecipient = string | {
  email: string;
  name?: string;
};

export type MailReacherMetadata = Record<string, string | number | boolean | null | string[] | number[]>;
export type MailReacherVariables = Record<string, string | number | boolean | null>;

export interface SendEmailInput {
  to: MailReacherRecipient | MailReacherRecipient[];
  cc?: MailReacherRecipient[];
  bcc?: MailReacherRecipient[];
  from?: string;
  fromEmail?: string;
  fromName?: string;
  replyTo?: string;
  subject?: string;
  html?: string;
  text?: string;
  templateId?: string | number;
  variables?: MailReacherVariables;
  metadata?: MailReacherMetadata;
}

export interface MailReacherEmailLog {
  id: string | number;
  to_email?: string;
  from_email?: string;
  subject?: string;
  status?: string;
  created_at?: string;
  [key: string]: unknown;
}

export interface SendEmailResponse {
  data: MailReacherEmailLog;
}

export interface MailReacherOptions {
  apiKey: string;
  baseUrl?: string;
  fetch?: typeof fetch;
}

export class MailReacherError extends Error {
  public readonly status: number;
  public readonly body: unknown;

  public constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = 'MailReacherError';
    this.status = status;
    this.body = body;
  }
}

export class MailReacher {
  public readonly emails: {
    send: (input: SendEmailInput) => Promise<SendEmailResponse>;
  };

  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly fetcher: typeof fetch;

  public constructor(options: MailReacherOptions) {
    if (!options.apiKey) {
      throw new Error('Mail Reacher apiKey is required. Set MAILREACHER_API_KEY on the server.');
    }

    this.apiKey = options.apiKey;
    this.baseUrl = (options.baseUrl ?? 'https://mail-reacher.com').replace(/\/$/, '');
    this.fetcher = options.fetch ?? fetch;
    this.emails = {
      send: (input) => this.sendEmail(input),
    };
  }

  private async sendEmail(input: SendEmailInput): Promise<SendEmailResponse> {
    return this.request<SendEmailResponse>('/api/emails/send', {
      method: 'POST',
      body: JSON.stringify(toApiPayload(input)),
    });
  }

  private async request<T>(path: string, init: RequestInit): Promise<T> {
    const response = await this.fetcher(`${this.baseUrl}${path}`, {
      ...init,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
        ...init.headers,
      },
    });

    const body = await readJson(response);

    if (!response.ok) {
      throw new MailReacherError(extractErrorMessage(body, response.status), response.status, body);
    }

    return body as T;
  }
}

export function toApiPayload(input: SendEmailInput): Record<string, unknown> {
  return compact({
    to: input.to,
    cc: input.cc,
    bcc: input.bcc,
    from: input.from,
    from_email: input.fromEmail,
    from_name: input.fromName,
    reply_to: input.replyTo,
    subject: input.subject,
    html: input.html,
    text: input.text,
    template_id: input.templateId,
    variables: input.variables,
    metadata: input.metadata,
  });
}

function compact(payload: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined),
  );
}

async function readJson(response: Response): Promise<unknown> {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

function extractErrorMessage(body: unknown, status: number): string {
  if (typeof body === 'object' && body !== null && 'message' in body) {
    const message = (body as { message?: unknown }).message;

    if (typeof message === 'string') {
      return message;
    }
  }

  return `Mail Reacher API request failed with status ${status}`;
}

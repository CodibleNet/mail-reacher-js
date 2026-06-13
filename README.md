# Mail Reacher JavaScript

Official TypeScript SDK and framework integrations for [Mail Reacher](https://mail-reacher.com): one API key for dev, staging and production emails, with provider portability built in.

## Packages

- `@mail-reacher/sdk` — core TypeScript client for the Mail Reacher API.
- `@mail-reacher/next` — small Next.js server-side helper built on top of the SDK.
- `@mail-reacher/nodemailer` — Nodemailer transport adapter.
- `@mail-reacher/tanstack-start` — TanStack Start server helper built on top of the SDK.

## Quick start

```bash
yarn add @mail-reacher/sdk
```

```ts
import { MailReacher } from '@mail-reacher/sdk';

const mailer = new MailReacher({
  apiKey: process.env.MAILREACHER_API_KEY!,
});

await mailer.emails.send({
  to: 'user@example.com',
  subject: 'Welcome',
  html: '<p>Hello from Mail Reacher</p>',
});
```

Keep `MAILREACHER_API_KEY` server-side only. The API key selects the Mail Reacher project environment: test keys simulate delivery, live keys send through the configured provider.

## Development

```bash
yarn install
yarn typecheck
yarn build
```

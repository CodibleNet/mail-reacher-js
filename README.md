# Mail Reacher JavaScript

Official TypeScript SDK and framework integrations for [Mail Reacher](https://mail-reacher.com): one API key for dev, staging and production emails, with provider portability built in.

## Packages

- `@mail-reacher/sdk` — core TypeScript client for the Mail Reacher API.
- `@mail-reacher/next` — server-only Next.js helper for App Router, Route Handlers and Server Actions.
- `@mail-reacher/nodemailer` — Nodemailer transport adapter for existing Node email code.
- `@mail-reacher/tanstack-start` — TanStack Start server helper built on top of the SDK.

## Install

```bash
yarn add @mail-reacher/sdk
```

Framework helpers depend on the SDK and can be installed only where needed:

```bash
yarn add @mail-reacher/next
yarn add @mail-reacher/nodemailer
yarn add @mail-reacher/tanstack-start
```

## Quick start

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

## Publishing

Packages are published to npm under the public `@mail-reacher/*` scope.

1. Make sure the `NPM_TOKEN` repository secret is configured.
2. Create a GitHub release such as `v0.1.0`, or run the **Publish packages** workflow manually.
3. Run the workflow once with `dry_run=true` before the first real publish.

## Development

```bash
yarn install
yarn typecheck
yarn build
```

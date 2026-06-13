# @mail-reacher/sdk

Core TypeScript client for the Mail Reacher API.

```ts
import { MailReacher } from '@mail-reacher/sdk';

const mailer = new MailReacher({ apiKey: process.env.MAILREACHER_API_KEY! });

await mailer.emails.send({
  to: 'user@example.com',
  subject: 'Welcome',
  html: '<p>Hello</p>',
});
```

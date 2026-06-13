# @mail-reacher/nodemailer

Nodemailer-compatible transport adapter for Mail Reacher.

```ts
import nodemailer from 'nodemailer';
import { mailReacherTransport } from '@mail-reacher/nodemailer';

const transporter = nodemailer.createTransport(
  mailReacherTransport({ apiKey: process.env.MAILREACHER_API_KEY! }),
);

await transporter.sendMail({
  to: 'user@example.com',
  subject: 'Hello',
  html: '<p>Hello</p>',
});
```

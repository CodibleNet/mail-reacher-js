# @mail-reacher/next

Server-side helper for Next.js App Router, Route Handlers and Server Actions.

```ts
import { createMailReacher } from '@mail-reacher/next';

export const mail = createMailReacher();
```

```ts
'use server';

import { mail } from '@/lib/mail';

export async function sendWelcomeEmail(email: string) {
  await mail.sendTemplate({
    to: email,
    templateId: 'welcome',
    variables: { appName: 'My SaaS' },
  });
}
```

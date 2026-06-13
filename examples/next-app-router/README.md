# Next.js App Router example

```ts
// src/lib/mail.ts
import { createMailReacher } from '@mail-reacher/next';

export const mail = createMailReacher();
```

```ts
// src/app/actions.ts
'use server';

import { mail } from '@/lib/mail';

export async function sendWelcomeEmail(email: string) {
  await mail.sendEmail({
    to: email,
    subject: 'Welcome',
    html: '<p>Welcome to the app.</p>',
  });
}
```

`.env.local`:

```env
MAILREACHER_API_KEY=mr_test_xxx
```

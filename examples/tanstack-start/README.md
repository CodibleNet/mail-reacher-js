# TanStack Start example

```ts
import { createServerFn } from '@tanstack/react-start';
import { createMailReacher } from '@mail-reacher/tanstack-start';

const mail = createMailReacher();

export const sendWelcomeEmail = createServerFn({ method: 'POST' })
  .validator((data: { email: string }) => data)
  .handler(async ({ data }) => {
    await mail.sendEmail({
      to: data.email,
      subject: 'Welcome',
      html: '<p>Welcome to the app.</p>',
    });
  });
```

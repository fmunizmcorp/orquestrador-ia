import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../../server/routers/index';
import superjson from 'superjson';

export const trpc = createTRPCReact<AppRouter>();

export const trpcClient = trpc.createClient({
  transformer: superjson,
  links: [
    httpBatchLink({
      url: `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/trpc`,
      headers() {
        const token = localStorage.getItem('auth_token');
        return {
          authorization: token ? `Bearer ${token}` : '',
        };
      },
    }),
  ],
});

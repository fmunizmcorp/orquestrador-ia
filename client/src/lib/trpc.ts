import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../../server/trpc/router';
import superjson from 'superjson';

export const trpc = createTRPCReact<AppRouter>();

export const trpcClient = trpc.createClient({
  transformer: superjson,
  links: [
    httpBatchLink({
      // Use relative URL to work with any host (localhost, 192.168.1.247, etc.)
      // This ensures requests go to the same server that served the frontend
      url: `${import.meta.env.VITE_API_URL || ''}/api/trpc`,
      headers() {
        const token = localStorage.getItem('auth_token');
        return {
          authorization: token ? `Bearer ${token}` : '',
        };
      },
    }),
  ],
});

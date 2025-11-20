import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink, loggerLink } from '@trpc/client';
import type { AppRouter } from '../../../server/trpc/router';
import superjson from 'superjson';

export const trpc = createTRPCReact<AppRouter>();

// SPRINT 57: Enhanced logging for debugging
const isDevelopment = import.meta.env.DEV || window.location.hostname === 'localhost';

export const trpcClient = trpc.createClient({
  transformer: superjson,
  links: [
    // SPRINT 57: Add logger for debugging in development
    loggerLink({
      enabled: (opts) =>
        isDevelopment ||
        (opts.direction === 'down' && opts.result instanceof Error),
    }),
    httpBatchLink({
      // SPRINT 57: Use explicit URL with window.location.origin for reliability
      // This ensures requests always go to the same server that served the frontend
      url: `${window.location.origin}/api/trpc`,
      headers() {
        const token = localStorage.getItem('auth_token');
        return {
          authorization: token ? `Bearer ${token}` : '',
        };
      },
      // SPRINT 57: Add fetch options for timeout and error handling
      // SPRINT 58: Increased timeout to 60s for slow system metrics queries
      fetch(url, options) {
        console.log('[SPRINT 58] tRPC fetch to:', url);
        return fetch(url, {
          ...options,
          signal: AbortSignal.timeout(60000), // SPRINT 58: 60 second timeout for slow queries
        }).then(response => {
          console.log('[SPRINT 58] tRPC response status:', response.status);
          return response;
        }).catch(error => {
          console.error('[SPRINT 58] tRPC fetch error:', error);
          throw error;
        });
      },
    }),
  ],
});

/**
 * Servidor Principal - Orquestrador V3.0
 * Integra tRPC, WebSocket, Terminal SSH, e todos os serviços
 */
declare const app: import("express-serve-static-core").Express;
declare const server: import("http").Server<typeof import("http").IncomingMessage, typeof import("http").ServerResponse>;
export { app, server };

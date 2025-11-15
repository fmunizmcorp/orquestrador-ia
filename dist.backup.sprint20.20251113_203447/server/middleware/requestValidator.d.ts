/**
 * Request Validator Middleware
 * Valida e sanitiza requisições
 */
import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
declare global {
    namespace Express {
        interface Request {
            file?: Express.Multer.File;
            files?: Express.Multer.File[] | {
                [fieldname: string]: Express.Multer.File[];
            };
        }
    }
}
/**
 * Validate request body against Zod schema
 */
export declare function validateBody(schema: ZodSchema): (req: Request, res: Response, next: NextFunction) => void;
/**
 * Validate request query params against Zod schema
 */
export declare function validateQuery(schema: ZodSchema): (req: Request, res: Response, next: NextFunction) => void;
/**
 * Sanitize HTML to prevent XSS
 */
export declare function sanitizeHTML(req: Request, res: Response, next: NextFunction): void;
/**
 * Validate file upload
 */
export interface FileValidationOptions {
    maxSize?: number;
    allowedMimeTypes?: string[];
    allowedExtensions?: string[];
}
export declare function validateFile(options?: FileValidationOptions): (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
/**
 * Require authentication (placeholder - implement real auth)
 */
export declare function requireAuth(req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
/**
 * Require specific role (placeholder)
 */
export declare function requireRole(...roles: string[]): (req: Request, res: Response, next: NextFunction) => void;
/**
 * Log request details
 */
export declare function logRequest(req: Request, res: Response, next: NextFunction): void;

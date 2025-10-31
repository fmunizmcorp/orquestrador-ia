/**
 * Request Validator Middleware
 * Valida e sanitiza requisições
 */
import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';

// Extend Express Request type to include multer file properties
declare global {
  namespace Express {
    interface Request {
      file?: Express.Multer.File;
      files?: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] };
    }
  }
}

/**
 * Validate request body against Zod schema
 */
export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: 'Validation failed',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        });
      } else {
        res.status(400).json({
          error: 'Invalid request body',
        });
      }
    }
  };
}

/**
 * Validate request query params against Zod schema
 */
export function validateQuery(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: 'Validation failed',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        });
      } else {
        res.status(400).json({
          error: 'Invalid query parameters',
        });
      }
    }
  };
}

/**
 * Sanitize HTML to prevent XSS
 */
export function sanitizeHTML(req: Request, res: Response, next: NextFunction) {
  const sanitize = (obj: any): any => {
    if (typeof obj === 'string') {
      return obj
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
    }
    
    if (Array.isArray(obj)) {
      return obj.map(sanitize);
    }
    
    if (typeof obj === 'object' && obj !== null) {
      const sanitized: any = {};
      for (const key in obj) {
        sanitized[key] = sanitize(obj[key]);
      }
      return sanitized;
    }
    
    return obj;
  };

  if (req.body) {
    req.body = sanitize(req.body);
  }
  
  if (req.query) {
    req.query = sanitize(req.query);
  }

  next();
}

/**
 * Validate file upload
 */
export interface FileValidationOptions {
  maxSize?: number; // in bytes
  allowedMimeTypes?: string[];
  allowedExtensions?: string[];
}

export function validateFile(options: FileValidationOptions = {}) {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB default
    allowedMimeTypes = [],
    allowedExtensions = [],
  } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.file && !req.files) {
      return next();
    }

    const files = req.files ? (Array.isArray(req.files) ? req.files : Object.values(req.files).flat()) : [req.file];

    for (const file of files) {
      if (!file) continue;

      // Check file size
      if (file.size > maxSize) {
        return res.status(400).json({
          error: `File too large. Maximum size: ${(maxSize / 1024 / 1024).toFixed(2)}MB`,
          file: file.originalname,
        });
      }

      // Check MIME type
      if (allowedMimeTypes.length > 0 && !allowedMimeTypes.includes(file.mimetype)) {
        return res.status(400).json({
          error: `Invalid file type. Allowed types: ${allowedMimeTypes.join(', ')}`,
          file: file.originalname,
        });
      }

      // Check extension
      if (allowedExtensions.length > 0) {
        const ext = file.originalname.split('.').pop()?.toLowerCase();
        if (!ext || !allowedExtensions.includes(ext)) {
          return res.status(400).json({
            error: `Invalid file extension. Allowed extensions: ${allowedExtensions.join(', ')}`,
            file: file.originalname,
          });
        }
      }
    }

    next();
  };
}

/**
 * Require authentication (placeholder - implement real auth)
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  // TODO: Implement real authentication
  // For now, just check if Authorization header exists
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({
      error: 'Authentication required',
    });
  }

  // TODO: Verify token and attach user to request
  // req.user = decoded;

  next();
}

/**
 * Require specific role (placeholder)
 */
export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    // TODO: Check user role from req.user
    // For now, just pass through
    next();
  };
}

/**
 * Log request details
 */
export function logRequest(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const log = {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    };
    
    console.log(JSON.stringify(log));
  });

  next();
}

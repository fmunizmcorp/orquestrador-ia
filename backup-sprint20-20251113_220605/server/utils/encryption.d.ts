/**
 * Criptografa dados usando AES-256-GCM
 */
export declare function encrypt(data: string): string;
/**
 * Descriptografa dados
 */
export declare function decrypt(encryptedData: string): string;
/**
 * Criptografa um objeto JSON
 */
export declare function encryptJSON(data: any): string;
/**
 * Descriptografa e parseia JSON
 */
export declare function decryptJSON<T = any>(encryptedData: string): T;

import CryptoJS from 'crypto-js';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-32-char-encryption-key';
/**
 * Criptografa dados usando AES-256-GCM
 */
export function encrypt(data) {
    try {
        const encrypted = CryptoJS.AES.encrypt(data, ENCRYPTION_KEY);
        return encrypted.toString();
    }
    catch (error) {
        console.error('Erro ao criptografar dados:', error);
        throw new Error('Falha na criptografia');
    }
}
/**
 * Descriptografa dados
 */
export function decrypt(encryptedData) {
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        if (!decrypted) {
            throw new Error('Falha ao descriptografar');
        }
        return decrypted;
    }
    catch (error) {
        console.error('Erro ao descriptografar dados:', error);
        throw new Error('Falha na descriptografia');
    }
}
/**
 * Criptografa um objeto JSON
 */
export function encryptJSON(data) {
    return encrypt(JSON.stringify(data));
}
/**
 * Descriptografa e parseia JSON
 */
export function decryptJSON(encryptedData) {
    const decrypted = decrypt(encryptedData);
    return JSON.parse(decrypted);
}

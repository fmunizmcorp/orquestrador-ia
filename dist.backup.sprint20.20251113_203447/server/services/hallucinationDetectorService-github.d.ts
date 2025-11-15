/**
 * Hallucination Detector Service
 * Detecção de alucinação com recuperação automática
 * - Valida respostas com checagem cruzada
 * - Detecta repetições/loops infinitos
 * - Score de confiança 0-100%
 * - Recuperação automática com ZERO perda de trabalho
 */
declare class HallucinationDetectorService {
    detectHallucination(response: string, context: any): Promise<{
        isHallucination: boolean;
        confidence: number;
        reasons: string[];
    }>;
    recoverFromHallucination(taskId: number, subtaskId: number, savedProgress: any): Promise<{
        recovered: boolean;
        newResult: string;
    }>;
    private hasRepetitions;
    private hasContradictions;
    private isOutOfScope;
    private hasSuspiciousPatterns;
}
export declare const hallucinationDetectorService: HallucinationDetectorService;
export {};

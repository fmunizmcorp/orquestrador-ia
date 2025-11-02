/**
 * Hallucination Detector Service
 * Detecta alucinações em respostas de IAs e triggera recovery automático
 */

import { lmstudioService } from './lmstudioService.js';

interface HallucinationCheckResult {
  isHallucination: boolean;
  confidenceScore: number; // 0-100
  indicators: {
    unsupportedFacts: string[];
    contradictions: string[];
    unrealisticClaims: string[];
    lackOfEvidence: string[];
  };
  reasoning: string;
  recommendation: 'approve' | 'reject' | 'rerun';
}

class HallucinationDetector {
  /**
   * Detecta alucinações em um resultado
   */
  async detectHallucination(
    task: {
      title: string;
      description: string;
      context?: string;
    },
    result: string,
    modelId: string
  ): Promise<HallucinationCheckResult> {
    try {
      const prompt = this.buildDetectionPrompt(task, result);
      
      // Usar modelo mais crítico para detecção
      const response = await lmstudioService.generateCompletion(
        modelId,
        prompt,
        {
          temperature: 0.2, // Bem conservador
          maxTokens: 1024,
          timeout: 120000 // 2 minutos
        }
      );

      // Parsear resposta
      let detection: any;
      try {
        detection = JSON.parse(response);
      } catch (e) {
        // Fallback se não conseguir parsear
        detection = {
          isHallucination: false,
          confidenceScore: 60,
          indicators: {
            unsupportedFacts: [],
            contradictions: [],
            unrealisticClaims: [],
            lackOfEvidence: []
          },
          reasoning: 'Não foi possível analisar completamente (erro de parse)',
          recommendation: 'approve'
        };
      }

      return this.normalizeResult(detection);

    } catch (error) {
      console.error('Erro ao detectar alucinação:', error);
      
      // Em caso de erro, assumir que não é alucinação (fail-safe)
      return {
        isHallucination: false,
        confidenceScore: 50,
        indicators: {
          unsupportedFacts: [],
          contradictions: [],
          unrealisticClaims: [],
          lackOfEvidence: []
        },
        reasoning: `Erro na detecção: ${error}`,
        recommendation: 'approve'
      };
    }
  }

  /**
   * Verifica múltiplos indicadores de alucinação
   */
  async comprehensiveCheck(
    task: any,
    result: string,
    modelId: string
  ): Promise<HallucinationCheckResult> {
    // Executar detecção básica
    const basicCheck = await this.detectHallucination(task, result, modelId);

    // Se score < 50%, é alucinação clara
    if (basicCheck.confidenceScore < 50) {
      basicCheck.isHallucination = true;
      basicCheck.recommendation = 'rerun';
    }
    // Se score 50-70%, revisar
    else if (basicCheck.confidenceScore < 70) {
      basicCheck.recommendation = 'rerun';
    }
    // Se score >= 70%, aprovar
    else {
      basicCheck.isHallucination = false;
      basicCheck.recommendation = 'approve';
    }

    return basicCheck;
  }

  /**
   * Constrói prompt de detecção
   */
  private buildDetectionPrompt(task: any, result: string): string {
    return `Você é um especialista em detectar alucinações em respostas de IAs.

TAREFA SOLICITADA:
Título: ${task.title}
Descrição: ${task.description}
${task.context ? `Contexto: ${task.context}` : ''}

RESULTADO GERADO PELA IA:
${result}

ANÁLISE:
Avalie se o resultado contém ALUCINAÇÕES (informações inventadas, não verificáveis ou incorretas).

Verifique:
1. FATOS NÃO SUPORTADOS: Afirmações sem evidência ou inventadas
2. CONTRADIÇÕES: Informações que se contradizem
3. AFIRMAÇÕES IRREALISTAS: Claims que não fazem sentido prático
4. FALTA DE EVIDÊNCIA: Conclusões sem base lógica

IMPORTANTE:
- Seja RIGOROSO mas JUSTO
- Não considere alucinação se for apenas estilo diferente
- Foque em PRECISÃO FACTUAL

Retorne um JSON:
{
  "isHallucination": boolean,
  "confidenceScore": number (0-100, onde 100 é totalmente confiável),
  "indicators": {
    "unsupportedFacts": ["lista de fatos sem suporte"],
    "contradictions": ["lista de contradições"],
    "unrealisticClaims": ["lista de afirmações irrealistas"],
    "lackOfEvidence": ["lista de conclusões sem base"]
  },
  "reasoning": "explicação da análise",
  "recommendation": "approve" | "reject" | "rerun"
}`;
  }

  /**
   * Normaliza resultado da detecção
   */
  private normalizeResult(detection: any): HallucinationCheckResult {
    return {
      isHallucination: Boolean(detection.isHallucination),
      confidenceScore: Math.max(0, Math.min(100, Number(detection.confidenceScore) || 50)),
      indicators: {
        unsupportedFacts: Array.isArray(detection.indicators?.unsupportedFacts) 
          ? detection.indicators.unsupportedFacts 
          : [],
        contradictions: Array.isArray(detection.indicators?.contradictions) 
          ? detection.indicators.contradictions 
          : [],
        unrealisticClaims: Array.isArray(detection.indicators?.unrealisticClaims) 
          ? detection.indicators.unrealisticClaims 
          : [],
        lackOfEvidence: Array.isArray(detection.indicators?.lackOfEvidence) 
          ? detection.indicators.lackOfEvidence 
          : [],
      },
      reasoning: String(detection.reasoning || 'Sem reasoning fornecido'),
      recommendation: detection.recommendation === 'rerun' ? 'rerun' 
        : detection.recommendation === 'reject' ? 'reject' 
        : 'approve'
    };
  }

  /**
   * Triggera recovery automático
   */
  async triggerRecovery(
    originalTask: any,
    failedResult: string,
    hallucinationReport: HallucinationCheckResult,
    alternativeModelId: string
  ): Promise<{
    success: boolean;
    newResult?: string;
    error?: string;
  }> {
    try {
      // Construir prompt melhorado baseado no problema detectado
      const recoveryPrompt = this.buildRecoveryPrompt(
        originalTask,
        failedResult,
        hallucinationReport
      );

      // Executar com modelo diferente
      const newResult = await lmstudioService.generateCompletion(
        alternativeModelId,
        recoveryPrompt,
        {
          temperature: 0.5, // Um pouco mais conservador
          maxTokens: 4096,
          timeout: 300000 // 5 minutos
        }
      );

      // Verificar se novo resultado é válido
      if (!newResult || newResult.trim().length < 50) {
        return {
          success: false,
          error: 'Recovery gerou resultado muito curto'
        };
      }

      return {
        success: true,
        newResult
      };

    } catch (error) {
      return {
        success: false,
        error: `Erro no recovery: ${error}`
      };
    }
  }

  /**
   * Constrói prompt para recovery
   */
  private buildRecoveryPrompt(
    task: any,
    failedResult: string,
    report: HallucinationCheckResult
  ): string {
    let prompt = `ATENÇÃO: Uma execução anterior desta tarefa continha ALUCINAÇÕES.

TAREFA ORIGINAL:
${task.title}
${task.description}

PROBLEMAS DETECTADOS NA EXECUÇÃO ANTERIOR:
${report.reasoning}

INDICADORES ESPECÍFICOS:
`;

    if (report.indicators.unsupportedFacts.length > 0) {
      prompt += `\n❌ Fatos não suportados encontrados:\n- ${report.indicators.unsupportedFacts.join('\n- ')}`;
    }
    if (report.indicators.contradictions.length > 0) {
      prompt += `\n❌ Contradições encontradas:\n- ${report.indicators.contradictions.join('\n- ')}`;
    }
    if (report.indicators.unrealisticClaims.length > 0) {
      prompt += `\n❌ Afirmações irrealistas:\n- ${report.indicators.unrealisticClaims.join('\n- ')}`;
    }

    prompt += `\n\n⚠️ INSTRUÇÕES IMPORTANTES:
1. Execute a tarefa CORRETAMENTE desta vez
2. NÃO invente informações
3. Base suas respostas em FATOS
4. Se não tiver certeza, seja HONESTO
5. Valide cada afirmação que fizer

Execute a tarefa agora, evitando os problemas acima:`;

    return prompt;
  }
}

export const hallucinationDetector = new HallucinationDetector();

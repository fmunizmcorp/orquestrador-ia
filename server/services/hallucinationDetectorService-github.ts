/**
 * Hallucination Detector Service
 * Detecção de alucinação com recuperação automática
 * - Valida respostas com checagem cruzada
 * - Detecta repetições/loops infinitos
 * - Score de confiança 0-100%
 * - Recuperação automática com ZERO perda de trabalho
 */

import { db } from '../db/index.js';
import { aiModels, specializedAIs, subtasks, executionLogs } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';
import { lmstudioService } from './lmstudioService.js';

class HallucinationDetectorService {
  async detectHallucination(response: string, context: any): Promise<{
    isHallucination: boolean;
    confidence: number;
    reasons: string[];
  }> {
    const reasons: string[] = [];
    let confidence = 100;

    // 1. Detectar repetições
    if (this.hasRepetitions(response)) {
      reasons.push('Repetições detectadas (possível loop infinito)');
      confidence -= 30;
    }

    // 2. Verificar contradições (usando IA)
    const contradictions = await this.hasContradictions(response);
    if (contradictions.found) {
      reasons.push(`Contradições internas: ${contradictions.examples.join(', ')}`);
      confidence -= 40;
    }

    // 3. Verificar se fora do escopo
    if (context && await this.isOutOfScope(response, context)) {
      reasons.push('Resposta fora do escopo da tarefa');
      confidence -= 35;
    }

    // 4. Verificar resposta muito curta ou vazia
    if (response.trim().length < 50) {
      reasons.push('Resposta muito curta (possível erro)');
      confidence -= 50;
    }

    // 5. Verificar padrões suspeitos
    if (this.hasSuspiciousPatterns(response)) {
      reasons.push('Padrões suspeitos detectados');
      confidence -= 25;
    }

    return {
      isHallucination: confidence < 50,
      confidence,
      reasons,
    };
  }

  async recoverFromHallucination(
    taskId: number, 
    subtaskId: number, 
    savedProgress: any
  ): Promise<{ recovered: boolean; newResult: string }> {
    try {
      // 1. Buscar subtask
      const [subtask] = await db.select()
        .from(subtasks)
        .where(eq(subtasks.id, subtaskId))
        .limit(1);

      if (!subtask) {
        throw new Error('Subtarefa não encontrada');
      }

      const originalModelId = subtask.assignedModelId;

      // 2. Buscar modelo alternativo DIFERENTE
      const [alternativeAI] = await db.select()
        .from(specializedAIs)
        .where(eq(specializedAIs.isActive, true))
        .limit(1);

      if (!alternativeAI) {
        throw new Error('IA alternativa não disponível');
      }

      let alternativeModelId: number | null = alternativeAI.defaultModelId;
      
      // Garantir modelo DIFERENTE
      if (!alternativeModelId || alternativeModelId === originalModelId) {
        const fallbacks = alternativeAI.fallbackModelIds 
          ? (alternativeAI.fallbackModelIds as any as number[])
          : [];
        alternativeModelId = fallbacks.find((id: number) => id !== originalModelId) || null;
      }

      if (!alternativeModelId) {
        throw new Error('Não há modelo alternativo disponível');
      }

      const [alternativeModel] = await db.select()
        .from(aiModels)
        .where(eq(aiModels.id, alternativeModelId))
        .limit(1);

      if (!alternativeModel) {
        throw new Error('Modelo alternativo não encontrado');
      }

      // 3. Executar novamente com contexto salvo
      const recoveryPrompt = `${savedProgress.prompt}\n\n` +
        `NOTA IMPORTANTE: Uma tentativa anterior com outro modelo produziu resultado insatisfatório.\n` +
        `Possível alucinação detectada.\n` +
        `Seja especialmente cuidadoso para:\n` +
        `- Evitar repetições\n` +
        `- Evitar contradições\n` +
        `- Manter-se no escopo da tarefa\n` +
        `- Fornecer resposta completa e coerente`;

      const newResult = await lmstudioService.generateCompletion(
        alternativeModel.modelId,
        recoveryPrompt,
        { temperature: 0.5, maxTokens: 4096, timeout: 300000 }
      );

      // 4. Comparar resultados com IA
      const comparisonPrompt = `Compare os dois resultados abaixo e determine qual é melhor ou se deve combinar ambos.

RESULTADO ORIGINAL (possível alucinação):
${savedProgress.originalResult}

NOVO RESULTADO (tentativa de recovery):
${newResult}

Retorne JSON:
{
  "better": "original" | "new" | "combined",
  "finalResult": "texto final a usar",
  "reasoning": "explicação da escolha"
}`;

      const comparisonResponse = await lmstudioService.generateCompletion(
        alternativeModel.modelId,
        comparisonPrompt,
        { temperature: 0.3, maxTokens: 3000 }
      );

      let comparison: any;
      try {
        comparison = JSON.parse(comparisonResponse);
      } catch (e) {
        // Fallback: usar novo resultado
        comparison = {
          better: 'new',
          finalResult: newResult,
          reasoning: 'Novo resultado usado por padrão (erro ao comparar)'
        };
      }

      // 5. Log do recovery
      await db.insert(executionLogs).values({
        taskId,
        subtaskId,
        level: 'info',
        message: 'Recovery de alucinação bem-sucedido',
        metadata: {
          originalModelId,
          alternativeModelId: alternativeModel.id,
          comparisonResult: comparison.reasoning
        }
      });

      return {
        recovered: true,
        newResult: comparison.finalResult
      };

    } catch (error) {
      // Log do erro
      await db.insert(executionLogs).values({
        taskId,
        subtaskId,
        level: 'error',
        message: `Erro no recovery de alucinação: ${error}`
      });

      // Retornar resultado original se recovery falhar
      return {
        recovered: false,
        newResult: savedProgress.originalResult || ''
      };
    }
  }

  private hasRepetitions(text: string): boolean {
    // Detecta se há muitas frases repetidas
    const sentences = text.split(/[.!?]/).filter(s => s.trim().length > 10);
    if (sentences.length === 0) return false;

    const uniqueSentences = new Set(sentences.map(s => s.trim().toLowerCase()));
    const repetitionRate = uniqueSentences.size / sentences.length;

    // Se menos de 80% das frases são únicas, há repetição
    if (repetitionRate < 0.8) return true;

    // Detectar mesma frase 3+ vezes
    const sentenceCounts = new Map<string, number>();
    sentences.forEach(sentence => {
      const normalized = sentence.trim().toLowerCase();
      sentenceCounts.set(normalized, (sentenceCounts.get(normalized) || 0) + 1);
    });

    for (const count of sentenceCounts.values()) {
      if (count >= 3) return true;
    }

    return false;
  }

  private async hasContradictions(text: string): Promise<{
    found: boolean;
    examples: string[];
  }> {
    try {
      // Usar IA para detectar contradições
      // Buscar primeiro modelo disponível
      const [model] = await db.select()
        .from(aiModels)
        .where(eq(aiModels.isActive, true))
        .limit(1);

      if (!model) {
        return { found: false, examples: [] };
      }

      const prompt = `Analise o seguinte texto e identifique CONTRADIÇÕES internas.

Texto:
${text.substring(0, 2000)} ${text.length > 2000 ? '...' : ''}

Retorne JSON:
{
  "hasContradictions": boolean,
  "contradictions": [
    {
      "statement1": "primeira afirmação",
      "statement2": "afirmação contraditória",
      "explanation": "por que contradizem"
    }
  ]
}`;

      const response = await lmstudioService.generateCompletion(
        model.modelId,
        prompt,
        { temperature: 0.3, maxTokens: 1024, timeout: 60000 }
      );

      let analysis: any;
      try {
        analysis = JSON.parse(response);
      } catch (e) {
        return { found: false, examples: [] };
      }

      return {
        found: analysis.hasContradictions,
        examples: (analysis.contradictions || []).map(
          (c: any) => `"${c.statement1}" contradiz "${c.statement2}"`
        )
      };

    } catch (error) {
      console.error('Erro ao detectar contradições:', error);
      return { found: false, examples: [] };
    }
  }

  private async isOutOfScope(text: string, context: any): Promise<boolean> {
    try {
      // Usar IA para verificar se está fora do escopo
      const [model] = await db.select()
        .from(aiModels)
        .where(eq(aiModels.isActive, true))
        .limit(1);

      if (!model) {
        return false;
      }

      const prompt = `Verifique se a resposta está dentro do escopo da tarefa solicitada.

TAREFA SOLICITADA:
${context.subtask?.title || 'N/A'}
${context.subtask?.description || ''}

RESPOSTA DADA:
${text.substring(0, 1500)}

A resposta está relacionada à tarefa ou fugiu completamente do assunto?

Retorne JSON:
{
  "inScope": boolean,
  "explanation": "breve explicação"
}`;

      const response = await lmstudioService.generateCompletion(
        model.modelId,
        prompt,
        { temperature: 0.3, maxTokens: 512, timeout: 60000 }
      );

      let analysis: any;
      try {
        analysis = JSON.parse(response);
      } catch (e) {
        return false;
      }

      return !analysis.inScope;

    } catch (error) {
      console.error('Erro ao verificar escopo:', error);
      return false;
    }
  }

  private hasSuspiciousPatterns(text: string): boolean {
    // Padrões que indicam possível alucinação

    // 1. Muitos "..." ou reticências
    const ellipsisCount = (text.match(/\.{3,}/g) || []).length;
    if (ellipsisCount > 5) return true;

    // 2. Texto muito genérico/vago
    const vagueWords = ['talvez', 'pode ser', 'provavelmente', 'possivelmente'];
    let vagueCount = 0;
    vagueWords.forEach(word => {
      vagueCount += (text.toLowerCase().match(new RegExp(word, 'g')) || []).length;
    });
    if (vagueCount > 10) return true;

    // 3. Números inventados suspeitos (muitos números específicos sem fonte)
    const numbersPattern = /\b\d{3,}\b/g;
    const numbers = text.match(numbersPattern) || [];
    if (numbers.length > 20) return true;

    return false;
  }
}

export const hallucinationDetectorService = new HallucinationDetectorService();

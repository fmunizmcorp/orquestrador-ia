import { db } from './server/db/index.js';
import { aiProviders, aiModels } from './server/db/schema.js';
import { eq } from 'drizzle-orm';

interface LMStudioModel {
  id: string;
  object: string;
  created: number;
  owned_by: string;
}

interface LMStudioModelsResponse {
  data: LMStudioModel[];
}

async function syncLMStudioModels() {
  console.log('🔄 Iniciando sincronização com LM Studio...');

  try {
    // 1. Buscar provider LM Studio
    const [lmStudioProvider] = await db.select()
      .from(aiProviders)
      .where(eq(aiProviders.name, 'LM Studio'))
      .limit(1);

    if (!lmStudioProvider) {
      console.error('❌ Provider LM Studio não encontrado no banco de dados');
      process.exit(1);
    }

    console.log(`✅ Provider LM Studio encontrado: ID ${lmStudioProvider.id}`);

    // 2. Consultar API do LM Studio
    const endpoint = lmStudioProvider.endpoint + '/models';
    console.log(`📡 Consultando: ${endpoint}`);

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API retornou status ${response.status}: ${response.statusText}`);
    }

    const data: LMStudioModelsResponse = await response.json();
    console.log(`📦 Encontrados ${data.data.length} modelos no LM Studio`);

    // 3. Processar cada modelo
    let inserted = 0;
    let updated = 0;
    let skipped = 0;

    for (const model of data.data) {
      const modelId = model.id;
      const modelName = modelId.split('/').pop() || modelId;

      console.log(`\n🤖 Processando: ${modelId}`);

      // Detectar capacidades pelo nome
      const capabilities: string[] = [];
      const nameLower = modelId.toLowerCase();

      if (nameLower.includes('code') || nameLower.includes('coder') || nameLower.includes('coding')) {
        capabilities.push('coding');
      }
      if (nameLower.includes('medicine') || nameLower.includes('medical') || nameLower.includes('health')) {
        capabilities.push('medical');
      }
      if (nameLower.includes('math')) {
        capabilities.push('mathematics');
      }
      if (nameLower.includes('instruct') || nameLower.includes('chat') || capabilities.length === 0) {
        capabilities.push('general');
      }

      // Extrair informações adicionais
      let quantization: string | null = null;
      let parameters: string | null = null;

      // Tentar extrair quantização (Q4_K_M, Q5_K_S, etc)
      const quantMatch = modelId.match(/[Qq](\d+)_[KkMmSs]+(_[MmSs]+)?/);
      if (quantMatch) {
        quantization = quantMatch[0];
      }

      // Tentar extrair parâmetros (7B, 13B, 70B, etc)
      const paramsMatch = modelId.match(/(\d+)[Bb]/);
      if (paramsMatch) {
        parameters = paramsMatch[0].toUpperCase();
      }

      // Verificar se modelo já existe
      const [existing] = await db.select()
        .from(aiModels)
        .where(eq(aiModels.modelId, modelId))
        .limit(1);

      if (existing) {
        // Atualizar modelo existente
        await db.update(aiModels)
          .set({
            name: modelName,
            capabilities: capabilities,
            isActive: true,
            isLoaded: true, // Se está na lista, assume que está carregado
            quantization: quantization,
            parameters: parameters,
            updatedAt: new Date(),
          })
          .where(eq(aiModels.id, existing.id));

        console.log(`  ✏️  Atualizado: ${modelName}`);
        updated++;
      } else {
        // Inserir novo modelo
        const contextWindow = nameLower.includes('32k') ? 32768 :
                            nameLower.includes('16k') ? 16384 :
                            nameLower.includes('8k') ? 8192 : 4096;

        const priority = capabilities.includes('coding') ? 70 :
                        capabilities.includes('medical') ? 80 :
                        50;

        await db.insert(aiModels).values({
          providerId: lmStudioProvider.id,
          name: modelName,
          modelId: modelId,
          capabilities: capabilities,
          contextWindow: contextWindow,
          isLoaded: true,
          priority: priority,
          isActive: true,
          quantization: quantization,
          parameters: parameters,
          modelPath: null,
          sizeBytes: null,
        });

        console.log(`  ➕ Inserido: ${modelName}`);
        console.log(`     - Capabilities: ${capabilities.join(', ')}`);
        console.log(`     - Context: ${contextWindow}`);
        console.log(`     - Priority: ${priority}`);
        if (quantization) console.log(`     - Quantization: ${quantization}`);
        if (parameters) console.log(`     - Parameters: ${parameters}`);
        inserted++;
      }
    }

    // 4. Marcar modelos que não estão mais no LM Studio como não carregados
    const currentModelIds = data.data.map(m => m.id);
    if (currentModelIds.length > 0) {
      const result = await db.update(aiModels)
        .set({ isLoaded: false })
        .where(eq(aiModels.providerId, lmStudioProvider.id));

      // Re-marcar como carregados apenas os que estão na lista atual
      for (const modelId of currentModelIds) {
        await db.update(aiModels)
          .set({ isLoaded: true })
          .where(eq(aiModels.modelId, modelId));
      }
    }

    // 5. Resumo
    console.log('\n' + '='.repeat(60));
    console.log('✅ Sincronização concluída com sucesso!');
    console.log('='.repeat(60));
    console.log(`📊 Resumo:`);
    console.log(`   • Modelos inseridos: ${inserted}`);
    console.log(`   • Modelos atualizados: ${updated}`);
    console.log(`   • Total de modelos no LM Studio: ${data.data.length}`);
    console.log('='.repeat(60));

    // 6. Listar modelos atuais
    const allModels = await db.select({
      id: aiModels.id,
      name: aiModels.name,
      modelId: aiModels.modelId,
      capabilities: aiModels.capabilities,
      isLoaded: aiModels.isLoaded,
      isActive: aiModels.isActive,
    })
    .from(aiModels)
    .where(eq(aiModels.providerId, lmStudioProvider.id));

    console.log(`\n📋 Modelos no banco de dados (Provider: LM Studio):`);
    allModels.forEach((model, index) => {
      const status = model.isLoaded ? '🟢' : '⚪';
      const active = model.isActive ? '✅' : '❌';
      console.log(`${index + 1}. ${status} ${active} ${model.name}`);
      console.log(`   ID: ${model.id} | ModelID: ${model.modelId}`);
      console.log(`   Capabilities: ${(model.capabilities as string[] || []).join(', ')}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Erro na sincronização:');
    console.error(error);
    process.exit(1);
  }
}

// Executar sincronização
syncLMStudioModels();

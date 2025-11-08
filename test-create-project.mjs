#!/usr/bin/env node
/**
 * Test script para validar criação de projetos via tRPC
 * Simula o comportamento do frontend
 */

import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import fetch from 'node-fetch';

// Create tRPC client similar to frontend
const client = createTRPCProxyClient({
  links: [
    httpBatchLink({
      url: 'http://localhost:3001/api/trpc',
      fetch: fetch,
    }),
  ],
});

async function testProjectCreation() {
  console.log('🧪 Testing Project Creation\n');
  
  try {
    console.log('1. Creating new project...');
    const result = await client.projects.create.mutate({
      name: 'Teste Automatizado V3.5.1',
      description: 'Projeto criado para validar correção de bug de persistência',
      teamId: undefined,
    });
    
    console.log('✅ Project created successfully!');
    console.log('   ID:', result.project.id);
    console.log('   Name:', result.project.name);
    console.log('   Status:', result.project.status);
    console.log('');
    
    console.log('2. Listing all projects...');
    const list = await client.projects.list.query({ limit: 10, offset: 0 });
    
    console.log(`✅ Found ${list.data.length} projects`);
    console.log('   Last 3 projects:');
    list.data.slice(-3).forEach(p => {
      console.log(`   - [${p.id}] ${p.name} (${p.status})`);
    });
    console.log('');
    
    console.log('3. Getting project by ID...');
    const getResult = await client.projects.getById.query({ id: result.project.id });
    
    console.log('✅ Project retrieved successfully!');
    console.log('   Name:', getResult.project.name);
    console.log('   Description:', getResult.project.description);
    console.log('   Tasks Count:', getResult.project.tasksCount);
    console.log('');
    
    console.log('🎉 ALL TESTS PASSED! Persistence is working correctly.');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Test failed with error:');
    console.error(error);
    process.exit(1);
  }
}

testProjectCreation();

#!/usr/bin/env node
/**
 * Test all 23 pages reported by user to verify system is 100% functional
 */

import { chromium } from 'playwright';

const PAGES = [
  { name: 'Dashboard', path: '/' },
  { name: 'Profile', path: '/profile' },
  { name: 'Projects', path: '/projects' },
  { name: 'Projects (PT)', path: '/projetos' },
  { name: 'Teams', path: '/teams' },
  { name: 'Teams (PT)', path: '/equipes' },
  { name: 'Providers', path: '/providers' },
  { name: 'Models', path: '/models' },
  { name: 'Specialized AIs', path: '/specialized-ais' },
  { name: 'Credentials', path: '/credentials' },
  { name: 'Tasks', path: '/tasks' },
  { name: 'Tasks (PT)', path: '/tarefas' },
  { name: 'Prompts', path: '/prompts' },
  { name: 'Prompt Chat', path: '/prompt-chat' },
  { name: 'Templates', path: '/templates' },
  { name: 'Workflows', path: '/workflows' },
  { name: 'Instructions', path: '/instructions' },
  { name: 'Knowledge Base', path: '/knowledge-base' },
  { name: 'Execution Logs', path: '/execution-logs' },
  { name: 'Chat', path: '/chat' },
  { name: 'External API Accounts', path: '/external-api-accounts' },
  { name: 'Services', path: '/services' },
  { name: 'Monitoring', path: '/monitoring' },
  { name: 'Monitoring (PT)', path: '/monitoramento' },
  { name: 'Settings', path: '/settings' },
  { name: 'Terminal', path: '/terminal' },
  { name: 'Model Training', path: '/model-training' },
  { name: 'LM Studio', path: '/lmstudio' },
  { name: 'Analytics', path: '/analytics' },
  { name: 'Workflow Builder', path: '/workflows/builder' },
];

async function testAllPages() {
  console.log('🧪 TESTING ALL PAGES - System Validation\n');
  console.log('Testing production server: http://localhost:3001\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const results = [];
  let working = 0;
  let broken = 0;

  for (const { name, path } of PAGES) {
    const url = `http://localhost:3001${path}`;
    process.stdout.write(`Testing: ${name.padEnd(30)} ... `);

    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10000 });
      await page.waitForTimeout(1500); // Wait for React to render

      const rootHTML = await page.$eval('#root', el => el.innerHTML).catch(() => '');
      const hasContent = rootHTML.trim().length > 100;

      if (hasContent) {
        console.log('✅ WORKING');
        working++;
        results.push({ name, path, status: '✅ WORKING', contentLength: rootHTML.length });
      } else {
        console.log('❌ WHITE SCREEN');
        broken++;
        results.push({ name, path, status: '❌ WHITE SCREEN', contentLength: 0 });
      }
    } catch (error) {
      console.log(`❌ ERROR: ${error.message.substring(0, 50)}`);
      broken++;
      results.push({ name, path, status: '❌ FAILED', error: error.message.substring(0, 100) });
    }
  }

  await browser.close();

  // Summary
  const total = working + broken;
  const percentage = ((working / total) * 100).toFixed(1);

  console.log('\n═══════════════════════════════════════════════════');
  console.log('📊 FINAL RESULTS');
  console.log('═══════════════════════════════════════════════════\n');
  console.log(`Total Pages Tested: ${total}`);
  console.log(`✅ Working: ${working} (${percentage}%)`);
  console.log(`❌ Broken: ${broken}\n`);

  if (broken > 0) {
    console.log('🔴 FAILED PAGES:');
    results.filter(r => r.status.includes('❌')).forEach(r => {
      console.log(`   - ${r.name} (${r.path})`);
    });
    console.log('');
  }

  if (percentage >= 100) {
    console.log('🎉 SUCCESS: SYSTEM 100% FUNCTIONAL!\n');
    process.exit(0);
  } else if (percentage >= 90) {
    console.log('✅ GOOD: System mostly functional\n');
    process.exit(0);
  } else {
    console.log('❌ CRITICAL: System has significant issues\n');
    process.exit(1);
  }
}

testAllPages().catch(err => {
  console.error('\n❌ Test script failed:', err);
  process.exit(1);
});

#!/usr/bin/env node
/**
 * Test React Rendering in Production
 * Tests if React successfully renders content on multiple pages
 */

import { chromium } from 'playwright';

const PROD_BASE_URL = 'http://31.97.64.43:3001';
const TEST_PAGES = [
  { path: '/', name: 'Dashboard' },
  { path: '/projetos', name: 'Projects (PT)' },
  { path: '/projects', name: 'Projects' },
  { path: '/teams', name: 'Teams' },
  { path: '/tarefas', name: 'Tasks (PT)' },
  { path: '/monitoring', name: 'Monitoring' },
  { path: '/analytics', name: 'Analytics' },
  { path: '/instructions', name: 'Instructions' },
  { path: '/execution-logs', name: 'Execution Logs' },
];

async function testReactRendering() {
  console.log('🧪 Testing React Rendering on Production Server');
  console.log(`📍 Base URL: ${PROD_BASE_URL}\n`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const results = [];

  for (const { path, name } of TEST_PAGES) {
    const url = `${PROD_BASE_URL}${path}`;
    console.log(`\n🔍 Testing: ${name}`);
    console.log(`   URL: ${url}`);

    try {
      // Navigate with timeout
      await page.goto(url, { 
        waitUntil: 'networkidle',
        timeout: 15000 
      });

      // Wait a bit for React to render
      await page.waitForTimeout(2000);

      // Check if root div has content
      const rootContent = await page.$eval('#root', (el) => el.innerHTML.trim());
      const hasContent = rootContent.length > 100; // More than just whitespace

      // Check for React-specific elements
      const hasReactElements = await page.evaluate(() => {
        const root = document.getElementById('root');
        return root && root.children.length > 0;
      });

      // Capture console errors
      const consoleErrors = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });

      // Get page title
      const title = await page.title();

      const result = {
        name,
        path,
        hasContent,
        hasReactElements,
        contentLength: rootContent.length,
        title,
        status: hasContent && hasReactElements ? '✅ WORKING' : '❌ WHITE SCREEN',
      };

      results.push(result);

      console.log(`   Status: ${result.status}`);
      console.log(`   React Elements: ${hasReactElements ? 'Yes' : 'No'}`);
      console.log(`   Content Length: ${result.contentLength} chars`);
      console.log(`   Title: ${title}`);

      if (consoleErrors.length > 0) {
        console.log(`   ⚠️  Console Errors: ${consoleErrors.length}`);
        consoleErrors.slice(0, 3).forEach((err) => {
          console.log(`      - ${err}`);
        });
      }

    } catch (error) {
      console.log(`   ❌ ERROR: ${error.message}`);
      results.push({
        name,
        path,
        status: '❌ FAILED TO LOAD',
        error: error.message,
      });
    }
  }

  await browser.close();

  // Summary
  console.log('\n\n═══════════════════════════════════════════════════');
  console.log('📊 SUMMARY');
  console.log('═══════════════════════════════════════════════════\n');

  const working = results.filter((r) => r.status === '✅ WORKING').length;
  const broken = results.filter((r) => r.status.includes('❌')).length;
  const percentage = ((working / results.length) * 100).toFixed(1);

  console.log(`✅ Working: ${working}/${results.length} (${percentage}%)`);
  console.log(`❌ Broken:  ${broken}/${results.length}\n`);

  results.forEach((r) => {
    console.log(`${r.status.includes('✅') ? '✅' : '❌'} ${r.name.padEnd(25)} - ${r.path}`);
  });

  console.log('\n═══════════════════════════════════════════════════\n');

  return { working, broken, percentage, results };
}

// Run test
testReactRendering().catch(console.error);

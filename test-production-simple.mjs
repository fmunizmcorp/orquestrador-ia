#!/usr/bin/env node
/**
 * Simple test to check if React renders
 */

import { chromium } from 'playwright';

async function test() {
  console.log('🧪 Testing Production Build (Sprint 79 - commit 0389876)\n');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Collect console messages
  const consoleMessages = [];
  const errors = [];
  
  page.on('console', (msg) => {
    const text = msg.text();
    consoleMessages.push(`[${msg.type()}] ${text}`);
    if (msg.type() === 'error') {
      errors.push(text);
    }
  });

  page.on('pageerror', (error) => {
    errors.push(`PAGE ERROR: ${error.message}`);
  });

  try {
    console.log('Loading http://localhost:3001/...');
    await page.goto('http://localhost:3001/', { 
      waitUntil: 'networkidle',
      timeout: 15000 
    });
    
    // Wait for React to possibly render
    await page.waitForTimeout(3000);

    // Check if root is populated
    const rootHTML = await page.$eval('#root', el => el.innerHTML).catch(() => 'ROOT_NOT_FOUND');
    const hasContent = rootHTML !== 'ROOT_NOT_FOUND' && rootHTML.trim().length > 50;

    console.log(`\n✅ Page loaded successfully`);
    console.log(`📊 Root content length: ${rootHTML === 'ROOT_NOT_FOUND' ? 0 : rootHTML.length} chars`);
    console.log(`${hasContent ? '✅ REACT IS RENDERING!' : '❌ WHITE SCREEN (empty root)'}\n`);

    if (errors.length > 0) {
      console.log(`⚠️  JavaScript Errors Detected (${errors.length}):`);
      errors.slice(0, 5).forEach((err, i) => {
        console.log(`   ${i + 1}. ${err.substring(0, 150)}`);
      });
      console.log('');
    }

    if (!hasContent && consoleMessages.length > 0) {
      console.log('📝 Console Messages (last 10):');
      consoleMessages.slice(-10).forEach(msg => {
        console.log(`   ${msg.substring(0, 150)}`);
      });
    }

    await browser.close();
    
    if (hasContent) {
      console.log('\n🎉 SUCCESS: System is rendering!');
      process.exit(0);
    } else {
      console.log('\n❌ FAILED: System shows white screen');
      process.exit(1);
    }

  } catch (error) {
    console.log(`\n❌ ERROR: ${error.message}`);
    await browser.close();
    process.exit(1);
  }
}

test();

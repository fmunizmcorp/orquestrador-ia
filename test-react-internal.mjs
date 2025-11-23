#!/usr/bin/env node
/**
 * Simple Test - Check if React renders via SSH
 */

import { chromium } from 'playwright';

const TEST_URL = 'http://localhost:3001/';

async function test() {
  console.log('🧪 Testing React Rendering');
  console.log(`📍 URL: ${TEST_URL}\n`);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // Navigate
    await page.goto(TEST_URL, { waitUntil: 'domcontentloaded', timeout: 10000 });
    
    // Wait for React
    await page.waitForTimeout(3000);

    // Check root content
    const rootHTML = await page.$eval('#root', (el) => el.innerHTML);
    const hasContent = rootHTML.trim().length > 50;

    console.log(`✅ Page loaded`);
    console.log(`📄 Root content length: ${rootHTML.length} chars`);
    console.log(`${hasContent ? '✅ REACT IS RENDERING' : '❌ WHITE SCREEN (empty root)'}\n`);

    if (!hasContent) {
      console.log('Root HTML:', rootHTML.substring(0, 200));
    }

  } catch (error) {
    console.log(`❌ ERROR: ${error.message}`);
  }

  await browser.close();
}

test().catch(console.error);

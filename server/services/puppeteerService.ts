/**
 * Puppeteer Service
 * Automação web inteligente
 * - IAs acessam internet
 * - Interpretam páginas (DOM + OCR)
 * - Preenchem formulários automaticamente
 * - Validam ações no banco de dados
 * - Screenshots e logs detalhados
 */

import puppeteer, { Browser, Page } from 'puppeteer';

class PuppeteerService {
  private browser: Browser | null = null;

  async init(): Promise<void> {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
    }
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  async navigateAndExtract(url: string): Promise<any> {
    await this.init();
    const page = await this.browser!.newPage();

    try {
      await page.goto(url, { waitUntil: 'networkidle2' });
      
      const data = await page.evaluate(() => {
        return {
          title: document.title,
          content: document.body.innerText,
          links: Array.from(document.querySelectorAll('a')).map(a => ({
            text: a.textContent,
            href: a.href,
          })),
        };
      });

      return data;
    } finally {
      await page.close();
    }
  }

  async fillForm(url: string, formData: Record<string, string>): Promise<boolean> {
    await this.init();
    const page = await this.browser!.newPage();

    try {
      await page.goto(url, { waitUntil: 'networkidle2' });

      for (const [selector, value] of Object.entries(formData)) {
        await page.type(selector, value);
      }

      return true;
    } finally {
      await page.close();
    }
  }
}

export const puppeteerService = new PuppeteerService();

/**
 * Puppeteer Service - Automação Web Completa
 * - Pool de navegadores para performance
 * - Navegação inteligente com wait strategies
 * - Preenchimento automático de formulários
 * - Screenshots e PDFs
 * - Scraping avançado de dados
 * - Interação com elementos (clicks, hover, etc)
 * - Gestão de sessões e cookies
 * - Proxy e user-agent customizáveis
 */
import puppeteer from 'puppeteer';
import { db } from '../db/index.js';
import { puppeteerSessions, puppeteerResults } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { withErrorHandling } from '../middleware/errorHandler.js';
class PuppeteerService {
    constructor() {
        Object.defineProperty(this, "browserPool", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "MAX_BROWSERS", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 3
        });
        Object.defineProperty(this, "activeSessions", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
    }
    /**
     * Inicializar pool de navegadores
     */
    async initPool(count = 1) {
        const needed = Math.min(count, this.MAX_BROWSERS) - this.browserPool.length;
        for (let i = 0; i < needed; i++) {
            const browser = await puppeteer.launch({
                headless: 'new',
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-gpu',
                ],
            });
            this.browserPool.push(browser);
        }
    }
    /**
     * Obter navegador do pool
     */
    async getBrowser(config) {
        // Se tem config customizada, criar novo
        if (config?.proxy || config?.userAgent) {
            return await puppeteer.launch({
                headless: config.headless ?? true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    ...(config.proxy ? [`--proxy-server=${config.proxy}`] : []),
                ],
            });
        }
        // Usar do pool
        if (this.browserPool.length === 0) {
            await this.initPool(1);
        }
        return this.browserPool[0];
    }
    /**
     * Criar nova página com configuração
     */
    async createPage(browser, config) {
        const page = await browser.newPage();
        // User Agent
        if (config?.userAgent) {
            await page.setUserAgent(config.userAgent);
        }
        // Viewport
        if (config?.viewport) {
            await page.setViewport(config.viewport);
        }
        else {
            await page.setViewport({ width: 1920, height: 1080 });
        }
        // Timeout padrão
        page.setDefaultTimeout(config?.timeout || 30000);
        page.setDefaultNavigationTimeout(config?.timeout || 30000);
        return page;
    }
    /**
     * Criar sessão com ID
     */
    async createSession(sessionId, userId = 1, config) {
        return withErrorHandling(async () => {
            const browser = await this.getBrowser(config);
            const page = await this.createPage(browser, config);
            this.activeSessions.set(sessionId, { browser, page });
            // Salvar no banco
            await db.insert(puppeteerSessions).values({
                sessionId,
                userId,
                status: 'active',
                config: config,
            });
            console.log(`✅ Sessão Puppeteer criada: ${sessionId}`);
        }, { name: 'createSession', userId });
    }
    /**
     * Obter sessão existente
     */
    getSession(sessionId) {
        const session = this.activeSessions.get(sessionId);
        if (!session) {
            throw new Error(`Sessão ${sessionId} não encontrada`);
        }
        return session;
    }
    /**
     * Fechar sessão
     */
    async closeSession(sessionId) {
        const session = this.activeSessions.get(sessionId);
        if (session) {
            await session.page.close();
            // Se browser foi criado para essa sessão, fechar
            if (!this.browserPool.includes(session.browser)) {
                await session.browser.close();
            }
            this.activeSessions.delete(sessionId);
            // Atualizar banco
            await db.update(puppeteerSessions)
                .set({ status: 'closed' })
                .where(eq(puppeteerSessions.sessionId, sessionId));
            console.log(`❌ Sessão Puppeteer fechada: ${sessionId}`);
        }
    }
    /**
     * Navegar para URL
     */
    async navigate(sessionId, url, options) {
        return withErrorHandling(async () => {
            const { page } = this.getSession(sessionId);
            await page.goto(url, {
                waitUntil: options?.waitUntil || 'networkidle2',
                timeout: options?.timeout || 30000,
            });
            // Wait adicional se especificado
            if (options?.selector) {
                await page.waitForSelector(options.selector, {
                    timeout: options.timeout || 30000,
                });
            }
            if (options?.waitForFunction) {
                await page.waitForFunction(options.waitForFunction, {
                    timeout: options.timeout || 30000,
                });
            }
            console.log(`🌐 Navegou para: ${url}`);
        }, { name: 'navigate' });
    }
    /**
     * Extrair dados da página
     */
    async extractData(sessionId, selectors) {
        return withErrorHandling(async () => {
            const { page } = this.getSession(sessionId);
            const results = {};
            for (const [key, selector] of Object.entries(selectors)) {
                try {
                    const element = await page.$(selector);
                    if (element) {
                        // Tentar diferentes propriedades
                        const text = await page.evaluate((el) => el.textContent, element);
                        const value = await page.evaluate((el) => el.value, element);
                        const href = await page.evaluate((el) => el.href, element);
                        results[key] = text || value || href || null;
                    }
                    else {
                        results[key] = null;
                    }
                }
                catch (error) {
                    results[key] = null;
                }
            }
            return results;
        }, { name: 'extractData' });
    }
    /**
     * Extrair múltiplos elementos (lista)
     */
    async extractList(sessionId, containerSelector, itemSelectors) {
        return withErrorHandling(async () => {
            const { page } = this.getSession(sessionId);
            return await page.evaluate((container, selectors) => {
                const items = document.querySelectorAll(container);
                const results = [];
                items.forEach((item) => {
                    const itemData = {};
                    for (const [key, selector] of Object.entries(selectors)) {
                        const element = item.querySelector(selector);
                        itemData[key] = element?.textContent?.trim() || null;
                    }
                    results.push(itemData);
                });
                return results;
            }, containerSelector, itemSelectors);
        }, { name: 'extractList' });
    }
    /**
     * Preencher formulário
     */
    async fillForm(sessionId, fields, submitSelector) {
        return withErrorHandling(async () => {
            const { page } = this.getSession(sessionId);
            for (const field of fields) {
                const element = await page.$(field.selector);
                if (!element) {
                    console.warn(`Campo não encontrado: ${field.selector}`);
                    continue;
                }
                switch (field.type || 'text') {
                    case 'text':
                        await element.click({ clickCount: 3 }); // Selecionar tudo
                        await element.type(field.value);
                        break;
                    case 'select':
                        await page.select(field.selector, field.value);
                        break;
                    case 'checkbox':
                    case 'radio':
                        if (field.value === 'true' || field.value === '1') {
                            await element.click();
                        }
                        break;
                    case 'file':
                        await element.uploadFile(field.value);
                        break;
                }
                if (field.waitAfter) {
                    await page.waitForTimeout(field.waitAfter);
                }
            }
            // Submit se especificado
            if (submitSelector) {
                await page.click(submitSelector);
                await page.waitForNavigation({ waitUntil: 'networkidle2' });
            }
            return true;
        }, { name: 'fillForm' });
    }
    /**
     * Click em elemento
     */
    async click(sessionId, selector, options) {
        return withErrorHandling(async () => {
            const { page } = this.getSession(sessionId);
            await page.click(selector);
            if (options?.delay) {
                await page.waitForTimeout(options.delay);
            }
            if (options?.waitForNavigation) {
                await page.waitForNavigation({ waitUntil: 'networkidle2' });
            }
        }, { name: 'click' });
    }
    /**
     * Hover sobre elemento
     */
    async hover(sessionId, selector) {
        return withErrorHandling(async () => {
            const { page } = this.getSession(sessionId);
            await page.hover(selector);
        }, { name: 'hover' });
    }
    /**
     * Tirar screenshot
     */
    async screenshot(sessionId, options) {
        return withErrorHandling(async () => {
            const { page } = this.getSession(sessionId);
            const screenshot = await page.screenshot({
                fullPage: options?.fullPage ?? true,
                type: options?.type || 'png',
                ...options,
            });
            // Salvar resultado no banco se tiver path
            if (options?.path) {
                await db.insert(puppeteerResults).values({
                    sessionId,
                    resultType: 'screenshot',
                    data: screenshot.toString('base64'),
                    url: page.url(),
                });
            }
            return screenshot;
        }, { name: 'screenshot' });
    }
    /**
     * Gerar PDF
     */
    async generatePDF(sessionId, options) {
        return withErrorHandling(async () => {
            const { page } = this.getSession(sessionId);
            const pdf = await page.pdf({
                format: options?.format || 'A4',
                printBackground: options?.printBackground ?? true,
                ...options,
            });
            // Salvar no banco
            await db.insert(puppeteerResults).values({
                sessionId,
                resultType: 'pdf',
                data: pdf.toString('base64'),
                url: page.url(),
            });
            return pdf;
        }, { name: 'generatePDF' });
    }
    /**
     * Executar JavaScript na página
     */
    async evaluate(sessionId, pageFunction, ...args) {
        return withErrorHandling(async () => {
            const { page } = this.getSession(sessionId);
            return await page.evaluate(pageFunction, ...args);
        }, { name: 'evaluate' });
    }
    /**
     * Obter cookies
     */
    async getCookies(sessionId) {
        const { page } = this.getSession(sessionId);
        return await page.cookies();
    }
    /**
     * Definir cookies
     */
    async setCookies(sessionId, cookies) {
        const { page } = this.getSession(sessionId);
        await page.setCookie(...cookies);
    }
    /**
     * Obter URL atual
     */
    async getCurrentURL(sessionId) {
        const { page } = this.getSession(sessionId);
        return page.url();
    }
    /**
     * Voltar página
     */
    async goBack(sessionId) {
        const { page } = this.getSession(sessionId);
        await page.goBack({ waitUntil: 'networkidle2' });
    }
    /**
     * Avançar página
     */
    async goForward(sessionId) {
        const { page } = this.getSession(sessionId);
        await page.goForward({ waitUntil: 'networkidle2' });
    }
    /**
     * Recarregar página
     */
    async reload(sessionId) {
        const { page } = this.getSession(sessionId);
        await page.reload({ waitUntil: 'networkidle2' });
    }
    /**
     * Esperar por seletor
     */
    async waitForSelector(sessionId, selector, timeout) {
        const { page } = this.getSession(sessionId);
        await page.waitForSelector(selector, { timeout: timeout || 30000 });
    }
    /**
     * Rolar página
     */
    async scroll(sessionId, options) {
        const { page } = this.getSession(sessionId);
        if (options.toBottom) {
            await page.evaluate(() => {
                window.scrollTo(0, document.body.scrollHeight);
            });
        }
        else {
            await page.evaluate((x, y) => window.scrollTo(x, y), options.x || 0, options.y || 0);
        }
    }
    /**
     * Limpar todas as sessões
     */
    async closeAll() {
        const sessionIds = Array.from(this.activeSessions.keys());
        for (const sessionId of sessionIds) {
            await this.closeSession(sessionId);
        }
        // Fechar pool
        for (const browser of this.browserPool) {
            await browser.close();
        }
        this.browserPool = [];
        console.log('🧹 Todas as sessões Puppeteer fechadas');
    }
}
export const puppeteerService = new PuppeteerService();

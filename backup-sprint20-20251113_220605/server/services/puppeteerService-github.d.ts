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
import { ScreenshotOptions, PDFOptions } from 'puppeteer';
interface BrowserConfig {
    headless?: boolean;
    proxy?: string;
    userAgent?: string;
    viewport?: {
        width: number;
        height: number;
    };
    timeout?: number;
}
interface WaitOptions {
    waitUntil?: 'load' | 'domcontentloaded' | 'networkidle0' | 'networkidle2';
    timeout?: number;
    selector?: string;
    waitForFunction?: string;
}
interface FormField {
    selector: string;
    value: string;
    type?: 'text' | 'select' | 'checkbox' | 'radio' | 'file';
    waitAfter?: number;
}
declare class PuppeteerService {
    private browserPool;
    private readonly MAX_BROWSERS;
    private activeSessions;
    /**
     * Inicializar pool de navegadores
     */
    initPool(count?: number): Promise<void>;
    /**
     * Obter navegador do pool
     */
    private getBrowser;
    /**
     * Criar nova página com configuração
     */
    private createPage;
    /**
     * Criar sessão com ID
     */
    createSession(sessionId: string, userId?: number, config?: BrowserConfig): Promise<void>;
    /**
     * Obter sessão existente
     */
    private getSession;
    /**
     * Fechar sessão
     */
    closeSession(sessionId: string): Promise<void>;
    /**
     * Navegar para URL
     */
    navigate(sessionId: string, url: string, options?: WaitOptions): Promise<void>;
    /**
     * Extrair dados da página
     */
    extractData(sessionId: string, selectors: Record<string, string>): Promise<Record<string, any>>;
    /**
     * Extrair múltiplos elementos (lista)
     */
    extractList(sessionId: string, containerSelector: string, itemSelectors: Record<string, string>): Promise<Array<Record<string, any>>>;
    /**
     * Preencher formulário
     */
    fillForm(sessionId: string, fields: FormField[], submitSelector?: string): Promise<boolean>;
    /**
     * Click em elemento
     */
    click(sessionId: string, selector: string, options?: {
        waitForNavigation?: boolean;
        delay?: number;
    }): Promise<void>;
    /**
     * Hover sobre elemento
     */
    hover(sessionId: string, selector: string): Promise<void>;
    /**
     * Tirar screenshot
     */
    screenshot(sessionId: string, options?: ScreenshotOptions & {
        path?: string;
    }): Promise<Buffer>;
    /**
     * Gerar PDF
     */
    generatePDF(sessionId: string, options?: PDFOptions): Promise<Buffer>;
    /**
     * Executar JavaScript na página
     */
    evaluate<T>(sessionId: string, pageFunction: string | ((...args: any[]) => T), ...args: any[]): Promise<T>;
    /**
     * Obter cookies
     */
    getCookies(sessionId: string): Promise<any[]>;
    /**
     * Definir cookies
     */
    setCookies(sessionId: string, cookies: Array<{
        name: string;
        value: string;
        domain: string;
    }>): Promise<void>;
    /**
     * Obter URL atual
     */
    getCurrentURL(sessionId: string): Promise<string>;
    /**
     * Voltar página
     */
    goBack(sessionId: string): Promise<void>;
    /**
     * Avançar página
     */
    goForward(sessionId: string): Promise<void>;
    /**
     * Recarregar página
     */
    reload(sessionId: string): Promise<void>;
    /**
     * Esperar por seletor
     */
    waitForSelector(sessionId: string, selector: string, timeout?: number): Promise<void>;
    /**
     * Rolar página
     */
    scroll(sessionId: string, options: {
        x?: number;
        y?: number;
        toBottom?: boolean;
    }): Promise<void>;
    /**
     * Limpar todas as sessões
     */
    closeAll(): Promise<void>;
}
export declare const puppeteerService: PuppeteerService;
export {};

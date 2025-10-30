import { router, publicProcedure } from '../trpc.js';
import { puppeteerService } from '../services/puppeteerService.js';
import { z } from 'zod';

export const puppeteerRouter = router({
  /**
   * Criar nova sessão
   */
  createSession: publicProcedure
    .input(z.object({
      sessionId: z.string(),
      userId: z.number().default(1),
      config: z.object({
        headless: z.boolean().optional(),
        proxy: z.string().optional(),
        userAgent: z.string().optional(),
        viewport: z.object({
          width: z.number(),
          height: z.number(),
        }).optional(),
        timeout: z.number().optional(),
      }).optional(),
    }))
    .mutation(async ({ input }) => {
      await puppeteerService.createSession(
        input.sessionId,
        input.userId,
        input.config
      );
      return { success: true, sessionId: input.sessionId };
    }),

  /**
   * Fechar sessão
   */
  closeSession: publicProcedure
    .input(z.object({
      sessionId: z.string(),
    }))
    .mutation(async ({ input }) => {
      await puppeteerService.closeSession(input.sessionId);
      return { success: true };
    }),

  /**
   * Navegar para URL
   */
  navigate: publicProcedure
    .input(z.object({
      sessionId: z.string(),
      url: z.string().url(),
      waitOptions: z.object({
        waitUntil: z.enum(['load', 'domcontentloaded', 'networkidle0', 'networkidle2']).optional(),
        timeout: z.number().optional(),
        selector: z.string().optional(),
      }).optional(),
    }))
    .mutation(async ({ input }) => {
      await puppeteerService.navigate(
        input.sessionId,
        input.url,
        input.waitOptions
      );
      return { success: true, url: input.url };
    }),

  /**
   * Extrair dados
   */
  extractData: publicProcedure
    .input(z.object({
      sessionId: z.string(),
      selectors: z.record(z.string()),
    }))
    .mutation(async ({ input }) => {
      const data = await puppeteerService.extractData(
        input.sessionId,
        input.selectors
      );
      return { success: true, data };
    }),

  /**
   * Extrair lista
   */
  extractList: publicProcedure
    .input(z.object({
      sessionId: z.string(),
      containerSelector: z.string(),
      itemSelectors: z.record(z.string()),
    }))
    .mutation(async ({ input }) => {
      const items = await puppeteerService.extractList(
        input.sessionId,
        input.containerSelector,
        input.itemSelectors
      );
      return { success: true, items };
    }),

  /**
   * Preencher formulário
   */
  fillForm: publicProcedure
    .input(z.object({
      sessionId: z.string(),
      fields: z.array(z.object({
        selector: z.string(),
        value: z.string(),
        type: z.enum(['text', 'select', 'checkbox', 'radio', 'file']).optional(),
        waitAfter: z.number().optional(),
      })),
      submitSelector: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const success = await puppeteerService.fillForm(
        input.sessionId,
        input.fields,
        input.submitSelector
      );
      return { success };
    }),

  /**
   * Click
   */
  click: publicProcedure
    .input(z.object({
      sessionId: z.string(),
      selector: z.string(),
      waitForNavigation: z.boolean().optional(),
      delay: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      await puppeteerService.click(input.sessionId, input.selector, {
        waitForNavigation: input.waitForNavigation,
        delay: input.delay,
      });
      return { success: true };
    }),

  /**
   * Screenshot
   */
  screenshot: publicProcedure
    .input(z.object({
      sessionId: z.string(),
      fullPage: z.boolean().default(true),
      type: z.enum(['png', 'jpeg']).default('png'),
      savePath: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const buffer = await puppeteerService.screenshot(input.sessionId, {
        fullPage: input.fullPage,
        type: input.type,
        path: input.savePath,
      });
      
      return {
        success: true,
        data: buffer.toString('base64'),
        size: buffer.length,
      };
    }),

  /**
   * Gerar PDF
   */
  generatePDF: publicProcedure
    .input(z.object({
      sessionId: z.string(),
      format: z.enum(['A4', 'Letter']).default('A4'),
      printBackground: z.boolean().default(true),
    }))
    .mutation(async ({ input }) => {
      const buffer = await puppeteerService.generatePDF(input.sessionId, {
        format: input.format,
        printBackground: input.printBackground,
      });
      
      return {
        success: true,
        data: buffer.toString('base64'),
        size: buffer.length,
      };
    }),

  /**
   * Executar JavaScript
   */
  evaluate: publicProcedure
    .input(z.object({
      sessionId: z.string(),
      code: z.string(),
    }))
    .mutation(async ({ input }) => {
      const result = await puppeteerService.evaluate(
        input.sessionId,
        input.code
      );
      return { success: true, result };
    }),

  /**
   * Obter cookies
   */
  getCookies: publicProcedure
    .input(z.object({
      sessionId: z.string(),
    }))
    .query(async ({ input }) => {
      const cookies = await puppeteerService.getCookies(input.sessionId);
      return { success: true, cookies };
    }),

  /**
   * Definir cookies
   */
  setCookies: publicProcedure
    .input(z.object({
      sessionId: z.string(),
      cookies: z.array(z.object({
        name: z.string(),
        value: z.string(),
        domain: z.string(),
      })),
    }))
    .mutation(async ({ input }) => {
      await puppeteerService.setCookies(input.sessionId, input.cookies);
      return { success: true };
    }),

  /**
   * Obter URL atual
   */
  getCurrentURL: publicProcedure
    .input(z.object({
      sessionId: z.string(),
    }))
    .query(async ({ input }) => {
      const url = await puppeteerService.getCurrentURL(input.sessionId);
      return { success: true, url };
    }),

  /**
   * Rolar página
   */
  scroll: publicProcedure
    .input(z.object({
      sessionId: z.string(),
      x: z.number().optional(),
      y: z.number().optional(),
      toBottom: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      await puppeteerService.scroll(input.sessionId, {
        x: input.x,
        y: input.y,
        toBottom: input.toBottom,
      });
      return { success: true };
    }),

  /**
   * Voltar
   */
  goBack: publicProcedure
    .input(z.object({
      sessionId: z.string(),
    }))
    .mutation(async ({ input }) => {
      await puppeteerService.goBack(input.sessionId);
      return { success: true };
    }),

  /**
   * Avançar
   */
  goForward: publicProcedure
    .input(z.object({
      sessionId: z.string(),
    }))
    .mutation(async ({ input }) => {
      await puppeteerService.goForward(input.sessionId);
      return { success: true };
    }),

  /**
   * Recarregar
   */
  reload: publicProcedure
    .input(z.object({
      sessionId: z.string(),
    }))
    .mutation(async ({ input }) => {
      await puppeteerService.reload(input.sessionId);
      return { success: true };
    }),

  /**
   * Fechar todas as sessões
   */
  closeAll: publicProcedure
    .mutation(async () => {
      await puppeteerService.closeAll();
      return { success: true };
    }),
});

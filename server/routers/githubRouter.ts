import { router, publicProcedure } from '../trpc.js';
import { githubService } from '../services/integrations/githubService.js';
import { z } from 'zod';

export const githubRouter = router({
  /**
   * Salvar token de acesso
   */
  saveToken: publicProcedure
    .input(z.object({
      userId: z.number().default(1),
      accessToken: z.string(),
      refreshToken: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      await githubService.saveCredentials(
        input.userId,
        input.accessToken,
        input.refreshToken
      );
      return { success: true };
    }),

  /**
   * Obter usuário autenticado
   */
  getUser: publicProcedure
    .input(z.object({
      userId: z.number().default(1),
    }))
    .query(async ({ input }) => {
      return await githubService.getUser(input.userId);
    }),

  /**
   * Listar repositórios
   */
  listRepos: publicProcedure
    .input(z.object({
      userId: z.number().default(1),
      type: z.enum(['all', 'owner', 'member']).optional(),
      sort: z.string().optional(),
    }))
    .query(async ({ input }) => {
      return await githubService.listRepos(input.userId, {
        type: input.type,
        sort: input.sort,
      });
    }),

  /**
   * Obter repositório
   */
  getRepo: publicProcedure
    .input(z.object({
      userId: z.number().default(1),
      owner: z.string(),
      repo: z.string(),
    }))
    .query(async ({ input }) => {
      return await githubService.getRepo(input.userId, input.owner, input.repo);
    }),

  /**
   * Criar repositório
   */
  createRepo: publicProcedure
    .input(z.object({
      userId: z.number().default(1),
      name: z.string(),
      description: z.string().optional(),
      private: z.boolean().optional(),
      autoInit: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      return await githubService.createRepo(input.userId, {
        name: input.name,
        description: input.description,
        private: input.private,
        autoInit: input.autoInit,
      });
    }),

  /**
   * Deletar repositório
   */
  deleteRepo: publicProcedure
    .input(z.object({
      userId: z.number().default(1),
      owner: z.string(),
      repo: z.string(),
    }))
    .mutation(async ({ input }) => {
      await githubService.deleteRepo(input.userId, input.owner, input.repo);
      return { success: true };
    }),

  /**
   * Listar branches
   */
  listBranches: publicProcedure
    .input(z.object({
      userId: z.number().default(1),
      owner: z.string(),
      repo: z.string(),
    }))
    .query(async ({ input }) => {
      return await githubService.listBranches(input.userId, input.owner, input.repo);
    }),

  /**
   * Criar branch
   */
  createBranch: publicProcedure
    .input(z.object({
      userId: z.number().default(1),
      owner: z.string(),
      repo: z.string(),
      branchName: z.string(),
      fromBranch: z.string().default('main'),
    }))
    .mutation(async ({ input }) => {
      return await githubService.createBranch(
        input.userId,
        input.owner,
        input.repo,
        input.branchName,
        input.fromBranch
      );
    }),

  /**
   * Listar issues
   */
  listIssues: publicProcedure
    .input(z.object({
      userId: z.number().default(1),
      owner: z.string(),
      repo: z.string(),
      state: z.enum(['open', 'closed', 'all']).optional(),
      labels: z.string().optional(),
    }))
    .query(async ({ input }) => {
      return await githubService.listIssues(input.userId, input.owner, input.repo, {
        state: input.state,
        labels: input.labels,
      });
    }),

  /**
   * Criar issue
   */
  createIssue: publicProcedure
    .input(z.object({
      userId: z.number().default(1),
      owner: z.string(),
      repo: z.string(),
      title: z.string(),
      body: z.string().optional(),
      labels: z.array(z.string()).optional(),
      assignees: z.array(z.string()).optional(),
    }))
    .mutation(async ({ input }) => {
      return await githubService.createIssue(input.userId, input.owner, input.repo, {
        title: input.title,
        body: input.body,
        labels: input.labels,
        assignees: input.assignees,
      });
    }),

  /**
   * Fechar issue
   */
  closeIssue: publicProcedure
    .input(z.object({
      userId: z.number().default(1),
      owner: z.string(),
      repo: z.string(),
      issueNumber: z.number(),
    }))
    .mutation(async ({ input }) => {
      return await githubService.closeIssue(
        input.userId,
        input.owner,
        input.repo,
        input.issueNumber
      );
    }),

  /**
   * Listar PRs
   */
  listPRs: publicProcedure
    .input(z.object({
      userId: z.number().default(1),
      owner: z.string(),
      repo: z.string(),
      state: z.enum(['open', 'closed', 'all']).optional(),
    }))
    .query(async ({ input }) => {
      return await githubService.listPRs(input.userId, input.owner, input.repo, {
        state: input.state,
      });
    }),

  /**
   * Criar PR
   */
  createPR: publicProcedure
    .input(z.object({
      userId: z.number().default(1),
      owner: z.string(),
      repo: z.string(),
      title: z.string(),
      body: z.string().optional(),
      head: z.string(),
      base: z.string(),
      draft: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      return await githubService.createPR(input.userId, input.owner, input.repo, {
        title: input.title,
        body: input.body,
        head: input.head,
        base: input.base,
        draft: input.draft,
      });
    }),

  /**
   * Merge PR
   */
  mergePR: publicProcedure
    .input(z.object({
      userId: z.number().default(1),
      owner: z.string(),
      repo: z.string(),
      prNumber: z.number(),
      commitMessage: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      return await githubService.mergePR(
        input.userId,
        input.owner,
        input.repo,
        input.prNumber,
        input.commitMessage
      );
    }),

  /**
   * Listar commits
   */
  listCommits: publicProcedure
    .input(z.object({
      userId: z.number().default(1),
      owner: z.string(),
      repo: z.string(),
      branch: z.string().optional(),
      since: z.string().optional(),
      until: z.string().optional(),
    }))
    .query(async ({ input }) => {
      return await githubService.listCommits(input.userId, input.owner, input.repo, {
        branch: input.branch,
        since: input.since,
        until: input.until,
      });
    }),

  /**
   * Obter conteúdo de arquivo
   */
  getFileContent: publicProcedure
    .input(z.object({
      userId: z.number().default(1),
      owner: z.string(),
      repo: z.string(),
      path: z.string(),
      branch: z.string().optional(),
    }))
    .query(async ({ input }) => {
      return await githubService.getFileContent(
        input.userId,
        input.owner,
        input.repo,
        input.path,
        input.branch
      );
    }),

  /**
   * Criar/atualizar arquivo
   */
  createOrUpdateFile: publicProcedure
    .input(z.object({
      userId: z.number().default(1),
      owner: z.string(),
      repo: z.string(),
      path: z.string(),
      content: z.string(),
      message: z.string(),
      branch: z.string().optional(),
      sha: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      return await githubService.createOrUpdateFile(
        input.userId,
        input.owner,
        input.repo,
        input.path,
        input.content,
        input.message,
        input.branch,
        input.sha
      );
    }),

  /**
   * Deletar arquivo
   */
  deleteFile: publicProcedure
    .input(z.object({
      userId: z.number().default(1),
      owner: z.string(),
      repo: z.string(),
      path: z.string(),
      message: z.string(),
      sha: z.string(),
      branch: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      return await githubService.deleteFile(
        input.userId,
        input.owner,
        input.repo,
        input.path,
        input.message,
        input.sha,
        input.branch
      );
    }),

  /**
   * Fork repositório
   */
  forkRepo: publicProcedure
    .input(z.object({
      userId: z.number().default(1),
      owner: z.string(),
      repo: z.string(),
    }))
    .mutation(async ({ input }) => {
      return await githubService.forkRepo(input.userId, input.owner, input.repo);
    }),

  /**
   * Pesquisar repositórios
   */
  searchRepos: publicProcedure
    .input(z.object({
      userId: z.number().default(1),
      query: z.string(),
      sort: z.string().optional(),
      order: z.enum(['asc', 'desc']).optional(),
      perPage: z.number().optional(),
    }))
    .query(async ({ input }) => {
      return await githubService.searchRepos(input.userId, input.query, {
        sort: input.sort,
        order: input.order,
        perPage: input.perPage,
      });
    }),
});

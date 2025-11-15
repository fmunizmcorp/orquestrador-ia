/**
 * GitHub Integration Service
 * Integração completa com GitHub API
 * - OAuth flow
 * - Repositórios (CRUD, clone, fork)
 * - Issues e Pull Requests
 * - Commits e branches
 * - Releases e tags
 * - Webhooks
 * - Actions
 */
interface RepoOptions {
    name: string;
    description?: string;
    private?: boolean;
    autoInit?: boolean;
}
interface IssueOptions {
    title: string;
    body?: string;
    labels?: string[];
    assignees?: string[];
}
interface PROptions {
    title: string;
    body?: string;
    head: string;
    base: string;
    draft?: boolean;
}
declare class GitHubService {
    /**
     * Obter credenciais do usuário
     */
    private getCredentials;
    /**
     * Salvar credenciais
     */
    saveCredentials(userId: number, accessToken: string, refreshToken?: string): Promise<void>;
    /**
     * Fazer request autenticado
     */
    private request;
    /**
     * Obter usuário autenticado
     */
    getUser(userId: number): Promise<any>;
    /**
     * Listar repositórios
     */
    listRepos(userId: number, options?: {
        type?: 'all' | 'owner' | 'member';
        sort?: string;
    }): Promise<any[]>;
    /**
     * Obter repositório
     */
    getRepo(userId: number, owner: string, repo: string): Promise<any>;
    /**
     * Criar repositório
     */
    createRepo(userId: number, options: RepoOptions): Promise<any>;
    /**
     * Deletar repositório
     */
    deleteRepo(userId: number, owner: string, repo: string): Promise<void>;
    /**
     * Listar branches
     */
    listBranches(userId: number, owner: string, repo: string): Promise<any[]>;
    /**
     * Criar branch
     */
    createBranch(userId: number, owner: string, repo: string, branchName: string, fromBranch?: string): Promise<any>;
    /**
     * Listar issues
     */
    listIssues(userId: number, owner: string, repo: string, options?: {
        state?: 'open' | 'closed' | 'all';
        labels?: string;
    }): Promise<any[]>;
    /**
     * Criar issue
     */
    createIssue(userId: number, owner: string, repo: string, options: IssueOptions): Promise<any>;
    /**
     * Fechar issue
     */
    closeIssue(userId: number, owner: string, repo: string, issueNumber: number): Promise<any>;
    /**
     * Listar Pull Requests
     */
    listPRs(userId: number, owner: string, repo: string, options?: {
        state?: 'open' | 'closed' | 'all';
    }): Promise<any[]>;
    /**
     * Criar Pull Request
     */
    createPR(userId: number, owner: string, repo: string, options: PROptions): Promise<any>;
    /**
     * Merge Pull Request
     */
    mergePR(userId: number, owner: string, repo: string, prNumber: number, commitMessage?: string): Promise<any>;
    /**
     * Listar commits
     */
    listCommits(userId: number, owner: string, repo: string, options?: {
        branch?: string;
        since?: string;
        until?: string;
    }): Promise<any[]>;
    /**
     * Obter conteúdo de arquivo
     */
    getFileContent(userId: number, owner: string, repo: string, path: string, branch?: string): Promise<{
        content: string;
        sha: string;
    }>;
    /**
     * Criar/atualizar arquivo
     */
    createOrUpdateFile(userId: number, owner: string, repo: string, path: string, content: string, message: string, branch?: string, sha?: string): Promise<any>;
    /**
     * Deletar arquivo
     */
    deleteFile(userId: number, owner: string, repo: string, path: string, message: string, sha: string, branch?: string): Promise<any>;
    /**
     * Listar releases
     */
    listReleases(userId: number, owner: string, repo: string): Promise<any[]>;
    /**
     * Criar release
     */
    createRelease(userId: number, owner: string, repo: string, tagName: string, name: string, body?: string, draft?: boolean): Promise<any>;
    /**
     * Fork repositório
     */
    forkRepo(userId: number, owner: string, repo: string): Promise<any>;
    /**
     * Pesquisar repositórios
     */
    searchRepos(userId: number, query: string, options?: {
        sort?: string;
        order?: 'asc' | 'desc';
        perPage?: number;
    }): Promise<any>;
}
export declare const githubService: GitHubService;
export {};

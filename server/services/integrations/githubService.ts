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

import axios from 'axios';
import { db } from '../../db/index.js';
import { credentials } from '../../db/schema.js';
import { eq, and } from 'drizzle-orm';
import { withErrorHandling, ExternalServiceError } from '../../middleware/errorHandler.js';
import CryptoJS from 'crypto-js';

const GITHUB_API = 'https://api.github.com';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-key-change-in-production';

interface GitHubCredentials {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
}

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

class GitHubService {
  /**
   * Obter credenciais do usuário
   */
  private async getCredentials(userId: number): Promise<GitHubCredentials> {
    const [cred] = await db.select()
      .from(credentials)
      .where(and(
        eq(credentials.userId, userId),
        eq(credentials.service, 'github')
      ))
      .limit(1);

    if (!cred) {
      throw new ExternalServiceError('GitHub', 'Credenciais não encontradas');
    }

    // Decrypt
    const bytes = CryptoJS.AES.decrypt(cred.encryptedData, ENCRYPTION_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    
    return JSON.parse(decrypted);
  }

  /**
   * Salvar credenciais
   */
  async saveCredentials(
    userId: number,
    accessToken: string,
    refreshToken?: string
  ): Promise<void> {
    const data: GitHubCredentials = {
      accessToken,
      refreshToken,
      expiresAt: refreshToken ? new Date(Date.now() + 8 * 60 * 60 * 1000) : undefined, // 8h
    };

    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      ENCRYPTION_KEY
    ).toString();

    // Upsert
    const existing = await db.select()
      .from(credentials)
      .where(and(
        eq(credentials.userId, userId),
        eq(credentials.service, 'github')
      ))
      .limit(1);

    if (existing.length > 0) {
      await db.update(credentials)
        .set({ encryptedData: encrypted, updatedAt: new Date() })
        .where(eq(credentials.id, existing[0].id));
    } else {
      await db.insert(credentials).values({
        userId,
        service: 'github',
        credentialType: 'oauth',
        encryptedData: encrypted,
        isActive: true,
      });
    }
  }

  /**
   * Fazer request autenticado
   */
  private async request(
    userId: number,
    method: string,
    endpoint: string,
    data?: any
  ): Promise<any> {
    return withErrorHandling(
      async () => {
        const creds = await this.getCredentials(userId);

        const response = await axios({
          method,
          url: `${GITHUB_API}${endpoint}`,
          headers: {
            Authorization: `Bearer ${creds.accessToken}`,
            Accept: 'application/vnd.github+json',
          },
          data,
        });

        return response.data;
      },
      { name: 'githubRequest', userId }
    );
  }

  /**
   * Obter usuário autenticado
   */
  async getUser(userId: number): Promise<any> {
    return this.request(userId, 'GET', '/user');
  }

  /**
   * Listar repositórios
   */
  async listRepos(
    userId: number,
    options?: { type?: 'all' | 'owner' | 'member'; sort?: string }
  ): Promise<any[]> {
    const params = new URLSearchParams();
    if (options?.type) params.append('type', options.type);
    if (options?.sort) params.append('sort', options.sort);

    return this.request(userId, 'GET', `/user/repos?${params}`);
  }

  /**
   * Obter repositório
   */
  async getRepo(userId: number, owner: string, repo: string): Promise<any> {
    return this.request(userId, 'GET', `/repos/${owner}/${repo}`);
  }

  /**
   * Criar repositório
   */
  async createRepo(userId: number, options: RepoOptions): Promise<any> {
    return this.request(userId, 'POST', '/user/repos', {
      name: options.name,
      description: options.description,
      private: options.private ?? false,
      auto_init: options.autoInit ?? true,
    });
  }

  /**
   * Deletar repositório
   */
  async deleteRepo(userId: number, owner: string, repo: string): Promise<void> {
    await this.request(userId, 'DELETE', `/repos/${owner}/${repo}`);
  }

  /**
   * Listar branches
   */
  async listBranches(userId: number, owner: string, repo: string): Promise<any[]> {
    return this.request(userId, 'GET', `/repos/${owner}/${repo}/branches`);
  }

  /**
   * Criar branch
   */
  async createBranch(
    userId: number,
    owner: string,
    repo: string,
    branchName: string,
    fromBranch: string = 'main'
  ): Promise<any> {
    // Get SHA of from branch
    const fromRef = await this.request(
      userId,
      'GET',
      `/repos/${owner}/${repo}/git/ref/heads/${fromBranch}`
    );

    // Create new branch
    return this.request(userId, 'POST', `/repos/${owner}/${repo}/git/refs`, {
      ref: `refs/heads/${branchName}`,
      sha: fromRef.object.sha,
    });
  }

  /**
   * Listar issues
   */
  async listIssues(
    userId: number,
    owner: string,
    repo: string,
    options?: { state?: 'open' | 'closed' | 'all'; labels?: string }
  ): Promise<any[]> {
    const params = new URLSearchParams();
    if (options?.state) params.append('state', options.state);
    if (options?.labels) params.append('labels', options.labels);

    return this.request(userId, 'GET', `/repos/${owner}/${repo}/issues?${params}`);
  }

  /**
   * Criar issue
   */
  async createIssue(
    userId: number,
    owner: string,
    repo: string,
    options: IssueOptions
  ): Promise<any> {
    return this.request(userId, 'POST', `/repos/${owner}/${repo}/issues`, {
      title: options.title,
      body: options.body,
      labels: options.labels,
      assignees: options.assignees,
    });
  }

  /**
   * Fechar issue
   */
  async closeIssue(
    userId: number,
    owner: string,
    repo: string,
    issueNumber: number
  ): Promise<any> {
    return this.request(
      userId,
      'PATCH',
      `/repos/${owner}/${repo}/issues/${issueNumber}`,
      { state: 'closed' }
    );
  }

  /**
   * Listar Pull Requests
   */
  async listPRs(
    userId: number,
    owner: string,
    repo: string,
    options?: { state?: 'open' | 'closed' | 'all' }
  ): Promise<any[]> {
    const params = new URLSearchParams();
    if (options?.state) params.append('state', options.state);

    return this.request(userId, 'GET', `/repos/${owner}/${repo}/pulls?${params}`);
  }

  /**
   * Criar Pull Request
   */
  async createPR(
    userId: number,
    owner: string,
    repo: string,
    options: PROptions
  ): Promise<any> {
    return this.request(userId, 'POST', `/repos/${owner}/${repo}/pulls`, {
      title: options.title,
      body: options.body,
      head: options.head,
      base: options.base,
      draft: options.draft ?? false,
    });
  }

  /**
   * Merge Pull Request
   */
  async mergePR(
    userId: number,
    owner: string,
    repo: string,
    prNumber: number,
    commitMessage?: string
  ): Promise<any> {
    return this.request(
      userId,
      'PUT',
      `/repos/${owner}/${repo}/pulls/${prNumber}/merge`,
      { commit_message: commitMessage }
    );
  }

  /**
   * Listar commits
   */
  async listCommits(
    userId: number,
    owner: string,
    repo: string,
    options?: { branch?: string; since?: string; until?: string }
  ): Promise<any[]> {
    const params = new URLSearchParams();
    if (options?.branch) params.append('sha', options.branch);
    if (options?.since) params.append('since', options.since);
    if (options?.until) params.append('until', options.until);

    return this.request(userId, 'GET', `/repos/${owner}/${repo}/commits?${params}`);
  }

  /**
   * Obter conteúdo de arquivo
   */
  async getFileContent(
    userId: number,
    owner: string,
    repo: string,
    path: string,
    branch?: string
  ): Promise<{ content: string; sha: string }> {
    const params = branch ? `?ref=${branch}` : '';
    const response = await this.request(
      userId,
      'GET',
      `/repos/${owner}/${repo}/contents/${path}${params}`
    );

    // Decode base64
    const content = Buffer.from(response.content, 'base64').toString('utf-8');

    return {
      content,
      sha: response.sha,
    };
  }

  /**
   * Criar/atualizar arquivo
   */
  async createOrUpdateFile(
    userId: number,
    owner: string,
    repo: string,
    path: string,
    content: string,
    message: string,
    branch?: string,
    sha?: string
  ): Promise<any> {
    const encoded = Buffer.from(content).toString('base64');

    return this.request(
      userId,
      'PUT',
      `/repos/${owner}/${repo}/contents/${path}`,
      {
        message,
        content: encoded,
        branch,
        sha, // Required for updates
      }
    );
  }

  /**
   * Deletar arquivo
   */
  async deleteFile(
    userId: number,
    owner: string,
    repo: string,
    path: string,
    message: string,
    sha: string,
    branch?: string
  ): Promise<any> {
    return this.request(
      userId,
      'DELETE',
      `/repos/${owner}/${repo}/contents/${path}`,
      { message, sha, branch }
    );
  }

  /**
   * Listar releases
   */
  async listReleases(userId: number, owner: string, repo: string): Promise<any[]> {
    return this.request(userId, 'GET', `/repos/${owner}/${repo}/releases`);
  }

  /**
   * Criar release
   */
  async createRelease(
    userId: number,
    owner: string,
    repo: string,
    tagName: string,
    name: string,
    body?: string,
    draft: boolean = false
  ): Promise<any> {
    return this.request(userId, 'POST', `/repos/${owner}/${repo}/releases`, {
      tag_name: tagName,
      name,
      body,
      draft,
    });
  }

  /**
   * Fork repositório
   */
  async forkRepo(userId: number, owner: string, repo: string): Promise<any> {
    return this.request(userId, 'POST', `/repos/${owner}/${repo}/forks`);
  }

  /**
   * Pesquisar repositórios
   */
  async searchRepos(userId: number, query: string, options?: {
    sort?: string;
    order?: 'asc' | 'desc';
    perPage?: number;
  }): Promise<any> {
    const params = new URLSearchParams();
    params.append('q', query);
    if (options?.sort) params.append('sort', options.sort);
    if (options?.order) params.append('order', options.order);
    if (options?.perPage) params.append('per_page', options.perPage.toString());

    return this.request(userId, 'GET', `/search/repositories?${params}`);
  }
}

export const githubService = new GitHubService();

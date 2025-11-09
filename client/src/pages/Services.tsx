import { useState, useEffect } from 'react';
import { trpc } from '../lib/trpc';
import { useAuth } from '../contexts/AuthContext';

type ServicesTab = 'services' | 'oauth' | 'credentials' | 'github' | 'gmail' | 'drive' | 'sheets' | 'statistics';

type ServiceName = 'github' | 'gmail' | 'drive' | 'sheets' | 'notion' | 'slack' | 'discord';

interface ServiceConfigModalData {
  serviceId: number;
  serviceName: ServiceName;
  config: Record<string, any>;
}

interface OAuthToken {
  id: number;
  userId: number;
  provider: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
  createdAt: Date;
}

interface ApiCredential {
  id: number;
  userId: number;
  serviceName: string;
  credentialName: string;
  encryptedData: string;
  createdAt: Date;
}

interface CredentialFormData {
  serviceName: string;
  credentialName: string;
  apiKey: string;
  apiSecret?: string;
}

interface GithubRepoData {
  owner: string;
  repo: string;
  selectedRepo?: any;
}

interface GithubIssueFormData {
  owner: string;
  repo: string;
  title: string;
  body: string;
  labels: string[];
}

interface GmailMessageFormData {
  to: string[];
  subject: string;
  body: string;
  cc?: string[];
  bcc?: string[];
}

interface DriveFileFormData {
  name: string;
  mimeType: string;
  content: string;
  folderId?: string;
}

interface SheetsFormData {
  spreadsheetId: string;
  range: string;
  sheetName?: string;
  values: string[][];
}

export default function Services() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<ServicesTab>('services');

  // Services state
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [configModalData, setConfigModalData] = useState<ServiceConfigModalData | null>(null);

  // OAuth state
  const [selectedOAuthToken, setSelectedOAuthToken] = useState<number | null>(null);

  // API Credentials state
  const [showCredentialModal, setShowCredentialModal] = useState(false);
  const [credentialForm, setCredentialForm] = useState<CredentialFormData>({
    serviceName: 'openai',
    credentialName: '',
    apiKey: '',
    apiSecret: '',
  });

  // GitHub state
  const [githubData, setGithubData] = useState<GithubRepoData>({
    owner: '',
    repo: '',
  });
  const [showGithubIssueModal, setShowGithubIssueModal] = useState(false);
  const [githubIssueForm, setGithubIssueForm] = useState<GithubIssueFormData>({
    owner: '',
    repo: '',
    title: '',
    body: '',
    labels: [],
  });
  const [githubIssueState, setGithubIssueState] = useState<'open' | 'closed' | 'all'>('open');

  // Gmail state
  const [showGmailModal, setShowGmailModal] = useState(false);
  const [gmailForm, setGmailForm] = useState<GmailMessageFormData>({
    to: [],
    subject: '',
    body: '',
    cc: [],
    bcc: [],
  });
  const [gmailSearchQuery, setGmailSearchQuery] = useState('');

  // Drive state
  const [showDriveUploadModal, setShowDriveUploadModal] = useState(false);
  const [driveForm, setDriveForm] = useState<DriveFileFormData>({
    name: '',
    mimeType: 'text/plain',
    content: '',
  });
  const [selectedDriveFile, setSelectedDriveFile] = useState<string | null>(null);

  // Sheets state
  const [showSheetsModal, setShowSheetsModal] = useState(false);
  const [sheetsForm, setSheetsForm] = useState<SheetsFormData>({
    spreadsheetId: '',
    range: 'Sheet1!A1:Z100',
    sheetName: 'Sheet1',
    values: [['']],
  });
  const [sheetsOperation, setSheetsOperation] = useState<'read' | 'write' | 'append' | 'create'>('read');

  // tRPC queries
  const { data: servicesData, isLoading: servicesLoading, refetch: refetchServices } = trpc.services.listServices.useQuery({
    userId: user?.id,
  });

  const { data: oauthTokensData, isLoading: oauthLoading, refetch: refetchOAuth } = trpc.services.listOAuthTokens.useQuery({
    userId: user?.id || 0,
  }, {
    enabled: !!user?.id && activeTab === 'oauth',
  });

  const { data: credentialsData, isLoading: credentialsLoading, refetch: refetchCredentials } = trpc.services.listApiCredentials.useQuery({
    userId: user?.id || 0,
  }, {
    enabled: !!user?.id && activeTab === 'credentials',
  });

  const { data: githubReposData, isLoading: githubReposLoading } = trpc.services.githubListRepos.useQuery({
    serviceId: servicesData?.services?.find((s: any) => s.serviceName === 'github')?.id || 0,
  }, {
    enabled: activeTab === 'github' && !!servicesData?.services?.find((s: any) => s.serviceName === 'github' && s.isActive),
  });

  const { data: githubIssuesData, isLoading: githubIssuesLoading } = trpc.services.githubListIssues.useQuery({
    serviceId: servicesData?.services?.find((s: any) => s.serviceName === 'github')?.id || 0,
    owner: githubData.owner,
    repo: githubData.repo,
    state: githubIssueState,
  }, {
    enabled: activeTab === 'github' && !!githubData.owner && !!githubData.repo,
  });

  const { data: gmailMessagesData, isLoading: gmailMessagesLoading } = trpc.services.gmailListMessages.useQuery({
    serviceId: servicesData?.services?.find((s: any) => s.serviceName === 'gmail')?.id || 0,
    maxResults: 20,
    query: gmailSearchQuery,
  }, {
    enabled: activeTab === 'gmail' && !!servicesData?.services?.find((s: any) => s.serviceName === 'gmail' && s.isActive),
  });

  const { data: driveFilesData, isLoading: driveFilesLoading } = trpc.services.driveListFiles.useQuery({
    serviceId: servicesData?.services?.find((s: any) => s.serviceName === 'drive')?.id || 0,
    pageSize: 50,
  }, {
    enabled: activeTab === 'drive' && !!servicesData?.services?.find((s: any) => s.serviceName === 'drive' && s.isActive),
  });

  // tRPC mutations
  const createServiceMutation = trpc.services.createService.useMutation({
    onSuccess: () => {
      refetchServices();
      alert('Service connected successfully!');
    },
    onError: (error) => {
      alert(`Failed to connect service: ${error.message}`);
    },
  });

  const updateServiceMutation = trpc.services.updateService.useMutation({
    onSuccess: () => {
      refetchServices();
      setShowConfigModal(false);
      alert('Service configuration updated!');
    },
  });

  const deleteServiceMutation = trpc.services.deleteService.useMutation({
    onSuccess: () => {
      refetchServices();
      alert('Service disconnected!');
    },
  });

  const createCredentialMutation = trpc.services.createApiCredential.useMutation({
    onSuccess: () => {
      refetchCredentials();
      setShowCredentialModal(false);
      setCredentialForm({
        serviceName: 'openai',
        credentialName: '',
        apiKey: '',
        apiSecret: '',
      });
      alert('Credential added successfully!');
    },
  });

  const deleteCredentialMutation = trpc.services.deleteApiCredential.useMutation({
    onSuccess: () => {
      refetchCredentials();
      alert('Credential deleted!');
    },
  });

  const revokeOAuthMutation = trpc.services.revokeOAuthToken.useMutation({
    onSuccess: () => {
      refetchOAuth();
      alert('Token revoked successfully!');
    },
  });

  const createGithubIssueMutation = trpc.services.githubCreateIssue.useMutation({
    onSuccess: () => {
      setShowGithubIssueModal(false);
      setGithubIssueForm({ owner: '', repo: '', title: '', body: '', labels: [] });
      alert('GitHub issue created!');
    },
  });

  const sendGmailMutation = trpc.services.gmailSendMessage.useMutation({
    onSuccess: () => {
      setShowGmailModal(false);
      setGmailForm({ to: [], subject: '', body: '', cc: [], bcc: [] });
      alert('Email sent successfully!');
    },
  });

  const uploadDriveMutation = trpc.services.driveUploadFile.useMutation({
    onSuccess: () => {
      setShowDriveUploadModal(false);
      setDriveForm({ name: '', mimeType: 'text/plain', content: '' });
      alert('File uploaded to Drive!');
    },
  });

  const deleteDriveMutation = trpc.services.driveDeleteFile.useMutation({
    onSuccess: () => {
      alert('File deleted from Drive!');
    },
  });

  // Service icons and descriptions
  const serviceIcons: Record<ServiceName, string> = {
    github: '🐙',
    gmail: '📧',
    drive: '📁',
    sheets: '📊',
    notion: '📝',
    slack: '💬',
    discord: '🎮',
  };

  const serviceDescriptions: Record<ServiceName, string> = {
    github: 'Acesse repositórios, issues e pull requests',
    gmail: 'Envie e receba emails automaticamente',
    drive: 'Gerencie arquivos e pastas na nuvem',
    sheets: 'Leia e escreva em planilhas',
    notion: 'Sincronize páginas e bancos de dados',
    slack: 'Envie mensagens para canais e usuários',
    discord: 'Integre com servidores Discord',
  };

  const availableServices: ServiceName[] = ['github', 'gmail', 'drive', 'sheets', 'notion', 'slack', 'discord'];

  const allServices = availableServices.map(serviceName => {
    const activeService = servicesData?.services?.find((s: any) => s.serviceName === serviceName);
    return {
      name: serviceName.charAt(0).toUpperCase() + serviceName.slice(1),
      serviceName,
      status: activeService?.isActive ? 'connected' : 'disconnected',
      icon: serviceIcons[serviceName] || '🔧',
      id: activeService?.id,
      config: activeService?.config,
    };
  });

  // Handle service connection
  const handleConnect = (serviceName: ServiceName) => {
    if (!user?.id) return;
    createServiceMutation.mutate({
      userId: user.id,
      serviceName,
      config: {},
    });
  };

  // Handle service disconnection
  const handleDisconnect = (serviceId: number) => {
    if (confirm('Are you sure you want to disconnect this service?')) {
      deleteServiceMutation.mutate({ id: serviceId });
    }
  };

  // Handle service configuration
  const handleConfigure = (service: any) => {
    setConfigModalData({
      serviceId: service.id,
      serviceName: service.serviceName,
      config: service.config ? JSON.parse(service.config) : {},
    });
    setShowConfigModal(true);
  };

  // Handle credential creation
  const handleCreateCredential = () => {
    if (!user?.id) return;
    if (!credentialForm.credentialName || !credentialForm.apiKey) {
      alert('Please fill in all required fields');
      return;
    }

    // Simple encryption (in production, use proper encryption)
    const encryptedData = btoa(JSON.stringify({
      apiKey: credentialForm.apiKey,
      apiSecret: credentialForm.apiSecret,
    }));

    createCredentialMutation.mutate({
      userId: user.id,
      serviceName: credentialForm.serviceName,
      credentialName: credentialForm.credentialName,
      encryptedData,
    });
  };

  // Handle GitHub issue creation
  const handleCreateGithubIssue = () => {
    if (!githubIssueForm.owner || !githubIssueForm.repo || !githubIssueForm.title) {
      alert('Please fill in owner, repo, and title');
      return;
    }

    const serviceId = servicesData?.services?.find((s: any) => s.serviceName === 'github')?.id;
    if (!serviceId) {
      alert('GitHub service not connected');
      return;
    }

    createGithubIssueMutation.mutate({
      serviceId,
      owner: githubIssueForm.owner,
      repo: githubIssueForm.repo,
      title: githubIssueForm.title,
      body: githubIssueForm.body,
      labels: githubIssueForm.labels,
    });
  };

  // Handle Gmail send
  const handleSendGmail = () => {
    if (!gmailForm.to.length || !gmailForm.subject) {
      alert('Please fill in recipient and subject');
      return;
    }

    const serviceId = servicesData?.services?.find((s: any) => s.serviceName === 'gmail')?.id;
    if (!serviceId) {
      alert('Gmail service not connected');
      return;
    }

    sendGmailMutation.mutate({
      serviceId,
      to: gmailForm.to,
      subject: gmailForm.subject,
      body: gmailForm.body,
      cc: gmailForm.cc,
      bcc: gmailForm.bcc,
    });
  };

  // Handle Drive upload
  const handleUploadDrive = () => {
    if (!driveForm.name || !driveForm.content) {
      alert('Please fill in name and content');
      return;
    }

    const serviceId = servicesData?.services?.find((s: any) => s.serviceName === 'drive')?.id;
    if (!serviceId) {
      alert('Drive service not connected');
      return;
    }

    uploadDriveMutation.mutate({
      serviceId,
      name: driveForm.name,
      mimeType: driveForm.mimeType,
      content: btoa(driveForm.content), // Base64 encode
      folderId: driveForm.folderId,
    });
  };

  // Calculate statistics
  const totalServices = allServices.length;
  const connectedServices = allServices.filter(s => s.status === 'connected').length;
  const totalOAuthTokens = oauthTokensData?.tokens?.length || 0;
  const totalCredentials = credentialsData?.credentials?.length || 0;
  const githubRepoCount = githubReposData?.repos?.length || 0;
  const gmailMessageCount = gmailMessagesData?.messages?.length || 0;
  const driveFileCount = driveFilesData?.files?.length || 0;

  const tabs = [
    { id: 'services', label: 'Services', icon: '🔌' },
    { id: 'oauth', label: 'OAuth Tokens', icon: '🔑' },
    { id: 'credentials', label: 'API Credentials', icon: '🔐' },
    { id: 'github', label: 'GitHub', icon: '🐙' },
    { id: 'gmail', label: 'Gmail', icon: '📧' },
    { id: 'drive', label: 'Drive', icon: '📁' },
    { id: 'sheets', label: 'Sheets', icon: '📊' },
    { id: 'statistics', label: 'Statistics', icon: '📈' },
  ] as const;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">External Services</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Connect and manage integrations with external services
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ServicesTab)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }
              `}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Services Tab */}
      {activeTab === 'services' && (
        <div>
          {servicesLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 dark:text-gray-300 mt-4">Loading services...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allServices.map((service) => (
                <div key={service.name} className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{service.icon}</span>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{service.name}</h3>
                          <span
                            className={`inline-block text-xs px-2 py-1 rounded-full mt-1 ${
                              service.status === 'connected'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                            }`}
                          >
                            {service.status === 'connected' ? 'Connected' : 'Disconnected'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300 mb-4">
                      <p>{serviceDescriptions[service.serviceName] || 'Integration service'}</p>
                    </div>

                    <div className="flex gap-2">
                      {service.status === 'connected' ? (
                        <>
                          <button
                            onClick={() => handleConfigure(service)}
                            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                          >
                            Configure
                          </button>
                          <button 
                            onClick={() => handleDisconnect(service.id)}
                            className="flex-1 border border-red-300 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm font-medium"
                          >
                            Disconnect
                          </button>
                        </>
                      ) : (
                        <button 
                          onClick={() => handleConnect(service.serviceName)}
                          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          Connect
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* OAuth Tokens Tab */}
      {activeTab === 'oauth' && (
        <div>
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">OAuth Tokens</h2>
            <button
              onClick={() => refetchOAuth()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              Refresh
            </button>
          </div>

          {oauthLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : oauthTokensData?.tokens?.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
              <p className="text-gray-600 dark:text-gray-300">No OAuth tokens found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {oauthTokensData?.tokens?.map((token: OAuthToken) => (
                <div key={token.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{token.provider}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        Created: {new Date(token.createdAt).toLocaleDateString()}
                      </p>
                      {token.expiresAt && (
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Expires: {new Date(token.expiresAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => revokeOAuthMutation.mutate({ tokenId: token.id })}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                    >
                      Revoke
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* API Credentials Tab */}
      {activeTab === 'credentials' && (
        <div>
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">API Credentials</h2>
            <button
              onClick={() => setShowCredentialModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              Add Credential
            </button>
          </div>

          {credentialsLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : credentialsData?.credentials?.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No credentials configured</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Add API keys for OpenAI, Anthropic, and other services
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {credentialsData?.credentials?.map((cred: ApiCredential) => (
                <div key={cred.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{cred.credentialName}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{cred.serviceName}</p>
                    </div>
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full">
                      Active
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Created: {new Date(cred.createdAt).toLocaleDateString()}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => deleteCredentialMutation.mutate({ id: cred.id })}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* GitHub Tab */}
      {activeTab === 'github' && (
        <div>
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">GitHub Integration</h2>
            
            {!allServices.find(s => s.serviceName === 'github' && s.status === 'connected') ? (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
                <p className="text-gray-600 dark:text-gray-300">Please connect GitHub service first</p>
                <button
                  onClick={() => setActiveTab('services')}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Go to Services
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Repository selector */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-4">Select Repository</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Owner (e.g., facebook)"
                      value={githubData.owner}
                      onChange={(e) => setGithubData({ ...githubData, owner: e.target.value })}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="Repo (e.g., react)"
                      value={githubData.repo}
                      onChange={(e) => setGithubData({ ...githubData, repo: e.target.value })}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Issues list */}
                {githubData.owner && githubData.repo && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-md font-semibold text-gray-900 dark:text-white">Issues</h3>
                      <div className="flex gap-2">
                        <select
                          value={githubIssueState}
                          onChange={(e) => setGithubIssueState(e.target.value as 'open' | 'closed' | 'all')}
                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        >
                          <option value="open">Open</option>
                          <option value="closed">Closed</option>
                          <option value="all">All</option>
                        </select>
                        <button
                          onClick={() => {
                            setGithubIssueForm({ ...githubIssueForm, owner: githubData.owner, repo: githubData.repo });
                            setShowGithubIssueModal(true);
                          }}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                        >
                          Create Issue
                        </button>
                      </div>
                    </div>

                    {githubIssuesLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {githubIssuesData?.issues?.length === 0 ? (
                          <p className="text-gray-600 dark:text-gray-300 text-center py-4">No issues found</p>
                        ) : (
                          githubIssuesData?.issues?.map((issue: any) => (
                            <div key={issue.number} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-semibold text-gray-900 dark:text-white">#{issue.number} {issue.title}</h4>
                                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{issue.body?.substring(0, 100)}...</p>
                                </div>
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  issue.state === 'open'
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                                }`}>
                                  {issue.state}
                                </span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Repositories list */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-4">Your Repositories</h3>
                  {githubReposLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {githubReposData?.repos?.slice(0, 6).map((repo: any) => (
                        <div key={repo.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 cursor-pointer">
                          <h4 className="font-semibold text-gray-900 dark:text-white">{repo.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{repo.description || 'No description'}</p>
                          <div className="flex gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                            <span>⭐ {repo.stargazers_count || 0}</span>
                            <span>🍴 {repo.forks_count || 0}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Gmail Tab */}
      {activeTab === 'gmail' && (
        <div>
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Gmail Integration</h2>
              {allServices.find(s => s.serviceName === 'gmail' && s.status === 'connected') && (
                <button
                  onClick={() => setShowGmailModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  Compose Email
                </button>
              )}
            </div>

            {!allServices.find(s => s.serviceName === 'gmail' && s.status === 'connected') ? (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
                <p className="text-gray-600 dark:text-gray-300">Please connect Gmail service first</p>
                <button
                  onClick={() => setActiveTab('services')}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Go to Services
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Search bar */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                  <input
                    type="text"
                    placeholder="Search emails..."
                    value={gmailSearchQuery}
                    onChange={(e) => setGmailSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                {/* Messages list */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-4">Recent Messages</h3>
                  {gmailMessagesLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {gmailMessagesData?.messages?.length === 0 ? (
                        <p className="text-gray-600 dark:text-gray-300 text-center py-4">No messages found</p>
                      ) : (
                        gmailMessagesData?.messages?.map((message: any) => (
                          <div key={message.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 cursor-pointer">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 dark:text-white">{message.from || 'Unknown'}</h4>
                                <p className="text-sm text-gray-900 dark:text-white mt-1">{message.subject || '(No subject)'}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{message.snippet?.substring(0, 100)}...</p>
                              </div>
                              <span className="text-xs text-gray-500 dark:text-gray-400">{message.date}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Drive Tab */}
      {activeTab === 'drive' && (
        <div>
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Google Drive Integration</h2>
              {allServices.find(s => s.serviceName === 'drive' && s.status === 'connected') && (
                <button
                  onClick={() => setShowDriveUploadModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  Upload File
                </button>
              )}
            </div>

            {!allServices.find(s => s.serviceName === 'drive' && s.status === 'connected') ? (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
                <p className="text-gray-600 dark:text-gray-300">Please connect Drive service first</p>
                <button
                  onClick={() => setActiveTab('services')}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Go to Services
                </button>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-4">Your Files</h3>
                {driveFilesLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {driveFilesData?.files?.length === 0 ? (
                      <p className="text-gray-600 dark:text-gray-300 text-center py-4 col-span-full">No files found</p>
                    ) : (
                      driveFilesData?.files?.map((file: any) => (
                        <div key={file.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500">
                          <div className="flex items-start justify-between mb-2">
                            <span className="text-2xl">📄</span>
                            <button
                              onClick={() => {
                                const serviceId = servicesData?.services?.find((s: any) => s.serviceName === 'drive')?.id;
                                if (serviceId && confirm('Delete this file?')) {
                                  deleteDriveMutation.mutate({ serviceId, fileId: file.id });
                                }
                              }}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Delete
                            </button>
                          </div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">{file.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{file.mimeType}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {file.size ? `${(file.size / 1024).toFixed(2)} KB` : 'Unknown size'}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sheets Tab */}
      {activeTab === 'sheets' && (
        <div>
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Google Sheets Integration</h2>
              {allServices.find(s => s.serviceName === 'sheets' && s.status === 'connected') && (
                <button
                  onClick={() => setShowSheetsModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  Open Sheets Tool
                </button>
              )}
            </div>

            {!allServices.find(s => s.serviceName === 'sheets' && s.status === 'connected') ? (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
                <p className="text-gray-600 dark:text-gray-300">Please connect Sheets service first</p>
                <button
                  onClick={() => setActiveTab('services')}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Go to Services
                </button>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-4">Sheets Operations</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Use the Sheets Tool to read, write, and manage spreadsheet data.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">📖 Read Data</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Read values from any range in your spreadsheets</p>
                  </div>
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">✏️ Write Data</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Update cells and ranges with new values</p>
                  </div>
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">➕ Append Rows</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Add new rows to existing sheets</p>
                  </div>
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">📝 Create Sheets</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Create new spreadsheets programmatically</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Statistics Tab */}
      {activeTab === 'statistics' && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Service Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Total Services</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{totalServices}</p>
                </div>
                <span className="text-4xl">🔌</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Connected Services</p>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">{connectedServices}</p>
                </div>
                <span className="text-4xl">✅</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Connection Rate</p>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">
                    {totalServices > 0 ? Math.round((connectedServices / totalServices) * 100) : 0}%
                  </p>
                </div>
                <span className="text-4xl">📊</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">OAuth Tokens</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{totalOAuthTokens}</p>
                </div>
                <span className="text-4xl">🔑</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">API Credentials</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{totalCredentials}</p>
                </div>
                <span className="text-4xl">🔐</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">GitHub Repos</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{githubRepoCount}</p>
                </div>
                <span className="text-4xl">🐙</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Gmail Messages</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{gmailMessageCount}</p>
                </div>
                <span className="text-4xl">📧</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Drive Files</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{driveFileCount}</p>
                </div>
                <span className="text-4xl">📁</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Active Integrations</p>
                  <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-2">{connectedServices}</p>
                </div>
                <span className="text-4xl">🚀</span>
              </div>
            </div>
          </div>

          {/* Service breakdown */}
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Service Status Breakdown</h3>
            <div className="space-y-3">
              {allServices.map((service) => (
                <div key={service.serviceName} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{service.icon}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{service.name}</span>
                  </div>
                  <span className={`px-3 py-1 text-sm rounded-full ${
                    service.status === 'connected'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {service.status === 'connected' ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Service Configuration Modal */}
      {showConfigModal && configModalData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Configure {configModalData.serviceName.charAt(0).toUpperCase() + configModalData.serviceName.slice(1)}
              </h2>
            </div>
            <div className="p-6">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Service configuration options will be available here. Current config:
              </p>
              <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg text-sm overflow-x-auto">
                {JSON.stringify(configModalData.config, null, 2)}
              </pre>
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
              <button
                onClick={() => setShowConfigModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  updateServiceMutation.mutate({
                    id: configModalData.serviceId,
                    config: configModalData.config,
                  });
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Configuration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Credential Modal */}
      {showCredentialModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add API Credential</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Service Name
                </label>
                <select
                  value={credentialForm.serviceName}
                  onChange={(e) => setCredentialForm({ ...credentialForm, serviceName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="openai">OpenAI</option>
                  <option value="anthropic">Anthropic</option>
                  <option value="google">Google AI</option>
                  <option value="azure">Azure OpenAI</option>
                  <option value="aws">AWS Bedrock</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Credential Name
                </label>
                <input
                  type="text"
                  value={credentialForm.credentialName}
                  onChange={(e) => setCredentialForm({ ...credentialForm, credentialName: e.target.value })}
                  placeholder="My API Key"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  API Key
                </label>
                <input
                  type="password"
                  value={credentialForm.apiKey}
                  onChange={(e) => setCredentialForm({ ...credentialForm, apiKey: e.target.value })}
                  placeholder="sk-..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  API Secret (Optional)
                </label>
                <input
                  type="password"
                  value={credentialForm.apiSecret}
                  onChange={(e) => setCredentialForm({ ...credentialForm, apiSecret: e.target.value })}
                  placeholder="Optional secret key"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
              <button
                onClick={() => setShowCredentialModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCredential}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Credential
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GitHub Issue Modal */}
      {showGithubIssueModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create GitHub Issue</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Owner</label>
                  <input
                    type="text"
                    value={githubIssueForm.owner}
                    onChange={(e) => setGithubIssueForm({ ...githubIssueForm, owner: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Repo</label>
                  <input
                    type="text"
                    value={githubIssueForm.repo}
                    onChange={(e) => setGithubIssueForm({ ...githubIssueForm, repo: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  value={githubIssueForm.title}
                  onChange={(e) => setGithubIssueForm({ ...githubIssueForm, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Body</label>
                <textarea
                  value={githubIssueForm.body}
                  onChange={(e) => setGithubIssueForm({ ...githubIssueForm, body: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
              <button
                onClick={() => setShowGithubIssueModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateGithubIssue}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Issue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Gmail Compose Modal */}
      {showGmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Compose Email</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  To (comma-separated)
                </label>
                <input
                  type="text"
                  value={gmailForm.to.join(', ')}
                  onChange={(e) => setGmailForm({ ...gmailForm, to: e.target.value.split(',').map(s => s.trim()) })}
                  placeholder="email@example.com, another@example.com"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject</label>
                <input
                  type="text"
                  value={gmailForm.subject}
                  onChange={(e) => setGmailForm({ ...gmailForm, subject: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Body</label>
                <textarea
                  value={gmailForm.body}
                  onChange={(e) => setGmailForm({ ...gmailForm, body: e.target.value })}
                  rows={8}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
              <button
                onClick={() => setShowGmailModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSendGmail}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Send Email
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Drive Upload Modal */}
      {showDriveUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Upload File to Drive</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">File Name</label>
                <input
                  type="text"
                  value={driveForm.name}
                  onChange={(e) => setDriveForm({ ...driveForm, name: e.target.value })}
                  placeholder="document.txt"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">MIME Type</label>
                <select
                  value={driveForm.mimeType}
                  onChange={(e) => setDriveForm({ ...driveForm, mimeType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="text/plain">Text (text/plain)</option>
                  <option value="text/html">HTML (text/html)</option>
                  <option value="application/json">JSON (application/json)</option>
                  <option value="text/csv">CSV (text/csv)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Content</label>
                <textarea
                  value={driveForm.content}
                  onChange={(e) => setDriveForm({ ...driveForm, content: e.target.value })}
                  rows={8}
                  placeholder="File content..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
              <button
                onClick={() => setShowDriveUploadModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleUploadDrive}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sheets Modal */}
      {showSheetsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Google Sheets Tool</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Operation</label>
                <select
                  value={sheetsOperation}
                  onChange={(e) => setSheetsOperation(e.target.value as any)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="read">Read Range</option>
                  <option value="write">Write Range</option>
                  <option value="append">Append Row</option>
                  <option value="create">Create Spreadsheet</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Spreadsheet ID
                </label>
                <input
                  type="text"
                  value={sheetsForm.spreadsheetId}
                  onChange={(e) => setSheetsForm({ ...sheetsForm, spreadsheetId: e.target.value })}
                  placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Range</label>
                <input
                  type="text"
                  value={sheetsForm.range}
                  onChange={(e) => setSheetsForm({ ...sheetsForm, range: e.target.value })}
                  placeholder="Sheet1!A1:D10"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Use this tool to perform operations on Google Sheets. Provide the spreadsheet ID and range.
              </p>
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
              <button
                onClick={() => setShowSheetsModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

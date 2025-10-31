import { trpc } from '../lib/trpc';
import { useAuth } from '../contexts/AuthContext';

export default function Services() {
  const { user } = useAuth();
  
  // Conectar ao tRPC para dados reais
  const { data: servicesData, isLoading, refetch } = trpc.services.listServices.useQuery({
    userId: user?.id,
  });

  // Mapeamento de ícones para cada serviço
  const serviceIcons: Record<string, string> = {
    github: '🐙',
    gmail: '📧',
    drive: '📁',
    sheets: '📊',
    notion: '📝',
    slack: '💬',
    discord: '🎮',
  };

  // Descrições para cada serviço
  const serviceDescriptions: Record<string, string> = {
    github: 'Acesse repositórios, issues e pull requests',
    gmail: 'Envie e receba emails automaticamente',
    drive: 'Gerencie arquivos e pastas na nuvem',
    sheets: 'Leia e escreva em planilhas',
    notion: 'Sincronize páginas e bancos de dados',
    slack: 'Envie mensagens para canais e usuários',
    discord: 'Integre com servidores Discord',
  };

  // Lista de todos os serviços disponíveis
  const availableServices = ['github', 'gmail', 'drive', 'sheets', 'notion', 'slack', 'discord'];
  
  // Combinar serviços ativos com disponíveis
  const allServices = availableServices.map(serviceName => {
    const activeService = servicesData?.services?.find((s: any) => s.serviceName === serviceName);
    return {
      name: serviceName.charAt(0).toUpperCase() + serviceName.slice(1),
      serviceName,
      status: activeService?.isActive ? 'connected' : 'disconnected',
      icon: serviceIcons[serviceName] || '🔧',
      id: activeService?.id,
    };
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Serviços Externos</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Conecte e gerencie integrações com serviços externos
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-300 mt-4">Carregando serviços...</p>
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
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {service.status === 'connected' ? 'Conectado' : 'Desconectado'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300 mb-4">
                  <p>{serviceDescriptions[service.serviceName] || 'Serviço de integração'}</p>
                </div>

                <div className="flex gap-2">
                  {service.status === 'connected' ? (
                    <>
                      <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                        Configurar
                      </button>
                      <button 
                        onClick={() => {
                          // TODO: Implementar desconexão
                          console.log('Desconectar', service.name);
                        }}
                        className="flex-1 border border-red-300 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                      >
                        Desconectar
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => {
                        // TODO: Implementar conexão
                        console.log('Conectar', service.name);
                      }}
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Conectar
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Seção de Credenciais API */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Credenciais de API</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            Gerencie chaves de API para serviços que não usam OAuth
          </p>
        </div>
        <div className="p-6">
          <div className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Nenhuma credencial configurada</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Adicione chaves de API para OpenAI, Anthropic, e outros serviços
            </p>
            <div className="mt-6">
              <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                Adicionar Credencial
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Response Helpers - Respostas padronizadas para API
 */
/**
 * Resposta de sucesso
 */
export function success(data, message) {
    return {
        success: true,
        data,
        message,
        timestamp: new Date().toISOString(),
    };
}
/**
 * Resposta de sucesso para criação
 */
export function created(data, message = 'Registro criado com sucesso') {
    return {
        success: true,
        data,
        message,
        timestamp: new Date().toISOString(),
    };
}
/**
 * Resposta de sucesso para atualização
 */
export function updated(data, message = 'Registro atualizado com sucesso') {
    return {
        success: true,
        data,
        message,
        timestamp: new Date().toISOString(),
    };
}
/**
 * Resposta de sucesso para deleção
 */
export function deleted(message = 'Registro deletado com sucesso') {
    return {
        success: true,
        message,
        timestamp: new Date().toISOString(),
    };
}
/**
 * Resposta paginada
 */
export function paginated(items, total, page, limit) {
    const totalPages = Math.ceil(total / limit);
    return {
        success: true,
        data: items,
        pagination: {
            page,
            limit,
            total,
            totalPages,
            hasNext: page < totalPages,
            hasPrevious: page > 1,
        },
        timestamp: new Date().toISOString(),
    };
}
/**
 * Resposta de lista
 */
export function list(items, total) {
    return {
        success: true,
        data: items,
        total: total ?? items.length,
        timestamp: new Date().toISOString(),
    };
}
/**
 * Resposta de item único
 */
export function single(item, notFoundMessage) {
    if (!item) {
        return {
            success: false,
            data: null,
            message: notFoundMessage || 'Registro não encontrado',
            timestamp: new Date().toISOString(),
        };
    }
    return {
        success: true,
        data: item,
        timestamp: new Date().toISOString(),
    };
}
/**
 * Resposta de progresso (para operações longas)
 */
export function progress(current, total, message) {
    const percentage = Math.round((current / total) * 100);
    return {
        success: true,
        progress: {
            current,
            total,
            percentage,
            message,
        },
        timestamp: new Date().toISOString(),
    };
}
/**
 * Resposta de validação (múltiplos erros)
 */
export function validationError(errors) {
    return {
        success: false,
        errors,
        message: 'Erro de validação',
        timestamp: new Date().toISOString(),
    };
}
/**
 * Formata número com casas decimais
 */
export function formatNumber(value, decimals = 2) {
    return value.toFixed(decimals);
}
/**
 * Formata tamanho de arquivo
 */
export function formatFileSize(bytes) {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }
    return `${size.toFixed(2)} ${units[unitIndex]}`;
}
/**
 * Formata duração em milissegundos
 */
export function formatDuration(ms) {
    if (ms < 1000)
        return `${ms}ms`;
    if (ms < 60000)
        return `${(ms / 1000).toFixed(1)}s`;
    if (ms < 3600000)
        return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`;
    return `${Math.floor(ms / 3600000)}h ${Math.floor((ms % 3600000) / 60000)}m`;
}
/**
 * Estatísticas genéricas
 */
export function stats(data) {
    return {
        success: true,
        stats: data,
        timestamp: new Date().toISOString(),
    };
}

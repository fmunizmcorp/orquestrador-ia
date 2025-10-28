import { ReactNode } from 'react';
import { Search, Plus, Edit, Trash2, Eye } from 'lucide-react';

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onAdd?: () => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onView?: (row: T) => void;
  loading?: boolean;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  title: string;
}

function DataTable<T extends Record<string, any>>({
  columns,
  data,
  onAdd,
  onEdit,
  onDelete,
  onView,
  loading = false,
  searchQuery = '',
  onSearchChange,
  title,
}: DataTableProps<T>) {
  return (
    <div className="card">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <div className="flex items-center gap-4">
          {/* Search */}
          {onSearchChange && (
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Add Button */}
          {onAdd && (
            <button onClick={onAdd} className="btn-primary flex items-center gap-2">
              <Plus size={20} />
              Adicionar
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              {columns.map((column, idx) => (
                <th
                  key={idx}
                  className="px-4 py-3 text-left text-sm font-medium text-gray-400 uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
              {(onEdit || onDelete || onView) && (
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400 uppercase tracking-wider">
                  Ações
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {loading ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-8 text-center">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <span className="ml-3 text-gray-400">Carregando...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-8 text-center text-gray-400">
                  Nenhum registro encontrado
                </td>
              </tr>
            ) : (
              data.map((row, rowIdx) => (
                <tr key={rowIdx} className="hover:bg-slate-700/50 transition-colors">
                  {columns.map((column, colIdx) => (
                    <td key={colIdx} className="px-4 py-3 text-sm text-gray-300">
                      {column.render
                        ? column.render(row)
                        : String(row[column.key as keyof T] || '-')}
                    </td>
                  ))}
                  {(onEdit || onDelete || onView) && (
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        {onView && (
                          <button
                            onClick={() => onView(row)}
                            className="p-1 rounded hover:bg-slate-600 text-blue-400"
                            title="Visualizar"
                          >
                            <Eye size={18} />
                          </button>
                        )}
                        {onEdit && (
                          <button
                            onClick={() => onEdit(row)}
                            className="p-1 rounded hover:bg-slate-600 text-yellow-400"
                            title="Editar"
                          >
                            <Edit size={18} />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(row)}
                            className="p-1 rounded hover:bg-slate-600 text-red-400"
                            title="Deletar"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataTable;

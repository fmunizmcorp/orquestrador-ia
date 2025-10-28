import { useState } from 'react';
import { trpc } from '../lib/trpc';
import DataTable from '../components/DataTable';

const Subtasks = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { data, isLoading } = trpc.subtasks.list.useQuery({ query: searchQuery });

  return (
    <div>
      <DataTable
        title="Subtarefas"
        columns={[
          { key: 'id', label: 'ID' },
          { key: 'name', label: 'Nome' },
        ]}
        data={data?.items || []}
        loading={isLoading}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAdd={() => console.log('Add')}
        onEdit={() => console.log('Edit')}
        onDelete={() => console.log('Delete')}
      />
    </div>
  );
};

export default Subtasks;

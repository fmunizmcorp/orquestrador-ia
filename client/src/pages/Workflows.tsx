import { useState } from 'react';
import { trpc } from '../lib/trpc';
import DataTable from '../components/DataTable';

const Workflows = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { data, isLoading } = trpc.workflows.list.useQuery({ query: searchQuery });

  return (
    <div>
      <DataTable
        title="Workflows"
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

export default Workflows;

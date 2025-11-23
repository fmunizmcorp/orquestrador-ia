import { useState } from 'react';
import { trpc } from '../lib/trpc';
import DataTable from '../components/DataTable';

const Instructions = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { data, isLoading } = trpc.instructions.list.useQuery({ query: searchQuery });

  return (
    <div>
      <DataTable
        title="Instruções"
        columns={[
          { key: 'id', label: 'ID' },
          { key: 'title', label: 'Nome' },
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

export default Instructions;

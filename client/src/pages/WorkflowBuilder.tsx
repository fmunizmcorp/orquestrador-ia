/**
 * Workflow Builder Page
 * Page wrapper for the Workflow Designer component
 */
import React from 'react';
import { WorkflowDesigner } from '../components/WorkflowDesigner';
import { useNavigate } from 'react-router-dom';

export const WorkflowBuilder: React.FC = () => {
  const navigate = useNavigate();

  const handleSave = (workflow: any) => {
    console.log('Workflow saved:', workflow);
    // Optionally navigate back to workflows list
    // navigate('/workflows');
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/workflows')}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Workflow Builder</h1>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <WorkflowDesigner onSave={handleSave} />
      </div>
    </div>
  );
};

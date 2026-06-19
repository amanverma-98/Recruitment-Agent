import React from 'react';

const agents = [
  { name: 'Generator Agent', status: 'Healthy', color: 'bg-green-500 text-white bg-green-50' },
  { name: 'Evaluator Agent', status: 'Healthy', color: 'bg-green-500 text-white bg-green-50' },
  { name: 'Refiner Agent', status: 'Healthy', color: 'bg-green-500 text-white bg-green-50' },
  { name: 'Human Review', status: 'Active', color: 'bg-purple-500 text-white bg-purple-50' },
];

export default function AgentStatusList() {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-full">
      <h3 className="text-base font-bold text-gray-900 mb-4">Agent Status</h3>
      <div className="space-y-4">
        {agents.map((agent) => (
          <div key={agent.name} className="flex items-center justify-between p-3 rounded-xl border border-gray-50/80 bg-gray-50/30">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-medium text-gray-700">{agent.name}</span>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-lg font-semibold border ${agent.color}`}>
              {agent.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
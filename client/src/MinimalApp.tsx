import React from 'react';

const MinimalApp: React.FC = () => {
  return React.createElement('div', { className: 'min-h-screen bg-gray-100 flex items-center justify-center' },
    React.createElement('div', { className: 'bg-white p-8 rounded-lg shadow-lg' },
      React.createElement('h1', { className: 'text-3xl font-bold text-gray-800 mb-4' }, 'Minimal Test App'),
      React.createElement('p', { className: 'text-gray-600' }, 'If you can see this, the React app is working!')
    )
  );
};

export default MinimalApp;
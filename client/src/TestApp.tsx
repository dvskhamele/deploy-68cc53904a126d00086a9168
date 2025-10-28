import React from 'react';
import TestComponent from './TestComponent';
import './assets/beautiful-solid-cards.css';

const TestApp: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Test App</h1>
      <TestComponent />
    </div>
  );
};

export default TestApp;
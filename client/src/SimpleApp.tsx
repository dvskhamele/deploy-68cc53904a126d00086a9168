import React from 'react';

// Simple test component
const SimpleApp = () => {
  return React.createElement('div', null, 
    React.createElement('h1', null, 'Simple Test App'),
    React.createElement('p', null, 'If you can see this, React is working!')
  );
};

export default SimpleApp;
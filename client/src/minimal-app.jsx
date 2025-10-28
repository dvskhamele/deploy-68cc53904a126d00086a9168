import React from 'react';
import ReactDOM from 'react-dom/client';

const MinimalApp = () => {
  return (
    <div>
      <h1>Hello, World!</h1>
      <p>If you can see this, React is working.</p>
    </div>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<MinimalApp />);
} else {
  console.error('Root element not found');
}
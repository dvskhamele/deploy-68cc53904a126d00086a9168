import React from 'react';

const InlineTestApp: React.FC = () => {
  console.log('InlineTestApp is rendering');
  return (
    <div>
      <h1>Inline Test App</h1>
      <p>If you can see this, React with JSX is working!</p>
    </div>
  );
};

export default InlineTestApp;
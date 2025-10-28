import React, { useState, useEffect } from 'react';

const TestComponent: React.FC = () => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    console.log('TestComponent mounted');
  }, []);
  
  return (
    <div className="beautiful-solid-card">
      <div className="beautiful-solid-card-header">
        <span>Test Component</span>
      </div>
      <div className="beautiful-solid-card-body">
        <p>React is working! Count: {count}</p>
        <button 
          className="beautiful-solid-btn beautiful-solid-btn-primary"
          onClick={() => setCount(count + 1)}
        >
          Increment
        </button>
      </div>
    </div>
  );
};

export default TestComponent;
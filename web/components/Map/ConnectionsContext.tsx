// ConnectionsContext.js
import React, { createContext, useContext, useState } from 'react';

const ConnectionsContext = createContext();

export const ConnectionsProvider = ({ children }) => {
  const [connectionsMade, setConnectionsMade] = useState({}); // Track connections as an object

  const recordConnection = (startNode, endNode) => {
    const key = `${startNode}-${endNode}`;
    setConnectionsMade(prev => ({ ...prev, [key]: (prev[key] || 0) + 1 }));
  };

  const isFirstConnection = (startNode, endNode) => {
    const key = `${startNode}-${endNode}`;
    return !connectionsMade[key] || connectionsMade[key] === 1;
  };

  return (
    <ConnectionsContext.Provider value={{ recordConnection, isFirstConnection }}>
      {children}
    </ConnectionsContext.Provider>
  );
};

export const useConnections = () => useContext(ConnectionsContext);

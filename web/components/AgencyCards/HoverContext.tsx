// HoverContext.tsx

import React, { createContext, useContext, useState, ReactNode } from 'react';

type HoverContextType = {
  hoveredIndex: string | null;
  setHoveredIndex: (index: string | null) => void;
};

const defaultValue: HoverContextType = {
  hoveredIndex: null,
  setHoveredIndex: () => {},
};

const HoverContext = createContext<HoverContextType>(defaultValue);

export const useHover = () => useContext(HoverContext);

interface HoverProviderProps {
  children: ReactNode;
}

export const HoverProvider: React.FC<HoverProviderProps> = ({ children }) => {
  const [hoveredIndex, setHoveredIndex] = useState<string | null>(null);

  return (
    <HoverContext.Provider value={{ hoveredIndex, setHoveredIndex }}>
      {children}
    </HoverContext.Provider>
  );
};

export default HoverProvider;

import React, { createContext, useContext, useState } from 'react';
import { UserRole } from '../types';

interface RoleViewContextType {
  viewMode: UserRole;
  setViewMode: React.Dispatch<React.SetStateAction<UserRole>>;
}

const RoleViewContext = createContext<RoleViewContextType | undefined>(undefined);

export const RoleViewProvider: React.FC<{
  children: React.ReactNode;
  initialViewMode: UserRole;
}> = ({ children, initialViewMode }) => {
  const [viewMode, setViewMode] = useState<UserRole>(initialViewMode);

  return (
    <RoleViewContext.Provider value={{ viewMode, setViewMode }}>
      {children}
    </RoleViewContext.Provider>
  );
};

export const useRoleView = (): RoleViewContextType => {
  const context = useContext(RoleViewContext);
  if (context === undefined) {
    throw new Error('useRoleView must be used within a RoleViewProvider');
  }
  return context;
};

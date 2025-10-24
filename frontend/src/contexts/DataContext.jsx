import { createContext, useContext, useState } from 'react';

const DataContext = createContext();

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useDataContext debe ser usado dentro de un DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  // Estados para controlar cuando se actualizan los datos
  const [refreshUsers, setRefreshUsers] = useState(0);
  const [refreshAttendances, setRefreshAttendances] = useState(0);
  const [refreshAttendanceTypes, setRefreshAttendanceTypes] = useState(0);
  const [refreshCompanies, setRefreshCompanies] = useState(0);
  const [refreshRoles, setRefreshRoles] = useState(0);
  const [refreshUserProfile, setRefreshUserProfile] = useState(0);

  // Funciones para disparar las actualizaciones
  const triggerUsersRefresh = () => {
    setRefreshUsers(prev => prev + 1);
  };

  const triggerAttendancesRefresh = () => {
    setRefreshAttendances(prev => prev + 1);
  };

  const triggerAttendanceTypesRefresh = () => {
    setRefreshAttendanceTypes(prev => prev + 1);
  };

  const triggerCompaniesRefresh = () => {
    setRefreshCompanies(prev => prev + 1);
  };

  const triggerRolesRefresh = () => {
    setRefreshRoles(prev => prev + 1);
  };

  const triggerUserProfileRefresh = () => {
    setRefreshUserProfile(prev => prev + 1);
  };

  // Función general para refrescar todos los datos
  const triggerGlobalRefresh = () => {
    triggerUsersRefresh();
    triggerAttendancesRefresh();
    triggerAttendanceTypesRefresh();
    triggerCompaniesRefresh();
    triggerRolesRefresh();
    triggerUserProfileRefresh();
  };

  const value = {
    // Estados
    refreshUsers,
    refreshAttendances,
    refreshAttendanceTypes,
    refreshCompanies,
    refreshRoles,
    refreshUserProfile,
    
    // Funciones para disparar actualizaciones
    triggerUsersRefresh,
    triggerAttendancesRefresh,
    triggerAttendanceTypesRefresh,
    triggerCompaniesRefresh,
    triggerRolesRefresh,
    triggerUserProfileRefresh,
    triggerGlobalRefresh,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

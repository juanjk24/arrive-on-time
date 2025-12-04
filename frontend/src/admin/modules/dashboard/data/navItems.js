export const getAsideNavItems = () => {
  const token = document.cookie.split("=")[1];
  return [
    {
      to: "/admin/users",
      icon: "dashboard/users",
      title: "Gestionar Usuarios",
    },

    {
      to: "/admin/companies",
      icon: "dashboard/buildings",
      title: "Gestionar Empresas o Instituciones",
    },

    {
      to: "/admin/roles",
      icon: "dashboard/user-tag",
      title: "Gestionar Roles",
    },

    {
      to: "/admin/attendances",
      icon: "dashboard/calendar-alt",
      title: "Gestionar Asistencias",
    },

    {
      to: "/admin/attendances-type",
      icon: "dashboard/calendar-check",
      title: "Gestionar Tipos de Asistencias",
    },

    {
      to: "/admin/your-attendances",
      icon: "dashboard/calendar-month",
      title: "Ver Tus Asistencias",
    },

    {
      to: "/admin/queries",
      icon: "dashboard/user-search",
      title: "Realizar Consultas",
    },

    {
      to: `https://localhost:5000/resources/db?token=${token}`,
      icon: "dashboard/db",
      title: "Descargar Base de Datos en SQL",
    },

    {
      to: `https://localhost:5000/resources/all-attendances?token=${token}`,
      icon: "dashboard/table-down",
      title: "Descargar Todas las Asistencias",
    },

    {
      to: `https://localhost:5000/resources/your-attendances?token=${token}`,
      icon: "dashboard/file-excel",
      title: "Descargar Tus Asistencias",
    },
    {
      to: "/admin/blockchain",
      icon: "dashboard/blockchain",
      title: "Mirar Blockchain",
    }
  ];
};

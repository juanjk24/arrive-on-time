import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import { Tag } from "primereact/tag";
import { HeaderTable } from "./HeaderTable";
import { Button } from "primereact/button";
import { useState, useMemo } from "react";

export function TableAttendances({ attendances, user }) {
  // Estado local que controla si la vista está agrupada por tipo de asistencia.
  // Cuando 'grouped' === true, activamos rowGroup de PrimeReact.
  const [grouped, setGrouped] = useState(false);

  const groupHeaderTemplate = (data) => {
    const tipo = data.tipo_asistencia ?? "Sin tipo";
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Nombre del grupo */}
        <h4 style={{ margin: 0 }}>{tipo}</h4>
        {/* Conteo de registros con ese tipo (se filtra sobre el array original) */}
        <small style={{ color: "#666" }}>
          ({attendances.filter((a) => a.tipo_asistencia === tipo).length})
        </small>
      </div>
    );
  };

  const header = (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <HeaderTable user={user} />

      <div>
        <Button
          className="primary-button"
          style={{ width: "200px" }}
          /* Icono: lista = desagrupar, cuadrícula = agrupar */
          icon={grouped ? "pi pi-list" : "pi pi-th-large"}
          /* Etiqueta del botón dinámicamente */
          label={grouped ? "Desagrupar" : "Agrupar por tipo"}
          onClick={() => setGrouped(!grouped)}
        />
      </div>
    </div>
  );

  const sortedValue = useMemo(() => {
    if (!grouped) return attendances; // sin agrupado regresamos el array tal cual
    // Copiamos y ordenamos por tipo_asistencia (case-insensitive)
    return [...attendances].sort((a, b) => {
      const A = (a.tipo_asistencia || "").toString().toLowerCase();
      const B = (b.tipo_asistencia || "").toString().toLowerCase();
      return A.localeCompare(B);
    });
  }, [attendances, grouped]);

  return (
    <div className="card users-table">
      <DataTable
        value={sortedValue} 
        header={header} 
        size="small"
        resizableColumns
        showGridlines
        stripedRows
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25, 50]}
        tableStyle={{ minWidth: "50rem" }}
        {...(grouped
          ? {
              rowGroupMode: "subheader",
              groupField: "tipo_asistencia",
              sortField: "tipo_asistencia",
              sortOrder: 1,
              rowGroupHeaderTemplate: groupHeaderTemplate,
            }
          : {})}
      >
        <Column
          header="#"
          body={(_, rowIndex) => rowIndex.rowIndex + 1}
        ></Column>

        {/* Columnas de datos */}
        <Column field="fecha" sortable header="Fecha"></Column>
        <Column field="hora" sortable header="Hora"></Column>
        <Column field="nombres" sortable header="Nombres"></Column>
        <Column field="apellidos" sortable header="Apellidos"></Column>
        <Column field="nombre_empresa" sortable header="Empresa"></Column>

        <Column
          body={(attendance) =>
            attendance.tipo_id === 1 ? (
              <Tag value={attendance.tipo_asistencia} severity="success" />
            ) : attendance.tipo_id === 2 ? (
              <Tag value={attendance.tipo_asistencia} severity="danger" />
            ) : attendance.tipo_id === 8 ? (
              <Tag value={attendance.tipo_asistencia} severity="warning" />
            ) : (
              <Tag value={attendance.tipo_asistencia} severity="info" />
            )
          }
          sortable
          header="Tipo de Asistencia"
        ></Column>
      </DataTable>
    </div>
  );
}

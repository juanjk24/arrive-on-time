import { useState, useMemo } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { HeaderTable } from "./HeaderTable";
import { TableActions } from "./TableActions";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";

export function TableAttendances({ attendances = [] }) {
  const [grouped, setGrouped] = useState(false);

  // Plantilla para encabezado de grupo
  const groupHeaderTemplate = (data) => {
    const tipo = data.tipo_asistencia ?? "Sin tipo";
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <h4 style={{ margin: 0 }}>{tipo}</h4>
        <small style={{ color: "#666" }}>
          ({attendances.filter((a) => a.tipo_asistencia === tipo).length})
        </small>
      </div>
    );
  };

  // Header con botón de agrupar/desagrupar
  const header = (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <HeaderTable />
      <div>
        <Button
          className="primary-button"
          style={{ width: "200px" }}
          icon={grouped ? "pi pi-list" : "pi pi-th-large"}
          label={grouped ? "Desagrupar" : "Agrupar por tipo"}
          onClick={() => setGrouped(!grouped)}
        />
      </div>
    </div>
  );

  // Ordenar cuando está agrupado
  const sortedValue = useMemo(() => {
    if (!grouped) return attendances;
    return [...attendances].sort((a, b) =>
      (a.tipo_asistencia || "").toLowerCase().localeCompare(
        (b.tipo_asistencia || "").toLowerCase()
      )
    );
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
        rows={25}
        rowsPerPageOptions={[5, 10, 25, 50]}
        tableStyle={{ minWidth: "60rem" }}
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
          body={(rowData, options) => options.rowIndex + 1}
        />
        <Column field="fecha" sortable header="Fecha" />
        <Column field="hora" sortable header="Hora" />
        <Column field="nombres" sortable header="Nombres" />
        <Column field="apellidos" sortable header="Apellidos" />
        <Column field="nombre_empresa" sortable header="Empresa" />
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
        />
        <Column
          header="Acciones"
          body={(attendance) => <TableActions attendance={attendance} />}
        />
      </DataTable>
    </div>
  );
}
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { HeaderTable } from "./HeaderTable.jsx";

export function TableAttendances({ attendances = [], user }) {
  return (
    <div className="card users-table">
      <DataTable
        value={attendances}
        header={<HeaderTable user={user} />}
        size="small"
        resizableColumns
        showGridlines
        stripedRows
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25, 50]}
        tableStyle={{ minWidth: "65rem" }}
      >
        {/* Índice de fila */}
        <Column
          header="#"
          body={(rowData, options) => options.rowIndex + 1}
        />

        {/* Columnas de datos */}
        <Column field="fecha" sortable header="Fecha" />
        <Column field="hora" sortable header="Hora" />
        <Column field="nombres" sortable header="Nombres" />
        <Column field="apellidos" sortable header="Apellidos" />
        <Column field="correo" sortable header="Correo" />
        <Column field="rol" sortable header="Rol" />
        <Column field="nombre_empresa" sortable header="Empresa" />

        {/* Columna con etiquetas de tipo de asistencia */}
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
      </DataTable>
    </div>
  );
}
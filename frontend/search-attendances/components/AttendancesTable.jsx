import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { useState } from "react";

export function AttendancesTable({ attendances = [], userName = "" }) {
    const [globalFilter, setGlobalFilter] = useState("");
    console.log(attendances);
    
    const header = (
        <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem"
        }}>
            <h2 style={{ margin: 0 }}>
                Asistencias de {userName}
            </h2>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" style={{ marginLeft: "0.5rem" }} />
                    <input
                        type="text"
                        placeholder="Buscar..."
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        style={{
                            padding: "0.5rem 0.5rem 0.5rem 2rem",
                            borderRadius: "6px",
                            border: "1px solid #d1d5db",
                        }}
                    />
                </span>
            </div>
        </div>
    );

    const dateBodyTemplate = (rowData) => {
        return new Date(rowData.fecha).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    const typeBodyTemplate = (rowData) => {
        const getSeverity = (tipoId) => {
            switch (tipoId) {
                case 1:
                    return "success"; // Entrada
                case 2:
                    return "danger"; // Salida
                case 8:
                    return "warning"; // Advertencia
                default:
                    return "info";
            }
        };

        return (
            <Tag 
                value={rowData.tipo_asistencia} 
                severity={getSeverity(rowData.tipo_id)} 
            />
        );
    };

    return (
        <div className="card users-table" style={{ marginTop: "2rem" }}>
            <DataTable
                value={attendances}
                header={header}
                size="small"
                resizableColumns
                showGridlines
                stripedRows
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25, 50]}
                globalFilter={globalFilter}
                emptyMessage="No se encontraron asistencias"
                tableStyle={{ minWidth: "60rem" }}
            >
                <Column
                    header="#"
                    body={(rowData, options) => options.rowIndex + 1}
                    style={{ width: "50px" }}
                />
                <Column 
                    field="fecha" 
                    sortable 
                    header="Fecha"
                />
                <Column 
                    field="hora" 
                    sortable 
                    header="Hora" 
                />
                <Column 
                    field="nombre_empresa" 
                    sortable 
                    header="Empresa" 
                />
                <Column
                    field="tipo_asistencia"
                    body={typeBodyTemplate}
                    sortable
                    header="Tipo de Asistencia"
                />
            </DataTable>
        </div>
    );
}

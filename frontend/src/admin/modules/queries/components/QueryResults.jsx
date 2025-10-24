import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

export function QueryResults({ queryResult }) {
    if (!queryResult || queryResult.length === 0) {
        return <div>No hay resultados para mostrar</div>;
    }
    
    return (
        <div>
            {
                queryResult && (
                    <div className="query-result">
                        <DataTable
                            value={queryResult}
                            size="small"
                            resizableColumns
                            showGridlines
                            stripedRows
                            paginator
                            rows={5}
                            rowsPerPageOptions={[5, 10, 25, 50]}
                            tableStyle={{ minWidth: "50rem", padding: "20px" }}
                        >
                            <Column
                                header="#"
                                body={(_, rowIndex) => rowIndex.rowIndex + 1}
                            />

                            {
                                Object.keys(queryResult[0])
                                    .map(key =>
                                        <Column
                                            key={key}
                                            field={key}
                                            header={key.toUpperCase().split("_").join(" ")}
                                        />)
                            }
                        </DataTable>
                    </div>
                )
            }
        </div>
    )

}
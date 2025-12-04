import { Button } from "primereact/button";

export function HeaderTable({ user }) {
  const token = document.cookie.split("=")[1];

  return (
    <>
      <div className="table-header">
        <h2>{`Tus Asistencias: ${user.nombres} ${user.apellidos}`}</h2>
        <Button
          label="Descargar Tus Asistencias"
          icon="pi pi-download"
          size="small"
          className="primary-button"
          style={{ marginRight: ".5em" }}
          onClick={() => {
            window.open(`https://localhost:5000/resources/your-attendances?token=${token}`, "_blank")
          }}
        />
      </div>
    </>
  );
}

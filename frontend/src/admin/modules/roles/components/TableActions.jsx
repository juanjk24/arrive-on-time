import React, { useRef, useState } from "react";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";

import { UpdateRol } from "./UpdateRol.jsx";
import { useDataContext } from "../../../../contexts/DataContext.jsx";

export function TableActions({ rol }) {
  const toast = useRef(null);
  const { triggerRolesRefresh } = useDataContext();
  const [visible, setVisible] = useState(false);
  const [updateVisible, setUpdateVisible] = useState(false);

  const deleteRolDialog = () => {
    setVisible(true);
  };

  const reject = () => {
    setVisible(false);
  };

  const accept = async (id) => {
    try {
      const token = document.cookie.split("=")[1];
      const response = await fetch(`https://localhost:5000/roles/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
      });

      if (!response.ok) {
        throw new Error("Error en la solicitud");
      }

      setVisible(false);
      triggerRolesRefresh();
    } catch (error) {
      console.error("Error al eliminar el rol:", error);

      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error al eliminar el rol",
        life: 3000,
      });

      setVisible(false);
    }
  };

  return (
    <div>
      <Toast ref={toast} />
      <ConfirmDialog
        visible={visible}
        onHide={() => setVisible(false)}
        draggable={false}
        resizable={false}
        header="Eliminar Rol"
        message={`¿Deseas eliminar el rol: ${rol.rol_name}?`}
        icon="pi pi-exclamation-triangle"
        acceptClassName="p-button-danger"
        rejectClassName="p-button-secondary p-button-text"
        accept={() => {
          accept(rol.rol_id);
        }}
        reject={reject}
        acceptLabel="Eliminar"
        rejectLabel="Cancelar"
      />

      <Button
        icon="pi pi-pencil"
        size="small"
        className="secondary-button"
        tooltip="Editar Rol"
        tooltipOptions={{ position: "bottom" }}
        style={{ marginRight: ".5em" }}
        onClick={() => setUpdateVisible(true)}
      />
      <Button
        icon="pi pi-trash"
        size="small"
        className="danger-button"
        tooltip="Eliminar Rol"
        tooltipOptions={{ position: "bottom" }}
        onClick={deleteRolDialog}
      />

      <UpdateRol
        visible={updateVisible}
        setVisible={setUpdateVisible}
        rol={rol}
      />
    </div>
  );
}

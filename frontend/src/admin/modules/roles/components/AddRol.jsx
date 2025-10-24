import { useState, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";

import { createRol } from "../api/roles";
import { TOAST_SEVERITY, TOAST_SUMMARY } from "../constants/toast-config.js";
import { useDataContext } from "../../../../contexts/DataContext.jsx";

export function AddRol({ visible, setVisible }) {
  const toast = useRef(null);
  const { triggerRolesRefresh } = useDataContext();

  const [rolName, setRolName] = useState("");

  const showToast = ({ detail, severity, summary }) => {
    toast.current.show({
      severity,
      summary,
      detail,
      life: 3000,
    });
  };

  const handleCreateRol = async (e) => {
    if (!rolName) {
      showToast({
        detail: "Porfavor llena todos los campos",
        severity: TOAST_SEVERITY.warn,
        summary: TOAST_SUMMARY.warn,
      });
      return;
    }

    try {
      const rol = await createRol({
        rolName,
      });

      if (rol) {
        showToast({
          detail: "Rol creado correctamente",
          severity: TOAST_SEVERITY.success,
          summary: TOAST_SUMMARY.success,
        });
        setVisible(false);

        setTimeout(() => {
          triggerRolesRefresh();
        }, 100);
      } else {
        showToast({ 
          detail: "Error al crear el rol",
          severity: TOAST_SEVERITY.error,
          summary: TOAST_SUMMARY.error,
        });
      }
    } catch (error) {
      showToast({
        detail: error.message,
        severity: TOAST_SEVERITY.error,
        summary: TOAST_SUMMARY.error
      });
    }
  };

  const footerContent = (
    <div>
      <Button
        label="Cancelar"
        icon="pi pi-times"
        onClick={() => setVisible(false)}
        className="p-button-text"
        severity="secondary"
      />
      <Button
        label="Agregar Rol"
        icon="pi pi-check"
        className="primary-button"
        onClick={() => {
          handleCreateRol();
        }}
        autoFocus
      />
    </div>
  );

  return (
    <div className="card flex justify-content-center">
      <Toast ref={toast} />
      <Dialog
        header="Agregar Nuevo Rol"
        visible={visible}
        style={{ width: "50vw" }}
        draggable={false}
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
        footer={footerContent}
      >
        <form id="add-user-form" className="add-user-form">
          <label className="label-form" htmlFor="nombre-rol">
            Nombre del Rol
            <InputText
              id="nombre-rol"
              type="text"
              placeholder="Nombre del Rol"
              required
              value={rolName}
              onChange={(e) => setRolName(e.target.value)}
            />
          </label>
        </form>
      </Dialog>
    </div>
  );
}

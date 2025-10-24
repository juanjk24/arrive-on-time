import { useState, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";

import { createAttendanceType } from "../api/attendances-type.js";
import { TOAST_SEVERITY, TOAST_SUMMARY } from "../constants/toast-config.js";
import { useDataContext } from "../../../../contexts/DataContext.jsx";

export function AddAttendanceType({ visible, setVisible }) {
  const toast = useRef(null);
  const { triggerAttendanceTypesRefresh } = useDataContext();

  const [attendanceTypeName, setAttendancesTypeName] = useState("");

  const showToast = ({ detail, severity, summary }) => {
    toast.current.show({
      severity,
      summary,
      detail,
      life: 3000,
    });
  };

  const handleCreateAttendanceType = async (e) => {
    if (!attendanceTypeName) {
      showToast({
        detail: "Porfavor llena todos los campos",
        severity: TOAST_SEVERITY.warn,
        summary: TOAST_SUMMARY.warn,
      });
      return;
    }

    try {
      const attendanceType = await createAttendanceType({
        attendanceTypeName,
      });

      if (attendanceType) {
        showToast({
          detail: "Tipo de asistencia creado correctamente",
          severity: TOAST_SEVERITY.success,
          summary: TOAST_SUMMARY.success,
        });
        setVisible(false);

        setTimeout(() => {
          triggerAttendanceTypesRefresh();
        }, 100);
      } else {
        showToast({
          detail: "Error al crear el tipo de asistencia",
          severity: TOAST_SEVERITY.error,
          summary: TOAST_SUMMARY.error,
        });
      }
    } catch (error) {
      showToast({
        detail: error.message,
        severity: TOAST_SEVERITY.error,
        summary: TOAST_SUMMARY.error,
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
        label="Agregar Tipo de Asistencia"
        icon="pi pi-check"
        className="primary-button"
        onClick={() => {
          handleCreateAttendanceType();
        }}
        autoFocus
      />
    </div>
  );

  return (
    <div className="card flex justify-content-center">
      <Toast ref={toast} />
      <Dialog
        header="Agregar Nuevo Tipo de Asistencia"
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
          <label className="label-form" htmlFor="nombre-tipo-asistencia">
            Nombre del Tipo de Asistencia
            <InputText
              id="nombre-tipo-asistencia"
              type="text"
              placeholder="Nombre del Tipo de Asistencia"
              required
              value={attendanceTypeName}
              onChange={(e) => setAttendancesTypeName(e.target.value)}
            />
          </label>
        </form>
      </Dialog>
    </div>
  );
}

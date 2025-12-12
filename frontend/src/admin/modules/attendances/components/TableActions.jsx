import React, { useRef, useState } from "react";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";

import { UpdateAttendance } from "./UpdateAttendance.jsx";
import { useDataContext } from "../../../../contexts/DataContext.jsx";
import { sendEmail } from "../api/email.js";

export function TableActions({ attendance }) {
  const toast = useRef(null);
  const { triggerAttendancesRefresh } = useDataContext();
  const [visible, setVisible] = useState(false);
  const [updateVisible, setUpdateVisible] = useState(false);

  const deleteAttendanceDialog = () => {
    setVisible(true);
  };

  const reject = () => {
    setVisible(false);
  };

  const accept = async (id) => {
    try {
      const token = document.cookie.split("=")[1];
      const response = await fetch(`https://localhost:5000/attendances/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
      });

      if (!response.ok) {
        throw new Error("Error en la solicitud");
      }

      toast.current.show({
        severity: "success",
        summary: "Eliminado",
        detail: "Asistencia eliminada correctamente",
        life: 3000,
      });

      // Enviar correo de notificación de eliminación
      try {
        const responseEmail = await sendEmail({
          date: attendance.fecha,
          time: attendance.hora,
          userId: attendance.user_id,
          attendanceTypeId: attendance.tipo_id,
          attendanceId: attendance.asistencia_id,
          action: 'delete'
        });

        if (responseEmail) {
          toast.current.show({
            severity: "success",
            summary: "Correo enviado",
            detail: "Correo de enviado correctamente",
            life: 3000,
          });
        }
      } catch (emailError) {
        console.error("Error al enviar el correo:", emailError);
        toast.current.show({
          severity: "warn",
          summary: "Advertencia",
          detail: "Asistencia eliminada pero hubo un error al enviar el correo",
          life: 3000,
        });
      }

      setVisible(false);
      triggerAttendancesRefresh();
    } catch (error) {
      console.error("Error al eliminar la asistencia:", error);

      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error al eliminar la asistencia",
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
        header="Eliminar Asistencia"
        message={`¿Deseas eliminar la asistencia de: ${attendance.nombres}?`}
        icon="pi pi-exclamation-triangle"
        acceptClassName="p-button-danger"
        rejectClassName="p-button-secondary p-button-text"
        accept={() => {
          accept(attendance.asistencia_id);
        }}
        reject={reject}
        acceptLabel="Eliminar"
        rejectLabel="Cancelar"
      />

      <Button
        icon="pi pi-pencil"
        size="small"
        className="secondary-button"
        tooltip="Editar Asistencia"
        tooltipOptions={{ position: "bottom" }}
        style={{ marginRight: ".5em" }}
        onClick={() => setUpdateVisible(true)}
      />
      <Button
        icon="pi pi-trash"
        size="small"
        className="danger-button"
        tooltip="Eliminar Asistencia"
        tooltipOptions={{ position: "bottom" }}
        onClick={deleteAttendanceDialog}
      />

      <UpdateAttendance
        visible={updateVisible}
        setVisible={setUpdateVisible}
        attendance={attendance}
      />
    </div>
  );
}

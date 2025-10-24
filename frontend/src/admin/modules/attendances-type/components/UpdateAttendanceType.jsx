import { useState, useRef, useEffect } from "react";

import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { useDataContext } from "../../../../contexts/DataContext.jsx";

export function UpdateAttendanceType({ visible, setVisible, attendanceType }) {
  const toast = useRef(null);
  const { triggerAttendanceTypesRefresh } = useDataContext();
  const [attendanceTypeId, setAttendanceTypeId] = useState({
    attendanceTypeId: attendanceType.tipo_id,
  });
  const [attendanceTypeData, setAttendanceTypeData] = useState({
    attendanceTypeName: "",
  });

  useEffect(() => {
    if (attendanceType) {
      setAttendanceTypeData({
        attendanceTypeName: attendanceType.tipo_asistencia,
      });

      setAttendanceTypeId(attendanceType.tipo_id);
    }
  }, [attendanceType]);

  const handleChange = (e, field) => {
    const value = e.target ? e.target.value : e.value;
  
    setAttendanceTypeData((prevData) => ({
      ...prevData,
      [field]: field === "adminId" ? Number(value) : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const token = document.cookie.split("=")[1];
      const response = await fetch(`https://localhost:5000/attendances-type/${attendanceTypeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
        body: JSON.stringify(attendanceTypeData),
      });

      if (!response.ok) {
        throw new Error("Error en la solicitud");
      }

      const data = await response.text();
      toast.current.show({
        severity: "success",
        summary: "Felicitaciones",
        detail: "Tipo de asistencia actualizada",
        life: 3000,
      });

      setVisible(false);
      setTimeout(() => {
        triggerAttendanceTypesRefresh();
      }, 100);
    } catch (error) {
      console.error("Error al actualizar los datos del tipo de asistencia:", error);

      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error al actualizar los datos del tipo de asistencia",
        life: 3000,
      });
    }
  };

  const footerContent = (
    <div>
      <Button
        label="Cancelar"
        icon="pi pi-times"
        severity="secondary"
        className="p-button-text"
        size="small"
        onClick={() => setVisible(false)}
      />
      <Button
        className="primary-button"
        label="Actualizar Datos"
        icon="pi pi-refresh"
        size="small"
        onClick={handleSubmit}
      />
    </div>
  );

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        header={`Actualizar datos del tip de asistencia: ${attendanceType.tipo_asistencia}`}
        visible={visible}
        style={{ width: "50vw" }}
        draggable={false}
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
        footer={footerContent}
      >
        <form id="update-user-form" className="update-user-form">
          <label className="label-form" htmlFor="nombre-tipo-asistencia">
            Nombre del Tipo de Asistencia
            <InputText
              id="nombre-tipo-asistencia"
              type="text"
              placeholder="Nombre del Tipo de Asistencia"
              required
              value={attendanceTypeData.attendanceTypeName}
              onChange={(e) => handleChange(e, "attendanceTypeName")}
            />
          </label>
        </form>
      </Dialog>
    </>
  );
}

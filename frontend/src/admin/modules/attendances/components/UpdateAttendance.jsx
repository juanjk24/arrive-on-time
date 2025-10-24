import { useState, useRef, useEffect } from "react";

import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { addLocale } from "primereact/api";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { Message } from "primereact/message";

import { getAttendancesType } from "../api/attendancesType";
import { getUsers } from "../api/users";
import { locale } from '../constants/calendar-locale.js';
import { useDataContext } from "../../../../contexts/DataContext.jsx";

export function UpdateAttendance({ visible, setVisible, attendance }) {
  const toast = useRef(null);
  const { triggerAttendancesRefresh } = useDataContext();

  const [attendancesType, setAttendancesType] = useState([]);
  const [users, setUsers] = useState([]);

  const [attendanceId, setAttendanceId] = useState({
    attendanceId: attendance.asistencia_id,
  });
  const [attendanceData, setAttendanceData] = useState({
    date: "",
    time: "",
    attendanceTypeId: Number(),
    userId: Number(),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const attendancesType = await getAttendancesType();
        const users = await getUsers();

        setAttendancesType(
          attendancesType.map((attendanceType) => ({
            label: attendanceType.tipo_asistencia,
            value: attendanceType.tipo_id,
          }))
        );

        setUsers(
          users.map((user) => ({
            label: `${user.nombres} ${user.apellidos}`,
            value: user.user_id,
          }))
        );
      } catch (error) {
        console.error("Error fetching attendances-type or users:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (attendance) {
      const currentDate = new Date();

      setAttendanceData({
        date: currentDate,
        time: currentDate,
        attendanceTypeId: attendance.tipo_id,
        userId: attendance.user_id,
      });

      setAttendanceId(attendance.asistencia_id);
    }
  }, [attendance]);


  const handleChange = (e, field) => {
    const value = e.target ? e.target.value : e.value;

    setAttendanceData((prevData) => ({
      ...prevData,
      [field]: field === "attendanceTypeId" || "userId" ? Number(value) : value,
    }));
  };

  const handleSubmit = async () => {
    const newDate = new Date(attendanceData.date).toLocaleDateString();
    const newTime = new Date(attendanceData.time).toLocaleTimeString();

    const newAttendanceData = {
      date: newDate,
      time: newTime,
      attendanceTypeId: attendanceData.attendanceTypeId,
      userId: attendanceData.userId,
    };

    try {
      const token = document.cookie.split("=")[1];
      const response = await fetch(
        `https://localhost:5000/attendances/${attendanceId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token
          },
          body: JSON.stringify(newAttendanceData),
        }
      );

      if (!response.ok) {
        throw new Error("Error en la solicitud");
      }

      const data = await response.text();
      toast.current.show({
        severity: "success",
        summary: "Felicitaciones",
        detail: "Asistencia actualizada correctamente",
        life: 3000,
      });

      setVisible(false);
      setTimeout(() => {
        triggerAttendancesRefresh();
      }, 100);
    } catch (error) {
      console.error("Error al actualizar los datos de la asistencia:", error);

      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error al actualizar los datos de la asistencia",
        life: 3000,
      });
    }
  };

  addLocale("es", locale);

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
        header={`Actualizar datos de la asistencia de: ${attendance.nombres}`}
        visible={visible}
        style={{ width: "50vw" }}
        draggable={false}
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
        footer={footerContent}
      >
        <Message
          style={{ marginBottom: "20px" }}
          severity="warn"
          text="¡Cuidado! Se actualizó la fecha y hora al momento actual."
        />

        <form id="add-attendance-form" className="add-user-form">
          <label className="label-form" htmlFor="date">
            Seleccione la Fecha
            <Calendar
              id="date"
              placeholder="Fecha"
              dateFormat="dd/mm/yy"
              required
              value={attendanceData.date}
              onChange={(e) => handleChange(e, "date")}
              locale="es"
              showIcon
              showButtonBar
            />
          </label>

          <label className="label-form" htmlFor="time">
            Seleccione la Hora
            <Calendar
              id="time"
              placeholder="Hora"
              value={attendanceData.time}
              onChange={(e) => handleChange(e, "time")}
              hourFormat="12"
              timeOnly
              showIcon
              locale="es"
              icon={() => <i className="pi pi-clock" />}
            />
          </label>

          <label className="label-form" htmlFor="attendance-type">
            Seleccione el tipo de Asistencia
            <Dropdown
              id="attendance-type"
              value={attendanceData.attendanceTypeId}
              onChange={(e) => handleChange(e, "attendanceTypeId")}
              options={attendancesType}
              /* optionLabel="tipo_asistencia" */
              placeholder="Seleccione el tipo de Asistencia"
              required
            />
          </label>

          <label className="label-form" htmlFor="user-id">
            Seleccione el Usuario
            <Dropdown
              id="user-id"
              value={attendanceData.userId}
              onChange={(e) => handleChange(e, "userId")}
              options={users}
              /* optionLabel={(option) => `${option.nombres} ${option.apellidos}`} */
              placeholder="Seleccione el Usuario"
              required
            />
          </label>
        </form>
      </Dialog>
    </>
  );
}

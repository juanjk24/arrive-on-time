import { useState, useRef, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Calendar } from "primereact/calendar";
import { addLocale } from "primereact/api";
import { Dropdown } from "primereact/dropdown";

import { createAttendance } from "../api/attendances.js";
import { getAttendancesType } from "../api/attendancesType.js";
import { getUsers } from "../api/users.js";
import { locale } from "../constants/calendar-locale.js";
import { TOAST_SEVERITY, TOAST_SUMMARY } from "../constants/toast-config.js";
import { useDataContext } from "../../../../contexts/DataContext.jsx";
import { sendEmail } from "../api/email.js";

export function AddAttendance({ visible, setVisible }) {
  const toast = useRef(null);
  const { triggerAttendancesRefresh } = useDataContext();

  const [attendancesType, setAttendancesType] = useState([]);
  const [users, setUsers] = useState([]);

  const currenDate = new Date();
  const [date, setDate] = useState(currenDate);
  const [time, setTime] = useState(currenDate);
  const [attendanceTypeId, setAttendanceTypeId] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const attendancesType = await getAttendancesType();
      const users = await getUsers();

      setAttendancesType(attendancesType);
      setUsers(users);
    };

    fetchData();
  }, []);

  const showToast = ({ detail, severity, summary }) => {
    toast.current.show({
      severity,
      summary,
      detail,
      life: 3000,
    });
  };

  const handleCreateAttendance = async (e) => {
    if (!date || !time || !attendanceTypeId || !userId) {
      showToast({
        detail: "Porfavor llena todos los campos",
        severity: TOAST_SEVERITY.warn,
        summary: TOAST_SUMMARY.warn,
      });
      return;
    }

    const newDate = new Date(date).toLocaleDateString();
    const newTime = new Date(time).toLocaleTimeString();

    try {
      const attendance = await createAttendance({
        date: newDate,
        time: newTime,
        attendanceTypeId: attendanceTypeId.tipo_id,
        userId: userId.user_id,
      });

      if (attendance) {
        showToast({
          detail: "Asistencia registrada correctamente",
          severity: TOAST_SEVERITY.success,
          summary: TOAST_SUMMARY.success,
        });
        setVisible(false);

        setTimeout(() => {
          triggerAttendancesRefresh();
        }, 100);
      } else {
        showToast({
          detail: "Error al registrar la asistencia",
          severity: TOAST_SEVERITY.error,
          summary: TOAST_SUMMARY.error,
        });
      }

      const responseEmail = await sendEmail({
        date: newDate,
        time: newTime,
        userId: userId.user_id,
        attendanceTypeId: attendanceTypeId.tipo_id,
      });

      if (responseEmail) {
        showToast({
          detail: "Correo enviado correctamente",
          severity: TOAST_SEVERITY.success,
          summary: TOAST_SUMMARY.success,
        });
      } else {
        showToast({
          detail: "Error al enviar el correo",
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
        label="Agregar Asistencia"
        icon="pi pi-check"
        className="primary-button"
        onClick={() => {
          handleCreateAttendance();
        }}
        autoFocus
      />
    </div>
  );

  addLocale("es", locale);

  return (
    <div className="card flex justify-content-center">
      <Toast ref={toast} />
      <Dialog
        header="Asignar Asistencia"
        visible={visible}
        style={{ width: "50vw" }}
        draggable={false}
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
        footer={footerContent}
      >
        <form id="add-attendance-form" className="add-user-form">
          <label className="label-form" htmlFor="date">
            Seleccione la Fecha
            <Calendar
              id="date"
              placeholder="Fecha"
              dateFormat="dd/mm/yy"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
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
              value={time}
              onChange={(e) => setTime(e.value)}
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
              value={attendanceTypeId}
              onChange={(e) => setAttendanceTypeId(e.value)}
              options={attendancesType}
              optionLabel="tipo_asistencia"
              placeholder="Seleccione el tipo de Asistencia"
              required
            />
          </label>

          <label className="label-form" htmlFor="user-id">
            Seleccione el Usuario
            <Dropdown
              id="user-id"
              value={userId}
              onChange={(e) => setUserId(e.value)}
              options={users}
              optionLabel={(option) => `${option.nombres} ${option.apellidos}`}
              placeholder="Seleccione el Usuario"
              required
            />
          </label>
        </form>
      </Dialog>
    </div>
  );
}

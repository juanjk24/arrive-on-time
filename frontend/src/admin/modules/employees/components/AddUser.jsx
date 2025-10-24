import { useState, useRef, useEffect } from "react";

import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { Calendar } from "primereact/calendar";
import { addLocale } from "primereact/api";

import { createUser } from "../api/users.js";
import { getCompanies } from "../api/companies.js";
import { getRoles } from "../api/roles.js";
import { locale } from "../constants/calendar-locale.js";
import { TOAST_SEVERITY, TOAST_SUMMARY } from "../constants/toast-config.js";
import { useDataContext } from "../../../../contexts/DataContext.jsx";

export function AddUser({ visible, setVisible }) {
  const toast = useRef(null);
  const { triggerUsersRefresh } = useDataContext();

  const [companies, setCompanies] = useState([]);
  const [roles, setRoles] = useState([]);

  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [correo, setCorreo] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [cedula, setCedula] = useState();
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState();
  const [contraseña, setContraseña] = useState("");
  const [selectCompany, setSelectCompany] = useState(null);
  const [selectRol, setSelectRol] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const companies = await getCompanies();
      const roles = await getRoles();

      setCompanies(companies);
      setRoles(roles);
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

  addLocale("es", locale);

  const handleCreateUser = async (e) => {
    if (
      !nombres ||
      !apellidos ||
      !correo ||
      !fechaNacimiento ||
      !cedula ||
      !telefono ||
      !contraseña ||
      !selectCompany ||
      !selectRol
    ) {
      showToast({ 
        detail: "Porfavor llena todos los campos", 
        severity: TOAST_SEVERITY.warn, 
        summary: TOAST_SUMMARY.warn 
      });
      return;
    }

    const parsedFechaNacimiento = fechaNacimiento.toISOString().split("T")[0];
    const parsedCedula = Number(cedula);
    const parsedTelefono = Number(telefono);
    const empresaId = Number(selectCompany.empresa_id);
    const rolId = Number(selectRol.rol_id);

    try {
      const user = await createUser({
        nombres,
        apellidos,
        correo,
        fechaNacimiento: parsedFechaNacimiento,
        cedula: parsedCedula,
        direccion,
        telefono: parsedTelefono,
        contraseña,
        empresaId,
        rolId,
        adminId: 1,
      });

      if (user) {
        showToast({ 
          detail: "Usuario creado correctamente",
          severity: TOAST_SEVERITY.success,
          summary: TOAST_SUMMARY.success
        });
        setVisible(false);

        setTimeout(() => {
          triggerUsersRefresh();
        }, 100);
      } else {
        showToast({ 
          detail: "Error al crear el usuario",
          severity: TOAST_SEVERITY.error,
          summary: TOAST_SUMMARY.error
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
        label="Agregar Usuario"
        icon="pi pi-check"
        className="primary-button"
        onClick={() => {
          handleCreateUser();
        }}
        autoFocus
      />
    </div>
  );

  return (
    <div className="card flex justify-content-center">
      <Toast ref={toast} />
      <Dialog
        header="Agregar Nuevo Usuario"
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
          <label className="label-form" htmlFor="nombres">
            Nombres
            <InputText
              id="nombres"
              type="text"
              placeholder="Nombres"
              required
              value={nombres}
              onChange={(e) => setNombres(e.target.value)}
            />
          </label>

          <label className="label-form" htmlFor="apellidos">
            Apellidos
            <InputText
              id="apellidos"
              type="text"
              placeholder="Apellidos"
              required
              value={apellidos}
              onChange={(e) => setApellidos(e.target.value)}
            />
          </label>

          <label className="label-form" htmlFor="correo">
            Correo electronico
            <InputText
              id="correo"
              type="email"
              keyfilter="email"
              placeholder="Correo electronico"
              required
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />
          </label>

          <label className="label-form" htmlFor="fecha-nacimiento">
            Fecha de Nacimiento
            <Calendar
              id="fecha-nacimiento"
              placeholder="Fecha de Nacimiento"
              dateFormat="yy-mm-dd"
              required
              value={fechaNacimiento}
              onChange={(e) => setFechaNacimiento(e.target.value)}
              locale="es"
              showIcon
              showButtonBar
            />
          </label>

          <label className="label-form" htmlFor="cedula">
            Cedula
            <InputText
              id="cedula"
              type="number"
              keyfilter="pnum"
              placeholder="Cedula"
              required
              value={cedula}
              onChange={(e) => setCedula(e.target.value)}
            />
          </label>

          <label className="label-form" htmlFor="direccion">
            Direccion
            <InputText
              id="direccion"
              type="text"
              placeholder="Direccion"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
            />
          </label>

          <label className="label-form" htmlFor="telefono">
            Telefono
            <InputText
              id="telefono"
              type="number"
              keyfilter="pnum"
              placeholder="Telefono"
              required
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />
          </label>

          <label className="label-form" htmlFor="contraseña">
            Contraseña
            <InputText
              id="contraseña"
              type="password"
              placeholder="Contraseña"
              required
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
            />
          </label>

          <Dropdown
            id="empresa"
            value={selectCompany}
            onChange={(e) => setSelectCompany(e.value)}
            options={companies}
            optionLabel="nombre_empresa"
            placeholder="Seleccione una empresa"
            required
          />

          <Dropdown
            id="rol"
            value={selectRol}
            onChange={(e) => setSelectRol(e.value)}
            options={roles}
            optionLabel="rol_name"
            placeholder="Seleccione un rol"
            required
          />
        </form>
      </Dialog>
    </div>
  );
}

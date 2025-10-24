import { useState, useRef, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";

import { createCompany } from "../api/companies.js";
import { getUsersAdmins } from "../api/usersAdmins.js";
import { TOAST_SEVERITY, TOAST_SUMMARY } from "../constants/toast-config.js";
import { useDataContext } from "../../../../contexts/DataContext.jsx";

export function AddCompany({ visible, setVisible }) {
  const toast = useRef(null);
  const { triggerCompaniesRefresh } = useDataContext();

  const [usersAdmins, setUsersAdmins] = useState([]);

  const [companyName, setCompanyName] = useState("");
  const [userAdminId, setUserAdminId] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const usersAdminsData = await getUsersAdmins();

      setUsersAdmins(usersAdminsData);
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

  const handleCreateCompany = async (e) => {
    if (!companyName || !userAdminId.user_id) {
      showToast({
        detail: "Porfavor llena todos los campos",
        severity: TOAST_SEVERITY.warn,
        summary: TOAST_SUMMARY.warn,
      });
      return;
    }

    const parsedUserAdmindId = Number(userAdminId.user_id);

    try {
      const company = await createCompany({
        companyName,
        userAdminId: parsedUserAdmindId,
      });

      if (company) {
        showToast({
          detail: "Empresa creada correctamente",
          severity: TOAST_SEVERITY.success,
          summary: TOAST_SUMMARY.success,
        });
        setVisible(false);

        setTimeout(() => {
          triggerCompaniesRefresh();
        }, 100);
      } else {
        showToast({
          detail: "Error al crear la empresa",
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
        label="Agregar Empresa"
        icon="pi pi-check"
        className="primary-button"
        onClick={() => {
          handleCreateCompany();
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
          <label className="label-form" htmlFor="nombre-empresa">
            Nombre de la Empresa
            <InputText
              id="nombre-empresa"
              type="text"
              placeholder="Nombre de la Empresa"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </label>

          <label className="label-form" htmlFor="admin-empresa">
            Administrador de la Empresa
            <Dropdown
              id="admin-empresa"
              value={userAdminId}
              onChange={(e) => setUserAdminId(e.value)}
              options={usersAdmins}
              optionLabel={(option) => `${option.nombres} ${option.apellidos}`}
              placeholder="Seleccione el administrador de la empresa"
              required
            />
          </label>
        </form>
      </Dialog>
    </div>
  );
}

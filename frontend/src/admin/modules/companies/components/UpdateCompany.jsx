import { useState, useRef, useEffect } from "react";

import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { getUsersAdmins } from "../api/usersAdmins.js";
import { useDataContext } from "../../../../contexts/DataContext.jsx";
import { Dropdown } from "primereact/dropdown";

export function UpdateCompany({ visible, setVisible, company }) {
  const toast = useRef(null);
  const { triggerCompaniesRefresh } = useDataContext();
  const [usersAdmins, setUsersAdmins] = useState([]);

  const [companyId, setCompanyId] = useState({
    companyId: company.empresa_id,
  });
  const [companyData, setcompanyData] = useState({
    companyName: "",
    userAdminId: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersAdminsData = await getUsersAdmins();

        setUsersAdmins(
          usersAdminsData.map((userAdmin) => ({
            label: `${userAdmin.nombres} ${userAdmin.apellidos}`,
            value: userAdmin.user_id,
          }))
        );
      } catch (error) {
        console.error("Error fetching users admins:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (company) {
      setcompanyData({
        companyName: company.nombre_empresa,
        userAdminId: Number(company.admin_id),
      });

      setCompanyId(company.empresa_id);
    }
  }, [company]);

  const handleChange = (e, field) => {
    const value = e.target ? e.target.value : e.value;

    setcompanyData((prevData) => ({
      ...prevData,
      [field]: field === "userAdminId" ? Number(value) : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const token = document.cookie.split("=")[1];
      const response = await fetch(
        `https://localhost:5000/companies/${companyId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token
          },
          body: JSON.stringify(companyData),
        }
      );

      if (!response.ok) {
        throw new Error("Error en la solicitud");
      }

      const data = await response.text();
      toast.current.show({
        severity: "success",
        summary: "Felicitaciones",
        detail: "Empresa actualizada correctamente",
        life: 3000,
      });

      setVisible(false);
      setTimeout(() => {
        triggerCompaniesRefresh();
      }, 100);
    } catch (error) {
      console.error("Error al actualizar los datos de la empresa:", error);

      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error al actualizar los datos de la empresa",
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
        header={`Actualizar datos de la empresa ${company.nombre_empresa}`}
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
          <label className="label-form" htmlFor="nombre-empresa">
            Nombre de la empresa
            <InputText
              id="nombre-empresa"
              type="text"
              placeholder="Nombre de la empresa"
              required
              value={companyData.companyName}
              onChange={(e) => handleChange(e, "companyName")}
            />
          </label>

          <label className="label-form" htmlFor="admin-empresa">
            Administrador de la empresa
            <Dropdown
              id="admin-empresa"
              value={companyData.userAdminId}
              onChange={(e) => handleChange(e, "userAdminId")}
              options={usersAdmins}
              placeholder="Seleccione el administrador de la empresa"
              required
            />
          </label>
        </form>
      </Dialog>
    </>
  );
}

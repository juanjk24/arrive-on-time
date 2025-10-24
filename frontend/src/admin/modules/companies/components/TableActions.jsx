import React, { useRef, useState } from "react";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";

import { UpdateCompany } from "./UpdateCompany.jsx";
import { useDataContext } from "../../../../contexts/DataContext.jsx";

export function TableActions({ company }) {
  const toast = useRef(null);
  const { triggerCompaniesRefresh } = useDataContext();
  const [visible, setVisible] = useState(false);
  const [updateVisible, setUpdateVisible] = useState(false);

  const deleteCompanyDialog = () => {
    setVisible(true);
  };

  const reject = () => {
    setVisible(false);
  };

  const accept = async (id) => {
    try {
      const token = document.cookie.split("=")[1];
      const response = await fetch(`https://localhost:5000/companies/${id}`, {
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
      triggerCompaniesRefresh();
    } catch (error) {
      console.error("Error al eliminar la empresa:", error);

      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error al eliminar la empresa",
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
        header="Eliminar Empresa"
        message={`¿Deseas eliminar la empresa ${company.nombre_empresa}?`}
        icon="pi pi-exclamation-triangle"
        acceptClassName="p-button-danger"
        rejectClassName="p-button-secondary p-button-text"
        accept={() => {
          accept(company.empresa_id);
        }}
        reject={reject}
        acceptLabel="Eliminar"
        rejectLabel="Cancelar"
      />

      <Button
        icon="pi pi-pencil"
        size="small"
        className="secondary-button"
        tooltip="Editar Empresa"
        tooltipOptions={{ position: "bottom" }}
        style={{ marginRight: ".5em" }}
        onClick={() => setUpdateVisible(true)}
      />
      <Button
        icon="pi pi-trash"
        size="small"
        className="danger-button"
        tooltip="Eliminar Empresa"
        tooltipOptions={{ position: "bottom" }}
        onClick={deleteCompanyDialog}
      />

      <UpdateCompany
        visible={updateVisible}
        setVisible={setUpdateVisible}
        company={company}
      />
    </div>
  );
}

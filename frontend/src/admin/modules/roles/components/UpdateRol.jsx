import { useState, useRef, useEffect } from "react";

import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { useDataContext } from "../../../../contexts/DataContext.jsx";

export function UpdateRol({ visible, setVisible, rol }) {
  const toast = useRef(null);
  const { triggerRolesRefresh } = useDataContext();
  const [rolId, setRolId] = useState({
    rolId: rol.rol_id,
  });
  const [rolData, setRolData] = useState({
    rolName: "",
  });

  useEffect(() => {
    if (rol) {
      setRolData({
        rolName: rol.rol_name,
      });

      setRolId(rol.rol_id);
    }
  }, [rol]);

  const handleChange = (e, field) => {
    const value = e.target ? e.target.value : e.value;
  
    setRolData((prevData) => ({
      ...prevData,
      [field]: field === "adminId" ? Number(value) : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const token = document.cookie.split("=")[1];
      const response = await fetch(`https://localhost:5000/roles/${rolId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
        body: JSON.stringify(rolData),
      });

      if (!response.ok) {
        throw new Error("Error en la solicitud");
      }

      const data = await response.text();
      toast.current.show({
        severity: "success",
        summary: "Felicitaciones",
        detail: "Rol actualizada correctamente",
        life: 3000,
      });

      setVisible(false);
      setTimeout(() => {
        triggerRolesRefresh();
      }, 100);
    } catch (error) {
      console.error("Error al actualizar los datos del rol:", error);

      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error al actualizar los datos del rol",
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
        header={`Actualizar datos del rol: ${rol.rol_name}`}
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
          <label className="label-form" htmlFor="nombre-rol">
            Nombre del Rol
            <InputText
              id="nombre-rol"
              type="text"
              placeholder="Nombre del rol"
              required
              value={rolData.rolName}
              onChange={(e) => handleChange(e, "rolName")}
            />
          </label>
        </form>
      </Dialog>
    </>
  );
}

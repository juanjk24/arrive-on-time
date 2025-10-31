import "./styles/header.css";
import { useState, useRef } from "react";

import { Link, useLocation } from "react-router-dom";
import { Tooltip } from "primereact/tooltip";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { Toast } from "primereact/toast";
import { useDataContext } from "../../contexts/DataContext.jsx";
import { useTheme } from "../../contexts/ThemeContext.jsx";

export function Header({ user }) {
  const location = useLocation();
  const { triggerUserProfileRefresh } = useDataContext();
  const { isDarkMode, toggleTheme } = useTheme();
  const [visibleRight, setVisibleRight] = useState(false);
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);

  const token = document.cookie.split("=")[1];
  const items = [
    { label: "Tus Asistencias", path: "/user" },
    {
      label: "Descargar Tus Asistencias",
      path: `https://localhost:5000/resources/your-attendances?token=${token}`,
    },
  ];

  let userImg = ""

  if (user.user_img_profile_path) {
    userImg = `https://localhost:5000/users/${user.user_id}/image`;
  }else {
    userImg = "/user.svg";
  }

  // funcion para subir la imagen de perfil
  const onUpload = () => {
    toast.current.show({
      severity: "info",
      summary: "Success",
      detail: "Imagen subida correctamente",
    });
    triggerUserProfileRefresh();
  };

  // En caso de error al subir la imagen
  const onError = (e) => {
    const { message } = JSON.parse(e.xhr.response);

    setLoading(false);

    toast.current.show({
      severity: "error",
      summary: "Error",
      detail: message,
    });
  };

  const handleLogout = async () => {
    const response = await fetch("https://localhost:5000/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (response.ok) {
      window.location.href = "/";
    }
  };

  return (
    <>
      <header className="header">
        <div className="logo">
          <Link to="/user">
            <img src="/logo.svg" alt="" />
            <h1>Arrive On Time</h1>
          </Link>
        </div>

        <div className="aside-header">
          <nav className="nav">
            <ul className="nav-list">
              {items.map((item, index) => (
                <li
                  key={index}
                  className={location.pathname === item.path ? "active" : ""}
                >
                  <Link to={item.path}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <Tooltip target=".user" position="bottom" />
          <Button
            onClick={() => setVisibleRight(true)}
            className="user"
            data-pr-tooltip="Ver Perfil"
          >
            <img className="user-img" src={userImg}  />
          </Button>
        </div>
      </header>

      <Sidebar
        visible={visibleRight}
        position="right"
        onHide={() => setVisibleRight(false)}
      >
        <h2 style={{ margin: "0 0 20px 0" }}>Perfil de Usuario</h2>
        <header className="aside-header-profile">
          <img
            style={{
              width: "68px",
              height: "68px",
              borderRadius: "50%",
              border: "1px solid #000",
            }}
            src={userImg}
          />

          <div>
            <h2>{`${user.nombres} ${user.apellidos}`}</h2>

            <p style={{ marginBlock: "1px" }}>{user.cedula}</p>
          </div>
        </header>

        <h2 style={{ margin: "12px 0 2px 0" }}>{user.nombre_empresa}</h2>
        <p style={{ margin: "0" }}>{user.rol_name}</p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "200px",
            gap: "10px",
          }}
        >
          <Toast ref={toast} />

          {loading && (
            <span style={{ color: "#000", fontSize: "12px" }}>
              Subiendo imagen...
            </span>
          )}

          <FileUpload
            className="file-upload"
            url={`https://localhost:5000/users/image-profile-db/${user.user_id}?token=${token}`}
            name="user_img_profile"
            mode="basic"
            accept=".jpg,.jpeg,.png"
            chooseLabel="Cambiar Foto de Perfil"
            maxFileSize={1000000}
            onUpload={onUpload}
            onError={onError}
            onBeforeUpload={() => setLoading(true)}
          />

          <Button
            style={{ width: "100%" }}
            className="secondary-button"
            label={isDarkMode ? "Modo Claro" : "Modo Oscuro"}
            icon={isDarkMode ? "pi pi-sun" : "pi pi-moon"}
            onClick={toggleTheme}
          />

          <Button
            style={{ width: "100%" }}
            className="danger-button"
            label="Cerrar Sesión"
            icon="pi pi-sign-out"
            onClick={handleLogout}
          />
        </div>
      </Sidebar>
    </>
  );
}

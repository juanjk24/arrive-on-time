import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primeicons/primeicons.css";

import { Login } from "./login/index.jsx";
import { Employees } from "./admin/modules/employees/index.jsx";
import { Dashboard } from "./admin/modules/dashboard/index.jsx";
// import { Reports } from "./admin/modules/reports/index.jsx";
import { Attendance } from "./admin/modules/attendances/index.jsx";
import { Companies } from "./admin/modules/companies/index.jsx";
import { Roles } from "./admin/modules/roles/index.jsx";
import { AttendancesType } from "./admin/modules/attendances-type/index.jsx";
import { YourAttendances } from "./user/modules/your-attendances/index.jsx";
import { YourAttendancesAdmin } from "./admin/modules/your-attendances/index.jsx";

function App() {
  const ProtectedRoute = ({ children, allowedRoles }) => {
    const [isAllowed, setIsAllowed] = useState(null);
    const token = document.cookie.split("=")[1];
  
    useEffect(() => {
      const start = Date.now();
  
      if (!token || token === "null") {
        setIsAllowed(false);
        return;
      }

      fetch("https://localhost:5000/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
      })
        .then((response) => {
          if (response.status === 200) return response.json();
          throw new Error("No autorizado");
        })
        .then((data) => {
          const elapsed = Date.now() - start;
          const remaining = 1000 - elapsed;
  
          setTimeout(() => {
            if (allowedRoles && !allowedRoles.includes(data.rolId)) {
              setIsAllowed(false);
            } else {
              setIsAllowed(true);
            }
          }, remaining > 0 ? remaining : 0);
        })
        .catch(() => {
          const elapsed = Date.now() - start;
          const remaining = 1000 - elapsed;
  
          setTimeout(() => {
            setIsAllowed(false);
          }, remaining > 0 ? remaining : 0);
        });
    }, [token, allowedRoles]);
  
    if (isAllowed === null) {
      return (
        <div className="loader-container">
        <div className="loader"></div>
        <p className="text-sesion">Iniciando Sesión</p>
        </div>
      );
    }
  
    return isAllowed ? children : <Navigate to="/" replace />;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={[1]}>
              <Routes>
                <Route path="" element={<Dashboard />} />
                <Route path="users" element={<Employees />} />
                {/* <Route path="reports" element={<Reports />} /> */}
                <Route path="attendances" element={<Attendance />} />
                <Route
                  path="your-attendances"
                  element={<YourAttendancesAdmin />}
                />
                <Route path="companies" element={<Companies />} />
                <Route path="roles" element={<Roles />} />
                <Route path="attendances-type" element={<AttendancesType />} />
              </Routes>
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/*"
          element={
            <ProtectedRoute
              allowedRoles={[
                2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
                20,
              ]}
            >
              <Routes>
                <Route path="" element={<YourAttendances />} />
              </Routes>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

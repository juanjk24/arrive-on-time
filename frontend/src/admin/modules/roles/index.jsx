import { useEffect, useState } from "react";
import { Header } from "../../includes/Header.jsx";
import { TableRoles } from "./components/TableRoles.jsx";

import { getRoles } from "./api/roles.js";
import "./styles/employees.css";
import { useDataContext } from "../../../contexts/DataContext.jsx";

export function Roles() {
  const { refreshRoles } = useDataContext();
  const [roles, setRoles] = useState([])

  useEffect(() => {
    getRoles().then((data) => {
      setRoles(data)
    })
  },[refreshRoles])

  return (
    <>
      <Header />
      { roles && <TableRoles roles={roles}/>}
    </>
  );
}

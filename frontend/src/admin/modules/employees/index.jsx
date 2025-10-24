import { useEffect, useState } from "react";
import { Header } from "../../includes/Header.jsx";
import { TableUsers } from "./components/TableUsers.jsx";

import { getUsers } from "./api/users.js";
import './styles/employees.css'
import { useDataContext } from "../../../contexts/DataContext.jsx";

export function Employees() {
  const { refreshUsers } = useDataContext();
  const [users, setUsers] = useState([])
  const [change, setChange] = useState(false)

  useEffect(() => {
    getUsers().then((data) => {
      setUsers(data)
    })
  },[change, refreshUsers])

  return (
    <>
      <Header />
      { users && <TableUsers users={users} setChange={setChange} />}
    </>
  );
}

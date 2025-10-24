import { useEffect, useState } from "react";
import { Header } from "../../includes/Header.jsx";
import { TableAttendances } from "./components/TableAttendances.jsx";

import { getAttendances } from "./api/attendances.js";
import "./styles/attendances.css";
import { useDataContext } from "../../../contexts/DataContext.jsx";

export function Attendance() {
  const { refreshAttendances } = useDataContext();
  const [attendances, setAttendances] = useState([])

  useEffect(() => {
    getAttendances().then((data) => {
      setAttendances(data)
    })
  },[refreshAttendances])

  return (
    <>
      <Header />
      { attendances && <TableAttendances attendances={attendances}/>}
    </>
  );
}

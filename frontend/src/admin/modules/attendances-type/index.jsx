import { useEffect, useState } from "react";
import { Header } from "../../includes/Header.jsx";
import { TableAttendencesType } from "./components/TableAttendencesType.jsx";

import { getAttendancesType } from "./api/attendances-type.js";
import "./styles/employees.css";
import { useDataContext } from "../../../contexts/DataContext.jsx";

export function AttendancesType() {
  const { refreshAttendanceTypes } = useDataContext();
  const [attendancesType, setAttendancesType] = useState([])

  useEffect(() => {
    getAttendancesType().then((data) => {
      setAttendancesType(data)
    })
  },[refreshAttendanceTypes])

  return (
    <>
      <Header />
      { attendancesType && <TableAttendencesType attendancesType={attendancesType}/>}
    </>
  );
}

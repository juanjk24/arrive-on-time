import { useEffect, useState } from "react";
import { Header } from "../../includes/Header.jsx";
import { TableCompanies } from "./components/TableCompanies.jsx";

import { getCompanies } from "./api/companies.js";
import "./styles/employees.css";
import { useDataContext } from "../../../contexts/DataContext.jsx";

export function Companies() {
  const { refreshCompanies } = useDataContext();
  const [companies, setCompanies] = useState([])

  useEffect(() => {
    getCompanies().then((data) => {
      setCompanies(data)
    })
  },[refreshCompanies])

  return (
    <>
      <Header />
      { companies && <TableCompanies companies={companies}/>}
    </>
  );
}

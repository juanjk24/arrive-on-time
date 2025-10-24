import "./styles/attendances.css";
import { useEffect, useState } from "react";
import { Header } from "../../includes/Header.jsx";
import { TableAttendances } from "./components/TableAttendances.jsx";

import { getYourAttendances } from "./api/your-attendances.js";
import { getUserById, auth } from "./api/user.js";
import { useDataContext } from "../../../contexts/DataContext.jsx";

export function YourAttendances() {
  const token = document.cookie.split("=")[1];
  const { refreshUserProfile } = useDataContext();

  const [attendances, setAttendances] = useState([]);
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const dataUser = await auth(token);

      getYourAttendances({ userId: dataUser.userId }).then((data) => {
        setAttendances(data);
      });

      getUserById({ userId: dataUser.userId }).then((data) => {
        setUserData(data[0]);
      });
    };
    fetchData();
  }, [refreshUserProfile]);

  return (
    <>
      <Header user={userData} />
      {attendances && (
        <TableAttendances attendances={attendances} user={userData} />
      )}
    </>
  );
}

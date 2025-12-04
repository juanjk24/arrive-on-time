import "../styles/query-form.css"
import { useState, useRef, useEffect } from "react";

import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

import { getUsers } from "../api/users.js"
import { getUserAttendances } from "../api/attendances.js"
import { TOAST_SEVERITY, TOAST_SUMMARY } from "../constants/toastConfig.js";
import { AttendancesTable } from "./AttendancesTable.jsx";

export function QueryForm() {
    const toast = useRef(null);

    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [attendances, setAttendances] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Cargar usuarios al montar el componente
        getUsers().then((data) => {
            setUsers(data);
        }).catch((error) => {
            showToast({
                detail: "Error al cargar los usuarios",
                severity: TOAST_SEVERITY.error,
                summary: TOAST_SUMMARY.error
            });
        });
    }, []);

    const showToast = ({ detail, severity, summary }) => {
        toast.current.show({
            severity,
            summary,
            detail,
            life: 3000,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedUser) {
            showToast({
                detail: "Por favor selecciona un usuario",
                severity: TOAST_SEVERITY.warn,
                summary: TOAST_SUMMARY.warn
            });
            return;
        }

        try {
            setLoading(true);
            const res = await getUserAttendances({ userId: selectedUser.user_id });
            
            setAttendances(res);
            
            if (res.length === 0) {
                showToast({
                    detail: "No se encontraron asistencias para este usuario",
                    severity: TOAST_SEVERITY.info,
                    summary: "Sin resultados"
                });
            }
        } catch (error) {
            showToast({
                detail: "Error al buscar las asistencias",
                severity: TOAST_SEVERITY.error,
                summary: TOAST_SUMMARY.error
            });
            setAttendances([]);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Toast ref={toast} />
            <form id="query-form" onSubmit={handleSubmit}>
                <Dropdown
                    id="user-select"
                    value={selectedUser}
                    options={users}
                    optionLabel="nombres"
                    filter
                    filterBy="nombres,email"
                    onChange={(e) => setSelectedUser(e.value)}
                    placeholder="Selecciona un usuario"
                    className="w-full"
                    itemTemplate={(option) => (
                        <div>
                            <div>{option.nombres}</div>
                            <small style={{ color: '#666' }}>{option.email}</small>
                        </div>
                    )}
                    valueTemplate={(option) => (
                        option ? <div>{option.nombres}</div> : "Selecciona un usuario"
                    )}
                />

                <Button
                    type="submit"
                    label="Buscar Asistencias"
                    icon="pi pi-search"
                    className="primary-button"
                    loading={loading}
                />
            </form>

            {attendances.length > 0 && (
                <AttendancesTable 
                    attendances={attendances} 
                    userName={selectedUser?.nombres}
                />
            )}
        </>
    )
}
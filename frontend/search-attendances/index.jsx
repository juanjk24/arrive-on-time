import "./styles/main.css"

import { Header } from "../../includes/Header.jsx";
import { QueryForm } from "./components/QueryForm.jsx";

export function SearchAttendances() {
    return (
        <>
            <Header />

            <section className="queries">
                <main className="queries-main">
                    <h1>Realizar Consultas de Asistencias</h1>
                    <p>Esta sección te permite buscar las asistencias de tus usuarios.</p>

                    <QueryForm />
                </main>
            </section>
        </>
    )
}
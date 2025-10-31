export function generateEmailTemplate(name, date, time, attendanceType) {
    return `
        <html>
            <body>
                <h1>Asistencia Registrada</h1>
                <p>Hola ${name},</p>
                <p>Tu asistencia ha sido registrada con éxito.</p>
                <p>Detalles:</p>
                <ul>
                    <li>Fecha: ${date}</li>
                    <li>Hora: ${time}</li>
                    <li>Tipo de Asistencia: ${attendanceType}</li>
                </ul>
            </body>
        </html>
    `;
}

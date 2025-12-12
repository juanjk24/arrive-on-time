const token = document.cookie.split("=")[1];

export async function getUserAttendances({ userId }) {
    if (!userId) {
        throw new Error("No hay un usuario seleccionado");
    }

    const response = await fetch(`https://localhost:5000/attendances/user/${userId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
        },
    });

    if (!response.ok) {
        throw new Error("Error al obtener las asistencias");
    }

    const data = await response.json();
    return data;
}

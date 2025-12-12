const token = document.cookie.split("=")[1];

export async function getUsers() {
    const response = await fetch("https://localhost:5000/users", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
        },
    });

    if (!response.ok) {
        throw new Error("Error al obtener usuarios");
    }

    const data = await response.json();
    return data;
}

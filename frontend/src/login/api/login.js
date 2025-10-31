export async function login({ cedula, contraseña }) {
  try {
        const response = await fetch("https://localhost:5000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        cedula,
        contraseña,
      }),
    });

    if (!response.ok) {
      const { error } = await response.json();
      return [error, null];
    }

    const data = await response.json();
    return [null, data];
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}
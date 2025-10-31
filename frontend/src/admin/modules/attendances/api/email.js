const token = document.cookie.split("=")[1];

export async function sendEmail ({ date, time, userId, attendanceTypeId }) {
    try {
        const response = await fetch('https://localhost:5000/email/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "x-access-token": token
            },
            body: JSON.stringify({ date, time, userId, attendanceTypeId })
        });

        if (!response.ok) {
            throw new Error('Error al enviar el correo');
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

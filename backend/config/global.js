import dotenv from "dotenv";

dotenv.config();

export const {
    DB_HOST, 
    DB_USER,
    DB_PASSWORD, 
    DB_DATABASE,
    PORT = 5000,
    NODE_ENV = 'development',
    FRONTEND_URL = "https://localhost:5173",
    SECRET_JWT_KEY,
    CLOUD_NAME,
    API_KEY,
    API_SECRET,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL,
    RESEND_API_KEY
} = process.env
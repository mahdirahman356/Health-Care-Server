import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
    node_env: process.env.NODE_ENV,
    port: process.env.PORT,
    database_url: process.env.DATABASE_URL,
    bcrypt: {
        salt_round: process.env.BCRYPT_SALT_ROUND
    },
    cloudinary: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    },
    jwt: {
        access_secret: process.env.JWT_ACCESS_SECRET,
        access_expires: process.env.JWT_ACCESS_EXPIRES,
        refresh_secret: process.env.JWT_REFRESH_SECRET,
        refresh_expires: process.env.JWT_REFRESH_EXPIRES,
        reset_token_secret: process.env.RESET_TOKEN_SECRET,
        reset_token_expires: process.env.RESET_TOKEN_EXPIRES,
    },
    emailSender: {
        email: process.env.SMTP_USER,
        app_pass: process.env.SMTP_PASS,

    },
    open_router_Api_key: process.env.OPENROUTER_API_KEY,
    stripe_secret_key: process.env.STRIPE_SECRET_KEY,
    reset_pass_link: process.env.RESET_PASS_LINK,

}
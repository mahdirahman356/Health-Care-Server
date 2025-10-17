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
        refresh_expires: process.env.JWT_REFRESH_EXPIRES
    },
    open_router_Api_key: process.env.OPENROUTER_API_KEY,

}
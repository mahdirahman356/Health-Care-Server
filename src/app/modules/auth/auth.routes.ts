import express, { NextFunction, Request, Response } from 'express'
import { AuthController } from './auth.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';


const router = express.Router();

router.post(
    "/login",
    AuthController.login
)

router.get(
    "/me",
    AuthController.getMe
)

router.post(
    '/refresh-token',
    AuthController.refreshToken
)

router.post(
    '/change-password',
    auth(
        UserRole.ADMIN,
        UserRole.DOCTOR,
        UserRole.PATIENT
    ),
    AuthController.changePassword
);

router.post(
    '/forgot-password',
    AuthController.forgotPassword
);

router.post(
    '/reset-password',
    (req: Request, res: Response, next: NextFunction) => {

        if (!req.headers.authorization && req.cookies.accessToken) {
            console.log(req.headers.authorization, "from reset password route guard");
            console.log(req.cookies.accessToken, "from reset password route guard");
            auth(
                UserRole.ADMIN,
                UserRole.DOCTOR,
                UserRole.PATIENT
            )(req, res, next);
        } else {
            next();
        }
    },
    AuthController.resetPassword
)


export const authRoutes = router;
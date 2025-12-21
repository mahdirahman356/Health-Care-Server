import express from "express";
import { AppointmentController } from "./appointment.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { AppointmentValidation } from "./appointment.validation";
import { paymentLimiter } from "../../middlewares/rateLimiter";

const router = express.Router();

router.post(
    "/",
    auth(UserRole.PATIENT),
    AppointmentController.createAppointment
)

router.get(
    '/',
    auth(UserRole.ADMIN),
    AppointmentController.getAllFromDB
);

router.get(
    "/my-appointments",
    auth(UserRole.PATIENT, UserRole.DOCTOR),
    AppointmentController.getMyAppointment
)

router.patch(
    "/status/:id",
    auth(UserRole.ADMIN, UserRole.DOCTOR),
    AppointmentController.updateAppointmentStatus
)

router.post(
    '/pay-later',
    auth(UserRole.PATIENT),
    validateRequest(AppointmentValidation.createAppointment),
    AppointmentController.createAppointmentWithPayLater
);

router.post(
    '/:id/initiate-payment',
    auth(UserRole.PATIENT),
    paymentLimiter,
    AppointmentController.initiatePayment
);


export const appointmentRoutes = router;
import express from "express";
import { AppointmentController } from "./appointment.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { paymentLimiter } from "../../middlewares/rateLimiter";
import validateRequest from "../../middlewares/validateRequest";
import { AppointmentValidation } from "./appointment.validation";

const router = express.Router();

router.post(
    "/",
    auth(UserRole.PATIENT),
    paymentLimiter,
    validateRequest(AppointmentValidation.createAppointment),
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

router.post('/pay-later',
    auth(UserRole.PATIENT),
    AppointmentController.createAppointmentWithPayLater);


router.post(
    '/:id/initiate-payment',
    auth(UserRole.PATIENT),
    paymentLimiter,
    AppointmentController.initiatePayment
);

router.patch(
    "/status/:id",
    auth(UserRole.ADMIN, UserRole.DOCTOR),
    AppointmentController.updateAppointmentStatus
)


export const appointmentRoutes = router;
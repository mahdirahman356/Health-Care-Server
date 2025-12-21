import express from "express";
import { ScheduleController } from "./schedule.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post(
    "/",
    auth(UserRole.ADMIN),
    ScheduleController.insertIntoDB
)

router.get(
    "/",
    auth(UserRole.DOCTOR, UserRole.ADMIN),
    ScheduleController.getAllFromDB
)

router.get(
    '/:id',
    auth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
    ScheduleController.getByIdFromDB
);


router.delete(
    "/:id",
    auth(UserRole.ADMIN),
    ScheduleController.deleteFromDB
)

export const scheduleRoutes = router;
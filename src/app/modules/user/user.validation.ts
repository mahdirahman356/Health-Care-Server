import { Gender } from "@prisma/client";
import z from "zod";

const createPatientValidationSchema = z.object({
    password: z.string().nonempty("Password is required"),
    patient: z.object({
        name: z.string().nonempty("Name is required"),
        email: z.string().nonempty("Email is required"),
        address: z.string().optional()
    })
});

const createAdminValidationSchema = z.object({
    password: z.string().nonempty("Password is required"),
    admin: z.object({
        name: z.string().nonempty("Name is required"),
        email: z.string().nonempty("Email is required"),
        contactNumber: z.string().nonempty("Contact Number is required"),
    })
});

const createDoctorValidationSchema = z.object({
    password: z.string().nonempty("Password is required"),
    doctor: z.object({
        name: z.string().nonempty("Name is required"),
        email: z.string().nonempty("Email is required"),
        contactNumber: z.string().nonempty("Contact Number is required"),
        address: z.string().optional(),
        registrationNumber: z.string().nonempty("Registratio Number is required"),
        experience: z.number().optional(),
        gender: z.enum([Gender.MALE, Gender.FEMALE]),
        appointmentFee: z.number().min(1, "Appointment Fee must be at least 1"),
        qualification: z.string().nonempty("Qualification is required"),
        currentWorkingPlace: z.string().nonempty("Contact Number is required"),
        designation: z.string().nonempty("Designation is required"),
    })
});

export const UserValidation = {
    createPatientValidationSchema,
    createAdminValidationSchema,
    createDoctorValidationSchema
}
import z from "zod";

const createDoctiorScheduleValidationSchema = z.object({
    body: z.object({
        scheduleId: z.array(z.string())
    })
})

export const DoctorScheduleValidation = {
    createDoctiorScheduleValidationSchema
}
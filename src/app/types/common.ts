import { UserRole } from "@prisma/client"

export type IJWTPayload = {
    email: string
    role: UserRole
}

export type IPaginationOptions = {
    page?: number;
    limit?: number;
    sortBy?: string | undefined;
    sortOrder?: string | undefined;
}
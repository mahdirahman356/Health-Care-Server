import { Doctor, Prisma, UserStatus } from "@prisma/client";
import { IOptions, paginationHelper } from "../../helper/paginationHelper";
import { doctorSearchableFields } from "./doctor.constant";
import { prisma } from "../../shared/prisma";
import { IDoctorFilterRequest, IDoctorUpdateInput } from "./doctor.interface";
import httpStatus from "http-status"
import ApiError from "../../errors/ApiError";
import { openai } from "../../helper/openRouter";
import { extractJsonFromMessage } from "../../helper/extractJsonFromMessage";
import { IPaginationOptions } from "../../types/common";


const getAllFromDB = async (
    filters: IDoctorFilterRequest,
    options: IPaginationOptions
) => {
    const { limit, page, skip } = paginationHelper.calculatePagination(options);
    const { searchTerm, specialties, ...filterData } = filters;

    const andConditions: Prisma.DoctorWhereInput[] = [];

    if (searchTerm) {
        andConditions.push({
            OR: doctorSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }

    // doctor > doctorSpecialties > specialties -> title
    // Handle multiple specialties: ?specialties=Cardiology&specialties=Neurology
    if (specialties && specialties.length > 0) {
        // Convert to array if single string
        const specialtiesArray = Array.isArray(specialties) ? specialties : [specialties];

        andConditions.push({
            doctorSpecialties: {
                some: {
                    specialities: {
                        title: {
                            in: specialtiesArray,
                            mode: "insensitive",
                        },
                    },
                },
            },
        });
    }

    if (Object.keys(filterData).length > 0) {
        const filterConditions = Object.keys(filterData).map((key) => ({
            [key]: {
                equals: (filterData as any)[key],
            },
        }));
        andConditions.push(...filterConditions);
    }

    andConditions.push({
        isDeleted: false,
    });

    const whereConditions: Prisma.DoctorWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.doctor.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy:
            options.sortBy && options.sortOrder
                ? { [options.sortBy]: options.sortOrder }
                : { averageRating: "desc" },
        include: {
            doctorSpecialties: {
                include: {
                    specialities: {
                        select: {
                            title: true,
                        }
                    },
                },
            },
            doctorSchedules: {
                include: {
                    schedule: true
                }
            },
            review: {
                select: {
                    rating: true,
                },
            },
        },
    });

    // console.log(result[0].doctorSpecialties);

    const total = await prisma.doctor.count({
        where: whereConditions,
    });

    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
};

const getAISuggestions = async (payload: { symptoms: string }) => {
    if (!(payload && payload.symptoms)) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Symptom is required")
    }

    const doctors = await prisma.doctor.findMany({
        where: {
            isDeleted: false
        },
        include: {
            doctorSpecialties: {
                include: {
                    specialities: true
                }
            }
        }
    })

    console.log("doctors data loaded.......\n");
    const prompt = `
        You are a medical assistant AI. Based on the patient's symptoms, suggest the top 3 most suitable doctors.
        Each doctor has specialties and years of experience.
        Only suggest doctors who are relevant to the given symptoms.

        Symptoms: ${payload.symptoms}

        Here is the doctor list (in JSON):
        ${JSON.stringify(doctors, null, 2)}

        Return your response in JSON format with full individual doctor data. `;

    console.log("analyzing......\n")
    const completion = await openai.chat.completions.create({
        model: 'z-ai/glm-4.5-air:free',
        messages: [
            {
                role: "system",
                content: "You are a helpful AI medical assistant that provides doctor suggestions.",
            },
            {
                role: 'user',
                content: prompt,
            },
        ],
    });

    console.log(completion.choices[0].message);

    const result = await extractJsonFromMessage(completion.choices[0].message)
    return result

}

const getDoctorById = async (id: string): Promise<Doctor | null> => {
    const result = await prisma.doctor.findUnique({
        where: {
            id,
            isDeleted: false,
        },
        include: {
            doctorSpecialties: {
                include: {
                    specialities: true,
                },
            },
            doctorSchedules: {
                include: {
                    schedule: true
                }
            },
            review: true
        },
    });
    return result;
};

const updateIntoDB = async (id: string, payload: Partial<IDoctorUpdateInput>) => {

    const doctorInfo = await prisma.doctor.findFirstOrThrow({
        where: {
            id: id
        }
    })

    const { specialties, ...doctorData } = payload

    return await prisma.$transaction(async (tnx) => {
        if (specialties && specialties.length > 0) {
            const deleteSpecialtyIds = specialties.filter((specialty) => specialty.isDeleted)

            for (const specialties of deleteSpecialtyIds) {
                await tnx.doctorSpecialties.deleteMany({
                    where: {
                        doctorId: id,
                        specialitiesId: specialties.specialtyId
                    }
                })
            }

            const createSpecialtyIds = specialties.filter((specialty) => !specialty.isDeleted)

            for (const specialties of createSpecialtyIds) {
                await tnx.doctorSpecialties.createMany({
                    data: {
                        doctorId: id,
                        specialitiesId: specialties.specialtyId
                    }
                })
            }
        }

        const updatedData = await tnx.doctor.update({
            where: {
                id: doctorInfo.id
            },
            data: doctorData,
            include: {
                doctorSpecialties: {
                    include: {
                        specialities: true
                    }
                }
            }
        })

        return updatedData
    })
}

const deleteFromDB = async (id: string): Promise<Doctor> => {
    return await prisma.$transaction(async (transactionClient) => {
        const deleteDoctor = await transactionClient.doctor.delete({
            where: {
                id,
            },
        });

        await transactionClient.user.delete({
            where: {
                email: deleteDoctor.email,
            },
        });

        return deleteDoctor;
    });
};

const softDelete = async (id: string): Promise<Doctor> => {
    return await prisma.$transaction(async (transactionClient) => {
        const deleteDoctor = await transactionClient.doctor.update({
            where: { id },
            data: {
                isDeleted: true,
            },
        });

        await transactionClient.user.update({
            where: {
                email: deleteDoctor.email,
            },
            data: {
                status: UserStatus.DELETED,
            },
        });

        return deleteDoctor;
    });
};

export const DoctorService = {
    getAllFromDB,
    getAISuggestions,
    getDoctorById,
    updateIntoDB,
    deleteFromDB,
    softDelete
}
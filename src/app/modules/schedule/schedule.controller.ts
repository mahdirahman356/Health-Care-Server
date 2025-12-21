import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { ScheduleService } from "./schedule.service";
import pick from "../../helper/pick";
import { IJWTPayload } from "../../types/common";


const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
    const result = await ScheduleService.insertIntoDB(req.body);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Schedule created successfully!",
        data: result
    })
});


const getAllFromDB = catchAsync(async (req: Request & {user?: IJWTPayload}, res: Response) => {

    const filters = pick(req.query, ["startDateTime", "endDateTime"])
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"])
     
    const user = req.user

    const result = await ScheduleService.getAllFromDB(user as IJWTPayload, filters, options);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Schedule fetched successfully!",
        meta: result.meta,
        data: result.data
    })
})

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await ScheduleService.getByIdFromDB(id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Schedule retrieval successfully',
        data: result,
    });
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
    const result = await ScheduleService.deleteFromDB(req.params.id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Schedule deleted successfully!",
        data: result
    })
})




export const ScheduleController = {
    insertIntoDB,
    getAllFromDB,
    getByIdFromDB,
    deleteFromDB
}
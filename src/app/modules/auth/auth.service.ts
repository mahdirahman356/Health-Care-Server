import bcrypt from "bcryptjs";
import { prisma } from "../../shared/prisma";
import { UserStatus } from "@prisma/client";
import jwt from "jsonwebtoken"
import { jwtHelper } from "../../helper/jwtHelper";
import config from "../../../config";

const login = async (payload: {email: string, password: string}) => {
   
    const user = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: UserStatus.ACTIVE
        }
    })
    
    const isCorrectPassword = await bcrypt.compare(payload.password, user.password);
    if(!isCorrectPassword){
        throw new Error("Password is incorrect!")
    }

    const accessToken = jwtHelper.generateToken({email: user.email, role: user.role}, config.jwt.access_secret as string, config.jwt.access_expires as string)
    const refreshToken  = jwtHelper.generateToken({email: user.email, role: user.role}, config.jwt.refresh_secret as string, config.jwt.refresh_expires as string)

    return {
        accessToken,
        refreshToken,
        needneedPasswordChange: user.needPasswordChange
    }
}

export const AuthService = {
    login
}
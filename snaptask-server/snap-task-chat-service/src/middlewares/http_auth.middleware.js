import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";

export const verifyHttpJwt = (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            console.log("token is not avaliable so !token condition is getting true....")
            throw new ApiError(401, "Unauthorized request")
        }
        const seceretKey = Buffer.from(process.env.JWT_SECERET, "base64")
        const decodedToken = jwt.verify(token, seceretKey, {
            algorithms: ['HS256']
        });
        if (!decodedToken.id) {
            throw new ApiError(401, "Invalid token payload");
        }

        req.user = {
            id: decodedToken.id
        }

        next();

    } catch (e) {
        console.log("some error occured at http middleware-->", e);
        throw new ApiError(401, e?.message || "Invalid access token")
    }


}
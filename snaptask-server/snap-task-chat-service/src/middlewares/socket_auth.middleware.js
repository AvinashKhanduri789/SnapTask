import jwt from "jsonwebtoken";
export const verifySocketJwt = (socket, next) => {
    try {
        const token = socket.handshake.auth?.token;
        console.log("requst comes to socket middleware-----------")
        if (!token) {
            console.log("tryingn to connect with socket but token not found in requst")
            return next("Unauthorized request");
        }

        const seceretKey = Buffer.from(process.env.JWT_SECERET, "base64")
        const decodedToken = jwt.verify(token, seceretKey, {
            algorithms: ['HS256']
        });
        console.log("jwt token decoded successfully-->", decodedToken);

        socket.user = {
            id: decodedToken.id,
            userName: decodedToken.userName
        }

        next();

    } catch (e) {
        console.log("error occured durig jwt validation--->", e);
        return next(e?.message || "Invalid access token");
    }

}
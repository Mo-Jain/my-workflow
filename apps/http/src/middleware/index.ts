
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "../config";
import { NextFunction, Request, Response } from "express";

export const middleware = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers["authorization"];
    const token = header?.split(" ")[1];
    
    if (!token) {
        res.status(403).json({message: "Unauthorized"})
        return
    }

    try {
        const decoded = jwt.verify(token, JWT_PASSWORD) as {  userId: string, name :string }
        
        req.userId = decoded.userId
        // Error: Property 'name' does not exist on type 'Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>'.
        req.name = decoded.name
        next()
    } catch(e) {
        res.status(403).json({message: "Unauthorized"})
        return
    }
}
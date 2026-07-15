import jwt from 'jsonwebtoken';
import { prisma } from "../config/database.js"
//import { User } from '../models/user.model.js';

export const authMiddleware = async (req, res, next) =>{
    //console.log("Auth middleware has been reached");
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        token = req.headers.authorization.split(" ")[1];

    } /*else if(req.cookies && req.cookies.jwt){
        token = req.cookies.jwt;
    }*/
    if(!token){
        return res.status(401).json({ error: "Not authorized, no token provided" });

    }
    
    try{
        //verify token is valid and get user id
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await prisma.user.findUnique({
            where: {id: decoded.id}
        });
        if(!user){
            res.status(401).json({error: "User no longer exists"});
        }
        req.user = user
        next();
    } catch (error){
        return res.status(401).json({error: "not authorized"});
    }
}
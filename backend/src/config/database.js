import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";


dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});
const adapter = new PrismaPg(pool);



const prisma = new PrismaClient({
    adapter,
    log:
        process.env.NODE_ENV === "development"
            ? ["query", "error", "warn"]
            : ["error"],
});

const connectDB = async () =>{
    try{
        await prisma.$connect()
        console.log("Successful in connecting to Database via Prisma");

    }catch(error){
        console.error(`Database connection failed: ${error.message}`);
        process.exit(1);
    }
};


const disconnectDB = async () =>{
    await prisma.$disconnect();
}

export { prisma, connectDB, disconnectDB};
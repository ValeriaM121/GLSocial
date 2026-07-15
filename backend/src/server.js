import dotenv from "dotenv";
import app from "./app.js";
import { config } from "dotenv";
import { connectDB, disconnectDB } from "./config/database.js"


/*dotenv.config({
    path: './.env'
});*/
config();
connectDB();

app.listen(process.env.PORT, () =>{
    console.log(`Server is running on PORT ${process.env.PORT}`);
});

process.on("unhandledRejection", (error)=>{
    console.log( "Unhandled Rejection: ", error);
    server.close(async () => {
        await disconnectDB();
        process.exit(1); 
    });
});

process.on("uncaughtException", (error)=>{
    console.log( "Unhandled Exception: ", error);
    disconnnectDB();
    process.exit(1);
});

process.on("SIGTERM", async () =>{
    console.log("SIGTERM recieved, shutting down");
    server.close(async () => {
        await disconnectDB();
        process.exit(0);
    });
});

/*
    This file serves as the way to run the server. It should run the server and check on connections.
    If there's a failed connection to database shut server down. If there's 
*/

import "dotenv/config";
import app from "./app.js";
import dotenv from "dotenv";


app.get("/hello", (req,res)=>{
    res.json({message: "Hello World"});
})


app.listen(process.env.PORT, "0.0.0.0", () =>{
    console.log(`Server is running on PORT ${process.env.PORT}`);
});
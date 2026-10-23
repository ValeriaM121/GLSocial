/*
    This files serves to bring the connection to the frontend and routes together to
    work on the server.js.
*/
import express from "express"
//import cors from "cors"
//import routes


const app = express();

//following is for frontend connection
/*app.use(cors({
    origin: ["*"],
    credentials: true
}))


//The following is for using json and urlencoded so stuff that's in the url
app.use(express.json());
app.use(express.urlencoded({extended:true}));*/

//Declare routes like app.use("pathName", routeVariable)



export default app;
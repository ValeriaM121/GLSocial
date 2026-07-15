import express from "express"
//import cors from "cors"
//import routes
import userRoutes from "./routes/user.route.js"
import userInfoRoutes from "./routes/userInfo.route.js"
//import userRoutesExample from "./routes/userInfo.route.js"

const app = express();

/*Add this when starting to connect to frontend
app.use(cors({
    origin: ["http://192.0.0.2:8081", "http://10.170.87.158:8081"], // Add Expo dev URLs
    credentials: true, // Allow cookies
}))*/

app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Declare routes
//app.use("/userID", userRoutesExample);
app.use("/auth", userRoutes);
app.use("/userInfo", userInfoRoutes);

export default app;
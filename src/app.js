// this page is for the express app and all the middlewares and routes will be added here and then we will export the app to the server.js file where we will start the server
const express = require("express");
const authrouter=require("./routes/auth.routes");
const accountrouter=require("./routes/account.routes");
const cookies=require("cookie-parser");
const transcationRouter=require("./routes/transcation.routes");

const app = express();
app.use(express.json());
app.use(cookies());

//api name is /api/auth/register
app.use("/api/auth", authrouter);
//api/account/create is the endpoint for creating a new account, and it is protected by the authMiddleware to ensure that only authenticated users can access it.
app.use("/api/account", accountrouter);
//route name is /api/transcation/bank and it is protected by the authMiddleware to ensure that only authenticated users can access it.
app.use("/api/transcation", transcationRouter);




module.exports = app;

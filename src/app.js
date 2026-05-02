// this page is for the express app and all the middlewares and routes will be added here and then we will export the app to the server.js file where we will start the server
const express = require("express");
const authrouter=require("./routes/auth.routes");
const cookies=require("cookie-parser");

const app = express();
app.use(cookies());



app.use(express.json());
//api name is /api/auth/register
app.use("/api/auth", authrouter);





module.exports = app;

// this page is for the express app and all the middlewares and routes will be added here and then we will export the app to the server.js file where we will start the server
const express = require("express");
const authrouter=require("./routes/auth.routes");
const accountrouter=require("./routes/account.routes");
const cookies=require("cookie-parser");
const transcationRouter=require("./routes/transcation.routes");
const transaction=requre("./routes/transcation.js")


const app = express();
app.use(cookies());
app.use("/api/transcation", transcationRouter);




app.use(express.json());
//api name is /api/auth/register
app.use("/api/auth", authrouter);
//api/account/create is the endpoint for creating a new account, and it is protected by the authMiddleware to ensure that only authenticated users can access it.
app.use("/api/account", accountrouter);
//route name is /api/transcation/bank and it is protected by the authMiddleware to ensure that only authenticated users can access it.
app.use("/api/transcation", require("./routes/transcation.routes"));
//app.use("/api/transcation", transaction);
app.use("/api/send",require("./routes/transaction.js") );




module.exports = app;

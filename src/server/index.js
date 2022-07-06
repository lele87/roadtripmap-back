const express = require("express");
const morgan = require("morgan");
const locationRouter = require("../routers/locationRouter");
const userRouter = require("../routers/userRouter");

const app = express();

app.use(morgan("dev"));
app.use(express.json());

app.use("/user", userRouter);
app.use("/locations", locationRouter);

module.exports = app;

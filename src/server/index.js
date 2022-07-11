const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const locationRouter = require("../routers/locationRouter");
const userRouter = require("../routers/userRouter");
const { notFoundError, generalError } = require("./middlewares/errors");
const corsOptions = require("../utils/corsOptions");

const app = express();

app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json());

app.use("/user", userRouter);
app.use("/locations", locationRouter);

app.use(notFoundError);
app.use(generalError);

module.exports = app;

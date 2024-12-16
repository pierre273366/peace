require("dotenv").config();
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var tricountRouter = require("./routes/tricount");
var eventRouter = require("./routes/event");
<<<<<<< HEAD
var sondageRouter = require("./routes/sondage");
=======
var productRouter = require("./routes/product");
var todoRouter = require("./routes/todo");
>>>>>>> 2fce387c3f51b0a448b15d2948bbe122c86f06c2

var app = express();
const cors = require("cors");
app.use(cors());
require("./models/connection");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/tricount", tricountRouter);
app.use("/event", eventRouter);
<<<<<<< HEAD
app.use("/sondage", sondageRouter);
=======
app.use("/todo", todoRouter);
app.use("/product", productRouter);
>>>>>>> 2fce387c3f51b0a448b15d2948bbe122c86f06c2

module.exports = app;

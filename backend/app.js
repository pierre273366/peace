var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var tricountRouter = require("./routes/tricount");
var eventRouter = require("./routes/event");
const cors = require("cors");
var fileUpload = require("express-fileupload");
var productRouter = require("./routes/product");
var todoRouter = require("./routes/todo");
var sondageRouter = require("./routes/sondage");
require("dotenv").config();
require("./models/connection");

var app = express();

app.use(cors()); // <-- Déplace cette ligne ici, après l'initialisation de `app`
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(fileUpload());

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/tricount", tricountRouter);
app.use("/event", eventRouter);
app.use("/sondage", sondageRouter);
app.use("/todo", todoRouter);
app.use("/product", productRouter);

module.exports = app;

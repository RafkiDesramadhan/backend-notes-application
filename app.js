const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const session = require("express-session");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const dotenv = require("dotenv");
const cors = require("cors");

// mongoose
const mongoose = require("mongoose");
try {
  mongoose.connect(
    "mongodb+srv://rafki23:rahasia@cluster0.vxyi1.mongodb.net/notes_app?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
  console.log("mongodb connected!");
} catch (error) {
  console.log("mongodb unconnected!");
}

const app = express();
app.use(
  cors({
    credentials: true,
    origin: "https://majestic-platypus-5b41a0.netlify.app",
  })
);
dotenv.config();
const adminRouter = require("./routes/index");
const startRouter = require("./routes/indexStart");
const apiRouter = require("./routes/api");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(cookieParser());
app.set("trust proxy", 1);
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      maxAge: 60000,
    },
  })
);
app.use(flash());
app.use(methodOverride("_method"));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// sb-admin-2
app.use(
  "/sb-admin-2",
  express.static(path.join(__dirname, "node_modules/startbootstrap-sb-admin-2"))
);

app.use("/", startRouter);
app.use("/admin", adminRouter);
app.use("/api/v1", apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

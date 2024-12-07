var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require('cors');



//
var indexRouter = require("./routes/index");
var indexLandlord = require("./routes/LandlordIndex")
var api = require("./routes/api");
const database = require("./config/db");
var app = express();

// view engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // to parse URL-encoded bodies
app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('public/uploads'));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/api/assets', express.static(path.join(__dirname, 'assets')));
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));
app.use('/landlord/assets', express.static(path.join(__dirname, 'assets')));
app.use('/landlord/api/assets', express.static(path.join(__dirname, 'assets')));

app.use(cors({
  origin: 'http://localhost:3000', // Đảm bảo cho phép frontend gửi yêu cầu
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'] // Cho phép header Authorization
}));

// app.get("/", (req, res) => {
//   res.redirect("/rentify/login");  // Chuyển hướng tới /rentify/login
// });

// connect
app.use("/api", api);
app.use("/", indexRouter);
app.use("/landlord", indexLandlord)
database.connect();

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // Log the error for debugging purposes
  console.error(err.stack);

  // Respond with JSON for API requests
  if (req.originalUrl.startsWith("/api")) {
    return res.status(err.status || 500).json({
      status: err.status || 500,
      message: err.message || "Internal Server Error",
      error: err.stack, // You can adjust what you want to send back as the error information
    });
  }

  // render the error page
  res.status(err.status || 500);
  res.render('error.hbs');
});

// Lắng nghe server
// const port = process.env.PORT || 3001;  // Dùng port do Render cấp hoặc port mặc định là 3000
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

module.exports = app;

//imports
const express = require("express");
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const rate_limit = require("express-rate-limit");
require("dotenv").config();
require('express-async-errors');
const AuthMiddleware = require("./middleware/auth");
const connectDB = require("./database/connect");
const userRoute = require("./routes/user");
const facilityRoute = require("./routes/facility");
const eventRoute = require("./routes/event");
const blogRoute = require("./routes/blog");
const vlogRoute = require("./routes/vlog");
const hotlineRoute = require("./routes/hotline");
const supportGroupRoute = require("./routes/supportGroup");

//application
const app = express();
const port = process.env.PORT || 8000;

//middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(xss());
app.use(
  rate_limit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-7",
    legacyHeaders: false,
  })
);

//routes
app.get("/", (req, res) => {
  res.status(200).json({ healthCheck: "ok" });
});
app.use("/api/v1/users", AuthMiddleware, userRoute);
app.use("/api/v1/facilities", AuthMiddleware, facilityRoute);
app.use("/api/v1/events", AuthMiddleware, eventRoute);
app.use("/api/v1/blogs", AuthMiddleware, blogRoute);
app.use("/api/v1/vlogs", AuthMiddleware, vlogRoute);
app.use("/api/v1/hotlines", AuthMiddleware, hotlineRoute);
app.use("/api/v1/support-groups", AuthMiddleware, supportGroupRoute);

//start server
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => console.log(`listening on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();

const express = require("express");
const app = express();
require("dotenv").config();
const cookieParser = require("cookie-parser");
const connectDB = require("./db/connectDB.js");
const usersRoute = require("./routes/usersRoute.js");
const errorHandler = require("./middleware/errorHandler.js");
const PORT = process.env.PORT || 5200;
const cors = require("cors");
const path = require("path");
const passport = require("passport");

app.use(
  cors({
    origin: [`http://localhost:${PORT}`, "http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
require("./utils/passportJWT.js");
require("./utils/passportGoogle.js");
connectDB();
app.use("/api/users", usersRoute);
app.get("/api/", (req, res) =>
  res.send(`<a href='/api/users/google'>Authenticate with Google</a>`)
);
app.use(errorHandler);

const __dirname1 = path.resolve();

if (process.env.NODE_ENV == "production") {
  app.use(express.static(path.join(__dirname1, "/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "build", "index.html"));
  });
}

const io = require("socket.io")(3000, {
  pingTimeout: 60000,
  cors: {
    origin: ["http://localhost:5173"],
  },
});

io.on("connection", (socket) => {});

const server = app.listen(PORT, () =>
  console.log(`Server is running on port ${PORT}`)
);

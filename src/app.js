import expres from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import handlebars from "express-handlebars";
import cookieParser from "cookie-parser";
import sessionRouter from "./routes/session.router.js";
import viewsRouter from "./routes/views.router.js";
import __dirname from "./utils.js";
import path from "path";
import { connect } from "mongoose";

//IMPORTANTE cambiar esto por tu URL de mongo, este archivo no lo subi al repo
import { mongourl } from "../config.js";

const app = expres();
const PORT = 8080;

app.use(expres.urlencoded({ extended: true }));

app.use(cookieParser("myParser"));

const connectDb = async () => {
  try {
    await connect(mongourl);
    console.log("Base de datos conectada");
  } catch (err) {
    console.log(err);
  }
};

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: mongourl,
      ttl: 30,
    }),
    secret: "coderhouse",
    resave: false,
    saveUninitialized: true,
  })
);

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname + "/views"));

app.use("/api/session", sessionRouter);
app.use("/", viewsRouter);

connectDb();
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));

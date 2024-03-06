import express from "express";
import userModel from "../model/user.model.js";
import { createHash, isValidPassword } from "../utils.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;

    const exists = await userModel.findOne({ email });
    if (exists)
      return res.status(401).send({
        status: "error",
        error: "El usuario con el mail ingresado ya existe",
      });

    const user = await userModel.create({
      first_name,
      last_name,
      email,
      age,
      password: createHash(password),
    });

    res.redirect("/login");
  } catch (error) {
    res.status(500).send(`Error de registro. ${error}`);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);

    const user = await userModel.findOne(
      { email },
      { email: 1, first_name: 1, last_name: 1, age: 1, password: 1 }
    );
    console.log("user =", user);
    if (!user) {
      return res
        .status(401)
        .send({ status: "error", error: "Usuario incorrecto" });
    }

    if (!isValidPassword(user, password)) {
      return res
        .status(401)
        .send({ status: "error", error: "Contraseña incorrecta" });
    }

    delete user.password;

    req.session.user = user;

    res.redirect("/profile");
  } catch (error) {
    res.status(500).send(`Error de login. ${error}`);
  }
});

router.post("/restaurar", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);

    const user = await userModel.findOne({ email });
    console.log("user =", user);
    if (!user) {
      return res
        .status(401)
        .send({ status: "error", error: "Usuario incorrecto" });
    }
    user.password = createHash(password);
    await userModel.updateOne({ email }, { password: user.password });
    res.redirect("/login");
  } catch (error) {
    res.status(500).send(`Error de login. ${error}`);
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.send({ status: "error", error: err });
  });
  res.redirect("/login");
});

export default router;

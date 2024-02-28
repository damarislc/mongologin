import express from "express";
import userModel from "../model/user.model.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;

    const user = await userModel.create({
      first_name,
      last_name,
      email,
      age,
      password,
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

    const user = await userModel.findOne({ email, password });
    console.log("user =", user);
    if (!user) {
      return res
        .status(401)
        .send({ status: "error", error: "Usuario o contrasenia incorreco" });
    }

    req.session.user = {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      age: user.age,
    };

    res.redirect("/profile");
  } catch (error) {
    res.status(500).send(`Error de login. ${error}`);
  }
});

export default router;

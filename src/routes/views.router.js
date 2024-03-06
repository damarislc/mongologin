import express from "express";

const router = express.Router();

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/restaurar", (req, res) => {
  res.render("restaurar");
});

router.get("/profile", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  const { first_name, last_name, email, age } = req.session.user;
  res.render("profile", { first_name, last_name, email, age });
});

export default router;

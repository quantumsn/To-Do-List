const express = require("express");
const app = express();
const path = require("path");
const session = require("express-session");
const { v4: uuidv4 } = require("uuid");
const methodOverride = require("method-override");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "/public")));
app.use(methodOverride("_method"));

const sesssionOpts = {
  secret: "hellobokachodarbara",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};
app.use(session(sesssionOpts));

app.listen(3000, () => {
  console.log("Server listening to port 3000");
});

app.get("/", (req, res) => {
  let data = req.session.list;
  res.render("index.ejs", { data });
});

app.post("/", (req, res) => {
  let { data } = req.body;
  console.log(data);
  if (req.session.list) {
    req.session.list.push({ data: data, id: uuidv4() });
  } else {
    req.session.list = [{ data: data, id: uuidv4() }];
  }
  res.redirect("/");
});

app.delete("/:id", (req, res) => {
  let { id } = req.params;
  req.session.list = req.session.list.filter((d) => d.id != id);
  res.redirect("/");
});

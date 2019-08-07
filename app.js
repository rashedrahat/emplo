var express = require("express");
var app = express();
var path = require("path");
var exphbs = require("express-handlebars");
var employeesController = require("./controllers/employees");
var PORT = process.env.PORT || 2019;
app.listen(PORT, () => console.log(`Server started at ${PORT}..`));

app.set("views", path.join(__dirname, "/views/"));
app.engine(
  "hbs",
  exphbs({
    extname: "hbs",
    defaultLayout: "main",
    layoutsDir: __dirname + "/views/layouts/"
  })
);
app.set("view engine", "hbs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/employees", employeesController);

app.get("/", (req, res) => res.redirect("/employees"));

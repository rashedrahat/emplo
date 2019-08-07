var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
require("../models/db");
var Employee = mongoose.model("Employee");

router.get("/", (req, res) => {
  Employee.find((err, result) => {
    if (!err) {
      res.render("employees/list", {
        list: result
      });
    } else {
      console.log("Error in retrieving employee list :" + err);
    }
  });
});

router.get("/create", (req, res) =>
  res.render("employees/add", { title: "Create an Employee" })
);

router.post("/create", (req, res) => insertRecord(req, res));

router.get("/edit/:id", (req, res) => {
  Employee.findById(req.params.id, (err, result) => {
    if (!err) {
      res.render("employees/edit", {
        title: "Update Employee",
        employee: result
      });
    }
  });
});

router.post("/edit/:id", (req, res) => updateRecord(req, res));

router.get("/delete/:id", (req, res) => {
  Employee.findByIdAndRemove(req.params.id, (err, doc) => {
    if (!err) {
      res.redirect("/employees");
    } else {
      console.log("Error in employee delete :" + err);
    }
  });
});

function insertRecord(req, res) {
  var employee = new Employee();
  employee.name = req.body.name;
  employee.email = req.body.email;
  employee.mobile = req.body.mobile;
  employee.city = req.body.city;

  employee.save((err, result) => {
    if (!err) {
      res.redirect("/employees");
    } else {
      if (err.name == "ValidationError") {
        handleValidationError(err, req.body);
        res.render("employees/add", {
          title: "Create an Employee",
          employee: req.body
        });
      } else console.log("Error during record insertion : " + err);
    }
  });
}

function updateRecord(req, res) {
  Employee.findOneAndUpdate(
    { _id: req.body._id },
    req.body,
    { new: true },
    (err, result) => {
      if (!err) {
        res.redirect("/employees");
      } else {
        if (err.name == "ValidationError") {
          handleValidationError(err, req.body);
          res.render("employees/edit", {
            title: "Update Employee",
            employee: req.body
          });
        } else console.log("Error during record update : " + err);
      }
    }
  );
}

function handleValidationError(err, body) {
  for (field in err.errors) {
    //console.log(errors[field]);
    //console.log(errors[field].path);
    switch (err.errors[field].path) {
      case "name":
        body["nameError"] = err.errors[field].message;
        break;
      case "email":
        body["emailError"] = err.errors[field].message;
        break;
      default:
        break;
    }
  }
}

module.exports = router;

//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
  username:String,
  password:String
});


const User = new mongoose.model("user",userSchema);

app.get("/",(req,res)=>{
  res.render("home");
});

app.get("/login",(req,res)=>{
  res.render("login");
});

app.get("/register",(req,res)=>{
  res.render("register");
});

app.post("/register",(req,res)=>{
  const username =req.body.username;
  const password = md5(req.body.password);

  const user = new User({
    username:username,
    password:password
  });

  user.save((err)=>{
    if(err){
      console.log(err);
    }
    else{
      res.render("secrets");
    }
  });
});

app.post("/login",(req,res)=>{
  const username =req.body.username;
  const password = md5(req.body.password);

  User.findOne({username:username},(err,user)=>{
    if(err){
      console.log(err);
    }
    else{
      if(user){
        if(user.password===password){
          res.render("secrets");
        }
        else{
          console.log("wrong password");
        }
      }
      else{
        console.log("user not found");
      }
    }
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});

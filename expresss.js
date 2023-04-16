// import express from "express";
// const app = express();
// import fs from "fs";
// import path from "path";

// app.get("/about",(req,res)=>{
    // res.json({
    //     success: true,
    //     product: [],
    // });
//   res.sendFile(path.join(__dirname+"/index.html"));
//    res.sendFile("./index.html"); will not work for sending files.
    // const file = fs.readFileSync("./index.html");
    // res.sendFile(file);
    // const pathlocation = path.resolve();//__dirname k jgh pe use krta path.resolve hme current dirctory k locatuon de dega :- "type": "module",
// we can also use __dirname but in package.json we have to use module:commonjs
    // res.sendFile(path.join(pathlocation,"./index.html"));

// })
// app.get("/abot",(req,res)=>{
//     res.json({
//         success: true,
//         name: "abc",
//         description:"okay",
//         kill: "done"
//    })
// })
// Setting up view engine. for using ejs in backend.
// app.set("view engine", "ejs");
// here public is static folder if ejs file require some which not in view floder it will go in static folder.
// app.use(express.static(path.join(path.resolve(),"public")));
// app.get("/cont",(req,res)=>{
//   res.render("index",{ name: "Divyansh" });
//   res.sendFile("index.ejs");
// });
// express static
// console.log((path.join(path.resolve(),"public")));

import express from "express";
import path from "path";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import  jwt  from "jsonwebtoken";
import bcrypt from "bcrypt";
mongoose.connect("mongodb://127.0.0.1:27017",{dbName:"backend",}).then(console.log("Database Connected")).catch((e)=>console.log(e));

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
});
const User = mongoose.model("User",UserSchema);

const app = express();
// using middlewares in express
app.use(express.static(path.join(path.resolve(),"public")));
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.set("view engine", "ejs");
    const isAuthenticated = async (req,res,next) =>{
        const {token} = req.cookies;
        if(token){
          const decoded =  jwt.verify(token,"divyanshsharma")
          req.user = await User.findById(decoded._id);
          next();
        } 
        else{
             res.redirect("/login");
        }
}
app.get("/add",isAuthenticated,async(req,res) => {
    res.render("logout",{name:req.user.name});
});

app.get("/login",(req,res)=>{
    res.render("login");
});

app.get("/register",async(req,res) => {
    res.render("register");
});

app.post("/login",async (req,res)=>{
const  {email,password} = req.body;

let user = await User.findOne({email});

if(!user)  return res.redirect("/register");

const isMatch = await bcrypt.compare(password,user.password);
// if(isMatch) return res.render("/logout");
if(!isMatch) return res.render("login",{email,message:"**Incorrect Password"});

 const token = jwt.sign({_id:user._id},"divyanshsharma");

     res.cookie("token",token,{
        httpOnly:true,
        expires:new Date(Date.now()+600*1000),
     });
     res.redirect("/add");
});

//    user = await User.create({
//     name,
//     email,
// });
// const token = jwt.sign({_id:user._id},"divyanshsharma");
//      res.cookie("token",token,{
//         httpOnly:true,
//         expires:new Date(Date.now()+600*1000),
//      });
//      res.redirect("/add");
// });

app.get("/logout",(req,res)=>{
    res.cookie("token",null,{
        httpOnly: true,
        expires: new Date(Date.now()+60*1000),
    });
    res.redirect("/add");
});

app.post("/register",async(req,res)=>{
const  {name,email,password} = req.body;
 let user = await User.findOne({email});
if(user){
  return res.redirect("/login");
}
// hashing the password that no can decode from the sever..
const hashedPassword = await bcrypt.hash(password,10);

user = await User.create({
    name,
    email,
    password: hashedPassword,
});
  const token = jwt.sign({_id:user._id},"divyanshsharma");
     res.cookie("token",token,{
        httpOnly:true,
        expires:new Date(Date.now()+600*1000),
     });
     res.redirect("/add");
});
app.get("/users",(req,res)=>{
    res.json({
        User,
    })
});
app.listen(5012,()=>{
    console.log("Server is running")
});
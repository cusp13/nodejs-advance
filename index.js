// const http = require("http");
import http from "http";// isko use krne k liye package,json file me "type":"module", add krna pdta hai.
// import gfName from "./features.js";
import fs from "fs";
const home = fs.readFileSync("./index.html",()=>{
    console.log("file read");
})
const divy = "100";
const data = `Hi Everyone how ${divy} are u guyzz..`
fs.writeFile("./index.html",data,(err)=>{
    if(err){
        console.log(err);
    }
    else{
        console.log("file written successfully");
    }
})
import path from "path";
console.log(path.extname("index.js"));
// import {}
import {generateLove} from "./features.js";
// console.log(myObj.gfName2 );
console.log(generateLove());
const server = http.createServer((req,res)=>{

// console.log(req.method);

    if(req.url === "/about"){
        res.end(`<h1>Love is ${generateLove()}</h1>`);
    }
   else if(req.url === "/home"){
    const home = fs.readFile("./index.html",(err,home)=>{
        res.end(home);
    });
        // res.end("<h1>home Page</h1>");
    }
   else if(req.url === "/contact"){
        res.end("<h1>Contact Page</h1>");
    }
    else{
        res.end("page not found");
    }
})
server.listen(5000,()=>{
    console.log("server is working on 5000");
});



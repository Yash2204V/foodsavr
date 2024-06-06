const express = require('express');
const app = express();
const path = require('path');

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname + '/public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/",(req,res)=>{
    res.render("home");
})

app.get("/login",(req,res)=>{
    res.render("user");
})

app.listen(3000,()=>{
    console.log("server running http://localhost:3000/");
})

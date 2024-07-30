const express = require('express');
const app = express();
const path = require('path');

const userModel = require('./models/user.js');
const donatorModel = require('./models/donator.js');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname + '/public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/",(req,res)=>{
    res.render("home");
})

// Donator Module
app.post("/donator", async (req, res) => {
    try {
      const { item_name,type,category,qtypp,email,phone,district,pickup_add } = req.body;
      const donatorData = await new donatorModel({
        item_name,
        type,
        category,
        qtypp,
        email,
        phone,
        district,
        pickup_add,
      });
      await donatorData.save();
      res.redirect('/');
    } catch (error) {
      console.log(error);
    }
});

// User Module
app.get('/signup',(req,res)=>{
    res.render("signup");
})

app.get('/login',(req,res)=>{
    res.render("login");
})

app.post('/create',(req,res)=>{
    const {name,email,phone_no,password} = req.body;
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(password, salt, async function(err, hash) {
            const user = await new userModel({
                name,
                email,
                phone_no,
                password: hash
            })
            user.save();
            const token = jwt.sign({email, id:user._id}, "shhhhhh");
            res.cookie("token",token);
            res.redirect("/login");
        });
    });
})

app.get('/profile',LoggedIn,(req,res)=>{
    res.render("profile");
})

app.post('/login',async (req,res)=>{
    const { email, password } = req.body;
    
    let user = await userModel.findOne({email});

    if(!user) return res.status(500).send("something went wrong"); 
    bcrypt.compare(password, user.password, function(err, result) {
        if(result){
            const token = jwt.sign({email: user.email, id:user._id}, "shhhh");
            res.cookie("token",token);
            res.status(400).redirect("/profile");
        } 
        else{
            res.send('Something went wrong');
        }
    });
})

app.get('/logout',(req,res)=>{
    res.cookie("token","");
    res.redirect('/login');
})



function LoggedIn(req,res,next){
    const token = req.cookies.token;
    if(token){
        next();
    }
    else{
        res.redirect('/login');
    }
}

app.listen(3000,()=>{
    console.log("server running http://localhost:3000/");
})

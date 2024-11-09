require("dotenv").config();
const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3000;

const userModel = require('./models/user.js');
const donatorModel = require('./models/donator.js');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const secretKey = process.env.SECRET_KEY;

app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public'))); 
app.set("view engine", "ejs");
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


// Create User  
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
            const token = jwt.sign({email, id:user._id}, secretKey);
            res.cookie("token",token);
            res.redirect("/login");
        });
    });
})



// Profile Page 
app.get('/profile', LoggedIn, async (req, res) => {
    try {
        const token = req.cookies.token;
        const decoded = jwt.verify(token, secretKey);
        const userData = await userModel.findOne({ email: decoded.email });
        
        // Fetch all donator data without filtering by email
        const donatorData = await donatorModel.find();         
        res.render('profile', { 
            user: userData,
            donations: donatorData 
        });  
    } catch (error) {
        console.error("Error in /profile route:", error);
        res.status(500).send('Server Error');
    }
});

// Login User
app.post('/login',async (req,res)=>{
    const { email, password } = req.body;
    
    let user = await userModel.findOne({email});

    if(!user) return res.status(500).send("something went wrong"); 
    bcrypt.compare(password, user.password, function(err, result) {
        if(result){
            const token = jwt.sign({email: user.email, id:user._id}, secretKey);
            res.cookie("token",token);
            res.status(400).redirect("/profile");
        } 
        else{
            res.send('Something went wrong');
        }
    });
})

// Logout User
app.get('/logout',(req,res)=>{
    res.cookie("token","");
    res.redirect('/');
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

// Received Donations
app.post('/donations/received/:id', async (req, res) => {
    const { id } = req.params;
    await donatorModel.deleteOne({ _id: id });
    res.redirect('/profile');
}); 

app.listen(PORT,()=>{
    console.log(`server running http://localhost:${PORT}/`);
})

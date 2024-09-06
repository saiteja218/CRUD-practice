const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser")
require('dotenv').config()
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')



const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.set("view engine", "ejs") //setting the views

mongoose.connect(process.env.MONGO_URI);//connect to db;

const db = mongoose.connection;//get the connection; 

db.once('open', () => {
    console.log("successfully connected to db");
})

db.on('error', (error) => {
    console.log(error)
})


app.get('/', async (req, res) => {
    const { token } = req.cookies;

    if (token) {
        const tokenData = await jwt.verify(token, process.env.JWT_SECRET_KEY);

        if (tokenData.type == "User") {

            res.render('home')
        }
    }
    else {
        res.redirect('/signin')
    }


})

const userRouter = require('./routes/user.js');

app.get('/signin', (req, res) => {
    res.render('signin')
})

app.get('/signup', (req, res) => {
    res.render('signup')
})

const User = require("./models/userModel.js");


app.post("/signup", async (req, res) => {
    const { name, email, password: plainTextPassword } = req.body;
    const encryptedPassword = await bcrypt.hash(plainTextPassword, 10); f

    try {
        await User.create({
            name, email, password: encryptedPassword
        }).then(() => console.log("new user successfully created"));
        res.redirect('/signin')
    } catch (err) {
        console.log(err);
    }

    // console.log(encryptedPassword,name);
})

app.post("/signin", async (req, res) => {
    const { email, password } = req.body;

    const userObj = await User.findOne({ email });

    if (!userObj) {
        res.status(404).send("<h1> User not found </h1>");

    }
    try {
        if (bcrypt.compare(password, userObj.password)) {
            //creating jwt token
            const token = jwt.sign({
                userId: userObj._id, email: email, type: "User"
            }, process.env.JWT_SECRET_KEY, { expiresIn: '2h' })

            res.cookie('token', token, { maxAge: 2 * 60 * 60 * 1000 });


            res.redirect('/');
        }
    } catch (error) {

    }

})

app.use("/users", userRouter);

app.listen(process.env.PORT, () => console.log(`server listening at port ${process.env.PORT}`));
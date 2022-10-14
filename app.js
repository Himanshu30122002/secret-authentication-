//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyparser = require("body-parser");
const { read } = require("fs");
const mongoose = require("mongoose");
const { stringify } = require("querystring");
const encrypt = require("mongoose-encryption");
const app = express();

app.set('view engine', 'ejs');

console.log(process.env.API_KEY);
app.use(bodyparser.urlencoded({
    extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlparser: true });

//user schema created using mongoose schema class
const userschema = new mongoose.Schema({
    email: String,
    password: String
});


/* // ye solution bhi kaam kar rha hai niche wale ke liye 
userschema.plugin(encrypt, {
    requireAuthenticationCode: false, secret: process.env.SECRET,
    encryptedFields: ["password"]
});
*/
userschema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

const user = new mongoose.model("user", userschema);





app.use(express.static("public"));


app.get("/", function (req, res) {
    res.render("home");
});

app.get("/login", function (req, res) {
    res.render("login");
});

app.get("/register", function (req, res) {
    res.render("register");
})


app.listen(3000, function () {
    console.log("server started on port 3000");
});

app.post("/register", function (req, res) {
    const newuser = new user({
        email: req.body.username,
        password: req.body.password
    });

    newuser.save(function (err) {
        if (err) {
            console.log(err);
        } else {
            res.render("secrets");
        }
    })
});


app.post("/login", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    user.findOne({ email: username }, function (err, founduser) {
        if (err) {
            console.log(err);
        } else {
            if (founduser) {
                if (founduser.password === password) {
                    res.render("secrets");
                }
            }
        }
    });
});
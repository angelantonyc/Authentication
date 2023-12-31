//jshint esversion:6
//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require('mongoose-encryption');

const app = express();

console.log(process.env.API_KEY);
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect(process.env.ATLAS);

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });
const User = new mongoose.model("User", userSchema);
app.get("/", function (req, res) {
    res.render("home");
})
app.get("/login", function (req, res) {
    res.render("login");
})
app.get("/register", function (req, res) {
    res.render("register");
})
app.get("/submit", function (req, res) {
    res.render("submit");
})
app.post("/register", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    const newUser = new User({
        email: username,
        password: password
    });
    (async () => {
        try {
            await newUser.save();
            res.render("secrets");
        } catch (err) {
            console.error(err);
        }

    })();

});
app.post("/login", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    console.log("username:" + username);

    (async () => {
        try {
            const foundUser = await User.findOne({ email: username });
            if (foundUser) {
                if (foundUser.password == password) {
                    console.log("found a match");
                    res.render("secrets");
                } else {
                    console.log("Incorrect password");
                }
            }

        } catch (err) {
            console.error(err);
        }

    })();

});
app.post("/submit", function (req, res) {
    const secret = req.body.secret;
    res.redirect("/secrets");
})



app.listen(3000, function () {
    console.log("Server started on port 3000");
})
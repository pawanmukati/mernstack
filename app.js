const dotenv = require('dotenv');
const express = require('express');
const app = express();
dotenv.config({path:'./config.env'});
require('./db/connection')
const User = require('./model/userSchema')

app.use(express.json())

app.use(require('./router/auth'))
const PORT = process.env.PORT;


app.get("/", (req, res)=> {
  res.send("Hello World");
});
app.get("/about", (req, res)=> {
  res.send("Hello about World");
});
app.get("/contact", (req, res)=> {
  res.send("Hello contact World");
});

app.get("/signin", (req, res)=> {
  res.send("Hello signin World");
});

app.get("/signup", (req, res)=> {
  res.send("Hello signup World");
});

app.listen(PORT);
const express = require('express');
const app = express();
const user = require('./routes/user')
const post = require('./routes/posts')
const cookieparser = require("cookie-parser");
app.use(cookieparser("123456")); //signed cookies


app.get("/setcookies",(req,res)=>{
    res.cookie("greet","namaste");
    res.cookie("origin","India");
    res.send("we want to send cookie");
});

app.get("/getcookies",(req,res)=>{
    console.dir(req.cookies);
    res.send("got the cookies");
});

app.get("/getsignedcookie",(req,res)=>{
    res.cookie("color","red",{signed:true});
    res.send("Done!");
});

app.get("/verify",(req,res)=>{
    res.send(req.signedCookies);
})

app.get("/",(req,res)=>{
    res.send("home");
})
app.use("/user",user);
app.use("/post",post);


app.listen(3500,(req,res)=>{
    console.log("Server is running on 3500");
})


const express = require('express');
const app = express();
const user = require('./routes/user')
const post = require('./routes/posts')
const cookieparser = require("cookie-parser");
const session = require('express-session');
const flash = require("connect-flash");
const path = require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname, "views"));


// app.use(session({  // to clear the depriciation issue,.............
//     secret: "musssession",
//     resave: false,
//     saveUninitialized: true,
// }));

const sessionOptions = {  //session Object...............
    secret: "musssession",
    resave: false,
    saveUninitialized: true,
}
app.use(session(sessionOptions)); //session middleware.........
app.use(flash());
app.use((req,res,next)=>{ //middlewre to use res.locals.................
    res.locals.successMsg = req.flash("Success");
    res.locals.errorMsg = req.flash("error");
   next();
})

app.get("/",(req,res)=>{
    
    if(req.session.count != undefined){
        req.session.count = req.session.count+1;
    }
    else{
        req.session.count = 0;
    }
    res.send(`You sent a request ${req.session.count} times`);
    
});



app.get("/register",(req,res)=>{
    let{name = "anoymous"} = req.query;
    req.session.name = name;
    if(name === "anoymous"){
        req.flash("error","Kuch toh gadbad hai re baba!");
    }
    else{
        req.flash("Success","Hogayal registration!");
    }
    res.redirect("/hello");
});

app.get("/hello",(req,res)=>{
   // res.render(`hello, ${req.session.name}`);
   
   res.render("trail_page.ejs", {name: req.session.name});
});

//app.use(cookieparser("123456")); //signed cookies
// app.get("/setcookies",(req,res)=>{
//     res.cookie("greet","namaste");
//     res.cookie("origin","India");
//     res.send("we want to send cookie");
// });

// app.get("/getcookies",(req,res)=>{
//     console.dir(req.cookies);
//     res.send("got the cookies");
// });

// app.get("/getsignedcookie",(req,res)=>{
//     res.cookie("color","red",{signed:true});
//     res.send("Done!");
// });

// app.get("/verify",(req,res)=>{
//     res.send(req.signedCookies);
// })

// app.get("/",(req,res)=>{
//     res.send("home");
// })
// app.use("/user",user);
// app.use("/post",post);


app.listen(3500,(req,res)=>{
    console.log("Server is running on 3500");
})


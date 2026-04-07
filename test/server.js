const express = require('express');
const app = express();
const user = require('./routes/user')
const post = require('./routes/posts')

app.use("/user",user);
app.use("/post",post);

app.listen(3500,(req,res)=>{
    console.log("Server is running on 3500");
})
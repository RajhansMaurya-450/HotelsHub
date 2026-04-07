const express = require("express")
const router = express.Router()



router.get("/",(req,res)=>{
    res.send("User Home route");
})

router.get("/:id",(req,res)=>{
    res.send("User Home id route");
})

//create user
router.post("/",(req,res)=>{
    res.send("User post Home route");
})

//delete
router.delete("/:id",(req,res)=>{
    res.send("DELETE User route");
})
module.exports = router
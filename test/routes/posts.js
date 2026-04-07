const express = require("express")
const router = express.Router()


router.get("/",(req,res)=>{
    res.send("post Home route");
})

router.get("/:id",(req,res)=>{
    res.send("post Home id route");
})

//create user
router.post("/",(req,res)=>{
    res.send("post post Home route");
})

//delete
router.delete("/:id",(req,res)=>{
    res.send("DELETE post route");
})
module.exports = router
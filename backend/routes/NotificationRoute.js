const router  = require("express").Router();
const UserSchema=require("../models/UserModel");
const NotificationSchema = require("../models/NotificationModel");

const {authenticate}=require("../Helper");

router.get("/GetNotification",authenticate,(req,res)=>{
   NotificationSchema.NotificationModel.find({to:req.id},(err,doc)=>{
       if(err) throw err
       res.json(doc)
   })
    
    // NotificationSchema.NotificationModel.findOne({to:req.userid.id})
})

router.get("/allAmbulanceList",(req,res)=>{
    UserSchema.UserModel.find({role:"Ambulance"},(err,userData)=>{
        if(err) throw err
        userData.map(data=>{
            data.password=undefined;
        })
        res.json(userData)

    })
})

router.post("/averted",authenticate,(req,res)=>{
    console.log(req.body)
    
    NotificationSchema.NotificationModel.updateOne({socketID:req.body.socketID},{$set:{ averted:true }}).then((err,doc)=>{
        if(!err){
            res.sendStatus(200)
        }
       
    })

})


module.exports=router;
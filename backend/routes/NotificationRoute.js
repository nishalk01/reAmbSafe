const router  = require("express").Router();
const UserSchema=require("../models/UserModel");
const NotificationSchema = require("../models/NotificationModel");

const authenticate=(req,res,next)=>{
    const bearerHeader = req.headers['authorization'];
    if(bearerHeader){
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    UserSchema.UserModel.findOne({password:bearerToken},(err,doc)=>{
        if(err){
            res.sendStatus(403)
        }
        req.token = bearerToken;
        req.id=doc._id
        next();

    })
   
  
     }
    else{
        res.sendStatus(403);
    }
 
}
router.get("/GetNotification",authenticate,(req,res)=>{
   NotificationSchema.NotificationModel.find({to:req.id},(err,doc)=>{
       if(err) throw err
       res.json(doc)
   })
    
    // NotificationSchema.NotificationModel.findOne({to:req.userid.id})
})

router.get("/allAmbulanceList",(req,res)=>{
    UserSchema.UserModel.find({},(err,userData)=>{
        if(err) throw err
        userData.map(data=>{
            data.password=undefined;
        })
        res.json(userData)

    })
})


module.exports=router;
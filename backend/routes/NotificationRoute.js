const router  = require("express").Router();
const NotificationSchema = require("../models/NotificationModel");

const authenticate=(req,res,next)=>{
    const bearerHeader = req.headers['authorization'];
    if(bearerHeader){
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
     }
    else{
        res.sendStatus(403);
    }
 
}
router.get("/GetNotification",authenticate,(req,res)=>{
    console.log(req.token)
    res.sendStatus(200)
    // NotificationSchema.NotificationModel.findOne({to:req.userid.id})
})


module.exports=router;
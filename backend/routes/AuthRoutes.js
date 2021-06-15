// application will only have otp authentication 
const router =require("express").Router();
// const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const Helper=require("../Helper");
const UserSchema=require("../models/UserModel");


router.post("/verify-phoneNo",(req,res)=>{
    const to_phone_number=req.body.phoneNumber;
    const fullHash=Helper.createNewOTP(to_phone_number)
    res.json({"hash":fullHash})
   
})

router.post("/verify-otp",(req,res)=>{
    const to_phone_number=req.body.phoneNumber;
    const otp=req.body.otp;
    const hash=req.body.hash;
    const status= Helper.verifyOTP(to_phone_number,hash,otp)
    if(status==true){
        // find or add phonenumber to db 
        UserSchema.UserModel.findOne({phoneNumber:String(to_phone_number)},(err,doc)=>{
            if(!doc){
                // number is not regsitered in db add number 
                //TODO handle errors properly
                UserSchema.UserModel.create({phoneNumber:String(to_phone_number)},(err,doc)=>{
                    if(err) console.error(err) 
                     // create user xmpp room based on username and password on xmpp server 
                     if(doc){
                        res.json(doc)
                     }
                    
                })
            }
            else if(doc){
                // return password
                res.json(doc)
                console.log("User is already registered") 
            }
            else if(err) {
                console.err(err);
                res.status(500).send({message:"database error"})
            }
        })

    }
    else{
        res.status(401).send({message:"otp has expired"})
    }
   
    
})


module.exports=router;
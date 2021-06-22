// application will only have otp authentication 
const router =require("express").Router();
// const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const Helper=require("../Helper");
const UserSchema=require("../models/UserModel");
// const 


router.post("/verify-phoneNo",(req,res)=>{
    const to_phone_number=req.body.phoneNumber;
    const fullHash=Helper.createNewOTP(to_phone_number)
    // TOOD add checking user in here itself for role 
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
                // number is not regsitered in db add number  and check to see if has a role(if not return errorResponse)
                //TODO handle errors properly
                UserSchema.RoleModel.findOne({phoneNumber:String(to_phone_number)},(err,doc)=>{
                    if(doc){
                    // user with this number exists in db
                    UserSchema.UserModel.create({phoneNumber:String(to_phone_number),role:String(doc.role)},(err,doc)=>{
                        if(err) console.error(err) 
                         if(doc){
                            res.json(doc)
                         }
                        
                    })

                    }

                    if(!doc){
                        // a number without role
                        res.sendStatus(403)
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


router.get("/logout",Helper.authenticate,(req,res)=>{
    UserSchema.UserModel.updateOne({_id:req.id},{$set:{available:false,socketid:null}})
    .then((err,doc)=>{
        if(err){
           throw err
        }
        
    })
    .catch(err=>{
        console.log(err)
    })
    res.sendStatus(200);
    

})


module.exports=router;
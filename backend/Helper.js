const otpGenerator = require("otp-generator");
const crypto       = require("crypto");
const key          = "verysecretkey"; // Key for cryptograpy. Keep it secret
const UserSchema=require("./models/UserModel");


 // source : https://blog.anam.co/otp-verification-without-using-a-database/

exports.createNewOTP=function(phone){
    const otp=otpGenerator.generate(6, {alphabets: false, upperCase: false, specialChars: false});    
    const ttl      = 5 * 60 * 1000; 
    const expires  = Date.now() + ttl;
    const data     = `${phone}.${otp}.${expires}`; // phone.otp.expiry_timestamp
    const hash     = crypto.createHmac("sha256",key).update(data).digest("hex"); // creating SHA256 hash of the data
    const fullHash = `${hash}.${expires}`; // Hash.expires, format to send to the user
    // send otp here
    console.log(` sent message:{
        to:${phone},
        from:from me,
        message:The verification OTP is ${otp}
    }`)
    return fullHash;
}


exports.verifyOTP=function(phone,hash,otp){
    let [hashValue,expires] = hash.split(".");
    // Check if expiry time has passed
    let now = Date.now();
    if(now>parseInt(expires)) return false;
    // Calculate new hash with the same key and the same algorithm
    let data  = `${phone}.${otp}.${expires}`;
    let newCalculatedHash = crypto.createHmac("sha256",key).update(data).digest("hex");
    // Match the hashes
    if(newCalculatedHash === hashValue){
        return true;
    } 
    return false;
}


  //  twilio code to send sms
    // client.messages.create({
    //     body:`hi there this is a test message `,
    //     from:String(process.env.TWILIO_PHONE_NO),
    //     to:String(to_phone_number)
    // })
    // .then(message=>{
    //     console.log(message.sid)
    //     console.log(message)
    //     res.send(message)
    // })



  exports.authenticate=  function authenticate(req,res,next){
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


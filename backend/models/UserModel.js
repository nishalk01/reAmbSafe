const mongoose =require("mongoose");
const crypto=require("crypto");



const UserSchema=mongoose.Schema({
    phoneNumber:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
        default:function(){
            return crypto.randomBytes(64).toString('hex')
        }
    },
    available:{
        type:Boolean,
        default:false,
        required:true
    },
    socketid:{
        type:String,
        default:null,
        required:false
    },
    role:{
        type:String,
        required:true
    }
    //TODO also add profile pic  and username 
})

const User=mongoose.model("User",UserSchema);

exports.UserModel=User;






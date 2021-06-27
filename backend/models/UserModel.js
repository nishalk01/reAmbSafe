const mongoose =require("mongoose");
const crypto=require("crypto");

const HospitalSchema=mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    hospitalName:{
        type:String,
        required:true
    },
    hospitalLocation:{
        type:{
          type:String,
          default:"Point"
        },
        coordinates: {type: [Number], default: [0, 0]}
    },
})


const CircleSchema=mongoose.Schema({
    phoneNumber:{
        type:String,
        required:true
    },
    circleName:{
        type:String,
        required:true
    },
    circleLocation:{
        type:{
            type:String,
            default:"Point"
          },
          coordinates: {type: [Number], default: [0, 0]}

    },
    ambuser:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    messageSent:{
        type:Boolean,
        default:false
    }
})



const RoleSchema=mongoose.Schema({
    phoneNumber:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true
    }
})

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
const Hospital=mongoose.model("Hospital",HospitalSchema);
const Role=mongoose.model("Role",RoleSchema);
const Circle=mongoose.model("Circle",CircleSchema);


exports.UserModel=User;
exports.HospitalModel=Hospital;
exports.RoleModel=Role;
exports.CircleModel=Circle;




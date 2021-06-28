const mongoose =require("mongoose");
const crypto=require("crypto");


// for storing Hospital location 
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

// for stroing circle locations
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

})

const SendOnceSchema=mongoose.Schema({
    circleId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Circle"
    },
    ambId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User" 
    },
    messageSent:{
        type:Boolean,
        default:false
    }
})


// for assigning roles for phoneumbers
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


// for storing UserModel
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
const SendOnce=mongoose.model("SendOnce",SendOnceSchema);


exports.UserModel=User;
exports.HospitalModel=Hospital;
exports.RoleModel=Role;
exports.CircleModel=Circle;
exports.SendOnceModel=SendOnce;




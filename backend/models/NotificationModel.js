const mongoose=require("mongoose");


const NotificationSchema=mongoose.Schema({
    to:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    from:{
        type:String,
        required:true 
        // ask user to give their phone number
    },
    when:{
        type:Date,
        default:Date.now

    },
    info:{
        type:String,
        required:false
    } ,
    //src: https://gist.github.com/eastenluis/d4564daf7312c657748fc6a3dc5fceec
    emergency_location:{
        type:{
          type:String,
          default:"Point"
        },
        coordinates: {type: [Number], default: [0, 0]}
        // dont send the notification if theres no location
    },
    averted:{
        type:Boolean,
        required:true,
        default:false
    },
    socketID:{
        type:String,
        required:true,
        default:null
    }

})


const Notification=mongoose.model("Notification",NotificationSchema);
exports.NotificationModel=Notification;


const mongoose=require("mongoose")



const PatientSchema=mongoose.Schema({
    from:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    //   Foreign relation to  User Model
    },
    to:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User"
    },
    contact:{
      type:String,
      required:true
    },
    Pname:{
        type:String,
        required:false
    },
    Severity:{
        type:Number,
        required:true,
        default:1

    },
    Age:{
        type:Number,
        required:true,
    },
    PatientDesc:{
        type:String,
        required:false

    },

    when:{
        type:Date,
        default:Date.now,
        required:true

    }
})


const PatientForm =mongoose.model("PatientForm",PatientSchema);
exports.PatientFormModel=PatientForm;